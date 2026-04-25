import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { house: string } }
) {
  try {
    const { house } = params;

    // Get houses configuration
    const housesRef = adminDb.collection('potions-config').doc('houses');
    const housesDoc = await housesRef.get();

    if (!housesDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }

    const housesData = housesDoc.data();
    const houses = housesData?.houses || [];

    const houseConfig = houses.find((h: any) => h.house === house);

    if (!houseConfig) {
      return NextResponse.json(
        { success: false, error: 'House not found' },
        { status: 404 }
      );
    }

    if (!houseConfig.assignedRecipeId) {
      return NextResponse.json(
        { success: false, error: 'No recipe assigned to this house yet' },
        { status: 404 }
      );
    }

    // Get recipes
    const recipesRef = adminDb.collection('potions-config').doc('recipes');
    const recipesDoc = await recipesRef.get();

    if (!recipesDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Recipes not found' },
        { status: 404 }
      );
    }

    const recipesData = recipesDoc.data();
    const recipes = recipesData?.recipes || [];

    const recipe = recipes.find((r: any) => r.id === houseConfig.assignedRecipeId);

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
