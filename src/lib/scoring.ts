import { DesignerType, Question, QuizResult } from './types';
import { questions } from './quiz-data';

const allTypes: DesignerType[] = [
  'kameleon',
  'kivitelezo',
  'vizionarius',
  'rendszerepito',
  'kulturakutato',
  'hid',
  'kiserletezo',
  'stratega',
];

export function calculateResult(answers: Record<number, string>): QuizResult {
  // Initialize scores
  const scores: Record<DesignerType, number> = {
    kameleon: 0,
    kivitelezo: 0,
    vizionarius: 0,
    rendszerepito: 0,
    kulturakutato: 0,
    hid: 0,
    kiserletezo: 0,
    stratega: 0,
  };

  // Calculate scores from answers
  for (const [questionId, answerId] of Object.entries(answers)) {
    const question = questions[parseInt(questionId)];
    const answer = question?.answers.find((a) => a.id === answerId);

    if (answer) {
      for (const [type, points] of Object.entries(answer.scores)) {
        scores[type as DesignerType] += points;
      }
    }
  }

  // Calculate total
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  // Sort by score
  const sorted = Object.entries(scores).sort(
    ([, a], [, b]) => b - a
  ) as [DesignerType, number][];

  // Calculate percentages
  const allPcts: Record<DesignerType, number> = {} as Record<DesignerType, number>;
  for (const type of allTypes) {
    allPcts[type] = total > 0 ? Math.round((scores[type] / total) * 100) : 0;
  }

  return {
    primary: sorted[0][0],
    primaryScore: sorted[0][1],
    primaryPct: allPcts[sorted[0][0]],
    secondary: sorted[1][0],
    secondaryScore: sorted[1][1],
    secondaryPct: allPcts[sorted[1][0]],
    allScores: scores,
    allPcts,
    total,
  };
}

export function getResultUrl(primary: DesignerType, secondary: DesignerType, shareId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  let url = `${baseUrl}/eredmeny/${primary}?alt=${secondary}`;
  if (shareId) {
    url += `&s=${shareId}`;
  }
  return url;
}
