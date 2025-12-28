
function createAdvisories(riskScore, service) {
  if (riskScore < 70) return null;

  return {
    serviceNow: {
      changeId: "CHG" + Math.floor(Math.random() * 90000),
      priority: "High",
      state: "Awaiting CAB Approval",
      type: "Emergency Change",
      description: `High-risk change detected for ${service}`,
      url: "https://servicenow.example.com/change"
    },
    jira: {
      issueKey: "RISK-" + Math.floor(Math.random() * 900),
      project: "ITOPS",
      severity: "Critical",
      status: "To Do",
      summary: `Mitigate risk for ${service} change`,
      url: "https://jira.example.com/browse/RISK"
    }
  };
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { method } = request;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // tighten in production
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    
    if (method === "GET" && url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "enterprise-change-risk-analyzer",
          timestamp: Date.now()
        }),
        { headers: corsHeaders }
      );
    }

    
    if (method === "POST" && url.pathname === "/analyze") {
      try {
        const body = await request.json();

        /* ---- Input validation ---- */
        if (!body || typeof body.service !== "string") {
          return new Response(
            JSON.stringify({
              error: "Invalid payload. 'service' must be a string."
            }),
            { status: 400, headers: corsHeaders }
          );
        }

        const service = body.service;

        
        const dependencyGraph = {
          "auth-service": ["oracle-db", "ldap"],
          "oracle-db": ["storage"],
          "ldap": [],
          "storage": []
        };

        const blastRadius = dependencyGraph[service] || [];

        
        let riskScore = 50;
        riskScore += blastRadius.length * 10;

        if (blastRadius.length > 1) riskScore += 12;
        if (service === "auth-service") riskScore += 10;

        if (riskScore > 100) riskScore = 100;

        
        const advisories = createAdvisories(riskScore, service);

        
        return new Response(
          JSON.stringify({
            service,
            riskScore,
            blastRadius,
            dependencyGraph,
            advisories,
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
            ],
            generatedAt: Date.now()
          }),
          { headers: corsHeaders }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: "Invalid JSON or request body"
          }),
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
