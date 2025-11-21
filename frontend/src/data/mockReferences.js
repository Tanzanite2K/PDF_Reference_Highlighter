// /app/frontend/src/data/mockReferences.js
// Mock reference data for demo purposes
// These references will be used to search and highlight text in the uploaded PDF

export const mockReferences = [
  {
    id: 1,
    description: 'A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025)',
    targetPhrase: 'Maersk’s results continued to improve year-on-year',
    pageNumber: null, // Will be determined dynamically from PDF
  },
  {
    id: 2,
    description: 'Strategic asset management',
    targetPhrase: 'assets',
    pageNumber: null,
  },
  {
    id: 3,
    description: 'Operational efficiency improvements',
    targetPhrase: 'Gain on sale of non-current assets, etc',
    pageNumber: null,
  },
  {
    id: 4,
    description: 'Highlights Q2 2025',
    targetPhrase: 'EBITDA increase',
    pageNumber: null,
  },
  {
    id: 5,
    description: 'Highlights Q2 2025 – EBITDA overview',
    targetPhrase: 'Terminals’ EBITDA increased by USD 50m', 
    pageNumber: null, 
  },
  {
    id: 6,
    description: 'Review Q2 2025',
    targetPhrase: 'Revenue increased', 
    pageNumber: null, 
  },
  {
    id: 7,
    description: 'Condensed Income Statement – Gain on sale of non-current assets',
    targetPhrase: 'Gain on sale of non-current assets, etc', 
    pageNumber: null, 
  },
  {
    id: 8,
    description: 'Profit before depreciation, amortisation and impairment losses',
    targetPhrase: 'Profit before depreciation', 
    pageNumber: null, 
  }
];
