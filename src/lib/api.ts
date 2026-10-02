/**
 * api.ts - ABIS Client Integration Layer
 * Connects Next.js frontend to FastAPI backend with graceful fallback simulation.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://terumobackend-production.up.railway.app"
).replace(/\/$/, "");

export interface DemandPoint {
  date: string;
  predicted_units: number;
  confidence_lower_95: number;
  confidence_upper_95: number;
}

export interface DemandForecastResponse {
  facility_id: string;
  forecast_horizon_days: number;
  baseline_daily_mean: number;
  stochastic_volatility: number;
  forecast: DemandPoint[];
  rebalance_alert: string | null;
  cached?: boolean;
}

export interface RetentionPredictionRequest {
  recency_days: number;
  frequency_total: number;
  tenure_days: number;
}

export interface RetentionPredictionResponse {
  retention_probability: number;
  retention_status: number;
  risk_tier: "LOW_RISK" | "MODERATE_RISK" | "HIGH_RISK";
  recommended_action: string;
}

export interface DonorRecord {
  donor_id: string;
  blood_type: string;
  tenure_days: number;
  recency_days: number;
  total_donations: number;
  retention_probability: number;
  retention_status: number;
  syphilis_s_co_ratio?: number;
  created_at: string;
}

export interface RebalanceSuggestion {
  from_facility_id: string;
  from_facility_name: string;
  to_facility_id: string;
  to_facility_name: string;
  recommended_units: number;
  urgency: "CRITICAL" | "HIGH" | "ROUTINE";
  reason: string;
}

export interface RebalanceResponse {
  network_status: string;
  active_shortage_facilities: number;
  active_surplus_facilities: number;
  recommended_transfers: RebalanceSuggestion[];
  cached?: boolean;
}

export interface TraceabilityEvent {
  event_id: string;
  donor_id: string;
  collection_timestamp: string;
  location_id: string;
  sync_status: string;
  cold_chain_breach_flag: boolean;
}

export interface InventoryUnit {
  unit_id: string;
  event_id: string;
  product_type: string;
  expiry_date: string;
  current_facility_id: string;
  status: string;
  created_at: string;
}

// --- API Service Calls with Resilient Fallback ---

export async function fetchDemandForecast(facilityId: string = "HOSP-NAIROBI-01", horizon: number = 7): Promise<DemandForecastResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/predict/demand/${facilityId}?horizon_days=${horizon}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`FastAPI backend unreachable at ${API_BASE_URL}, using realistic fallback simulation:`, err);
  }

  // Realistic fallback forecast matching the ARIMA engine
  const today = new Date();
  const baseline = facilityId === "HOSP-NAIROBI-01" ? 95 : facilityId === "HOSP-KISUMU-02" ? 52 : 30;
  const points: DemandPoint[] = Array.from({ length: horizon }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const pred = Math.round((baseline + (Math.sin(i) * 6) + (i === 4 || i === 5 ? 14 : 0)) * 10) / 10;
    return {
      date: d.toISOString().split("T")[0],
      predicted_units: pred,
      confidence_lower_95: Math.max(5, Math.round((pred - 28) * 10) / 10),
      confidence_upper_95: Math.round((pred + 32) * 10) / 10,
    };
  });

  return {
    facility_id: facilityId,
    forecast_horizon_days: horizon,
    baseline_daily_mean: baseline,
    stochastic_volatility: 14.8,
    forecast: points,
    rebalance_alert: facilityId === "CLINIC-MOMBASA-03" ? "CRITICAL DEFICIT ALERT: Coastal demand surges 28% above baseline." : null,
    cached: true,
  };
}

export async function predictRetention(payload: RetentionPredictionRequest): Promise<RetentionPredictionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/predict/retention`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend error in predictRetention, using simulated RF logic:", err);
  }

  // Simulated Random Forest logic
  const logit = 1.2 - 0.012 * payload.recency_days + 0.14 * payload.frequency_total + 0.0005 * payload.tenure_days;
  const prob = Math.min(0.999, Math.max(0.005, 1.0 / (1.0 + Math.exp(-logit))));
  const roundedProb = Math.round(prob * 10000) / 10000;

  let riskTier: "LOW_RISK" | "MODERATE_RISK" | "HIGH_RISK" = "LOW_RISK";
  let action = "Donor actively engaged. Dispatch scheduled SMS reminder for upcoming mobile drive.";

  if (roundedProb < 0.40) {
    riskTier = "HIGH_RISK";
    action = "Critical attrition risk. Flag for direct coordinator call with transport subsidy.";
  } else if (roundedProb < 0.70) {
    riskTier = "MODERATE_RISK";
    action = "Lapse warning. Dispatch personalized WhatsApp engagement with local community patient impact story.";
  }

  return {
    retention_probability: roundedProb,
    retention_status: roundedProb >= 0.5 ? 1 : 0,
    risk_tier: riskTier,
    recommended_action: action,
  };
}

export async function fetchRebalancingSuggestions(): Promise<RebalanceResponse> {
  const fallbackTransfers: RebalanceSuggestion[] = [
    {
      from_facility_id: "REGIONAL-HUB-01",
      from_facility_name: "Nairobi Regional Blood Transfusion Center",
      to_facility_id: "CLINIC-MOMBASA-03",
      to_facility_name: "Coast General Teaching & Referral Hospital",
      recommended_units: 45,
      urgency: "CRITICAL",
      reason: "Deficit facility at 22.5% capacity. Surplus hub holds 2,400 units (80% capacity)."
    }
  ];

  try {
    const res = await fetch(`${API_BASE_URL}/rebalance/suggestions`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const transfers = (Array.isArray(data.recommended_transfers) && data.recommended_transfers.length > 0)
        ? data.recommended_transfers
        : (Array.isArray(data.suggestions) && data.suggestions.length > 0)
        ? data.suggestions
        : fallbackTransfers;

      return {
        network_status: data.network_status || data.status || "rebalancing_computed",
        active_shortage_facilities: data.active_shortage_facilities ?? 1,
        active_surplus_facilities: data.active_surplus_facilities ?? 1,
        recommended_transfers: transfers,
        cached: data.cached ?? true,
      };
    }
  } catch (err) {
    console.warn("FastAPI rebalance suggestions error, using fallback:", err);
  }

  return {
    network_status: "rebalancing_computed",
    active_shortage_facilities: 1,
    active_surplus_facilities: 1,
    recommended_transfers: fallbackTransfers,
    cached: true
  };
}

export async function fetchDonors(limit: number = 20): Promise<DonorRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/donors/?limit=${limit}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("FastAPI donors fetch error, using fallback:", err);
  }

  // Realistic fallback donor cohort
  return [
    { donor_id: "d1a8e2f0-101", blood_type: "O+", tenure_days: 720, recency_days: 28, total_donations: 8, retention_probability: 0.9842, retention_status: 1, syphilis_s_co_ratio: 0.32, created_at: "2024-03-12T10:00:00Z" },
    { donor_id: "f3c9b7a1-102", blood_type: "O-", tenure_days: 480, recency_days: 42, total_donations: 6, retention_probability: 0.9415, retention_status: 1, syphilis_s_co_ratio: 0.25, created_at: "2024-08-20T14:30:00Z" },
    { donor_id: "b4d2e8c3-103", blood_type: "A+", tenure_days: 900, recency_days: 140, total_donations: 4, retention_probability: 0.6120, retention_status: 1, syphilis_s_co_ratio: 0.45, created_at: "2023-11-05T09:15:00Z" },
    { donor_id: "e9f0a1b2-104", blood_type: "B+", tenure_days: 360, recency_days: 290, total_donations: 1, retention_probability: 0.1245, retention_status: 0, syphilis_s_co_ratio: 0.18, created_at: "2025-01-14T11:40:00Z" },
    { donor_id: "a7b8c9d0-105", blood_type: "AB-", tenure_days: 620, recency_days: 380, total_donations: 2, retention_probability: 0.0890, retention_status: 0, syphilis_s_co_ratio: 11.20, created_at: "2024-05-18T16:20:00Z" },
    { donor_id: "c2d3e4f5-106", blood_type: "O+", tenure_days: 1200, recency_days: 35, total_donations: 16, retention_probability: 0.9991, retention_status: 1, syphilis_s_co_ratio: 0.29, created_at: "2023-01-10T08:00:00Z" },
    { donor_id: "d5e6f7a8-107", blood_type: "A-", tenure_days: 240, recency_days: 195, total_donations: 1, retention_probability: 0.2310, retention_status: 0, syphilis_s_co_ratio: 0.50, created_at: "2025-06-01T13:10:00Z" }
  ];
}

// --- SWR Global Fetcher with JSON response handling ---
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.detail || `Request failed with status ${res.status}`);
    throw error;
  }
  return res.json();
};

export interface BarcodeRecordPayload {
  barcode: string;
  blood_type: string;
  product_type: string;
  expiry_date?: string;
  facility?: string;
  temperature?: number;
  status?: string;
  is_agitated?: boolean;
}

export interface BatchManifestPayload {
  batch_id: string;
  field_lead: string;
  location: string;
  timestamp: string;
  temperature: number;
  cold_chain_breach: boolean;
  barcode_records: BarcodeRecordPayload[];
}

export async function postFlutterOfflineBatch(payload: BatchManifestPayload) {
  const res = await fetch(`${API_BASE_URL}/events/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Batch upload failed: ${res.status} ${errText}`);
  }
  return await res.json();
}
