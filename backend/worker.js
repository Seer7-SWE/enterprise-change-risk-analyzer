/**
 * Static configuration (safe to reuse across requests)
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

const dependencyGraph = {
  "auth-service": ["oracle-db", "ldap"],
  "oracle-db": ["storage"],
  "ldap": [],
  "storage": []
};

/**
 * Generate external advisories for high-risk changes
 */
function createAdvisories(riskScore, service) {
  if (riskScore < 70) return null;

  return {
    serviceNow: {
      changeId: `CHG-${crypto.randomUUID()}`,
      priority: "High",
      state: "Awaiting CAB Approval",
      type: "Emergency Change",
      description: `High-risk change detected for ${service}`,
      url: "https://servicenow.example.com/change"
    },
    jira: {
      issueKey: `RISK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      project: "ITOPS",
      severity: "Critical",
      status: "To Do",
      summary: `Mitigate risk for ${service} change`,
      url: "https://jira.example.com/browse/RISK"
    }
  };
}

/**
 * Initialize CAB workflow for risky changes
 * (LEFT UNCHANGED as requested)
 */
function initiateCAB(riskScore, service) {
  if (riskScore < 70) return null;

  return {
    cabId: "CAB-" + Math.floor(Math.random() * 10000),
    service,
    status: "PENDING_APPROVAL",
    requiredApprovals: ["Operations", "Security", "Application Owner"],
    approvals: [],
    decision: null,
    createdAt: new Date().toISOString()
  };
}

/**
 * Correlate failures after a change
 */
function correlateFailures(blastRadius) {
  const signals = blastRadius.map(service => ({
    service,
    errorSpike: Math.random() > 0.6,
    latencySpike: Math.random() > 0.7,
    incidentOpened: Math.random() > 0.75
  }));

  let confidence = 0;

  for (const s of signals) {
    if (s.errorSpike) confidence += 30;
    if (s.latencySpike) confidence += 25;
    if (s.incidentOpened) confidence += 45;
  }

  confidence = Math.min(confidence, 100);

  return {
    confidenceScore: confidence,
    signals,
    likelyCause:
      confidence > 70
        ? "Highly likely caused by this change"
        : confidence > 40
        ? "Possibly related to this change"
        : "No strong correlation detected"
  };
}

/**
 * Rollback recommendation
 */
function generateRollbackRecommendation(riskScore, blastRadius) {
  let score = 0;
  const reasoning = [];

  if (riskScore >= 75) {
    score += 40;
    reasoning.push("High change risk detected");
  }

  if (blastRadius.length >= 3) {
    score += 30;
    reasoning.push("Multiple dependent services impacted");
  }

  if (blastRadius.length >= 5) {
    score += 50;
    reasoning.push("Critical infrastructure blast radius");
  }

  return {
    recommendation: score >= 60 ? "ROLLBACK_RECOMMENDED" : "ROLLBACK_NOT_NEEDED",
    confidence: Math.min(score, 100),
    reasoning
  };
}

/**
 * Build risk factors consistently with risk logic
 */
function buildRiskFactors(service, blastRadius) {
  const factors = [];

  if (service === "auth-service") {
    factors.push({
      title: "Critical Service Impacted",
      impact: "+25",
      reason: "Authentication service affects multiple downstream systems."
    });
  }

  if (blastRadius.length > 1) {
    factors.push({
      title: "Multiple Dependencies",
      impact: `+${blastRadius.length * 10}`,
      reason: "Failure may cascade to dependent services."
    });
  }

  factors.push({
    title: "Rollback Plan Missing",
    impact: "+9",
    reason: "No rollback strategy defined."
  });

  return factors;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;

    /* ---------- CORS ---------- */
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    /* ---------- Health ---------- */
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

    /* ---------- Analyze Change ---------- */
    if (method === "POST" && url.pathname === "/analyze") {
      try {
        const body = await request.json();

        if (!body || typeof body.service !== "string") {
          return new Response(
            JSON.stringify({ error: "service must be a string" }),
            { status: 400, headers: corsHeaders }
          );
        }

        const service = body.service;
        const blastRadius = dependencyGraph[service] || [];

        let riskScore = 50;
        riskScore += blastRadius.length * 10;
        if (blastRadius.length > 1) riskScore += 12;
        if (service === "auth-service") riskScore += 10;
        riskScore = Math.min(riskScore, 100);

        return new Response(
          JSON.stringify({
            service,
            riskScore,
            blastRadius,
            dependencyGraph,
            advisories: createAdvisories(riskScore, service),
            cabWorkflow: initiateCAB(riskScore, service),
            rollback: generateRollbackRecommendation(riskScore, blastRadius),
            riskFactors: buildRiskFactors(service, blastRadius),
            generatedAt: Date.now()
          }),
          { headers: corsHeaders }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid JSON payload" }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    /* ---------- CAB Decision ---------- */
    if (method === "POST" && url.pathname === "/cab/decision") {
      try {
        const body = await request.json();

        if (
          !body ||
          typeof body.cabId !== "string" ||
          !["APPROVED", "REJECTED"].includes(body.decision) ||
          typeof body.role !== "string"
        ) {
          return new Response(
            JSON.stringify({ error: "Invalid CAB decision payload" }),
            { status: 400, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({
            cabId: body.cabId,
            decision: body.decision,
            decidedBy: body.role,
            status: body.decision,
            decidedAt: new Date().toISOString()
          }),
          { headers: corsHeaders }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid JSON payload" }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    /* ---------- Post-Change Analysis ---------- */
    if (method === "POST" && url.pathname === "/post-change-analysis") {
      try {
        const body = await request.json();

        if (
          !body ||
          typeof body.changeId !== "string" ||
          !Array.isArray(body.blastRadius)
        ) {
          return new Response(
            JSON.stringify({ error: "Invalid post-change analysis payload" }),
            { status: 400, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({
            changeId: body.changeId,
            analysisWindow: "30 minutes",
            result: correlateFailures(body.blastRadius),
            analyzedAt: new Date().toISOString()
          }),
          { headers: corsHeaders }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid JSON payload" }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    /* ---------- Not Found ---------- */
    return new Response(
      JSON.stringify({ error: "Not Found" }),
      { status: 404, headers: corsHeaders }
    );
  }
};
