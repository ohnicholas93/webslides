# WebSlides Agent Notes

## Hard constraints (must follow):
- Each slide has only 1080px of vertical height real estate in the DOM.
  - Do NOT overflow vertically. Overflow will look terrible in the export.
  - Prefer fewer words, tighter bullet lists, and multi-column layouts over long paragraphs.
- Build slides using `<PresentationSlide title="..."> ... </PresentationSlide>` from the repo.
- Keep typography and spacing presentation-friendly: readable at a distance, consistent hierarchy.
- When adding images, assume they live in `public/assets/` and are referenced like `assets/<filename>`.
- You may use figures, diagrams, images, tables, etc. provided from the reference content (if available). These do not come with captions.
- Make sure to use the correct and appropriate theme class tokens.
- For math/LaTeX, use `Latex` from `@/components/latex`. 
  - **Mandatory**: Always wrap content in `{String.raw`...`}` (e.g., `<Latex>{String.raw`$E=mc^2$`}</Latex>`).
  - **Mandatory**: Use explicit delimiters (`$ ... $` for inline, `$$ ... $$` for display) inside the `String.raw` block.
- Tip: prefer `String.raw\`...\`` when embedding LaTeX so backslashes don’t need double-escaping.
- Maintain TSX comments before each `<PresentationSlide>` to mark which slide number it is (for easier code navigation).
- Output ONLY the final TypeScript/TSX code for `src/app/page.tsx` (no explanations).

## Slide sizing checklist (apply to every slide before finalizing):
- No section should require scrolling.
- Content tends to render MUCH bigger than you think, so minimize filler words and make sure there are NO REDUNDANT INFORMATION AT ALL. Use the space effectively and efficiently.
- MAKE SURE IT IS NOT WORDY, and rather, it should be more VISUAL to convey the message. Sentences don't have to be full sentences. This is a slide deck!
- Bullet lists should generally be <= 5–6 lines per column.
- Headings should not wrap to 3+ lines.
- Use whitespace intentionally; avoid cramming.
- Do NOT use ANY font size smaller than text-xl. It must be >=text-xl.

## Slide marker maintenance

- Keep a TSX comment immediately before every rendered `<PresentationSlide>`, using sequential markers such as `{/* Slide 01 */}`.
- When a slide is added, removed, moved, or commented out, renumber all remaining slide markers so they match the rendered slide order with no gaps.
- If a slide block is temporarily disabled, update affected markers immediately; do not leave stale numbering behind. 

