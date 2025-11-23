"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, ChevronDown, MapPin, Briefcase } from "lucide-react"

// Sample job listings data - replace with actual data source
const allJobs = [
  {
    id: 1,
    role: "Senior Product Data Analyst – Self-Serve Product",
    team: "Product",
    location: "São Paulo, Tallinn, Spain (Remote)",
    description: "We are seeking a Senior Product Data Analyst to join our Self-Serve Product team. You will be responsible for analyzing product performance, user behavior, and business metrics to drive data-informed decisions.",
    requirements: [
      "5+ years of experience in data analysis",
      "Strong SQL and Python skills",
      "Experience with product analytics tools",
      "Excellent communication and presentation skills"
    ]
  },
  {
    id: 2,
    role: "Account Manager",
    team: "Sales",
    location: "USA (Remote)",
    description: "Join our Sales team as an Account Manager and help grow our business by managing client relationships and driving revenue.",
    requirements: [
      "3+ years of B2B sales experience",
      "Strong relationship-building skills",
      "Track record of meeting sales targets",
      "Excellent communication skills"
    ]
  },
  {
    id: 3,
    role: "Account Manager - EMEA",
    team: "Account Management",
    location: "London, Spain (Remote)",
    description: "Manage key client accounts across Europe, Middle East, and Africa. Build lasting relationships and ensure client success.",
    requirements: [
      "5+ years in account management",
      "Experience with EMEA markets",
      "Fluent in English, additional languages a plus",
      "Strong problem-solving abilities"
    ]
  },
  {
    id: 4,
    role: "Principal Account Manager - USA",
    team: "Account Management",
    location: "USA (Remote)",
    description: "Lead strategic account relationships in the US market. Drive growth and ensure exceptional client satisfaction.",
    requirements: [
      "8+ years in enterprise account management",
      "Experience with Fortune 500 clients",
      "Strong negotiation skills",
      "Proven track record of revenue growth"
    ]
  },
  {
    id: 5,
    role: "Associate Solutions Engineer",
    team: "Solutions",
    location: "USA (Remote)",
    description: "Work with our clients to design and implement technical solutions that meet their business needs.",
    requirements: [
      "2+ years in technical consulting",
      "Strong technical background",
      "Excellent client-facing skills",
      "Ability to translate business needs to technical solutions"
    ]
  },
  {
    id: 6,
    role: "Senior Technical Account Manager",
    team: "Account Management",
    location: "USA (Remote)",
    description: "Provide technical expertise and account management for our most strategic clients.",
    requirements: [
      "5+ years in technical account management",
      "Strong technical background",
      "Experience with enterprise software",
      "Excellent communication skills"
    ]
  },
  {
    id: 7,
    role: "Strategic Data Partnerships Manager",
    team: "Trust",
    location: "São Paulo",
    description: "Develop and manage strategic partnerships with data providers to enhance our platform capabilities.",
    requirements: [
      "5+ years in partnership management",
      "Experience with data industry",
      "Strong negotiation skills",
      "Business development expertise"
    ]
  },
  {
    id: 8,
    role: "Senior Software Engineer (Biometric Solutions)",
    team: "Biometric Solutions",
    location: "Tallinn, Spain (Remote)",
    description: "Build cutting-edge biometric authentication solutions using advanced algorithms and machine learning.",
    requirements: [
      "5+ years of software engineering experience",
      "Experience with biometric systems",
      "Strong programming skills (Python, C++)",
      "ML/AI background preferred"
    ]
  },
  {
    id: 9,
    role: "Senior Software Engineer (CORE IDV)",
    team: "Authentication & Identity",
    location: "Tallinn, Spain (Remote)",
    description: "Develop core identity verification systems that power our authentication platform.",
    requirements: [
      "5+ years in identity/security systems",
      "Strong backend development skills",
      "Experience with cryptography",
      "Security-first mindset"
    ]
  },
  {
    id: 10,
    role: "Engineering Manager (Biometric Solutions)",
    team: "Biometric Solutions",
    location: "Estonia (Remote), Spain (Remote)",
    description: "Lead a team of talented engineers building the future of biometric authentication.",
    requirements: [
      "8+ years of engineering experience",
      "3+ years in management roles",
      "Experience with biometric systems",
      "Strong leadership and communication skills"
    ]
  },
  {
    id: 11,
    role: "Analytics Engineer",
    team: "Business Analytics",
    location: "Tallinn, Spain (Remote)",
    description: "Design and build data pipelines and analytics infrastructure to support data-driven decision making.",
    requirements: [
      "4+ years in data engineering",
      "Strong SQL and Python skills",
      "Experience with data warehousing",
      "Knowledge of modern analytics tools"
    ]
  },
  {
    id: 12,
    role: "Senior Frontend Engineer",
    team: "Engineering",
    location: "USA (Remote)",
    description: "Build beautiful and intuitive user interfaces using modern web technologies.",
    requirements: [
      "5+ years of frontend development",
      "Expert in React/Next.js",
      "Strong TypeScript skills",
      "Experience with modern UI frameworks"
    ]
  },
  {
    id: 13,
    role: "Backend Engineer - Platform",
    team: "Engineering",
    location: "Estonia (Remote)",
    description: "Develop scalable backend systems that power our platform infrastructure.",
    requirements: [
      "4+ years of backend development",
      "Experience with microservices",
      "Strong systems design skills",
      "Knowledge of cloud infrastructure"
    ]
  },
  {
    id: 14,
    role: "DevOps Engineer",
    team: "Infrastructure",
    location: "Tallinn, Spain (Remote)",
    description: "Maintain and improve our infrastructure, CI/CD pipelines, and deployment systems.",
    requirements: [
      "4+ years in DevOps/SRE",
      "Experience with Kubernetes",
      "Strong scripting skills",
      "Infrastructure as code expertise"
    ]
  },
  {
    id: 15,
    role: "Product Designer",
    team: "Design",
    location: "USA (Remote), Estonia (Remote)",
    description: "Design intuitive user experiences that delight our customers and drive product success.",
    requirements: [
      "5+ years in product design",
      "Strong portfolio of UX work",
      "Experience with design systems",
      "Collaborative and user-centered approach"
    ]
  },
  {
    id: 16,
    role: "Marketing Manager",
    team: "Marketing",
    location: "USA (Remote)",
    description: "Develop and execute marketing strategies to grow brand awareness and drive customer acquisition.",
    requirements: [
      "5+ years in B2B marketing",
      "Experience with digital marketing",
      "Strong analytical skills",
      "Content creation expertise"
    ]
  },
  {
    id: 17,
    role: "Customer Success Manager",
    team: "Customer Success",
    location: "London, USA (Remote)",
    description: "Ensure our customers achieve their goals and maximize value from our platform.",
    requirements: [
      "4+ years in customer success",
      "Strong relationship management",
      "Problem-solving skills",
      "Technical aptitude preferred"
    ]
  },
  {
    id: 18,
    role: "Data Scientist",
    team: "Business Analytics",
    location: "Tallinn, Spain (Remote)",
    description: "Apply advanced analytics and machine learning to solve business problems and drive insights.",
    requirements: [
      "4+ years in data science",
      "Strong Python and ML skills",
      "Experience with statistical analysis",
      "Business acumen and communication skills"
    ]
  }
]

