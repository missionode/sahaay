const roleProfiles = {
  reporter: {
    title: 'Reporter view',
    state: 'Draft report',
    avatar: 'MR',
    name: 'Maya Rao',
    role: 'Reporter demo profile',
  },
  dispatcher: {
    title: 'Dispatcher view',
    state: 'Triaging',
    avatar: 'AN',
    name: 'Arjun Nair',
    role: 'Dispatcher demo profile',
  },
  unit: {
    title: 'Response unit view',
    state: 'Assigned',
    avatar: 'A27',
    name: 'Ambulance A-27',
    role: 'EMS response unit',
  },
};

const roleAliases = {
  responder: 'unit',
  response: 'unit',
  'response-unit': 'unit',
};

const query = new URLSearchParams(window.location.search);
const roleTabs = document.querySelectorAll('.role-tab');
const roleScreens = document.querySelectorAll('.role-screen');
const profileAvatar = document.querySelector('#profileAvatar');
const profileName = document.querySelector('#profileName');
const profileRole = document.querySelector('#profileRole');
const viewTitle = document.querySelector('#viewTitle');
const incidentState = document.querySelector('#incidentState');
const incidentTime = document.querySelector('#incidentTime');
const settingsToggle = document.querySelector('#settingsToggle');
const settingsPanel = document.querySelector('#settingsPanel');
const settingLocation = document.querySelector('#settingLocation');
const settingPhoto = document.querySelector('#settingPhoto');
const settingAudio = document.querySelector('#settingAudio');
const modeOptions = document.querySelectorAll('.mode-option');
const reporterStatus = document.querySelector('#reporterStatus');
const reporterBriefMode = document.querySelector('#reporterBriefMode');
const reporterLocation = document.querySelector('#reporterLocation');
const photoAction = document.querySelector('#photoAction');
const photoInput = document.querySelector('#photoInput');
const evidenceState = document.querySelector('#evidenceState');
const audioState = document.querySelector('#audioState');
const callBriefState = document.querySelector('#callBriefState');
const sendReport = document.querySelector('#sendReport');
const videoCallCard = document.querySelector('#videoCallCard');
const selfiePreview = document.querySelector('#selfiePreview');
const cameraFallback = document.querySelector('#cameraFallback');
const callStatus = document.querySelector('#callStatus');
const muteCall = document.querySelector('#muteCall');
const endCall = document.querySelector('#endCall');
const dispatcherStatus = document.querySelector('#dispatcherStatus');
const dispatcherTimeline = document.querySelector('#dispatcherTimeline');
const dispatcherRecordingLabel = document.querySelector('#dispatcherRecordingLabel');
const dispatcherReporterPreview = document.querySelector('#dispatcherReporterPreview');
const dispatcherReporterFallback = document.querySelector('#dispatcherReporterFallback');
const dispatcherCallTitle = document.querySelector('#dispatcherCallTitle');
const dispatcherCallStatus = document.querySelector('#dispatcherCallStatus');
const answerDispatcherCall = document.querySelector('#answerDispatcherCall');
const captureCallNotes = document.querySelector('#captureCallNotes');
const verifyBrief = document.querySelector('#verifyBrief');
const assignRecommended = document.querySelector('#assignRecommended');
const assignUnit = document.querySelector('#assignUnit');
const assignBackup = document.querySelector('#assignBackup');
const assignPolice = document.querySelector('#assignPolice');
const assignFire = document.querySelector('#assignFire');
const availableUnitCount = document.querySelector('#availableUnitCount');
const openCodeBlue = document.querySelector('#openCodeBlue');
const codeBlueConfirm = document.querySelector('#codeBlueConfirm');
const codeBlueInput = document.querySelector('#codeBlueInput');
const confirmCodeBlue = document.querySelector('#confirmCodeBlue');
const cancelCodeBlue = document.querySelector('#cancelCodeBlue');
const codeBlueStatus = document.querySelector('#codeBlueStatus');
const unitStatus = document.querySelector('#unitStatus');
const unitUpdate = document.querySelector('#unitUpdate');
const enRoute = document.querySelector('#enRoute');
const arrived = document.querySelector('#arrived');
const handoffComplete = document.querySelector('#handoffComplete');
const handoffClosurePanel = document.querySelector('#handoffClosurePanel');
const closureOptions = document.querySelectorAll('.closure-option');
const handoffCustomDetail = document.querySelector('#handoffCustomDetail');
const submitHandoffComment = document.querySelector('#submitHandoffComment');
const cancelHandoffComment = document.querySelector('#cancelHandoffComment');
const handoffCommentPreview = document.querySelector('#handoffCommentPreview');
const handoffCommentStatus = document.querySelector('#handoffCommentStatus');
const handoffCommentDetail = document.querySelector('#handoffCommentDetail');

