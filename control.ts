import { AutokirkOS } from "../os/AutokirkOS";
import { GitHubService } from "../services/GitHubService";
import { safeDiffSummary } from "../utils/diff";
import { guardPath } from "../services/protection";

const osEngine = new AutokirkOS();
const github = new GitHubService();

export interface ControlRequest {
  instruction: string;
  dryRun?: boolean;
  filePath?: string;
}

export interface ControlResult {
  targetFile: string;
  description: string;
  apply: boolean;
  diffPreview: string;
  commitSha?: string;
}

export async function handleControlRequest(body: any): Promise<ControlResult> {
  if (!body || typeof body.instruction !== "string") {
    throw new Error("Missing required field: instruction");
  }

  const request: ControlRequest = {
    instruction: body.instruction,
    dryRun: Boolean(body.dryRun),
    filePath: body.filePath,
  };

  const plan = osEngine.planChange(request.instruction, request.filePath);
  const targetFile = plan.targetFile;

  guardPath(targetFile);

  const existing = await github.getFile(targetFile);
  const proposed = osEngine.applyChange(existing.content, request.instruction, {
    filePath: targetFile,
    summary: plan.description,
  });

  const diffPreview = safeDiffSummary(existing.content, proposed);

  let commitSha: string | undefined;

  if (!request.dryRun) {
    const commit = await github.updateFile(
      targetFile,
      proposed,
      `[Autokirk Sovereign AI] ${plan.description}`,
      existing.sha
    );
    commitSha = commit.commitSha;
  }

  return {
    targetFile,
    description: plan.description,
    apply: !request.dryRun,
    diffPreview,
    commitSha,
  };
}
