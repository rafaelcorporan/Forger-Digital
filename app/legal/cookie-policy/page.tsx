import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy | Forger Digital",
  description: "Cookie Policy for Forger Digital - Learn about how we use cookies and similar tracking technologies.",
}

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: January 15, 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                This Cookie Policy explains how Forger Digital ("we", "us", or "our") uses cookies and similar tracking technologies on our website. This policy should be read in conjunction with our Privacy Policy, which provides additional information about how we collect, use, and protect your personal information.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                By using our website, you consent to the use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. What Are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-orange-300">3.1 Strictly Necessary Cookies</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies as they are necessary for the website to operate.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                  <li>Authentication cookies to keep you logged in</li>
                  <li>Security cookies to protect against fraud</li>
                  <li>Load balancing cookies to distribute traffic</li>
                  <li>Session cookies to maintain your session</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-orange-300">3.2 Analytics Cookies</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                  <li>Google Analytics cookies to track page views and user behavior</li>
                  <li>Performance monitoring cookies to identify slow-loading pages</li>
                  <li>Error tracking cookies to identify and fix bugs</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong>Third-Party Services:</strong> We use Google Analytics, which may set cookies on your device. You can opt-out of Google Analytics by visiting{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                    Google Analytics Opt-out
                  </a>.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-orange-300">3.3 Marketing Cookies</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                  <li>Advertising network cookies to deliver targeted ads</li>
                  <li>Social media cookies to track sharing and engagement</li>
                  <li>Retargeting cookies to show you relevant ads on other websites</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Purpose of Each Cookie Type</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700 mb-4">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 p-3 text-left text-orange-400">Cookie Type</th>
                      <th className="border border-gray-700 p-3 text-left text-orange-400">Purpose</th>
                      <th className="border border-gray-700 p-3 text-left text-orange-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-700 p-3 text-gray-300">Strictly Necessary</td>
                      <td className="border border-gray-700 p-3 text-gray-300">Essential website functionality</td>
                      <td className="border border-gray-700 p-3 text-gray-300">Session or up to 1 year</td>
                    </tr>
                    <tr className="bg-gray-800/50">
                      <td className="border border-gray-700 p-3 text-gray-300">Analytics</td>
                      <td className="border border-gray-700 p-3 text-gray-300">Website performance and user behavior analysis</td>
                      <td className="border border-gray-700 p-3 text-gray-300">Up to 2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-700 p-3 text-gray-300">Marketing</td>
                      <td className="border border-gray-700 p-3 text-gray-300">Advertising and marketing campaigns</td>
                      <td className="border border-gray-700 p-3 text-gray-300">Up to 1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements, and so on. These third-party services may set their own cookies on your device.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Third-Party Services We Use:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>Google Analytics:</strong> Web analytics service provided by Google, Inc.</li>
                <li><strong>Vercel Analytics:</strong> Performance and analytics service provided by Vercel, Inc.</li>
                <li><strong>Sentry:</strong> Error tracking and performance monitoring service</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                These third-party services have their own privacy policies and cookie practices. We encourage you to review their policies to understand how they use cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Managing Your Cookie Preferences</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>How to Manage Cookies in Your Browser:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                You can also manage your cookie preferences directly on our website by clicking the "Manage Cookies" link in the footer or by using our cookie consent pop-up.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Note:</strong> If you choose to disable cookies, some features of our website may not function properly, and your user experience may be affected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Your Rights (GDPR & CCPA)</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Under applicable data protection laws, including GDPR (for EU residents) and CCPA (for California residents), you have certain rights regarding cookies and your personal data:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>The right to be informed about the use of cookies</li>
                <li>The right to consent to or reject non-essential cookies</li>
                <li>The right to withdraw your consent at any time</li>
                <li>The right to access information about cookies used on our website</li>
                <li>The right to request deletion of cookies and associated data</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                To exercise these rights, please contact us at <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">info@forgerdigital.com</a> or use the "Manage Cookies" option on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">8. Changes to This Cookie Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">9. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us at:
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-300 mb-2">
                  <strong className="text-orange-400">Email:</strong>{" "}
                  <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">
                    info@forgerdigital.com
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong className="text-orange-400">Website:</strong>{" "}
                  <a href="https://www.forgerdigital.com" className="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    www.forgerdigital.com
                  </a>
                </p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Disclaimer:</strong> This Cookie Policy is a template. Please consult with a legal professional to ensure it is specific to your business operations and complies with all applicable laws and regulations (e.g., GDPR, CCPA, ePrivacy Directive).
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

