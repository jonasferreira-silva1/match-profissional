"use client"

import { useEffect, useState } from "react"

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ScoreRing({ score, size = 200, strokeWidth = 12, label = "Score Geral" }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (s: number) => {
    if (s >= 70) return "hsl(var(--success))"
    if (s >= 40) return "hsl(var(--warning))"
    return "hsl(var(--destructive))"
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excelente"
    if (s >= 60) return "Bom"
    if (s >= 40) return "Regular"
    return "Baixo"
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getScoreColor(animatedScore)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-[1500ms] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tabular-nums transition-colors duration-500"
            style={{ color: getScoreColor(animatedScore) }}
          >
            {animatedScore}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {getScoreLabel(animatedScore)}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
