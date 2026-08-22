const FALLBACK_INTERVAL_MS = 5200;
const CALL_RING_DURATION_MS = 1800;

const seedState = {
  highlights: ['reporter'],
  screens: {
    dispatcher: false,
    unit: false,
  },
  call: {
    status: 'Not connected',
    reporter: 'Ready to report',
    dispatcher: 'Splash',
    unit: 'Splash',
    police: 'Standby',
    fire: 'Standby',
    live: [],
    speaking: null,
    line: 'Dispatcher and response screens wake up only after Maya starts the incident.',
  },
  action: {
    status: 'Waiting for report',
    active: null,
    done: [],
  },
  safety: {
    title: 'Wait for dispatcher',
    items: ['Start the journey to see live do and don’t instructions.'],
  },
  reporter: {
    status: 'Ready',
    mode: 'Self-reporting',
    live: 'STANDBY',
    liveActive: false,
    scene: 'Tree-fall scene ready',
    action: 'Start report',
    actionDone: false,
    location: 'Waiting',
    tower: '—',
    battery: '—',
    bridge: 'Not connected',
    messages: [{ type: 'system', text: 'No active incident. Maya can start with one tap.' }],
  },
  dispatcher: {
    status: 'Splash',
    rec: 'CALL WAITING',
    recActive: false,
    incident: 'Awaiting signal',
    confidence: '—',
    confidenceWidth: '0%',
    sceneTitle: 'No active incident',
    sceneDetail: 'Scene feed appears when Maya opens the guided call.',
    known: ['No active incident yet.'],
    needs: ['Awaiting reporter signal.'],
    agencies: {},
    timeline: [],
  },
  unit: {
    status: 'Standby',
    eta: 'ETA —',
    assignment: 'No active dispatch',
    access: 'Awaiting dispatcher',
    agencies: 'None assigned',
    bridge: 'Not connected',
    closure: 'Not submitted',
    handoffStatus: 'Pending',
    handoffDetail: 'Responder can close with a common case or custom detail.',
  },
};

