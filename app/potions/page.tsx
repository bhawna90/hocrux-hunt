'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HouseType } from '../types/potions';

export default function PotionsHome() {
  const router = useRouter();
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);

  const houses: { name: HouseType; color: string; description: string }[] = [
    {
      name: 'gryffindor',
      color: 'from-red-600 to-yellow-500',
      description: 'Where dwell the brave at heart',
    },
    {
      name: 'slytherin',
      color: 'from-green-600 to-gray-700',
      description: 'Those cunning folk use any means',
    },
    {
      name: 'hufflepuff',
      color: 'from-yellow-500 to-gray-800',
      description: 'Where they are just and loyal',
    },
    {
      name: 'ravenclaw',
      color: 'from-blue-600 to-gray-700',
      description: 'Where those of wit and learning',
    },
  ];

  const handleHouseSelect = (house: HouseType) => {
    setSelectedHouse(house);
    router.push(`/potions/${house}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🧪 Potions Class 🧪
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Welcome to Advanced Potion-Making
          </p>
          <p className="text-lg text-gray-400">
            Select your house to begin brewing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {houses.map((house) => (
            <button
              key={house.name}
              onClick={() => handleHouseSelect(house.name)}
              className={`p-8 rounded-lg bg-gradient-to-br ${house.color} hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-transparent hover:border-white`}
            >
              <h2 className="text-3xl font-bold mb-2 capitalize">
                {house.name}
              </h2>
              <p className="text-gray-200 italic">{house.description}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
