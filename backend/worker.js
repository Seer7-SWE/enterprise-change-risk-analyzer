export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { method } = request;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // --- CORS preflight ---
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // --- Health check ---
    if (method === "GET" && url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "enterprise-change-risk-analyzer",
          uptime: Date.now()
        }),
        { headers: corsHeaders }
      );
    }

    // --- Analyze API ---
    if (method === "POST" && url.pathname === "/analyze") {
      try {
        const body = await request.json();

        
        return new Response(
          JSON.stringify({
            riskScore: 72,
            blastRadius: ["oracle-db", "ldap", "storage"]
          }),
          { headers: corsHeaders }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid JSON" }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    
    return new Response(
      JSON.stringify({ error: "Not Found" }),
      { status: 404, headers: corsHeaders }
    );
  }
};
