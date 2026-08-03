# WOLF Heat Pump Flow Card

[English](README.md) | Deutsch

Eine moderne, responsive und ausschließlich lesende Custom Card für Home Assistant. Sie stellt den hydraulischen Aufbau einer WOLF-Wärmepumpenanlage als eigenständige SVG-Grafik dar.

Die Karte kann unter anderem folgende Informationen visualisieren:

- Heizen, Warmwasserbereitung, Kühlen, Abtauen, Störung und Stillstand
- aktive Vorlauf- und Rücklaufwege einschließlich Fließrichtung
- Wärmepumpe, Hydraulikmodul, Warmwasserspeicher, Sammler und Heizkreis
- Pumpen, Verdichter, Ventilator, Zusatzheizer und Umschaltventile
- Temperaturen, Volumenstrom, Anlagendruck, Leistung, COP, Modulation und Frequenz
- technische, verständliche oder kombinierte Beschriftungen
- Light- und Dark-Themes von Home Assistant

Alle Rollen sind optional und werden im grafischen Karteneditor den vorhandenen Home-Assistant-Entitäten zugeordnet. Die Karte sendet keine Daten an externe Dienste und ruft keine Home-Assistant-Dienste zum Schalten auf.

## Vorschau

### Heizbetrieb

![WOLF Heat Pump Flow Card im Heizbetrieb](docs/images/heating-mode.png)

### Warmwasserbereitung

![WOLF Heat Pump Flow Card während der Warmwasserbereitung](docs/images/hot-water-mode.png)

## Kompatibilität

Die Karte ist mit Home Assistant 2026.7 getestet, setzt diese Version aber nicht voraus. Sie verwendet die üblichen Schnittstellen für benutzerdefinierte Dashboard-Karten und sollte daher auch mit älteren Home-Assistant-Versionen funktionieren. Sollte es mit einer älteren Version Probleme geben, kann dies über die GitHub-Issues gemeldet werden.

Die Karte ist für WOLF-Anlagen ausgelegt. Die Namen der Entitäten sind frei wählbar und werden bei der Konfiguration zugeordnet.

## Installation mit HACS

Die Installation über HACS wird empfohlen:

1. **HACS** in Home Assistant öffnen.
2. Oben rechts das Drei-Punkte-Menü öffnen und **Benutzerdefinierte Repositories** auswählen.
3. `https://github.com/flrnx23/wolf-heat-pump-flow-card` als Repository eintragen.
4. Als Kategorie **Dashboard** auswählen und das Repository hinzufügen.
5. In HACS nach **WOLF Heat Pump Flow Card** suchen und die Karte herunterladen.
6. Home Assistant im Browser oder in der App vollständig neu laden.
7. Das gewünschte Dashboard bearbeiten, **Karte hinzufügen** auswählen und nach **WOLF Heat Pump Flow Card** suchen.

Falls die Karte nicht im Kartenwähler erscheint, zuerst den Browser-Cache leeren beziehungsweise die Home-Assistant-App neu starten.

## Manuelle Installation

1. `dist/wolf-heat-pump-flow-card.js` aus diesem Repository herunterladen.
2. Die Datei nach `<config>/www/wolf-heat-pump-flow-card.js` kopieren.
3. Unter **Einstellungen → Dashboards → Ressourcen** folgende Ressource vom Typ **JavaScript-Modul** hinzufügen:

   ```text
   /local/wolf-heat-pump-flow-card.js
   ```

4. Das Frontend neu laden.

## Konfiguration

Am einfachsten wird die Karte über den grafischen Kartenwähler hinzugefügt und anschließend im Editor konfiguriert. Dort kann jede Rolle direkt aus den vorhandenen Entitäten ausgewählt werden. Nicht vorhandene oder nicht benötigte Rollen bleiben leer.

Der minimale Kartentyp lautet:

```yaml
type: custom:wolf-heat-pump-flow-card
```

Ohne zugeordnete Entitäten zeigt die Karte nur ihre Grundgrafik. Ein allgemeines YAML-Beispiel mit bewusst generischen Platzhalter-IDs:

