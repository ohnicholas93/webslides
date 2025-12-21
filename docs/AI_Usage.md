# AI Usage: Generate a Deck (and Export to PowerPoint)

This project is designed so a multimodal LLM can draft an entire deck by generating a single file: `src/app/page.tsx`.
You’ll provide the model with (1) the repo’s “shape” via Repomix, and (2) visual examples of what good slides look like using the sample images in `docs/assets/`.

Given its excellent multimodal understanding, frontend generation, and long-context capabilities, Gemini 3 Pro (available for free through Google AI Studio) is highly recommended. Excellent empirical performance has been observed with Gemini 3 Pro in the WebSlides generation task.

## 1) Set Up the Repo Locally

Prerequisites: install **Node.js** locally.

```bash
git clone https://github.com/ohnicholas93/webslides.git
cd webslides
npm install
npm run dev
```

Open `http://localhost:3000` to preview the current deck.

## 2) Get a Repomix Snapshot

Open the Repomix link below and export/copy the generated XML:

[Repomix Link](https://repomix.com/?repo=ohnicholas93%2Fwebslides)

Save it locally as something like `repomix.xml` (or keep it ready to paste into your LLM chat).

## 3) Give the LLM the Right Context (Multimodal)

In your LLM chat, attach or paste **all** of the following:

- The Repomix XML output (describes repo structure + key files)
- The sample slide images:
  - `docs/assets/slide1.png`
  - `docs/assets/slide2.png`
  - `docs/assets/slide3.png`
  - `docs/assets/slide4.png`
- Your presentation material:
  - a short outline you write, and/or
  - a PDF, notes, paper, links, etc.

These images matter: they show the “house style” and how the base template renders.

## 4) Use This Prompt (Copy/Paste)

Adjust the prompt below based on your requirements. Then, paste the prompt after you’ve provided the context above.

```text
You are helping me generate slides for the WebSlides repo (Next.js + React + Tailwind).

Goal:
- Generate a complete replacement for `src/app/page.tsx` that renders my deck using the existing components in the repo.
- Use the visual style of the provided sample slides (I attached slide screenshots) as the reference for how the base template renders.

Hard constraints (must follow):
- Each slide has only 1080px of vertical height real estate in the DOM.
  - Do NOT overflow vertically. Overflow will look terrible in the export.
  - Prefer fewer words, tighter bullet lists, and multi-column layouts over long paragraphs.
- Build slides using `<PresentationSlide title="..."> ... </PresentationSlide>` from the repo.
- For math/LaTeX, use `Latex` from `@/components/latex` (supports `$...$`, `$$...$$`, `\\(...\\)`, `\\[...\\]`).
- Keep typography and spacing presentation-friendly: readable at a distance, consistent hierarchy.
- When adding images, assume they live in `public/assets/` and are referenced like `assets/<filename>`.
- You may use figures, diagrams, images, tables, etc. provided from the reference content (if available). These do not come with captions.
- Make sure to use the correct and appropriate theme class tokens.
- Output ONLY the final TypeScript/TSX code for `src/app/page.tsx` (no explanations).
- Tip: prefer `String.raw\`...\`` when embedding LaTeX so backslashes don’t need double-escaping.

My deck requirements:
1) Audience: <describe the audience>
2) Duration: <e.g., 8 minutes / 15 minutes>
3) Number of slides: <e.g., 8–12>
4) Tone: <e.g., academic / startup / internal tech talk>
5) Content to include (outline + key points):
<paste your outline OR say “see attached PDF” and summarize what to cover>

Slide sizing checklist (apply to every slide before finalizing):
- No section should require scrolling.
- Bullet lists should generally be <= 5–6 lines per column.
- Headings should not wrap to 3+ lines.
- Use whitespace intentionally; avoid cramming.

Now produce `src/app/page.tsx`.
```

## 5) Apply the Generated `page.tsx`

Replace your local `src/app/page.tsx` with the model output, then run:

```bash
npm run dev
```

Review every slide at `http://localhost:3000` and fix anything that looks cramped or clipped.

## 6) Add/Update Assets

If your generated slides reference images, copy them into `public/assets/`. For example, if your generated slides reference `assets/diagram.png`, copy it to `public/assets/diagram.png`. Make sure to replace the logo / branding with your own at `public/assets/logo.png`.

Then refresh the page and confirm all visuals load correctly.

## 7) Export PNGs, Then Build a PowerPoint (Optional)

1. Click **Export** in the header to download `slide-01.png`, `slide-02.png`, …
2. Import the PNGs into Google Slides or Microsoft PowerPoint.
3. Export/download as `.pptx` if you need a PowerPoint file.

Tip: If a slide looks “too dense” after export, reduce text, increase spacing, or split it into two slides. You can describe any required changes with an AI Editor like Cursor.

## Dark Mode Note

Dark mode is supported, but you’ll typically want to build a **custom theme** (so backgrounds, cards, and accent colors stay consistent).
An AI can generate that theme as well—ask it to create/update the theme tokens/styles used by the repo’s slide components—and make sure your typography colors are adjusted for contrast and readability.
