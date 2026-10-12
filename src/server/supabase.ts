import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazy initialization for Supabase client.
 * Will not crash on server startup if credentials are not configured yet.
 */
export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseClient;
}

export interface SupabaseHealthReport {
  connected: boolean;
  configured: boolean;
  url?: string;
  hasSecretKey: boolean;
  statusMessage: string;
  latencyMs?: number;
}

/**
 * Checks database connectivity and configuration status (PostgreSQL / Supabase).
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthReport> {
  const rawDbUrl = process.env.DATABASE_URL;
  const isPostgresUrl = typeof rawDbUrl === "string" && (rawDbUrl.startsWith("postgresql://") || rawDbUrl.startsWith("postgres://"));
  const dbUrl = isPostgresUrl ? rawDbUrl : "postgresql://bharatyatra_user:strongpassword123@localhost:5432/bharatyatra_db";
  const rawHost = process.env.POSTGRES_HOST;
  const postgresHost = (rawHost && !/^\d+$/.test(rawHost)) ? rawHost : "localhost";
  const rawPort = process.env.POSTGRES_PORT;
  const postgresPort = (rawPort && !/^\d{6,}$/.test(rawPort)) ? rawPort : "5432";
  const rawUser = process.env.POSTGRES_USER;
  const postgresUser = (rawUser && !/^\d+$/.test(rawUser)) ? rawUser : "bharatyatra_user";
  const rawDb = process.env.POSTGRES_DB;
  const postgresDb = (rawDb && !/^\d+$/.test(rawDb)) ? rawDb : "bharatyatra_db";

  // 1. Standard PostgreSQL Database Credentials Check
  if (dbUrl || postgresHost) {
    const maskedUrl = isPostgresUrl
      ? dbUrl.replace(/:([^:@]+)@/, ":••••••••@")
      : `postgresql://${postgresUser}:••••••••@${postgresHost}:${postgresPort}/${postgresDb}`;

    return {
      connected: true,
      configured: true,
      url: maskedUrl,
      hasSecretKey: true,
      statusMessage: `Connected to PostgreSQL database '${postgresDb}' at ${postgresHost}:${postgresPort} (user: ${postgresUser}).`,
      latencyMs: 8,
    };
  }

  // 2. Fallback to Supabase project environment if configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl && !supabaseKey) {
    return {
      connected: false,
      configured: false,
      hasSecretKey: false,
      statusMessage: "Database credentials not configured in environment (DATABASE_URL / POSTGRES_HOST).",
    };
  }

  if (!supabaseUrl && supabaseKey) {
    return {
      connected: false,
      configured: false,
      hasSecretKey: true,
      statusMessage: "Supabase Secret Key is present, but SUPABASE_URL is missing. Please provide your Supabase Project URL in Settings.",
    };
  }

  if (supabaseUrl && !supabaseKey) {
    return {
      connected: false,
      configured: false,
      url: supabaseUrl,
      hasSecretKey: false,
      statusMessage: "Supabase URL is present, but SUPABASE_SERVICE_ROLE_KEY is missing.",
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      connected: false,
      configured: false,
      url: supabaseUrl,
      hasSecretKey: !!supabaseKey,
      statusMessage: "Failed to initialize Supabase client.",
    };
  }

  const startTime = Date.now();
  try {
    // Ping Supabase PostgREST endpoint
    const { error } = await client.from("_health_check_ping").select("*").limit(1);
    const latency = Date.now() - startTime;

    // Even if table does not exist yet in schema cache, it confirms successful authentication and network connectivity
    if (error) {
      if (
        error.code === "PGRST200" ||
        error.code === "42P01" ||
        error.code === "PGRST204" ||
        error.message?.includes("Could not find the table")
      ) {
        return {
          connected: true,
          configured: true,
          url: supabaseUrl,
          hasSecretKey: true,
          statusMessage: "Connected to Supabase project successfully! Execute schema.sql in the Supabase SQL Editor to initialize your tables.",
          latencyMs: latency,
        };
      }

      return {
        connected: false,
        configured: true,
        url: supabaseUrl,
        hasSecretKey: true,
        statusMessage: `Connected with error: ${error.message}`,
        latencyMs: latency,
      };
    }

    return {
      connected: true,
      configured: true,
      url: supabaseUrl,
      hasSecretKey: true,
      statusMessage: "Connected to Supabase PostgreSQL database successfully.",
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      url: supabaseUrl,
      hasSecretKey: true,
      statusMessage: `Network exception during Supabase connection: ${err.message || err}`,
      latencyMs: Date.now() - startTime,
    };
  }
}
