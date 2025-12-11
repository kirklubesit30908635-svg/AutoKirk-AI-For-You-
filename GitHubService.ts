import fetch from "node-fetch";

export interface GitHubFile {
  path: string;
  content: string;
  sha: string;
}

export interface GitHubCommitResult {
  path: string;
  commitSha: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

export class GitHubService {
  private owner: string;
  private repo: string;
  private branch: string;
  private token: string;

  constructor() {
    this.owner = requiredEnv("GITHUB_OWNER");
    this.repo = requiredEnv("GITHUB_REPO");
    this.branch = process.env.GITHUB_BRANCH || "main";
    this.token = requiredEnv("GITHUB_TOKEN");
  }

  private api(path: string, init: any = {}): Promise<any> {
    const url = `https://api.github.com${path}`;
    const headers = {
      "Accept": "application/vnd.github+json",
      "User-Agent": "autokirk-sovereign-ai-1",
      "Authorization": `Bearer ${this.token}`,
      ...init.headers,
    };

    return fetch(url, { ...init, headers }).then(async (res: any) => {
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`GitHub API ${res.status} ${res.statusText}: ${text}`);
      }
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    });
  }

  async getFile(path: string): Promise<GitHubFile> {
    const data = await this.api(
      `/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(path)}?ref=${this.branch}`
    );

    const decoded = Buffer.from(data.content, "base64").toString("utf8");
    return {
      path,
      content: decoded,
      sha: data.sha,
    };
  }

  async updateFile(
    path: string,
    newContent: string,
    message: string,
    sha: string
  ): Promise<GitHubCommitResult> {
    const body = {
      message,
      content: Buffer.from(newContent, "utf8").toString("base64"),
      sha,
      branch: this.branch,
    };

    const data = await this.api(
      `/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return {
      path,
      commitSha: data.commit.sha,
    };
  }
}
