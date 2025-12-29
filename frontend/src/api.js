
export async function submitCABDecision(payload) {
  const res = await fetch(
    "https://enterprise-change-risk-analyzer.selvamanithangaraj84.workers.dev/cab/decision",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) throw new Error("CAB decision failed");
  return res.json();
}

export async function runPostChangeAnalysis(payload) {
  const res = await fetch(
    "https://enterprise-change-risk-analyzer.selvamanithangaraj84.workers.dev/post-change-analysis",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) throw new Error("Post-change analysis failed");
  return res.json();
}



export async function analyzeChange() {
  const res = await fetch(
    "https://enterprise-change-risk-analyzer.selvamanithangaraj84.workers.dev/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service: "auth-service",
        metadata: { criticality: "high", peak: true }
      })
    }
  );

  if (!res.ok) {
    throw new Error("Analyze request failed");
  }

  return res.json();
}
