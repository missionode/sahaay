# Sahaay

Sahaay is an independent emergency-response prototype for the Build What Moves India challenge. It demonstrates how a one-tap first report can become a dispatcher-verified, multi-agency response handoff for a synthetic tree-fall vehicle rescue.

## Run locally

```bash
python3 -m http.server 8001
```

Then open:

- Landing page: `http://localhost:8001/`
- Guided evaluator simulation: `http://localhost:8001/simulation.html`
- Role account gateway: `http://localhost:8001/demo-login.html`

## Recommended evaluation path

Start with `simulation.html`. It is the complete product walkthrough: reporter, dispatcher and response-unit views move together from first report to Code Blue check, fire/police/EMS coordination and no-injury closure.

## Safety boundary

This is a prototype only. It does not connect to real 108/112 systems, government APIs, telephony, dispatch systems, responder availability, personal data or live emergency services. All people, media, units, routes and timelines are synthetic.
# ChatGPT Sites deployment

The published Sahaay prototype is also available at `https://sahaay.pushpastra.chatgpt.site`.
