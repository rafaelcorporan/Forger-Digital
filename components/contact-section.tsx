"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, ArrowRight, CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { FormProgress } from "@/components/ui/form-progress"
import { FieldHelp } from "@/components/ui/field-help"
import { useAutoSave } from "@/lib/hooks/use-auto-save"
import { calculateFormProgress } from "@/lib/utils/form-helpers"
import { useTranslation } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations"

export function ContactSection() {
  const { t } = useTranslation('contact')
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>("")
  const [submitWarning, setSubmitWarning] = useState<string>("")
  const [autoSaved, setAutoSaved] = useState(false)

  const requiredFields = ["firstName", "lastName", "email", "message"]
  const formProgress = calculateFormProgress(formData, requiredFields)

  // Auto-save functionality
  const { loadFromStorage, clearStorage } = useAutoSave({
    data: formData,
    storageKey: "contact-form-draft",
    debounceMs: 2000,
    enabled: !isSubmitted,
    onSave: () => {
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
    },
  })

  // Load draft on mount
  useEffect(() => {
    const draft = loadFromStorage()
    if (draft) {
      setFormData((prev) => ({ ...prev, ...draft }))
    }
  }, [loadFromStorage])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

          if (!formData.firstName.trim()) {
            newErrors.firstName = t('validation.firstNameRequired')
          }
          if (!formData.lastName.trim()) {
            newErrors.lastName = t('validation.lastNameRequired')
          }
          if (!formData.email.trim()) {
            newErrors.email = t('validation.emailRequired')
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('validation.emailInvalid')
          }
          // Phone validation (optional field, but if provided, must be valid)
          if (formData.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone = t('validation.phoneInvalid')
          }
          if (!formData.message.trim()) {
            newErrors.message = t('validation.messageRequired')
          } else if (formData.message.trim().length < 10) {
            newErrors.message = t('validation.messageMinLength')
          }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
    if (submitError) {
      setSubmitError("")
    }
    if (submitWarning) {
      setSubmitWarning("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")
    setSubmitWarning("")

    try {
      // Fetch CSRF token first
      let csrfToken: string | null = null
      try {
        const csrfResponse = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include', // Include cookies
        })
        
        // Check if CSRF response is JSON before parsing
        const csrfContentType = csrfResponse.headers.get('content-type')
        if (csrfResponse.ok && csrfContentType && csrfContentType.includes('application/json')) {
          const csrfData = await csrfResponse.json()
          if (csrfData.success && csrfData.token) {
            csrfToken = csrfData.token
          }
        } else if (!csrfResponse.ok) {
          // If CSRF endpoint failed, read response for debugging
          const csrfText = await csrfResponse.text()
          console.error('CSRF token fetch failed:', {
            status: csrfResponse.status,
            statusText: csrfResponse.statusText,
            contentType: csrfContentType,
            response: csrfText.substring(0, 200)
          })
        }
      } catch (csrfError: any) {
        console.error('Failed to fetch CSRF token:', csrfError)
        // Continue without CSRF token - server will handle validation
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      // Add CSRF token to headers if available
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers,
        credentials: 'include', // Include cookies for CSRF validation
        body: JSON.stringify(formData),
      })

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, read as text to see what we got
        const text = await response.text()
        console.error('Non-JSON response received:', text.substring(0, 200))
        throw new Error('Server returned an invalid response. Please try again later.')
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to submit form')
      }

      // Success (even if email failed but was saved)
      setIsSubmitted(true)
      setSubmitWarning(result.warning || "")
      clearStorage() // Clear auto-saved draft on successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      })
      
      // Track form submission
      if (typeof window !== "undefined") {
        const { trackFormSubmission } = await import("@/lib/analytics")
        trackFormSubmission("contact", {
          has_phone: !!formData.phone,
          has_company: !!formData.company,
        })
      }
      
      // Reset messages after 8 seconds (longer if there's a warning)
      setTimeout(() => {
        setIsSubmitted(false)
        setSubmitWarning("")
      }, result.warning ? 10000 : 5000)
    } catch (error: any) {
            console.error('Form submission error:', error)
            setSubmitError(error.message || t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section 
      id="contact" 
      className="py-24 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Info */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
            className="text-white"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6"
            >
              {t('subtitle')}
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              id="contact-heading" 
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {t('title')}
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl mb-10 text-white/90"
            >
              {t('description')}
            </motion.p>

            {/* Contact Details */}
            <motion.div 
              variants={staggerContainer}
              className="space-y-6 mb-10"
            >
              <motion.div variants={staggerItem} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <a href="mailto:hello@forgerdigital.com" className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded">
                    hello@forgerdigital.com
                  </a>
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <a href="tel:+13478294952" className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded">
                    +1 (347) 829-4952
                  </a>
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <address className="font-medium not-italic">San Francisco, CA</address>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={staggerContainer}
              className="flex gap-4" 
              role="list" 
              aria-label="Social media links"
            >
              <motion.a 
                variants={staggerItem}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label="Visit our LinkedIn profile"
              >
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </motion.a>
              <motion.a 
                variants={staggerItem}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label="Visit our Twitter profile"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </motion.a>
              <motion.a 
                variants={staggerItem}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label="Visit our GitHub profile"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeInRight}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/30 shadow-2xl"
          >
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              {t('formTitle')}
            </h3>
            <p className="text-base md:text-lg text-white/95 mb-8 font-medium">
              {t('formDescription')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Progress Indicator */}
              <div className="mb-8 pb-6 border-b border-white/20">
                <FormProgress
                  steps={["Personal Info", "Contact Details", "Message"]}
                  currentStep={
                    formData.firstName && formData.lastName
                      ? formData.email
                        ? 2
                        : 1
                      : 0
                  }
                  completedSteps={[]}
                  showLabels={true}
                />
                {autoSaved && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/80 bg-white/10 px-3 py-1.5 rounded-full w-fit">
                    <Save className="h-3.5 w-3.5 text-green-300" />
                    <span className="font-medium">{t('autoSave')}</span>
                  </div>
                )}
              </div>

              {/* Success Message */}
              {isSubmitted && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t('success')}</p>
                    <p className="text-sm text-white/80">{t('successDescription')}</p>
                  </div>
                </div>
              )}

              {/* Warning Message (when email fails but submission is saved) */}
              {submitWarning && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-center gap-3 text-white">
                  <AlertCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Note: {submitWarning}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-white">
                  <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div suppressHydrationWarning>
                    <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="firstName" className="text-sm font-semibold text-white">
                      {t('fields.firstName')}
                    </label>
                    <FieldHelp
                      helpText=""
                      tooltip={t('helpText.firstName')}
                      variant="help"
                    />
                  </div>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder={t('placeholders.firstName')}
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`bg-white/15 border-2 border-white/25 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:bg-white/20 transition-all duration-200 h-12 text-base ${
                      errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
                    }`}
                    disabled={isSubmitting}
                    required
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-red-300 text-xs mt-1.5 font-medium">{errors.firstName}</p>
                  )}
                </div>
                <div suppressHydrationWarning>
                  <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="lastName" className="text-sm font-semibold text-white">
                      {t('fields.lastName')}
                    </label>
                    <FieldHelp
                      helpText=""
                      tooltip={t('helpText.lastName')}
                      variant="help"
                    />
                  </div>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder={t('placeholders.lastName')}
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`bg-white/15 border-2 border-white/25 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:bg-white/20 transition-all duration-200 h-12 text-base ${
                      errors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
                    }`}
                    disabled={isSubmitting}
                    required
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-red-300 text-xs mt-1.5 font-medium">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="email" className="text-sm font-semibold text-white">
                    {t('fields.email')}
                  </label>
                  <FieldHelp
                    helpText=""
                    tooltip={t('helpText.email')}
                    variant="help"
                  />
                </div>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t('placeholders.email')}
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-white/15 border-2 border-white/25 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:bg-white/20 transition-all duration-200 h-12 text-base ${
                    errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
                  }`}
                  disabled={isSubmitting}
                  required
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-300 text-xs mt-1.5 font-medium">{errors.email}</p>
                )}
                      <FieldHelp
                        helpText={t('helpText.emailPrivacy')}
                        variant="info"
                      />
              </div>

              <div suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-white">
                    {t('fields.phone')}
                  </label>
                  <FieldHelp
                    helpText=""
                    tooltip={t('helpText.phone')}
                    variant="help"
                  />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder={t('placeholders.phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-white/15 border-2 border-white/25 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:bg-white/20 transition-all duration-200 h-12 text-base ${
                    errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
                  }`}
                  disabled={isSubmitting}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-300 text-xs mt-1.5 font-medium">{errors.phone}</p>
                )}
              </div>

              <div suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="company" className="text-sm font-semibold text-white">
                    {t('fields.company')}
                  </label>
                  <FieldHelp
                    helpText=""
                    tooltip={t('helpText.company')}
                    variant="help"
                  />
                </div>
                <Input
                  id="company"
                  type="text"
                  name="company"
                  placeholder={t('placeholders.company')}
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-white/15 border-2 border-white/25 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:bg-white/20 transition-all duration-200 h-12 text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div suppressHydrationWarning>
                  <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="message" className="text-sm font-semibold text-white">
                      {t('fields.message')}
                    </label>
                    <FieldHelp
                      helpText=""
                      tooltip={t('helpText.message')}
                      variant="help"
                    />
                  </div>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('placeholders.message')}
                  value={formData.message}
                  onChange={handleChange}
                  className={`bg-white/15 border-2 border-white/25 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:bg-white/20 transition-all duration-200 min-h-[160px] resize-none text-base leading-relaxed py-3 ${
                    errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''
                  }`}
                  disabled={isSubmitting}
                  required
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.message ? (
                    <p id="message-error" className="text-red-300 text-xs font-medium">{errors.message}</p>
                  ) : (
                    <FieldHelp
                      helpText={`${formData.message.length} characters (minimum 10 required)`}
                      variant="info"
                    />
                  )}
                </div>
              </div>


              <Button
                type="submit"
                variant="inverted-action"
                size="xl"
                disabled={isSubmitting || isSubmitted}
                className="w-full group gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                    {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t('submitting')}
                        </>
                      ) : (
                        <>
                          {t('submit')}
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

