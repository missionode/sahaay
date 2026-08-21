# Sahaay project summary

Use this in the hackathon submission form’s “project summary” field. It does not need to appear inside the prototype UI, but keeping it in the repo makes the submitted wording reproducible.

## Under-250-word summary

Sahaay is an independent emergency-response prototype for India that improves the first few minutes of a 108/112-style incident report. Today, call-first workflows often begin with incomplete information: the reporter may be injured, panicked, nearby as a witness, or unable to explain what responders need to know. Sahaay turns that first report into a structured, human-reviewed incident handoff.

The demo follows Maya reporting a van trapped under a fallen tree near Koramangala. With one tap, Sahaay captures location, tower context, battery state, optional media and a live dispatcher bridge. Dispatcher Arjun verifies what is known, asks for a safe camera angle, gives do/don’t guidance, checks whether Code Blue escalation is needed, and coordinates Fire Rescue F-03, Police P-12, Ambulance A-27 and backup EMS. The incident closes with occupants safely evacuated and no injuries found.

This was built with Codex using CLI-driven iteration, local static validation and headless Playwright smoke tests. It is better than a plain call or static report because the reporter, dispatcher and response units share one live picture: what is verified, what is uncertain, who is assigned, where to stage and how the handoff closed. All people, locations, media, units and timelines are synthetic; no real emergency system or personal data is connected.
