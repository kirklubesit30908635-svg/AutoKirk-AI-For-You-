export interface Plan {
  targetFile: string;
  description: string;
}

export interface ChangeContext {
  filePath: string;
  summary?: string;
}

/**
 * Minimal OS layer.
 * In v1 this is intentionally simple and deterministic.
 * Later you can plug in real model reasoning here.
 */
export class AutokirkOS {
  planChange(instruction: string, explicitPath?: string): Plan {
    const normalized = instruction.toLowerCase();

    if (explicitPath) {
      return {
        targetFile: explicitPath,
        description: `Apply change to ${explicitPath}: ${instruction}`,
      };
    }

    if (normalized.includes("readme")) {
      return {
        targetFile: "README.md",
        description: `Update README based on: ${instruction}`,
      };
    }

    if (normalized.includes("landing") || normalized.includes("homepage")) {
      return {
        targetFile: "index.html",
        description: `Update landing UI based on: ${instruction}`,
      };
    }

    return {
      targetFile: "README.md",
      description: `General repo update: ${instruction}`,
    };
  }

  applyChange(existing: string, instruction: string, ctx: ChangeContext): string {
    const banner = [
      "<!--",
      "  Autokirk Sovereign AI – applied change",
      `  File: ${ctx.filePath}`,
      `  Summary: ${ctx.summary ?? instruction}`,
      `  Timestamp: ${new Date().toISOString()}`,
      "-->",
      "",
    ].join("\n");

    if (!existing.trim()) {
      return `${banner}\n${instruction}\n`;
    }

    // For v1 we append a banner + instruction at the end of the file.
    return `${existing.trim()}\n\n${banner}\n${instruction}\n`;
  }
}
