export function calculateBlastRadius(startNode, graph) {
  const visited = new Set();
  const queue = [startNode];

  while (queue.length) {
    const node = queue.shift();
    if (!visited.has(node)) {
      visited.add(node);
      const deps = graph[node]?.depends_on || [];
      deps.forEach(d => queue.push(d));
    }
  }
  return [...visited];
}