const beats = [
  {
    id: 'ready',
    time: '00:00',
    audio: 'assets/dialogue/00-ready.wav',
    focus: ['reporterAction', 'reporterScene'],
    kicker: 'Beat 00',
    title: 'Tree-rescue simulation ready',
    speaker: 'System',
    responsibility: 'Sets up the evaluator view',
    text: 'This is Sahaay. Watch a non-graphic tree-fall vehicle rescue from first report to safe evacuation with no injuries found.',
  },
  {
    id: 'maya-report',
    time: '00:06',
    audio: 'assets/dialogue/01-maya-report.wav',
    ringBefore: true,
    focus: ['reporterAction', 'dispatcherBrief', 'callBridge'],
    kicker: 'Beat 01',
    title: 'Maya reports the incident',
    speaker: 'Maya',
    responsibility: 'First reporter / person in distress',
    text: 'Hi, I am Maya. I am reporting from Koramangala signal. A large van is under a fallen tree. All doors look jammed, and the passengers cannot get out. I can hear people inside, but I do not know if anyone is injured.',
    state: {
      highlights: ['reporter', 'dispatcher'],
      screens: { dispatcher: true, unit: false },
      call: {
        status: 'Reporter signal opened',
        reporter: 'Speaking',
        dispatcher: 'Alerted',
        live: ['reporter', 'dispatcher'],
        speaking: 'reporter',
        line: 'Maya: A large van is under a fallen tree. All doors look jammed.',
      },
      action: { status: 'Reporter tapped start report', active: null, done: [] },
      safety: {
        title: 'Reporter first action',
        items: ['Stay away from the fallen tree and branches.', 'Do not try to open any of the jammed doors.', 'Keep clear of traffic and wet road edges.'],
      },
      reporter: {
        status: 'Report sent',
        live: 'REPORTING',
        liveActive: true,
        scene: 'Tree-blocked vehicle selected · note optional',
        action: 'Report sent',
        actionDone: true,
        location: '12.9716 N, 77.5946 E',
        tower: 'KRM-S03',
        battery: '62%',
        bridge: 'Dispatcher alerted',
        messages: [
          { type: 'reporter', text: 'A large van is under a fallen tree. All doors look jammed and passengers cannot get out.' },
          { type: 'system', text: 'Location, tower and battery context attached automatically.' },
        ],
      },
      dispatcher: {
        status: 'Incoming',
        rec: 'INCOMING',
        recActive: true,
        incident: 'Tree-fall vehicle obstruction',
        confidence: '70%',
        confidenceWidth: '70%',
        sceneTitle: 'Reporter signal received',
        sceneDetail: 'Maya’s location, tower and initial tree-obstruction report are available before long typing.',
        known: ['Reporter: Maya Rao', 'Location: Koramangala signal', 'Tower: KRM-S03', 'All vehicle doors appear jammed'],
        needs: ['Is Maya safe?', 'Are occupants responsive?', 'Any smoke, fire, fuel or electrical hazard?'],
        timeline: [{ time: '00:06', text: 'Maya created a one-tap tree-fall vehicle report.' }],
      },
    },
  },
  {
    id: 'arjun-answer',
    time: '00:14',
    audio: 'assets/dialogue/02-arjun-answer.wav',
    focus: ['callBridge', 'actionBoard', 'reporterGuidance'],
    kicker: 'Beat 02',
    title: 'Arjun answers with empathy',
    speaker: 'Arjun',
    responsibility: 'Dispatcher / incident orchestrator',
    text: 'Maya, this is Arjun from Sahaay. I am here to help. Stay away from the tree and traffic. I have your location. I am opening a live incident bridge now.',
    state: {
      highlights: ['dispatcher', 'reporter'],
      call: {
        status: 'Reporter + dispatcher live',
        reporter: 'Live',
        dispatcher: 'Speaking',
        live: ['reporter', 'dispatcher'],
        speaking: 'dispatcher',
        line: 'Arjun: I am here to help. Stay away from the tree and traffic.',
      },
      action: { status: 'Arjun answered caller', active: 'answer', done: ['answer'] },
      safety: {
        title: 'Immediate do / don’t',
        items: ['Move to the footpath or a safe edge if you can.', 'Do not stand under branches or near the jammed doors.', 'Keep yourself visible to responders.'],
      },
      reporter: {
        status: 'Dispatcher connected',
        bridge: 'Dispatcher live',
        messages: [
          { type: 'dispatcher', text: 'Maya, this is Arjun from Sahaay. I am here to help.' },
          { type: 'system', text: 'Live incident bridge opened.' },
        ],
      },
      dispatcher: {
        status: 'Call live',
        rec: 'LIVE REC',
        incident: 'Tree-fall obstruction · live call',
        sceneTitle: 'Call answered',
        sceneDetail: 'Arjun has the reporter, location and context on the same incident thread.',
        timeline: [
          { time: '00:14', text: 'Arjun answered and opened the live bridge.' },
          { time: '00:06', text: 'Maya created a one-tap tree-fall vehicle report.' },
        ],
      },
    },
  },
  {
    id: 'camera-request',
    time: '00:25',
    audio: 'assets/dialogue/03-camera-request.wav',
    focus: ['reporterScene', 'dispatcherScene', 'actionBoard'],
    kicker: 'Beat 03',
    title: 'Arjun requests a safe scene view',
    speaker: 'Arjun',
    responsibility: 'Asks for visual context without putting reporter at risk',
    text: 'If it is safe, point your camera towards the van and the tree from where you are standing. Do not go closer or stand under branches. I only need to understand access and visible danger.',
    state: {
      highlights: ['dispatcher', 'reporter'],
      call: {
        reporter: 'Listening',
        dispatcher: 'Speaking',
        speaking: 'dispatcher',
        line: 'Arjun: If it is safe, point your camera towards the van and tree. Do not go closer.',
      },
      action: { status: 'Safe camera view requested', active: 'camera', done: ['answer', 'camera'] },
      safety: {
        title: 'Safe camera rule',
        items: ['Point camera from your current safe place.', 'Do not cross traffic or step under the tree for a better angle.', 'Stop filming if you feel unsafe.'],
      },
      reporter: {
        scene: 'Safe camera view requested',
        action: 'Point camera safely',
        bridge: 'Camera guidance active',
        messages: [
          { type: 'dispatcher', text: 'Can you point the camera at the van and tree from a safe place?' },
          { type: 'system', text: 'Camera request shown as guidance, not a demand.' },
        ],
      },
      dispatcher: {
        confidence: '78%',
        confidenceWidth: '78%',
        sceneTitle: 'Safe camera requested',
        sceneDetail: 'The dispatcher asks for scene context while explicitly limiting risk to the reporter.',
        known: ['Reporter is connected', 'Location verified', 'Camera view requested safely'],
        needs: ['Occupants responsive?', 'All doors jammed?', 'Visible smoke, fire or wire hazard?'],
        timeline: [
          { time: '00:25', text: 'Arjun requested safe camera context.' },
          { time: '00:14', text: 'Arjun answered and opened the live bridge.' },
          { time: '00:06', text: 'Maya created a one-tap tree-fall vehicle report.' },
        ],
      },
    },
  },
  {
    id: 'maya-camera',
    time: '00:34',
    audio: 'assets/dialogue/04-maya-camera.wav',
    focus: ['dispatcherScene', 'reporterMessages', 'callBridge'],
    kicker: 'Beat 04',
    title: 'Maya shares what she can see',
    speaker: 'Maya',
    responsibility: 'Shows scene only from a safe position',
    text: 'Okay, I am on the footpath. The tree is across the van, and all the doors look jammed. I can hear two people answering, but they cannot get out. I do not see blood or smoke.',
    state: {
      highlights: ['reporter', 'dispatcher'],
      call: {
        reporter: 'Speaking',
        dispatcher: 'Watching scene',
        speaking: 'reporter',
        line: 'Maya: All the doors look jammed. Two people are answering, but they cannot get out.',
      },
      action: { status: 'Scene view received', active: 'camera', done: ['answer', 'camera'] },
      safety: {
        title: 'Maya stays safe',
        items: ['Reporter remains on the footpath.', 'Scene is visible enough for dispatcher triage.', 'No closer movement requested.'],
      },
      reporter: {
        live: 'LIVE REC',
        scene: 'Camera pointed safely at incident',
        action: 'Camera shared',
        messages: [{ type: 'reporter', text: 'All doors look jammed. I can hear two people answering, but they cannot get out. I do not see blood or smoke.' }],
      },
      dispatcher: {
        confidence: '84%',
        confidenceWidth: '84%',
        sceneTitle: 'Incident scene visible',
        sceneDetail: 'Scene stays primary so Arjun can assess tree hazard, traffic and safe-exit access.',
        known: ['Large vehicle under fallen tree', 'All doors appear jammed', 'Two occupants responding', 'No visible smoke or blood'],
        needs: ['Fire/rescue access plan', 'EMS assessment after safe exit', 'Police traffic control'],
        timeline: [
          { time: '00:34', text: 'Maya shared safe scene view.' },
          { time: '00:25', text: 'Arjun requested safe camera context.' },
          { time: '00:14', text: 'Arjun answered and opened the live bridge.' },
        ],
      },
    },
  },
  {
    id: 'arjun-guidance',
    time: '00:45',
    audio: 'assets/dialogue/05-arjun-guidance.wav',
    focus: ['reporterGuidance', 'actionBoard', 'callBridge'],
    kicker: 'Beat 05',
    title: 'Arjun gives immediate do and don’t guidance',
    speaker: 'Arjun',
    responsibility: 'Keeps reporter safe while collecting useful facts',
    text: 'You are doing well, Maya. Do not pull any door or touch the tree. Ask people nearby to stay back. If the passengers can hear you, tell them to stay still and breathe slowly.',
    state: {
      highlights: ['dispatcher', 'reporter'],
      call: {
        reporter: 'Listening',
        dispatcher: 'Guiding',
        speaking: 'dispatcher',
        line: 'Arjun: Do not pull any door or touch the tree. Keep people back.',
      },
      action: { status: 'Do / don’t guidance given', active: 'guide', done: ['answer', 'camera', 'guide'] },
      safety: {
        title: 'Do / don’t guidance',
        items: ['Do not pull any door or touch branches.', 'Do not stand below the damaged tree.', 'Ask nearby people to stay back.', 'Tell occupants to stay still if they can hear you.'],
      },
      reporter: {
        action: 'Follow safety guide',
        messages: [{ type: 'dispatcher', text: 'You are doing well. Do not touch the tree or pull any of the jammed doors.' }],
      },
      dispatcher: {
        sceneTitle: 'Safety guidance delivered',
        sceneDetail: 'The call is not only collecting data; Arjun is actively reducing reporter, crowd and tree-fall risk.',
        known: ['Reporter safe on footpath', 'Doors not forced by bystanders', 'No visible smoke'],
        needs: ['Fire/rescue decision', 'EMS readiness', 'Code Blue decision'],
        timeline: [
          { time: '00:45', text: 'Arjun gave immediate do/don’t guidance.' },
          { time: '00:34', text: 'Maya shared safe scene view.' },
          { time: '00:25', text: 'Arjun requested safe camera context.' },
        ],
      },
    },
  },
  {
    id: 'verify',
    time: '00:56',
    audio: 'assets/dialogue/06-verify.wav',
    focus: ['dispatcherBrief', 'knownNeeds', 'agencies'],
    kicker: 'Beat 06',
    title: 'Arjun verifies facts',
    speaker: 'Arjun',
    responsibility: 'Separates known facts from assumptions',
    text: 'I am verifying this as a tree-fall vehicle obstruction. Two occupants are responsive, injury is unknown, all doors are jammed, they cannot get out, there is no visible smoke, and the road is partially blocked.',
    state: {
      highlights: ['dispatcher'],
      call: {
        dispatcher: 'Verifying',
        speaking: 'dispatcher',
        line: 'Arjun: Two occupants responsive, injury unknown, all doors jammed, no visible smoke.',
      },
      action: { status: 'Facts verified', active: 'verify', done: ['answer', 'camera', 'guide', 'verify'] },
      safety: {
        title: 'Verification discipline',
        items: ['Known: two occupants are responsive.', 'Known: all doors are jammed and passengers cannot get out.', 'Unknown: injury status until EMS assessment.'],
      },
      dispatcher: {
        status: 'Verified',
        incident: 'Verified tree-fall obstruction',
        confidence: '92%',
        confidenceWidth: '92%',
        sceneTitle: 'Brief verified',
        sceneDetail: 'Known facts, unknowns and agency options are separated before dispatch.',
        known: ['Two occupants responsive', 'All vehicle doors jammed', 'No visible smoke', 'Road partially blocked'],
        needs: ['Confirm Code Blue not needed', 'Assign fire/rescue, EMS and police'],
        agencies: { ems: 'standby', police: 'standby', fire: 'standby', backup: 'standby' },
        timeline: [
          { time: '00:56', text: 'Arjun verified tree-fall obstruction at 92% confidence.' },
          { time: '00:45', text: 'Arjun gave immediate do/don’t guidance.' },
          { time: '00:34', text: 'Maya shared safe scene view.' },
        ],
      },
      unit: {
        agencies: 'EMS, police, fire/rescue and backup mapped',
        handoffDetail: 'Dispatcher is verifying facts before assigning units.',
      },
    },
  },
  {
    id: 'codeblue',
    time: '01:08',
    audio: 'assets/dialogue/07-codeblue.wav',
    focus: ['actionBoard', 'agencies', 'dispatcherBrief'],
    kicker: 'Beat 07',
    title: 'Code Blue is checked, not activated',
    speaker: 'Arjun',
    responsibility: 'Avoids both under-response and over-dispatch',
    text: 'Code Blue is not activated. There is no mass casualty, fire, or unresponsive patient confirmed. But this needs fire rescue for the tree, EMS for assessment, and police for traffic.',
    state: {
      highlights: ['dispatcher'],
      call: {
        dispatcher: 'Code Blue not needed',
        fire: 'Needed',
        speaking: 'dispatcher',
        line: 'Arjun: Code Blue is not activated, but fire rescue, EMS and police are required.',
      },
      action: { status: 'Code Blue checked', active: 'codeblue', done: ['answer', 'camera', 'guide', 'verify', 'codeblue'] },
      safety: {
        title: 'Escalation rule',
        items: ['No mass-casualty signal.', 'No visible fire or unresponsive patient.', 'Fire/rescue is still required for tree cutting and safe exit access.'],
      },
      dispatcher: {
        status: 'Code Blue held',
        incident: 'Code Blue held · rescue needed',
        sceneTitle: 'Escalation decision recorded',
        sceneDetail: 'Code Blue is visible but not triggered; the agency package still includes fire/rescue.',
        known: ['Two responsive occupants', 'No visible fire', 'Tree is blocking all doors'],
        needs: ['Dispatch fire/rescue', 'Stage EMS', 'Secure road with police'],
        timeline: [
          { time: '01:08', text: 'Code Blue checked and not activated.' },
          { time: '00:56', text: 'Arjun verified tree-fall obstruction at 92% confidence.' },
          { time: '00:45', text: 'Arjun gave immediate do/don’t guidance.' },
        ],
      },
      unit: {
        handoffDetail: 'Catastrophe escalation is visible but not triggered in this scenario.',
      },
    },
  },
  {
    id: 'dispatch',
    time: '01:19',
    audio: 'assets/dialogue/08-dispatch.wav',
    focus: ['agencies', 'callBridge', 'unitBrief'],
    kicker: 'Beat 08',
    title: 'Arjun dispatches the right agencies',
    speaker: 'Arjun',
    responsibility: 'Sends the right agencies for the verified scenario',
    text: 'Fire Rescue F zero three, move for tree cutting and safe exit access. Ambulance A twenty seven, stage for medical assessment. Police P twelve, secure traffic and crowd. Backup B fourteen, stay available.',
    state: {
      highlights: ['dispatcher', 'unit'],
      screens: { unit: true },
      call: {
        status: 'All agencies looped',
        dispatcher: 'Coordinating',
        unit: 'Alerted',
        police: 'Alerted',
        fire: 'Alerted',
        live: ['reporter', 'dispatcher', 'unit', 'police', 'fire'],
        speaking: 'dispatcher',
        line: 'Arjun: F-03 handles tree and exit access. A-27 handles medical assessment. P-12 handles traffic.',
      },
      action: { status: 'Fire, EMS and police dispatched', active: 'dispatch', done: ['answer', 'camera', 'guide', 'verify', 'codeblue', 'dispatch'] },
      safety: {
        title: 'Reporter update',
        items: ['Fire/rescue is coming to create a safe exit.', 'EMS is coming to assess occupants.', 'Police is being looped for traffic and crowd control.'],
      },
      reporter: {
        status: 'Help assigned',
        action: 'Help is coming',
        bridge: 'Services looped',
        messages: [{ type: 'system', text: 'Fire Rescue F-03, Ambulance A-27 and Police P-12 assigned.' }],
      },
      dispatcher: {
        status: 'All agencies sent',
        incident: 'Tree rescue package dispatched',
        sceneTitle: 'Fire + EMS + police package assigned',
        sceneDetail: 'EMS, police and fire/rescue roles are transparent in one bridge.',
        known: ['Fire Rescue F-03 assigned', 'Ambulance A-27 assigned', 'Police P-12 assigned', 'EMS backup B-14 available'],
        needs: ['Fire confirms access plan', 'Police confirms traffic control', 'EMS confirms staging'],
        agencies: { ems: 'active', police: 'active', fire: 'active', backup: 'standby' },
        timeline: [
          { time: '01:19', text: 'Arjun dispatched fire/rescue, EMS and police.' },
          { time: '01:08', text: 'Code Blue checked and not activated.' },
          { time: '00:56', text: 'Arjun verified tree-fall obstruction at 92% confidence.' },
        ],
      },
      unit: {
        status: 'Assigned',
        eta: 'ETA 04:20',
        assignment: 'Ambulance A-27 · medical assessment',
        access: 'Stage south side until Fire F-03 clears tree hazard',
        agencies: 'Fire F-03 primary rescue; Police P-12 traffic control',
        bridge: 'Alerted to join',
        handoffStatus: 'Open',
        handoffDetail: 'Route, access point, reporter context and agency roles are visible before movement.',
      },
    },
  },
  {
    id: 'fire-loop',
    time: '01:31',
    audio: 'assets/dialogue/09-fire-loop.wav',
    focus: ['callBridge', 'agencies', 'dispatcherScene'],
    kicker: 'Beat 09',
    title: 'Fire/rescue joins for safe exit access',
    speaker: 'Fire Rescue F-03',
    responsibility: 'Tree cutting and safe access',
    text: 'Fire Rescue F zero three received. We are one point one kilometers away. We will stabilize the branch, cut access safely, and create a safe exit. EMS should stage back until we clear the hazard.',
    state: {
      highlights: ['dispatcher', 'unit'],
      call: {
        fire: 'Joined',
        speaking: 'fire',
        line: 'Fire F-03: We will stabilize the branch, cut access and create a safe exit.',
      },
      action: { status: 'Fire/rescue loop confirmed', active: 'fire', done: ['answer', 'camera', 'guide', 'verify', 'codeblue', 'dispatch', 'fire'] },
      safety: {
        title: 'Rescue hazard controlled',
        items: ['Fire/rescue owns branch stabilization.', 'EMS stages until access is safe.', 'Reporter remains behind the safe line.'],
      },
      dispatcher: {
        sceneTitle: 'Fire/rescue loop confirmed',
        sceneDetail: 'Tree cutting and safe-exit access have a clear owner before EMS enters the hazard zone.',
        known: ['Fire F-03 ETA 06:10', 'Branch stabilization assigned', 'Safe exit access plan confirmed'],
        needs: ['Police traffic control', 'EMS medical staging'],
        timeline: [
          { time: '01:31', text: 'Fire Rescue F-03 confirmed tree-cutting and safe-exit role.' },
          { time: '01:19', text: 'Arjun dispatched fire/rescue, EMS and police.' },
          { time: '01:08', text: 'Code Blue checked and not activated.' },
        ],
      },
      unit: {
        access: 'Stage 10 m back until Fire F-03 clears approach',
        agencies: 'Fire F-03 creating safe exit; Police P-12 en route',
      },
    },
  },
  {
    id: 'police-loop',
    time: '01:43',
    audio: 'assets/dialogue/10-police-loop.wav',
    focus: ['callBridge', 'agencies', 'unitMap'],
    kicker: 'Beat 10',
    title: 'Police joins for road control',
    speaker: 'Police P-12',
    responsibility: 'Traffic and crowd control',
    text: 'Police P twelve received. We are five hundred twenty meters away. We will hold traffic, create a safe work zone, and keep the fire and ambulance route clear.',
    state: {
      highlights: ['dispatcher', 'unit'],
      call: {
        status: 'Fire + police + EMS loop active',
        police: 'Live',
        speaking: 'police',
        line: 'Police P-12: We will hold traffic and keep the fire and ambulance route clear.',
      },
      action: { status: 'Police loop confirmed', active: 'police', done: ['answer', 'camera', 'guide', 'verify', 'codeblue', 'dispatch', 'fire', 'police'] },
      safety: {
        title: 'Traffic control confirmed',
        items: ['Police owns road closure and crowd line.', 'Fire/rescue gets a protected work zone.', 'EMS route remains clear.'],
      },
      reporter: {
        status: 'Services moving',
        bridge: 'Police joined',
        messages: [{ type: 'system', text: 'Police P-12 joined to secure traffic and crowd distance.' }],
      },
      dispatcher: {
        status: 'Units transiting',
        incident: 'Police traffic control bridged',
        sceneTitle: 'Police loop confirmed',
        sceneDetail: 'Traffic and crowd control are assigned before fire/rescue starts cutting.',
        known: ['Police P-12 ETA 03:10', 'Road hold assigned', 'Fire and EMS route protected'],
        needs: ['Bridge EMS', 'Monitor reporter safety'],
        timeline: [
          { time: '01:43', text: 'Police P-12 confirmed traffic-control role.' },
          { time: '01:31', text: 'Fire Rescue F-03 confirmed tree-cutting and safe-exit role.' },
          { time: '01:19', text: 'Arjun dispatched fire/rescue, EMS and police.' },
        ],
      },
      unit: {
        status: 'Staging',
        eta: 'ETA 03:05',
        assignment: 'Stage for occupants after fire access',
        access: 'Police clearing south-side lane; hold outside branch hazard',
        bridge: 'Waiting to join',
        handoffStatus: 'In progress',
        handoffDetail: 'EMS sees verified tree hazard and waits for fire/rescue access clearance.',
      },
    },
  },
  {
    id: 'ems-bridge',
    time: '01:55',
    audio: 'assets/dialogue/11-ems-bridge.wav',
    focus: ['unitBrief', 'callBridge', 'actionBoard'],
    kicker: 'Beat 11',
    title: 'Ambulance joins the live bridge',
    speaker: 'Ambulance A-27',
    responsibility: 'Medical assessment and safe evacuation',
    text: 'Ambulance A twenty seven received. We are staging south side with stretcher and first-aid kit ready. We will not enter the tree hazard until Fire F zero three clears access.',
    state: {
      highlights: ['dispatcher', 'unit'],
      call: {
        unit: 'Joined',
        police: 'Live',
        fire: 'Live',
        speaking: 'unit',
        line: 'Ambulance A-27: We are staging south side and waiting for fire to clear access.',
      },
      action: { status: 'Ambulance bridged', active: 'ems', done: ['answer', 'camera', 'guide', 'verify', 'codeblue', 'dispatch', 'fire', 'police', 'ems'] },
      safety: {
        title: 'Medical team staged safely',
        items: ['EMS receives verified access notes.', 'EMS waits outside the branch hazard.', 'Maya does not need to repeat the whole story.'],
      },
      dispatcher: {
        sceneTitle: 'Ambulance joined bridge',
        sceneDetail: 'The medical team receives verified context without entering the unsafe tree zone too early.',
        known: ['EMS staging south side', 'Fire owns access clearance', 'Police owns road control'],
        needs: ['Fire access update', 'EMS assessment after evacuation'],
        timeline: [
          { time: '01:55', text: 'Ambulance A-27 joined and staged outside tree hazard.' },
          { time: '01:43', text: 'Police P-12 confirmed traffic-control role.' },
          { time: '01:31', text: 'Fire Rescue F-03 confirmed tree-cutting and safe-exit role.' },
        ],
      },
      unit: {
        status: 'Staged',
        eta: 'ETA 02:10',
        assignment: 'Medical assessment after fire access',
        access: 'South-side staging; enter after Fire F-03 clears branches',
        bridge: 'Joined live call',
        handoffDetail: 'EMS is in the bridge before patient contact and can hear fire/rescue access status.',
      },
    },
  },
  {
    id: 'arjun-roles',
    time: '02:07',
    audio: 'assets/dialogue/12-arjun-roles.wav',
    focus: ['actionBoard', 'callBridge', 'reporterGuidance'],
    kicker: 'Beat 12',
    title: 'Arjun keeps roles transparent',
    speaker: 'Arjun',
    responsibility: 'Keeps every participant focused',
    text: 'Copy all. Fire owns cutting and safe exit access. Police owns traffic and the crowd line. EMS owns medical check after access. Maya, stay behind the safe line and tell me only if you see smoke or someone stops responding.',
    state: {
      highlights: ['dispatcher', 'reporter', 'unit'],
      call: {
        dispatcher: 'Coordinating',
        speaking: 'dispatcher',
        line: 'Arjun: Fire owns safe exit access, police owns traffic, EMS owns medical check.',
      },
      safety: {
        title: 'Reporter role reduced',
        items: ['Maya stays behind the safe line.', 'She reports only smoke, fire or a non-responsive occupant.', 'Professional responders own the active rescue.'],
      },
      reporter: {
        bridge: 'Stay connected for changes',
        messages: [{ type: 'dispatcher', text: 'Stay behind the safe line. Report only smoke or if someone stops responding.' }],
      },
      dispatcher: {
        sceneTitle: 'Roles confirmed',
        sceneDetail: 'Arjun makes responsibility ownership explicit so every service understands the plan.',
        known: ['Fire: tree and safe exit access', 'Police: road and crowd line', 'EMS: medical check after access'],
        needs: ['Fire arrival', 'Occupant evacuation', 'EMS no-injury assessment'],
        timeline: [
          { time: '02:07', text: 'Arjun confirmed agency responsibilities and reporter safety.' },
          { time: '01:55', text: 'Ambulance A-27 joined and staged outside tree hazard.' },
          { time: '01:43', text: 'Police P-12 confirmed traffic-control role.' },
        ],
      },
    },
  },
  {
    id: 'fire-access',
    time: '02:20',
    audio: 'assets/dialogue/13-fire-access.wav',
    focus: ['dispatcherScene', 'callBridge', 'unitBrief'],
    kicker: 'Beat 13',
    title: 'Fire opens safe access',
    speaker: 'Fire Rescue F-03',
    responsibility: 'Removes obstruction and opens vehicle access',
    text: 'Fire F zero three on scene. Tree is stabilized. A safe exit is open. Two occupants are walking out with assistance. No bleeding visible. EMS can assess now.',
    state: {
      highlights: ['unit', 'dispatcher'],
      call: {
        unit: 'Ready to assess',
        police: 'Traffic control',
        fire: 'On scene',
        speaking: 'fire',
        line: 'Fire F-03: A safe exit is open. Two occupants are walking out with assistance.',
      },
      action: { status: 'Safe exit opened', active: null, done: ['answer', 'camera', 'guide', 'verify', 'codeblue', 'dispatch', 'fire', 'police', 'ems'] },
      safety: {
        title: 'Rescue access opened',
        items: ['Fire/rescue cleared the hazard.', 'Occupants exit with assistance.', 'EMS starts assessment only after access is safe.'],
      },
      reporter: {
        status: 'Rescue on scene',
        action: 'Responders working',
        messages: [{ type: 'system', text: 'Fire/rescue opened access. EMS is taking over occupant assessment.' }],
      },
      dispatcher: {
        status: 'On scene',
        incident: 'Access opened · EMS assessing',
        sceneTitle: 'Fire opened safe access',
        sceneDetail: 'The rescue action is captured in the same operational thread before EMS assessment.',
        known: ['Tree stabilized', 'Safe exit opened', 'Two occupants walking with assistance', 'No visible bleeding'],
        needs: ['EMS no-injury assessment', 'Closure comment'],
        timeline: [
          { time: '02:20', text: 'Fire Rescue F-03 opened access and handed occupants to EMS.' },
          { time: '02:07', text: 'Arjun confirmed agency responsibilities and reporter safety.' },
          { time: '01:55', text: 'Ambulance A-27 joined and staged outside tree hazard.' },
        ],
      },
      unit: {
        status: 'Assessing',
        eta: 'On scene',
        assignment: 'Assess evacuated occupants',
        access: 'Fire F-03 created safe exit access',
        agencies: 'Fire F-03 clearing branches; Police P-12 managing traffic',
        closure: 'Ready to close',
        handoffStatus: 'Select status',
        handoffDetail: 'EMS checks occupants after fire/rescue creates safe exit access.',
      },
    },
  },
  {
    id: 'ems-clear',
    time: '02:33',
    audio: 'assets/dialogue/14-ems-clear.wav',
    focus: ['unitBrief', 'handoff', 'reporterGuidance'],
    kicker: 'Beat 14',
    title: 'EMS confirms no injuries',
    speaker: 'Ambulance A-27',
    responsibility: 'Medical assessment and safe evacuation',
    text: 'A twenty seven assessing now. Both occupants are alert, walking, and no injuries are found. Vitals are stable. No transport is needed; we are documenting safe evacuation.',
    state: {
      highlights: ['unit', 'dispatcher', 'reporter'],
      call: {
        reporter: 'Ready to release',
        unit: 'Assessing',
        speaking: 'unit',
        line: 'Ambulance A-27: Both occupants are alert, walking and no injuries are found.',
      },
      safety: {
        title: 'Happy ending confirmed',
        items: ['Occupants evacuated safely.', 'EMS found no injuries.', 'Maya can now be thanked and released from the call.'],
      },
      reporter: {
        status: 'Safe ending',
        live: 'CALL ENDING',
        liveActive: false,
        bridge: 'Release pending',
        messages: [{ type: 'system', text: 'EMS reports both occupants are safe with no injuries found.' }],
      },
      dispatcher: {
        sceneTitle: 'No injuries found',
        sceneDetail: 'The demo ends positively while still showing why fire/rescue, EMS and police were all necessary.',
        known: ['Two occupants evacuated', 'No injuries found', 'No transport needed', 'Police reopening controlled lane'],
        needs: ['Final no-injury handoff comment'],
        timeline: [
          { time: '02:33', text: 'EMS confirmed both occupants safe; no injuries found.' },
          { time: '02:20', text: 'Fire Rescue F-03 opened access and handed occupants to EMS.' },
          { time: '02:07', text: 'Arjun confirmed agency responsibilities and reporter safety.' },
        ],
      },
      unit: {
        status: 'No injury found',
        eta: 'On scene',
        assignment: 'No-injury medical clearance',
        access: 'Occupants evacuated through cleared safe exit',
        closure: 'No-injury closure',
        handoffStatus: 'No injuries found',
        handoffDetail: 'Both occupants alert, walking, vitals stable. No transport needed.',
      },
    },
  },
  {
    id: 'close',
    time: '02:45',
    audio: 'assets/dialogue/15-close.wav',
    focus: ['handoff', 'timeline', 'callBridge'],
    kicker: 'Beat 15',
    title: 'No-injury handoff closed',
    speaker: 'Arjun',
    responsibility: 'Closes the reporter call after EMS final status',
    text: 'A twenty seven reports two occupants evacuated, no injuries found, and no transport required. Fire is clearing branches. Police is reopening one lane. Maya, thank you; you can end your call.',
    state: {
      highlights: ['unit', 'dispatcher'],
      call: {
        status: 'Handoff closed',
        reporter: 'Released',
        dispatcher: 'Closed',
        unit: 'Closed',
        police: 'Reopening lane',
        fire: 'Clearing branches',
        live: ['dispatcher', 'unit', 'police'],
        speaking: 'dispatcher',
        line: 'Arjun: A-27 reports no injuries and no transport required. Maya, you can end your call.',
      },
      action: { status: 'No-injury handoff closed', active: 'close', done: ['answer', 'camera', 'guide', 'verify', 'codeblue', 'dispatch', 'fire', 'police', 'ems', 'close'] },
      safety: {
        title: 'Reporter released',
        items: ['Maya is thanked and released.', 'No unnecessary continued exposure.', 'Final thread records no injuries and no transport.'],
      },
      reporter: {
        status: 'Handoff closed',
        live: 'CALL ENDED',
        scene: 'Safe evacuation completed',
        action: 'Report closed',
        bridge: 'Reporter released',
        messages: [{ type: 'dispatcher', text: 'Maya, thank you. Everyone is safe. You can end your part of the call.' }],
      },
      dispatcher: {
        status: 'Closed',
        rec: 'CALL ENDED',
        recActive: false,
        incident: 'No-injury rescue closed',
        confidence: 'Closed',
        confidenceWidth: '100%',
        sceneTitle: 'Final handoff comment received',
        sceneDetail: 'Two occupants evacuated with no injuries. Fire clears branches; police reopens one lane. Arjun releases Maya from the call.',
        known: ['No injuries found', 'No transport required', 'Fire clearing branches', 'Police reopening lane'],
        needs: ['No further dispatcher action in this demo'],
        timeline: [
          { time: '02:45', text: 'Handoff closed: no injuries, no transport required.' },
          { time: '02:33', text: 'EMS confirmed both occupants safe; no injuries found.' },
          { time: '02:20', text: 'Fire Rescue F-03 opened access and handed occupants to EMS.' },
        ],
      },
      unit: {
        status: 'Handoff closed',
        eta: 'Closed',
        assignment: 'No-injury evacuation complete',
        access: 'Safe exit cleared by Fire F-03',
        agencies: 'Fire clearing branches; Police P-12 reopening lane',
        bridge: 'Final update sent',
        closure: 'No injuries found',
        handoffStatus: 'No injuries found',
        handoffDetail: 'Two occupants evacuated, alert and walking. Vitals stable. No transport required.',
      },
    },
  },
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeState(base, patch = {}) {
  const output = deepClone(base);
  Object.entries(patch).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      output[key] = mergeState(output[key] || {}, value);
    } else {
      output[key] = value;
    }
  });
  return output;
}