let currentRole = 'reporter';
let reporterMode = 'self';
let localStream = null;
let microphoneMuted = false;
let callActive = false;
let dispatcherCallAnswered = false;
const assignedServices = new Set();
let selectedClosure = {
  status: 'No injuries found',
  detail: 'Two occupants evacuated, alert and walking. Vitals stable. No transport required.',
};

const normalizeRole = (role) => {
  const rawRole = String(role || 'reporter').toLowerCase();
  return roleProfiles[rawRole] ? rawRole : roleAliases[rawRole] || 'reporter';
};

const timeNow = () => new Date().toLocaleTimeString('en-IN', { hour12: false });

function setRole(role, updateUrl = true) {
  currentRole = normalizeRole(role);
  const profile = roleProfiles[currentRole];

  document.body.dataset.role = currentRole;
  profileAvatar.textContent = profile.avatar;
  profileName.textContent = profile.name;
  profileRole.textContent = profile.role;
  viewTitle.textContent = profile.title;
  incidentState.textContent = profile.state;
  incidentTime.textContent = timeNow();

  roleTabs.forEach((tab) => {
    const selected = tab.dataset.role === currentRole;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-current', selected ? 'page' : 'false');
  });

  roleScreens.forEach((screen) => {
    screen.hidden = screen.dataset.screen !== currentRole;
  });

  if (updateUrl) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('role', currentRole);
    window.history.replaceState({}, '', nextUrl);
  }
}

function setReporterMode(mode) {
  reporterMode = mode === 'other' ? 'other' : 'self';
  const selfReporting = reporterMode === 'self';

  modeOptions.forEach((option) => {
    option.classList.toggle('active', option.dataset.reporterMode === reporterMode);
  });

  reporterBriefMode.textContent = selfReporting ? 'Self-reporting' : 'Reporting for someone else';
  audioState.textContent = settingAudio.checked ? 'Call mic allowed' : 'Call mic disabled';
}

function applySettings() {
  reporterLocation.textContent = settingLocation.checked ? '12.9716 N, 77.5946 E' : 'Hidden by demo settings';
  photoAction.disabled = !settingPhoto.checked;
  photoAction.textContent = settingPhoto.checked ? '▧ Add photo' : '▧ Photo disabled';
  setReporterMode(reporterMode);
}

function appendDispatcherEvent(title, detail) {
  const item = document.createElement('li');
  const strong = document.createElement('strong');
  const span = document.createElement('span');
  strong.textContent = title;
  span.textContent = detail;
  item.append(strong, span);
  dispatcherTimeline.prepend(item);
}

function updateAvailableUnitCount() {
  if (!assignedServices.size) {
    availableUnitCount.textContent = 'EMS, police, fire mapped';
    return;
  }

  const serviceLabels = {
    ems: 'EMS',
    police: 'Police',
    fire: 'Fire/rescue',
    backup: 'EMS backup',
  };
  availableUnitCount.textContent = Array.from(assignedServices)
    .map((service) => serviceLabels[service])
    .join(' + ');
}

function markServiceAssigned(service, config) {
  assignedServices.add(service);
  dispatcherStatus.textContent = config.status;
  incidentState.textContent = config.state;
  incidentTime.textContent = timeNow();
  if (config.button) {
    config.button.textContent = config.buttonText;
    config.button.disabled = true;
  }
  updateAvailableUnitCount();
  appendDispatcherEvent(config.timelineTitle, config.timelineDetail);
}

function updateHandoffPreview() {
  handoffCommentPreview.textContent = `Selected: ${selectedClosure.status}`;
}

