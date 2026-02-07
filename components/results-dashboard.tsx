"use client"

import React from "react"

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  TrendingUp,
  Target,
  Zap,
  Award,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreRing } from "@/components/score-ring"
import { SkillsRadar } from "@/components/skills-radar"
import type { AnalysisResult } from "@/lib/nlp-engine"
import { cn } from "@/lib/utils"

interface ResultsDashboardProps {
  result: AnalysisResult & { id: number }
  onReset: () => void
}

function ScoreBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  const getColor = (v: number) => {
    if (v >= 70) return "bg-[hsl(var(--success))]"
    if (v >= 40) return "bg-[hsl(var(--warning))]"
    return "bg-destructive"
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums text-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const matchedSkills = result.skills.filter((s) => s.status === "match")
  const missingSkills = result.skills.filter((s) => s.status === "missing")
  const extraSkills = result.skills.filter((s) => s.status === "extra")

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onReset} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Nova analise
        </Button>
        <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
          ID #{result.id}
        </Badge>
      </div>

      {/* Top row: Score Ring + Score Bars */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card">
          <CardContent className="flex items-center justify-center py-8">
            <ScoreRing score={result.overallScore} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-card-foreground">Detalhamento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ScoreBar label="Skills Tecnicas" value={result.skillsScore} icon={Target} />
            <ScoreBar label="Similaridade Textual" value={result.similarityScore} icon={TrendingUp} />
            <ScoreBar label="Nivel de Experiencia" value={result.experienceScore} icon={Award} />
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
              <span className="text-muted-foreground">Vaga: <span className="font-medium text-foreground capitalize">{result.jobLevel}</span></span>
              <span className="text-muted-foreground">Voce: <span className="font-medium text-foreground capitalize">{result.resumeLevel}</span></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-card-foreground">Radar de Competencias</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillsRadar categoryScores={result.categoryScores} />
        </CardContent>
      </Card>

      {/* Tabs: Skills | Strengths & Gaps | Suggestions */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="skills" className="text-xs sm:text-sm data-[state=active]:text-foreground">Skills ({result.skills.length})</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm data-[state=active]:text-foreground">Insights</TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs sm:text-sm data-[state=active]:text-foreground">Sugestoes ({result.suggestions.length})</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-4">
          <div className="flex flex-col gap-6">
            {/* Matched */}
            {matchedSkills.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                  <span className="text-sm font-semibold text-foreground">Voce tem ({matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((s) => (
                    <Badge
                      key={s.skill}
                      className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20 hover:bg-[hsl(var(--success))]/20"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {s.skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing */}
            {missingSkills.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-semibold text-foreground">Faltando ({missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s) => (
                    <Badge
                      key={s.skill}
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      {s.skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Extra */}
            {extraSkills.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-[hsl(var(--info))]" />
                  <span className="text-sm font-semibold text-foreground">Extras no seu curriculo ({extraSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {extraSkills.map((s) => (
                    <Badge
                      key={s.skill}
                      variant="outline"
                      className="border-[hsl(var(--info))]/30 text-[hsl(var(--info))] hover:bg-[hsl(var(--info))]/10"
                    >
                      {s.skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Strengths */}
            <Card className="border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--success))]">
                  <Zap className="h-4 w-4" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.strengths.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {result.strengths.map((s) => (
                      <li key={s} className="text-sm text-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Continue melhorando seu curriculo!</p>
                )}
              </CardContent>
            </Card>

            {/* Gaps */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Lacunas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.gaps.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {result.gaps.map((g) => (
                      <li key={g} className="text-sm text-foreground flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma lacuna critica encontrada.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="mt-4">
          <div className="flex flex-col gap-3">
            {result.suggestions.map((s, i) => {
              const typeConfig = {
                critical: {
                  icon: AlertTriangle,
                  color: "border-destructive/30 bg-destructive/5",
                  iconColor: "text-destructive",
                  label: "Critico",
                  labelColor: "bg-destructive/10 text-destructive",
                },
                important: {
                  icon: Lightbulb,
                  color: "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5",
                  iconColor: "text-[hsl(var(--warning))]",
                  label: "Importante",
                  labelColor: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
                },
                "nice-to-have": {
                  icon: Lightbulb,
                  color: "border-[hsl(var(--info))]/30 bg-[hsl(var(--info))]/5",
                  iconColor: "text-[hsl(var(--info))]",
                  label: "Sugestao",
                  labelColor: "bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]",
                },
              }
              const config = typeConfig[s.type]
              const Icon = config.icon

              return (
                <Card key={`${s.type}-${i}`} className={cn("border", config.color)}>
                  <CardContent className="flex items-start gap-3 py-4">
                    <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.iconColor)} />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Badge className={cn("w-fit text-[10px] font-semibold", config.labelColor)}>
                        {config.label}
                      </Badge>
                      <p className="text-sm text-foreground leading-relaxed">{s.message}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {result.suggestions.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))]" />
                <p className="text-sm">Nenhuma sugestao adicional. Seu curriculo esta bem alinhado!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
