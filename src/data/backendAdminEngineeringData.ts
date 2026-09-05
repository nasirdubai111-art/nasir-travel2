export interface BackendErrorLog {
  id: string;
  timestamp: string;
  category: "API" | "DATABASE" | "PAYMENT" | "INTEGRATION" | "EXCEPTION";
  service: string;
  method: string;
  endpoint: string;
  statusCode: number;
  correlationId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  errorMessage: string;
  stackTrace: string;
  maskedPayload: {
    requestHeaders: Record<string, string>;
    requestBody: Record<string, any>;
    responseBody: Record<string, any>;
  };
  resolved: boolean;
  linkedIssueId?: string;
}

export interface BackendIssue {
  id: string;
  title: string;
  errorId: string;
  service: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "INVESTIGATING" | "FIXED" | "CLOSED";
  assignedDeveloper: string;
  createdAt: string;
  updatedAt: string;
  debugNotes: string[];
}

export interface ApiDebugEndpoint {
  id: string;
  name: string;
  provider: string;
  category: "FLIGHT" | "TRAIN" | "BUS" | "HOTEL" | "PAYMENT" | "COMMUNICATION" | "INTERNAL";
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: "HEALTHY" | "DEGRADED" | "DOWN";
  latencyMs: number;
  errorRatePercent: number;
  lastFailureCode?: number;
  lastFailureTimestamp?: string;
  timeoutLimitMs: number;
  authMethod: "OAuth2 / Bearer" | "HMAC Signature" | "mTLS Certificate" | "API Key (Masked)";
}

export interface DatabaseDebugMetric {
  poolName: string;
  maxConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  slowQueryThresholdMs: number;
  recentSlowQueries: Array<{
    queryId: string;
    durationMs: number;
    statement: string;
    timestamp: string;
    rowsAffected: number;
  }>;
  replicationLagMs: number;
  cacheHitRatio: number;
  deadlocksCount: number;
}

export interface BackendTestCase {
  id: string;
  suite:
    | "API Testing"
    | "Database Testing"
    | "Authentication Testing"
    | "Booking Testing"
    | "Payment Testing"
    | "Integration Testing"
    | "Security Testing"
    | "Performance Testing"
    | "Regression Testing";
  testName: string;
  description: string;
  targetService: string;
  lastRunTimestamp: string;
  durationMs: number;
  status: "PASSED" | "FAILED" | "PENDING";
  failureReason?: string;
  assertionsCount: number;
}

export interface MaintenanceActionHistory {
  id: string;
  action: string;
  initiatedBy: string;
  timestamp: string;
  durationSec: number;
  status: "COMPLETED" | "IN_PROGRESS" | "SCHEDULED";
  details: string;
}

export interface SystemMonitoringSnapshot {
  springBoot: {
    version: string;
    status: "UP" | "DEGRADED" | "DOWN";
    jvmHeapUsedMb: number;
    jvmHeapMaxMb: number;
    gcPauseTimeMs: number;
    threadsActive: number;
    uptimeHours: number;
  };
  serverHost: {
    cpuUsagePercent: number;
    ramUsedGb: number;
    ramTotalGb: number;
    diskUsedPercent: number;
    networkRxMb: number;
    networkTxMb: number;
  };
  apiMetrics: {
    requestsPerSecond: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    errorRatePercent: number;
  };
}

