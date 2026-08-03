# WOLF Heat Pump Flow Card

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

## Voraussetzungen

- Home Assistant 2026.7.0 oder neuer
- Home-Assistant-Entitäten mit passenden Mess- und Statuswerten
- für die Entwicklung: Node.js 22.12.0 oder neuer und npm

Die Karte ist für WOLF-Anlagen ausgelegt. Abweichende Entity-Namen sind unproblematisch, da keine installationsspezifischen IDs fest vorgegeben werden müssen.

## Installation mit HACS

Solange das Projekt nicht im HACS-Standardkatalog enthalten ist, kann es als benutzerdefiniertes Repository installiert werden:

1. HACS öffnen und den Bereich **Frontend** beziehungsweise **Dashboards** auswählen.
2. Im Menü **Benutzerdefinierte Repositories** öffnen.
3. Die **URL dieses Repositorys** eintragen und **Dashboard** als Kategorie auswählen.
4. **WOLF Heat Pump Flow Card** installieren.
5. Home Assistant beziehungsweise das Browser-Frontend neu laden.

HACS registriert üblicherweise automatisch diese JavaScript-Modul-Ressource:

```text
/hacsfiles/wolf-heat-pump-flow-card/wolf-heat-pump-flow-card.js
```

Falls die Karte anschließend nicht im Kartenwähler erscheint, unter **Einstellungen → Dashboards → Ressourcen** prüfen, ob die Ressource als **JavaScript-Modul** eingetragen ist. Danach gegebenenfalls den Browser-Cache leeren oder die Home-Assistant-App vollständig neu laden.

## Manuelle Installation

1. `dist/wolf-heat-pump-flow-card.js` aus dem Repository oder `wolf-heat-pump-flow-card.js` aus einer Release-Version herunterladen.
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
label_mode: both
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

Statusrollen können aus `sensor`, `binary_sensor` oder `input_boolean` gewählt werden. Messwerte können unter anderem aus `sensor`, `number` oder `input_number` stammen. Erweiterte Zustandsmappings werden bei Bedarf in YAML konfiguriert.

## Konfigurationsoptionen

| Option                          | Typ     | Standard            | Bedeutung                                                     |
| ------------------------------- | ------- | ------------------- | ------------------------------------------------------------- |
| `type`                          | String  | erforderlich        | Muss `custom:wolf-heat-pump-flow-card` sein.                  |
| `title`                         | String  | nicht gesetzt       | Optionale Überschrift.                                        |
| `entities`                      | Objekt  | leer                | Zuordnung der optionalen Entity-Rollen.                       |
| `animations`                    | Boolean | `true`              | Animiert aktive Leitungen und Komponenten.                    |
| `temperature_coloring`          | Boolean | `false`             | Aktiviert eine optionale temperaturabhängige Leitungsfärbung. |
| `show_legend`                   | Boolean | `true`              | Zeigt die Legende für Vorlauf und Rücklauf.                   |
| `label_mode`                    | String  | `both`              | `technical`, `friendly`, `both` oder `hidden`.                |
| `layout`                        | String  | `auto`              | `auto`, `compact` oder `wide`.                                |
| `flow_rate_threshold`           | Zahl    | `0.1`               | Mindestbetrag des Volumenstroms für eine gemessene Strömung.  |
| `system_pressure_critical_low`  | Zahl    | nicht gesetzt       | Kritische Untergrenze des Anlagendrucks in bar.               |
| `system_pressure_warning_low`   | Zahl    | nicht gesetzt       | Untere Warnschwelle des Anlagendrucks in bar.                 |
| `system_pressure_warning_high`  | Zahl    | nicht gesetzt       | Obere Warnschwelle des Anlagendrucks in bar.                  |
| `system_pressure_critical_high` | Zahl    | nicht gesetzt       | Kritische Obergrenze des Anlagendrucks in bar.                |
| `state_mapping`                 | Objekt  | eingebautes Mapping | Rohwerte für aktive und inaktive Binärzustände.               |
| `operation_mode_mapping`        | Objekt  | eingebautes Mapping | Rohwerte für Betriebsarten.                                   |
| `three_way_valve_mapping`       | Objekt  | eingebautes Mapping | Rohwerte des Ventils Heizung/Warmwasser.                      |
| `heating_cooling_valve_mapping` | Objekt  | eingebautes Mapping | Rohwerte des Ventils Heizung/Kühlung.                         |

`valve_mapping` bleibt als Kompatibilitätsalias für `three_way_valve_mapping` erhalten. Für neue Konfigurationen sollte `three_way_valve_mapping` verwendet werden.

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

## Datenschutz und Sicherheit

Die WOLF Heat Pump Flow Card ist read-only:

- Sie ruft keine Home-Assistant-Dienste zum Schalten oder Ändern von Sollwerten auf.
- Sie sendet keine Daten an WOLF, Projektmitwirkende oder Drittanbieter.
- Sie enthält kein Tracking und keine Telemetrie.
- Sie liest ausschließlich die im Dashboard verfügbaren Zustände der konfigurierten Entitäten.
- SVG-Grafik und Animationen laufen lokal im Browser.

Die Darstellung ersetzt keine sicherheitsrelevante Anlagenüberwachung oder Fachdiagnose. Maßgeblich bleiben Home Assistant, die Anlagenregelung und die Dokumentation des Herstellers.

## Entwicklung

Repository klonen und Abhängigkeiten installieren:

```bash
git clone <URL dieses Repositorys>
cd wolf-heat-pump-flow-card
npm ci
```

Wichtige Befehle:

```bash
npm run typecheck
npm test
npm run lint
npm run format:check
npm run check
npm run build
npm run build:release
```

Der Build erzeugt das ES2022-Single-Bundle `dist/wolf-heat-pump-flow-card.js` einschließlich Source Map.

## Eigenständigkeit und Inspiration

Dieses Projekt ist eine eigenständige Implementierung mit eigener Zustands-, Hydraulik- und Flusslogik sowie neu erstellten SVG-Grafiken. Es ist kein Fork und übernimmt weder Grafik noch Quellcode der Referenzkarte.

Die Darstellung wurde konzeptionell durch [jasipsw/heat-pump-flow-card](https://github.com/jasipsw/heat-pump-flow-card) inspiriert.

WOLF ist eine Marke des jeweiligen Rechteinhabers. Dieses inoffizielle Community-Projekt steht in keiner Verbindung zu WOLF und wird nicht von WOLF unterstützt oder zertifiziert.

## Lizenz

[MIT](LICENSE)
