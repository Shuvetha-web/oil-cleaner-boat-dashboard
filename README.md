# OilGuard — Smart IoT Oil Cleaner Boat Dashboard

A responsive React + TypeScript dashboard starter for the final-year project **Smart IoT-Based Oil Cleaner Boat Using LoRa Communication for Real-Time Environmental Monitoring**.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm

## Run in VS Code
1. Extract this project folder.
2. Open the folder in VS Code (`File → Open Folder`).
3. Open `Terminal → New Terminal`.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Build and preview
```bash
npm run build
npm run preview
```
The production output is generated in `dist/`.

## Pages
Overview; Oil Detection & Skimmer; Obstacle Detection & GPS; Motion & Heading; LoRa Ground Station; Manual & Autonomous Control; Solar & Battery; Alerts & History; Hardware & Connection Settings.

## Demo and live data
- Demo Mode uses synthetic readings and clearly labels the interface `DEMO MODE` / `DEMO DATA`.
- Live Connection uses a user-configured WebSocket endpoint. The UI remains disconnected until valid telemetry is received.
- The dashboard is a browser client, not a LoRa receiver. The boat ESP32/RA-02 sends telemetry to the ground-station ESP32/RA-02. A ground-station forwarding service must then expose telemetry over WebSocket for the browser.
- The frontend has no credentials, backend, MQTT broker, or control-command channel hardcoded.
- Controls remain disabled. Telemetry WebSocket reception does not imply that commands can be sent.

## WebSocket telemetry contract
Send one JSON object per WebSocket message. The receiver can map firmware fields into this shape:
```json
{
  "deviceId": "boat-esp32",
  "timestamp": "2026-10-14T12:00:00.000Z",
  "oilSensor": { "raw": null, "oilRelatedCondition": null },
  "obstacles": { "frontCm": null, "rearCm": null, "leftCm": null, "rightCm": null },
  "gps": { "latitude": null, "longitude": null, "fix": false },
  "motion": { "accelX": null, "accelY": null, "accelZ": null, "gyroX": null, "gyroY": null, "gyroZ": null, "headingDeg": null },
  "motors": { "propulsion": null, "rudder": null, "skimmer": null },
  "power": { "batteryVoltage": null, "batteryPercent": null, "solarCharging": null },
  "lora": { "connected": null, "rssi": null }
}
```
Use `null` for unavailable values. Numeric sensor fields must be finite numbers or null. Timestamp should be ISO-8601. Extra fields such as `groundStation` and `errors` are optional. The frontend validates JSON structure and key numeric fields, and reports malformed messages.

## Hardware notes
- SEN0189 is represented as the project's oil-related/turbidity sensor; it does not automatically identify all oil types or measure oil concentration.
- Collected oil volume is not inferred from sensor readings. The proposed container capacity is shown as 3 litres.
- Battery is nominally 12 V, 5 Ah, with a 10 W solar panel and charge controller. No voltage, percentage, generation or efficiency is invented in live mode.
- GPS map is schematic and appears as a boat-position marker only when valid coordinates/fix are supplied; it does not invent a route.
- Emergency-stop screen is only an interface concept, not a physical stop circuit.

## Publish a shareable URL
1. Push the project folder to a GitHub repository.
2. On Vercel or Netlify, import that repository.
3. Set build command to `npm run build` and output directory to `dist` (Vite is generally auto-detected).
4. Deploy and share the generated public URL with teammates.
5. For live telemetry from an HTTPS-hosted dashboard, configure a reachable secure `wss://` endpoint. A local `ws://localhost:8080` endpoint will not be reachable by teammates on the public internet.

## Important
This is a frontend dashboard with a WebSocket client. A separate tested WebSocket server/receiver integration is required to receive actual boat telemetry. The current sample mode is synthetic, and the dashboard must not be treated as a safety-critical boat controller.