// ==========================================
// 1. ERROR LOGS (WITH CORRELATION IDS & STACKS)
// ==========================================
export const INITIAL_BACKEND_ERROR_LOGS: BackendErrorLog[] = [
  {
    id: "err-2026-901",
    timestamp: "2026-09-05 03:42:19 UTC",
    category: "PAYMENT",
    service: "payment-gateway-orchestrator",
    method: "POST",
    endpoint: "/api/v1/payments/razorpay/webhook",
    statusCode: 504,
    correlationId: "corr_rzp_9f82a_wh_timeout",
    severity: "CRITICAL",
    errorMessage: "GatewayTimeoutException: Webhook verification timed out after 5000ms while pinging Razorpay signature validator.",
    stackTrace: `com.bharatyatra.payment.exception.GatewayTimeoutException: Webhook verification timed out after 5000ms
	at com.bharatyatra.payment.service.RazorpayWebhookService.verifySignature(RazorpayWebhookService.java:142)
	at com.bharatyatra.payment.controller.RazorpayWebhookController.handleEvent(RazorpayWebhookController.java:68)
	at jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:207)`,
    maskedPayload: {
      requestHeaders: {
        "x-razorpay-signature": "••••••••••••••••••••39ef",
        "content-type": "application/json",
        "trace-parent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
      },
      requestBody: {
        event: "payment.captured",
        payment_id: "pay_••••••••4812",
        order_id: "order_••••••••9102",
        amount: 320000,
        currency: "INR",
        card_pan: "•••• •••• •••• 4242",
        cvv: "[MASKED]",
      },
      responseBody: {
        error: "INTERNAL_GATEWAY_TIMEOUT",
        message: "Something went wrong. Please try again.",
      },
    },
    resolved: false,
    linkedIssueId: "ISS-401",
  },
  {
    id: "err-2026-902",
    timestamp: "2026-09-05 03:15:02 UTC",
    category: "INTEGRATION",
    service: "irctc-sync-worker",
    method: "GET",
    endpoint: "/api/v1/integrations/irctc/pnr-status",
    statusCode: 502,
    correlationId: "corr_irctc_b2b_7718_degraded",
    severity: "HIGH",
    errorMessage: "BadGatewayException: IRCTC NGeT GDS endpoint returned HTTP 502 Bad Gateway during Tatkal sync quota verification.",
    stackTrace: `com.bharatyatra.train.exception.BadGatewayException: IRCTC upstream returned HTTP 502
	at com.bharatyatra.train.client.IrctcApiClient.fetchPnrStatus(IrctcApiClient.java:89)
	at com.bharatyatra.train.worker.PnrBackgroundPoller.poll(PnrBackgroundPoller.java:44)
	at org.springframework.scheduling.support.DelegatingErrorHandlingRunnable.run(DelegatingErrorHandlingRunnable.java:54)`,
    maskedPayload: {
      requestHeaders: {
        "authorization": "Bearer [REDACTED_BEARER_TOKEN]",
        "x-api-key": "irctc_b2b_••••••••a11e",
      },
      requestBody: {
        pnr: "281••••••3",
        train_number: "22436",
        date: "2026-09-10",
      },
      responseBody: {
        status: "FAILED",
        safeNotice: "Upstream railway reservation server is undergoing brief maintenance.",
      },
    },
    resolved: false,
    linkedIssueId: "ISS-402",
  },
  {
    id: "err-2026-903",
    timestamp: "2026-09-05 02:40:44 UTC",
    category: "DATABASE",
    service: "inventory-reservation-engine",
    method: "POST",
    endpoint: "/api/v1/inventory/hotel/lock-slot",
    statusCode: 409,
    correlationId: "corr_pg_trans_3910_deadlock",
    severity: "HIGH",
    errorMessage: "PSQLException: ERROR: deadlock detected between process 14218 (hotel room lock) and process 14224 (bulk OTA inventory refresh).",
    stackTrace: `org.postgresql.util.PSQLException: ERROR: deadlock detected
	at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2714)
	at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2400)
	at org.postgresql.jdbc.PgStatement.executeInternal(PgStatement.java:492)
	at com.bharatyatra.hotel.dao.RoomInventoryDao.lockInventoryForBooking(RoomInventoryDao.java:188)`,
    maskedPayload: {
      requestHeaders: {
        "x-session-token": "[REDACTED_SESSION_COOKIE]",
      },
      requestBody: {
        property_id: "prop_taj_palace_delhi",
        room_type_id: "rt_heritage_suite",
        quantity: 1,
        hold_seconds: 900,
      },
      responseBody: {
        error: "CONCURRENCY_LOCK_CONFLICT",
        message: "Room is temporarily being secured by another traveler. Please retry in 30 seconds.",
      },
    },
    resolved: true,
  },
  {
    id: "err-2026-904",
    timestamp: "2026-09-05 01:12:30 UTC",
    category: "API",
    service: "flight-gds-connector",
    method: "POST",
    endpoint: "/api/v1/flights/amadeus/fare-quote",
    statusCode: 429,
    correlationId: "corr_amadeus_9f82a_ratelimit",
    severity: "MEDIUM",
    errorMessage: "RateLimitExceededException: Amadeus GDS Enterprise Sandbox returned 429 (Too Many Requests). Tier quota exceeded 120 req/sec.",
    stackTrace: `com.bharatyatra.flight.exception.RateLimitExceededException: Amadeus rate limit quota triggered
	at com.bharatyatra.flight.client.AmadeusConnector.fetchFareQuotes(AmadeusConnector.java:210)
	at com.bharatyatra.flight.service.FareSearchService.searchFares(FareSearchService.java:95)`,
    maskedPayload: {
      requestHeaders: {
        "x-client-id": "amadeus_••••••••5501",
      },
      requestBody: {
        origin: "DEL",
        destination: "BOM",
        travelDate: "2026-09-20",
        cabin: "ECONOMY",
      },
      responseBody: {
        retryAfterSec: 4,
      },
    },
    resolved: true,
  },
  {
    id: "err-2026-905",
    timestamp: "2026-09-04 23:55:18 UTC",
    category: "EXCEPTION",
    service: "notification-dispatcher",
    method: "POST",
    endpoint: "/api/v1/notifications/whatsapp/send-template",
    statusCode: 500,
    correlationId: "corr_wa_meta_4102_jwt_auth",
    severity: "LOW",
    errorMessage: "MetaApiException: WhatsApp Business API OAuth access token expired unexpectedly before scheduled 6-hour refresh.",
    stackTrace: `com.bharatyatra.notification.exception.MetaApiException: OAuth access token expired
	at com.bharatyatra.notification.client.WhatsAppClient.sendTemplate(WhatsAppClient.java:112)
	at com.bharatyatra.notification.consumer.TripEventKafkaConsumer.onBookingConfirmed(TripEventKafkaConsumer.java:55)`,
    maskedPayload: {
      requestHeaders: {
        "authorization": "Bearer [MASKED_META_SYSTEM_TOKEN]",
      },
      requestBody: {
        template: "ticket_confirmation_v3",
        recipient_phone: "+91 98•••• ••210",
      },
      responseBody: {
        error: "TOKEN_EXPIRED",
      },
    },
    resolved: true,
  },
];

