// Contract Template Generator
// Generates HTML contracts from input data

import type { ContractGenerationInput, ContractSections } from './types'
import { formatCurrency } from '../pricing-calculator/calculator'

/**
 * Generate a unique contract number
 */
export function generateContractNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CTR-${year}-${random}`
}

/**
 * Generate share token for secure contract access
 */
export function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

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
 * Generate contract sections from input data
 */
export function generateContractSections(input: ContractGenerationInput): ContractSections {
  const contractNumber = generateContractNumber()
  const effectiveDate = formatDate(input.startDate)
  
  const header = `
    <div class="contract-header">
      <div class="logo">
        <h1>${input.companyName}</h1>
      </div>
      <div class="contract-info">
        <h2>SERVICE AGREEMENT</h2>
        <p><strong>Contract Number:</strong> ${contractNumber}</p>
        <p><strong>Effective Date:</strong> ${effectiveDate}</p>
      </div>
    </div>
  `

  const parties = `
    <section class="section parties">
      <h3>1. PARTIES</h3>
      <p>This Service Agreement ("Agreement") is entered into as of <strong>${effectiveDate}</strong> by and between:</p>
      
      <div class="party">
        <h4>SERVICE PROVIDER:</h4>
        <p><strong>${input.companyName}</strong></p>
        <p>${input.companyAddress}</p>
        <p>Email: ${input.companyEmail}</p>
        ${input.companyPhone ? `<p>Phone: ${input.companyPhone}</p>` : ''}
      </div>

      <div class="party">
        <h4>CLIENT:</h4>
        <p><strong>${input.clientName}</strong></p>
        ${input.clientCompany ? `<p>${input.clientCompany}</p>` : ''}
        ${input.clientAddress ? `<p>${input.clientAddress}</p>` : ''}
        <p>Email: ${input.clientEmail}</p>
      </div>

      <p>Collectively referred to as the "Parties" and individually as a "Party".</p>
    </section>
  `

  const projectOverview = `
    <section class="section project-overview">
      <h3>2. PROJECT OVERVIEW</h3>
      <h4>Project Name: ${input.projectName}</h4>
      <p>${input.projectDescription}</p>
      ${input.techStack?.length ? `
        <h4>Technology Stack:</h4>
        <ul>
          ${input.techStack.map(tech => `<li>${tech}</li>`).join('')}
        </ul>
      ` : ''}
    </section>
  `

  const scopeOfWork = `
    <section class="section scope">
      <h3>3. SCOPE OF WORK</h3>
      <p>The Service Provider agrees to perform the following services:</p>
      <ul>
        ${input.scopeOfWork.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </section>
  `

  const deliverables = `
    <section class="section deliverables">
      <h3>4. DELIVERABLES</h3>
      <p>Upon completion, the Client will receive the following deliverables:</p>
      <ul>
        ${input.deliverables.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </section>
  `

  const timeline = `
    <section class="section timeline">
      <h3>5. PROJECT TIMELINE</h3>
      <table class="timeline-table">
        <tr>
          <td><strong>Start Date:</strong></td>
          <td>${formatDate(input.startDate)}</td>
        </tr>
        <tr>
          <td><strong>Estimated Completion:</strong></td>
          <td>${formatDate(input.endDate)}</td>
        </tr>
        <tr>
          <td><strong>Duration:</strong></td>
          <td>${input.timeline}</td>
        </tr>
        <tr>
          <td><strong>Estimated Hours:</strong></td>
          <td>${input.pricing.estimatedHours} hours</td>
        </tr>
      </table>
    </section>
  `

  const pricingBreakdown = input.pricing.breakdown.map(item => `
    <tr>
      <td>${item.featureName}</td>
      <td>${item.hours} hrs</td>
      <td class="amount">${formatCurrency(item.adjustedCost)}</td>
    </tr>
  `).join('')

  const pricing = `
    <section class="section pricing">
      <h3>6. PRICING</h3>
      
      <h4>Cost Breakdown:</h4>
      <table class="pricing-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Hours</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          ${pricingBreakdown}
        </tbody>
        <tfoot>
          <tr class="subtotal">
            <td colspan="2">Subtotal</td>
            <td class="amount">${formatCurrency(input.pricing.subtotal)}</td>
          </tr>
          ${input.pricing.discount > 0 ? `
          <tr class="discount">
            <td colspan="2">Volume Discount</td>
            <td class="amount">-${formatCurrency(input.pricing.discount)}</td>
          </tr>
          ` : ''}
          ${input.pricing.supportCost > 0 ? `
          <tr>
            <td colspan="2">Support Package</td>
            <td class="amount">${formatCurrency(input.pricing.supportCost)}</td>
          </tr>
          ` : ''}
          <tr class="total">
            <td colspan="2"><strong>TOTAL</strong></td>
            <td class="amount"><strong>${formatCurrency(input.pricing.total)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <p class="currency-note">All amounts are in ${input.pricing.currency}.</p>
    </section>
  `

  const milestoneRows = input.paymentSchedule.map((m, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${m.name}</td>
      <td>${m.percentage}%</td>
      <td class="amount">${formatCurrency(m.amount)}</td>
      <td>${m.dueDate}</td>
    </tr>
  `).join('')

  const paymentTerms = `
    <section class="section payment">
      <h3>7. PAYMENT TERMS</h3>
      
      <p>${input.paymentTerms || 'Payment is due according to the following milestone schedule:'}</p>
      
      <h4>Payment Schedule:</h4>
      <table class="payment-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Milestone</th>
            <th>%</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${milestoneRows}
        </tbody>
      </table>

      <h4>Payment Methods:</h4>
      <ul>
        <li>Bank transfer (wire/ACH)</li>
        <li>Credit card (3% processing fee applies)</li>
        <li>Check (US clients only)</li>
      </ul>

      <p><strong>Late Payment:</strong> A late fee of 1.5% per month will be applied to any overdue balance.</p>
    </section>
  `

  const termsAndConditions = `
    <section class="section terms">
      <h3>8. TERMS AND CONDITIONS</h3>
      
      <h4>8.1 Changes to Scope</h4>
      <p>Any changes to the project scope must be agreed upon in writing by both parties. Additional work will be billed at the applicable hourly rate.</p>
      
      <h4>8.2 Client Responsibilities</h4>
      <ul>
        <li>Provide timely feedback and approvals (within 5 business days)</li>
        <li>Supply all necessary content, assets, and access credentials</li>
        <li>Designate a primary point of contact for communications</li>
        <li>Ensure availability for scheduled meetings and reviews</li>
      </ul>

      <h4>8.3 Communication</h4>
      <p>Regular project updates will be provided via email and scheduled meetings. Response time for queries is within 24 business hours.</p>

      ${input.revisionPolicy ? `
      <h4>8.4 Revisions</h4>
      <p>${input.revisionPolicy}</p>
      ` : `
      <h4>8.4 Revisions</h4>
      <p>This agreement includes up to two (2) rounds of revisions per deliverable. Additional revisions will be billed at the applicable hourly rate.</p>
      `}
    </section>
  `

  const confidentiality = input.confidentialityClause !== false ? `
    <section class="section confidentiality">
      <h3>9. CONFIDENTIALITY</h3>
      <p>Both parties agree to maintain the confidentiality of all proprietary information, trade secrets, and business information exchanged during the course of this Agreement. This obligation shall survive the termination of this Agreement for a period of two (2) years.</p>
      
      <p>Confidential information includes but is not limited to:</p>
      <ul>
        <li>Business strategies and plans</li>
        <li>Customer and client data</li>
        <li>Technical specifications and source code</li>
        <li>Financial information</li>
        <li>Marketing and sales data</li>
      </ul>
    </section>
  ` : ''

  const intellectualProperty = `
    <section class="section ip">
      <h3>10. INTELLECTUAL PROPERTY</h3>
      
      <h4>10.1 Work Product</h4>
      <p>Upon full payment, all custom work product created specifically for this project shall be assigned to the Client, including:</p>
      <ul>
        <li>Custom source code and software</li>
        <li>Design assets and graphics</li>
        <li>Documentation and specifications</li>
      </ul>

      <h4>10.2 Pre-existing Materials</h4>
      <p>The Service Provider retains ownership of all pre-existing tools, frameworks, libraries, and methodologies. Client receives a perpetual, non-exclusive license to use such materials as part of the deliverables.</p>

      <h4>10.3 Third-Party Components</h4>
      <p>Any third-party software or components will be licensed according to their respective license terms. The Service Provider will provide documentation of all third-party licenses.</p>
    </section>
  `

  const termination = `
    <section class="section termination">
      <h3>11. TERMINATION</h3>
      
      <h4>11.1 Termination for Convenience</h4>
      <p>Either party may terminate this Agreement with thirty (30) days written notice. Client shall pay for all work completed up to the termination date.</p>

      <h4>11.2 Termination for Cause</h4>
      <p>Either party may terminate immediately upon material breach by the other party, provided that the breaching party has been given written notice and fifteen (15) days to cure such breach.</p>

      <h4>11.3 Effect of Termination</h4>
      <p>Upon termination, the Client will receive all completed work and work-in-progress. Any prepaid amounts for incomplete work will be refunded on a prorated basis.</p>
    </section>
  `

  const warranty = `
    <section class="section warranty">
      <h3>12. WARRANTY</h3>
      <p>The Service Provider warrants that all deliverables will be free from material defects for a period of ${input.warrantyPeriod || 'thirty (30) days'} following final delivery and acceptance.</p>
      
      <p>During the warranty period, the Service Provider will:</p>
      <ul>
        <li>Fix any bugs or defects at no additional cost</li>
        <li>Respond to critical issues within 24 hours</li>
        <li>Provide reasonable support for implementation questions</li>
      </ul>

      <p><strong>Limitation:</strong> This warranty does not cover issues caused by Client modifications, third-party integrations, or use outside the intended scope.</p>
    </section>
  `

  const signatures = `
    <section class="section signatures">
      <h3>13. SIGNATURES</h3>
      <p>By signing below, both parties agree to be bound by the terms and conditions of this Agreement.</p>
      
      <div class="signature-block">
        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>Service Provider:</strong> ${input.companyName}</p>
          <p>Authorized Representative: _________________________</p>
          <p>Date: _________________________</p>
        </div>

        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>Client:</strong> ${input.clientName}</p>
          ${input.clientCompany ? `<p>Company: ${input.clientCompany}</p>` : ''}
          <p>Date: _________________________</p>
        </div>
      </div>
    </section>
  `

  return {
    header,
    parties,
    projectOverview,
    scopeOfWork,
    deliverables,
    timeline,
    pricing,
    paymentTerms,
    termsAndConditions,
    confidentiality,
    intellectualProperty,
    termination,
    warranty,
    signatures
  }
}

/**
 * Generate complete HTML contract document
 */
export function generateContractHTML(input: ContractGenerationInput): string {
  const sections = generateContractSections(input)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Agreement - ${input.projectName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
      background: white;
    }

    .contract-header {
      text-align: center;
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .contract-header h1 {
      font-size: 24pt;
      color: #1a1a1a;
      margin-bottom: 10px;
    }

    .contract-header h2 {
      font-size: 16pt;
      font-weight: normal;
      margin-top: 15px;
      letter-spacing: 2px;
    }

    .contract-header p {
      margin: 5px 0;
      font-size: 10pt;
    }

    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }

    h3 {
      font-size: 13pt;
      color: #1a1a1a;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }

    h4 {
      font-size: 11pt;
      margin: 15px 0 10px 0;
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

    .party {
      background: #f8f8f8;
      padding: 15px;
      margin: 15px 0;
      border-left: 3px solid #1a1a1a;
    }

    .party h4 {
      margin: 0 0 10px 0;
      font-size: 10pt;
      color: #666;
    }

    .party p {
      margin: 3px 0;
      text-align: left;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: left;
    }

    th {
      background: #f0f0f0;
      font-weight: bold;
    }

    .amount {
      text-align: right;
      font-family: 'Courier New', monospace;
    }

    .pricing-table tfoot tr.subtotal td {
      border-top: 2px solid #666;
    }

    .pricing-table tfoot tr.total td {
      background: #f0f0f0;
      font-size: 12pt;
    }

    .pricing-table tfoot tr.discount td {
      color: #0a6b0a;
    }

    .currency-note {
      font-size: 9pt;
      color: #666;
      font-style: italic;
    }

    .timeline-table {
      width: auto;
    }

    .timeline-table td {
      padding: 8px 20px 8px 0;
      border: none;
    }

    .timeline-table td:first-child {
      color: #666;
    }

    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
    }

    .signature {
      width: 45%;
    }

    .signature-line {
      border-bottom: 1px solid #1a1a1a;
      height: 60px;
      margin-bottom: 10px;
    }

    .signature p {
      margin: 5px 0;
      font-size: 10pt;
      text-align: left;
    }

    @media print {
      body {
        padding: 0;
      }
      
      .section {
        page-break-inside: avoid;
      }

      .signatures {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  ${sections.header}
  ${sections.parties}
  ${sections.projectOverview}
  ${sections.scopeOfWork}
  ${sections.deliverables}
  ${sections.timeline}
  ${sections.pricing}
  ${sections.paymentTerms}
  ${sections.termsAndConditions}
  ${sections.confidentiality}
  ${sections.intellectualProperty}
  ${sections.termination}
  ${sections.warranty}
  ${sections.signatures}

  <footer style="margin-top: 50px; text-align: center; color: #666; font-size: 9pt; border-top: 1px solid #ccc; padding-top: 15px;">
    <p>This document was generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
    <p>Terms Version: ${input.termsVersion}</p>
  </footer>
</body>
</html>
  `.trim()
}

/**
 * Convert HTML to plain text for storage/indexing
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

