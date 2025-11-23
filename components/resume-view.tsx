"use client"

import type { StaffMember, ProfessionalExperience, Education, Certification } from "@/lib/teamData"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"

interface ResumeViewProps {
  staff: StaffMember
}

export function ResumeView({ staff }: ResumeViewProps) {
  const formatDate = (date: string) => date

  return (
    <div className="space-y-8">
      {/* Professional Summary */}
      {staff.professionalSummary && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{staff.professionalSummary}</p>
        </section>
      )}

      {/* Contact Information */}
      {staff.contactInfo && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {staff.contactInfo.email && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${staff.contactInfo.email}`} className="hover:text-orange-500 transition-colors">
                  {staff.contactInfo.email}
                </a>
              </div>
            )}
            {staff.contactInfo.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href={`tel:${staff.contactInfo.phone}`} className="hover:text-orange-500 transition-colors">
                  {staff.contactInfo.phone}
                </a>
              </div>
            )}
            {staff.contactInfo.location && (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{staff.contactInfo.location}</span>
              </div>
            )}
            {staff.contactInfo.linkedIn && (
              <div className="flex items-center gap-2 text-gray-700">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <a
                  href={staff.contactInfo.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition-colors"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {staff.contactInfo.portfolio && (
              <div className="flex items-center gap-2 text-gray-700">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <a
                  href={staff.contactInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition-colors"
                >
                  Portfolio
                </a>
              </div>
            )}
            {staff.contactInfo.github && (
              <div className="flex items-center gap-2 text-gray-700">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <a
                  href={staff.contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition-colors"
                >
                  GitHub
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Core Competencies / Skills */}
      {(staff.skills || staff.roleTags) && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
            Core Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {staff.roleTags.map((tag) => (
              <span
                key={tag}
                className="text-sm py-1.5 px-4 rounded-full border border-gray-900 bg-sky-100 text-sky-700 font-medium"
              >
                {tag}
              </span>
            ))}
            {staff.skills?.map((skill) => (
              <span
                key={skill}
                className="text-sm py-1.5 px-4 rounded-full border border-gray-900 bg-sky-100 text-sky-700 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {staff.workExperience && staff.workExperience.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Professional Experience
          </h3>
          <div className="space-y-6">
            {staff.workExperience.map((exp: ProfessionalExperience, index: number) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-base font-medium text-gray-700">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mt-1 md:mt-0">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-700 text-sm leading-relaxed flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {staff.education && staff.education.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Education
          </h3>
          <div className="space-y-4">
            {staff.education.map((edu: Education, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-base text-gray-700">{edu.institution}</p>
                {edu.fieldOfStudy && <p className="text-sm text-gray-600">Field: {edu.fieldOfStudy}</p>}
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-gray-600">Graduated: {formatDate(edu.graduationDate)}</p>
                  {edu.honors && (
                    <Badge variant="secondary" className="text-xs">
                      {edu.honors}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {staff.certifications && staff.certifications.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Certifications & Licenses
          </h3>
          <div className="space-y-3">
            {staff.certifications.map((cert: Certification, index: number) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                  {cert.credentialId && (
                    <p className="text-xs text-gray-500 mt-1">Credential ID: {cert.credentialId}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">
                  <p>Issued: {formatDate(cert.issueDate)}</p>
                  {cert.expirationDate && (
                    <p className="text-xs">Expires: {formatDate(cert.expirationDate)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {staff.serviceAlignment && staff.serviceAlignment.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
            Service Alignment
          </h3>
          <div className="flex flex-wrap gap-2">
            {staff.serviceAlignment.map((service) => (
              <Badge key={service} variant="secondary" className="text-sm">
                {service}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {staff.hobbies && staff.hobbies.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
            Interests & Hobbies
          </h3>
          <p className="text-gray-700">{staff.hobbies.join(", ")}</p>
        </section>
      )}
    </div>
  )
}
