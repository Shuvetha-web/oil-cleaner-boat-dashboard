import type { Telemetry, EventRecord } from '../types/telemetry';
export function makeDemoTelemetry(): Telemetry {
  const t = Date.now();
  return {
    deviceId:'demo-boat-esp32', timestamp:new Date(t).toISOString(),
    oilSensor:{raw:Math.round(410 + Math.sin(t/17000)*85), oilRelatedCondition: Math.sin(t/28000) > .42 ? 'detected':'not-detected'},
    obstacles:{frontCm:Math.round(115+Math.sin(t/9000)*28),rearCm:Math.round(160+Math.cos(t/11000)*18),leftCm:Math.round(92+Math.sin(t/12000)*20),rightCm:Math.round(135+Math.cos(t/8000)*24)},
    gps:{latitude:12.9716,longitude:77.5946,fix:true},
    motion:{accelX:Number((Math.sin(t/3000)*.14).toFixed(2)),accelY:Number((Math.cos(t/4000)*.12).toFixed(2)),accelZ:9.79,gyroX:Number((Math.sin(t/5000)*1.7).toFixed(2)),gyroY:Number((Math.cos(t/6000)*1.2).toFixed(2)),gyroZ:Number((Math.sin(t/7000)*.8).toFixed(2)),headingDeg:Math.round((t/2500)%360)},
    motors:{propulsion:true,rudder:0,skimmer:Math.sin(t/40000)>.15},
    power:{batteryVoltage:Number((12.1+Math.sin(t/50000)*.18).toFixed(2)),batteryPercent:78,solarCharging:true},
    lora:{connected:true,rssi:-72+Math.round(Math.sin(t/10000)*5)},groundStation:{connected:true}
  };
}
export function makeDemoEvents(): EventRecord[] {
  const now=Date.now(); return [
    {id:'d1',time:new Date(now-60000).toISOString(),type:'LoRa',severity:'Info',message:'Demo packet received from boat node',source:'DEMO DATA'},
    {id:'d2',time:new Date(now-240000).toISOString(),type:'Skimmer',severity:'Info',message:'Skimmer state updated in simulation',source:'DEMO DATA'},
    {id:'d3',time:new Date(now-510000).toISOString(),type:'Obstacle',severity:'Warning',message:'Simulated left-side distance crossed warning threshold',source:'DEMO DATA'}
  ];
}
