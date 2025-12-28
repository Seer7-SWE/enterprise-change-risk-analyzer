export function detectConflicts(change, scheduledChanges) {
  return scheduledChanges.filter(c =>
    c.window.start < change.window.end &&
    c.window.end > change.window.start &&
    c.sharedDependency
  );
}