let rollingState = deepClone(seedState);
const steps = beats.map((beat) => {
  rollingState = mergeState(rollingState, beat.state);
  return { ...beat, ...deepClone(rollingState) };
});

const elapsedTime = document.querySelector('#elapsedTime');
const timelineProgress = document.querySelector('#timelineProgress');
const stepKicker = document.querySelector('#stepKicker');
const stepTitle = document.querySelector('#stepTitle');
const stepNote = document.querySelector('#stepNote');
const spokenCaption = document.querySelector('#spokenCaption');
const startSimulation = document.querySelector('#startSimulation');
const pauseSimulation = document.querySelector('#pauseSimulation');
const continueSimulation = document.querySelector('#continueSimulation');
const stepSimulation = document.querySelector('#stepSimulation');
const restartSimulation = document.querySelector('#restartSimulation');
const exitJourney = document.querySelector('#exitJourney');
const autoPauseToggle = document.querySelector('#autoPauseToggle');
const narrationToggle = document.querySelector('#narrationToggle');
const audioStatus = document.querySelector('#audioStatus');
const storyAudio = document.querySelector('#storyAudio');
const jumpButtons = document.querySelectorAll('.step-jump button');
const completionActions = document.querySelector('#completionActions');

const dispatcherSplash = document.querySelector('#dispatcherSplash');
const unitSplash = document.querySelector('#unitSplash');

