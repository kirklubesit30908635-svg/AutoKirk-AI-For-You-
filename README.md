# Autokirk Sovereign AI Layer v1

This service is a hardened, minimal Autokirk control engine.

It exposes a single HTTP API that takes a natural‑language instruction,
plans a repo change, generates a patched file, and (optionally) commits
it back to GitHub.

The goal: give you a **sovereign, AI‑driven repo operator** that Render can
host 24/7 as the backbone for your broader Autokirk ecosystem.

## Stack

- Node 18+
- TypeScript
- Express
- GitHub Contents API
- Opinionated safety guardrail on which files can be touched

## API

### POST /control

Body:

```json
{
  "instruction": "Update the README to describe the Autokirk Sovereign AI layer.",
  "dryRun": true,
  "filePath": "README.md"
}
```

- `instruction` (required) – natural‑language command.
- `dryRun` (optional, default: false) – if true, compute the change and diff
  but do **not** push a commit.
- `filePath` (optional) – explicit file to target. If omitted, the OS layer
  will pick a file based on the instruction (README, index.html, etc).

Response:

```json
{
  "ok": true,
  "result": {
    "targetFile": "README.md",
    "description": "Apply change to README.md: ...",
    "apply": false,
    "diffPreview": "+10 lines, -0 lines\nPreview: ...",
    "commitSha": null
  }
}
```

## Environment

Set these on Render (or locally via a `.env` file):

- `GITHUB_OWNER` – your GitHub username or org (e.g. `kirklubesit30908635-svg`)
- `GITHUB_REPO` – the repository this service is allowed to edit
- `GITHUB_BRANCH` – branch name (default: `main`)
- `GITHUB_TOKEN` – personal access token with `repo` scope

## Run locally

```bash
npm install
npm run dev
```

The server will start on `http://localhost:10000`.

## Deploy to Render

- Root: repository root (do **not** set a custom root directory).
- Build command: `npm install && npm run build`
- Start command: `npm start`
