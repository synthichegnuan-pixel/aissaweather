import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CompleteOutfitCoach from '../TOTO.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="p-4 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
          <nav className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="text-xl font-bold">Coach Style</div>
            <div className="flex gap-4">
              <Link to="/" className="text-purple-700 font-medium">Accueil</Link>
              <Link to="/about" className="text-gray-700">À propos</Link>
            </div>
          </nav>
        </header>

        <main className="py-6">
          <div className="max-w-4xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<CompleteOutfitCoach />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}