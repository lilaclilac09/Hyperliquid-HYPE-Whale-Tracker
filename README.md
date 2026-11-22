<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This is a local dashboard simulation: price movements and alert data are
generated in the browser, not fetched from HyperEVM or QuickNode. No mainnet
connection or webhook latency is measured. See the
[acceptance audit](notes/acceptance-audit-2026-11-23.md).

View your app in AI Studio: https://ai.studio/apps/drive/1avGwzAGI8tK_ZCG9uWAZ1M_uxG7lRzdT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app (no Gemini API key is required; the AI feature was removed):
   `npm run dev`

Build with `npm run build`; typecheck with `npx tsc --noEmit`.

Status: LOCAL ONLY — Next human action: choose a hosting target and deploy the simulation before claiming a live product.
