# 📄 PDF Reference Highlighter

*A simple, clean tool for navigating references inside large PDFs*

This project is a React-based PDF viewer that lets you click a reference like **[1]** or **[3]**, and instantly jump to every place that phrase appears inside the document. Every match is highlighted, and you can move through them one by one.

It’s designed for documents where you constantly jump between a reference and the source text — things like annual reports, research papers, legal documents, or technical specs.

---

## ✨ What this tool does

* 🔍 **Finds all occurrences** of any phrase inside a PDF
* 🎯 **Highlights every match** across all pages (yellow)
* 🔵 **Shows which match you're currently focused on** (blue)
* ⬆️⬇️ **Next / Previous buttons** let you jump between occurrences
* 🧭 Auto-scrolls to the exact location of the match
* 🔎 Zoom in, zoom out, reset zoom
* 📤 Works with **any PDF you upload**
* 📄 Supports multi-page PDFs (even very long ones)

The experience feels similar to pressing **Ctrl + F** in Google Docs, but tied to clickable references.

---

## 🚀 Why this exists

While analyzing long PDFs (like the Maersk interim report), you often read something like:

> [3] “Gain on sale of non-current assets…”

…and then you have to manually search inside the PDF.
This tool removes all that effort:

* Click the reference
* The PDF highlights the matching text everywhere
* You can hop between the matches with two buttons

It saves time and keeps your focus.

---

## 🛠️ Tech Stack

* **React**
* **react-pdf** + **pdfjs-dist** (for rendering and text extraction)
* **Custom DOM scanning & highlight logic**
* **Pure CSS** for styling and color themes

---

## 📦 Project Structure

```
/src
 ├── components/
 │     ├── PDFViewer.jsx       # Main logic (highlighting, scanning, navigation)
 │     └── ReferencePanel.jsx  # (Optional) list of references
 │
 ├── styles/
 │     └── PDFViewer.css
 │
 ├── App.jsx
 └── index.js
```

---

## ▶️ Getting Started

Install dependencies:

```bash
npm install
npm install react-pdf pdfjs-dist
```

Run the project:

```bash
npm start
```

Then:

1. Upload a PDF
2. Click a reference
3. Watch the PDF scroll and highlight
4. Use **Next / Prev** to jump between matches

---

## 🔧 How the highlighting works (simple explanation)

1. After rendering, the viewer grabs all text spans that `react-pdf` creates.
2. It checks which spans contain the reference phrase.
3. Every match gets a **yellow** class.
4. The one you’re currently viewing gets a **blue** class.
5. The viewer scrolls so the blue highlight sits in the center of the screen.

That’s it — no magic, no AI, just DOM scanning + scroll math.

---

## 💡 Example Use Case

If the reference says:

> **[3] “Revenue growth”**

Then clicking **[3]** will:

* Highlight every “revenue growth” in the entire PDF
* Jump you to the first one
* Let you cycle through all others with two buttons

Perfect for audits, financial reviews, and summaries.

---

## 🧩 Reference Format

Your app expects something like:

```js
{
  id: 3,
  targetPhrase: "revenue growth"
}
```

You can point references to any phrase inside your uploaded PDF.

---

## ⭐ Future Ideas

* built-in search bar (Ctrl+F alternative)
* ability to save or export highlights
* dark mode
* bookmarking individual matches
* PDF sidebar with page thumbnails

---

## 🤝 Contributing

If you want to add features or improve the UI, feel free to open a PR.
This project is intentionally simple and easy to extend.

---

## 📜 License

MIT — free to use however you like.

---

If you want, I can also generate:

🟦 A **GitHub-professional version**
🟩 A **short clean one**
🟨 A **corporate/finance version**
🟥 A **fun, casual version**

Just tell me `"give GitHub version"` or `"give finance version"`.
