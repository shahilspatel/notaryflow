import React from 'react';

interface InvoiceReceiptEmailProps {
  clientName: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  notaryEmail: string;
}

export default function InvoiceReceiptEmail({
  clientName,
  invoiceNumber,
  amount,
  paymentDate,
  notaryEmail
}: InvoiceReceiptEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#333' }}>Payment Confirmation</h2>
      
      <p>Dear {clientName},</p>
      
      <p>Your payment has been successfully processed. Here are your payment details:</p>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
        <p><strong>Amount Paid:</strong> ${(amount / 100).toFixed(2)}</p>
        <p><strong>Payment Date:</strong> {paymentDate}</p>
      </div>
      
      <p>Thank you for your business! Your notary service has been confirmed.</p>
      
      <p>If you have any questions, please contact us at {notaryEmail}.</p>
      
      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />
      
      <p style={{ fontSize: '12px', color: '#666' }}>
        This is an automated receipt from NotaryFlow. Please keep this for your records.
      </p>
    </div>
  );
}
