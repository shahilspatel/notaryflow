import 'server-only';

import { google } from 'googleapis';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * OAuth2 client for Google Calendar integration.
 * 
 * Handles authentication flow and token management for Google API access.
 * Uses environment variables for OAuth configuration.
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/google/oauth/callback`
);

/**
 * Generates Google OAuth authorization URL.
 * 
 * Args:
 *   state: Random string to prevent CSRF attacks
 * 
 * Returns:
 *   string: Authorization URL for user to visit
 * 
 * Purpose:
 *   Initiates OAuth flow by directing user to Google's consent screen
 */
export function getGoogleAuthUrl(state: string) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
    state
  });
}

/**
 * Exchanges OAuth authorization code for access tokens.
 * 
 * Args:
 *   code: Authorization code returned from Google after user consent
 * 
 * Returns:
 *   Promise resolving to tokens object with access_token, refresh_token, etc.
 * 
 * Purpose:
 *   Completes OAuth flow by exchanging code for usable tokens
 */
export async function exchangeCodeForTokens(code: string) {
  try {
    const response = await oauth2Client.getToken(code);
    return response.tokens;
  } catch (error) {
    throw error;
  }
}

/**
 * Refreshes expired Google access tokens with exponential backoff.
 * 
 * Args:
 *   refreshToken: Long-lived refresh token from initial OAuth flow
 * 
 * Returns:
 *   Promise<string | null>: New access token or null if all attempts fail
 * 
 * Purpose:
 *   Maintains API access when access tokens expire (1 hour lifetime)
 * 
 * Edge Cases:
 *   - Network failures trigger retry with backoff: 1s, 2s, 4s, 8s, 16s
 *   - Permanent failures return null to disconnect integration
 *   - All attempts logged for debugging
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const response = await oauth2Client.getAccessToken();
      
      if (response.token) {
        console.log(`Google token refreshed successfully on attempt ${attempt + 1}`);
        return response.token;
      }
      
      throw new Error('No token received from Google');
    } catch (error) {
      console.error(`Google token refresh attempt ${attempt + 1} failed:`, error);
      
      // If this is the last attempt, return null
      if (attempt === maxRetries - 1) {
        console.error('All Google token refresh attempts failed, integration disconnected');
        return null;
      }
      
      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retrying Google token refresh in ${delay}ms...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return null;
}

/**
 * Creates a calendar event in Google Calendar.
 * 
 * Args:
 *   accessToken: Valid OAuth access token for API access
 *   calendarId: Target calendar ID (defaults to 'primary')
 *   summary: Event title displayed in calendar
 *   description: Event description with appointment details
 *   start: ISO string for event start time
 *   end: ISO string for event end time
 *   location: Physical address for the event (optional)
 * 
 * Returns:
 *   Promise resolving to created Google Calendar event object
 * 
 * Purpose:
 *   Syncs NotaryFlow appointments with user's Google Calendar
 * 
 * Assumptions:
 *   - Access token is valid and not expired
 *   - Calendar is accessible to the authenticated user
 *   - Timezone is America/New_York (configurable in future)
 */
export async function createCalendarEvent({
  accessToken,
  calendarId = 'primary',
  summary,
  description,
  start,
  end,
  location
}: {
  accessToken: string;
  calendarId?: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
}) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description,
      start: { dateTime: start, timeZone: 'America/New_York' },
      end: { dateTime: end, timeZone: 'America/New_York' },
      location
    }
  });

  return event.data;
}

/**
 * Checks if Google Calendar integration is properly connected for a user.
 * 
 * Args:
 *   userId: UUID of the user to check
 * 
 * Returns:
 *   Promise<boolean>: True if connected and working, false otherwise
 * 
 * Purpose:
 *   Validates Google Calendar connection status before attempting operations
 *   Used to prompt users to reconnect if tokens become invalid
 */
export async function isGoogleCalendarConnected(userId: string): Promise<boolean> {
  try {
    // Get user's Google tokens
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('google_access_token, google_refresh_token, google_token_expires_at')
      .eq('id', userId)
      .single();

    if (!user?.google_access_token || !user?.google_refresh_token) {
      return false;
    }

    // Check if token needs refresh
    if (user.google_token_expires_at && new Date(user.google_token_expires_at) <= new Date()) {
      // Try to refresh the token
      const newToken = await refreshAccessToken(user.google_refresh_token);
      
      if (!newToken) {
        return false;
      }
      
      // Update the token in database
      await supabaseAdmin
        .from('users')
        .update({
          google_access_token: newToken,
          google_token_expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
        })
        .eq('id', userId);
    }

    return true;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
}

/**
 * Disconnects Google Calendar integration for a user.
 * 
 * Args:
 *   userId: UUID of the user to disconnect
 * 
 * Returns:
 *   Promise<boolean>: True if disconnection was successful
 * 
 * Purpose:
 *   Removes Google tokens when user disconnects or when tokens become permanently invalid
 */
export async function disconnectGoogleCalendar(userId: string): Promise<boolean> {
  try {
    await supabaseAdmin
      .from('users')
      .update({
        google_access_token: null,
        google_refresh_token: null,
        google_token_expires_at: null
      })
      .eq('id', userId);

    return true;
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    return false;
  }
}
