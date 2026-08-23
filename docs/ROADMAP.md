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

## M4 – Feinschliff (in Arbeit)
- ✅ Screenshots im README (Levelkarte, Aufgabe).
- ✅ Render-/Interaktionstests für alle Screens (LevelMap, Results, Profile,
  Parent, AnswerInput-Widgets).
- ✅ Interaktive Uhr (Zeiger ziehen oder Pfeiltasten) als zusätzlicher
  Aufgabentyp in Block A: „Stelle die Uhr ein" (`SettableClock`).
- Mehr Aufgabenvarianten & Kontexte pro Block.
- Animationen/Sounds ausbauen, weitere Abzeichen und Avatare.
- E2E-Tests, Lighthouse/PWA-Audit.
