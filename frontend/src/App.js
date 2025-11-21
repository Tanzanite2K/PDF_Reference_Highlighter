// /app/frontend/src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PDFHighlighterApp from './components/PDFHighlighterApp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PDFHighlighterApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;