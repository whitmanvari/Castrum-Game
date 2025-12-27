import { useState } from 'react'

function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-castrum-gold mb-2 drop-shadow-lg">
          🏰 CASTRUM
        </h1>
        <p className="text-gray-400 text-xl tracking-widest">STRATEJİ & AKIL OYUNU</p>
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">Hoş Geldiniz</h2>
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 mb-4">
          Turnuvaya Katıl
        </button>
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg transition duration-300">
          Nasıl Oynanır?
        </button>
      </div>
      
      <div className="text-sm text-gray-500 mt-8">
        Marmara Üniversitesi BÖTE - Zeka Oyunları Dersi Projesi
      </div>
    </div>
  )
}

export default App