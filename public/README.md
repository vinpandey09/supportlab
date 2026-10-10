# SupportLab — Technical Support Workspace

A personal training website built from the supplied Part 7 source and project dossier. All cases and evidence are fictional. The AI coach now uses an open-source model on your device, with no paid inference API.

## Open the website

For lessons, practice, cases and progress tracking, double-click `index.html`. The core tools work without an account or model download.

For free AI on Windows:

1. Extract the whole ZIP and open the `supportlab` folder.
2. Double-click **Start SupportLab.cmd**. It uses Node.js already installed with Codex, or a normal Node.js 22+ installation.
3. Keep the launcher window open and visit **http://127.0.0.1:4173** in current Chrome or Edge.
4. Open **AI coach → Load free AI**. The first load downloads about 1 GB of public model files; later loads can reuse browser-cached files.
5. When the model is ready, choose a task, write your question and select **Ask AI coach**.

The local launcher serves only approved website assets, binds to this computer's loopback address and reads no API key. Close the launcher to stop the local website. It cannot be reached from another computer.

## Free AI and device requirements

- Runtime: **WebLLM 0.2.85**, Apache 2.0.
- Model: **Qwen2.5-1.5B-Instruct**, Apache 2.0, quantized for WebGPU. The browser selects an FP16 or FP32 variant according to device support.
- No API key, API credits or per-answer charge is required. Computation uses your device's graphics hardware and electricity; file downloads use your internet connection.
- Use WebGPU in a compatible browser on HTTPS or localhost. Allow roughly 2 GB of available graphics memory and about 1 GB for cached model files. Speed and compatibility depend on the device.
- Downloading requires access to Hugging Face and GitHub. Those hosts receive ordinary file-download requests. Questions, training context, matching knowledge-base excerpts and replies are processed locally.
- The model loads only after an explicit click. Loading progress, cancellation, unload, streamed answers and recoverable errors are provided. Drafts are kept separately for each task during the page session.
- AI offers explanations, evidence-based hints, writing feedback, study plans and new fictional scenarios. It cannot change learning scores or resolve a case. Its guidance can be wrong and should be checked against the evidence.
- Model files can remain cached after **Unload AI**. Cache reuse reduces downloads; AI operation while fully offline has not been verified. Core training works offline.

See `THIRD_PARTY_NOTICES.md` and the supplied runtime licenses. Model weights are downloaded on demand and are not in this ZIP.

## What works

Overview, six lessons with recall checks, 18 practice questions, five diagnostic labs, five full case simulations, six communication tasks, six operations decisions, ten spaced-recall cards, six searchable knowledge articles, reference guides, progress backups and the project story. A free AI coach is linked from cases, communication and progress.

Case resolution requires verification; the performance scenario ends in an evidence-based escalation with recovery unconfirmed. Writing completion is a guided self-review rather than an AI score.

## Progress and privacy

Progress uses `supportlab.workspace.v3` in browser localStorage. Existing Part 7 progress is migrated where available at the same browser origin. Progress belongs to the browser and website address; moving from a direct file to localhost or a hosted website does not move it automatically. Use **Progress → Download backup → Restore backup** to transfer it.

Drafts and coaching replies are session-only unless you download them. There is no cloud progress synchronization, live CRM or real customer-data integration. Use fictional examples.

## Ongoing updates with GitHub

The private repository is [vinpandey09/supportlab](https://github.com/vinpandey09/supportlab). Run `npm test` to execute the 260 portable checks. A GitHub Actions workflow runs tests and the production build for pull requests and updates to `main`; it does not publish a public website. See `CONTRIBUTING.md` for the update and rollback process.

After cloning, run `npm ci` and `npm run build` to generate the browser runtime before using the local launcher. Downloadable ZIP editions already include that runtime.

## Source and build details

`index.html`, `style.css`, `data.js` and `app.js` provide the core workspace. `ai.js` provides the coach interface, `browser-ai.mjs` manages the worker and local generation, and `coach-prompts.mjs` bounds requests and selects relevant references. `ai-worker.mjs` loads the bundled runtime from `vendor/`.

The retained Vinext project supports private Sites hosting. Install dependencies using the Sites dependency helper, or `npm ci` in a normal Node.js environment. `npm run build` bundles WebLLM, synchronizes the website assets and builds the hosting artifact. `npm run preview:local` starts the simple local website without loading credentials. The package includes the generated browser runtime so the local launcher needs no dependency installation.

The previous OpenAI API endpoint has been removed. The previously created local credential is unused and excluded from all deliverable archives. It may be revoked in OpenAI Platform if no longer needed.

## Hosting and verification status

The existing SupportLab Sites project is configured for owner-only access. It has no published version or live URL yet. Source upload and private publication remain blocked by the execution approval policy; changing the AI provider does not remove that hosting blocker. Local preview access also failed from the embedded browser.

See `QA.md` for automated coverage and the remaining real-browser checks. Automated model tests use a simulated engine; they do not establish response quality or GPU compatibility. This is an educational and portfolio website; workplace actions must follow approved product procedures.

Version: free browser AI edition · 11 October 2026.
