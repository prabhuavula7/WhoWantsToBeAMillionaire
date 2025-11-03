# Who Wants to Be a Millionaire — Local (WWTBAM)

A local, family-friendly quiz app built with React, Vite and TailwindCSS.

This repository is intended for local use — quizzes and progress are stored in browser localStorage, no server or account is required.

Author: Prabhu Kiran Avula

License: MIT — see [LICENSE](./LICENSE) for full text.

---

## Get the code

Fork this repository on GitHub or clone it directly to your local machine. Once you have a copy locally, open the project folder in your editor and follow the Quick start steps below.

Example (clone):

```bash
git clone <repo-url>
cd WWTBAM
```

Or: fork on GitHub, then clone your fork and work from there.

## Quick start

Requirements:
- Node.js (v18+ recommended)
- npm (or yarn)

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open the app at the Local URL shown by Vite (default http://localhost:5173 or http://localhost:5174 if the default port is occupied).

Build for production:

```bash
npm run build
npm run preview
```

---

## What's included / Key features

- React + Vite application
- TailwindCSS for styling
- Framer Motion for animations and transitions
- LocalStorage-backed quiz storage (no backend)
- Quiz editor (Create / Edit) with support for:
  - Four-choice questions with a selected correct index
  - Upload or paste image URLs per question (uploads read as data URLs)
  - Importing quiz JSON files and editing imported content before saving
- Play mode (game) with prize ladder and lifelines (50:50, Ask Audience, Phone a Friend)

Newer functionality added:
- Import a JSON file containing a quiz (title + questions). Supported question keys: `question`/`text`, `answers`/`choices`, `correctIndex`/`correct`, and `image` or `imageUrl`.
  - The importer accepts files from the Play menu or from the Create/Edit page.
  - Imported quizzes open in the editor so you can tweak text, add/replace images, and save.
- Editor now preserves `imageUrl` fields and shows the image preview. Uploaded images are read as data URLs so you can preview immediately.
- Game screen displays a question image (if present) below the question text.

---

## JSON import format

The importer accepts a JSON structure similar to the example below. The importer will map fields as necessary and import the 15 questions for each game you want to create.

Example structure:

```json
{
  "title": "India & The World – Tough Edition",
  "questions": [
    { "question": "What is the chemical symbol for common salt?", "answers": ["NaCl","KCl","CaCO₃","Na₂SO₄"], "correctIndex": 0, "imageUrl": "https://.../salt.jpg" },
    // ... up to 15 questions
  ]
}
```

Notes:
- `answers` (or `choices`) should be an array. If fewer than 4 entries are provided they will be padded with empty strings; if more, they will be truncated to 4.
- `correctIndex` should be a number 0..3. The importer will clamp values into that range.
- `image` or `imageUrl` (optional) will be used to populate the editor's image field for that question.

---

## Usage / Workflow

- Create / Edit:
  - From the Home screen choose "Create Quiz" or from Play → Edit for existing quizzes.
  - Add questions, fill four choices, select the correct radio button, and optionally paste an image URL or upload a file for each question.
  - You can import a quiz JSON file (Play → Import JSON or Import from the Create/Edit header). Imported quizzes open in the editor for final tweaks before saving.
  - Click Save (Save Quiz / Save Changes) to persist to localStorage.

- Play:
  - Select Play on a saved quiz. When a question has an associated image (uploaded data URL or external URL), it will be displayed below the question text during play.

---

## Data & storage notes

- All quizzes are saved to browser localStorage under the `quizzes` key. No server is involved.
- Uploaded images are read as data URLs and stored inline with the quiz object. localStorage quotas are limited (commonly ~5MB per origin) and large or many images can exceed that limit or make the app slow. Recommended approaches if you expect many/large images:
  - Store binary image blobs in IndexedDB (e.g. via localForage).
  - Upload images to remote storage and store only returned URLs in the quiz JSON.
  - Restrict client-side uploads to a conservative file-size (e.g. <= 200–400 KB) and resize/compress images before saving.

---

## Troubleshooting

- If Tailwind directives show linter warnings in your editor (Unknown at rule `@tailwind` / `@apply`), that is the editor linter not processing PostCSS/Tailwind — it does not affect Vite dev builds.
- If colors or CSS updates do not appear, try a hard reload (Cmd+Shift+R) or stop/restart the dev server to force a rebuild.
- If the importer shows an error, check that your JSON is valid and conforms to the supported shape (title + questions array). The importer will alert with a brief message on failure.

---

## Development notes

- Main entry: `src/main.jsx` → `src/App.jsx`.
- Key screens: `src/screens/CreateQuizScreen.jsx`, `src/screens/PlayMenuScreen.jsx`, `src/screens/GameScreen.jsx`.
- Reusable UI: `src/components/*` (PrimaryButton, HeaderBar).
- Static assets live in `public/`.

Suggested improvements / TODOs:
- Use IndexedDB (localForage) to store images instead of localStorage when uploads are enabled.
- Add client-side image validation (file size, type) and optional compression before saving.
- Improve importer validation and present inline per-question errors instead of alerts.

---

## License

This project is provided as-is for local use. Check individual asset licenses if you redistribute.

