import { supabase, Submission, Answer } from './supabase';

export interface AnalyticsStats {
  total: number;
  completed: number;
  anonymous: number;
  abandoned: number;
  inProgress: number;
  completionRate: number;
}

export interface TypeDistribution {
  type: string;
  typeName: string;
  emoji: string;
  count: number;
  percentage: number;
}

export interface DeviceStats {
  mobile: number;
  desktop: number;
  mobilePercentage: number;
  desktopPercentage: number;
}

export interface DropoffStats {
  questionId: number;
  count: number;
}

export interface QuestionStats {
  questionId: number;
  questionText: string;
  answers: {
    answerId: string;
    answerText: string;
    count: number;
    percentage: number;
  }[];
  totalResponses: number;
}

export interface SubmissionWithAnswers extends Submission {
  answers: Answer[];
}

const TYPE_INFO: Record<string, { name: string; emoji: string }> = {
  kameleon: { name: 'Kaméleon', emoji: '🦎' },
  kivitelezo: { name: 'Kivitelező sztár', emoji: '⚡' },
  vizionarius: { name: 'Vízionárius', emoji: '🚀' },
  rendszerepito: { name: 'Rendszerépítő', emoji: '🔧' },
  kulturakutato: { name: 'Kultúrakutató', emoji: '🔍' },
  hid: { name: 'Híd', emoji: '🌉' },
  kiserletezo: { name: 'Kísérletező', emoji: '🧪' },
  stratega: { name: 'Stratéga', emoji: '🎯' },
};

// Get overall stats
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const { data, error } = await supabase
    .from('submissions')
    .select('status');

  if (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      completed: 0,
      anonymous: 0,
      abandoned: 0,
      inProgress: 0,
      completionRate: 0,
    };
  }

  const total = data.length;
  const completed = data.filter((s) => s.status === 'completed').length;
  const anonymous = data.filter((s) => s.status === 'anonymous').length;
  const abandoned = data.filter((s) => s.status === 'abandoned').length;
  const inProgress = data.filter((s) => s.status === 'in_progress').length;

  return {
    total,
    completed,
    anonymous,
    abandoned,
    inProgress,
    completionRate: total > 0 ? Math.round(((completed + anonymous) / total) * 100) : 0,
  };
}