// ==========================================
// 2. ISSUES MANAGEMENT (DEVELOPER ASSIGNMENT)
// ==========================================
export const INITIAL_BACKEND_ISSUES: BackendIssue[] = [
  {
    id: "ISS-401",
    title: "Webhook GatewayTimeout in Razorpay Signature Validator",
    errorId: "err-2026-901",
    service: "payment-gateway-orchestrator",
    priority: "CRITICAL",
    status: "INVESTIGATING",
    assignedDeveloper: "Priya Sharma (Senior Payments Architect)",
    createdAt: "2026-09-05 03:45:00 UTC",
    updatedAt: "2026-09-05 03:55:00 UTC",
    debugNotes: [
      "Observed network socket timeout during spike in UPI webhook calls.",
      "Increasing connection timeout from 5000ms to 8000ms and adding Redis lock fallback.",
      "Webhook idempotent retries are currently handling delayed callbacks successfully.",
    ],
  },
  {
    id: "ISS-402",
    title: "IRCTC NGeT Tatkal Upstream 502 Bad Gateway Mitigation",
    errorId: "err-2026-902",
    service: "irctc-sync-worker",
    priority: "HIGH",
    status: "OPEN",
    assignedDeveloper: "Ankit Verma (Lead Backend Engineer)",
    createdAt: "2026-09-05 03:18:00 UTC",
    updatedAt: "2026-09-05 03:25:00 UTC",
    debugNotes: [
      "IRCTC NGeT server was under heavy morning Tatkal load (10:00 - 10:15 AM).",
      "Need to activate circuit breaker to prevent cascade thread exhaustion on train-service.",
    ],
  },
  {
    id: "ISS-403",
    title: "Redis Cluster Eviction Alert on Search Cache Tier",
    errorId: "err-2026-904",
    service: "fare-search-cache",
    priority: "MEDIUM",
    status: "FIXED",
    assignedDeveloper: "Dev Team (Infrastructure & SRE)",
    createdAt: "2026-09-04 22:10:00 UTC",
    updatedAt: "2026-09-05 01:30:00 UTC",
    debugNotes: [
      "Eviction policy updated to volatile-lru with 15-minute TTL on flight price searches.",
      "Memory utilization stabilized at 62%.",
    ],
  },
];

