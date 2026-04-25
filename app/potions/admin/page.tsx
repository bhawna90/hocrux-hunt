'use client';

import { useState, useEffect } from 'react';
import { HouseType, HouseConfig, PotionRecipe, PotionsAdminState } from '@/app/types/potions';

export default function PotionsAdmin() {
  const [adminState, setAdminState] = useState<PotionsAdminState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'houses' | 'recipes'>('houses');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/potions/admin/data');
      const data = await response.json();
      if (response.ok) {
        setAdminState(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateHouseCode = (house: HouseType, code: string) => {
    if (!adminState) return;

    const updatedHouses = adminState.houses.map(h =>
      h.house === house ? { ...h, code } : h
    );

    setAdminState({ ...adminState, houses: updatedHouses });
  };

  const updateHouseRecipe = (house: HouseType, recipeId: string | null) => {
    if (!adminState) return;

    const updatedHouses = adminState.houses.map(h =>
      h.house === house ? { ...h, assignedRecipeId: recipeId } : h
    );

    setAdminState({ ...adminState, houses: updatedHouses });
  };

  const toggleHouseActive = (house: HouseType) => {
    if (!adminState) return;

    const updatedHouses = adminState.houses.map(h =>
      h.house === house ? { ...h, isActive: !h.isActive } : h
    );

    setAdminState({ ...adminState, houses: updatedHouses });
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/potions/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminState),
      });

      if (response.ok) {
        alert('Configuration saved successfully!');
      } else {
        alert('Failed to save configuration');
      }
    } catch (err) {
      alert('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetRecipes = async () => {
    if (!confirm('Are you sure you want to reset all recipes to defaults? This will replace all current recipes with the new ingredient lists.')) {
      return;
    }

    setResetting(true);
    try {
      const response = await fetch('/api/potions/admin/reset-recipes', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Recipes reset successfully! Refreshing page...');
        window.location.reload();
      } else {
        alert('Failed to reset recipes');
      }
    } catch (err) {
      alert('Error resetting recipes');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!adminState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-2xl text-red-400">Failed to load admin data</div>
      </div>
    );
  }

  const getRecipeName = (recipeId: string | null) => {
    if (!recipeId) return 'No recipe assigned';
    const recipe = adminState.recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Unknown recipe';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">🧙 Potions Class Admin</h1>
          <p className="text-gray-400">Manage house codes and recipe assignments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'houses'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            House Management
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'recipes'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Available Recipes
          </button>
        </div>

        {/* Houses Tab */}
        {activeTab === 'houses' && (
          <div className="space-y-6">
            {adminState.houses.map((houseConfig) => (
              <div
                key={houseConfig.house}
                className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold capitalize">{houseConfig.house}</h3>
                  <button
                    onClick={() => toggleHouseActive(houseConfig.house)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      houseConfig.isActive
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {houseConfig.isActive ? '✓ Active' : '✗ Inactive'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* House Code */}
                  <div>
                    <label className="block text-sm font-medium mb-2">House Code</label>
                    <input
                      type="text"
                      value={houseConfig.code}
                      onChange={(e) => updateHouseCode(houseConfig.house, e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono"
                      placeholder="XXXX-XXXX"
                    />
                  </div>

                  {/* Assigned Recipe */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned Recipe</label>
                    <select
                      value={houseConfig.assignedRecipeId || ''}
                      onChange={(e) => updateHouseRecipe(houseConfig.house, e.target.value || null)}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    >
                      <option value="">No recipe assigned</option>
                      {adminState.recipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                  Currently assigned: <span className="text-yellow-400">{getRecipeName(houseConfig.assignedRecipeId)}</span>
                </div>
              </div>
            ))}

            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={saveConfiguration}
                disabled={saving}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg hover:scale-105 transform transition-all"
              >
                {saving ? 'Saving...' : '💾 Save All Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            {/* Reset Recipes Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={resetRecipes}
                disabled={resetting}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg hover:scale-105 transform transition-all"
              >
                {resetting ? 'Resetting...' : '🔄 Reset Recipes to Defaults'}
              </button>
            </div>

            {adminState.recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* Recipe Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-purple-300 mb-2">{recipe.name}</h3>
                      <p className="text-gray-400">{recipe.description}</p>
                    </div>
                    <button
                      onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                      className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      {expandedRecipe === recipe.id ? '👁️ Hide' : '👁️ View'} Cheat Sheet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-yellow-300">Ingredients:</h4>
                      <p className="text-sm text-gray-300">{recipe.ingredients.length} items</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-yellow-300">Instructions:</h4>
                      <p className="text-sm text-gray-300">{recipe.instructions.length} steps</p>
                    </div>
                  </div>
                </div>

                {/* Expandable Cheat Sheet */}
                {expandedRecipe === recipe.id && (
                  <div className="border-t border-gray-700 bg-gray-900 bg-opacity-50 p-6">
                    <h4 className="text-xl font-bold text-yellow-300 mb-4">🔐 Admin Cheat Sheet</h4>

                    {/* Ingredients with Clues */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-purple-300 mb-3">Ingredients & Clues:</h5>
                      <div className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                          <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <div className="font-bold text-green-400 mb-1">✓ {ing.name}</div>
                                <div className="text-gray-400 text-sm italic">Clue: "{ing.clue}"</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h5 className="font-semibold text-purple-300 mb-3">Brewing Instructions:</h5>
                      <ol className="space-y-2">
                        {recipe.instructions.map((instruction, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-gray-300">
                            <span className="flex-shrink-0 font-bold text-purple-400">{idx + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-12">
          <a href="/potions" className="text-purple-400 hover:text-purple-300 underline">
            → View Participant Page
          </a>
        </div>
      </div>
    </div>
  );
}
