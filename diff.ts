import { diffLines } from "diff";

export function safeDiffSummary(before: string, after: string): string {
  const changes = diffLines(before, after);
  const summary: string[] = [];
  let added = 0;
  let removed = 0;

  for (const part of changes) {
    if (part.added) {
      added += part.count || 0;
    } else if (part.removed) {
      removed += part.count || 0;
    }
  }

  summary.push(`+${added} lines, -${removed} lines`);

  const previewChunks: string[] = [];
  for (const part of changes.slice(0, 20)) {
    if (part.added) {
      previewChunks.push(`+ ${part.value.trimEnd()}`);
    } else if (part.removed) {
      previewChunks.push(`- ${part.value.trimEnd()}`);
    }
  }

  if (previewChunks.length) {
    summary.push("");
    summary.push("Preview:");
    summary.push(...previewChunks);
  }

  return summary.join("\n");
}
