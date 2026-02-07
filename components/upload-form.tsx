"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, FileText, X, Briefcase, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface UploadFormProps {
  onSubmit: (formData: FormData) => void
  isLoading: boolean
}

export function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [inputMode, setInputMode] = useState<"file" | "text">("file")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
      setInputMode("file")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setInputMode("file")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)

    if (inputMode === "file" && resumeFile) {
      formData.append("resume", resumeFile)
    } else if (inputMode === "text" && resumeText) {
      formData.append("resumeText", resumeText)
    }

    onSubmit(formData)
  }

  const isValid =
    jobDescription.trim().length > 10 &&
    ((inputMode === "file" && resumeFile) || (inputMode === "text" && resumeText.trim().length > 20))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Job Description */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          Descricao da Vaga
        </label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Cole aqui a descricao completa da vaga... (requisitos, responsabilidades, tecnologias)"
          className="min-h-[160px] resize-none bg-background/50 border-border/50 focus:border-primary/50 transition-colors text-sm leading-relaxed"
        />
        <span className="text-xs text-muted-foreground">
          Quanto mais detalhada a vaga, melhor a analise.
        </span>
      </div>

      {/* Resume Upload / Paste */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          Seu Curriculo
        </label>

        {/* Toggle between file and text */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setInputMode("file")}
            className={cn(
              "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
              inputMode === "file"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={cn(
              "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
              inputMode === "text"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            Colar Texto
          </button>
        </div>

        {inputMode === "file" ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-300",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : resumeFile
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/50 bg-background/30 hover:border-primary/30 hover:bg-primary/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {resumeFile ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium text-foreground">{resumeFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(resumeFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setResumeFile(null)
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              </>
            ) : (
              <>
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-all",
                  isDragging ? "bg-primary/20" : "bg-muted"
                )}>
                  <Upload className={cn(
                    "h-7 w-7 transition-all",
                    isDragging ? "text-primary scale-110" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium text-foreground">
                    Arraste seu PDF aqui
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ou clique para selecionar
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Cole o texto do seu curriculo aqui... (experiencia, habilidades, formacao)"
            className="min-h-[160px] resize-none bg-background/50 border-border/50 focus:border-primary/50 transition-colors text-sm leading-relaxed"
          />
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={!isValid || isLoading}
        className="h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40"
      >
        <Sparkles className="h-5 w-5 mr-2" />
        {isLoading ? "Analisando..." : "Analisar Compatibilidade"}
      </Button>
    </form>
  )
}
