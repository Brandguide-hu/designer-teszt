declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    });
  }
}

export function trackQuizStart() {
  pushEvent('quiz_start');
}

export function trackQuestionAnswered(questionId: number, answerId: string) {
  pushEvent('quiz_question_answered', {
    question_id: questionId,
    answer_id: answerId,
  });
}

export function trackQuizCompleted(primaryType: string, secondaryType: string) {
  pushEvent('quiz_completed', {
    primary_type: primaryType,
    secondary_type: secondaryType,
  });
}

export function trackEmailSubmitted(primaryType: string) {
  pushEvent('email_submitted', {
    primary_type: primaryType,
  });
}

export function trackResultViewed(primaryType: string, secondaryType: string, isShared: boolean) {
  pushEvent('result_viewed', {
    primary_type: primaryType,
    secondary_type: secondaryType,
    is_shared: isShared,
  });
}

export function trackResultShared(platform: 'facebook' | 'linkedin' | 'twitter' | 'copy') {
  pushEvent('result_shared', {
    platform,
  });
}

export function trackCTAClicked(location: 'result_page' | 'email') {
  pushEvent('cta_clicked', {
    location,
    destination: 'brandguide_ai',
  });
}
