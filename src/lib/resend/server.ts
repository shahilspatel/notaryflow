import 'server-only';
import { Resend } from 'resend';

// Skip Resend initialization during build or when env vars are missing
if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not configured, email functionality will be disabled');
}

export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Sends an email with retry logic and error handling.
 * 
 * Args:
 *   to: Recipient email address
 *   subject: Email subject line
 *   template: React email template
 *   maxRetries: Maximum number of retry attempts
 * 
 * Returns:
 *   Promise<{ success: boolean; error?: string }>
 * 
 * Purpose:
 *   Provides reliable email delivery with graceful failure handling
 *   Ensures application continues running even if email delivery fails
 */
export async function sendEmailWithRetry({
  to,
  subject,
  template,
  maxRetries = 3
}: {
  to: string;
  subject: string;
  template: React.ReactElement;
  maxRetries?: number;
}) {
  if (!resend) {
    console.error('Resend not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject,
        react: template
      });

      if (response.data) {
        console.log(`Email sent successfully to ${to} on attempt ${attempt + 1}`);
        return { success: true };
      }

      throw new Error(response.error?.message || 'Unknown email sending error');
    } catch (error) {
      console.error(`Email sending attempt ${attempt + 1} failed:`, error);
      
      // If this is the last attempt, return failure
      if (attempt === maxRetries - 1) {
        console.error(`All email sending attempts failed for ${to}`);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
      
      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retrying email send in ${delay}ms...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

/**
 * Validates email configuration and connectivity.
 * 
 * Returns:
 *   Promise<boolean>: True if Resend is properly configured
 * 
 * Purpose:
 *   Checks email service availability before attempting to send
 */
export async function validateEmailConfig(): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    if (!process.env.EMAIL_FROM) {
      console.error('EMAIL_FROM is not configured');
      return false;
    }

    if (!resend) {
      console.error('Resend client not initialized');
      return false;
    }

    // Test basic connectivity by checking domains
    const domains = await resend.domains.list();
    
    if (domains.error) {
      console.error('Resend domain check failed:', domains.error);
      return false;
    }

    if (!domains.data || domains.data.data?.length === 0) {
      console.error('No verified domains found in Resend');
      return false;
    }

    console.log('Email configuration validated successfully');
    return true;
  } catch (error) {
    console.error('Email validation failed:', error);
    return false;
  }
}
