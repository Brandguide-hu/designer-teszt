import { NextRequest, NextResponse } from 'next/server';
import { subscribeToAudienceful } from '@/lib/audienceful';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, primaryType, secondaryType, allScores } = body;

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Kérlek, adj meg érvényes email címet.' },
        { status: 400 }
      );
    }

    if (!primaryType) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó típus adat.' },
        { status: 400 }
      );
    }

    // Subscribe to Audienceful
    const result = await subscribeToAudienceful({
      email,
      primaryType,
      secondaryType,
      allScores,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Hiba történt. Kérlek, próbáld újra.' },
      { status: 500 }
    );
  }
}
