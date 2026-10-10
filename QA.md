# SupportLab verification report

Free browser AI edition · 11 October 2026.

## Passed

- **186 core DOM/state checks:** all 12 original sections, six lessons, 18 practice questions, all ten lab/case outcomes, retained incorrect-answer feedback, explicit resolution and escalation, communication self-review, operations decisions, recall scheduling, knowledge-base filtering, backups, storage persistence, migration and reset.
- **56 free AI/controller/interface checks:** five coaching tasks, input limits, apparent-credential rejection, bounded reference excerpts, explicit model loading, device-support guidance, FP16/FP32 selection, progress callbacks, recoverable load failures, cancellation and unload, streamed and partial answers, fresh model conversations, separate mode drafts, escaped replies, locked controls and preservation of training state. These tests use a simulated inference engine; they do not test real model output.
- **18 local HTTP checks:** approved page and AI assets serve successfully, module MIME types are correct, credential and source files are not served, the removed paid endpoint is absent, unexpected Host headers are rejected and write requests are refused.
- **Model artifact checks:** both configured Qwen variants exist in WebLLM 0.2.85. Their public model configuration and WebGPU library URLs returned HTTP 200. Model weights were not downloaded during testing.
- JavaScript syntax checks passed for the coach interface and controller.
- The complete Vinext production build passed all five stages. The app route is `/`; the paid `/api/coach` route has been removed.

## Remaining verification

The embedded browser could not reach the local preview. Real browser rendering, narrow layouts, keyboard focus and real WebGPU model generation remain unverified. GPU support, answer quality, generation speed, first-load download behavior and fully offline AI operation require a compatible device and browser.

## Browser acceptance steps

1. Run Start SupportLab.cmd, keep the window open and visit http://127.0.0.1:4173 in current Chrome or Edge.
2. Open all 13 sections. Check the menu at narrow width, keyboard focus and 200% zoom; confirm there is no unintended horizontal page overflow.
3. Complete an API lesson and case, record a communication self-review, and download and restore a progress backup.
4. Open AI coach, inspect first-use download information and click Load free AI. Verify progress, cancel/retry and the ready state.
5. Ask a fictional explanation question; confirm streamed text. Stop another answer, change tasks and confirm each draft stays in its own task.
6. Use an AI hint from a case and writing feedback from Communication. Confirm the context matches the task and scores and case outcomes are unchanged.
7. Unload the model and reload it. Check browser cache reuse and recoverable errors when network or device resources are unavailable.

## Publication status

The registered Sites project is owner-private and has no published version or live URL. Earlier automatic approval rejected the hosting credential input needed for source upload under the execution policy. Publication remains blocked; no live deployment is claimed.

The deliverable archive excludes credentials, dependency installations, runtime caches, generated server output and model weights. Archive integrity and absence of the previously configured credential are checked during packaging.