const reporterStatusSim = document.querySelector('#reporterStatusSim');
const reporterModeSim = document.querySelector('#reporterModeSim');
const reporterLiveChip = document.querySelector('#reporterLiveChip');
const reporterSceneLabel = document.querySelector('#reporterSceneLabel');
const reporterActionSim = document.querySelector('#reporterActionSim');
const reporterLocationSim = document.querySelector('#reporterLocationSim');
const reporterTowerSim = document.querySelector('#reporterTowerSim');
const reporterBatterySim = document.querySelector('#reporterBatterySim');
const reporterCallBridgeSim = document.querySelector('#reporterCallBridgeSim');
const reporterMessages = document.querySelector('#reporterMessages');
const safetyGuidanceTitle = document.querySelector('#safetyGuidanceTitle');
const safetyGuidanceList = document.querySelector('#safetyGuidanceList');

const dispatcherStatusSim = document.querySelector('#dispatcherStatusSim');
const dispatcherRecSim = document.querySelector('#dispatcherRecSim');
const dispatcherSceneTitle = document.querySelector('#dispatcherSceneTitle');
const dispatcherSceneDetail = document.querySelector('#dispatcherSceneDetail');
const dispatcherIncidentTitle = document.querySelector('#dispatcherIncidentTitle');
const dispatcherConfidence = document.querySelector('#dispatcherConfidence');
const dispatcherConfidenceBar = document.querySelector('#dispatcherConfidenceBar');
const knownList = document.querySelector('#knownList');
const needsList = document.querySelector('#needsList');
const timelineCount = document.querySelector('#timelineCount');
const simulationTimeline = document.querySelector('#simulationTimeline');
const agencyCards = document.querySelectorAll('.agency-card');

