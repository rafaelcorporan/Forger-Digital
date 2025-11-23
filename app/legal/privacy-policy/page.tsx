import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Forger Digital",
  description: "Privacy Policy for Forger Digital - How we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: November 2, 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Forger Digital collects various types of information in connection with the services we provide:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>Personal Identifiable Information (PII):</strong> Name, email address, phone number, company name, and any other information you voluntarily provide through forms or direct communication.</li>
                <li><strong>Usage Data:</strong> Information on how the service is accessed and used (e.g., IP address, browser type, pages visited, time spent on pages).</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To send you marketing and promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Sharing Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may share your personal information with:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>Service Providers:</strong> Third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services or assist us in analyzing how our service is used.</li>
                <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Your Data Protection Rights (GDPR & CCPA)</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have the following data protection rights:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>The right to access, update or delete the information we have on you</li>
                <li>The right of rectification</li>
                <li>The right to object</li>
                <li>The right of restriction</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                To exercise any of these rights, please contact us at <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">info@forgerdigital.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">info@forgerdigital.com</a>.
              </p>
            </section>

            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Disclaimer:</strong> This Privacy Policy is a template. Please consult with a legal professional to ensure it is specific to your business operations and complies with all applicable laws and regulations (e.g., GDPR, CCPA, PIPEDA).
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
