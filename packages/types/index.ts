export type SeverityLevel = "LOW" | "MODERATE" | "HIGH" | "SEVERE" | "EXTREME";
export type ForecastHorizon = 15 | 30 | 60 | 90;

export interface StormVector {
  direction_deg: number;
  speed_kmh: number;
}

export interface StormCellData {
  id: string;
  name: string;
  status: string;
  severity: SeverityLevel;
  lat: number;
  lon: number;
  intensity_dbz: number;
  vert_extent_km: number;
  speed_kmh: number;
  direction_deg: number;
}