const callBridgePanel = document.querySelector('.call-bridge-panel');
const callBridgeStatus = document.querySelector('#callBridgeStatus');
const reporterParticipantState = document.querySelector('#reporterParticipantState');
const dispatcherParticipantState = document.querySelector('#dispatcherParticipantState');
const unitParticipantState = document.querySelector('#unitParticipantState');
const policeParticipantState = document.querySelector('#policeParticipantState');
const fireParticipantState = document.querySelector('#fireParticipantState');
const participantCards = document.querySelectorAll('.participant-card');
const activeSpeakerLine = document.querySelector('#activeSpeakerLine');
const activeActionStatus = document.querySelector('#activeActionStatus');
const actionButtons = document.querySelectorAll('.action-buttons button');

const unitStatusSim = document.querySelector('#unitStatusSim');
const unitEtaSim = document.querySelector('#unitEtaSim');
const unitAssignmentSim = document.querySelector('#unitAssignmentSim');
const unitAccessSim = document.querySelector('#unitAccessSim');
const unitAgenciesSim = document.querySelector('#unitAgenciesSim');
const unitCallBridgeSim = document.querySelector('#unitCallBridgeSim');
const unitClosureSim = document.querySelector('#unitClosureSim');
const handoffStatusSim = document.querySelector('#handoffStatusSim');
const handoffDetailSim = document.querySelector('#handoffDetailSim');

