export type EndpointHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type EndpointType = "REST" | "GraphQL" | "Webhook" | "SOAP" | "gRPC";

export type EndpointEnvironment = "production" | "staging" | "sandbox" | "development";

export type TravelModule =
  | "Flights"
  | "Hotels & Stays"
  | "IRCTC Trains"
  | "Intercity Buses"
  | "Cabs & Transfers"
  | "Spiritual Yatras"
  | "Razorpay Split & Payments"
  | "GST & Tax Filing"
  | "Weather & AI Services"
  | "Central Bookings"
  | "Supabase & Database";

export interface ApiEndpointItem {
  id: string;
  name: string;
  provider: string;
  module: TravelModule | string;
  endpoint_type: EndpointType | string;
  http_method: EndpointHttpMethod | string;
  endpoint_url: string;
  environment: EndpointEnvironment | string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  description?: string;
  headers?: Record<string, string>;
  auth_type?: "Bearer" | "API Key" | "Basic" | "OAuth2" | "None";
  rate_limit_per_min?: number;
  timeout_ms?: number;
  last_tested_at?: string | null;
  last_status_code?: number | null;
  last_latency_ms?: number | null;
  sync_source?: "supabase" | "local_cache";
}

export interface EndpointTestResult {
  success: boolean;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  testedAt: string;
  endpointUrl: string;
  method: string;
  headers: Record<string, string>;
  responsePayload: any;
  errorMessage?: string;
}
