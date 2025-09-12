import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TestInterface from './pages/TestInterface';
import AdminPanel from './pages/AdminPanel';
import ResultsPage from './pages/ResultsPage';
import { TestProvider } from './contexts/TestContext';
import './App.css';

function App() {
  return (
    <TestProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestInterface />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </TestProvider>
  );
}

export default App;