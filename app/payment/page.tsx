"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, DollarSign, Zap, Crown, Rocket } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Initialize Stripe
const getStripePublishableKey = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  }
  return ''
}

const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(getStripePublishableKey())
  : null

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "month",
    description: "Perfect for small projects and startups",
    features: [
      "Up to 5 projects",
      "Basic support",
      "Email notifications",
      "Standard templates",
      "Community access",
    ],
    icon: Zap,
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    interval: "month",
    description: "For growing businesses and teams",
    features: [
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
      "API access",
      "Team collaboration",
    ],
    icon: Rocket,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    interval: "month",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom SLA",
      "On-premise deployment",
      "Advanced security",
      "24/7 phone support",
      "Custom training",
    ],
    icon: Crown,
    popular: false,
  },
]

const paymentMethods = [
  {
    id: "subscription",
    name: "Subscription",
    description: "Recurring monthly payments",
    icon: CreditCard,
  },
  {
    id: "one-time",
    name: "One-Time Payment",
    description: "Single payment for services",
    icon: DollarSign,
  },
]

export default function PaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("subscription")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/payment")
    }
  }, [status, router])

  const handleSubscriptionCheckout = async (planId: string) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/payment")
      return
    }

    setLoading(true)
    try {
      // In production, you would fetch the actual price ID from your database
      // For now, using placeholder price IDs
      const priceIdMap: Record<string, string> = {
        starter: "price_starter_monthly", // Replace with actual Stripe Price ID
        professional: "price_professional_monthly", // Replace with actual Stripe Price ID
        enterprise: "price_enterprise_monthly", // Replace with actual Stripe Price ID
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceIdMap[planId],
          quantity: 1,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (redirectError) {
        throw redirectError
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      alert(error.message || "Failed to start checkout")
    } finally {
      setLoading(false)
    }
  }

  const handleOneTimePayment = async () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/payment")
      return
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "usd",
        }),
      })

      const { clientSecret, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: undefined, // This would be collected from a card element
        },
      })

      if (stripeError) {
        throw stripeError
      }

      router.push("/payment/success")
    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.message || "Failed to process payment")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg">
            Select the perfect plan for your needs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-800 p-1 rounded-lg border border-gray-700 mb-12">
            {paymentMethods.map((method) => (
              <TabsTrigger
                key={method.id}
                value={method.id}
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <method.icon className="w-4 h-4 mr-2" />
                {method.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={plan.id}
                    className={`bg-gray-800 border-gray-700 relative ${
                      plan.popular
                        ? "border-orange-500 scale-105 shadow-lg shadow-orange-500/20"
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8 text-orange-500" />
                        <div className="text-right">
                          <CardTitle className="text-2xl text-white">
                            {plan.name}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-white">
                          ${plan.price}
                        </span>
                        <span className="text-gray-400 ml-2">
                          /{plan.interval}
                        </span>
                      </div>
                      <CardDescription className="text-gray-400 mt-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleSubscriptionCheckout(plan.id)}
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {loading ? "Processing..." : "Get Started"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* One-Time Payment Tab */}
          <TabsContent value="one-time" className="mt-8">
            <div className="max-w-md mx-auto">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    One-Time Payment
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Make a single payment for our services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                  <Button
                    onClick={handleOneTimePayment}
                    disabled={loading || !amount || amount <= 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

