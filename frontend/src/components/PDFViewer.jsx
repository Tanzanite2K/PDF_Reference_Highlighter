// path: src/components/PDFViewer.jsx
import React, { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../pdf-worker.js";
import "./PDFViewer.css";

function PDFViewer({ pdfFile, selectedReference, onHighlightComplete }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [highlights, setHighlights] = useState([]); // array of { pageNum }
  const [allMatchesCount, setAllMatchesCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const pdfContainerRef = useRef(null);
  const pageWrapperRefs = useRef({}); // pageNum -> element
  const matchElementsRef = useRef([]); // array of matched span elements (DOM)

  // Load PDF and extract text asynchronously (we still render pages so text layers exist)
  const onDocumentLoadSuccess = async (pdf) => {
    setNumPages(pdf.numPages);
    setIsLoadingText(true);
    // We don't strictly need to extract getTextContent here for highlighting since we'll use textLayer spans,
    // but keeping a quick pass to ensure pages load & text layers are ready.
    // A short delay will be used later before scanning spans.
    setIsLoadingText(false);
  };

  // When a new reference is selected, compute highlights across entire PDF (all pages)
  useEffect(() => {
    // clear previous highlights and matches
    clearAllSpanHighlights();
    matchElementsRef.current = [];
    setAllMatchesCount(0);
    setCurrentMatchIndex(-1);
    setHighlights([]);

    if (!selectedReference || !pdfContainerRef.current || !numPages) return;

    const target = selectedReference.targetPhrase;
    if (!target || typeof target !== "string") return;

    // set highlights placeholder for pages (we'll detect actual spans shortly)
    const targetLower = target.toLowerCase();

    // We'll wait until text layers render. Set highlights state to pages that roughly contain the phrase
    // by scanning textLayer spans after a small delay (to let react-pdf render text layers).
    const attemptScan = () => {
      // find all page wrappers and all spans within them
      const pageWrappers = pdfContainerRef.current.querySelectorAll(
        ".react-pdf__Page"
      );

      const pagesWithMatches = new Set();
      const foundMatchElements = [];

      pageWrappers.forEach((pageEl) => {
        // pageEl corresponds to .react-pdf__Page; find its page number via attribute or wrapper
        // react-pdf renders pages inside .react-pdf__Page with aria-label containing "Page X"
        let pageNum = null;
        const aria = pageEl.getAttribute("aria-label");
        if (aria) {
          const m = aria.match(/page (\d+)/i);
          if (m) pageNum = parseInt(m[1], 10);
        }
        // fallback: try to find parent wrapper with data-page-number
        if (!pageNum) {
          const wrapper = pageEl.closest(".pdf-page-wrapper");
          if (wrapper && wrapper.dataset && wrapper.dataset.pageNum) {
            pageNum = parseInt(wrapper.dataset.pageNum, 10);
          }
        }

        const textLayer = pageEl.querySelector(".react-pdf__Page__textContent");
        if (!textLayer) return;

        const spans = Array.from(textLayer.querySelectorAll("span"));
        spans.forEach((span) => {
          const s = (span.textContent || "").toLowerCase();
          if (s.includes(targetLower)) {
            pagesWithMatches.add(pageNum !== null ? pageNum : -1);
            foundMatchElements.push({ el: span, pageNum });
            // highlight the span immediately
            span.classList.add("pdf-text-highlight");
          }
        });
      });

      // sort foundMatchElements by pageNum then DOM order
      foundMatchElements.sort((a, b) => {
        const pa = a.pageNum || 0;
        const pb = b.pageNum || 0;
        if (pa !== pb) return pa - pb;
        // as fallback keep original order
        return 0;
      });

      matchElementsRef.current = foundMatchElements.map((f) => f.el);
      setAllMatchesCount(matchElementsRef.current.length);
      setHighlights(
        Array.from(pagesWithMatches)
          .filter((p) => p && p > 0)
          .sort((a, b) => a - b)
          .map((p) => ({ pageNum: p }))
      );

      if (matchElementsRef.current.length > 0) {
        // focus first match
        setCurrentMatchIndex(0);
        // scroll to first match element
        scrollToMatchIndex(0, { smooth: true, focus: true });
      }
    };

    // Try scanning a few times (in case textLayers are still rendering)
    let tries = 0;
    const maxTries = 8;
    const scanInterval = 300;
    const intervalId = setInterval(() => {
      tries += 1;
      attemptScan();
      if (matchElementsRef.current.length > 0 || tries >= maxTries) {
        clearInterval(intervalId);
      }
    }, scanInterval);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReference, numPages]);

  // helper to remove highlight classes from spans
  const clearAllSpanHighlights = () => {
    try {
      const spans = document.querySelectorAll(".react-pdf__Page__textContent span.pdf-text-highlight");
      spans.forEach((span) => {
        span.classList.remove("pdf-text-highlight", "pdf-text-current");
      });
    } catch (e) {
      // ignore
    }
  };

  // REPLACE current scrollToMatchIndex with this (paste into your component)
const scrollToMatchIndex = (index, { smooth = true, focus = false } = {}) => {
  const el = matchElementsRef.current[index];
  if (!el || !pdfContainerRef.current) return;

  const container = pdfContainerRef.current;

  // Get bounding rects
  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  // Compute top position relative to container scrollTop
  // desiredScrollTop = currentScrollTop + (elRect.top - containerRect.top) - (containerRect.height/2) + (elRect.height/2)
  const currentScrollTop = container.scrollTop;
  const delta = elRect.top - containerRect.top;
  const desiredScrollTop = Math.max(
    0,
    Math.floor(currentScrollTop + delta - containerRect.height / 2 + elRect.height / 2)
  );

  // Smooth scroll
  if ('scrollTo' in container) {
    container.scrollTo({
      top: desiredScrollTop,
      behavior: smooth ? 'smooth' : 'auto',
    });
  } else {
    // Fallback
    container.scrollTop = desiredScrollTop;
  }

  // update classes for current match (remove old, add new)
  try {
    document.querySelectorAll(".react-pdf__Page__textContent span.pdf-text-current").forEach((s) => {
      s.classList.remove("pdf-text-current");
    });
    el.classList.add("pdf-text-current");
    if (focus) {
      el.setAttribute("tabindex", "-1");
      el.focus?.();
    }
  } catch (e) {
    // ignore
  }
};


  // REPLACE goToNextMatch with this
const goToNextMatch = () => {
  const total = matchElementsRef.current.length;
  if (!total) return;

  // compute next index deterministically
  const nextIndex = currentMatchIndex + 1 >= total ? 0 : currentMatchIndex + 1;

  // scroll to element (use smooth + focus)
  scrollToMatchIndex(nextIndex, { smooth: true, focus: true });

  // update state immediately
  setCurrentMatchIndex(nextIndex);
};


  // REPLACE goToPrevMatch with this
const goToPrevMatch = () => {
  const total = matchElementsRef.current.length;
  if (!total) return;

  const prevIndex = currentMatchIndex - 1 < 0 ? total - 1 : currentMatchIndex - 1;

  scrollToMatchIndex(prevIndex, { smooth: true, focus: true });

  setCurrentMatchIndex(prevIndex);
};


  const clearHighlights = () => {
    clearAllSpanHighlights();
    matchElementsRef.current = [];
    setAllMatchesCount(0);
    setHighlights([]);
    setCurrentMatchIndex(-1);
    if (onHighlightComplete) onHighlightComplete();
  };

  // Zoom controls
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.6));
  const handleResetZoom = () => setScale(1.2);

  if (!pdfFile) {
    return (
      <div className="pdf-viewer-empty">
        <div className="empty-state">
          <p>Upload a PDF to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <div className="left-controls">
          <button onClick={goToPrevMatch} disabled={allMatchesCount === 0} aria-label="Previous match">Prev Match</button>
          <button onClick={goToNextMatch} disabled={allMatchesCount === 0} aria-label="Next match">Next Match</button>
          <span className="match-info">
            {allMatchesCount > 0 ? `${currentMatchIndex + 1 || 1} / ${allMatchesCount} matches` : "No matches"}
          </span>
          <button onClick={clearHighlights} disabled={allMatchesCount === 0}>Clear Highlights</button>
        </div>

        <div className="right-controls">
          <button onClick={handleZoomOut}>-</button>
          <button onClick={handleResetZoom}>{Math.round(scale * 100)}%</button>
          <button onClick={handleZoomIn}>+</button>
        </div>
      </div>

      <div className="pdf-content" ref={pdfContainerRef}>
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="pdf-loading"><div className="spinner" /> Loading PDF...</div>}
        >
          {/* Render all pages so textLayers exist for every page (required for full-document highlighting) */}
          {Array.from(new Array(numPages || 0), (el, index) => {
            const pageNum = index + 1;
            return (
              <div
                key={`page_wrapper_${pageNum}`}
                className="pdf-page-wrapper"
                data-page-num={pageNum}
                ref={(r) => {
                  if (r) pageWrapperRefs.current[pageNum] = r;
                }}
              >
                <Page
                  pageNumber={pageNum}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;
