'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createStripeInvoice, createStripeCheckoutSession } from '@/lib/stripe/server';
import { refreshAccessToken, createCalendarEvent, isGoogleCalendarConnected } from '@/lib/google/server';
import { trackEvent } from '@/lib/analytics/server';
import { isRateLimited } from '@/lib/rate-limit';

/**
 * Creates a new booking with client, appointment, and invoice.
 * 
 * Args:
 *   formData: Form data containing booking details
 * 
 * Returns:
 *   Redirects to confirmation or error page
 * 
 * Edge Cases:
 *   - Rejects duplicate time slots
 *   - Handles Google Calendar token refresh failures
 *   - Validates required fields
 */
export async function createBooking(formData: FormData) {
  const notaryId = formData.get('notaryId') as string;
  const clientName = formData.get('clientName') as string;
  const clientEmail = formData.get('clientEmail') as string;
  const clientPhone = formData.get('clientPhone') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const address = formData.get('address') as string;
  const notes = formData.get('notes') as string;

  // Rate limiting by notary ID
  if (isRateLimited(`booking:${notaryId}`, 20, 3600000)) { // 20 bookings per hour
    redirect(`/book/${notaryId}?error=rate-limited`);
  }

  // Validate required fields
  if (!notaryId || !clientName || !clientEmail || !date || !time || !address) {
    redirect(`/book/${notaryId}?error=invalid`);
  }

  try {
    // Parse date and time
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour

    // Check for double booking with time range overlap
    const { data: existingAppointment } = await supabaseAdmin
      .from('appointments')
      .select('id, start_at, end_at')
      .eq('user_id', notaryId)
      .or(`and(start_at.lte.${endDateTime.toISOString()},end_at.gte.${startDateTime.toISOString()})`)
      .maybeSingle();

    if (existingAppointment) {
      redirect(`/book/${notaryId}?error=time-slot-taken`);
    }

    // Find or create client
    let clientId: string;
    const { data: existingClient } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('email', clientEmail)
      .eq('user_id', notaryId)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: clientError } = await supabaseAdmin
        .from('clients')
        .insert({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          user_id: notaryId
        })
        .select('id')
        .single();

      if (clientError || !newClient) {
        redirect(`/book/${notaryId}?error=unable-to-book`);
      }
      clientId = newClient.id;
    }

    // Create appointment with atomic operation to prevent race conditions
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .insert({
        client_id: clientId,
        user_id: notaryId,
        start_at: startDateTime.toISOString(),
        end_at: endDateTime.toISOString(),
        location: address,
        notes: notes || null
      })
      .select('id')
      .single();

    if (appointmentError) {
      // Check if this is a duplicate key error (race condition)
      if (appointmentError.code === '23505' || appointmentError.message.includes('duplicate')) {
        redirect(`/book/${notaryId}?error=time-slot-taken`);
      }
      console.error('Appointment creation error:', appointmentError);
      redirect(`/book/${notaryId}?error=unable-to-book`);
    }

    // Create invoice
    const invoice = await createStripeInvoice({
      appointmentId: appointment.id,
      userId: notaryId,
      clientName,
      clientEmail
    });

    if (!invoice) {
      redirect(`/book/${notaryId}?error=unable-to-invoice`);
    }

    // Create Stripe Checkout session
    const checkoutUrl = await createStripeCheckoutSession({
      invoiceId: invoice.id,
      clientEmail,
      clientName
    });

    if (!checkoutUrl) {
      redirect(`/book/${notaryId}?error=unable-to-create-payment`);
    }

    // Get user's Google Calendar tokens
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('google_access_token, google_refresh_token, google_token_expires_at')
      .eq('id', notaryId)
      .single();

    // Create Google Calendar event if tokens are available
    if (user?.google_access_token) {
      try {
        let accessToken = user.google_access_token;

        // Check if token needs refresh
        if (user.google_token_expires_at && new Date(user.google_token_expires_at) <= new Date()) {
          if (user.google_refresh_token) {
            accessToken = await refreshAccessToken(user.google_refresh_token);
            
            if (accessToken) {
              // Update tokens in database
              await supabaseAdmin
                .from('users')
                .update({
                  google_access_token: accessToken,
                  google_token_expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
                })
                .eq('id', notaryId);
            } else {
              // Token refresh failed, disconnect integration
              console.log('Google Calendar token refresh failed, disconnecting integration');
              await supabaseAdmin
                .from('users')
                .update({
                  google_access_token: null,
                  google_refresh_token: null,
                  google_token_expires_at: null
                })
                .eq('id', notaryId);
            }
          }
        }

        if (accessToken) {
          await createCalendarEvent({
            accessToken,
            summary: `Notary Signing - ${clientName}`,
            description: `Notary appointment with ${clientName} (${clientEmail}). ${notes || ''}`,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            location: address
          });
        }
      } catch (calendarError) {
        console.error('Calendar event creation failed:', calendarError);
        // Don't fail the booking if calendar sync fails
        // User will be prompted to reconnect calendar on their next visit
      }
    }

    // Track analytics event
    trackEvent({
      event: 'booking_created',
      userId: notaryId,
      properties: {
        notaryId,
        clientId,
        appointmentId: appointment.id
      }
    });

    // Redirect to Stripe Checkout for payment
    redirect(checkoutUrl);
  } catch (error) {
    console.error('Booking creation failed:', error);
    redirect(`/book/${notaryId}?error=unable-to-book`);
  }
}
