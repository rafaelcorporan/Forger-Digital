import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Forger Digital",
  description: "Terms of Service for Forger Digital - Legal agreement governing the use of our services.",
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: November 2, 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By accessing or using the services of Forger Digital ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. Use of Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our services are provided for legitimate business purposes. You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Use the services in any way that violates any applicable national or international law or regulation</li>
                <li>Transmit any worms or viruses or any code of a destructive nature</li>
                <li>Attempt to gain unauthorized access to any portion of the services</li>
                <li>Interfere with or disrupt the services or servers connected to the services</li>
                <li>Use the services to transmit any unsolicited or unauthorized advertising or promotional materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Forger Digital and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Service Modifications</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice. We will not be liable if, for any reason, all or any part of the Service is unavailable at any time or for any period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In no event shall Forger Digital, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, Forger Digital excludes all representations, warranties, conditions, and terms relating to our Service and the use of this Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">8. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">9. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">info@forgerdigital.com</a>.
              </p>
            </section>

            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Disclaimer:</strong> These Terms of Service are a template. Please consult with a legal professional to ensure they are specific to your business operations and comply with all applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
