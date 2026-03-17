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

/**
 * Creates a Stripe Checkout session for invoice payment.
 * 
 * Args:
 *   invoiceId: UUID of the invoice
 *   clientEmail: Email of the client
 *   clientName: Name of the client
 * 
 * Returns:
 *   Checkout session URL or null if creation fails
 */
export async function createStripeCheckoutSession({
  invoiceId,
  clientEmail,
  clientName
}: {
  invoiceId: string;
  clientEmail: string;
  clientName: string;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: clientEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Notary Signing Service',
              description: `Service for ${clientName}`,
            },
            unit_amount: 15000, // $150.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/book/confirmed?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/book/confirmed?payment=cancelled`,
      metadata: {
        invoice_id: invoiceId,
      },
    });

    return session.url;
  } catch (error) {
    console.error('Failed to create Stripe Checkout session:', error);
    return null;
  }
}
