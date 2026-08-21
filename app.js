const simulateBtn = document.querySelector('#simulateBtn');
const incidentTitle = document.querySelector('#incidentTitle');
const incidentStatus = document.querySelector('#incidentStatus');
const bigSignal = document.querySelector('#bigSignal');
const panelCopy = document.querySelector('#panelCopy');
const sensorLocation = document.querySelector('#sensorLocation');
const sensorCall = document.querySelector('#sensorCall');
const sensorNetwork = document.querySelector('#sensorNetwork');
const sensorBattery = document.querySelector('#sensorBattery');
const confidenceValue = document.querySelector('#confidenceValue');
const confidenceBar = document.querySelector('#confidenceBar');
const mapCaption = document.querySelector('#mapCaption');
const unitEta = document.querySelector('#unitEta');
const toolbarTime = document.querySelector('#toolbarTime');
const timeline = document.querySelector('#timeline');
const modeButtons = document.querySelectorAll('.mode-button');
const modeHint = document.querySelector('#modeHint');
const photoBtn = document.querySelector('#photoBtn');
const photoInput = document.querySelector('#photoInput');
const photoStatus = document.querySelector('#photoStatus');
const audioBtn = document.querySelector('#audioBtn');
const audioStatus = document.querySelector('#audioStatus');
let reporterMode = 'self';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const timeNow = () => new Date().toLocaleTimeString('en-IN', { hour12: false });

function setReporterMode(mode) {
  reporterMode = mode;
  modeButtons.forEach((item) => item.classList.toggle('active', item.dataset.mode === mode));
  const selfReporting = mode === 'self';
  modeHint.textContent = selfReporting
    ? 'A dispatcher call can be offered with your permission.'
    : 'Ask only about what you can safely observe; the dispatcher can note details.';
  audioStatus.textContent = selfReporting ? 'Permission required' : 'Optional for witness mode';
  audioBtn.textContent = selfReporting ? 'Open' : 'Optional';
  audioBtn.disabled = !selfReporting;
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setReporterMode(button.dataset.mode);
  });
});

photoBtn.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', () => {
  if (!photoInput.files.length) return;
  photoStatus.textContent = 'Attached locally · not uploaded';
  photoBtn.textContent = 'Added';
  addTimeline('Photo evidence attached', 'Local synthetic preview only');
});

audioBtn.addEventListener('click', () => {
  if (reporterMode !== 'self') return;
  audioStatus.textContent = 'Dispatcher call ready';
  audioBtn.textContent = 'Ready';
  addTimeline('Dispatcher call opened', 'Explicit permission state · no recording stored');
});

function addTimeline(title, detail) {
  const item = document.createElement('div');
  item.className = 'timeline-item live';
  item.innerHTML = `<span class="timeline-dot"></span><div><strong>${title}</strong><small>${detail}</small></div><time>${timeNow()}</time>`;
  timeline.prepend(item);
}

async function simulateIncident() {
  simulateBtn.disabled = true;
  simulateBtn.innerHTML = 'Running tree rescue <span>…</span>';
  incidentTitle.textContent = 'Tree rescue report received';
  incidentStatus.classList.remove('muted');
  incidentStatus.innerHTML = '<i></i> LIVE BRIDGE';
  bigSignal.textContent = 'Tree-fall rescue · all doors jammed';
  panelCopy.textContent = 'Maya reports a large van under a fallen tree; passengers are responsive but cannot exit, and injury status is still unknown.';
  toolbarTime.textContent = timeNow();
  addTimeline('Incident report received', `Synthetic event · ${reporterMode === 'self' ? 'self-report' : 'reporting for someone else'}`);
  await wait(600);
  sensorLocation.textContent = '12.9716° N, 77.5946° E';
  sensorLocation.previousElementSibling.classList.add('live');
  sensorCall.textContent = 'Live bridge ready';
  sensorCall.previousElementSibling.classList.add('live');
  sensorNetwork.textContent = 'KRM-S03 · Koramangala South';
  sensorNetwork.previousElementSibling.classList.add('live');
  sensorBattery.textContent = '62%';
  sensorBattery.previousElementSibling.classList.add('live');
  mapCaption.textContent = 'Koramangala · tree-blocked van';
  confidenceValue.textContent = '94%';
  confidenceBar.style.width = '94%';
  addTimeline('All doors jammed reported', 'Passengers responsive; injury status unknown');
  addTimeline('Context assembled', 'Location, tower, call bridge and device health');
  await wait(650);
  incidentTitle.textContent = 'Multi-agency handoff ready';
  incidentStatus.innerHTML = '<i></i> FIRE + EMS + POLICE';
  unitEta.textContent = 'F03 06:10 · A27 04:20 · P12 03:10';
  addTimeline('Fire F-03 + Ambulance A-27 + Police P-12 notified', 'Tree cutting, safe exit access, medical assessment and traffic control');
  simulateBtn.disabled = false;
  simulateBtn.innerHTML = 'Run preview again <span>↻</span>';
}

simulateBtn.addEventListener('click', simulateIncident);
