# Sentry Error Tracking & Monitoring Setup Guide

## Overview

This project includes comprehensive error tracking and monitoring using Sentry. The implementation provides:

- ✅ Client-side error tracking
- ✅ Server-side error tracking
- ✅ Edge runtime error tracking
- ✅ React error boundaries
- ✅ API route error tracking
- ✅ Performance monitoring
- ✅ User context tracking
- ✅ Custom error reporting

## Installation

### Step 1: Install Sentry

```bash
npm install @sentry/nextjs --save
```

If you encounter peer dependency issues, use:

```bash
npm install @sentry/nextjs --save --legacy-peer-deps
```

### Step 2: Run Sentry Wizard

```bash
npx @sentry/wizard@latest -i nextjs
```

This will:
- Update your `next.config.mjs` file
- Create necessary configuration files
- Set up the Sentry integration

### Step 3: Configure Environment Variables

Add to `.env.local`:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=your_project_slug
SENTRY_AUTH_TOKEN=your_auth_token

# Optional: Adjust sample rates
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of transactions in production
SENTRY_REPLAY_SAMPLE_RATE=0.1  # 10% of sessions
```

### Step 4: Get Your Sentry DSN

1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project (select Next.js)
3. Copy your DSN from the project settings
4. Add it to your `.env.local` file

## Configuration Files

The following files have been created:

- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration
- `instrument.ts` - Sentry initialization
- `components/error-boundary.tsx` - React error boundary
- `lib/sentry.ts` - Utility functions
- `lib/api-error-handler.ts` - API error tracking wrapper

## Usage

### Error Boundaries

Error boundaries are automatically included in the root layout. To add additional boundaries:

```tsx
import { ErrorBoundary } from "@/components/error-boundary"

export default function MyPage() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

### API Route Error Tracking

Wrap your API route handlers:

```typescript
import { withErrorTracking } from "@/lib/api-error-handler"
import { NextRequest, NextResponse } from "next/server"

async function handler(request: NextRequest) {
  // Your API logic
  return NextResponse.json({ success: true })
}

export const POST = withErrorTracking(handler, {
  operation: "my_operation",
  tags: { endpoint: "my_endpoint" },
})
```

### Manual Error Tracking

```typescript
import { captureException, captureMessage, setUser } from "@/lib/sentry"

// Capture an exception
try {
  // Your code
} catch (error) {
  captureException(error, {
    tags: { feature: "checkout" },
    extra: { orderId: "123" },
    user: { id: "user-123", email: "user@example.com" },
  })
}

// Capture a message
captureMessage("Something important happened", "info", {
  tags: { category: "payment" },
})

// Set user context
setUser({
  id: "user-123",
  email: "user@example.com",
  username: "johndoe",
})
```

### Performance Monitoring

```typescript
import { startTransaction } from "@/lib/sentry"

const transaction = startTransaction("my_operation", "function")
try {
  // Your code
  transaction?.finish()
} catch (error) {
  transaction?.finish()
  throw error
}
```

## Features

### Automatic Error Tracking

- ✅ Unhandled exceptions
- ✅ Unhandled promise rejections
- ✅ React component errors
- ✅ API route errors
- ✅ Middleware errors

### Performance Monitoring

- ✅ Page load times
- ✅ API response times
- ✅ Database query times
- ✅ Slow request detection (>1s)

### User Context

- ✅ User ID tracking
- ✅ Email tracking
- ✅ Session tracking
- ✅ Custom user properties

### Error Filtering

- ✅ Browser extension errors filtered
- ✅ Health check endpoints ignored
- ✅ Non-critical errors filtered in production

## Alerting Configuration

### Sentry Alerts

1. Go to your Sentry project
2. Navigate to **Alerts** → **Create Alert Rule**
3. Configure alerts for:
   - **Error Rate**: Alert when error rate > 5% in 5 minutes
   - **New Issues**: Alert on new error types
   - **Performance**: Alert when P95 response time > 2s
   - **Critical Errors**: Alert on 5xx errors

### Recommended Alert Rules

1. **High Error Rate**
   - Condition: Error rate > 5% in 5 minutes
   - Action: Send email/Slack notification

2. **New Critical Error**
   - Condition: New issue with level=error
   - Action: Immediate notification

3. **Performance Degradation**
   - Condition: P95 response time > 2s
   - Action: Send notification

4. **Database Errors**
   - Condition: Error contains "database" or "prisma"
   - Action: Send notification

## Testing

### Test Error Tracking

1. Create a test error in development:

```typescript
// In any component or API route
import { captureException } from "@/lib/sentry"

captureException(new Error("Test error"), {
  tags: { test: true },
})
```

2. Check your Sentry dashboard to verify the error was captured

### Test Error Boundary

1. Create a component that throws an error:

```tsx
function TestError() {
  throw new Error("Test error boundary")
  return <div>This won't render</div>
}
```

2. Wrap it in an ErrorBoundary and verify it catches the error

## Monitoring Dashboard

A monitoring dashboard component is available at `components/monitoring-dashboard.tsx`. You can integrate it into your admin dashboard:

```tsx
import { MonitoringDashboard } from "@/components/monitoring-dashboard"

export default function AdminPage() {
  return (
    <div>
      <MonitoringDashboard />
    </div>
  )
}
```

## Health Check Endpoint

A health check endpoint is available at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## Best Practices

1. **Don't track sensitive data**: Never include passwords, tokens, or PII in error context
2. **Use appropriate log levels**: Use `info` for normal events, `warning` for recoverable issues, `error` for failures
3. **Add context**: Always include relevant tags and extra data
4. **Filter noise**: Configure ignore patterns for known non-critical errors
5. **Monitor performance**: Keep an eye on sample rates to avoid performance impact

## Troubleshooting

### Errors not appearing in Sentry

1. Check that `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify Sentry project is active
3. Check browser console for Sentry initialization errors
4. Ensure `instrument.ts` is in the root directory

### Performance impact

1. Reduce `tracesSampleRate` in production (default: 0.1)
2. Reduce `replaysSessionSampleRate` (default: 0.1)
3. Use `beforeSend` to filter out non-critical errors

### Build errors

1. Ensure all Sentry config files are in the root directory
2. Check that `instrument.ts` exports `register` function
3. Verify `next.config.mjs` includes Sentry webpack plugin

## Support

For issues or questions:
- Sentry Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Sentry Support: https://sentry.io/support/

