# ROADMAP

## M0 – Setup (abgeschlossen)
- Vite + React + TS + Tailwind, ESLint, Vitest, CI/CD, PWA, GitHub Pages.
- Dokumentation (SPEC, DESIGN, GAMEPLAY, Vorlagen-Analyse, ADR).

## M1 – Zeitlogik & Uhr (abgeschlossen)
- `src/lib/time.ts` mit voller Testabdeckung.
- SVG-Analoguhr (blauer Stunden-, roter Minutenzeiger), Stoppuhr, Timeline.

## M2 – Aufgabenblöcke A–H (abgeschlossen)
- Generatoren je Block, selbstkonsistent getestet.
- Runden-Engine, Feedback mit Erklärung, Fehlertyp-Erkennung.

## M3 – Spielmechanik (abgeschlossen)
- Punkte, Serie, Herzen, Sterne, Abzeichen, Levelkarte, Freischaltbares.
- Eltern-/Lehreransicht, Einstellungen (Ton, Zeitdruck), localStorage.

## M4 – Feinschliff (abgeschlossen)
- ✅ Screenshots im README (Levelkarte, Aufgabe).
- ✅ Render-/Interaktionstests für alle Screens (LevelMap, Results, Profile,
  Parent, AnswerInput-Widgets).
- ✅ Interaktive Uhr (Zeiger ziehen oder Pfeiltasten) als zusätzlicher
  Aufgabentyp in Block A: „Stelle die Uhr ein" (`SettableClock`).
- ✅ Mehr Aufgabenvarianten & Kontexte pro Block:
  - Block F: 10 → 18 Situationen
  - Block C: 7 → 12 Aktivitäten  
  - Block G: 10 → 15 Städte, 4 Fahrzeugtypen
- ✅ Animationen/Sounds ausbauen:
  - 7 einzigartige Sound-Cues (correct, wrong, win, badge, star, perfect, streak, levelup)
  - 5 neue CSS-Animationen (spin-pop, star-pop, bounce-up, slide-in-down, pulse-glow)
  - Alle Animationen respektieren prefers-reduced-motion
- ✅ Weitere Abzeichen und Avatare:
  - Avatare: 6 → 10 (unlock points 0…1200)
  - Clock Faces: 4 → 7 (unlock points 0…900)
  - Badges: 7 → 15 (mehr Langzeitmotivation)
- ✅ Lighthouse/PWA-Audit (docs/PWA-AUDIT.md):
  - Service Worker mit autoUpdate
  - Vollständig offline-funktional
  - WCAG AA Accessibility
  - Deployment-ready auf GitHub Pages

## M5 – Optional Future Work
- E2E-Tests (Playwright end-to-end flow testing)
- Cloud saves / multi-device sync (requires backend)
- Multiplayer leaderboard (competitive mode)
- Voice-guided tutorial mode (prefers-reduced-motion friendly)