// Extract unique values for filters
const uniqueTeams = Array.from(new Set(allJobs.map(job => job.team))).sort()
const uniqueLocations = Array.from(new Set(allJobs.map(job => job.location))).sort()

export default function CareersPage() {
  const [roleFilter, setRoleFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [teamFilter, setTeamFilter] = useState("")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showTeamDropdown, setShowTeamDropdown] = useState(false)
  const [selectedJob, setSelectedJob] = useState<typeof allJobs[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter jobs based on selected criteria
  const filteredJobs = allJobs.filter(job => {
    const matchesRole = !roleFilter || job.role.toLowerCase().includes(roleFilter.toLowerCase())
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesTeam = !teamFilter || job.team === teamFilter
    return matchesRole && matchesLocation && matchesTeam
  })

  const hasActiveFilters = roleFilter || locationFilter || teamFilter

  const clearFilters = () => {
    setRoleFilter("")
    setLocationFilter("")
    setTeamFilter("")
    setShowLocationDropdown(false)
    setShowTeamDropdown(false)
  }

  const totalJobs = filteredJobs.length
  const uniqueLocationCount = new Set(allJobs.map(job => {
    // Extract base locations (before commas)
    return job.location.split(',')[0].trim()
  })).size

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us build the future of digital transformation. Explore opportunities to grow your career with Forger Digital.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Filters */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{totalJobs} jobs in {uniqueLocationCount} locations</p>
                <h2 className="text-3xl font-bold mb-6">Find your role</h2>
              </div>

              <div className="space-y-4">
                {/* Role Input */}
                <div>
                  <Input
                    type="text"
                    placeholder="Role"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full h-12"
                  />
                </div>

                {/* Location Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationDropdown(!showLocationDropdown)
                      setShowTeamDropdown(false)
                    }}
                    className="w-full h-12 px-4 bg-card border border-border rounded-md text-left flex items-center justify-between text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <span className={locationFilter ? "text-foreground" : "text-muted-foreground"}>
                      {locationFilter || "Location"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showLocationDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-accent text-foreground"
                        onClick={() => {
                          setLocationFilter("")
                          setShowLocationDropdown(false)
                        }}
                      >
                        All Locations
                      </div>
                      {uniqueLocations.map((location) => (
                        <div
                          key={location}
                          className="px-4 py-2 cursor-pointer hover:bg-accent text-foreground"
                          onClick={() => {
                            setLocationFilter(location)
                            setShowLocationDropdown(false)
                          }}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Area/Team Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTeamDropdown(!showTeamDropdown)
                      setShowLocationDropdown(false)
                    }}
                    className="w-full h-12 px-4 bg-card border border-border rounded-md text-left flex items-center justify-between text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <span className={teamFilter ? "text-foreground" : "text-muted-foreground"}>
                      {teamFilter || "Area/Team"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showTeamDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showTeamDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-accent text-foreground"
                        onClick={() => {
                          setTeamFilter("")
                          setShowTeamDropdown(false)
                        }}
                      >
                        All Teams
                      </div>
                      {uniqueTeams.map((team) => (
                        <div
                          key={team}
                          className="px-4 py-2 cursor-pointer hover:bg-accent text-foreground"
                          onClick={() => {
                            setTeamFilter(team)
                            setShowTeamDropdown(false)
                          }}
                        >
                          {team}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Company Photo/Placeholder */}
            <div className="hidden lg:block">
              <div className="h-full min-h-[400px] bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Join Our Team</h3>
                  <p className="text-white/90">
                    Be part of building the future
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings Table */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">
                Showing {totalJobs} open {totalJobs === 1 ? 'role' : 'roles'}
              </CardTitle>
            </CardHeader>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b border-border">
              <div className="col-span-5">
                <span className="text-sm font-bold">ROLE</span>
              </div>
              <div className="col-span-3">
                <span className="text-sm font-bold">TEAM</span>
              </div>
              <div className="col-span-3">
                <span className="text-sm font-bold">LOCATION</span>
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Job Listings */}
            <div className="divide-y divide-border">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-5">
                      <h3 className="font-bold mb-1">{job.role}</h3>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-muted-foreground">{job.team}</span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-muted-foreground">{job.location}</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-md flex items-center gap-1 transition-all duration-200"
                        onClick={() => {
                          setSelectedJob(job)
                          setIsDialogOpen(true)
                        }}
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-muted-foreground text-lg">No jobs found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) setSelectedJob(null)
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  {selectedJob.role}
                </DialogTitle>
                <div className="space-y-3 pt-4 text-muted-foreground">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-orange-500" />
                      <span>{selectedJob.team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{selectedJob.location}</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About the Role</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Apply Now
                  </Button>
                  <Button variant="outline">
                    Share
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}
