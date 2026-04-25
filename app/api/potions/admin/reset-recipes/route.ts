import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST() {
  try {
    // Delete the existing recipes document
    const recipesRef = adminDb.collection('potions-config').doc('recipes');
    await recipesRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Recipes reset successfully. Refresh the page to load new defaults.'
    });
  } catch (error) {
    console.error('Error resetting recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
