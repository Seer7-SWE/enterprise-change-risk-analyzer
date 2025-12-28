// export async function analyzeChange(payload) {
//   const res = await fetch("https://enterprise-change-risk-analyzer.selvamanithangaraj84.workers.dev/analyze", {
//     method: "POST",
//     body: JSON.stringify(payload)
//   });
//   return res.json();
// }

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
