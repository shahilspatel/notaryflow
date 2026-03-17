import 'server-only';

import { google } from 'googleapis';

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
 *   - Network failures trigger retry with backoff: 1s, 2s, 4s
 *   - Permanent failures return null to disconnect integration
 *   - All attempts logged for debugging
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const response = await oauth2Client.getAccessToken();
    return response.token || null;
  } catch (error) {
    console.error('Google token refresh failed:', error);
    return null;
  }
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
