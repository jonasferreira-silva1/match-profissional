"use client"

import { useState } from "react"
import { Sparkles, BarChart3, Shield, Zap, Brain, Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UploadForm } from "@/components/upload-form"
import { LoadingScreen } from "@/components/loading-screen"
import { ResultsDashboard } from "@/components/results-dashboard"
import type { AnalysisResult } from "@/lib/nlp-engine"

type AppState = "home" | "loading" | "results"

export default function Page() {
  const [state, setState] = useState<AppState>("home")
  const [result, setResult] = useState<(AnalysisResult & { id: number }) | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setState("loading")
    setError(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao analisar")
      }

      setResult(data)
      setState("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.")
      setState("home")
    }
  }

  const handleReset = () => {
    setState("home")
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground tracking-tight">ResumeMatch AI</span>
              <span className="text-[10px] text-muted-foreground leading-none">NLP-powered analysis</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {state === "home" && (
          <div className="flex flex-col gap-12 animate-fade-up">
            {/* Hero */}
            <section className="flex flex-col items-center gap-6 pt-8 pb-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-float">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col gap-3 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                  Descubra por que voce nao passa nas vagas
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Compare seu curriculo com a descricao da vaga e receba um diagnostico completo com score de compatibilidade, analise de skills e sugestoes praticas para melhorar.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { icon: BarChart3, label: "TF-IDF + Cosine Similarity" },
                  { icon: Shield, label: "Simulacao ATS" },
                  { icon: Zap, label: "Sugestoes inteligentes" },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm text-muted-foreground"
                  >
                    <feature.icon className="h-4 w-4 text-primary" />
                    {feature.label}
                  </div>
                ))}
              </div>
            </section>

            {/* Error message */}
            {error && (
              <div className="mx-auto w-full max-w-2xl rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Upload Form */}
            <section className="mx-auto w-full max-w-2xl">
              <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
                <UploadForm onSubmit={handleSubmit} isLoading={state === "loading"} />
              </div>
            </section>

            {/* How it works */}
            <section className="mx-auto w-full max-w-3xl">
              <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                Como funciona
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Cole a vaga",
                    description: "Cole a descricao completa da vaga que voce quer se candidatar.",
                  },
                  {
                    step: "02",
                    title: "Envie seu curriculo",
                    description: "Upload do PDF ou cole o texto do seu curriculo diretamente.",
                  },
                  {
                    step: "03",
                    title: "Receba o diagnostico",
                    description: "Score, radar de skills, pontos fortes, lacunas e sugestoes praticas.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-5"
                  >
                    <span className="text-xs font-bold text-primary font-mono">{item.step}</span>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-center py-8 text-xs text-muted-foreground">
              <span>Feito com NLP, TF-IDF e dedicacao</span>
            </footer>
          </div>
        )}

        {state === "loading" && <LoadingScreen />}

        {state === "results" && result && (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}