// ==========================================
// 3. API DEBUGGING ENDPOINTS LIST
// ==========================================
export const API_DEBUG_ENDPOINTS: ApiDebugEndpoint[] = [
  {
    id: "api-amadeus-flight",
    name: "Amadeus Enterprise Flight GDS",
    provider: "Amadeus IT Group",
    category: "FLIGHT",
    endpoint: "https://api.amadeus.com/v2/shopping/flight-offers",
    method: "POST",
    status: "HEALTHY",
    latencyMs: 142,
    errorRatePercent: 0.02,
    timeoutLimitMs: 8000,
    authMethod: "OAuth2 / Bearer",
  },
  {
    id: "api-irctc-train",
    name: "IRCTC NGeT Rail Service Gateway",
    provider: "Centre for Railway Information Systems (CRIS)",
    category: "TRAIN",
    endpoint: "https://nget.irctc.co.in/eticketing/protected/v1/availability",
    method: "GET",
    status: "DEGRADED",
    latencyMs: 380,
    errorRatePercent: 1.8,
    lastFailureCode: 502,
    lastFailureTimestamp: "2026-09-05 03:15:02 UTC",
    timeoutLimitMs: 10000,
    authMethod: "mTLS Certificate",
  },
  {
    id: "api-redbus-intercity",
    name: "RedBus B2B Bus Inventory API",
    provider: "MakeMyTrip / Ibibo Group",
    category: "BUS",
    endpoint: "https://api.redbus.in/v2/b2b/availabletrips",
    method: "GET",
    status: "HEALTHY",
    latencyMs: 65,
    errorRatePercent: 0.01,
    timeoutLimitMs: 5000,
    authMethod: "HMAC Signature",
  },
  {
    id: "api-hotel-gds",
    name: "RateGain / Hotel Switch Engine",
    provider: "RateGain Tech",
    category: "HOTEL",
    endpoint: "https://api.rategain.com/dhisco/ari/v3",
    method: "POST",
    status: "HEALTHY",
    latencyMs: 98,
    errorRatePercent: 0.05,
    timeoutLimitMs: 6000,
    authMethod: "OAuth2 / Bearer",
  },
  {
    id: "api-razorpay-pg",
    name: "Razorpay Payments & Escrow Payouts",
    provider: "Razorpay Software Pvt Ltd",
    category: "PAYMENT",
    endpoint: "https://api.razorpay.com/v1/orders",
    method: "POST",
    status: "HEALTHY",
    latencyMs: 110,
    errorRatePercent: 0.08,
    lastFailureCode: 504,
    lastFailureTimestamp: "2026-09-05 03:42:19 UTC",
    timeoutLimitMs: 8000,
    authMethod: "HMAC Signature",
  },
  {
    id: "api-whatsapp-meta",
    name: "WhatsApp Cloud API (Meta)",
    provider: "Meta Platforms",
    category: "COMMUNICATION",
    endpoint: "https://graph.facebook.com/v20.0/messages",
    method: "POST",
    status: "HEALTHY",
    latencyMs: 52,
    errorRatePercent: 0.01,
    timeoutLimitMs: 4000,
    authMethod: "API Key (Masked)",
  },
  {
    id: "api-spring-internal",
    name: "Spring Boot Core Booking Service",
    provider: "Internal Platform Kubernetes Pods",
    category: "INTERNAL",
    endpoint: "http://booking-service.internal.bharatyatra.com/actuator/health",
    method: "GET",
    status: "HEALTHY",
    latencyMs: 4,
    errorRatePercent: 0.0,
    timeoutLimitMs: 2000,
    authMethod: "mTLS Certificate",
  },
];

