import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmailWithRetry } from '@/lib/resend/server';
import InvoiceReceiptEmail from '@/lib/resend/templates/invoice-receipt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 400 });
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle different event types with idempotency protection
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  // Extract metadata
  const invoiceId = session.metadata?.invoice_id;
  
  if (!invoiceId) {
    console.error('No invoice ID in session metadata');
    return;
  }

  // Check if this payment has already been processed (idempotency)
  const { data: existingPayment } = await supabaseAdmin
    .from('payments')
    .select('id')
    .eq('stripe_payment_intent_id', session.payment_intent)
    .single();

  if (existingPayment) {
    console.log('Payment already processed, skipping');
    return;
  }

  // Update invoice status
  const { error: updateError } = await supabaseAdmin
    .from('invoices')
    .update({ 
      status: 'paid',
      stripe_payment_intent_id: session.payment_intent,
      paid_at: new Date().toISOString()
    })
    .eq('id', invoiceId);

  if (updateError) {
    console.error('Error updating invoice:', updateError);
    return;
  }

  // Get invoice details with client info
  const { data: invoice, error: invoiceError } = await supabaseAdmin
    .from('invoices')
    .select(`
      *,
      appointments(
        clients(name, email),
        users(email)
      )
    `)
    .eq('id', invoiceId)
    .single();

  if (invoiceError || !invoice) {
    console.error('Error fetching invoice details:', invoiceError);
    return;
  }

  // Create payment record
  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      invoice_id: invoiceId,
      amount: invoice.total,
      stripe_payment_intent_id: session.payment_intent,
      status: 'succeeded',
      created_at: new Date().toISOString()
    });

  if (paymentError) {
    console.error('Error creating payment record:', paymentError);
  }

  // Send receipt email
  try {
    const emailResult = await sendEmailWithRetry({
      to: invoice.appointments.clients.email,
      subject: `Payment Confirmation - NotaryFlow`,
      template: InvoiceReceiptEmail({
        clientName: invoice.appointments.clients.name,
        invoiceNumber: invoice.id,
        amount: invoice.total,
        paymentDate: new Date().toLocaleDateString(),
        notaryEmail: invoice.appointments.users.email
      })
    });

    if (!emailResult.success) {
      console.error('Failed to send receipt email:', emailResult.error);
    }
  } catch (emailError) {
    console.error('Error sending receipt email:', emailError);
    // Don't fail the webhook if email fails
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Handle recurring subscription payments if applicable
  console.log('Invoice payment succeeded:', invoice.id);
}

async function handleInvoicePaymentFailed(invoice: any) {
  // Handle failed payments
  console.log('Invoice payment failed:', invoice.id);
}
