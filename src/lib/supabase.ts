import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Submission {
  id: string;
  created_at: string;
  updated_at: string;
  email: string | null;
  status: 'in_progress' | 'completed' | 'anonymous' | 'abandoned';
  device: 'mobile' | 'desktop';
  last_question_answered: number;
  primary_type: string | null;
  primary_type_name: string | null;
  primary_percentage: number | null;
  secondary_type: string | null;
  secondary_type_name: string | null;
  secondary_percentage: number | null;
  all_scores: Record<string, { score: number; percentage: number }> | null;
}

export interface Answer {
  id: string;
  created_at: string;
  submission_id: string;
  question_id: number;
  answer_id: string;
  question_text: string;
  answer_text: string;
}

// Device detection
export function detectDevice(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || window.innerWidth < 768;

  return isMobile ? 'mobile' : 'desktop';
}

// Session ID management (localStorage)
const SESSION_KEY = 'designer_quiz_session';

export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, id);
}

export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

// Create a new submission when quiz starts
export async function createSubmission(): Promise<string | null> {
  const device = detectDevice();

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      status: 'in_progress',
      device,
      last_question_answered: 0,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating submission:', error);
    return null;
  }

  const submissionId = data.id;
  setSessionId(submissionId);
  return submissionId;
}

// Save an answer
export async function saveAnswer(
  submissionId: string,
  questionId: number,
  answerId: string,
  questionText: string,
  answerText: string
): Promise<boolean> {
  // First, check if answer already exists (in case of page refresh)
  const { data: existingAnswer } = await supabase
    .from('answers')
    .select('id')
    .eq('submission_id', submissionId)
    .eq('question_id', questionId)
    .single();

  if (existingAnswer) {
    // Update existing answer
    const { error } = await supabase
      .from('answers')
      .update({ answer_id: answerId, answer_text: answerText })
      .eq('id', existingAnswer.id);

    if (error) {
      console.error('Error updating answer:', error);
      return false;
    }
  } else {
    // Insert new answer
    const { error } = await supabase
      .from('answers')
      .insert({
        submission_id: submissionId,
        question_id: questionId,
        answer_id: answerId,
        question_text: questionText,
        answer_text: answerText,
      });

    if (error) {
      console.error('Error saving answer:', error);
      return false;
    }
  }

  // Update submission progress
  const { error: updateError } = await supabase
    .from('submissions')
    .update({
      last_question_answered: questionId + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (updateError) {
    console.error('Error updating submission progress:', updateError);
    return false;
  }

  return true;
}

// Complete submission with results
export async function completeSubmission(
  submissionId: string,
  email: string | null,
  result: {
    primaryType: string;
    primaryTypeName: string;
    primaryPercentage: number;
    secondaryType: string;
    secondaryTypeName: string;
    secondaryPercentage: number;
    allScores: Record<string, { score: number; percentage: number }>;
  }
): Promise<boolean> {
  const status = email ? 'completed' : 'anonymous';

  const { error } = await supabase
    .from('submissions')
    .update({
      status,
      email,
      primary_type: result.primaryType,
      primary_type_name: result.primaryTypeName,
      primary_percentage: result.primaryPercentage,
      secondary_type: result.secondaryType,
      secondary_type_name: result.secondaryTypeName,
      secondary_percentage: result.secondaryPercentage,
      all_scores: result.allScores,
      updated_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (error) {
    console.error('Error completing submission:', error);
    return false;
  }

  clearSessionId();
  return true;
}

// Get existing submission (for resuming)
export async function getSubmission(submissionId: string): Promise<Submission | null> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (error) {
    console.error('Error fetching submission:', error);
    return null;
  }

  return data;
}

// Get answers for a submission
export async function getAnswers(submissionId: string): Promise<Answer[]> {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('submission_id', submissionId)
    .order('question_id', { ascending: true });

  if (error) {
    console.error('Error fetching answers:', error);
    return [];
  }

  return data || [];
}