// ==========================================
// 4. DATABASE DEBUGGING METRICS
// ==========================================
export const DATABASE_DEBUG_METRICS: DatabaseDebugMetric = {
  poolName: "HikariPool-BharatYatra-PostgreSQL-Primary",
  maxConnections: 100,
  activeConnections: 34,
  idleConnections: 66,
  waitingRequests: 0,
  slowQueryThresholdMs: 250,
  replicationLagMs: 0,
  cacheHitRatio: 99.4,
  deadlocksCount: 1,
  recentSlowQueries: [
    {
      queryId: "q-pg-8812",
      durationMs: 342,
      statement: "SELECT b.*, p.payment_status FROM bookings b JOIN payments p ON b.id = p.booking_id WHERE b.travel_date BETWEEN $1 AND $2 AND b.status = 'CONFIRMED' ORDER BY b.created_at DESC LIMIT 100",
      timestamp: "2026-09-05 03:31:12 UTC",
      rowsAffected: 100,
    },
    {
      queryId: "q-pg-8813",
      durationMs: 280,
      statement: "UPDATE room_inventory SET reserved_slots = reserved_slots + 1 WHERE property_id = $1 AND room_type_id = $2 AND slot_date = $3",
      timestamp: "2026-09-05 02:40:40 UTC",
      rowsAffected: 1,
    },
    {
      queryId: "q-pg-8814",
      durationMs: 265,
      statement: "SELECT calculate_partner_payout_escrow($1, $2, $3)",
      timestamp: "2026-09-05 01:15:22 UTC",
      rowsAffected: 1,
    },
  ],
};

