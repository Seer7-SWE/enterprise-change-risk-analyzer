import { useState } from "react";
import {
  analyzeChange,
  submitCABDecision,
  runPostChangeAnalysis
} from "../api";

import RiskGauge from "../components/RiskGauge";
import BlastRadiusList from "../components/BlastRadiusList";
import Section from "../components/Section";
import RiskBreakdown from "../components/RiskBreakdown";
import DependencyGraph from "../components/DependencyGraph";
import AdvisoryPanel from "../components/AdvisoryPanel";
import CABPanel from "../components/CABPanel";
import PostChangePanel from "../components/PostChangePanel";
import DeployPanel from "../components/DeployPanel";
import RollbackPanel from "../components/RollbackPanel";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [postChangeResult, setPostChangeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postChangeLoading, setPostChangeLoading] = useState(false);

  /* ---------- Analyze Change ---------- */
  async function analyze() {
    setLoading(true);
    setPostChangeResult(null);
    const data = await analyzeChange();
    setResult(data);
    setLoading(false);
  }

  /* ---------- CAB Decision ---------- */
  async function updateCABStatus(decision) {
    if (!result?.cabWorkflow) return;

    // Persist CAB decision
    await submitCABDecision({
      cabId: result.cabWorkflow.cabId,
      decision: decision.status,
      role: "CAB Member"
    });

    // Update UI state
    // setResult(prev => ({
    //   ...prev,
    //   cabWorkflow: {
    //     ...prev.cabWorkflow,
    //     status: decision.status
    //   }
    // }));
    setResult(prev => ({
     ...prev,
     cabWorkflow: {
      ...prev.cabWorkflow,
      status: decision.status
    },
     deploymentStatus:
      decision.status === "APPROVED" ? "APPROVED" : "BLOCKED"
    }));

    // Trigger post-change analysis after approval
    if (decision.status === "APPROVED") {
      runPostChangeAnalysis();
    }
  }

  /* ---------- Post-change Analysis ---------- */
  async function runPostChangeAnalysis() {
    setPostChangeLoading(true);

    const analysis = await postChangeAnalysis({
      changeId: result.cabWorkflow.cabId,
      blastRadius: result.blastRadius
    });

    setPostChangeResult(analysis);
    setPostChangeLoading(false);
  }

  async function deployChange() {
   setResult(prev => ({
     ...prev,
     deploymentStatus: "DEPLOYED",
     deployedAt: new Date().toISOString()
   }));
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

      {/* ---------- Advisory ---------- */}
      {result?.advisories && (
        <AdvisoryPanel advisories={result.advisories} />
      )}

      {/* ---------- CAB Workflow ---------- */}
      {result?.cabWorkflow && (
        <Section>
          <CABPanel cab={result.cabWorkflow} onDecision={updateCABStatus} />

          {/* {result.cabWorkflow.status === "PENDING_APPROVAL" && (
  
          )} */}
        </Section>
      )}

         {result?.rollback && (
            <RollbackPanel rollback={result.rollback} />
         )}

       <Section>
          {result?.deploymentStatus === "APPROVED" && (
                  <DeployPanel onDeploy={deployChange} />
           )}
       </Section> 
       <Section>
      {result?.deploymentStatus === "DEPLOYED" && (
       <PostChangePanel result={result} />
      )}
      </Section>


      {/* ---------- Post Change Analysis ---------- */}
      {postChangeLoading && (
        <p className="note">Running post-change analysis...</p>
      )}

      {postChangeResult && (
        <Section title="Post-Change Impact Analysis">
          <PostChangePanel result={postChangeResult} />
        </Section>
      )}

      {/* ---------- Risk Data ---------- */}
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
