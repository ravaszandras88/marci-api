# API Migration Complete

## Overview
All sensitive credentials and backend operations have been successfully migrated from `marcelnyiro-portfolio` to `marcelnyiro-api`.

## Changes Made

### marcelnyiro-api
Now contains:
- All Stripe secret keys and webhook handling
- Database credentials and connections
- SMTP email configuration
- JWT authentication tokens

New API endpoints created:
- `/api/stripe/create-checkout-session` - Stripe checkout
- `/api/stripe/webhook` - Stripe webhooks
- `/api/user/check-premium` - Check premium status
- `/api/user/update-premium` - Update premium status
- `/api/email/send-contact` - Send contact emails
- `/api/mentoring/create-session` - Create mentoring sessions
- `/api/mentoring/send-confirmation` - Send confirmation emails

### marcelnyiro-portfolio
Now only contains:
- Public Stripe publishable key (safe for client-side)
- API URL configuration to call marcelnyiro-api

All API routes in portfolio now proxy requests to the API server.

## Environment Variables

### marcelnyiro-api/.env.local
```
DB_PASSWORD=triotro44404
JWT_SECRET=MarcelNyiro2024SecretKeyForJWTTokens!SuperSecure789
STRIPE_SECRET_KEY=sk_test_...
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### marcelnyiro-portfolio/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Running the Projects

1. Start the API server (port 3002):
```bash
cd marcelnyiro-api
npm run dev
```

2. Start the portfolio (port 3000):
```bash
cd marcelnyiro-portfolio
npm run dev
```

The portfolio will now securely communicate with the API for all backend operations.