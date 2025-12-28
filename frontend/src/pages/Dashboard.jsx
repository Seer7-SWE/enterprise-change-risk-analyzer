import { useState } from "react";
import { analyzeChange } from "../api";
import RiskGauge from "../components/RiskGauge";
import BlastRadiusList from "../components/BlastRadiusList";
import Section from "../components/Section";
import RiskBreakdown from "../components/RiskBreakdown";
import DependencyGraph from "../components/DependencyGraph";
import AdvisoryPanel from "../components/AdvisoryPanel";


export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    const data = await analyzeChange();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Enterprise Change Risk Intelligence</h1>
        <p>Decision support for Change Advisory Boards</p>

        <button className="primary-btn" onClick={analyze}>
          {loading ? "Analyzing change..." : "Analyze Change"}
        </button>
      
      </header>
        {result?.advisories && (
            <AdvisoryPanel advisories={result.advisories} />
        )}

      {result && (
        <>
          <Section title="Risk Overview">
            <RiskGauge score={result.riskScore} />
          </Section>
          
          <Section title="Risk Explanation">
            <RiskBreakdown factors={result.riskFactors} />
          </Section>

          <Section title="Affected Services">
            <BlastRadiusList services={result.blastRadius} />
          </Section>
           
           <Section title="Dependency Graph">
            <DependencyGraph
              graph={result.dependencyGraph}
              blastRadius={result.blastRadius}
            />
           </Section>

        </>
      )}
    </div>
  );
}
