"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Users, Clock, Shield, Star, Save, Loader2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FormProgress } from "@/components/ui/form-progress"
import { FieldHelp } from "@/components/ui/field-help"
import { useAutoSave } from "@/lib/hooks/use-auto-save"
import { calculateFormProgress } from "@/lib/utils/form-helpers"
import { useTranslation } from "@/lib/i18n/context"
import { ServiceAccordion } from "@/components/service-accordion"

export default function GetStartedPage() {
  const { t, messages } = useTranslation('getStarted')
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    role: "",
    projectDescription: "",
    serviceInterests: [] as string[],
    contactMethod: "email",
    timeline: "",
    budget: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [autoSaved, setAutoSaved] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const requiredFields = ["firstName", "lastName", "company", "email", "projectDescription", "serviceInterests"]
  const formProgress = calculateFormProgress(formData, requiredFields)

  // Service options are now handled by ServiceAccordion component
  // which uses serviceData directly to show all 28+ services organized by category

  // Contact methods with translations
  const contactMethods = useMemo(() => [
    { value: "email", label: t('contactMethods.email.label') as string, description: t('contactMethods.email.description') as string },
    { value: "phone", label: t('contactMethods.phone.label') as string, description: t('contactMethods.phone.description') as string },
    { value: "video", label: t('contactMethods.video.label') as string, description: t('contactMethods.video.description') as string }
  ], [t])

  // Auto-save functionality
  const { loadFromStorage, clearStorage } = useAutoSave({
    data: formData,
    storageKey: "get-started-form-draft",
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

  // Calculate current step based on form completion
  useEffect(() => {
    if (formData.firstName && formData.lastName && formData.company && formData.email) {
      if (formData.projectDescription && formData.serviceInterests.length > 0) {
        setCurrentStep(2)
      } else {
        setCurrentStep(1)
      }
    } else {
      setCurrentStep(0)
    }
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleServiceInterestChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      serviceInterests: prev.serviceInterests.includes(service)
        ? prev.serviceInterests.filter(s => s !== service)
        : [...prev.serviceInterests, service]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = t('validation.firstNameRequired') as string
    if (!formData.lastName.trim()) newErrors.lastName = t('validation.lastNameRequired') as string
    if (!formData.company.trim()) newErrors.company = t('validation.companyRequired') as string
    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired') as string
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid') as string
    }
    if (!formData.projectDescription.trim()) newErrors.projectDescription = t('validation.projectDescriptionRequired') as string
    if (formData.serviceInterests.length === 0) newErrors.serviceInterests = t('validation.serviceInterestsRequired') as string

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
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

      // Use FormData for form submission
      const submitFormData = new FormData()
      
      // Append all form fields
      submitFormData.append('firstName', formData.firstName)
      submitFormData.append('lastName', formData.lastName)
      submitFormData.append('company', formData.company)
      submitFormData.append('email', formData.email)
      submitFormData.append('phone', formData.phone || '')
      submitFormData.append('role', formData.role || '')
      submitFormData.append('projectDescription', formData.projectDescription)
      submitFormData.append('serviceInterests', JSON.stringify(formData.serviceInterests))
      submitFormData.append('contactMethod', formData.contactMethod)
      submitFormData.append('timeline', formData.timeline || '')
      submitFormData.append('budget', formData.budget || '')
      
      // Build headers (do not set Content-Type for FormData - browser sets it with boundary)
      const headers: HeadersInit = {}
      
      // Add CSRF token to headers if available
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch('/api/get-started', {
        method: 'POST',
        headers,
        credentials: 'include', // Include cookies for CSRF validation
        body: submitFormData, // Send as FormData instead of JSON
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

      if (response.ok) {
        setIsSubmitted(true)
        clearStorage() // Clear auto-saved draft on successful submission
        
        // Track form submission
        if (typeof window !== "undefined") {
          const { trackFormSubmission } = await import("@/lib/analytics")
          trackFormSubmission("get_started", {
            service_interests_count: formData.serviceInterests?.length || 0,
            has_timeline: !!formData.timeline,
            has_budget: !!formData.budget,
            contact_method: formData.contactMethod,
          })
        }
      } else {
        throw new Error(result.message || result.error || t('submit.error') as string)
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      setErrors({ submit: error.message || t('submit.error') as string })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {t('success.title')}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('success.description')}
                </p>
              </div>

              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('success.whatHappensNext')}</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('success.step1.title')}</h3>
                      <p className="text-muted-foreground text-sm">{t('success.step1.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('success.step2.title')}</h3>
                      <p className="text-muted-foreground text-sm">{t('success.step2.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('success.step3.title')}</h3>
                      <p className="text-muted-foreground text-sm">{t('success.step3.description')}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-orange-500 hover:bg-orange-600">
                  <a href="/">{t('success.returnHome')}</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/portfolio">{t('success.viewWork')}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('description')}
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-orange-500" />
                <span>{t('trustSignals.team')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{t('trustSignals.response')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-orange-500" />
                <span>{t('trustSignals.security')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-orange-500" />
                <span>{t('trustSignals.satisfaction')}</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <FormProgress
                    steps={[t('steps.personalInfo') as string, t('steps.projectDetails') as string, t('steps.contactPreference') as string]}
                    currentStep={currentStep}
                    completedSteps={[]}
                    showLabels={true}
                  />
                  {autoSaved && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Save className="h-3 w-3" />
                      <span>{t('submit.draftSaved')}</span>
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('sections.aboutYourself')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="firstName" className="block text-sm font-medium">
                          {t('fields.firstName')} *
                        </label>
                        <FieldHelp
                          tooltip={t('helpText.firstName') as string}
                          variant="help"
                        />
                      </div>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "border-red-500" : ""}
                        placeholder={t('placeholders.firstName') as string}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      />
                      {errors.firstName && (
                        <p id="firstName-error" className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="lastName" className="block text-sm font-medium">
                          {t('fields.lastName')} *
                        </label>
                        <FieldHelp
                          tooltip={t('helpText.lastName') as string}
                          variant="help"
                        />
                      </div>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "border-red-500" : ""}
                        placeholder={t('placeholders.lastName') as string}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                      />
                      {errors.lastName && (
                        <p id="lastName-error" className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="company" className="block text-sm font-medium">
                          {t('fields.company')} *
                        </label>
                        <FieldHelp
                          tooltip={t('helpText.company') as string}
                          variant="help"
                        />
                      </div>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className={errors.company ? "border-red-500" : ""}
                        placeholder={t('placeholders.company') as string}
                        aria-describedby={errors.company ? "company-error" : undefined}
                      />
                      {errors.company && (
                        <p id="company-error" className="text-red-500 text-sm mt-1">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="role" className="block text-sm font-medium">
                          {t('fields.role')}
                        </label>
                        <FieldHelp
                          tooltip={t('helpText.role') as string}
                          variant="help"
                        />
                      </div>
                      <Input
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder={t('placeholders.role') as string}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                          {t('fields.email')} *
                        </label>
                        <FieldHelp
                          tooltip={t('helpText.email') as string}
                          variant="help"
                        />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder={t('placeholders.email') as string}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                      <FieldHelp
                        helpText={t('helpText.emailPrivacy') as string}
                        variant="info"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="phone" className="block text-sm font-medium">
                          {t('fields.phone')}
                        </label>
                        <FieldHelp
                          tooltip={t('helpText.phone') as string}
                          variant="help"
                        />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('placeholders.phone') as string}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('sections.projectDetails')}</h2>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label htmlFor="projectDescription" className="block text-sm font-medium">
                        {t('fields.projectDescription')} *
                      </label>
                      <FieldHelp
                        tooltip={t('helpText.projectDescription') as string}
                        variant="help"
                      />
                    </div>
                    <Textarea
                      id="projectDescription"
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      className={errors.projectDescription ? "border-red-500" : ""}
                      placeholder={t('placeholders.projectDescription') as string}
                      rows={4}
                      aria-describedby={errors.projectDescription ? "projectDescription-error" : undefined}
                    />
                    {errors.projectDescription && (
                      <p id="projectDescription-error" className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>
                    )}
                    <FieldHelp
                      helpText={`${formData.projectDescription.length} ${t('submit.characters')}`}
                      variant="info"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <label htmlFor="serviceInterests" className="block text-sm font-medium">
                        {t('fields.serviceInterests')} *
                      </label>
                      <FieldHelp
                        tooltip={t('helpText.serviceInterests') as string}
                        variant="help"
                      />
                    </div>
                    <ServiceAccordion
                      selectedServices={formData.serviceInterests}
                      onServiceToggle={handleServiceInterestChange}
                      error={errors.serviceInterests}
                    />
                    <FieldHelp
                      helpText={`${formData.serviceInterests.length} ${formData.serviceInterests.length !== 1 ? t('submit.servicesSelectedPlural') : t('submit.servicesSelected')}`}
                      variant="info"
                    />
                  </div>

                  {/* Dynamic field: Show timeline/budget based on service interests */}
                  {formData.serviceInterests.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label htmlFor="timeline" className="block text-sm font-medium">
                            {t('fields.timeline')}
                          </label>
                          <FieldHelp
                            tooltip={t('helpText.timeline') as string}
                            variant="help"
                          />
                        </div>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">{t('timelineOptions.select')}</option>
                          <option value="asap">{t('timelineOptions.asap')}</option>
                          <option value="1-3months">{t('timelineOptions.1-3months')}</option>
                          <option value="3-6months">{t('timelineOptions.3-6months')}</option>
                          <option value="6-12months">{t('timelineOptions.6-12months')}</option>
                          <option value="flexible">{t('timelineOptions.flexible')}</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label htmlFor="budget" className="block text-sm font-medium">
                            {t('fields.budget')}
                          </label>
                          <FieldHelp
                            tooltip={t('helpText.budget') as string}
                            variant="help"
                          />
                        </div>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">{t('budgetOptions.select')}</option>
                          <option value="under-25k">{t('budgetOptions.under25k')}</option>
                          <option value="25k-50k">{t('budgetOptions.25k-50k')}</option>
                          <option value="50k-100k">{t('budgetOptions.50k-100k')}</option>
                          <option value="100k-250k">{t('budgetOptions.100k-250k')}</option>
                          <option value="250k-plus">{t('budgetOptions.250kPlus')}</option>
                          <option value="discuss">{t('budgetOptions.discuss')}</option>
                        </select>
                      </div>
                    </div>
                  )}

                </div>


                {/* Contact Preference */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('sections.contactPreference')}</h2>
                  <FieldHelp
                    helpText={t('helpText.contactPreference') as string}
                    variant="info"
                  />
                  <div className="space-y-3">
                    {contactMethods.map((method) => (
                      <div
                        key={method.value}
                        className={`p-5 rounded-lg border cursor-pointer transition-all min-h-[80px] flex items-start ${
                          formData.contactMethod === method.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, contactMethod: method.value }))}
                      >
                        <div className="flex items-start gap-4 w-full">
                          <input
                            type="radio"
                            name="contactMethod"
                            value={method.value}
                            checked={formData.contactMethod === method.value}
                            onChange={() => setFormData(prev => ({ ...prev, contactMethod: method.value }))}
                            className="text-orange-500 mt-1 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold text-base mb-1 ${
                              formData.contactMethod === method.value
                                ? 'text-orange-600'
                                : 'text-gray-900'
                            }`}>
                              {method.label}
                            </div>
                            <div className={`text-sm leading-relaxed ${
                              formData.contactMethod === method.value
                                ? 'text-orange-500'
                                : 'text-gray-600'
                            }`}>
                              {method.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  {errors.submit && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary-action"
                    size="xl"
                    disabled={isSubmitting}
                    className="w-full group gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-14 sm:h-auto !rounded-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('submit.submitting')}
                      </>
                    ) : (
                      <>
                        {t('submit.button')}
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {t('legal.agreement')}{" "}
                    <a href="#" className="text-orange-500 hover:underline">{t('legal.privacyPolicy')}</a> {t('legal.and')}{" "}
                    <a href="#" className="text-orange-500 hover:underline">{t('legal.termsOfService')}</a>.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
