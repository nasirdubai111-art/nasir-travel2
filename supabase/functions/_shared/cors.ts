// supabase/functions/_shared/cors.ts
// Standard CORS headers for Supabase Edge Functions

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-bharat-client-version, x-request-id",
  "Access-Control-Allow-Methods": "POST, GET, PUT, PATCH, DELETE, OPTIONS",
};

/**
 * Handle HTTP OPTIONS preflight request
 */
export function handleCorsPreflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
}

/**
 * Helper to construct JSON response with CORS headers
 */
export function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

/**
 * Helper to construct error response with CORS headers
 */
export function errorResponse(
  message: string,
  status = 400,
  details?: unknown
): Response {
  return jsonResponse(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
    status
  );
}
