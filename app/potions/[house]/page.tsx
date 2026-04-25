'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HouseType } from '@/app/types/potions';

export default function HouseCodeEntry() {
  const router = useRouter();
  const params = useParams();
  const house = params.house as HouseType;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const houseColors: Record<HouseType, { bg: string; accent: string }> = {
    gryffindor: { bg: 'from-red-900 to-yellow-800', accent: 'red' },
    slytherin: { bg: 'from-green-900 to-gray-800', accent: 'green' },
    hufflepuff: { bg: 'from-yellow-800 to-gray-800', accent: 'yellow' },
    ravenclaw: { bg: 'from-blue-900 to-gray-800', accent: 'blue' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/potions/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ house, code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(`/potions/${house}/recipe`);
      } else {
        setError(data.error || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${houseColors[house].bg} text-white`}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 capitalize">
              {house}
            </h1>
            <p className="text-xl text-gray-200">
              Enter your house code to access your potion recipe
            </p>
          </div>

          <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  House Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white text-center text-2xl tracking-widest font-mono"
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-3 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 4}
                className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                  loading || code.length < 4
                    ? 'bg-gray-600 cursor-not-allowed'
                    : `bg-${houseColors[house].accent}-600 hover:bg-${houseColors[house].accent}-700 hover:scale-105`
                } shadow-lg`}
              >
                {loading ? 'Verifying...' : 'Access Recipe'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/potions"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                ← Choose Different House
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