const deviceFrames = {
  reporter: document.querySelector('#reporterDevice'),
  dispatcher: document.querySelector('#dispatcherDevice'),
  unit: document.querySelector('#unitDevice'),
};

const focusTargets = {
  reporterAction: [reporterActionSim],
  reporterScene: [document.querySelector('#reporterDevice .scene-card')],
  reporterGuidance: [document.querySelector('.safety-guidance-card')],
  reporterMessages: [reporterMessages],
  dispatcherScene: [document.querySelector('.dispatch-scene')],
  dispatcherBrief: [document.querySelector('.incident-brief-sim')],
  knownNeeds: [document.querySelector('.known-grid')],
  callBridge: [document.querySelector('.call-bridge-panel')],
  actionBoard: [document.querySelector('.action-board')],
  agencies: [document.querySelector('.agency-board')],
  timeline: [document.querySelector('.timeline-board')],
  unitMap: [document.querySelector('.unit-map-sim')],
  unitBrief: [document.querySelector('.unit-brief-sim')],
  handoff: [document.querySelector('.handoff-card-sim')],
};

let currentStepIndex = 0;
let playbackTimer = null;
let ringTimer = null;
let ringAudioContext = null;
let ringNodes = [];
let ringRunId = 0;
let ringPlayedStepId = null;
let isRunning = false;
let currentAudioStepId = null;
let autoScrollEnabled = false;

function hideCompletionActions() {
  if (completionActions) completionActions.hidden = true;
}

