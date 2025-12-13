// Master Services Agreement (MSA) Template
// Based on Forger Digital's professional contract model

import type { ContractGenerationInput } from './types'
import { formatCurrency } from '../pricing-calculator/calculator'

/**
 * Format date for contract display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Format date as short format (MM/DD/YYYY)
 */
function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

/**
 * Generate MSA HTML contract document
 */
export function generateMSAContract(input: ContractGenerationInput): string {
  const effectiveDate = formatDate(input.startDate)
  const shortDate = formatShortDate(input.startDate)
  
  // Calculate milestone payments
  const milestone1Amount = Math.round(input.pricing.total * 0.4)
  const milestone2Amount = input.pricing.total - milestone1Amount
  
  // Generate phases based on features selected
  const phases = generateProjectPhases(input)
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Master Services Agreement - ${input.projectName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
      background: white;
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      max-width: 200px;
      height: auto;
    }

    .logo-text {
      font-size: 28pt;
      font-weight: bold;
      background: linear-gradient(135deg, #f97316, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .contract-header {
      text-align: center;
      border-bottom: 3px solid #f97316;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .contract-header h1 {
      font-size: 22pt;
      color: #1a1a1a;
      margin-bottom: 5px;
      letter-spacing: 1px;
    }

    .contract-header h2 {
      font-size: 11pt;
      font-weight: normal;
      color: #666;
    }

    .meta-info {
      background: #f8f9fa;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border-left: 4px solid #f97316;
    }

    .meta-info p {
      margin: 5px 0;
      font-size: 10.5pt;
    }

    .meta-info strong {
      display: inline-block;
      width: 120px;
      color: #333;
    }

    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e5e7eb;
    }

    .section-content {
      padding-left: 10px;
    }

    p {
      margin-bottom: 10px;
      text-align: justify;
    }

    ul {
      margin: 10px 0 10px 25px;
    }

    li {
      margin-bottom: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10pt;
    }

    th, td {
      border: 1px solid #d1d5db;
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }

    .amount {
      text-align: right;
      font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
      font-weight: 600;
    }

    .total-row {
      background: #fef3c7;
      font-weight: bold;
    }

    .total-row td {
      border-top: 2px solid #f97316;
    }

    .highlight-box {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 6px;
      padding: 12px 15px;
      margin: 15px 0;
    }

    .warning-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 12px 15px;
      margin: 15px 0;
      font-size: 10pt;
    }

    .signature-section {
      margin-top: 50px;
      page-break-inside: avoid;
    }

    .signature-title {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
      color: #1a1a1a;
    }

    .signature-grid {
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }

    .signature-block {
      flex: 1;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .signature-block h4 {
      font-size: 10pt;
      color: #6b7280;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .signature-line {
      border-bottom: 1px solid #1a1a1a;
      height: 50px;
      margin-bottom: 8px;
    }

    .signature-block p {
      margin: 4px 0;
      font-size: 9.5pt;
      text-align: left;
    }

    .page-break {
      page-break-before: always;
    }

    .annex-header {
      text-align: center;
      background: linear-gradient(135deg, #1f2937, #374151);
      color: white;
      padding: 20px;
      margin: -0.75in -0.75in 30px -0.75in;
    }

    .annex-header h2 {
      font-size: 18pt;
      margin-bottom: 5px;
    }

    .annex-header p {
      font-size: 10pt;
      color: #d1d5db;
      text-align: center;
    }

    .phase-table th {
      background: #1f2937;
      color: white;
    }

    .phase-table tr:nth-child(even) {
      background: #f9fafb;
    }

    .contact-card {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }

    .contact-card h5 {
      font-size: 11pt;
      color: #f97316;
      margin-bottom: 8px;
    }

    .contact-card p {
      margin: 3px 0;
      font-size: 10pt;
      text-align: left;
    }

    .footer {
      margin-top: 40px;
      text-align: center;
      color: #6b7280;
      font-size: 9pt;
      border-top: 1px solid #e5e7eb;
      padding-top: 15px;
    }

    .page-number {
      text-align: center;
      font-size: 9pt;
      color: #9ca3af;
      margin-top: 20px;
    }

    @media print {
      body {
        padding: 0.5in;
      }
      
      .section {
        page-break-inside: avoid;
      }

      .signature-section {
        page-break-inside: avoid;
      }

      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <!-- Logo & Header -->
  <div class="logo">
    <div class="logo-text">Forger Digital</div>
    <p style="color: #6b7280; font-size: 10pt; margin-top: 5px;">Transforming vision into robust digital reality</p>
  </div>

  <div class="contract-header">
    <h1>Master Services Agreement (MSA)</h1>
    <h2>Professional Services Contract</h2>
  </div>

  <!-- Meta Information -->
  <div class="meta-info">
    <p><strong>Effective Date:</strong> ${effectiveDate}</p>
    <p><strong>Client:</strong> ${input.clientName}${input.clientCompany ? ` - ${input.clientCompany}` : ''}</p>
    <p><strong>Project Name:</strong> ${input.projectName}</p>
  </div>

  <!-- Section 1: Scope -->
  <div class="section">
    <div class="section-title">1. Scope</div>
    <div class="section-content">
      <p>Services are defined in the attached Statement of Work (SOW). The SOW including deliverables, timeline, and acceptance criteria is incorporated by reference. Changes require a signed Change Order.</p>
      
      <div class="highlight-box">
        <strong>Project Description:</strong><br>
        ${input.projectDescription}
      </div>
    </div>
  </div>

  <!-- Section 2: Fees & Payment -->
  <div class="section">
    <div class="section-title">2. Fees & Payment</div>
    <div class="section-content">
      <table>
        <tr>
          <td style="width: 40%;"><strong>Total Project Fee</strong></td>
          <td class="amount" style="font-size: 14pt; color: #f97316;">${formatCurrency(input.pricing.total)}</td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Percentage</th>
            <th>Amount</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Milestone 1</strong> - Project Kickoff</td>
            <td>40%</td>
            <td class="amount">${formatCurrency(milestone1Amount)}</td>
            <td>Within 5 business days of signing this MSA and SOW approval</td>
          </tr>
          <tr>
            <td><strong>Milestone 2</strong> - Final Delivery</td>
            <td>60%</td>
            <td class="amount">${formatCurrency(milestone2Amount)}</td>
            <td>Within 5 business days of Client's written acceptance of final deliverables</td>
          </tr>
          <tr class="total-row">
            <td colspan="2"><strong>Total</strong></td>
            <td class="amount">${formatCurrency(input.pricing.total)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="warning-box">
        <strong>⚠️ Important:</strong> Work begins only after Milestone 1 is received. Late payments incur 1.5% monthly interest (NY statutory max).
      </div>
    </div>
  </div>

  <!-- Section 3: Intellectual Property -->
  <div class="section">
    <div class="section-title">3. Intellectual Property</div>
    <div class="section-content">
      <ul>
        <li>All deliverables (code, designs, documentation) are <strong>"work made for hire"</strong> owned by Client <strong>upon full payment</strong>.</li>
        <li>Forger Digital retains rights to pre-existing tools, frameworks, and generic libraries ("<strong>Background IP</strong>").</li>
      </ul>
    </div>
  </div>

  <!-- Section 4: Confidentiality -->
  <div class="section">
    <div class="section-title">4. Confidentiality</div>
    <div class="section-content">
      <p>Parties will protect each other's Confidential Information (as defined in SOW) for <strong>3 years</strong> post-termination.</p>
    </div>
  </div>

  <!-- Section 5: Warranty & Support -->
  <div class="section">
    <div class="section-title">5. Warranty & Support</div>
    <div class="section-content">
      <ul>
        <li><strong>30-day warranty:</strong> Forger Digital will remediate material defects in accepted deliverables at no cost.</li>
        <li>Post-warranty support available under a separate Maintenance Agreement.</li>
      </ul>
    </div>
  </div>

  <!-- Section 6: Limitation of Liability -->
  <div class="section">
    <div class="section-title">6. Limitation of Liability</div>
    <div class="section-content">
      <p>Total liability capped at fees paid under this agreement.</p>
      <p><strong>Excludes:</strong> (a) confidentiality breaches, (b) willful misconduct.</p>
    </div>
  </div>

  <!-- Section 7: Term & Termination -->
  <div class="section">
    <div class="section-title">7. Term & Termination</div>
    <div class="section-content">
      <ul>
        <li>Term ends upon final delivery, acceptance, and payment.</li>
        <li>Either party may terminate for uncured material breach (30-day cure period).</li>
        <li>Upon termination, Client pays for all accepted work; Forger delivers completed work-in-progress.</li>
      </ul>
    </div>
  </div>

  <!-- Section 8: Governing Law -->
  <div class="section">
    <div class="section-title">8. Governing Law</div>
    <div class="section-content">
      <p><strong>New York law.</strong> Venue: state or federal courts in New York County.</p>
    </div>
  </div>

  <!-- Signatures -->
  <div class="signature-section">
    <div class="signature-title">Signatures</div>
    <div class="signature-grid">
      <div class="signature-block">
        <h4>Forger Digital</h4>
        <div class="signature-line"></div>
        <p><strong>Rafael Corporan</strong></p>
        <p>Founder & Director of Engineering</p>
        <p>Date: _______________________</p>
      </div>
      <div class="signature-block">
        <h4>Client</h4>
        <div class="signature-line"></div>
        <p><strong>${input.clientName}</strong></p>
        ${input.clientCompany ? `<p>${input.clientCompany}</p>` : ''}
        <p>Date: _______________________</p>
      </div>
    </div>
  </div>

  <div class="page-number">Page 1 of 3</div>

  <!-- SOW ANNEX - Page 2 -->
  <div class="page-break"></div>
  
  <div class="annex-header">
    <h2>STATEMENT OF WORK (SOW) ANNEX</h2>
    <p>For Project: ${input.projectName}</p>
    <p>Effective Date: ${effectiveDate} | Attached to and governed by MSA dated ${effectiveDate}</p>
  </div>

  <!-- SOW Section 1: Project Overview -->
  <div class="section">
    <div class="section-title">1. Project Overview</div>
    <div class="section-content">
      <p>Forger Digital will deliver a bespoke digital solution aligned with Client's strategic objectives in one or more of the following domains:</p>
      
      <div class="highlight-box">
        <strong>Custom Software</strong> | <strong>Web/Mobile Apps</strong> | <strong>Enterprise Systems</strong> | <strong>AI/ML</strong> | <strong>Blockchain</strong> | <strong>IoT</strong>
      </div>
      
      <p>This SOW implements Forger Digital's <strong>"Quantum Leap"</strong> methodology: strategic scoping → agile delivery → seamless handover.</p>
      
      ${input.techStack?.length ? `
      <p><strong>Technology Stack:</strong></p>
      <ul>
        ${input.techStack.map(tech => `<li>${tech}</li>`).join('')}
      </ul>
      ` : ''}
    </div>
  </div>

  <!-- SOW Section 2: Phases & Deliverables -->
  <div class="section">
    <div class="section-title">2. Phases, Deliverables & Acceptance Criteria</div>
    <div class="section-content">
      <table class="phase-table">
        <thead>
          <tr>
            <th style="width: 20%;">Phase</th>
            <th style="width: 35%;">Key Deliverables</th>
            <th style="width: 30%;">Acceptance Criteria</th>
            <th style="width: 15%;">Timeline</th>
          </tr>
        </thead>
        <tbody>
          ${phases}
        </tbody>
      </table>

      <div class="highlight-box">
        <strong>Acceptance Testing Window:</strong> 10 business days from delivery of each phase (unless otherwise agreed).<br>
        <em>Failure to respond within window = deemed acceptance.</em>
      </div>
    </div>
  </div>

  <div class="page-number">Page 2 of 3</div>

  <!-- SOW Page 3 -->
  <div class="page-break"></div>

  <!-- SOW Section 3: Technical Environment -->
  <div class="section">
    <div class="section-title">3. Technical Environment & Requirements</div>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Responsibility</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Hosting</strong></td>
            <td>Client / AWS/Azure/GCP</td>
            <td>Specify region, compliance (e.g., SOC 2, HIPAA), backup strategy</td>
          </tr>
          <tr>
            <td><strong>Third-Party Systems</strong></td>
            <td>Client provides API access & sandbox credentials</td>
            <td>ERP (e.g., SAP, Oracle), CRM (e.g., Salesforce), payment gateways</td>
          </tr>
          <tr>
            <td><strong>Data & AI</strong></td>
            <td>Client warrants rights to data</td>
            <td>Forger implements no data retained post-project</td>
          </tr>
          <tr>
            <td><strong>Security</strong></td>
            <td>Forger follows OWASP Top 10</td>
            <td>Encrypts in transit & at rest. Pen-test optional (quoted separately)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- SOW Section 4: Key Contacts -->
  <div class="section">
    <div class="section-title">4. Key Contacts & Decision Rights</div>
    <div class="section-content">
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div class="contact-card" style="flex: 1; min-width: 200px;">
          <h5>Forger Digital</h5>
          <p><strong>Rafael Corporan</strong></p>
          <p>Founder & Director of Engineering</p>
          <p>📧 rcorporan@forgerdigital.com</p>
          <p>📞 +1 (347) 829-4952</p>
        </div>
        <div class="contact-card" style="flex: 1; min-width: 200px;">
          <h5>Client Sponsor</h5>
          <p><strong>${input.clientName}</strong></p>
          <p>Budget approval, project go/no-go</p>
          <p>📧 ${input.clientEmail}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- SOW Section 5: Assumptions & Exclusions -->
  <div class="section">
    <div class="section-title">5. Assumptions & Exclusions</div>
    <div class="section-content">
      <div style="display: flex; gap: 30px;">
        <div style="flex: 1;">
          <p><strong style="color: #16a34a;">✓ Included:</strong></p>
          <ul>
            <li>2 rounds of revision per phase</li>
            <li>Standard integrations (REST/JSON)</li>
            <li>Documentation in English (Markdown/PDF)</li>
            <li>30-day post-launch warranty support</li>
          </ul>
        </div>
        <div style="flex: 1;">
          <p><strong style="color: #dc2626;">✗ Excluded (require Change Order):</strong></p>
          <ul>
            <li>Custom hardware procurement</li>
            <li>Regulatory certification (e.g., FDA, FCC)</li>
            <li>Ongoing maintenance beyond 30-day warranty</li>
            <li>Non-English localization</li>
          </ul>
        </div>
      </div>

      <div class="highlight-box" style="margin-top: 20px;">
        <strong>Agreement:</strong> This SOW, together with the MSA, forms the complete agreement. All deliverables subject to IP assignment in MSA Section 3.
      </div>
    </div>
  </div>

  <!-- Cost Breakdown -->
  <div class="section">
    <div class="section-title">6. Cost Breakdown</div>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Hours</th>
            <th style="text-align: right;">Cost</th>
          </tr>
        </thead>
        <tbody>
          ${input.pricing.breakdown.map(item => `
            <tr>
              <td>${item.featureName}</td>
              <td>${item.hours} hrs</td>
              <td class="amount">${formatCurrency(item.adjustedCost)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td><strong>Total</strong></td>
            <td><strong>${input.pricing.estimatedHours} hrs</strong></td>
            <td class="amount"><strong>${formatCurrency(input.pricing.total)}</strong></td>
          </tr>
        </tbody>
      </table>
      <p style="font-size: 9pt; color: #6b7280; text-align: right;">Estimated Duration: ${input.pricing.estimatedDuration}</p>
    </div>
  </div>

  <div class="footer">
    <p>This document was generated on ${formatDate(new Date())}.</p>
    <p>Forger Digital • San Francisco, CA • hello@forgerdigital.com • +1 (347) 829-4952</p>
    <p style="margin-top: 10px; color: #9ca3af;">Terms Version: ${input.termsVersion}</p>
  </div>

  <div class="page-number">Page 3 of 3</div>

</body>
</html>
  `.trim()
}

/**
 * Generate project phases based on selected features
 */
function generateProjectPhases(input: ContractGenerationInput): string {
  // Default phases based on typical project structure
  const phases = [
    {
      name: 'Phase 1: Discovery & Design',
      deliverables: [
        'Technical Requirements Spec (TRS)',
        'System Architecture Diagram',
        'UX Wireframes & User Flows',
        'Risk & Integration Assessment'
      ],
      criteria: 'TRS & architecture approved in writing by Client stakeholder(s)',
      timeline: '2–3 weeks'
    },
    {
      name: 'Phase 2: MVP Build',
      deliverables: [
        'Core feature implementation',
        'Secure REST/GraphQL API',
        'Admin dashboard (MVP)',
        'CI/CD pipeline',
        'Test suite (unit/integration)'
      ],
      criteria: 'Successful internal QA + demo sign-off by Client. Zero critical bugs (P0/P1)',
      timeline: '6–10 weeks'
    },
    {
      name: 'Phase 3: Enhancement & Integration',
      deliverables: [
        'Advanced modules per SOW',
        'Third-party integrations',
        'Performance & security hardening',
        'UAT test plan & results'
      ],
      criteria: 'All integrations validated; <5 medium bugs; UAT passed per agreed test cases',
      timeline: '4–8 weeks'
    },
    {
      name: 'Phase 4: Deployment & KT',
      deliverables: [
        'Production deployment',
        'Full documentation (tech + user)',
        'Training (2 sessions)',
        '30-day post-launch support'
      ],
      criteria: 'System live in production; documentation delivered; Client confirms completion via sign-off form',
      timeline: '2 weeks'
    }
  ]

  return phases.map(phase => `
    <tr>
      <td><strong>${phase.name}</strong></td>
      <td>
        <ul style="margin: 0; padding-left: 15px;">
          ${phase.deliverables.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </td>
      <td>${phase.criteria}</td>
      <td>${phase.timeline}</td>
    </tr>
  `).join('')
}

