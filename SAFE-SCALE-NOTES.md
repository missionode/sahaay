# Sahaay safe-scale / backend / process note

Use this as the detailed safety/process note for the submission package. The landing page contains the evaluator-facing version.

## Core safety position

Sahaay should not replace 108/112 or any official emergency authority. It is a hybrid digital layer that improves the first report, dispatcher triage and field-unit handoff while keeping trained humans in control.

AI, sensors and media can assist with summaries and recommendations, but they must not autonomously dispatch units, trigger Code Blue or close an incident.

## Proposed backend shape

- Reporter app: one-tap report, self/witness mode, consent capture, location/tower context, optional media and live bridge.
- Dispatcher console: incident verification, call notes, unit assignment, Code Blue confirmation, timeline and handoff closure.
- Response-unit app: route context, agency-specific tasks, status updates, backup availability and closure comment.
- Incident API: creates incident records, validates role access, stores event history and serves current incident state.
- Media service: handles upload, redaction, encryption, access expiry and deletion policy.
- Integration adapters: connect only through approved government/EMS/fire/police interfaces where permitted.

## Safe incident process

1. First reporter sends a report for self or someone else.
2. App captures only the required context: location, tower/network state, battery, optional photo/video/audio and reporter notes.
3. Dispatcher verifies facts through the live bridge and marks unknowns clearly.
4. System recommends unit mix and urgency, but the dispatcher confirms every dispatch.
5. Code Blue requires a confirmation prompt and human approval.
6. Field units update status from the scene.
7. The incident closes only after a responder adds a final status comment.
8. Retention/deletion rules run after closure based on policy.

## Privacy, security and governance

- Use explicit consent where the situation permits; allow emergency exceptions only under documented policy.
- Encrypt media and incident records in transit and at rest.
- Restrict data by role: reporter, dispatcher, police, fire/rescue, EMS and supervisor.
- Keep immutable audit events for every decision, note, dispatch and handoff change.
- Apply short retention windows for synthetic/demo-like media in pilots; extend only for legal or operational need.
- Provide low-network fallback: voice call, SMS, delayed sync and dispatcher-entered notes.
- Run field pilots with emergency professionals before production use.

## What remains mocked in this prototype

No real emergency system, government API, telephony, SMS, identity provider, hospital capacity feed, responder availability feed, media upload service, encryption service, audit database or dispatch authority is connected. All people, units, locations, routes, media and timelines are synthetic.