// ==========================================
// 5. 10 BACKEND TESTING SUITES
// ==========================================
export const INITIAL_TEST_CASES: BackendTestCase[] = [
  // 1. API Testing
  {
    id: "tc-api-01",
    suite: "API Testing",
    testName: "GET /api/v1/flights/search - Schema & 200 OK Response",
    description: "Validates JSON schema, mandatory flight departure times, and carrier codes.",
    targetService: "flight-service",
    lastRunTimestamp: "2026-09-05 03:50 UTC",
    durationMs: 84,
    status: "PASSED",
    assertionsCount: 14,
  },
  {
    id: "tc-api-02",
    suite: "API Testing",
    testName: "POST /api/v1/bookings/create - Idempotency Key Replay Protection",
    description: "Ensures submitting duplicate idempotency keys returns cached booking without double-charging.",
    targetService: "booking-orchestrator",
    lastRunTimestamp: "2026-09-05 03:50 UTC",
    durationMs: 120,
    status: "PASSED",
    assertionsCount: 8,
  },
  // 2. Database Testing
  {
    id: "tc-db-01",
    suite: "Database Testing",
    testName: "PostgreSQL ACID Transaction Rollback on Payment Failure",
    description: "Asserts that when booking payment throws an exception, inventory locks and ledger credits are atomically rolled back.",
    targetService: "postgresql-primary",
    lastRunTimestamp: "2026-09-05 03:48 UTC",
    durationMs: 45,
    status: "PASSED",
    assertionsCount: 6,
  },
  {
    id: "tc-db-02",
    suite: "Database Testing",
    testName: "Database Read-Replica Synchronization Lag < 50ms",
    description: "Verifies WAL replication lag from primary database to read-replicas remains below SLA limit.",
    targetService: "postgresql-replica-01",
    lastRunTimestamp: "2026-09-05 03:48 UTC",
    durationMs: 18,
    status: "PASSED",
    assertionsCount: 3,
  },
  // 3. Authentication Testing
  {
    id: "tc-auth-01",
    suite: "Authentication Testing",
    testName: "RBAC Role Permission Boundary Verification (Admin vs Operator vs Customer)",
    description: "Ensures operators cannot access /api/v1/admin/debugging and customers cannot access /api/v1/operator/finance.",
    targetService: "auth-rbac-service",
    lastRunTimestamp: "2026-09-05 03:46 UTC",
    durationMs: 62,
    status: "PASSED",
    assertionsCount: 18,
  },
  {
    id: "tc-auth-02",
    suite: "Authentication Testing",
    testName: "JWT Expired Token & Refresh Token Rotation",
    description: "Checks that expired JWT tokens return 401 Unauthorized and refresh token invalidates previous credentials.",
    targetService: "auth-rbac-service",
    lastRunTimestamp: "2026-09-05 03:46 UTC",
    durationMs: 38,
    status: "PASSED",
    assertionsCount: 5,
  },
  // 4. Booking Testing
  {
    id: "tc-book-01",
    suite: "Booking Testing",
    testName: "Multi-Modal Round Trip Booking (Vande Bharat Train + Houseboat Alleppey)",
    description: "Simulates composite itinerary reservation with synchronized cancellation policy handling.",
    targetService: "booking-orchestrator",
    lastRunTimestamp: "2026-09-05 03:44 UTC",
    durationMs: 210,
    status: "PASSED",
    assertionsCount: 12,
  },
  {
    id: "tc-book-02",
    suite: "Booking Testing",
    testName: "Tatkal Railway Booking Concurrency Stress (50 Concurrent Seat Requests)",
    description: "Simulates race condition on last 2 available Tatkal seats; exactly 2 confirm and 48 receive waitlist code.",
    targetService: "train-reservation-engine",
    lastRunTimestamp: "2026-09-05 03:44 UTC",
    durationMs: 312,
    status: "PASSED",
    assertionsCount: 7,
  },
  // 5. Payment Testing
  {
    id: "tc-pay-01",
    suite: "Payment Testing",
    testName: "Razorpay UPI Auto-Capture & Signature Verification Test",
    description: "Tests cryptographic HMAC-SHA256 signature calculation against mock webhook payload.",
    targetService: "payment-service",
    lastRunTimestamp: "2026-09-05 03:42 UTC",
    durationMs: 72,
    status: "PASSED",
    assertionsCount: 9,
  },
  {
    id: "tc-pay-02",
    suite: "Payment Testing",
    testName: "Automated Instant Refund to Source Account within 120s on Flight Cancellation",
    description: "Triggers partial cancellation refund and validates ledger debit and Razorpay refund API dispatch.",
    targetService: "payment-service",
    lastRunTimestamp: "2026-09-05 03:42 UTC",
    durationMs: 145,
    status: "PASSED",
    assertionsCount: 6,
  },
  // 6. Integration Testing
  {
    id: "tc-int-01",
    suite: "Integration Testing",
    testName: "Amadeus GDS Live Price Sync & Baggage Allowance Metadata",
    description: "Asserts live PNR generation through Amadeus enterprise endpoint.",
    targetService: "flight-gds-connector",
    lastRunTimestamp: "2026-09-05 03:40 UTC",
    durationMs: 198,
    status: "PASSED",
    assertionsCount: 11,
  },
  {
    id: "tc-int-02",
    suite: "Integration Testing",
    testName: "IRCTC NGeT Sandbox Live Availability Fallback",
    description: "Ensures mock cache responds within 80ms when upstream IRCTC throws 502 Bad Gateway.",
    targetService: "irctc-sync-worker",
    lastRunTimestamp: "2026-09-05 03:40 UTC",
    durationMs: 340,
    status: "FAILED",
    failureReason: "Upstream IRCTC responded with HTTP 502 Bad Gateway; circuit breaker opened.",
    assertionsCount: 8,
  },
  // 7. Security Testing
  {
    id: "tc-sec-01",
    suite: "Security Testing",
    testName: "SQL Injection & Parameterized Query Sanitation",
    description: "Fuzzes search and booking query parameters with SQL injection attack payloads.",
    targetService: "api-gateway",
    lastRunTimestamp: "2026-09-05 03:38 UTC",
    durationMs: 54,
    status: "PASSED",
    assertionsCount: 24,
  },
  {
    id: "tc-sec-02",
    suite: "Security Testing",
    testName: "Rate Limiter (100 Requests/min Per IP Address)",
    description: "Attempts 120 rapid queries in 10 seconds; validates HTTP 429 Too Many Requests response.",
    targetService: "api-gateway",
    lastRunTimestamp: "2026-09-05 03:38 UTC",
    durationMs: 88,
    status: "PASSED",
    assertionsCount: 4,
  },
  // 8. Performance Testing
  {
    id: "tc-perf-01",
    suite: "Performance Testing",
    testName: "High-Load Flight & Train Search (5,000 Simulated Users)",
    description: "Validates 95th percentile latency remains under 150ms during peak search traffic.",
    targetService: "search-cluster",
    lastRunTimestamp: "2026-09-05 03:35 UTC",
    durationMs: 1250,
    status: "PASSED",
    assertionsCount: 5,
  },
  // 9. Regression Testing
  {
    id: "tc-reg-01",
    suite: "Regression Testing",
    testName: "Full Regression Suite: Checkout, KYC Upload, GST Invoice Calculation",
    description: "Runs complete end-to-end regression across all travel categories.",
    targetService: "full-platform",
    lastRunTimestamp: "2026-09-05 03:30 UTC",
    durationMs: 3400,
    status: "PASSED",
    assertionsCount: 142,
  },
];

