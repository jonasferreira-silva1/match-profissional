CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  job_description TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  skills_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  similarity_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  experience_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analysis_skills (
  id SERIAL PRIMARY KEY,
  analysis_id INTEGER NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  found_in_job BOOLEAN NOT NULL DEFAULT FALSE,
  found_in_resume BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('match', 'missing', 'extra')),
  category VARCHAR(50) NOT NULL DEFAULT 'technical'
);

CREATE INDEX IF NOT EXISTS idx_analysis_skills_analysis_id ON analysis_skills(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
