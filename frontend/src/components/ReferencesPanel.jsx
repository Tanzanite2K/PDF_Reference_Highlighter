// /app/frontend/src/components/ReferencesPanel.jsx
import React from 'react';
import './ReferencesPanel.css';

function ReferencesPanel({ references, onReferenceClick, selectedReference }) {
  return (
    <div className="references-panel">
      <div className="references-header">
        <h2 className="references-title">Document Analysis</h2>
        <p className="references-subtitle">Click any reference to highlight in PDF</p>
      </div>

      <div className="references-content">
        <div className="analysis-text">
          <p className="analysis-paragraph">
  The Q2 2025 interim report highlights several important developments across the business. We’re seeing steady revenue growth in the core segments <ReferenceLink reference={references[0]} onClick={onReferenceClick} selected={selectedReference} />, thoughtful strategic decisions in asset management <ReferenceLink reference={references[1]} onClick={onReferenceClick} selected={selectedReference} />, and noticeable improvements in operational efficiency <ReferenceLink reference={references[2]} onClick={onReferenceClick} selected={selectedReference} /> and more.
</p>

<p className="analysis-paragraph">
  The recent financial restructuring has also brought meaningful changes to the balance sheet. These adjustments reflect the management’s focus on building a more optimized capital structure while still preserving the flexibility needed for smooth and efficient operations.
</p>


          <div className="reference-details">
            <h3 className="details-title">References</h3>
            <div className="reference-list">
              {references.map((ref) => (
                <div 
                  key={ref.id} 
                  className={`reference-item ${
                    selectedReference?.id === ref.id ? 'active' : ''
                  }`}
                >
                  <button
                    className="reference-button"
                    onClick={() => onReferenceClick(ref)}
                    aria-label={`Navigate to reference ${ref.id}`}
                  >
                    <span className="reference-number">[{ref.id}]</span>
                    <span className="reference-description">{ref.description}</span>
                  </button>
                  <div className="reference-meta">
                    <span className="reference-target">Target: "{ref.targetPhrase}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="keyboard-shortcuts">
          <h4 className="shortcuts-title">Keyboard Shortcuts</h4>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <kbd>1</kbd>
              <span>Jump to Reference [1]</span>
            </div>
            <div className="shortcut-item">
              <kbd>2</kbd>
              <span>Jump to Reference [2]</span>
            </div>
            <div className="shortcut-item">
              <kbd>3</kbd>
              <span>Jump to Reference [3]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferenceLink({ reference, onClick, selected }) {
  return (
    <button
      className={`inline-reference ${selected?.id === reference.id ? 'active' : ''}`}
      onClick={() => onClick(reference)}
      aria-label={`Reference ${reference.id}: ${reference.description}`}
    >
      [{reference.id}]
    </button>
  );
}

export default ReferencesPanel;