// ==========================================
// 6. BACKEND MAINTENANCE CONTROLS & HISTORY
// ==========================================
export const INITIAL_MAINTENANCE_HISTORY: MaintenanceActionHistory[] = [
  {
    id: "maint-101",
    action: "PostgreSQL Database VACUUM ANALYZE & Reindex",
    initiatedBy: "Admin: SRE Automation",
    timestamp: "2026-09-05 02:00:00 UTC",
    durationSec: 42,
    status: "COMPLETED",
    details: "Reclaimed 1.4 GB dead row storage across booking_events and pnr_logs tables.",
  },
  {
    id: "maint-102",
    action: "Redis Cluster Global Cache Purge (FLUSHDB selective keys)",
    initiatedBy: "Admin: Vikram (Lead DevOps)",
    timestamp: "2026-09-05 01:10:00 UTC",
    durationSec: 3,
    status: "COMPLETED",
    details: "Purged 42,000 stale fare search keys following Amadeus GDS price update.",
  },
  {
    id: "maint-103",
    action: "Rolling Pod Restart: payment-gateway-orchestrator",
    initiatedBy: "Admin: Priya (Payments Lead)",
    timestamp: "2026-09-04 23:45:00 UTC",
    durationSec: 28,
    status: "COMPLETED",
    details: "Zero-downtime rolling restart applied across 4 Kubernetes replicas.",
  },
  {
    id: "maint-104",
    action: "Scheduled Database Snapshot Backup: pg_dump_2026_09_05_0300.sql.gz",
    initiatedBy: "System: Cron Automation",
    timestamp: "2026-09-05 03:00:00 UTC",
    durationSec: 94,
    status: "COMPLETED",
    details: "Encrypted AES-256 snapshot saved to redundant cold vault (Size: 8.2 GB).",
  },
];

// ==========================================
// 7. SYSTEM MONITORING SNAPSHOT
// ==========================================
export const INITIAL_MONITORING_SNAPSHOT: SystemMonitoringSnapshot = {
  springBoot: {
    version: "3.3.2 (Java 21 LTS)",
    status: "UP",
    jvmHeapUsedMb: 1420,
    jvmHeapMaxMb: 4096,
    gcPauseTimeMs: 14,
    threadsActive: 128,
    uptimeHours: 342,
  },
  serverHost: {
    cpuUsagePercent: 28.4,
    ramUsedGb: 14.2,
    ramTotalGb: 32.0,
    diskUsedPercent: 48.2,
    networkRxMb: 48.2,
    networkTxMb: 64.8,
  },
  apiMetrics: {
    requestsPerSecond: 184,
    p50LatencyMs: 42,
    p95LatencyMs: 118,
    p99LatencyMs: 185,
    errorRatePercent: 0.04,
  },
};
