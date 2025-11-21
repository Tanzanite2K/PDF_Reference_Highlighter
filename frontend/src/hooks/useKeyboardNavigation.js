// /app/frontend/src/hooks/useKeyboardNavigation.js
import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation of references
 * Allows users to jump to references using number keys 1, 2, 3
 */
export const useKeyboardNavigation = (references, onReferenceClick) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle number keys 1-9
      const key = event.key;
      const num = parseInt(key);
      
      if (!isNaN(num) && num >= 1 && num <= 9) {
        // Find reference with matching ID
        const reference = references.find(ref => ref.id === num);
        
        if (reference && onReferenceClick) {
          event.preventDefault();
          onReferenceClick(reference);
          
          // Announce for accessibility
          const announcement = document.createElement('div');
          announcement.setAttribute('role', 'status');
          announcement.setAttribute('aria-live', 'polite');
          announcement.style.position = 'absolute';
          announcement.style.left = '-10000px';
          announcement.textContent = `Navigating to reference ${num}: ${reference.description}`;
          document.body.appendChild(announcement);
          
          setTimeout(() => {
            document.body.removeChild(announcement);
          }, 1000);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [references, onReferenceClick]);
};