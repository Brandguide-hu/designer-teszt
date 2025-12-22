-- Designer Teszt Analytics - Supabase Setup
-- Futtasd ezt a Supabase SQL Editor-ban

-- UUID extension (ha még nincs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Submissions tábla
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'anonymous', 'abandoned')),
  device TEXT CHECK (device IN ('mobile', 'desktop')),
  last_question_answered INTEGER DEFAULT 0,
  primary_type TEXT,
  primary_type_name TEXT,
  primary_percentage INTEGER,
  secondary_type TEXT,
  secondary_type_name TEXT,
  secondary_percentage INTEGER,
  all_scores JSONB
);

-- Answers tábla
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  answer_id TEXT NOT NULL,
  question_text TEXT,
  answer_text TEXT
);

-- Indexek a gyorsabb lekérdezéshez
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_primary_type ON submissions(primary_type);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_answers_submission_id ON answers(submission_id);

-- RLS (Row Level Security) - kikapcsolva az egyszerűség kedvéért
-- Production-ben érdemes bekapcsolni és megfelelően konfigurálni
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Policy: mindenki írhat és olvashat (analytics oldalhoz kell)
CREATE POLICY "Allow all operations on submissions" ON submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on answers" ON answers FOR ALL USING (true) WITH CHECK (true);

-- Függvény az abandoned státusz beállításához (24 óra után)
-- Ezt később egy cron job-bal vagy manuálisan futtathatod
CREATE OR REPLACE FUNCTION mark_abandoned_submissions()
RETURNS void AS $$
BEGIN
  UPDATE submissions
  SET status = 'abandoned', updated_at = NOW()
  WHERE status = 'in_progress'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;
