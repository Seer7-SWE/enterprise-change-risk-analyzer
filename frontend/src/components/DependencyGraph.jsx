import { useEffect, useRef } from "react";
import { Network } from "vis-network";

export default function DependencyGraph({ graph, blastRadius }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!graph) return;

    const nodes = [];
    const edges = [];

    Object.entries(graph).forEach(([node, deps]) => {
      nodes.push({ id: node, label: node });

      deps.forEach((dep) => {
        edges.push({ from: node, to: dep });
      });
    });

    const data = {
      nodes,
      edges
    };

    const options = {
      layout: {
        hierarchical: false
      },
      nodes: {
        shape: "dot",
        size: 14
      },
      edges: {
        arrows: "to"
      },
      physics: {
        enabled: true
      }
    };

    const network = new Network(containerRef.current, data, options);

    // Highlight blast radius
    blastRadius.forEach((nodeId) => {
      network.body.data.nodes.update({
        id: nodeId,
        color: { background: "#ef4444", border: "#b91c1c" }
      });
    });
  }, [graph, blastRadius]);

  return <div ref={containerRef} className="graph-container"></div>;
}
