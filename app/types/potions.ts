export type HouseType = 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';

export interface Ingredient {
  name: string;
  clue: string;
}

export interface PotionRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface HouseConfig {
  house: HouseType;
  code: string;
  assignedRecipeId: string | null;
  isActive: boolean;
}

export interface PotionsAdminState {
  houses: HouseConfig[];
  recipes: PotionRecipe[];
  lastUpdated: number;
}
