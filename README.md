# NotaryFlow

Professional business management platform for loan signing agents. Accept bookings, sync to Google Calendar, track clients, generate invoices, collect payments, and export records for taxes.

## Platform Features

NotaryFlow replaces scattered spreadsheets and manual processes with a single, integrated platform that:

- **Captures clients** through professional booking pages
- **Automates scheduling** with Google Calendar sync
- **Handles payments** securely through Stripe
- **Manages business** with invoices, expenses, and mileage tracking
- **Sends notifications** automatically to clients and notaries

## Ideal Users

Loan signing agents who want to:
- Eliminate double-bookings and scheduling conflicts
- Get paid faster with automated invoicing
- Track business expenses for tax purposes
- Present a professional image to clients
- Spend less time on admin, more on signings

## Quick Start

Deploy your own NotaryFlow instance in 5 minutes:

1. **Clone and install**
   ```bash
   git clone https://github.com/shahilspatel/notaryflow.git
   cd notaryflow
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys (see Configuration section)
   ```

3. **Set up database**
   ```bash
   npx supabase start
   npx supabase db push
   ```

4. **Launch the application**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to begin.

## Core Concepts

### Users and Authentication
Every notary gets their own secure workspace. Row Level Security ensures users only see their own data—no cross-user access possible.

### Booking Flow
Clients visit your public booking link (`/book/your-slug`), fill a form, and create appointments. The system prevents double-bookings automatically.

### Payment Processing
Stripe handles all payments securely. Webhooks ensure payments update invoices instantly, even if the user closes their browser.

### Calendar Integration
Google Calendar sync keeps your schedule current. Tokens refresh automatically with exponential backoff when they expire.

## Configuration

### Required Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=https://notaryflow.app

# Supabase (Database + Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_FOUNDING_MONTHLY=price_...
STRIPE_PRICE_STANDARD_MONTHLY=price_...

# Google Calendar
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=NotaryFlow <no-reply@notaryflow.app>
```

### Optional Integrations

```bash
# Analytics (Plausible)
PLAUSIBLE_API_URL=https://plausible.io
PLAUSIBLE_API_KEY=your_api_key

# Monitoring (Sentry)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

## Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** — Vercel handles SSL and CDN automatically

### Self-Hosted

```bash
npm run build
npm start
```

Requires Node.js 18+ and PostgreSQL 14+.

## Business Model

### Pricing Tiers
- **Founding Member**: $29/month (early adopter pricing)
- **Standard**: $39/month (full feature access)

### Revenue Flow
1. User signs up → 14-day free trial
2. User adds payment method → Stripe subscription starts
3. Webhook updates user status → Full access granted
4. Failed payments → Access blocked until resolved

## Security

### Data Protection
- **Row Level Security**: Users access only their data
- **Webhook Verification**: All Stripe events validated
- **No Frontend Secrets**: API keys server-side only
- **HTTPS Enforced**: All connections encrypted

### Audit Trail
Critical actions (payments, appointments, settings) log automatically for transparency and debugging.

## API Reference

### Core Server Actions

#### `createBooking(formData)`
Creates a new appointment from public booking form.

**Parameters:**
- `formData`: Form data with client details, date, time, address

**Returns:**
- Redirects to confirmation page or error page

**Edge Cases:**
- Rejects duplicate time slots
- Validates required fields
- Handles Google Calendar token refresh failures

#### `generateInvoice(appointmentId)`
Creates an invoice for an existing appointment.

**Parameters:**
- `appointmentId`: UUID of the appointment to invoice

**Returns:**
- Invoice object with line items and payment links

**Assumptions:**
- Appointment exists and belongs to current user
- User has active subscription

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start Supabase locally
npx supabase start

# Run development server
npm run dev
```

### Database Migrations

```bash
# Create new migration
npx supabase db diff

# Apply migrations
npx supabase db push

# Reset local database
npx supabase db reset
```

### Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

## Support

### Common Issues

**Google Calendar disconnected**: Re-authenticate in Settings → Integrations
**Payment not processing**: Check Stripe webhook endpoint is reachable
**Booking link not working**: Verify booking slug is unique in user profile

### Getting Help

- **Documentation**: Full guides in this repository
- **Issues**: Report bugs at [github.com/shahilspatel/notaryflow/issues](https://github.com/shahilspatel/notaryflow/issues)
- **Email**: Support at support@notaryflow.app

## License

MIT License — use, modify, and distribute freely.
