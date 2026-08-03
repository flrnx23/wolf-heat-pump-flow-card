import { css } from "lit";

/**
 * Shared card and diagram styles.
 *
 * The hydraulic drawing intentionally uses Home Assistant theme variables with
 * conservative fallbacks.  All motion is expressed in CSS, which means Home
 * Assistant can pause the diagram cheaply when the card is not visible and the
 * user's reduced-motion preference is respected without JavaScript.
 */
export const cardStyles = css`
  :host {
    --wolf-supply-color: var(--error-color, #ef4050);
    --wolf-supply-highlight: #ff8a94;
    --wolf-return-color: var(--info-color, #478ee8);
    --wolf-return-highlight: #9ac7ff;
    --wolf-cooling-supply-color: #24a8d8;
    --wolf-cooling-return-color: #7f6ce0;
    --wolf-defrost-color: #9d72e6;
    --wolf-idle-pipe-color: var(--disabled-text-color, #9aa3af);
    --wolf-panel-color: color-mix(
      in srgb,
      var(--card-background-color, #fff) 91%,
      var(--primary-text-color, #20242b)
    );
    --wolf-panel-strong: color-mix(
      in srgb,
      var(--card-background-color, #fff) 82%,
      var(--primary-text-color, #20242b)
    );
    --wolf-panel-stroke: color-mix(in srgb, var(--primary-text-color, #20242b) 24%, transparent);
    --wolf-soft-stroke: color-mix(in srgb, var(--primary-text-color, #20242b) 13%, transparent);
    --wolf-surface-shadow: color-mix(in srgb, #000 17%, transparent);
    --wolf-text-color: var(--primary-text-color, #20242b);
    --wolf-secondary-text-color: var(--secondary-text-color, #6b7280);
    --wolf-focus-color: var(--primary-color, #03a9f4);
    display: block;
    min-width: 0;
  }

  ha-card {
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
    color: var(--wolf-text-color);
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }

  .card-shell {
    position: relative;
    min-width: 0;
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px 0;
  }

  .card-title {
    min-width: 0;
    overflow: hidden;
    color: var(--wolf-text-color);
    font-size: var(--ha-card-header-font-size, 20px);
    font-weight: 500;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .flow-card-content {
    padding: 8px 12px 14px;
  }

  .flow-diagram-frame {
    position: relative;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    border-radius: calc(var(--ha-card-border-radius, 12px) * 0.72);
    background:
      radial-gradient(
        circle at 50% 21%,
        color-mix(in srgb, var(--primary-color, #03a9f4) 6%, transparent),
        transparent 34%
      ),
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--primary-text-color, #20242b) 2.5%, transparent),
        transparent 42%
      );
  }

  .flow-diagram {
    display: block;
    width: 100%;
    height: auto;
    min-height: 300px;
    max-height: min(76vh, 760px);
    overflow: visible;
    color: var(--wolf-text-color);
    font-family: var(--ha-card-font-family, var(--paper-font-body1_-_font-family, sans-serif));
    shape-rendering: geometricPrecision;
    text-rendering: geometricPrecision;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
    gap: 8px;
    padding: 4px 4px 0;
  }

  .metric {
    min-width: 0;
    padding: 10px 12px;
    border: 1px solid var(--wolf-soft-stroke);
    border-radius: 12px;
    background: color-mix(in srgb, var(--wolf-panel-color) 72%, transparent);
  }

  button.metric {
    width: 100%;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  button.metric:hover {
    border-color: color-mix(in srgb, var(--wolf-focus-color) 42%, transparent);
    background: color-mix(in srgb, var(--wolf-panel-strong) 84%, transparent);
  }

  button.metric:focus-visible {
    outline: 2px solid var(--wolf-focus-color);
    outline-offset: 2px;
  }

  .metric-label {
    display: -webkit-box;
    min-height: 2.5em;
    overflow: hidden;
    color: var(--wolf-secondary-text-color);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35px;
    line-height: 1.25;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .metric-value {
    margin-top: 3px;
    overflow: hidden;
    color: var(--wolf-text-color);
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metric--warning {
    border-color: color-mix(in srgb, #f59e0b 72%, var(--wolf-soft-stroke));
    background: color-mix(in srgb, #f59e0b 12%, var(--wolf-panel-color));
  }

  .metric--critical {
    border-color: color-mix(in srgb, var(--error-color, #db4437) 76%, var(--wolf-soft-stroke));
    background: color-mix(in srgb, var(--error-color, #db4437) 14%, var(--wolf-panel-color));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--error-color, #db4437) 16%, transparent);
  }

  .metric--warning .metric-value {
    color: #c77800;
  }

  .metric--critical .metric-value {
    color: var(--error-color, #db4437);
  }

  .configuration-hint {
    padding: 20px;
    color: var(--wolf-secondary-text-color);
  }

  .flow-diagram--compact {
    min-height: 0;
    max-height: none;
  }

  .layout--wide .flow-diagram {
    min-height: 360px;
    max-height: min(82vh, 820px);
  }

  .flow-diagram--compact .component-title {
    font-size: 23px;
  }

  .flow-diagram--compact .component-subtitle,
  .flow-diagram--compact .sensor-code {
    font-size: 18px;
    letter-spacing: 0;
  }

  .flow-diagram--compact .micro-label {
    font-size: 17px;
    letter-spacing: 0;
  }

  .flow-diagram--compact .sensor-value {
    font-size: 24px;
  }

  .flow-diagram--compact .sensor-value--small {
    font-size: 21px;
  }

  .flow-diagram--compact .sensor-target {
    font-size: 18px;
  }

  .flow-diagram--compact .valve-port-label {
    font-size: 14px;
  }

  .flow-diagram--compact .status-pill__text {
    font-size: 19px;
  }

  .flow-diagram--compact .pipe-hit {
    stroke-width: 42px;
  }

  .flow-diagram--compact .diagram-component.is-clickable:focus-visible .focus-ring {
    stroke-width: 3px;
  }

  .diagram-bg {
    fill: transparent;
  }

  .component-panel {
    fill: var(--wolf-panel-color);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
    filter: drop-shadow(0 8px 12px var(--wolf-surface-shadow));
  }

  .component-panel--inner {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 72%, transparent);
    stroke: var(--wolf-soft-stroke);
    stroke-width: 1.25;
  }

  .component-title {
    fill: var(--wolf-text-color);
    font-size: 18px;
    font-weight: 650;
    letter-spacing: 0.1px;
  }

  .component-subtitle,
  .sensor-code,
  .micro-label {
    fill: var(--wolf-secondary-text-color);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.15px;
  }

  .micro-label {
    font-size: 11.5px;
    letter-spacing: 0.2px;
  }

  .label-friendly {
    text-transform: none;
  }

  .label-code {
    fill: var(--wolf-secondary-text-color);
    font-size: 0.72em;
    font-weight: 650;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .label-code--only {
    fill: var(--wolf-text-color);
    font-size: 1em;
  }

  .sensor-value {
    fill: var(--wolf-text-color);
    font-size: 19px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    paint-order: stroke;
    stroke: var(--ha-card-background, var(--card-background-color, #fff));
    stroke-linejoin: round;
    stroke-width: 3px;
  }

  .sensor-value--small {
    font-size: 17px;
  }

  .sensor-target {
    fill: var(--wolf-secondary-text-color);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .sensor-target__label {
    font-weight: 500;
  }

  .sensor-target__value {
    fill: var(--wolf-text-color);
    font-weight: 700;
  }

  .status-pill {
    --status-accent: var(--wolf-idle-pipe-color);
    color: var(--status-accent);
  }

  .status-pill__surface {
    fill: color-mix(in srgb, var(--status-accent) 9%, var(--wolf-panel-color));
    stroke: color-mix(in srgb, var(--status-accent) 38%, var(--wolf-panel-stroke));
    stroke-width: 1.25;
  }

  .status-pill__text {
    fill: var(--wolf-text-color);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.1px;
  }

  .status-pill__icon {
    fill: none;
    color: var(--status-accent);
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .status-pill__icon-fill {
    fill: currentColor;
    fill-rule: evenodd;
    stroke: none;
  }

  .mode--heating .status-pill {
    --status-accent: var(--wolf-supply-color);
  }

  .mode--dhw .status-pill {
    --status-accent: var(--info-color, #168bd2);
  }

  .mode--cooling .status-pill {
    --status-accent: var(--wolf-cooling-supply-color);
  }

  .mode--defrost .status-pill {
    --status-accent: var(--wolf-defrost-color);
  }

  .mode--fault .status-pill {
    --status-accent: var(--error-color, #db4437);
  }

  .mode--fault .status-pill__surface {
    fill: color-mix(in srgb, var(--status-accent) 16%, var(--wolf-panel-color));
    stroke: color-mix(in srgb, var(--status-accent) 65%, transparent);
  }

  .mode--fault .status-pill__icon {
    animation: wolf-alert-pulse 1.4s ease-in-out infinite;
  }

  .pipe-base,
  .pipe-energy,
  .pipe-flow,
  .pipe-hit {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .pipe-direction-arrow {
    fill: var(--pipe-highlight, var(--pipe-color));
    opacity: 0;
    pointer-events: none;
    stroke: var(--pipe-color);
    stroke-linejoin: round;
    stroke-width: 1.5px;
    transition: opacity 220ms ease;
    vector-effect: non-scaling-stroke;
  }

  .pipe-base {
    stroke: var(--pipe-color, var(--wolf-idle-pipe-color));
    stroke-width: 9px;
    opacity: 0.25;
  }

  .pipe-energy {
    stroke: var(--pipe-color, var(--wolf-idle-pipe-color));
    stroke-width: 7px;
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .pipe-flow {
    stroke: var(--pipe-highlight, #fff);
    stroke-width: 4px;
    stroke-dasharray: 1 17;
    stroke-dashoffset: 0;
    opacity: 0;
    filter: drop-shadow(0 0 3px var(--pipe-color, transparent));
    transition: opacity 220ms ease;
  }

  .pipe-hit {
    pointer-events: none;
    stroke: transparent;
    stroke-width: 26px;
  }

  .pipe-segment.is-clickable .pipe-hit {
    cursor: pointer;
    pointer-events: stroke;
  }

  .pipe-segment {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
    outline: none;
  }

  .pipe-segment.pipe--supply {
    --pipe-color: var(--wolf-supply-color);
    --pipe-highlight: var(--wolf-supply-highlight);
  }

  .pipe-segment.pipe--return {
    --pipe-color: var(--wolf-return-color);
    --pipe-highlight: var(--wolf-return-highlight);
  }

  .mode--cooling .pipe-segment.pipe--supply {
    --pipe-color: var(--wolf-cooling-supply-color);
    --pipe-highlight: #a7efff;
  }

  .mode--cooling .pipe-segment.pipe--return {
    --pipe-color: var(--wolf-cooling-return-color);
    --pipe-highlight: #c9c1ff;
  }

  .mode--defrost .pipe-segment.is-active {
    --pipe-color: var(--wolf-defrost-color);
    --pipe-highlight: #e3d2ff;
  }

  .pipe-segment.is-active .pipe-base {
    opacity: 0.58;
  }

  .pipe-segment.is-active .pipe-energy {
    opacity: 0.46;
  }

  .pipe-segment.is-active .pipe-flow {
    opacity: 1;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .pipe-segment.is-active .pipe-direction-arrow {
    opacity: 0.95;
  }

  .pipe-segment.is-active.direction--reverse .pipe-flow {
    animation-name: wolf-flow-reverse;
  }

  .pipe-segment.is-muted .pipe-base {
    opacity: 0.13;
    filter: saturate(0.4);
  }

  .pipe-segment.is-muted {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
  }

  .pipe-segment.is-clickable:focus-visible .pipe-hit {
    stroke: var(--wolf-focus-color);
    stroke-width: 18px;
    opacity: 0.28;
  }

  .junction {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .diagram-component {
    outline: none;
  }

  .diagram-component.is-clickable {
    cursor: pointer;
    pointer-events: bounding-box;
  }

  .diagram-component .focus-ring {
    fill: none;
    pointer-events: none;
    stroke: transparent;
    stroke-width: 4px;
    transition: stroke 140ms ease;
    vector-effect: non-scaling-stroke;
  }

  .diagram-component.is-clickable .focus-ring {
    pointer-events: all;
  }

  .diagram-component.is-clickable:focus-visible .focus-ring {
    stroke: var(--wolf-focus-color);
  }

  @media (hover: hover) and (pointer: fine) {
    .diagram-component.is-clickable:hover .focus-ring {
      stroke: color-mix(in srgb, var(--wolf-focus-color) 46%, transparent);
      stroke-width: 2px;
    }

    .pipe-segment.is-clickable:hover .pipe-hit {
      stroke: color-mix(in srgb, var(--wolf-focus-color) 22%, transparent);
      opacity: 0.55;
    }
  }

  .interactive-surface {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }

  .is-on .interactive-surface,
  .is-on.interactive-surface {
    stroke: color-mix(in srgb, var(--primary-color, #03a9f4) 65%, transparent);
    filter: drop-shadow(0 0 5px color-mix(in srgb, var(--primary-color, #03a9f4) 34%, transparent));
  }

  .diagram-component.is-unknown .interactive-surface,
  .compressor.is-unknown .compressor-body,
  .heater.is-unknown .heater-body {
    opacity: 0.64;
    stroke-dasharray: 4 3;
  }

  .diagram-component.is-unknown .fan-blades,
  .diagram-component.is-unknown .pump-impeller,
  .diagram-component.is-unknown .heater-bolt {
    opacity: 0.48;
  }

  .fan-hub,
  .pump-hub {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 55%, var(--wolf-secondary-text-color));
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .fan-blades {
    color: var(--wolf-secondary-text-color);
    transform-box: fill-box;
    transform-origin: center;
    will-change: transform;
  }

  .pump-impeller {
    color: var(--wolf-secondary-text-color);
    transform-box: fill-box;
    transform-origin: center;
  }

  .is-on .fan-blades {
    color: var(--primary-color, #03a9f4);
    animation: wolf-spin var(--fan-duration, 1.45s) linear infinite;
  }

  .is-on .pump-impeller {
    color: var(--wolf-supply-color);
    animation: wolf-spin 1.25s linear infinite;
  }

  .mode--cooling .is-on .pump-impeller {
    color: var(--wolf-cooling-supply-color);
  }

  .fan-blade,
  .pump-blade {
    fill: currentColor;
  }

  .compressor-body {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .compressor-wave {
    fill: none;
    stroke: var(--wolf-secondary-text-color);
    stroke-linecap: round;
    stroke-width: 2;
  }

  .compressor.is-on .compressor-body {
    stroke: var(--wolf-supply-color);
    filter: drop-shadow(0 0 5px color-mix(in srgb, var(--wolf-supply-color) 36%, transparent));
  }

  .compressor.is-on .compressor-wave {
    stroke: var(--wolf-supply-color);
    stroke-dasharray: 5 4;
    animation: wolf-compressor 1s linear infinite;
  }

  .heater-body {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 82%, transparent);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .heater-bolt {
    fill: var(--wolf-secondary-text-color);
  }

  .heater.is-on .heater-body {
    fill: color-mix(in srgb, #f59e0b 18%, var(--wolf-panel-strong));
    stroke: #f59e0b;
  }

  .heater.is-on .heater-bolt {
    fill: #f59e0b;
    animation: wolf-heater-pulse 1.2s ease-in-out infinite;
  }

  .valve-body {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .valve-route-base,
  .valve-route-selected {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 6px;
  }

  .valve-route-base {
    stroke: var(--wolf-secondary-text-color);
    opacity: 0.24;
  }

  .valve-route-selected {
    stroke: var(--wolf-secondary-text-color);
    opacity: 0.68;
  }

  .valve-route-selected.is-flowing {
    stroke: var(--wolf-supply-color);
    opacity: 1;
    filter: drop-shadow(0 0 3px color-mix(in srgb, var(--wolf-supply-color) 38%, transparent));
  }

  .valve-route-arrow {
    fill: var(--wolf-secondary-text-color);
    opacity: 0.68;
  }

  .valve-route-arrow.is-flowing {
    fill: var(--wolf-supply-color);
    opacity: 1;
  }

  .mode--cooling .valve-route-selected.is-flowing {
    stroke: var(--wolf-cooling-supply-color);
  }

  .mode--cooling .valve-route-arrow.is-flowing {
    fill: var(--wolf-cooling-supply-color);
  }

  .mode--defrost .valve-route-selected.is-flowing {
    stroke: var(--wolf-defrost-color);
  }

  .mode--defrost .valve-route-arrow.is-flowing {
    fill: var(--wolf-defrost-color);
  }

  .valve-port-label {
    fill: var(--wolf-secondary-text-color);
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.3px;
  }

  .flow-meter__bars {
    fill: none;
    stroke: var(--wolf-secondary-text-color);
    stroke-linecap: round;
    stroke-width: 2;
  }

  .heat-exchanger-fin {
    fill: none;
    stroke-linecap: round;
    stroke-width: 5px;
  }

  .heat-exchanger-fin--hot {
    stroke: var(--wolf-supply-color);
  }

  .heat-exchanger-fin--cold {
    stroke: var(--wolf-return-color);
  }

  .mode--cooling .heat-exchanger-fin--hot {
    stroke: var(--wolf-cooling-return-color);
  }

  .mode--cooling .heat-exchanger-fin--cold {
    stroke: var(--wolf-cooling-supply-color);
  }

  .outdoor-water {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
    pointer-events: none;
  }

  .outdoor-water.pipe--supply {
    --pipe-color: var(--wolf-supply-color);
    --pipe-highlight: var(--wolf-supply-highlight);
  }

  .outdoor-water.pipe--return {
    --pipe-color: var(--wolf-return-color);
    --pipe-highlight: var(--wolf-return-highlight);
  }

  .mode--cooling .outdoor-water.pipe--supply {
    --pipe-color: var(--wolf-cooling-supply-color);
    --pipe-highlight: #a7efff;
  }

  .mode--cooling .outdoor-water.pipe--return {
    --pipe-color: var(--wolf-cooling-return-color);
    --pipe-highlight: #c9c1ff;
  }

  .outdoor-water__base,
  .outdoor-water__flow {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .outdoor-water__base {
    stroke: var(--pipe-color);
    stroke-width: 7px;
    opacity: 0.42;
  }

  .outdoor-water__flow {
    stroke: var(--pipe-highlight);
    stroke-width: 3px;
    stroke-dasharray: 1 14;
    opacity: 0;
  }

  .outdoor-water.is-active .outdoor-water__flow {
    opacity: 0.95;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .outdoor-water.is-active.direction--reverse .outdoor-water__flow {
    animation-name: wolf-flow-reverse;
  }

  .outdoor-water:not(.is-active) {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
  }

  .outdoor-water:not(.is-active) .outdoor-water__base {
    opacity: 0.18;
  }

  .tank-shell {
    fill: url(#wolf-tank-fill);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .tank-water-line {
    fill: none;
    stroke: color-mix(in srgb, var(--wolf-return-color) 55%, transparent);
    stroke-width: 1;
  }

  .tank-coil-base {
    fill: none;
    stroke: url(#wolf-coil-gradient);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 8px;
    opacity: 0.66;
  }

  .tank-coil-flow {
    fill: none;
    stroke: #fff;
    stroke-dasharray: 1 15;
    stroke-linecap: round;
    stroke-width: 3.5px;
    opacity: 0;
  }

  .tank-coil.is-active .tank-coil-flow {
    opacity: 0.9;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .tank-coil.is-active.direction--reverse .tank-coil-flow {
    animation-name: wolf-flow-reverse;
  }

  .tank-coil:not(.is-active) .tank-coil-base {
    stroke: var(--wolf-idle-pipe-color);
    opacity: 0.18;
  }

  .internal-flow {
    --pipe-color: var(--wolf-supply-color);
    --pipe-highlight: var(--wolf-supply-highlight);
    pointer-events: none;
  }

  .mode--cooling .internal-flow {
    --pipe-color: var(--wolf-cooling-supply-color);
    --pipe-highlight: #a7efff;
  }

  .internal-flow__base,
  .internal-flow__particles {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .internal-flow__base {
    stroke: var(--pipe-color);
    stroke-width: 7px;
    opacity: 0.42;
  }

  .internal-flow__particles {
    stroke: var(--pipe-highlight);
    stroke-width: 3px;
    stroke-dasharray: 1 14;
    opacity: 0;
  }

  .internal-flow.is-active .internal-flow__particles {
    opacity: 0.95;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .internal-flow.is-active.direction--reverse .internal-flow__particles {
    animation-name: wolf-flow-reverse;
  }

  .internal-flow:not(.is-active) {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
  }

  .internal-flow:not(.is-active) .internal-flow__base {
    opacity: 0.18;
  }

  .emitter-fin {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 82%, transparent);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1;
  }

  .emitter {
    --emitter-active-color: var(--wolf-supply-color);
  }

  .mode--cooling .emitter {
    --emitter-active-color: var(--wolf-cooling-supply-color);
  }

  .emitter.is-active .emitter-fin {
    fill: color-mix(in srgb, var(--emitter-active-color) 18%, var(--wolf-panel-strong));
    stroke: color-mix(in srgb, var(--emitter-active-color) 52%, var(--wolf-panel-stroke));
    animation: wolf-emitter-pulse 2.2s ease-in-out infinite;
    animation-delay: var(--fin-delay, 0s);
  }

  .collector-body {
    fill: url(#wolf-collector-fill);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .collector:not(.is-active) .collector-body {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 72%, var(--wolf-idle-pipe-color));
    opacity: 0.62;
  }

  .pressure-gauge-arc,
  .pressure-gauge-needle {
    fill: none;
    stroke: var(--wolf-secondary-text-color);
    stroke-linecap: round;
    stroke-width: 2.5px;
  }

  .pressure-gauge-hub {
    fill: var(--wolf-secondary-text-color);
  }

  .pressure-reading-surface {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 86%, transparent);
    stroke: var(--wolf-soft-stroke);
    stroke-width: 1.25px;
  }

  .pressure-alert-badge {
    fill: currentColor;
  }

  .pressure-alert-mark {
    fill: #fff;
    font-size: 12px;
    font-weight: 900;
  }

  .pressure-reading--warning {
    color: #c77800;
  }

  .pressure-reading--warning .pressure-gauge-arc,
  .pressure-reading--warning .pressure-gauge-needle {
    stroke: #f59e0b;
    filter: drop-shadow(0 0 3px color-mix(in srgb, #f59e0b 38%, transparent));
  }

  .pressure-reading--warning .pressure-gauge-hub,
  .pressure-reading--warning .sensor-value {
    fill: #c77800;
  }

  .pressure-reading--warning .pressure-reading-surface {
    fill: color-mix(in srgb, #f59e0b 10%, var(--wolf-panel-strong));
    stroke: color-mix(in srgb, #f59e0b 68%, var(--wolf-soft-stroke));
  }

  .pressure-reading--critical {
    color: var(--error-color, #db4437);
  }

  .pressure-reading--critical .pressure-gauge-arc,
  .pressure-reading--critical .pressure-gauge-needle {
    stroke: var(--error-color, #db4437);
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--error-color, #db4437) 48%, transparent));
    animation: wolf-alert-pulse 1.4s ease-in-out infinite;
  }

  .pressure-reading--critical .pressure-gauge-hub,
  .pressure-reading--critical .sensor-value {
    fill: var(--error-color, #db4437);
  }

  .pressure-reading--critical .pressure-reading-surface {
    fill: color-mix(in srgb, var(--error-color, #db4437) 12%, var(--wolf-panel-strong));
    stroke: color-mix(in srgb, var(--error-color, #db4437) 76%, var(--wolf-soft-stroke));
  }

  .pressure-reading--critical .pressure-alert-badge {
    animation: wolf-alert-pulse 1.4s ease-in-out infinite;
  }

  .sensor-dot {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .sensor-mercury {
    fill: var(--wolf-secondary-text-color);
  }

  .is-unavailable .sensor-value,
  .is-unavailable.sensor-value {
    fill: var(--wolf-secondary-text-color);
    font-weight: 500;
  }

  .fault-overlay {
    fill: color-mix(in srgb, var(--error-color, #db4437) 8%, transparent);
    pointer-events: none;
  }

  .mode--fault .component-panel {
    stroke: color-mix(in srgb, var(--error-color, #db4437) 52%, var(--wolf-panel-stroke));
  }

  .mode--fault .pipe-flow,
  .mode--idle .pipe-flow {
    filter: none;
  }

  .animations-paused *,
  .animations-paused *::before,
  .animations-paused *::after {
    animation-play-state: paused !important;
  }

  @keyframes wolf-flow-forward {
    to {
      stroke-dashoffset: -36;
    }
  }

  @keyframes wolf-flow-reverse {
    to {
      stroke-dashoffset: 36;
    }
  }

  @keyframes wolf-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes wolf-compressor {
    to {
      stroke-dashoffset: -18;
    }
  }

  @keyframes wolf-heater-pulse {
    50% {
      opacity: 0.52;
      transform: translateY(-1px);
    }
  }

  @keyframes wolf-alert-pulse {
    50% {
      opacity: 0.35;
    }
  }

  @keyframes wolf-emitter-pulse {
    50% {
      opacity: 0.62;
      filter: drop-shadow(0 0 3px color-mix(in srgb, var(--emitter-active-color) 34%, transparent));
    }
  }

  @media (max-width: 520px) {
    .card-header-row {
      padding: 14px 14px 0;
    }

    .flow-card-content {
      padding: 6px 4px 10px;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .flow-diagram {
      min-height: 260px;
    }

    .flow-diagram--compact {
      min-height: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .flow-diagram *,
    .flow-diagram *::before,
    .flow-diagram *::after {
      animation: none !important;
      transition-duration: 0.001ms !important;
    }

    .pipe-segment.is-active .pipe-flow {
      stroke-dasharray: none;
      opacity: 0.65;
    }

    .tank-coil.is-active .tank-coil-flow {
      stroke-dasharray: none;
      opacity: 0.5;
    }

    .outdoor-water.is-active .outdoor-water__flow {
      stroke-dasharray: none;
      opacity: 0.5;
    }
  }
`;
