# Analytics & Tracking Implementation Guide

## Overview

This document describes the Google Analytics 4 (GA4) implementation for the Forger Digital website. The analytics system is privacy-compliant and respects user cookie consent preferences.

## Features

- ✅ **Privacy-Compliant**: Only loads when user consents to analytics cookies
- ✅ **GDPR/CCPA Compliant**: IP anonymization, no personal data collection
- ✅ **Automatic Page View Tracking**: Tracks all page views automatically
- ✅ **Custom Event Tracking**: Tracks form submissions, button clicks, and user actions
- ✅ **Cookie Consent Integration**: Automatically initializes/removes based on user consent
- ✅ **Type-Safe**: Full TypeScript support

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
# Google Analytics 4 Measurement ID
# Get this from: https://analytics.google.com/
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Go to Admin → Data Streams → Web
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
5. Add it to your `.env.local` file

## Implementation Details

### Components

#### `lib/analytics.ts`
Core analytics utility providing:
- GA4 initialization/cleanup
- Page view tracking
- Custom event tracking
- Form submission tracking
- User property management

#### `components/analytics-provider.tsx`
React component that:
- Initializes GA4 on mount (if consent given)
- Listens for cookie consent changes
- Tracks page views on route changes
- Manages GA4 lifecycle

### Privacy Settings

The implementation includes the following privacy features:

```typescript
{
  anonymize_ip: true,                    // Anonymize IP addresses
  allow_google_signals: false,           // Disable Google Signals
  allow_ad_personalization_signals: false, // Disable ad personalization
  send_page_view: false,                 // Manual page view tracking
}
```

## Usage

### Automatic Tracking

The following events are tracked automatically:

- **Page Views**: All route changes are tracked automatically
- **Form Submissions**: Contact and Get Started forms are tracked

### Manual Event Tracking

You can track custom events anywhere in your code:

```typescript
import { trackEvent, trackButtonClick, trackLinkClick } from "@/lib/analytics"

// Track custom event
trackEvent("custom_event_name", {
  custom_parameter: "value",
  numeric_value: 123,
})

// Track button click
trackButtonClick("cta_button", "/homepage")

// Track link click
trackLinkClick("Learn More", "https://example.com")
```

### Form Submission Tracking

Form submissions are automatically tracked, but you can add additional context:

```typescript
import { trackFormSubmission } from "@/lib/analytics"

trackFormSubmission("contact", {
  has_phone: true,
  has_company: false,
})
```

### Service/Project View Tracking

```typescript
import { trackServiceView, trackProjectView } from "@/lib/analytics"

// Track service page view
trackServiceView("custom-software-development", "Custom Software Development")

// Track portfolio project view
trackProjectView("project-1", "E-commerce Platform")
```

## Tracked Events

### Standard Events

- `page_view` - Automatic on route changes
- `form_submit` - Form submissions
- `conversion` - Key conversions (form submissions, signups)
- `button_click` - Button clicks
- `link_click` - Link clicks
- `view_service` - Service page views
- `view_project` - Portfolio project views
- `search` - Search queries
- `sign_up` - User signups

### Event Parameters

#### Form Submission
- `form_name`: Name of the form (e.g., "contact", "get_started")
- `has_phone`: Whether phone number was provided
- `has_company`: Whether company name was provided
- `service_interests_count`: Number of service interests selected
- `contact_method`: Preferred contact method

#### Conversion
- `conversion_type`: Type of conversion (e.g., "contact", "get_started", "signup")
- `value`: Conversion value (default: 1)
- `currency`: Currency code (default: "USD")

## Cookie Consent Integration

The analytics system automatically:

1. **Checks consent on load**: Reads `cookie-preferences` from localStorage
2. **Initializes if consented**: Loads GA4 if `analytics: true`
3. **Listens for changes**: Responds to `cookieConsentUpdated` events
4. **Removes on decline**: Cleans up GA4 and cookies when consent is revoked

### Cookie Consent Event

The system listens for the `cookieConsentUpdated` custom event:

```typescript
window.dispatchEvent(new CustomEvent("cookieConsentUpdated", {
  detail: {
    analytics: true,  // or false
    marketing: true,  // or false
    strictlyNecessary: true  // always true
  }
}))
```

## Content Security Policy (CSP)

The following domains are allowed in CSP:

- `https://www.googletagmanager.com` - GA4 script loading
- `https://www.google-analytics.com` - Analytics data collection
- `https://*.google-analytics.com` - Analytics subdomains
- `https://*.analytics.google.com` - Analytics API

## Testing

### Development Testing

1. Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in `.env.local`
2. Accept analytics cookies in the cookie consent pop-up
3. Open browser DevTools → Network tab
4. Look for requests to `google-analytics.com` and `googletagmanager.com`
5. Check browser console for "✅ Google Analytics 4 initialized"

### Verify Events in GA4

1. Go to Google Analytics → Reports → Realtime
2. Perform actions on your site (page views, form submissions)
3. Events should appear in real-time (may take a few seconds)

### Privacy Testing

1. Decline analytics cookies
2. Verify no requests to Google Analytics domains
3. Accept analytics cookies
4. Verify GA4 initializes and starts tracking

## Troubleshooting

### GA4 Not Loading

1. **Check Measurement ID**: Verify `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set correctly
2. **Check Cookie Consent**: Ensure analytics cookies are accepted
3. **Check Browser Console**: Look for error messages
4. **Check CSP**: Verify CSP allows Google Analytics domains

### Events Not Appearing

1. **Check Consent**: Ensure analytics cookies are still accepted
2. **Check Network Tab**: Verify requests are being sent
3. **Check GA4 DebugView**: Use GA4 DebugView to see events in real-time
4. **Wait for Processing**: Events may take 24-48 hours to appear in standard reports

### CSP Blocking Analytics

If CSP is blocking analytics:

1. Check `lib/security/csp-config.ts`
2. Ensure Google Analytics domains are in `scripts` and `connect` arrays
3. Restart development server after changes

## Best Practices

1. **Respect User Privacy**: Never track without consent
2. **Anonymize Data**: Always use `anonymize_ip: true`
3. **No PII**: Never send personally identifiable information
4. **Test Thoroughly**: Test both consent and non-consent scenarios
5. **Monitor Performance**: Ensure analytics doesn't slow down the site

## Compliance

This implementation complies with:

- ✅ **GDPR**: Requires explicit consent, anonymizes IP, allows opt-out
- ✅ **CCPA**: Respects user privacy preferences
- ✅ **ePrivacy Directive**: Cookie consent required before tracking

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check Google Analytics DebugView
4. Verify environment variables are set correctly

