# AI Usage: Generate a Deck

This project is designed so a multimodal LLM can draft an entire deck by generating a single file: `src/app/page.tsx`.
You’ll provide the model with the repo’s shape via Repomix, reference material for the talk, and any visual direction you want the deck to follow.

Given its excellent multimodal understanding, frontend generation, and long-context capabilities, Gemini 3 Pro (available for free through Google AI Studio) is highly recommended. Excellent empirical performance has been observed with Gemini 3 Pro in the WebSlides generation task.

## Authoring Philosophy

WebSlides should give the model strong structural constraints without forcing a house theme.

The model should keep the deck export-safe and readable, but it may define a fresh visual language for each deck, section, or slide. It can create local helper components, class constants, data arrays, SVG diagrams, CSS-driven visuals, and reusable layout primitives inside `src/app/page.tsx` when they improve clarity or reduce duplication. Do not require a global `deckStyle` object or repo-level theme system.

Good generated decks should:

- Use `PresentationSlide` as the slide boundary and preserve export/runtime behavior.
- Be visually specific to the content instead of copying a fixed template.
- Reuse local components/classes when patterns repeat, but allow one-off slide treatments when they communicate better.
- Keep layout predictable enough for a live presentation: clear hierarchy, readable type, no clipped content.
- Keep important content visible in the final exported state.

## 1) Set Up the Repo Locally

Prerequisites: install **Node.js** and **npm** locally.

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
- Optional sample slide images:
  - `docs/assets/slide-01.png`
  - `docs/assets/slide-02.png`
  - `docs/assets/slide-03.png`
  - `docs/assets/slide-04.png`
- Your presentation material:
  - a short outline you write, and/or
  - a PDF, notes, paper, links, etc.
- Visual direction, if any:
  - brand colors, logo, audience, venue, tone, visual references, or “create a new style from the content”

Sample images are useful for understanding scale and rendering behavior. They are not a required house style.

## 4) Use This Prompt (Copy/Paste)

Adjust the prompt below based on your requirements. Then, paste the prompt after you’ve provided the context above.

```text
You are helping me generate slides for the WebSlides repo (Next.js + React + Tailwind).

Goal:
- Generate a complete replacement for `src/app/page.tsx` that renders my deck using the existing components in the repo.
- Create a bespoke visual style for this deck based on the topic, audience, and source material. Do not rely on a fixed house theme unless I explicitly ask for one.

Hard constraints (must follow):
- Each slide has only 1080px of vertical height real estate in the DOM.
  - Do NOT overflow vertically. Overflow will look terrible in the export.
  - Prefer fewer words, tighter bullet lists, and multi-column layouts over long paragraphs.
- Build slides using `<PresentationSlide title="..."> ... </PresentationSlide>` from the repo.
- Keep typography and spacing presentation-friendly: readable at a distance, consistent hierarchy.
- When adding images, assume they live in `public/assets/` and are referenced like `assets/<filename>`.
- You may use figures, diagrams, images, tables, etc. provided from the reference content (if available). These do not come with captions.
- You may define any reusable helper components, class constants, data structures, SVG diagrams, or layout primitives inside `src/app/page.tsx`.
- Prefer reuse where it reduces duplication or creates coherence, but do not force a global theme object. Each slide may have a distinct visual treatment when that better communicates the content.
- Use Tailwind classes directly. Do not depend on repo-level themes for slide content.
- Keep all important content visible in the final exported slide state. Do not use auto-playing carousels, looping hidden-content animations, marquees, or timing-dependent content as the primary way to communicate information.
- For math/LaTeX, use `Latex` from `@/components/latex`. 
  - **Mandatory**: Always wrap content in `{String.raw`...`}` (e.g., `<Latex>{String.raw`$E=mc^2$`}</Latex>`).
  - **Mandatory**: Use explicit delimiters (`$ ... $` for inline, `$$ ... $$` for display) inside the `String.raw` block.
- Tip: prefer `String.raw\`...\`` when embedding LaTeX so backslashes don’t need double-escaping.
- Maintain TSX comments before each `<PresentationSlide>` to mark which slide number it is (for easier code navigation).
- Output ONLY the final TypeScript/TSX code for `src/app/page.tsx` (no explanations).

My deck requirements:
1) Audience: <describe the audience>
2) Duration: <e.g., 8 minutes / 15 minutes>
3) Number of slides: <e.g., 8–12>
4) Tone: <e.g., academic / startup / internal tech talk>
5) Content to include (outline + key points):
<paste your outline OR say “see attached PDF” and summarize what to cover>
6) Visual direction:
<optional: describe brand, references, mood, or say “create a new visual style from the content”>

Slide sizing checklist (apply to every slide before finalizing):
- No section should require scrolling.
- Content tends to render MUCH bigger than you think, so minimize filler words and make sure there are NO REDUNDANT INFORMATION AT ALL. Use the space effectively and efficiently.
- MAKE SURE IT IS NOT WORDY, and rather, it should be more VISUAL to convey the message. Sentences don't have to be full sentences. This is a slide deck!
- Bullet lists should generally be <= 5–6 lines per column.
- Headings should not wrap to 3+ lines.
- Use whitespace intentionally; avoid cramming.
- Do NOT use ANY font size smaller than text-xl. It must be >=text-xl.

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

## 7) Export the Deck

1. Click **Export** in the header.
2. Choose `PNGs`, `PDF`, or `PPTX`.
3. If you choose `PNGs`, you’ll get `slide-01.png`, `slide-02.png`, … inside a zip file.
4. If you choose `PPTX`, the app generates a PowerPoint directly from rendered slide images.

Tip: If a slide looks “too dense” after export, reduce text, increase spacing, or split it into two slides. You can describe any required changes with an AI Editor like Cursor.

## Style Note

WebSlides does not provide built-in slide themes. New generated slide decks should define their own visuals in `src/app/page.tsx`, using local components and class constants only where they help the deck stay coherent and maintainable.
