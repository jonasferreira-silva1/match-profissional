"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface SkillsRadarProps {
  categoryScores: Record<string, { matched: number; total: number }>
}

const CATEGORY_LABELS: Record<string, string> = {
  languages: "Linguagens",
  frameworks: "Frameworks",
  databases: "Bancos de Dados",
  devops: "DevOps",
  tools: "Ferramentas",
  concepts: "Conceitos",
  data: "Dados/ML",
  softskills: "Soft Skills",
}

export function SkillsRadar({ categoryScores }: SkillsRadarProps) {
  const data = Object.entries(categoryScores).map(([key, value]) => ({
    category: CATEGORY_LABELS[key] || key,
    score: value.total > 0 ? Math.round((value.matched / value.total) * 100) : 0,
    fullMark: 100,
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Nenhuma categoria encontrada
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid
          stroke="hsl(var(--border))"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <Radar
          name="Compatibilidade"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--card-foreground))",
          }}
          formatter={(value: number) => [`${value}%`, "Match"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
