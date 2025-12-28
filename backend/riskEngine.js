export function calculateRisk(blastRadius, metadata) {
  let score = 0;

  score += blastRadius.length * 5;
  score += metadata.criticality === "high" ? 30 : 10;
  score += metadata.peak ? 20 : 5;

  return Math.min(score, 100);
}
