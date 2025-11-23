import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security Policy | Forger Digital",
  description: "Security Policy for Forger Digital - Our commitment to protecting your data and information security practices.",
}

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Security Policy
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: November 2, 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Our Commitment to Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                At Forger Digital, we take the security of your data seriously. We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. Data Encryption</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use encryption to protect data in transit and at rest:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li><strong>In Transit:</strong> All data transmitted between your device and our servers is encrypted using TLS (Transport Layer Security) 1.2 or higher</li>
                <li><strong>At Rest:</strong> Sensitive data stored on our servers is encrypted using industry-standard encryption algorithms</li>
                <li><strong>Database Security:</strong> Database connections are encrypted and access is restricted to authorized personnel only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Access Controls</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement strict access controls to ensure that only authorized personnel can access your data:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Multi-factor authentication (MFA) for all administrative accounts</li>
                <li>Role-based access control (RBAC) to limit access based on job responsibilities</li>
                <li>Regular access reviews and audits</li>
                <li>Principle of least privilege access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Infrastructure Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our infrastructure is designed with security in mind:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Regular security updates and patches</li>
                <li>Network segmentation and firewalls</li>
                <li>Intrusion detection and prevention systems</li>
                <li>DDoS protection and mitigation</li>
                <li>Regular vulnerability assessments and penetration testing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Incident Response</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In the event of a security incident, we have procedures in place to:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Immediately contain and mitigate the threat</li>
                <li>Investigate the cause and scope of the incident</li>
                <li>Notify affected users and relevant authorities as required by law</li>
                <li>Implement measures to prevent similar incidents in the future</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Third-Party Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We carefully vet third-party service providers and require them to maintain appropriate security standards. We conduct regular security assessments of our vendors and partners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We strive to comply with relevant security standards and regulations, including:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>ISO 27001 (Information Security Management)</li>
                <li>SOC 2 Type II (Security, Availability, Confidentiality)</li>
                <li>GDPR (General Data Protection Regulation)</li>
                <li>CCPA (California Consumer Privacy Act)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">8. Security Best Practices for Users</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We recommend the following security practices:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-gray-300">
                <li>Use strong, unique passwords for your accounts</li>
                <li>Enable multi-factor authentication when available</li>
                <li>Keep your software and devices updated</li>
                <li>Be cautious of phishing attempts and suspicious emails</li>
                <li>Report any security concerns immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">9. Reporting Security Issues</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you discover a security vulnerability, please report it to us at <a href="mailto:security@forgerdigital.com" className="text-orange-500 hover:underline">security@forgerdigital.com</a>. We appreciate responsible disclosure and will work with you to address any legitimate security concerns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For questions about our Security Policy, please contact us at <a href="mailto:info@forgerdigital.com" className="text-orange-500 hover:underline">info@forgerdigital.com</a>.
              </p>
            </section>

            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Disclaimer:</strong> This Security Policy is a template. Please consult with security and legal professionals to ensure it accurately reflects your security practices and complies with all applicable regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
