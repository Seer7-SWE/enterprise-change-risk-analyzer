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

         // Defensive defaults (IMPORTANT)
        const service = body.service || "auth-service";

        // MOCK dependency graph (until Firebase logic is stable)
        const dependencyGraph = {
          "auth-service": ["oracle-db", "ldap"],
          "oracle-db": ["storage"],
          "ldap": [],
          "storage": []
        };

       const blastRadius = dependencyGraph[service] || [];

         return new Response(
          JSON.stringify({
           riskScore: 72,
           blastRadius,
           dependencyGraph,
           riskFactors: [
           {
             title: "Critical Service Impacted",
             impact: "+25",
             reason:
              "The selected service supports authentication for multiple downstream systems."
           },
           {
             title: "Peak Traffic Window",
             impact: "+20",
             reason:
              "The change is scheduled during high user activity hours."
           },
           {
             title: "Multiple Downstream Dependencies",
             impact: "+18",
             reason:
              "Failure may cascade to database, directory, and storage services."
           },
           {
             title: "Rollback Plan Missing",
             impact: "+9",
             reason:
              "No rollback strategy was provided for this change."
           }
         ]
       }),
       { headers: corsHeaders }
     );
    } catch (err) {
     return new Response(
       JSON.stringify({ error: "Invalid analyze payload" }),
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
