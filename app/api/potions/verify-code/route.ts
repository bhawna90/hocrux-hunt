import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { house, code } = await request.json();

    if (!house || !code) {
      return NextResponse.json(
        { success: false, error: 'House and code are required' },
        { status: 400 }
      );
    }

    // Get admin configuration from Firestore
    const docRef = adminDb.collection('potions-config').doc('houses');
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }

    const data = doc.data();
    const houses = data?.houses || [];

    const houseConfig = houses.find((h: any) => h.house === house);

    if (!houseConfig) {
      return NextResponse.json(
        { success: false, error: 'House not found' },
        { status: 404 }
      );
    }

    if (!houseConfig.isActive) {
      return NextResponse.json(
        { success: false, error: 'This house is currently inactive' },
        { status: 403 }
      );
    }

    if (houseConfig.code.toUpperCase() !== code.toUpperCase()) {
      return NextResponse.json(
        { success: false, error: 'Invalid code' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
