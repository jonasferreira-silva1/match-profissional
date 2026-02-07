"use client"

import { useEffect, useState } from "react"
import { Brain, FileSearch, BarChart3, Lightbulb, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { icon: FileSearch, label: "Lendo seu curriculo...", duration: 1500 },
  { icon: Brain, label: "Processando com NLP...", duration: 2000 },
  { icon: BarChart3, label: "Comparando skills...", duration: 1500 },
  { icon: Lightbulb, label: "Gerando insights...", duration: 1000 },
]

export function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const advance = (step: number) => {
      if (step < STEPS.length - 1) {
        timeout = setTimeout(() => {
          setCurrentStep(step + 1)
          advance(step + 1)
        }, STEPS[step].duration)
      }
    }
    advance(0)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-20">
      {/* Animated brain icon */}
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 animate-pulse-glow">
          <Brain className="h-12 w-12 text-primary animate-float" />
        </div>
        <div className="absolute -inset-4 rounded-[2rem] border border-primary/20 animate-ping opacity-20" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground text-balance text-center">
          Analisando seu curriculo com a vaga
        </h2>
        <p className="text-sm text-muted-foreground">
          Isso leva apenas alguns segundos...
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isDone = index < currentStep

          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500",
                isActive && "bg-primary/10 scale-105",
                isDone && "opacity-60",
                !isActive && !isDone && "opacity-30",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                  isActive && "bg-primary/20 text-primary",
                  isDone && "bg-primary/10 text-primary",
                  !isActive && !isDone && "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-all",
                  isActive && "text-foreground",
                  isDone && "text-muted-foreground line-through",
                  !isActive && !isDone && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