```yaml
type: custom:wolf-heat-pump-flow-card
title: Wärmepumpe
language: de

entities:
  outdoor_temperature: sensor.waermepumpe_aussentemperatur
  heat_pump_supply_temperature: sensor.waermepumpe_vorlauftemperatur
  heat_pump_return_temperature: sensor.waermepumpe_ruecklauftemperatur
  system_temperature: sensor.waermepumpe_systemtemperatur
  flow_rate: sensor.waermepumpe_volumenstrom
  system_pressure: sensor.waermepumpe_anlagendruck

  dhw_temperature: sensor.waermepumpe_warmwassertemperatur
  dhw_target_temperature: sensor.waermepumpe_warmwasser_solltemperatur

  heating_supply_temperature: sensor.heizkreis_vorlauftemperatur
  heating_return_temperature: sensor.heizkreis_ruecklauftemperatur
  heating_target_temperature: sensor.heizkreis_solltemperatur

  heating_circuit_pump: binary_sensor.heizkreispumpe
  primary_pump: binary_sensor.primaerpumpe
  compressor: binary_sensor.verdichter
  auxiliary_heater: binary_sensor.zusatzheizer

  fault: binary_sensor.waermepumpe_stoerung
  heating_active: binary_sensor.waermepumpe_heizbetrieb
  dhw_active: binary_sensor.waermepumpe_warmwasserbetrieb
  cooling_active: binary_sensor.waermepumpe_kuehlbetrieb
  operation_mode: sensor.waermepumpe_betriebsart
  three_way_valve: sensor.waermepumpe_umschaltventil
  heating_cooling_valve: sensor.waermepumpe_heizen_kuehlen_ventil

  electrical_power: sensor.waermepumpe_elektrische_leistung
  thermal_power: sensor.waermepumpe_thermische_leistung
  cop: sensor.waermepumpe_cop
  compressor_modulation: sensor.waermepumpe_verdichter_modulation
  compressor_frequency: sensor.waermepumpe_verdichter_frequenz

animations: true
temperature_coloring: false
show_legend: true
label_mode: friendly
layout: auto
flow_rate_threshold: 0.1

# Optionale, installationsabhängige Druckgrenzen in bar
system_pressure_critical_low: 1.0
system_pressure_warning_low: 1.5
system_pressure_warning_high: 2.2
system_pressure_critical_high: 2.5
```

Die gezeigten Entity-IDs sind Beispiele und müssen durch die IDs der eigenen Installation ersetzt werden. Es ist nicht nötig, alle Rollen zu konfigurieren.

Ist keine eigene `cop`-Entität vorhanden, kann die Karte einen mit `*` markierten momentanen COP aus thermischer und elektrischer Leistung ableiten, sofern beide Werte verfügbar und einheitenkompatibel sind.

## Grafischer Editor

Der Editor bietet Gruppen für:

- Temperaturen
- Hydraulik, Pumpen und Ventile
- Verdichter, Ventilator und Zusatzheizer
- Betriebszustände
- Leistungswerte
- Darstellung und Layout

Die Sprachauswahl im grafischen Editor bietet **Deutsch** und **Englisch** (`de` und `en`). Ist `language` nicht gesetzt, folgt die Karte für die Abwärtskompatibilität der Sprache von Home Assistant beziehungsweise des Browsers.

Statusrollen können aus `sensor`, `binary_sensor` oder `input_boolean` gewählt werden. Messwerte können unter anderem aus `sensor`, `number` oder `input_number` stammen. Erweiterte Zustandsmappings werden bei Bedarf in YAML konfiguriert.

## Konfigurationsoptionen

| Option                          | Typ     | Standard                        | Bedeutung                                                          |
| ------------------------------- | ------- | ------------------------------- | ------------------------------------------------------------------ |
| `type`                          | String  | erforderlich                    | Muss `custom:wolf-heat-pump-flow-card` sein.                       |
| `title`                         | String  | nicht gesetzt                   | Optionale Überschrift.                                             |
| `language`                      | String  | Home-Assistant-/Browser-Sprache | `de` oder `en`; überschreibt die Sprache der Kartenbeschriftungen. |
| `entities`                      | Objekt  | leer                            | Zuordnung der optionalen Entity-Rollen.                            |
| `animations`                    | Boolean | `true`                          | Animiert aktive Leitungen und Komponenten.                         |
| `temperature_coloring`          | Boolean | `false`                         | Aktiviert eine optionale temperaturabhängige Leitungsfärbung.      |
| `show_legend`                   | Boolean | `true`                          | Zeigt die Legende für Vorlauf und Rücklauf.                        |
| `label_mode`                    | String  | `friendly`                      | `technical`, `friendly`, `both` oder `hidden`.                     |
| `layout`                        | String  | `auto`                          | `auto` oder `wide`; beide verwenden das breite Hydraulikschema.    |
| `flow_rate_threshold`           | Zahl    | `0.1`                           | Mindestbetrag des Volumenstroms für eine gemessene Strömung.       |
| `system_pressure_critical_low`  | Zahl    | nicht gesetzt                   | Kritische Untergrenze des Anlagendrucks in bar.                    |
| `system_pressure_warning_low`   | Zahl    | nicht gesetzt                   | Untere Warnschwelle des Anlagendrucks in bar.                      |
| `system_pressure_warning_high`  | Zahl    | nicht gesetzt                   | Obere Warnschwelle des Anlagendrucks in bar.                       |
| `system_pressure_critical_high` | Zahl    | nicht gesetzt                   | Kritische Obergrenze des Anlagendrucks in bar.                     |
| `state_mapping`                 | Objekt  | eingebautes Mapping             | Rohwerte für aktive und inaktive Binärzustände.                    |
| `operation_mode_mapping`        | Objekt  | eingebautes Mapping             | Rohwerte für Betriebsarten.                                        |
| `three_way_valve_mapping`       | Objekt  | eingebautes Mapping             | Rohwerte des Ventils Heizung/Warmwasser.                           |
| `heating_cooling_valve_mapping` | Objekt  | eingebautes Mapping             | Rohwerte des Ventils Heizung/Kühlung.                              |

