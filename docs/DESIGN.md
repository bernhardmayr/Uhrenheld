# DESIGN – Designsystem

Abgeleitet aus den Arbeitsheft-Fotos (`docs/vorlagen/`). Ziel: Das Kind erkennt
die App sofort wieder. Als App darf es bunter und animierter sein als Papier,
aber Farbwelt, Uhr-Darstellung und Wortwahl bleiben erkennbar.

## Farbpalette (Tailwind: `heft.*`)

| Token | Hex | Verwendung |
| --- | --- | --- |
| `heft.orange` | `#f97316` | Kopfbalken, Aufgabennummern, Primär-Buttons |
| `heft.orange-dark` | `#ea580c` | Hover, Uhr-Rahmen |
| `heft.yellow` | `#fde68a` | Tabellenkopf, Sektor-Markierung |
| `heft.beige` | `#fef3c7` | Tabellenzellen, Sekundär-Buttons |
| `heft.green` / `-dark` | `#bbf7d0` / `#4ade80` | Ergebnis-/Kursfelder, Erfolg |
| `heft.hand` | `#1d4ed8` | **Stundenzeiger (blau)** |
| `heft.minute` | `#dc2626` | **Minutenzeiger (rot)** |
| `heft.second` | `#f59e0b` | Sekundenzeiger |

## Typografie

- Nur System-Schriften (kein externer Font – Datenschutz & Offline).
- Basis-Schriftgröße 18px für junge Leserinnen und Leser, großzügige Zeilenhöhe.

## Komponenten

- **Analoguhr** (`AnalogClock.tsx`): weißes Zifferblatt, Ziffern 1–12, feine
  Minutenstriche (jede fünfte länger), blauer Stundenzeiger, roter
  Minutenzeiger, optionaler amberfarbener Sekundenzeiger + gelber Sektor.
  Zifferblatt, Striche und Ziffern sind als `ClockFace` ausgelagert, damit die
  interaktive Uhr exakt gleich aussieht.
- **Stellbare Uhr** (`SettableClock.tsx`): gleiches Zifferblatt, aber Stunden-
  und Minutenzeiger sind ziehbare `role="slider"`-Griffe (Maus/Touch/
  Pfeiltasten). Für die Zusatzaufgabe „Stelle die Uhr ein" in Block A.
- **Stoppuhr** (`Stopwatch.tsx`): graues Gehäuse, roter Druckknopf, `mm:ss`.
- **Timeline** (`Timeline.tsx`): Startzeit — beschrifteter Pfeil — Zielzeit.
- **Countdown** (`Countdown.tsx`): Balken, grün → gelb → rot.
- Karten (`.heft-card`), Buttons (`.btn-primary`, `.btn-secondary`),
  Aufgabennummer (`.badge-number`).

## Barrierefreiheit

- Touch-Ziele ≥ 48 px, sichtbarer Fokusring, hohe Kontraste.
- Uhr und Stoppuhr mit `role="img"` + Text-Label für Screenreader.
- `prefers-reduced-motion` schaltet Animationen ab.
