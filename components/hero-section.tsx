"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [text, setText] = useState("")
  const fullText = "Unified Meeting Bots API & Infrastructure Platform"
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let index = 0
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-24 md:py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Now supporting Google Meet, Microsoft Teams & Zoom
          </div>

          <h1 className="mb-6 min-h-[120px] text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:min-h-[160px] md:text-6xl">
            {text}
            {showCursor && <span className="text-accent">|</span>}
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            A single API to join, record, stream, and analyze data from any meeting platform. Build powerful meeting
            bots in minutes, not months.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-accent"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-accent"></div>
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-accent"></div>
              <span>5 min setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background grid effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Mobile Spline Background */}
      <div className="absolute inset-0 z-0 md:hidden">
        <iframe
          src="https://my.spline.design/interactiveaiwebsite-sLXepj130rzuiUREhojniSkN/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="h-full w-full"
          title="Spline 3D Background"
        />
      </div>
    </section>
  )
}