Die Option `language` beeinflusst ausschließlich die dargestellten Beschriftungen. Entity-IDs und Rohwerte der Integrationen bleiben davon unberührt.

`valve_mapping` bleibt als Kompatibilitätsalias für `three_way_valve_mapping` erhalten. Für neue Konfigurationen sollte `three_way_valve_mapping` verwendet werden.

Die Karte verwendet ausschließlich das breite Hydraulikschema. `layout: auto` skaliert es responsiv innerhalb der verfügbaren Kartenbreite; `layout: wide` wählt dieselbe Geometrie mit der großzügigeren Höhenbegrenzung für breite Dashboard-Ansichten. Ältere Konfigurationen mit `layout: compact` werden automatisch wie `auto` behandelt.

### Darstellung über die volle Dashboard-Breite

Die Breite der Karte wird vom Layout der Home-Assistant-Ansicht vorgegeben. Für eine eigene Ansicht mit nur dieser Karte kann der Ansichtstyp **Panel** gewählt werden; Home Assistant stellt die einzelne Karte dann über die gesamte verfügbare Breite dar. In einer **Abschnitte**-Ansicht lässt sich die Karte im Bearbeitungsmodus auf die volle Breite des Abschnitts ziehen. Eine Karte in einer schmalen **Masonry**-Spalte kann ihre Spaltengrenze dagegen nicht selbst überschreiten.

Die Druckgrenzen sind vollständig optional. Sobald `system_pressure` und passende Grenzen konfiguriert sind, kennzeichnet die Karte Warnbereiche gelb und kritische Bereiche rot – sowohl im Hydraulikschema als auch im Messwertfeld. Die Reihenfolge muss `kritisch unten ≤ Warnung unten ≤ Warnung oben ≤ kritisch oben` einhalten. Geeignete Werte hängen von der konkreten Hydraulik und den Vorgaben des Fachbetriebs ab; die Werte im Beispiel sind keine allgemeine Empfehlung.

## Unterstützte Entity-Rollen

Alle Rollen sind optional.

| Rolle                          | Zweck                                   |
| ------------------------------ | --------------------------------------- |
| `outdoor_temperature`          | Außentemperatur                         |
| `heat_pump_supply_temperature` | Kessel-/Vorlauftemperatur im Innenmodul |
| `heat_pump_return_temperature` | Rücklauftemperatur der Wärmepumpe       |
| `system_temperature`           | System- oder Sammlertemperatur          |
| `flow_rate`                    | aktueller Volumenstrom                  |
| `system_pressure`              | aktueller Anlagendruck                  |
| `dhw_temperature`              | Warmwasserspeichertemperatur            |
| `dhw_target_temperature`       | Warmwasser-Solltemperatur               |
| `heating_supply_temperature`   | Heizkreis-Vorlauftemperatur             |
| `heating_return_temperature`   | Heizkreis-Rücklauftemperatur            |
| `heating_target_temperature`   | Heizkreis-Solltemperatur                |
| `heating_circuit_pump`         | Heizkreispumpe                          |
| `primary_pump`                 | Primär- oder Zubringerpumpe             |
| `compressor`                   | Verdichterstatus                        |
| `fan`                          | Ventilatorstatus                        |
| `fan_speed`                    | Ventilatordrehzahl                      |
| `auxiliary_heater`             | elektrischer Zusatzheizer               |
| `defrost_active`               | expliziter Abtaustatus                  |
| `fault`                        | Störstatus oder numerischer Fehlercode  |
| `heating_active`               | Heizanforderung                         |
| `dhw_active`                   | Warmwasserstatus                        |
| `cooling_active`               | expliziter Kühlstatus                   |
| `operation_mode`               | übergeordnete Betriebsart               |
| `three_way_valve`              | Umschaltventil Heizung/Warmwasser       |
| `heating_cooling_valve`        | Umschaltventil Heizung/Kühlung          |
| `electrical_power`             | aktuelle elektrische Leistung           |
| `thermal_power`                | aktuelle thermische Leistung            |
| `cop`                          | aktueller COP                           |
| `compressor_modulation`        | aktuelle Verdichtermodulation           |
| `compressor_frequency`         | aktuelle Verdichterfrequenz             |

