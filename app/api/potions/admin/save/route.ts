import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { PotionsAdminState } from '@/app/types/potions';

export async function POST(request: NextRequest) {
  try {
    const adminState: PotionsAdminState = await request.json();

    if (!adminState || !adminState.houses || !adminState.recipes) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Save houses configuration
    const housesRef = adminDb.collection('potions-config').doc('houses');
    await housesRef.set({
      houses: adminState.houses,
      lastUpdated: Date.now(),
    });

    // Save recipes (in case they were modified)
    const recipesRef = adminDb.collection('potions-config').doc('recipes');
    await recipesRef.set({
      recipes: adminState.recipes,
      lastUpdated: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving admin data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
