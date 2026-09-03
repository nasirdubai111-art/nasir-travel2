import { Router, Request, Response } from "express";
import { graphql } from "graphql";
import { schema, typeDefs } from "./schema";
import { rootResolvers } from "./resolvers";

export const graphqlRouter = Router();

// 1. Raw Schema SDL inspection
graphqlRouter.get("/schema", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(typeDefs);
});

// 2. Main GraphQL execution handler (POST /graphql)
graphqlRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { query, variables, operationName } = req.body || {};

    if (!query) {
      return res.status(400).json({
        errors: [{ message: "GraphQL request must include a 'query' string in request body." }],
      });
    }

    const response = await graphql({
      schema,
      source: query,
      rootValue: rootResolvers,
      variableValues: variables,
      operationName,
    });

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      errors: [{ message: error.message || "Internal GraphQL Server Error" }],
    });
  }
});

// 3. Interactive Web GraphQL Explorer & Documentation GUI (GET /graphql)
graphqlRouter.get("/", (req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Enterprise GraphQL API Explorer (Amplify & AppSync Compatible)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-pink-500/30">
          GQL
        </div>
        <div>
          <h1 class="text-xl font-extrabold text-white flex items-center gap-2">
            Enterprise GraphQL Gateway
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE / 200 OK</span>
          </h1>
          <p class="text-xs text-slate-400">AWS Amplify AppSync Schema & Resolver Engine ready</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <a href="/graphql/schema" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition">
          View SDL Schema
        </a>
      </div>
    </header>

    <!-- Quick Query Selector -->
    <div class="flex flex-wrap gap-2 items-center text-xs">
      <span class="text-slate-400 font-semibold">Quick Queries:</span>
      <button onclick="loadSample('flights')" class="px-3 py-1 rounded-md bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 transition">Flights & Hotels</button>
      <button onclick="loadSample('trains')" class="px-3 py-1 rounded-md bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 transition">Vande Bharat Trains</button>
      <button onclick="loadSample('profile')" class="px-3 py-1 rounded-md bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 transition">User Profile & Bookings</button>
      <button onclick="loadSample('aiItinerary')" class="px-3 py-1 rounded-md bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 transition">AI Itinerary & Price Trends</button>
      <button onclick="loadSample('mutation')" class="px-3 py-1 rounded-md bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 transition">Mutation: Top Up Wallet</button>
    </div>

    <!-- Playground Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Query Editor Box -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold uppercase tracking-wider text-pink-400">GraphQL Request (Query / Mutation)</label>
          <button id="runBtn" onclick="runQuery()" class="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Execute (Ctrl + Enter)
          </button>
        </div>
        <textarea id="queryInput" rows="18" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-pink-300 focus:outline-none focus:border-pink-500 leading-relaxed resize-none"></textarea>
      </div>

      <!-- Response Box -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold uppercase tracking-wider text-emerald-400">Execution Result (JSON Output)</label>
          <span id="timingBadge" class="text-[11px] text-slate-500">Ready</span>
        </div>
        <pre id="resultOutput" class="w-full h-[400px] overflow-auto bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-300 leading-relaxed"></pre>
      </div>
    </div>

    <!-- AWS Amplify Integration Card -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        AWS Amplify / AppSync Client Integration Snippet
      </h3>
      <pre class="bg-slate-950 p-4 rounded-xl text-xs text-amber-200 border border-slate-800/80 overflow-x-auto">
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const searchFlightsQuery = /* GraphQL */ \`
  query SearchFlights($from: String, $to: String) {
    flights(from: $from, to: $to) {
      id
      airline
      flightNumber
      from
      to
      price
      seatsAvailable
    }
  }
\`;

const response = await client.graphql({
  query: searchFlightsQuery,
  variables: { from: "Delhi", to: "Mumbai" }
});
console.log(response.data.flights);
      </pre>
    </div>
  </div>

  <script>
    const samples = {
      flights: \`query GetFlightsAndHotels {
  health
  flights(from: "Delhi", to: "Mumbai", limit: 3) {
    id
    airline
    flightNumber
    from
    to
    price
    seatsAvailable
  }
  hotels(city: "New Delhi", limit: 2) {
    id
    name
    city
    starRating
    pricePerNight
    rating
  }
}\`,
      trains: \`query SearchVandeBharatTrains {
  trains(fromStation: "Delhi", toStation: "Varanasi") {
    id
    trainNumber
    trainName
    fromStation
    toStation
    departureTime
    arrivalTime
    price
    availabilityStatus
  }
  buses(origin: "Delhi", destination: "Manali") {
    id
    operatorName
    busType
    fare
    seatsAvailable
  }
}\`,
      profile: \`query GetUserProfileAndBookings {
  userProfile {
    id
    name
    email
    walletBalance
    yatraCoins
    tier
    recentSearches
  }
  myBookings {
    id
    title
    amount
    status
    pnr
    ticketNumber
  }
}\`,
      aiItinerary: \`query GenerateAIPlan {
  predictPriceTrend(route: "Delhi to Goa", category: FLIGHTS) {
    route
    currentPrice
    predictedPrice7Days
    recommendation
    confidenceScore
    bestTimeToBook
  }
  generateAiItinerary(destination: "Varanasi", days: 3, budgetInr: 12000) {
    destination
    durationDays
    estimatedBudget
    dayWisePlan {
      day
      title
      activities
      recommendedDining
    }
    smartTips
  }
}\`,
      mutation: \`mutation TopUpWallet {
  addMoneyToWallet(userId: "usr_cust_001", amount: 2500) {
    success
    newBalance
    transactionId
    message
  }
}\`
    };

    function loadSample(key) {
      document.getElementById('queryInput').value = samples[key] || '';
      runQuery();
    }

    async function runQuery() {
      const query = document.getElementById('queryInput').value;
      const timingBadge = document.getElementById('timingBadge');
      const resultOutput = document.getElementById('resultOutput');
      
      timingBadge.innerText = 'Executing...';
      const start = performance.now();

      try {
        const res = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        const duration = Math.round(performance.now() - start);
        timingBadge.innerText = \`Done in \${duration}ms (\${res.status} \${res.statusText})\`;
        resultOutput.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        timingBadge.innerText = 'Failed';
        resultOutput.innerText = JSON.stringify({ error: err.message }, null, 2);
      }
    }

    // Keyboard shortcut (Ctrl+Enter / Cmd+Enter)
    document.getElementById('queryInput').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        runQuery();
      }
    });

    // Initial load
    loadSample('flights');
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});
