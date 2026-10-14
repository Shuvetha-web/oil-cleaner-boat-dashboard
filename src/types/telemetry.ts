export type OilCondition = 'detected' | 'not-detected' | null;
export interface Telemetry {
  deviceId?: string; timestamp?: string;
  oilSensor?: { raw?: number | null; oilRelatedCondition?: OilCondition };
  obstacles?: { frontCm?: number | null; rearCm?: number | null; leftCm?: number | null; rightCm?: number | null };
  gps?: { latitude?: number | null; longitude?: number | null; fix?: boolean | null };
  motion?: { accelX?: number | null; accelY?: number | null; accelZ?: number | null; gyroX?: number | null; gyroY?: number | null; gyroZ?: number | null; headingDeg?: number | null };
  motors?: { propulsion?: boolean | null; rudder?: number | null; skimmer?: boolean | null };
  power?: { batteryVoltage?: number | null; batteryPercent?: number | null; solarCharging?: boolean | null };
  lora?: { connected?: boolean | null; rssi?: number | null };
  groundStation?: { connected?: boolean | null };
  errors?: string[];
}
export interface EventRecord { id: string; time: string; type: string; severity: 'Info' | 'Warning' | 'Critical'; message: string; source: 'DEMO DATA' | 'LIVE DATA' | 'SYSTEM'; }
