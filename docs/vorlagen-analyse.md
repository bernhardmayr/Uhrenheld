# Vorlagen-Analyse

Auswertung der drei Arbeitsheft-Fotos in `docs/vorlagen/` (S. 70–72). Diese
Analyse ist die Grundlage für Aufgabentypen, Sprache und Design. Die Vorlagen
selbst werden **nicht** in die App übernommen (Urheberrecht) – alle Inhalte sind
neu formuliert.

## Aufgabentypen (Fotos → App-Blöcke)

| Vorlage | Aufgabe | App-Block | Umsetzung |
| --- | --- | --- | --- |
| S. 70, Aufg. 1 | Analoguhr ablesen, minutengenau (z. B. 1:13), Vor-/Nachmittag (01:35 / 13:35) | **A** | SVG-Uhr, Doppelantwort, Fehlererkennung „Zeiger vertauscht" |
| S. 70, Aufg. 2 + 3 | Zeitspanne auf Pfeil (`16:15 ──?── 16:45`), teils als Bruch (30 min = ½ h), minutengenau über die Stunde (15:06 → 15:25) | **B** | Timeline-Komponente, Varianten Dauer/Ende/Start |
| S. 70, Aufg. 4 | Kursplan-Kette `14:45 ──15 min──> 15:00 ──30 min──> …`, Gesamtdauer, längster/kürzester Kurs | **C** | Tabellen-/Kettenanzeige, Gesamtdauer und fehlende Zwischenzeit |
| S. 71, Aufg. 1 + 2 | min → h + min (90, 100, 275, 300, 319, 683), Bruchteile (½, ¼, ¾, 2¾, 3½, 4½, 5¾, 6½ h), min + s → s (1 min 35 s = 95 s, 5½ min), s → min + s (87 s = 1 min 27 s) | **D** | Eingabefelder h/min bzw. min/s |
| S. 71, Aufg. 3 + 4 | Sekundenzeiger („seit der letzten vollen Minute"), Stoppuhr „eine Sekunde vorher", Übergang 01:00 → 00:59, 05:00 → 04:59 | **E** | SVG-Uhr mit Sekundenzeiger + gelbem Sektor, Stoppuhr-SVG |
| S. 71, Aufg. 5 | Passende Einheit s/min/h (Schulweg, Autofahrt, Handball, Gitarre) | **F** | Multiple-Choice mit drei Buttons |
| S. 72, Aufg. 1 + 2 | Fahrplan mit Haltestellen, Fahrzeit Teilstrecke + Gesamt (h min), Abfahrt + Fahrzeit = Ankunft (60/75/90 min) | **G** | Fahrplan-Tabelle, eigene Ortsnamen |
| S. 72, Aufg. 3 | Mehrtagestour: Gesamt- und Teildauern, „einen Tag eine Stunde weniger" | **H** | Kurze Sachaufgaben, 1–2 Rechenschritte |

## Beobachtete Kinderfehler (in den Fotos handschriftlich sichtbar)

- **Zeiger vertauscht:** „24:50" statt „12:50", „50:30" statt „10:30" → Block A
  erkennt und kommentiert diesen Fehler gezielt.
- **12/24-Stunden verwechselt:** Doppelantwort in Block A trainiert bewusst
  beide Lesarten.
- **Mit 100 statt 60 gerechnet:** relevant beim Umrechnen → Block D-Erklärungen
  betonen „1 h = 60 min, nicht 100".
- **Stundengrenze übersehen:** minutengenaue Spannen über die volle Stunde →
  Block B Stufe 2, Erklärungen mit Zwischenschritt an der vollen Stunde.

## Farbwerte (aus den Fotos abgeleitet, als Hex)

| Element | Farbe | Hex |
| --- | --- | --- |
| Kopfbalken / Akzent | Orange | `#f97316` (dunkler `#ea580c`) |
| Tabellen (warm) | Gelb | `#fde68a` |
| Tabellen (hell) | Beige | `#fef3c7` |
| Kurs-/Ergebnisfelder | Hellgrün | `#bbf7d0` / `#4ade80` |
| Stundenzeiger | Blau | `#1d4ed8` |
| Minutenzeiger | Rot | `#dc2626` |
| Sekundenzeiger / Sektor | Amber/Gelb | `#f59e0b` / `#fde68a` |

## Formensprache

- Abgerundete Ecken, orange Aufgabennummern als Quadrat mit weißer Ziffer.
- Analoguhr: weißes Zifferblatt, Ziffern 1–12, feine Minutenstriche, jede fünfte
  länger.
- Stoppuhr: graues Gehäuse, roter Druckknopf, digitales `mm:ss`-Display.
- Zeitstrahl: Startzeit — beschrifteter Pfeil — Zielzeit.

## Vokabular (verbindlich, Klasse 3)

- Einheiten: `s`, `min`, `h`; Uhrzeit immer mit nachgestelltem „Uhr".
- Keine Dezimalschreibweise: „2 h 30 min" oder „2½ h", nie „2,5 h".
- Wörter: Uhrzeit, Zeitpunkt, Zeitspanne, Dauer, Abfahrt, Ankunft, Fahrzeit,
  Vormittag, Nachmittag, volle Stunde, Stundenzeiger, Minutenzeiger,
  Sekundenzeiger.
