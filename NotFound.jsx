import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page introuvable</p>
      <Link to="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg">Retour à l'accueil</Link>
    </div>
  );
}