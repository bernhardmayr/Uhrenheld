# SPEC – Fachliche & didaktische Spezifikation

Diese Datei ist die **fachliche Quelle der Wahrheit** für Uhrenheld. Sie bleibt
auf Deutsch. Bei Konflikten zwischen Code und SPEC gilt die SPEC (oder sie wird
bewusst angepasst).

## Zielgruppe & Leitplanken

- 3. Klasse, 8–9 Jahre. Zahlenraum und Sprache strikt Klasse 3.
- **Keine Dezimalschreibweise für Zeit.** Immer „2 h 30 min" oder „2½ h".
- Einheiten wie im Heft: `s`, `min`, `h`; Uhrzeit mit nachgestelltem „Uhr".
- Jede Aufgabe hat nach der Lösung eine **Erklärung**, nicht nur richtig/falsch.
- Fehlertypen werden erkannt und gezielt kommentiert (siehe `src/lib/errors.ts`).

## Zeitmodell (`src/lib/time.ts`)

- **Zeitpunkt:** `DayMinutes` = Minuten seit Mitternacht, 0…1439.
- **Dauer:** einfache Minuten- bzw. Sekundenzahl.
- Rechnen wickelt über Mitternacht (`addMinutes`, `spanForward`).
- Analoguhr ↔ 24-Stunden über `twelveHourToDayMinutes` (12-Position → 00:mm/12:mm).

## Aufgabenblöcke

Jeder Block ist ein parametrisierter Generator in `src/lib/generators/` mit
Schwierigkeitsstufen (1 = leicht … 3 = schwer).

### Block A — Uhr ablesen
- Analoguhr, **minutengenau**. Stufe 1: 5-Minuten-Schritte, Stufe 2: genau,
  Stufe 3: **Doppelantwort** (Vor- und Nachmittag).
- Erkennt „Zeiger vertauscht" und erklärt Stunden-/Minutenzeiger.
- **Zusätzlicher Aufgabentyp** (nicht aus dem Arbeitsheft, nur Stufe 1/2):
  „Stelle die Uhr ein" – zu einer vorgegebenen digitalen Uhrzeit zieht das Kind
  die Zeiger der interaktiven `SettableClock` an die richtige Stelle (per Maus/
  Touch oder Pfeiltasten). Trainiert die Rückrichtung (digital → Zifferblatt)
  und die Zuordnung 24-h-Zeit → 12-h-Ziffernblatt.

### Block B — Zeitspannen
- Pfeil `Start ──?── Ziel`. Varianten: Dauer / Endzeit / Startzeit gesucht.
- Stufe 1: 5/15/30-Schritte, teils als Bruch. Stufe 2/3: minutengenau, **über
  die volle Stunde**.

### Block C — Zeitketten
- Mehrschrittige Kette (Kursplan). Stufe 1: Gesamtdauer. Stufe 2: fehlende
  Zwischenzeit.

### Block D — Umrechnen
- `min → h + min`, Bruchteile `h → min`, `min + s → s`, `s → min + s`.
- Erklärungen betonen 60 statt 100.

### Block E — Sekunden & Stoppuhr
- Sekundenzeiger: „Sekunden seit der letzten vollen Minute?".
- Stoppuhr: „eine Sekunde vorher?" inkl. Übergänge 01:00 → 00:59, 05:00 → 04:59.

### Block F — Passende Einheit
- Multiple-Choice s / min / h für Alltagssituationen. Ideal für Zeitdruck.

### Block G — Fahrplan
- Fahrplan-Tabelle (eigene Ortsnamen), Fahrzeit Teilstrecke + Gesamt (h min),
  `Abfahrt + Fahrzeit = Ankunft` mit Fahrzeiten > 60 min.

### Block H — Sachaufgaben
- Kurze Alltagsgeschichten, 1–2 Rechenschritte (u. a. Mehrtagestour-Logik).

## Antwort- & Prüf-Logik (`src/lib/tasks.ts`)

- Eingabe-Widgets: `time`, `timeDouble`, `hm`, `minsec`, `number`, `choice`.
- `checkAnswer(task, answer)` ist rein und deterministisch; alle Generatoren sind
  selbstkonsistent (Test: eigene Lösung ist korrekt, Nachbarwert ist falsch).

## Testabdeckung

Zeitlogik, alle Generatoren, Punkte-, Fortschritts- und Freischalt-Logik sind zu
100 % getestet – inklusive Grenzfälle (Stundenübergang, Mitternacht,
01:00 → 00:59, Bruchteile von Stunden). Siehe `src/lib/**/*.test.ts`.
