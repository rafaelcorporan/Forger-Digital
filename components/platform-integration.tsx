import { Card } from "@/components/ui/card"

const platforms = [
  {
    name: "Google Meet",
    logo: "/google-meet-logo.png",
    description: "Full support for Google Workspace meetings",
  },
  {
    name: "Microsoft Teams",
    logo: "/microsoft-teams-logo.png",
    description: "Enterprise-grade Teams integration",
  },
  {
    name: "Zoom",
    logo: "/zoom-logo.jpg",
    description: "Complete Zoom meeting bot capabilities",
  },
]

const integrations = ["Slack", "Discord", "Notion", "Salesforce", "HubSpot", "Zapier", "Webhooks", "Custom APIs"]

export function PlatformIntegration() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Works with your favorite platforms
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Seamlessly integrate with the tools you already use
          </p>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              className="group border-border bg-card p-8 text-center transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={platform.logo || "/placeholder.svg"}
                  alt={platform.name}
                  className="h-12 w-12 transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </Card>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
          <h3 className="mb-8 text-center text-xl font-semibold text-foreground">Integrate with your workflow</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-accent/10"
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
