# ADR 0001 – Tech-Stack

## Status
Angenommen.

## Kontext
Statische, kindersichere Lern-App ohne Backend, offline nutzbar, kostenlos auf
GitHub Pages deploybar, gut testbar.

## Entscheidung
- **Vite + React 18 + TypeScript (strict) + Tailwind CSS.**
- **State:** Zustand (schlank) über puren Reduzierern in `src/lib` – keine
  Over-Engineering-Lösung. Die Logik ist framework-frei und zu 100 % getestet.
- **Tests:** Vitest + React Testing Library.
- **Persistenz:** ausschließlich `localStorage`, kein Backend, kein Tracking,
  keine externen Fonts/CDNs.
- **PWA:** `vite-plugin-pwa` (installierbar, offline).
- **Analoguhr:** eigene SVG-Komponente, keine Fremd-Library.

## Konsequenzen
- Kein Server, keine Accounts – DSGVO-konform und einfach zu betreiben.
- Blöcke sind datengetrieben (`src/data/blocks.ts`); die fachliche Logik je Block
  liegt in `src/lib/generators/` statt in acht separaten Feature-Ordnern.
