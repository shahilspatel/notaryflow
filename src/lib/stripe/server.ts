import 'server-only';

import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});

/**
 * Creates a Stripe invoice for an appointment.
 * 
 * Args:
 *   appointmentId: UUID of the appointment
 *   userId: UUID of the user (notary)
 *   clientName: Name of the client
 *   clientEmail: Email of the client
 * 
 * Returns:
 *   Invoice object or null if creation fails
 * 
 * Purpose:
 *   Generates payment links for appointments
 */
export async function createStripeInvoice({
  appointmentId,
  userId,
  clientName,
  clientEmail
}: {
  appointmentId: string;
  userId: string;
  clientName: string;
  clientEmail: string;
}) {
  try {
    // Create invoice in database
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .insert({
        user_id: userId,
        appointment_id: appointmentId,
        status: 'pending',
        total: 15000, // $150.00 in cents
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (invoiceError || !invoice) {
      console.error('Failed to create invoice:', invoiceError);
      return null;
    }

    // Create invoice items
    await supabaseAdmin
      .from('invoice_items')
      .insert({
        invoice_id: invoice.id,
        description: 'Notary Signing Service',
        quantity: 1,
        unit_price: 15000,
        total: 15000
      });

    return invoice;
  } catch (error) {
    console.error('Stripe invoice creation failed:', error);
    return null;
  }
}