function syncDispatcherCallView() {
  const liveVideoTrack = Boolean(localStream?.getVideoTracks().some((track) => track.readyState === 'live'));

  if (liveVideoTrack) {
    dispatcherReporterPreview.srcObject = localStream;
    dispatcherReporterPreview.hidden = false;
    dispatcherReporterFallback.hidden = true;
  } else {
    dispatcherReporterPreview.srcObject = null;
    dispatcherReporterPreview.hidden = true;
    dispatcherReporterFallback.hidden = false;
  }

  if (!callActive) {
    dispatcherRecordingLabel.textContent = 'CALL WAITING';
    dispatcherCallTitle.textContent = 'Incident scene with reporter call';
    dispatcherCallStatus.textContent = 'Scene feed is prioritized; waiting for reporter connection';
    answerDispatcherCall.disabled = false;
    answerDispatcherCall.textContent = 'Answer call';
    captureCallNotes.disabled = true;
    return;
  }

  dispatcherRecordingLabel.textContent = dispatcherCallAnswered ? 'LIVE REC' : 'INCOMING';
  dispatcherCallTitle.textContent = dispatcherCallAnswered ? 'Incident scene live with reporter thumbnail' : 'Incoming reporter call';
  dispatcherCallStatus.textContent = liveVideoTrack
    ? 'Reporter face stays as a thumbnail while the incident scene remains primary'
    : 'Reporter call active; synthetic face thumbnail shown while scene feed remains primary';
  answerDispatcherCall.disabled = dispatcherCallAnswered;
  answerDispatcherCall.textContent = dispatcherCallAnswered ? 'Call connected' : 'Answer call';
  captureCallNotes.disabled = !dispatcherCallAnswered;
}

function stopLocalStream() {
  if (!localStream) return;
  localStream.getTracks().forEach((track) => track.stop());
  localStream = null;
}

async function requestSelfieCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    callStatus.textContent = 'Camera unavailable; showing demo fallback tile';
    return;
  }

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: settingAudio.checked,
    });
    selfiePreview.srcObject = localStream;
    selfiePreview.hidden = false;
    cameraFallback.hidden = true;
    callStatus.textContent = settingAudio.checked
      ? 'Front camera and microphone preview active; not uploaded in this demo'
      : 'Front camera preview active; microphone disabled in settings';
    syncDispatcherCallView();
  } catch (error) {
    callStatus.textContent = 'Camera permission not available; showing demo fallback tile';
    selfiePreview.hidden = true;
    cameraFallback.hidden = false;
    syncDispatcherCallView();
  }
}

async function startReporterCall() {
  callActive = true;
  dispatcherCallAnswered = true;
  reporterStatus.textContent = 'Calling';
  incidentState.textContent = 'Video call connected';
  incidentTime.textContent = timeNow();
  callBriefState.textContent = 'Live call active';
  audioState.textContent = settingAudio.checked ? 'Call microphone requested' : 'Microphone disabled';
  videoCallCard.hidden = false;
  sendReport.disabled = true;
  sendReport.textContent = 'Call in progress';
  dispatcherStatus.textContent = 'On call';
  appendDispatcherEvent('Live video call connected', 'Reporter call visible in dispatcher view');
  syncDispatcherCallView();
  await requestSelfieCamera();
}

function endReporterCall() {
  callActive = false;
  dispatcherCallAnswered = false;
  stopLocalStream();
  microphoneMuted = false;
  selfiePreview.srcObject = null;
  selfiePreview.hidden = true;
  cameraFallback.hidden = false;
  videoCallCard.hidden = true;
  reporterStatus.textContent = 'Sent';
  incidentState.textContent = 'Call ended';
  incidentTime.textContent = timeNow();
  callBriefState.textContent = 'Call completed';
  callStatus.textContent = 'Requesting front camera for demo preview';
  muteCall.textContent = 'Mute mic';
  sendReport.disabled = false;
  sendReport.innerHTML = 'Restart report call <span>→</span>';
  syncDispatcherCallView();
}

roleTabs.forEach((tab) => {
  tab.addEventListener('click', () => setRole(tab.dataset.role));
});

settingsToggle.addEventListener('click', () => {
  const shouldOpen = settingsPanel.hidden;
  settingsPanel.hidden = !shouldOpen;
  settingsToggle.setAttribute('aria-expanded', String(shouldOpen));
});

[settingLocation, settingPhoto, settingAudio].forEach((setting) => {
  setting.addEventListener('change', applySettings);
});

