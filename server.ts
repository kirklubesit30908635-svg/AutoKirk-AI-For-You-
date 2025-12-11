import express from "express";
import cors from "cors";
import { json } from "express";
import { handleControlRequest } from "./api/control";

const app = express();
app.use(cors());
app.use(json());

const PORT = process.env.PORT || 10000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "autokirk-sovereign-ai-1" });
});

app.post("/control", async (req, res) => {
  try {
    const result = await handleControlRequest(req.body);
    res.json({ ok: true, result });
  } catch (err: any) {
    console.error("[/control] error", err);
    res.status(500).json({
      ok: false,
      error: err?.message || "Unhandled error in control pipeline",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Autokirk Sovereign AI] listening on port ${PORT}`);
});