// Get type distribution
export async function getTypeDistribution(): Promise<TypeDistribution[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('primary_type')
    .in('status', ['completed', 'anonymous']);

  if (error) {
    console.error('Error fetching type distribution:', error);
    return [];
  }

  const counts: Record<string, number> = {};
  data.forEach((s) => {
    if (s.primary_type) {
      counts[s.primary_type] = (counts[s.primary_type] || 0) + 1;
    }
  });

  const total = data.length;

  return Object.entries(counts)
    .map(([type, count]) => ({
      type,
      typeName: TYPE_INFO[type]?.name || type,
      emoji: TYPE_INFO[type]?.emoji || '❓',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// Get device stats
export async function getDeviceStats(): Promise<DeviceStats> {
  const { data, error } = await supabase
    .from('submissions')
    .select('device');

  if (error) {
    console.error('Error fetching device stats:', error);
    return { mobile: 0, desktop: 0, mobilePercentage: 0, desktopPercentage: 0 };
  }

  const mobile = data.filter((s) => s.device === 'mobile').length;
  const desktop = data.filter((s) => s.device === 'desktop').length;
  const total = data.length;

  return {
    mobile,
    desktop,
    mobilePercentage: total > 0 ? Math.round((mobile / total) * 100) : 0,
    desktopPercentage: total > 0 ? Math.round((desktop / total) * 100) : 0,
  };
}

// Get dropoff stats
export async function getDropoffStats(): Promise<DropoffStats[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('last_question_answered, status')
    .or('status.eq.abandoned,status.eq.in_progress');

  if (error) {
    console.error('Error fetching dropoff stats:', error);
    return [];
  }

  // Count by question where they stopped
  const dropoffs: Record<number, number> = {};
  data.forEach((s) => {
    const q = s.last_question_answered || 0;
    dropoffs[q] = (dropoffs[q] || 0) + 1;
  });

  // Also count those who stopped at email step (completed 10 questions but no result)
  const emailDropoff = data.filter(
    (s) => s.last_question_answered === 10 && s.status !== 'completed'
  ).length;

  const result: DropoffStats[] = [];
  for (let i = 1; i <= 10; i++) {
    result.push({ questionId: i, count: dropoffs[i] || 0 });
  }
  result.push({ questionId: 11, count: emailDropoff }); // 11 = email step

  return result;
}

// Get question-by-question stats
export async function getQuestionStats(): Promise<QuestionStats[]> {
  const { data, error } = await supabase
    .from('answers')
    .select('question_id, question_text, answer_id, answer_text');

  if (error) {
    console.error('Error fetching question stats:', error);
    return [];
  }

  // Group by question
  const questionMap: Record<
    number,
    {
      questionText: string;
      answers: Record<string, { text: string; count: number }>;
      total: number;
    }
  > = {};

  data.forEach((a) => {
    if (!questionMap[a.question_id]) {
      questionMap[a.question_id] = {
        questionText: a.question_text,
        answers: {},
        total: 0,
      };
    }

    const q = questionMap[a.question_id];
    if (!q.answers[a.answer_id]) {
      q.answers[a.answer_id] = { text: a.answer_text, count: 0 };
    }
    q.answers[a.answer_id].count++;
    q.total++;
  });

  return Object.entries(questionMap)
    .map(([questionId, data]) => ({
      questionId: parseInt(questionId),
      questionText: data.questionText,
      totalResponses: data.total,
      answers: Object.entries(data.answers)
        .map(([answerId, answerData]) => ({
          answerId,
          answerText: answerData.text,
          count: answerData.count,
          percentage:
            data.total > 0
              ? Math.round((answerData.count / data.total) * 100)
              : 0,
        }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => a.questionId - b.questionId);
}

// Get all submissions with answers
export async function getSubmissions(filters?: {
  status?: string;
  device?: string;
  primaryType?: string;
}): Promise<SubmissionWithAnswers[]> {
  let query = supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.device && filters.device !== 'all') {
    query = query.eq('device', filters.device);
  }
  if (filters?.primaryType && filters.primaryType !== 'all') {
    query = query.eq('primary_type', filters.primaryType);
  }

  const { data: submissions, error } = await query;

  if (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }

  // Fetch answers for all submissions
  const submissionIds = submissions.map((s) => s.id);
  const { data: answers, error: answersError } = await supabase
    .from('answers')
    .select('*')
    .in('submission_id', submissionIds)
    .order('question_id', { ascending: true });

  if (answersError) {
    console.error('Error fetching answers:', answersError);
  }

  // Attach answers to submissions
  return submissions.map((s) => ({
    ...s,
    answers: (answers || []).filter((a) => a.submission_id === s.id),
  }));
}

// Generate CSV data
export function generateCSV(submissions: SubmissionWithAnswers[]): string {
  const headers = [
    'id',
    'email',
    'status',
    'device',
    'primary_type',
    'primary_pct',
    'secondary_type',
    'secondary_pct',
    'q1',
    'q2',
    'q3',
    'q4',
    'q5',
    'q6',
    'q7',
    'q8',
    'q9',
    'q10',
    'last_question',
    'created_at',
  ];

  const rows = submissions.map((s) => {
    const answers: Record<number, string> = {};
    s.answers.forEach((a) => {
      answers[a.question_id] = a.answer_id;
    });

    return [
      s.id,
      s.email || '',
      s.status,
      s.device,
      s.primary_type || '',
      s.primary_percentage || '',
      s.secondary_type || '',
      s.secondary_percentage || '',
      answers[0] || '',
      answers[1] || '',
      answers[2] || '',
      answers[3] || '',
      answers[4] || '',
      answers[5] || '',
      answers[6] || '',
      answers[7] || '',
      answers[8] || '',
      answers[9] || '',
      s.last_question_answered || 0,
      s.created_at,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