function showCompletionActions() {
  if (!completionActions) return;
  completionActions.hidden = false;
  document.body.classList.remove('journey-mode');
  autoScrollEnabled = false;
  window.requestAnimationFrame(() => {
    completionActions.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function clearChildren(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function renderTextList(node, items = []) {
  clearChildren(node);
  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    node.append(listItem);
  });
}

function renderReporterMessages(items = []) {
  clearChildren(reporterMessages);
  items.forEach((item) => {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${item.type === 'system' ? 'system' : ''}`.trim();
    bubble.textContent = item.text;
    reporterMessages.append(bubble);
  });
}

function renderTimeline(items = []) {
  clearChildren(simulationTimeline);
  items.forEach((item) => {
    const listItem = document.createElement('li');
    const time = document.createElement('time');
    const text = document.createElement('span');
    time.textContent = item.time;
    text.textContent = item.text;
    listItem.append(time, text);
    simulationTimeline.append(listItem);
  });
  timelineCount.textContent = `${items.length} ${items.length === 1 ? 'event' : 'events'}`;
}

function renderSafety(items = []) {
  clearChildren(safetyGuidanceList);
  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    safetyGuidanceList.append(listItem);
  });
}

function applyAgencyState(agencies = {}) {
  agencyCards.forEach((card) => {
    const state = agencies[card.dataset.agency];
    card.classList.toggle('active', state === 'active');
    card.classList.toggle('standby', state === 'standby');
  });
}

function applyHighlights(highlights = []) {
  Object.entries(deviceFrames).forEach(([key, frame]) => {
    frame.classList.toggle('active', highlights.includes(key));
  });
}

function applyScreenEntry(screens) {
  dispatcherSplash.classList.toggle('hidden', Boolean(screens.dispatcher));
  unitSplash.classList.toggle('hidden', Boolean(screens.unit));
}

function applyFocus(focusKeys = []) {
  document.querySelectorAll('.sim-focus').forEach((node) => node.classList.remove('sim-focus'));
  focusKeys.forEach((key) => {
    (focusTargets[key] || []).forEach((node) => {
      if (node) node.classList.add('sim-focus');
    });
  });
}

function scrollToFocusedArea(focusKeys = []) {
  if (!autoScrollEnabled) return;

  const target = focusKeys
    .flatMap((key) => focusTargets[key] || [])
    .find((node) => node && node.offsetParent !== null);

  if (!target) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  });
}

function applyCallBridge(call) {
  callBridgeStatus.textContent = call.status;
  reporterParticipantState.textContent = call.reporter;
  dispatcherParticipantState.textContent = call.dispatcher;
  unitParticipantState.textContent = call.unit;
  policeParticipantState.textContent = call.police;
  fireParticipantState.textContent = call.fire;
  activeSpeakerLine.textContent = call.line;

  participantCards.forEach((card) => {
    const participant = card.dataset.participant;
    card.classList.toggle('live', call.live.includes(participant));
    card.classList.toggle('speaking', call.speaking === participant);
  });
}

function applyActionState(action) {
  activeActionStatus.textContent = action.status;
  actionButtons.forEach((button) => {
    const key = button.dataset.action;
    button.classList.toggle('active', action.active === key);
    button.classList.toggle('done', action.done.includes(key));
  });
}

function updateControlState() {
  const atStart = currentStepIndex === 0;
  const atEnd = currentStepIndex === steps.length - 1;
  startSimulation.disabled = isRunning || !atStart;
  pauseSimulation.disabled = !isRunning;
  continueSimulation.disabled = isRunning || atEnd;
  stepSimulation.disabled = isRunning || atEnd;
  restartSimulation.disabled = isRunning ? false : atStart;
  jumpButtons.forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.step) === currentStepIndex);
  });
}

function applyStep(index) {
  const step = steps[index];
  const previousStep = steps[currentStepIndex];
  if (previousStep?.id !== step.id) ringPlayedStepId = null;
  currentStepIndex = index;

  elapsedTime.textContent = step.time;
  timelineProgress.style.width = `${(index / (steps.length - 1)) * 100}%`;
  stepKicker.textContent = `${step.kicker} · ${step.speaker}`;
  stepTitle.textContent = step.title;
  stepNote.textContent = step.responsibility;
  spokenCaption.textContent = step.text;

  reporterStatusSim.textContent = step.reporter.status;
  reporterModeSim.textContent = step.reporter.mode;
  reporterLiveChip.textContent = step.reporter.live;
  reporterLiveChip.classList.toggle('live', step.reporter.liveActive);
  reporterSceneLabel.textContent = step.reporter.scene;
  reporterActionSim.textContent = step.reporter.action;
  reporterActionSim.classList.toggle('done', step.reporter.actionDone);
  reporterLocationSim.textContent = step.reporter.location;
  reporterTowerSim.textContent = step.reporter.tower;
  reporterBatterySim.textContent = step.reporter.battery;
  reporterCallBridgeSim.textContent = step.reporter.bridge;
  renderReporterMessages(step.reporter.messages);
  safetyGuidanceTitle.textContent = step.safety.title;
  renderSafety(step.safety.items);

  dispatcherStatusSim.textContent = step.dispatcher.status;
  dispatcherRecSim.textContent = step.dispatcher.rec;
  dispatcherRecSim.classList.toggle('live', step.dispatcher.recActive);
  dispatcherSceneTitle.textContent = step.dispatcher.sceneTitle;
  dispatcherSceneDetail.textContent = step.dispatcher.sceneDetail;
  dispatcherIncidentTitle.textContent = step.dispatcher.incident;
  dispatcherConfidence.textContent = step.dispatcher.confidence;
  dispatcherConfidenceBar.style.width = step.dispatcher.confidenceWidth;
  renderTextList(knownList, step.dispatcher.known);
  renderTextList(needsList, step.dispatcher.needs);
  applyAgencyState(step.dispatcher.agencies);
  renderTimeline(step.dispatcher.timeline);
  applyCallBridge(step.call);
  applyActionState(step.action);

  unitStatusSim.textContent = step.unit.status;
  unitEtaSim.textContent = step.unit.eta;
  unitAssignmentSim.textContent = step.unit.assignment;
  unitAccessSim.textContent = step.unit.access;
  unitAgenciesSim.textContent = step.unit.agencies;
  unitCallBridgeSim.textContent = step.unit.bridge;
  unitClosureSim.textContent = step.unit.closure;
  handoffStatusSim.textContent = step.unit.handoffStatus;
  handoffDetailSim.textContent = step.unit.handoffDetail;

  applyScreenEntry(step.screens);
  applyHighlights(step.highlights);
  applyFocus(step.focus);
  updateControlState();
  scrollToFocusedArea(step.focus);
}

function stopFallbackTimer() {
  window.clearTimeout(playbackTimer);
  playbackTimer = null;
}

function stopIncomingRing({ invalidate = true } = {}) {
  if (invalidate) ringRunId += 1;
  window.clearTimeout(ringTimer);
  ringTimer = null;
  callBridgePanel?.classList.remove('ringing');
  ringNodes.forEach((node) => {
    try {
      node.stop();
    } catch {
      // Oscillator may already be stopped.
    }
    try {
      node.disconnect();
    } catch {
      // Node may already be disconnected.
    }
  });
  ringNodes = [];
}

function scheduleRingTone(context, destination, startAt, duration) {
  const gain = context.createGain();
  const toneA = context.createOscillator();
  const toneB = context.createOscillator();
  toneA.type = 'sine';
  toneB.type = 'sine';
  toneA.frequency.setValueAtTime(440, startAt);
  toneB.frequency.setValueAtTime(480, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.035);
  gain.gain.setValueAtTime(0.12, startAt + duration - 0.045);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  toneA.connect(gain);
  toneB.connect(gain);
  gain.connect(destination);
  toneA.start(startAt);
  toneB.start(startAt);
  toneA.stop(startAt + duration + 0.02);
  toneB.stop(startAt + duration + 0.02);
  ringNodes.push(toneA, toneB);
}

async function playIncomingRingBefore(step) {
  stopIncomingRing();
  const activeRingRunId = ++ringRunId;
  audioStatus.textContent = 'Incoming reporter call ringing';
  spokenCaption.textContent = 'Ring… Maya’s one-tap report is connecting to dispatcher Arjun.';
  callBridgePanel?.classList.add('ringing', 'sim-focus');
  callBridgeStatus.textContent = 'Incoming reporter call';
  reporterParticipantState.textContent = 'Calling';
  dispatcherParticipantState.textContent = 'Ringing';
  activeSpeakerLine.textContent = 'Ring… Sahaay is connecting Maya to Arjun before the live incident bridge opens.';
  dispatcherRecSim.textContent = 'RINGING';
  dispatcherRecSim.classList.add('live');
  participantCards.forEach((card) => {
    const participant = card.dataset.participant;
    card.classList.toggle('live', participant === 'reporter' || participant === 'dispatcher');
    card.classList.remove('speaking');
  });

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      ringAudioContext = ringAudioContext || new AudioContextClass();
      await ringAudioContext.resume();
      const startAt = ringAudioContext.currentTime + 0.05;
      scheduleRingTone(ringAudioContext, ringAudioContext.destination, startAt, 0.54);
      scheduleRingTone(ringAudioContext, ringAudioContext.destination, startAt + 0.78, 0.54);
    }
  } catch {
    audioStatus.textContent = 'Call ring unavailable; opening live bridge';
  }

  return new Promise((resolve) => {
    ringTimer = window.setTimeout(() => {
      if (activeRingRunId !== ringRunId) return;
      ringPlayedStepId = step.id;
      stopIncomingRing({ invalidate: false });
      if (steps[currentStepIndex]?.id === step.id) applyStep(currentStepIndex);
      resolve();
    }, CALL_RING_DURATION_MS);
  });
}

function finishOrAdvance() {
  if (!isRunning) {
    updateControlState();
    return;
  }
  if (autoPauseToggle.checked || currentStepIndex >= steps.length - 1) {
    isRunning = false;
    audioStatus.textContent = currentStepIndex >= steps.length - 1 ? 'Story complete' : 'Paused after beat';
    updateControlState();
    if (currentStepIndex >= steps.length - 1) showCompletionActions();
    return;
  }
  applyStep(currentStepIndex + 1);
  playCurrentNarration();
}

function runTimedFallback() {
  stopFallbackTimer();
  playbackTimer = window.setTimeout(finishOrAdvance, FALLBACK_INTERVAL_MS);
}

function playCurrentNarration() {
  const step = steps[currentStepIndex];
  stopFallbackTimer();
  storyAudio.onended = null;
  storyAudio.onerror = null;

  if (!narrationToggle.checked || !step.audio) {
    audioStatus.textContent = 'Captions-only story mode';
    runTimedFallback();
    return;
  }

  if (step.ringBefore && ringPlayedStepId !== step.id && currentAudioStepId !== `${step.id}:ringing`) {
    currentAudioStepId = `${step.id}:ringing`;
    playIncomingRingBefore(step).then(() => {
      if (!isRunning || steps[currentStepIndex]?.id !== step.id || !narrationToggle.checked) return;
      currentAudioStepId = null;
      playCurrentNarration();
    });
    return;
  }

  if (currentAudioStepId !== step.id) {
    storyAudio.src = step.audio;
    storyAudio.currentTime = 0;
    currentAudioStepId = step.id;
  }

  audioStatus.textContent = `Playing ${step.speaker} line`;
  storyAudio.onended = finishOrAdvance;
  storyAudio.onerror = () => {
    audioStatus.textContent = 'Audio unavailable; continuing with captions';
    runTimedFallback();
  };

  const playRequest = storyAudio.play();
  if (playRequest && typeof playRequest.catch === 'function') {
    playRequest.catch(() => {
      audioStatus.textContent = 'Audio blocked by browser; continuing with captions';
      runTimedFallback();
    });
  }
}

function exitJourneyMode() {
  document.body.classList.remove('journey-mode');
  autoScrollEnabled = false;
  const cockpitTop = document.querySelector('.simulation-cockpit')?.offsetTop || 0;
  window.scrollTo({ top: Math.max(cockpitTop - 80, 0), behavior: 'smooth' });
  audioStatus.textContent = isRunning ? 'Exited full-screen view; story still running' : 'Exited full-screen view';
  updateControlState();
}

function startStory() {
  hideCompletionActions();
  stopFallbackTimer();
  stopIncomingRing();
  storyAudio.pause();
  document.body.classList.add('journey-mode');
  autoScrollEnabled = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  ringPlayedStepId = null;
  currentAudioStepId = null;
  isRunning = true;
  applyStep(0);
  updateControlState();
  playCurrentNarration();
}

function pauseStory() {
  if (!isRunning) return;
  isRunning = false;
  if (currentAudioStepId === `${steps[currentStepIndex]?.id}:ringing`) {
    currentAudioStepId = null;
    ringPlayedStepId = null;
  }
  stopIncomingRing();
  storyAudio.pause();
  stopFallbackTimer();
  audioStatus.textContent = 'Paused by evaluator';
  updateControlState();
}

function continueStory() {
  if (currentStepIndex >= steps.length - 1) return;
  document.body.classList.add('journey-mode');
  autoScrollEnabled = true;
  isRunning = true;
  updateControlState();
  playCurrentNarration();
}

function stopStoryAndApply(index) {
  hideCompletionActions();
  isRunning = false;
  stopFallbackTimer();
  stopIncomingRing();
  storyAudio.pause();
  storyAudio.currentTime = 0;
  ringPlayedStepId = null;
  currentAudioStepId = null;
  document.body.classList.add('journey-mode');
  autoScrollEnabled = true;
  audioStatus.textContent = 'Beat selected; press continue for audio';
  applyStep(index);
  if (index >= steps.length - 1) showCompletionActions();
}

startSimulation.addEventListener('click', startStory);
pauseSimulation.addEventListener('click', pauseStory);
continueSimulation.addEventListener('click', continueStory);

stepSimulation.addEventListener('click', () => {
  if (currentStepIndex < steps.length - 1) stopStoryAndApply(currentStepIndex + 1);
});

restartSimulation.addEventListener('click', () => {
  stopStoryAndApply(0);
  audioStatus.textContent = 'Story reset';
});

exitJourney.addEventListener('click', exitJourneyMode);

jumpButtons.forEach((button) => {
  button.addEventListener('click', () => {
    stopStoryAndApply(Number(button.dataset.step));
  });
});

narrationToggle.addEventListener('change', () => {
  if (!narrationToggle.checked) {
    stopIncomingRing();
    storyAudio.pause();
    audioStatus.textContent = 'Captions-only story mode';
    if (isRunning) runTimedFallback();
    return;
  }
  audioStatus.textContent = 'Dialogue audio ready';
  if (isRunning) playCurrentNarration();
});

window.addEventListener('beforeunload', () => {
  stopIncomingRing();
  storyAudio.pause();
});

applyStep(0);