modeOptions.forEach((option) => {
  option.addEventListener('click', () => setReporterMode(option.dataset.reporterMode));
});

photoAction.addEventListener('click', () => {
  if (photoAction.disabled) return;
  photoInput.click();
});

photoInput.addEventListener('change', () => {
  if (!photoInput.files.length) return;
  evidenceState.textContent = 'Photo attached locally';
  photoAction.textContent = '▧ Photo ready';
});

sendReport.addEventListener('click', () => {
  startReporterCall();
});

muteCall.addEventListener('click', () => {
  microphoneMuted = !microphoneMuted;
  if (localStream) {
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !microphoneMuted;
    });
  }
  muteCall.textContent = microphoneMuted ? 'Unmute mic' : 'Mute mic';
});

endCall.addEventListener('click', () => {
  endReporterCall();
});

answerDispatcherCall.addEventListener('click', () => {
  callActive = true;
  dispatcherCallAnswered = true;
  dispatcherStatus.textContent = 'On call';
  incidentState.textContent = 'Video call connected';
  incidentTime.textContent = timeNow();
  callBriefState.textContent = 'Live call active';
  reporterStatus.textContent = 'Calling';
  videoCallCard.hidden = false;
  sendReport.disabled = true;
  sendReport.textContent = 'Call in progress';
  callStatus.textContent = localStream
    ? 'Dispatcher connected to reporter camera preview'
    : 'Dispatcher connected; reporter camera fallback shown in this demo path';
  appendDispatcherEvent('Dispatcher joined live call', 'Reporter video call active in ops view');
  syncDispatcherCallView();
});

captureCallNotes.addEventListener('click', () => {
  dispatcherStatus.textContent = 'Details captured';
  incidentState.textContent = 'Call notes updated';
  incidentTime.textContent = timeNow();
  appendDispatcherEvent('Call details captured', 'Dispatcher added reporter context from the live call');
});

verifyBrief.addEventListener('click', () => {
  dispatcherStatus.textContent = 'Verified';
  incidentState.textContent = 'Brief verified';
  incidentTime.textContent = timeNow();
  appendDispatcherEvent('Brief verified', 'Dispatcher confirmed core facts');
});

assignUnit.addEventListener('click', () => {
  markServiceAssigned('ems', {
    status: 'EMS assigned',
    state: 'Ambulance A-27 notified',
    button: assignUnit,
    buttonText: '◎ Ambulance A-27 assigned',
    timelineTitle: 'Ambulance A-27 assigned',
    timelineDetail: '740 m EMS unit staging for medical assessment after fire access',
  });
  unitStatus.textContent = 'EMS assigned';
  unitUpdate.textContent = 'Ambulance A-27 staging';
});

assignPolice.addEventListener('click', () => {
  markServiceAssigned('police', {
    status: 'Police assigned',
    state: 'Patrol P-12 notified',
    button: assignPolice,
    buttonText: 'Police P-12 assigned',
    timelineTitle: 'Police Patrol P-12 assigned',
    timelineDetail: '520 m police unit moving for traffic control and scene safety',
  });
});

assignFire.addEventListener('click', () => {
  markServiceAssigned('fire', {
    status: 'Fire assigned',
    state: 'Fire Rescue F-03 notified',
    button: assignFire,
    buttonText: 'Fire F-03 assigned',
    timelineTitle: 'Fire Rescue F-03 assigned',
    timelineDetail: 'Nearest fire/rescue unit moving for tree cutting and safe exit access',
  });
});

assignBackup.addEventListener('click', () => {
  markServiceAssigned('backup', {
    status: 'Backup held',
    state: 'Backup ambulance reserved',
    button: assignBackup,
    buttonText: 'Backup B-14 held',
    timelineTitle: 'Backup Ambulance B-14 held',
    timelineDetail: '960 m EMS backup kept ready inside primary radius',
  });
});

assignRecommended.addEventListener('click', () => {
  assignRecommended.textContent = 'Fire + EMS + Police dispatched';
  assignRecommended.disabled = true;
  if (!assignedServices.has('fire')) assignFire.click();
  if (!assignedServices.has('ems')) assignUnit.click();
  if (!assignedServices.has('police')) assignPolice.click();
  dispatcherStatus.textContent = 'Package dispatched';
  incidentState.textContent = 'Fire, EMS and police notified';
  incidentTime.textContent = timeNow();
  appendDispatcherEvent('Recommended package dispatched', 'Fire F-03, Ambulance A-27 and Police P-12 sent for tree-rescue response');
});

