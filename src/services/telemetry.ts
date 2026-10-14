import type { Telemetry } from '../types/telemetry';
export function parseTelemetry(raw: string): Telemetry {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Message must be a JSON object.');
  const data = value as Record<string, unknown>;
  if (data.timestamp !== undefined && (typeof data.timestamp !== 'string' || Number.isNaN(Date.parse(data.timestamp)))) throw new Error('timestamp must be a valid ISO-8601 date string.');
  for (const key of ['oilSensor','obstacles','gps','motion','motors','power','lora']) {
    if (data[key] !== undefined && (data[key] === null || typeof data[key] !== 'object' || Array.isArray(data[key]))) throw new Error(`${key} must be an object when supplied.`);
  }
  const numericPaths: [string,string[]][] = [
    ['oilSensor',['raw']],['obstacles',['frontCm','rearCm','leftCm','rightCm']],['gps',['latitude','longitude']],['motion',['accelX','accelY','accelZ','gyroX','gyroY','gyroZ','headingDeg']],['motors',['rudder']],['power',['batteryVoltage','batteryPercent']],['lora',['rssi']]
  ];
  for (const [section, fields] of numericPaths) {
    const obj = data[section] as Record<string, unknown> | undefined;
    if (!obj) continue;
    for (const field of fields) if (obj[field] !== undefined && obj[field] !== null && (typeof obj[field] !== 'number' || !Number.isFinite(obj[field]))) throw new Error(`${section}.${field} must be a finite number or null.`);
  }
  return data as Telemetry;
}
export function connectTelemetry(url: string, onData: (data: Telemetry) => void, onStatus: (status: string) => void, onError: (error: string) => void) {
  let socket: WebSocket | null = null; let reconnectTimer: ReturnType<typeof setTimeout> | undefined; let stopped = false; let attempts=0;
  const open = () => {
    if (stopped) return;
    try { socket = new WebSocket(url); } catch { onError('Invalid WebSocket URL. Use ws:// or wss://.'); onStatus('disconnected'); return; }
    socket.onopen=()=>{attempts=0;onStatus('connected');};
    socket.onmessage=(event)=>{try {onData(parseTelemetry(String(event.data)));}catch(e){onError(e instanceof Error?e.message:'Invalid telemetry message');}};
    socket.onerror=()=>onError('WebSocket connection error. Check the endpoint and server.');
    socket.onclose=()=>{onStatus('disconnected');if(!stopped){const delay=Math.min(1000*2**attempts,15000);attempts++;reconnectTimer=setTimeout(open,delay);onStatus('reconnecting');}};
  };
  open();
  return ()=>{stopped=true;if(reconnectTimer)clearTimeout(reconnectTimer);socket?.close();};
}
