export type DesignerType =
  | 'kameleon'
  | 'kivitelezo'
  | 'vizionarius'
  | 'rendszerepito'
  | 'kulturakutato'
  | 'hid'
  | 'kiserletezo'
  | 'stratega';

export interface Answer {
  id: string;
  text: string;
  scores: Partial<Record<DesignerType, number>>;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export interface QuizResult {
  primary: DesignerType;
  primaryScore: number;
  primaryPct: number;
  secondary: DesignerType;
  secondaryScore: number;
  secondaryPct: number;
  allScores: Record<DesignerType, number>;
  allPcts: Record<DesignerType, number>;
  total: number;
}

export interface TypeInfo {
  id: DesignerType;
  name: string;
  emoji: string;
  color: string;
  shortDescription: string;
  longDescription: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  scores: Record<DesignerType, number>;
  email: string;
  gdprAccepted: boolean;
  isSubmitting: boolean;
  phase: 'hero' | 'quiz' | 'email' | 'loading' | 'result';
}
