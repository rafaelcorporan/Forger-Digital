"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"

const codeExample = `import { Meetstream } from '@meetstream/sdk';

const client = new Meetstream({
  apiKey: process.env.MEETSTREAM_API_KEY
});

// Join a meeting
const bot = await client.bots.create({
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
  transcription: true,
  recording: true
});

// Listen for transcription events
bot.on('transcription', (data) => {
  console.log(\`\${data.speaker}: \${data.text}\`);
});

// Start the bot
await bot.join();`

export function CodeExample() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="border-b border-border bg-secondary/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">Simple, powerful API</h2>
            <p className="text-pretty text-lg text-muted-foreground">Get started in minutes with our intuitive SDK</p>
          </div>

          <Card className="relative overflow-hidden border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/80"></div>
                <div className="h-3 w-3 rounded-full bg-accent/80"></div>
                <div className="h-3 w-3 rounded-full bg-chart-2/80"></div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="overflow-x-auto p-6">
              <pre className="text-sm leading-relaxed">
                <code className="font-mono text-foreground">{codeExample}</code>
              </pre>
            </div>
          </Card>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-accent">3</div>
              <div className="text-sm text-muted-foreground">Supported Platforms</div>
            </Card>
            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-accent">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </Card>
            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-accent">{"<"}100ms</div>
              <div className="text-sm text-muted-foreground">Average Latency</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
