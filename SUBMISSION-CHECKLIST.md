# Sahaay submission checklist

Source checked: https://buildwhatmovesindia.com/brief
Checked on: 2026-08-21

## Status summary

- Prototype readiness: ready for local evaluator walkthrough, with headless browser smoke QA passed.
- Public link readiness: ready on GitHub Pages: `https://missionode.github.io/sahaay/`.
- Submission package readiness: not ready until the under-2-minute video is complete.

## Brief checklist

| Brief requirement | Current status | Notes |
| --- | --- | --- |
| Pick one real Indian public-service problem | Pass | Emergency-response reporting and handoff around current call-first workflows is clearly scoped. |
| Built with Codex/OpenAI meaningfully | Pass | Project was built through Codex with CLI-driven iteration, local static validation and headless Playwright QA. |
| Complete main journey from start to finish | Pass locally | `simulation.html` shows report → dispatcher triage → Code Blue check → fire/police/EMS → no-injury closure. Headless Playwright passed the main controls and view checks. |
| Easier to understand/use than current experience | Pass | One-tap report, live bridge, guided camera, structured dispatch, closure thread. |
| Designed for Indian users, mobile and limited digital experience | Pass | Mobile-first role views, one-tap reporting, human call bridge, simple prompts and voice/SMS/low-network fallback are explained. |
| Mock/synthetic data clearly identified | Pass | Landing, simulation and role views disclose synthetic/demo-only behavior. |
| Make obvious who faces problem and what changed | Pass | Landing explains first reporter/person in distress plus dispatcher/response handoff. |
| Explain what works today vs mocked | Pass | Prototype honesty section exists. |
| Explain how it can work safely at scale | Pass | Landing page now includes a visible safe-scale model; `SAFE-SCALE-NOTES.md` covers backend, consent, retention, escalation, audit, integration boundaries and human oversight. |
| Do not access/interfere with live government systems | Pass | No live 108/112/government integrations are used. |
| Do not use real sensitive data | Pass | Synthetic identities, locations, units, media and timeline. |
| Do not present as official government product | Pass | Site says independent prototype, not official service. |
| Live public browser link without access request | Pass | GitHub Pages is enabled at `https://missionode.github.io/sahaay/`. Public URL returned HTTP 200 after build. |
| Mock login credentials if needed | Pass | `demo-login.html` has reporter, dispatcher and response-unit demo accounts. |
| One video no longer than two minutes | Pending/blocker | Need final recording: first minute citizen/demo, second minute build rationale. |
| Project summary under 250 words | Pass | Final summary is saved in `SUBMISSION-SUMMARY.md` for the submission form and now mentions Codex CLI/headless QA usage. |
| Every link works without requesting access | Partial | Local links and the core browser journey pass headless checks. Public link must be created and checked after deployment. |

## Recommended next order

1. Record the under-2-minute submission video.
2. Final pass on the public link: all links, favicon, assets, mobile viewport, demo credentials, mocked-data disclosures and simulation playback.

## Headless QA evidence

- Command used: `NODE_PATH=/private/tmp/sahaay-pw.94588v/node_modules node qa/sahaay-headless-check.js`
- Result: `HEADLESS_PLAYWRIGHT_QA_PASS`
- Coverage: landing logo/favicon/CTA/hero/safe-scale section, simulation start/pause/step/exit, role gateway branding, dispatcher view, response-unit handoff closure, route-map asset and 390px mobile overflow.
