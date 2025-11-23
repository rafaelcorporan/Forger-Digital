# Button Design System - Quick Reference Guide

## Overview
This guide provides quick reference for using the unified button design system across the Forger Digital project.

---

## Button Variants

### 1. Primary Action Button
**Purpose:** Main call-to-action, conversion-focused

```tsx
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

<Button variant="primary-action" size="xl">
  Start a Project
  <ArrowRight className="h-5 w-5" />
</Button>
```

**Visual:** Orange pill-shaped button with glow effect  
**Use Cases:** Start, Get Started, Submit, Sign Up, Subscribe  
**Limit:** 1-2 per page for clear hierarchy

### 2. Secondary Action Button
**Purpose:** Alternative or exploratory actions

```tsx
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

<Button variant="secondary-action" size="xl">
  <Play className="h-5 w-5" />
  View Our Work
</Button>
```

**Visual:** Transparent with white/orange border and text  
**Use Cases:** View, Watch, Learn More, Explore  
**Pairing:** Works great alongside primary buttons

---

## Sizes

### XL (Recommended for Hero/CTA)
```tsx
<Button variant="primary-action" size="xl">
  Large Call to Action
</Button>
```
- Padding: `px-10 py-7`
- Text: `text-base` (16px)
- Best for: Hero sections, major CTAs

### LG (Standard)
```tsx
<Button variant="primary-action" size="lg">
  Standard Action
</Button>
```
- Height: `h-10`
- Padding: `px-6`
- Best for: Forms, cards, general use

### Default
```tsx
<Button variant="primary-action">
  Default Button
</Button>
```
- Height: `h-9`
- Padding: `px-4 py-2`
- Best for: Inline actions, tables

---

## Icon Usage

### Directional Icons (Primary)
For forward/progression actions:
```tsx
import { ArrowRight, ChevronRight } from "lucide-react"

<Button variant="primary-action" size="xl" className="group">
  Continue
  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
</Button>
```

### Media Icons (Secondary)
For viewing/exploring content:
```tsx
import { Play, Eye, Video } from "lucide-react"

<Button variant="secondary-action" size="xl">
  <Play className="h-5 w-5" />
  Watch Demo
</Button>
```

---

## Common Patterns

### Hero Section CTA Pair
```tsx
<div className="flex flex-col items-start justify-start gap-4 sm:flex-row">
  <Link href="/get-started">
    <Button variant="primary-action" size="xl" className="group gap-2">
      Start a Project
      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  </Link>
  
  <Link href="/portfolio">
    <Button variant="secondary-action" size="xl" className="gap-2">
      <Play className="h-5 w-5" />
      View Our Work
    </Button>
  </Link>
</div>
```

### Form Submit Button
```tsx
<Button 
  type="submit" 
  variant="primary-action" 
  size="lg"
  disabled={isSubmitting}
>
  {isSubmitting ? "Submitting..." : "Submit Project"}
  <ArrowRight className="h-5 w-5" />
</Button>
```

### Card Action Button
```tsx
<Button variant="primary-action" size="default">
  Learn More
  <ChevronRight className="h-4 w-4" />
</Button>
```

---

## Accessibility

### Always Provide Meaningful Labels
```tsx
// ✅ Good
<Button variant="primary-action" size="xl">
  Start Your Project
</Button>

// ❌ Bad (ambiguous)
<Button variant="primary-action" size="xl">
  Click Here
</Button>
```

### Icon-Only Buttons Need aria-label
```tsx
<Button variant="primary-action" size="icon" aria-label="Submit form">
  <Check className="h-4 w-4" />
</Button>
```

### Loading States
```tsx
<Button variant="primary-action" disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="h-5 w-5 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      Submit
      <ArrowRight className="h-5 w-5" />
    </>
  )}
</Button>
```

---

## Don'ts

### ❌ Don't Override Core Styles
```tsx
// ❌ Bad - defeats the design system
<Button 
  variant="primary-action" 
  className="bg-blue-500 rounded-none"
>
  Button
</Button>

// ✅ Good - use existing variants
<Button variant="default">
  Button
</Button>
```

### ❌ Don't Use Multiple Primary Buttons
```tsx
// ❌ Bad - unclear hierarchy
<div>
  <Button variant="primary-action">Action 1</Button>
  <Button variant="primary-action">Action 2</Button>
  <Button variant="primary-action">Action 3</Button>
</div>

// ✅ Good - clear hierarchy
<div>
  <Button variant="primary-action">Primary Action</Button>
  <Button variant="secondary-action">Alternative</Button>
  <Button variant="outline">Tertiary</Button>
</div>
```

---

## Complete Example

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Mail } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="bg-gray-900 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Digital Presence?
        </h2>
        
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join 50+ companies who trust Forger Digital for cutting-edge solutions
        </p>
        
        {/* Primary CTA Group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link href="/get-started">
            <Button variant="primary-action" size="xl" className="group gap-2">
              Start a Project
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/portfolio">
            <Button variant="secondary-action" size="xl" className="gap-2">
              <Play className="h-5 w-5" />
              View Our Work
            </Button>
          </Link>
        </div>
        
        {/* Secondary Link */}
        <Link href="/contact">
          <Button variant="link" className="text-white/60 hover:text-white">
            <Mail className="h-4 w-4 mr-2" />
            Or contact us directly
          </Button>
        </Link>
      </div>
    </section>
  )
}
```

---

## Testing Checklist

Before deploying button changes:

- [ ] Visual consistency with reference design
- [ ] Hover states work correctly
- [ ] Focus states visible for keyboard navigation
- [ ] Works on all screen sizes (mobile, tablet, desktop)
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Screen reader announces button purpose
- [ ] Loading/disabled states work correctly
- [ ] Icons render and animate properly

---

## Need Help?

- **Full Documentation:** See `docs/BUTTON_DESIGN_SYSTEM.md`
- **Component Source:** `components/ui/button.tsx`
- **Design Reference:** Hero section buttons on landing page

---

**Last Updated:** November 22, 2025  
**Version:** 1.0.0

