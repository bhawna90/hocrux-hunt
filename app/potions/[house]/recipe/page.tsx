'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HouseType, PotionRecipe } from '@/app/types/potions';

export default function RecipePage() {
  const params = useParams();
  const house = params.house as HouseType;

  const [recipe, setRecipe] = useState<PotionRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const houseColors: Record<HouseType, string> = {
    gryffindor: 'from-red-900 to-yellow-800',
    slytherin: 'from-green-900 to-gray-800',
    hufflepuff: 'from-yellow-800 to-gray-800',
    ravenclaw: 'from-blue-900 to-gray-800',
  };

  useEffect(() => {
    fetchRecipe();
  }, [house]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/potions/recipe/${house}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setRecipe(data.recipe);
      } else {
        setError(data.error || 'Failed to load recipe');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${houseColors[house]} text-white flex items-center justify-center`}>
        <div className="text-2xl">Loading your recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${houseColors[house]} text-white`}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">⚠️ Error</h1>
          <p className="text-xl mb-8">{error || 'No recipe assigned to your house yet.'}</p>
          <a href="/potions" className="text-purple-400 hover:text-purple-300 underline">
            ← Back to Potions Class
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${houseColors[house]} text-white`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 capitalize">{house}</h1>
            <h2 className="text-3xl text-purple-300 mb-4">🧪 {recipe.name}</h2>
            <p className="text-lg text-gray-300">{recipe.description}</p>
          </div>

          {/* Ingredients Section */}
          <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-purple-300">📜 Ingredient Clues</h3>
            <div className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="text-gray-200 text-lg pt-1">
                      {ingredient.clue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Instructions */}
          <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-purple-300">🔮 How to Complete This Activity</h3>
            <p className="text-sm text-gray-400 mb-4 italic">Follow these steps to brew your magical potion and win!</p>

            <ol className="space-y-3">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <span className="text-gray-200 pt-1"><strong>Decode the Clues:</strong> Read each ingredient clue carefully and work with your team to figure out what ingredient it represents</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <span className="text-gray-200 pt-1"><strong>Collect Ingredients:</strong> Once you know an ingredient, take it from the ingredients table, use it in your potion, and put it back on the table for others</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <span className="text-gray-200 pt-1"><strong>Prepare Test Potion:</strong> Add all your ingredients + dry ice for magical effects (DO NOT DRINK - contains dry ice!)</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <span className="text-gray-200 pt-1"><strong>Prepare Drinking Potion:</strong> Add the same ingredients WITHOUT dry ice (this one you'll drink!)</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  5
                </span>
                <span className="text-gray-200 pt-1"><strong>Get Validated:</strong> Present your completed potion to the organizer for validation</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  6
                </span>
                <span className="text-gray-200 pt-1"><strong>Win!</strong> If validated successfully, someone from your team drinks the Drinking Potion to complete the activity!</span>
              </li>
            </ol>
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4">
              <p className="text-red-200 font-bold text-lg mb-2">
                ⚠️ IMPORTANT SAFETY WARNING ⚠️
              </p>
              <p className="text-red-200 text-sm">
                <strong>Dry Ice Handling:</strong> ALWAYS use tongs to handle dry ice - never touch with bare hands!<br/>
                <strong>Test Potion:</strong> Contains DRY ICE - DO NOT DRINK!<br/>
                <strong>Drinking Potion:</strong> Safe to drink - NO dry ice added
              </p>
            </div>
            <div className="bg-purple-900 bg-opacity-50 border border-purple-600 rounded-lg p-4">
              <p className="text-purple-200 font-semibold">
                ✨ Good luck with your potion brewing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
