# GAMEPLAY – Punkte, Level & Belohnungen

Grundsatz: motivieren, nie bestrafen. Kein Punkteverlust, keine Bestenliste,
kein Vergleich mit anderen Kindern. Eine Runde endet immer freundlich.

## Punkte (`src/lib/scoring.ts`)

`Punkte = Basispunkte (10) × Schwierigkeit (1–3) × Serien-Faktor × Zeitbonus`

- **Serie:** ab 3 richtigen in Folge ×1,5, ab 5 ×2, ab 7 ×3.
- **Zeitbonus:** 1,0–1,5 je nach Restzeit. Im Übungsmodus (ohne Zeit) immer 1,0.
- Punkte sind immer positiv und ganzzahlig.

## Runde (`src/hooks/useRound.ts`)

- 6 Aufgaben pro Runde, Start mit 3 **Herzen**.
- Falsche Antwort kostet ein Herz (kein hartes Game-Over) – die Runde läuft
  freundlich zu Ende.
- Nach jeder Antwort: Erklärung statt nur richtig/falsch.

## Sterne & Abzeichen (`src/lib/progress.ts`)

- 1–3 **Sterne** pro Level je nach Trefferquote (≥50/70/90 %).
- **Abzeichen-Album** (`BADGES`): erste Runde, Volltreffer, Punkte-Meilensteine,
  3-Tage-Serie, Uhren-Profi, Alleskönner. Abzeichen gehen nie verloren.

## Levelkarte (`src/features/levelmap`)

- Stationen A–H werden nacheinander freigeschaltet; höhere Stufen öffnen sich mit
  dem ersten Stern der Vorstufe (`src/lib/unlock.ts`).

## Freischaltbares & Tagesziel

- Avatare und Zifferblätter werden über Gesamtpunkte freigeschaltet
  (`src/data/cosmetics.ts`).
- **Tagesziel/Streak:** heute geübt? Übungs-Streak über mehrere Tage.

## Eltern-/Lehreransicht (`src/features/parent`)

- Lokale Statistik nach Aufgabentyp und häufige Fehlertypen. Keine Daten
  verlassen das Gerät.
