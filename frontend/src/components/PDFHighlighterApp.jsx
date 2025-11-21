// /app/frontend/src/components/PDFHighlighterApp.jsx
import React, { useState } from 'react';
import PDFViewer from './PDFViewer';
import ReferencesPanel from './ReferencesPanel';
import { mockReferences } from '../data/mockReferences';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import './PDFHighlighterApp.css';

function PDFHighlighterApp() {
  const [selectedReference, setSelectedReference] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const handleReferenceClick = (reference) => {
    setSelectedReference(reference);
  };

  // Enable keyboard navigation
  useKeyboardNavigation(mockReferences, handleReferenceClick);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  return (
    <div className="pdf-highlighter-app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">PDF Reference Highlighter</h1>
          <div className="upload-section">
            <label htmlFor="pdf-upload" className="upload-button">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload PDF
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            {pdfFile && (
              <span className="file-name">{pdfFile.name}</span>
            )}
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="pdf-viewer-container">
          <PDFViewer 
            pdfFile={pdfFile}
            selectedReference={selectedReference}
            onHighlightComplete={() => setSelectedReference(null)}
          />
        </div>
        <div className="references-container">
          <ReferencesPanel 
            references={mockReferences}
            onReferenceClick={handleReferenceClick}
            selectedReference={selectedReference}
          />
        </div>
      </div>
    </div>
  );
}

export default PDFHighlighterApp;