openCodeBlue.addEventListener('click', () => {
  codeBlueConfirm.hidden = false;
  codeBlueInput.value = '';
  codeBlueStatus.textContent = 'Type CODE BLUE to confirm EMS, police and fire/rescue should transit.';
  codeBlueInput.focus();
});

cancelCodeBlue.addEventListener('click', () => {
  codeBlueConfirm.hidden = true;
  codeBlueInput.value = '';
  codeBlueStatus.textContent = 'No units will move until confirmation is entered.';
});

confirmCodeBlue.addEventListener('click', () => {
  if (codeBlueInput.value.trim().toUpperCase() !== 'CODE BLUE') {
    codeBlueStatus.textContent = 'Confirmation mismatch. Type CODE BLUE exactly to activate.';
    return;
  }

  dispatcherStatus.textContent = 'Code Blue';
  dispatcherStatus.classList.add('critical');
  incidentState.textContent = 'Code Blue active';
  incidentTime.textContent = timeNow();
  assignedServices.add('ems');
  assignedServices.add('police');
  assignedServices.add('fire');
  assignedServices.add('backup');
  availableUnitCount.textContent = 'EMS + Police + Fire moving';
  openCodeBlue.textContent = 'Code Blue active';
  openCodeBlue.disabled = true;
  assignRecommended.disabled = true;
  assignUnit.disabled = true;
  assignPolice.disabled = true;
  assignFire.disabled = true;
  assignBackup.disabled = true;
  assignRecommended.textContent = 'Code Blue package active';
  assignUnit.textContent = 'A-27 ambulance transiting';
  assignPolice.textContent = 'P-12 police transiting';
  assignFire.textContent = 'F-03 fire transiting';
  assignBackup.textContent = 'B-14 backup transiting';
  unitStatus.textContent = 'Code Blue';
  unitUpdate.textContent = 'EMS, police and fire/rescue transiting';
  codeBlueConfirm.hidden = true;
  appendDispatcherEvent('Code Blue activated', 'Ambulance, police and fire/rescue instructed to transit in demo mode');
});

codeBlueInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    confirmCodeBlue.click();
  }
});

enRoute.addEventListener('click', () => {
  unitStatus.textContent = 'En route';
  incidentState.textContent = 'Unit moving';
  incidentTime.textContent = timeNow();
  unitUpdate.textContent = 'En route to incident';
});

arrived.addEventListener('click', () => {
  unitStatus.textContent = 'On scene';
  incidentState.textContent = 'Unit arrived';
  incidentTime.textContent = timeNow();
  unitUpdate.textContent = 'Arrived at scene';
});

closureOptions.forEach((option) => {
  option.addEventListener('click', () => {
    selectedClosure = {
      status: option.dataset.closure,
      detail: option.dataset.detail,
    };
    closureOptions.forEach((item) => {
      item.classList.toggle('active', item === option);
    });
    updateHandoffPreview();
  });
});

handoffComplete.addEventListener('click', () => {
  handoffClosurePanel.hidden = false;
  updateHandoffPreview();
  handoffCustomDetail.focus();
});

cancelHandoffComment.addEventListener('click', () => {
  handoffClosurePanel.hidden = true;
  handoffCustomDetail.value = '';
});

submitHandoffComment.addEventListener('click', () => {
  const customDetail = handoffCustomDetail.value.trim();
  const finalDetail = customDetail || selectedClosure.detail;

  unitStatus.textContent = selectedClosure.status;
  incidentState.textContent = 'Handoff comment submitted';
  incidentTime.textContent = timeNow();
  unitUpdate.textContent = selectedClosure.status;
  handoffCommentStatus.textContent = selectedClosure.status;
  handoffCommentDetail.textContent = finalDetail;
  handoffClosurePanel.hidden = true;
  handoffComplete.disabled = true;
  handoffComplete.textContent = 'Handoff closed';
  appendDispatcherEvent(`Handoff closed: ${selectedClosure.status}`, finalDetail);
});

setRole(query.get('role'), false);
setReporterMode('self');
applySettings();
syncDispatcherCallView();