## Zustandsmappings

Integrationen liefern Statuswerte in unterschiedlichen Sprachen und Schreibweisen. Die Karte normalisiert Groß- und Kleinschreibung, Leerzeichen, Satzzeichen, Trennzeichen und deutsche Umlaute. Eigene Listen können in YAML hinterlegt werden, wenn eine Integration andere Rohwerte verwendet:

```yaml
type: custom:wolf-heat-pump-flow-card
entities:
  operation_mode: sensor.waermepumpe_betriebsart
  compressor: binary_sensor.waermepumpe_verdichter

state_mapping:
  active: ["on", "running"]
  inactive: ["off", "idle"]

operation_mode_mapping:
  heating: ["heating"]
  dhw: ["dhw"]
  cooling: ["cooling"]
  defrost: ["defrost"]
  fault: ["fault"]
  idle: ["idle"]
```

Eigene Listen ersetzen die jeweilige Standardliste. In einer überschriebenen Liste müssen daher alle weiterhin gewünschten Rohwerte enthalten sein.

## Modus-, Fluss- und Richtungslogik

Die Karte ermittelt den Modus aus den konfigurierten Stör-, Abtau-, Betriebsart-, Anforderungs- und Ventilentitäten. Störung und Abtauung besitzen dabei Vorrang vor normalen Betriebsarten.

Bei aktiver Hydraulik werden Wasserfluss und Richtung dargestellt. Jeder relevante Vorlauf- und Rücklaufabschnitt besitzt einen Richtungspfeil und eine CSS-basierte Partikelanimation.

- Ein Volumenstrom oberhalb von `flow_rate_threshold` oder eine aktive Primärpumpe aktiviert den Primärfluss.
- Sind weder Volumenstrom noch Pumpenzustände verfügbar, kann eine aktive Betriebsart als Rückfall dienen.
- Ein vorhandener Volumenstrom von `0` oder eine explizit ausgeschaltete Pumpe verhindert eine Animation allein aufgrund einer Betriebsart.
- Ein negativer, vorzeichenbehafteter Volumenstrom kehrt Pfeile und Partikelrichtung der aktiven Segmente um.
- Die Heizkreispumpe steuert den äußeren Heizkreis separat.
- `animations: false` stoppt die Bewegung, lässt Zustand, Richtungspfeile und Farben sichtbar.
- Die Systemeinstellung **Bewegung reduzieren** wird berücksichtigt.

Standardmäßig verwendet die Karte eindeutige semantische Farben: Vorlauf rot und Rücklauf blau. Damit bleibt die Flussrichtung auch auf kleinen Bildschirmen gut erkennbar. Mit `temperature_coloring: true` kann stattdessen eine temperaturabhängige Färbung der aktiven Leitungen eingeschaltet werden. Die Spirale im Warmwasserspeicher bleibt als Wärmetauscher bewusst ein Verlauf vom Vorlauf zum Rücklauf.

Mit `show_legend: false` lässt sich die Vorlauf-/Rücklauflegende unabhängig von den übrigen Beschriftungen vollständig ausblenden.

## Fehlende und ungültige Werte

Die Auswertung ist defensiv:

- Fehlende Entitäten beschädigen weder Karte noch Layout.
- `unknown`, `unavailable`, leere Zustände und ungültige Zahlen werden nicht als `0` interpretiert.
- Nicht zugeordnete oder aktuell nicht verfügbare Messwerte werden nicht eingeblendet.
- Einheiten werden aus `unit_of_measurement` übernommen.
- Zahlen mit deutschem Dezimalkomma werden akzeptiert.
- Fehlende optionale Statusentitäten erzeugen keine erfundenen Zustände.

Ein Klick oder Tastendruck auf einen zugeordneten Sensor beziehungsweise eine Komponente öffnet den Home-Assistant-Dialog **Mehr Informationen**. Ist keine Entität zugeordnet, bleibt die Grafik rein informativ.

## Lizenz

[MIT](LICENSE)
