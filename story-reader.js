const storyReader = document.querySelector('#storyReader');
const readStoryButton = document.querySelector('#readStoryButton');
const playStoryButton = document.querySelector('#playStoryButton');
const storyReaderImage = document.querySelector('#storyReaderImage');
const storyImageWrap = document.querySelector('#storyImageWrap');
const storyLens = document.querySelector('#storyLens');
const storyFocusFrame = document.querySelector('#storyFocusFrame');
const storyPanelLabel = document.querySelector('#storyPanelLabel');
const storyProgressBar = document.querySelector('#storyProgressBar');
const storyPanelTitle = document.querySelector('#storyPanelTitle');
const storyPanelCaption = document.querySelector('#storyPanelCaption');
const storyPrevious = document.querySelector('#storyPrevious');
const storyNext = document.querySelector('#storyNext');
const storyPlayToggle = document.querySelector('#storyPlayToggle');

const storyPanels = [
  { title: 'Incident discovery', caption: 'Maya discovers the van trapped beneath a fallen tree.', left: 0, top: 0, width: 38, height: 32 },
  { title: 'Maya reports', caption: 'Maya opens Sahaay and sends a one-tap incident report.', left: 38, top: 0, width: 22, height: 32 },
  { title: 'Live bridge', caption: 'Arjun joins Maya and asks for a safe view of the scene.', left: 60, top: 0, width: 40, height: 32 },
  { title: 'Facts verified', caption: 'The dispatcher separates what is known from what is still uncertain.', left: 0, top: 32, width: 27, height: 32 },
  { title: 'Shared incident bridge', caption: 'Reporter, dispatcher and response teams share one picture.', left: 27, top: 32, width: 38, height: 56 },
  { title: 'Coordinated response', caption: 'Fire rescue, police and EMS move with clear responsibilities.', left: 65, top: 32, width: 35, height: 32 },
  { title: 'Safe evacuation', caption: 'The tree is cleared and EMS checks the passengers.', left: 0, top: 64, width: 27, height: 24 },
  { title: 'Closure and handoff', caption: 'Everyone is safely out. No injuries are found, and the handoff closes.', left: 65, top: 64, width: 35, height: 24 },
];

let storyPanelIndex = 0;
let storyPlayTimer = null;
const storyZoom = 2.35;

function renderStoryPanel(index) {
  storyPanelIndex = Math.max(0, Math.min(index, storyPanels.length - 1));
  const panel = storyPanels[storyPanelIndex];
  storyPanelLabel.textContent = `Panel ${storyPanelIndex + 1} of ${storyPanels.length}`;
  storyProgressBar.style.width = `${((storyPanelIndex + 1) / storyPanels.length) * 100}%`;
  storyPanelTitle.textContent = panel.title;
  storyPanelCaption.textContent = panel.caption;
  storyFocusFrame.style.left = `${panel.left}%`;
  storyFocusFrame.style.top = `${panel.top}%`;
  storyFocusFrame.style.width = `${panel.width}%`;
  storyFocusFrame.style.height = `${panel.height}%`;
  storyPrevious.disabled = storyPanelIndex === 0;
  storyNext.disabled = storyPanelIndex === storyPanels.length - 1;
  centerStoryLens();
}

function centerStoryLens() {
  if (!storyImageWrap || !storyReaderImage.naturalWidth) return;
  const rect = storyReaderImage.getBoundingClientRect();
  const lensSize = storyLens.getBoundingClientRect().width || 190;
  const x = rect.width * (storyPanels[storyPanelIndex].left + storyPanels[storyPanelIndex].width / 2) / 100;
  const y = rect.height * (storyPanels[storyPanelIndex].top + storyPanels[storyPanelIndex].height / 2) / 100;
  positionStoryLens(x, y, rect, lensSize);
}

function positionStoryLens(x, y, imageRect, lensSize) {
  const wrapRect = storyImageWrap.getBoundingClientRect();
  storyLens.style.left = `${imageRect.left - wrapRect.left + x}px`;
  storyLens.style.top = `${imageRect.top - wrapRect.top + y}px`;
  storyLens.style.backgroundImage = `url("${storyReaderImage.currentSrc || storyReaderImage.src}")`;
  storyLens.style.backgroundSize = `${imageRect.width * storyZoom}px ${imageRect.height * storyZoom}px`;
  storyLens.style.backgroundPosition = `${-(x * storyZoom - lensSize / 2)}px ${-(y * storyZoom - lensSize / 2)}px`;
}

function playStory() {
  if (storyPlayTimer) return;
  storyPlayToggle.innerHTML = 'Pause story <span>Ⅱ</span>';
  playStoryButton.innerHTML = 'Playing story <span>Ⅱ</span>';
  storyPlayTimer = window.setInterval(() => {
    if (storyPanelIndex >= storyPanels.length - 1) {
      stopStory();
      return;
    }
    renderStoryPanel(storyPanelIndex + 1);
  }, 2800);
}

function stopStory() {
  window.clearInterval(storyPlayTimer);
  storyPlayTimer = null;
  storyPlayToggle.innerHTML = 'Play story <span>▶</span>';
  playStoryButton.innerHTML = 'Play story <span>▶</span>';
}

function openStory({ autoplay = false } = {}) {
  storyReader.hidden = false;
  storyReader.setAttribute('aria-hidden', 'false');
  document.body.classList.add('story-reader-open');
  renderStoryPanel(0);
  window.requestAnimationFrame(() => {
    centerStoryLens();
    storyReaderCloseButton?.focus();
  });
  if (autoplay) playStory();
}

function closeStory() {
  stopStory();
  storyReader.hidden = true;
  storyReader.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('story-reader-open');
  readStoryButton?.focus();
}

const storyReaderCloseButton = document.querySelector('.story-reader-close');
readStoryButton?.addEventListener('click', () => openStory());
playStoryButton?.addEventListener('click', () => openStory({ autoplay: true }));
storyReaderCloseButton?.addEventListener('click', closeStory);
document.querySelectorAll('[data-story-close]').forEach((element) => element.addEventListener('click', closeStory));
storyPrevious?.addEventListener('click', () => { stopStory(); renderStoryPanel(storyPanelIndex - 1); });
storyNext?.addEventListener('click', () => { stopStory(); renderStoryPanel(storyPanelIndex + 1); });
storyPlayToggle?.addEventListener('click', () => (storyPlayTimer ? stopStory() : playStory()));

storyReaderImage?.addEventListener('load', centerStoryLens);
storyImageWrap?.addEventListener('pointermove', (event) => {
  const imageRect = storyReaderImage.getBoundingClientRect();
  if (event.clientX < imageRect.left || event.clientX > imageRect.right || event.clientY < imageRect.top || event.clientY > imageRect.bottom) return;
  const lensSize = storyLens.getBoundingClientRect().width || 190;
  positionStoryLens(event.clientX - imageRect.left, event.clientY - imageRect.top, imageRect, lensSize);
});

document.addEventListener('keydown', (event) => {
  if (storyReader.hidden) return;
  if (event.key === 'Escape') closeStory();
  if (event.key === 'ArrowLeft') { stopStory(); renderStoryPanel(storyPanelIndex - 1); }
  if (event.key === 'ArrowRight') { stopStory(); renderStoryPanel(storyPanelIndex + 1); }
});

window.addEventListener('resize', centerStoryLens);
