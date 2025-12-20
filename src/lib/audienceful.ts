interface SubscribeParams {
  email: string;
  primaryType: string;
  secondaryType: string;
  allScores: Record<string, number>;
}

export async function subscribeToAudienceful({
  email,
  primaryType,
  secondaryType,
  allScores,
}: SubscribeParams): Promise<{ success: boolean; error?: string }> {
  const API_KEY = process.env.AUDIENCEFUL_API_KEY;

  if (!API_KEY) {
    console.error('AUDIENCEFUL_API_KEY is not set');
    return { success: false, error: 'Server configuration error' };
  }

  try {
    const response = await fetch('https://app.audienceful.com/api/people/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Api-Key': API_KEY,
      },
      body: JSON.stringify({
        email,
        tags: `designer-teszt, ${primaryType}`,
        extra_data: {
          designer_type_primary: primaryType,
          designer_type_secondary: secondaryType,
          designer_scores: JSON.stringify(allScores),
          quiz_completed_at: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Audienceful error:', error);
      return { success: false, error: error.message || 'Subscription failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Audienceful request failed:', error);
    return { success: false, error: 'Network error' };
  }
}
