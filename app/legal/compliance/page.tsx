import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compliance | Forger Digital",
  description: "Compliance information for Forger Digital - Our commitment to regulatory compliance and standards.",
}

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Compliance
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: November 2, 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Our Commitment to Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Forger Digital is committed to maintaining compliance with applicable laws, regulations, and industry standards. We regularly review and update our practices to ensure ongoing compliance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. Data Protection Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We comply with data protection regulations including:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>GDPR (General Data Protection Regulation):</strong> For users in the European Union, we comply with GDPR requirements for data collection, processing, and protection</li>
                <li><strong>CCPA (California Consumer Privacy Act):</strong> For California residents, we respect your privacy rights under CCPA</li>
                <li><strong>PIPEDA (Personal Information Protection and Electronic Documents Act):</strong> For Canadian users, we comply with PIPEDA requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Industry Standards</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We adhere to relevant industry standards and certifications:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>ISO 27001:</strong> Information Security Management Systems</li>
                <li><strong>SOC 2 Type II:</strong> Security, Availability, Confidentiality, Processing Integrity, and Privacy</li>
                <li><strong>OWASP:</strong> Following OWASP security best practices for web applications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Accessibility Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We strive to make our services accessible to all users:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>WCAG 2.1 Level AA compliance for web accessibility</li>
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>Alt text for images and visual content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Financial Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For financial transactions and data handling, we comply with:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>PCI DSS (Payment Card Industry Data Security Standard) for payment processing</li>
                <li>Banking regulations applicable to our operations</li>
                <li>Anti-money laundering (AML) requirements where applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Export Control Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We comply with applicable export control laws and regulations. Our services and technology are subject to export control restrictions and may require authorization before export or re-export.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Ongoing Compliance Monitoring</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We maintain compliance through:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Regular compliance audits and assessments</li>
                <li>Employee training on compliance requirements</li>
                <li>Regular review and updates of policies and procedures</li>
                <li>Documentation of compliance activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">8. Compliance Documentation</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Key compliance documents include:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security Policy</li>
                <li>Data Processing Agreements (for applicable clients)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">9. Reporting Compliance Issues</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have concerns about our compliance with any regulation or standard, please contact us at <a href="mailto:compliance@forgerdigital.com" className="text-orange-500 hover:underline">compliance@forgerdigital.com</a>. We take all compliance-related inquiries seriously and will investigate promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For questions about our compliance practices, please contact us at <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">info@forgerdigital.com</a>.
              </p>
            </section>

            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Disclaimer:</strong> This Compliance page is a template. Please consult with legal and compliance professionals to ensure it accurately reflects your compliance obligations and is updated regularly to reflect changes in applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
