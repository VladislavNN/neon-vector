const header = document.querySelector('[data-header]');
const cursor = document.querySelector('.cursor');
const trailerModal = document.querySelector('[data-trailer-modal]');
const openTrailerButtons = document.querySelectorAll('[data-open-trailer]');
const closeTrailerButton = document.querySelector('[data-close-trailer]');
const districtPanel = document.querySelector('[data-district-panel]');
const districtCopy = {
  'Helix Spire': 'Вертикальный корпоративный район: чистый воздух наверху, вечная ночь внизу.',
  'Rust Docks': 'Порт, где контрабанда имплантов идет быстрее официальных патчей безопасности.',
  'Null Market': 'Черный рынок воспоминаний, фальшивых биографий и одноразовых личностей.'
};
const districtAlerts = {
  'Helix Spire': ['Clean-air checkpoints active', 'Elevator routes monitored', 'Elite patrols in upper decks'],
  'Rust Docks': ['Smuggler convoys moving', 'Black-clinic doors open', 'Harbor fog hides contraband'],
  'Null Market': ['Identity auctions live', 'Camera ghosts detected', 'Memory brokers rerouting exits']
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
  document.documentElement.style.setProperty('--scroll-y', String(window.scrollY));
}, { passive: true });

openTrailerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    trailerModal.showModal();
    document.body.classList.add('modal-open');
  });
});

function closeTrailer() {
  trailerModal.close();
  document.body.classList.remove('modal-open');
}

closeTrailerButton.addEventListener('click', closeTrailer);
trailerModal.addEventListener('click', (event) => {
  if (event.target === trailerModal) closeTrailer();
});

function selectDistrict(district) {
  document.querySelectorAll('[data-district]').forEach((item) => {
    item.classList.toggle('active', item.dataset.district === district);
  });
  districtPanel.querySelector('strong').textContent = district;
  districtPanel.querySelector('p').textContent = districtCopy[district];
  const alertList = document.querySelector('[data-district-alerts]');
  if (alertList) {
    alertList.innerHTML = (districtAlerts[district] || []).map((item) => `<li>${item}</li>`).join('');
  }
  const activePin = document.querySelector(`.map-pin[data-district="${district}"]`);
  if (activePin) {
    document.documentElement.style.setProperty('--map-x', activePin.style.getPropertyValue('--x'));
    document.documentElement.style.setProperty('--map-y', activePin.style.getPropertyValue('--y'));
  }
}

document.querySelectorAll('.map-pin, .map-districts button').forEach((control) => {
  control.addEventListener('click', () => selectDistrict(control.dataset.district));
});

if (matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    document.body.classList.add('cursor-ready');
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('a, button, .tilt-card').forEach((element) => {
    element.addEventListener('pointerenter', () => cursor.classList.add('hot'));
    element.addEventListener('pointerleave', () => cursor.classList.remove('hot'));
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });
}

document.querySelector('.signup').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const original = button.textContent;
  button.textContent = 'Сигнал принят';
  setTimeout(() => { button.textContent = original; }, 1800);
});

const progress = document.querySelector('[data-progress]');
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const value = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
  document.documentElement.style.setProperty('--progress', `${Math.min(100, value)}%`);
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

document.querySelectorAll('.faction-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.faction-tabs button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.loadout-switcher button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.loadout-switcher button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});


const commandModal = document.querySelector('[data-command-modal]');
const openCommandButtons = document.querySelectorAll('[data-open-command]');
const closeCommandButton = document.querySelector('[data-close-command]');
const featureChecks = {
  viewTransition: () => 'startViewTransition' in document,
  hasSelector: () => CSS.supports('selector(:has(*))'),
  scrollTimeline: () => CSS.supports('animation-timeline: view()'),
  dialog: () => typeof HTMLDialogElement !== 'undefined',
  popover: () => 'popover' in HTMLElement.prototype
};

Object.entries(featureChecks).forEach(([key, check]) => {
  const badge = document.querySelector(`[data-feature="${key}"]`);
  if (!badge) return;
  const supported = check();
  badge.textContent = supported ? 'online' : 'standby';
  badge.classList.toggle('unsupported', !supported);
});

function openCommand() {
  if (!commandModal.open) {
    commandModal.showModal();
    document.body.classList.add('modal-open');
  }
}

function closeCommand() {
  commandModal.close();
  document.body.classList.remove('modal-open');
}

openCommandButtons.forEach((button) => button.addEventListener('click', openCommand));
closeCommandButton.addEventListener('click', closeCommand);
commandModal.addEventListener('click', (event) => {
  if (event.target === commandModal) closeCommand();
});

document.addEventListener('keydown', (event) => {
  const isCommandK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
  if (isCommandK) {
    event.preventDefault();
    openCommand();
  }
});

document.querySelectorAll('[data-jump]').forEach((button) => {
  button.addEventListener('click', () => {
    closeCommand();
    document.querySelector(button.dataset.jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

function toggleThemeMode() {
  const swap = () => document.body.classList.toggle('alt-mode');
  if ('startViewTransition' in document) {
    document.startViewTransition(swap);
  } else {
    swap();
  }
}

document.querySelector('[data-theme-toggle]')?.addEventListener('click', toggleThemeMode);

document.querySelector('[data-copy-link]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const label = button.querySelector('em');
  const original = label.textContent;
  try {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}#browser-lab`);
    label.textContent = 'Ссылка скопирована';
  } catch {
    label.textContent = 'Канал передачи недоступен';
  }
  setTimeout(() => { label.textContent = original; }, 1600);
});

window.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--spot-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--spot-y', `${event.clientY}px`);
}, { passive: true });

// Neural deck runtime systems.
const toastStack = document.querySelector('[data-toast-stack]');
const achievements = new Set();
function unlockAchievement(title, detail) {
  const key = `${title}:${detail}`;
  if (achievements.has(key) || !toastStack) return;
  achievements.add(key);
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  toastStack.append(toast);
  setTimeout(() => toast.remove(), 3600);
}

openTrailerButtons.forEach((button) => {
  button.addEventListener('click', () => unlockAchievement('Achievement unlocked', 'Trailer signal intercepted'));
});

document.querySelectorAll('.map-pin, .map-districts button').forEach((control) => {
  control.addEventListener('click', () => unlockAchievement('District readyned', control.dataset.district));
});

const signalCanvas = document.querySelector('[data-signal-canvas]');
const signalContext = signalCanvas?.getContext('2d');
const signalDots = [];
let signalAnimation = 0;
function resizeSignalCanvas() {
  if (!signalCanvas || !signalContext) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  signalCanvas.width = Math.floor(innerWidth * ratio);
  signalCanvas.height = Math.floor(innerHeight * ratio);
  signalCanvas.style.width = `${innerWidth}px`;
  signalCanvas.style.height = `${innerHeight}px`;
  signalContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  signalDots.length = 0;
  const count = Math.min(72, Math.max(28, Math.floor(innerWidth / 22)));
  for (let index = 0; index < count; index += 1) {
    signalDots.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.8 + .6
    });
  }
}
function drawSignalCanvas() {
  if (!signalCanvas || !signalContext || document.body.classList.contains('performance-mode')) return;
  signalContext.clearRect(0, 0, innerWidth, innerHeight);
  signalContext.fillStyle = 'rgba(66, 248, 255, .8)';
  signalContext.strokeStyle = 'rgba(66, 248, 255, .13)';
  for (const dot of signalDots) {
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < 0 || dot.x > innerWidth) dot.vx *= -1;
    if (dot.y < 0 || dot.y > innerHeight) dot.vy *= -1;
    signalContext.beginPath();
    signalContext.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    signalContext.fill();
  }
  for (let a = 0; a < signalDots.length; a += 1) {
    for (let b = a + 1; b < signalDots.length; b += 1) {
      const one = signalDots[a];
      const two = signalDots[b];
      const distance = Math.hypot(one.x - two.x, one.y - two.y);
      if (distance < 115) {
        signalContext.globalAlpha = 1 - distance / 115;
        signalContext.beginPath();
        signalContext.moveTo(one.x, one.y);
        signalContext.lineTo(two.x, two.y);
        signalContext.stroke();
      }
    }
  }
  signalContext.globalAlpha = 1;
  signalAnimation = requestAnimationFrame(drawSignalCanvas);
}
resizeSignalCanvas();
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) drawSignalCanvas();
window.addEventListener('resize', resizeSignalCanvas);

let selectedMod = '';
const loadoutState = new Map();
const scoreEl = document.querySelector('[data-loadout-score]');
const summaryEl = document.querySelector('[data-loadout-summary]');
function updateLoadout() {
  const count = loadoutState.size;
  if (scoreEl) scoreEl.textContent = `${String(count * 33 + (count === 3 ? 1 : 0)).padStart(2, '0')}%`;
  if (summaryEl) {
    const mods = [...loadoutState.values()];
    summaryEl.textContent = mods.length ? `Активные модули: ${mods.join(' / ')}.` : 'Перетащи модули в слоты или нажми на модуль, чтобы собрать билд на touch-устройствах.';
  }
  if (count === 3) unlockAchievement('Build complete', 'ARC-9 custom loadout assembled');
}
function placeMod(slot, mod) {
  if (!slot || !mod) return;
  loadoutState.set(slot.dataset.slot, mod);
  slot.classList.add('filled');
  slot.querySelector('span').textContent = mod;
  updateLoadout();
}
document.querySelectorAll('.mod-chip').forEach((chip) => {
  chip.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', chip.dataset.mod));
  chip.addEventListener('click', () => {
    selectedMod = chip.dataset.mod;
    document.querySelectorAll('.mod-chip').forEach((item) => item.classList.toggle('selected', item === chip));
  });
});
document.querySelectorAll('.drop-slot').forEach((slot) => {
  slot.addEventListener('dragover', (event) => {
    event.preventDefault();
    slot.classList.add('drag-over');
  });
  slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
  slot.addEventListener('drop', (event) => {
    event.preventDefault();
    slot.classList.remove('drag-over');
    placeMod(slot, event.dataTransfer.getData('text/plain'));
  });
  slot.addEventListener('click', () => placeMod(slot, selectedMod));
});

const terminalOutput = document.querySelector('[data-terminal-output]');
const terminalForm = document.querySelector('[data-terminal-form]');
function terminalLine(text) {
  if (!terminalOutput) return;
  const line = document.createElement('p');
  line.innerHTML = text;
  terminalOutput.append(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
const terminalCommands = {
  help: () => 'commands: <b>ready city</b>, <b>open map</b>, <b>theme</b>, <b>toast</b>, <b>clear</b>',
  'ready city': () => {
    unlockAchievement('Netrunner online', 'City telemetry readyned');
    return 'districts=3 / threat=87% / neural deck=online / route=unsafe';
  },
  'open map': () => {
    document.querySelector('#city')?.scrollIntoView({ behavior: 'smooth' });
    return 'opening Veyra-9 district map...';
  },
  theme: () => {
    toggleThemeMode();
    return 'visual profile switched';
  },
  toast: () => {
    unlockAchievement('Manual trigger', 'Toast system operational');
    return 'achievement toast dispatched';
  },
  clear: () => {
    terminalOutput.innerHTML = '';
    return '';
  }
};
terminalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = terminalForm.querySelector('input');
  const command = input.value.trim().toLowerCase() || 'help';
  terminalLine(`> ${command}`);
  const result = terminalCommands[command]?.() ?? `unknown command: ${command}. type <b>help</b>`;
  if (result) terminalLine(result);
  input.value = '';
});

const defaultSettings = { motion: true, grain: true, contrast: false, performance: false };
const savedSettings = JSON.parse(localStorage.getItem('neonVectorSettings') || 'null') || defaultSettings;
function applySettings(settings) {
  document.body.classList.toggle('reduce-motion', !settings.motion);
  document.body.classList.toggle('no-grain', !settings.grain);
  document.body.classList.toggle('high-contrast', settings.contrast);
  document.body.classList.toggle('performance-mode', settings.performance);
  if (settings.performance) cancelAnimationFrame(signalAnimation);
  if (!settings.performance && settings.motion) {
    cancelAnimationFrame(signalAnimation);
    drawSignalCanvas();
  }
}
document.querySelectorAll('[data-setting]').forEach((input) => {
  input.checked = Boolean(savedSettings[input.dataset.setting]);
  input.addEventListener('change', () => {
    savedSettings[input.dataset.setting] = input.checked;
    localStorage.setItem('neonVectorSettings', JSON.stringify(savedSettings));
    applySettings(savedSettings);
    unlockAchievement('Preferences saved', `${input.dataset.setting}: ${input.checked ? 'on' : 'off'}`);
  });
});
applySettings(savedSettings);

// Launcher cache, controller uplink, neural optics, mission sync.
if ('fieldCache' in navigator) {
  navigator.fieldCache.register('./sw.js')
    .then(() => unlockAchievement('Launcher ready', 'Field cache synchronized'))
    .catch(() => {});
}

const slider = document.querySelector('[data-vision-slider]');
let draggingVision = false;
function setVisionSplit(clientX) {
  if (!slider) return;
  const rect = slider.getBoundingClientRect();
  const value = Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100));
  slider.style.setProperty('--split', `${value}%`);
  if (value > 72) unlockAchievement('Neural optics', 'Overlay intensity boosted');
}
slider?.addEventListener('pointerdown', (event) => {
  draggingVision = true;
  slider.setPointerCapture(event.pointerId);
  setVisionSplit(event.clientX);
});
slider?.addEventListener('pointermove', (event) => {
  if (draggingVision) setVisionSplit(event.clientX);
});
slider?.addEventListener('pointerup', () => { draggingVision = false; });
slider?.addEventListener('pointercancel', () => { draggingVision = false; });

const timelineState = document.querySelector('[data-timeline-state]');
const timelineSteps = [...document.querySelectorAll('.timeline-steps article')];
function setTimelineStep(step) {
  if (!step) return;
  timelineSteps.forEach((item) => item.classList.toggle('active', item === step));
  if (timelineState) timelineState.textContent = step.dataset.step;
}
function updateTimelineStep() {
  if (!timelineSteps.length) return;
  const anchor = Math.min(innerHeight * 0.42, 420);
  let current = timelineSteps[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const step of timelineSteps) {
    const rect = step.getBoundingClientRect();
    const distance = Math.abs(rect.top - anchor);
    if (rect.top <= innerHeight * 0.72 && rect.bottom >= innerHeight * 0.18 && distance < bestDistance) {
      current = step;
      bestDistance = distance;
    }
  }
  setTimelineStep(current);
}
setTimelineStep(timelineSteps[0]);
updateTimelineStep();
window.addEventListener('scroll', updateTimelineStep, { passive: true });
window.addEventListener('resize', updateTimelineStep);

const gamepadCard = document.querySelector('.gamepad-card');
const gamepadStatus = document.querySelector('[data-gamepad-status]');
function updateGamepadStatus() {
  if (!('getGamepads' in navigator) || !gamepadCard || !gamepadStatus) return;
  const pad = [...navigator.getGamepads()].find(Boolean);
  gamepadCard.classList.toggle('connected', Boolean(pad));
  if (pad) {
    const pressed = pad.buttons.filter((button) => button.pressed).length;
    gamepadStatus.textContent = `${pad.id.split('(')[0].trim()} / buttons pressed: ${pressed}`;
    unlockAchievement('Controller uplink', 'Controller channel detected');
  } else {
    gamepadStatus.textContent = 'Геймпад не подключен';
  }
  requestAnimationFrame(updateGamepadStatus);
}
window.addEventListener('gamepadconnected', updateGamepadStatus);
window.addEventListener('gamepaddisconnected', updateGamepadStatus);
updateGamepadStatus();

featureChecks.fieldCache = () => 'fieldCache' in navigator;
featureChecks.gamepad = () => 'getGamepads' in navigator;
['fieldCache', 'gamepad'].forEach((key) => {
  const badge = document.querySelector(`[data-feature="${key}"]`);
  if (!badge) return;
  const supported = featureChecks[key]();
  badge.textContent = supported ? 'online' : 'standby';
  badge.classList.toggle('unsupported', !supported);
});


// Final game interface systems.
class NeonToast extends HTMLElement {
  connectedCallback() {
    this.classList.add('toast');
    setTimeout(() => this.remove(), 3600);
  }
}
customElements.define('neon-toast', NeonToast);

const originalUnlockAchievement = unlockAchievement;
unlockAchievement = function(title, detail) {
  const key = `${title}:${detail}`;
  if (achievements.has(key) || !toastStack) return;
  achievements.add(key);
  const toast = document.createElement('neon-toast');
  toast.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  toastStack.append(toast);
};

const bootScreen = document.querySelector('[data-boot-screen]');
const bootLine = document.querySelector('[data-boot-line]');
['loading city mesh', 'syncing field cache', 'warming neural deck', 'ready'].forEach((line, index) => {
  setTimeout(() => { if (bootLine) bootLine.textContent = line; }, 260 * index);
});
setTimeout(() => bootScreen?.classList.add('hidden'), 1250);

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  unlockAchievement('Launcher package ready', 'Install channel opened');
});
document.querySelector('[data-install-app]')?.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  } else {
    unlockAchievement('Install limited', 'Use system menu to install the field launcher');
  }
});

document.querySelector('[data-share-site]')?.addEventListener('click', async () => {
  const shareData = { title: 'NEON VECTOR', text: 'Enter Veyra-9 and intercept the Glass Saint contract', url: location.href.split('?')[0] };
  if (navigator.share) {
    try { await navigator.share(shareData); unlockAchievement('Signal shared', 'Encrypted signal transmitted'); } catch {}
  } else {
    await navigator.clipboard?.writeText(shareData.url);
    unlockAchievement('Signal saved', 'Coordinates copied');
  }
});
document.querySelector('[data-print-brief]')?.addEventListener('click', () => {
  unlockAchievement('Mission brief', 'Print stylesheet activated');
  setTimeout(() => window.print(), 120);
});

const fpsEl = document.querySelector('[data-fps]');
const swEl = document.querySelector('[data-sw-status]');
const cacheEl = document.querySelector('[data-cache-status]');
let fpsFrames = 0;
let fpsLast = performance.now();
function measureFps(now) {
  fpsFrames += 1;
  if (now - fpsLast >= 1000) {
    if (fpsEl) fpsEl.textContent = String(fpsFrames);
    fpsFrames = 0;
    fpsLast = now;
  }
  requestAnimationFrame(measureFps);
}
requestAnimationFrame(measureFps);
if (swEl) swEl.textContent = 'serviceWorker' in navigator ? 'online' : 'standby';
if (cacheEl) {
  caches?.keys?.().then((keys) => { cacheEl.textContent = keys.length ? 'ready' : 'empty'; }).catch(() => { cacheEl.textContent = 'standby'; });
}

function transitionToSection(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  const run = () => target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if ('startViewTransition' in document) document.startViewTransition(run); else run();
}
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#top') return;
    event.preventDefault();
    history.replaceState(null, '', href);
    transitionToSection(href);
  });
});

document.querySelectorAll('[data-jump]').forEach((button) => {
  button.addEventListener('click', () => {
    const jump = button.dataset.jump;
    if (jump) history.replaceState(null, '', jump);
  });
});

const timelineZone = document.querySelector('[data-timeline-zone]');
const timelineThreat = document.querySelector('[data-timeline-threat]');
const timelineVisual = document.querySelector('.timeline-visual');
const missionProgress = document.querySelector('[data-mission-progress]');
const previousSetTimelineStep = setTimelineStep;
setTimelineStep = function(step) {
  previousSetTimelineStep(step);
  if (!step) return;
  if (timelineZone) timelineZone.textContent = step.dataset.zone;
  if (timelineThreat) timelineThreat.textContent = step.dataset.threat;
  if (timelineVisual) timelineVisual.dataset.tone = step.dataset.tone;
  if (missionProgress) {
    const index = timelineSteps.indexOf(step);
    missionProgress.style.width = `${((index + 1) / timelineSteps.length) * 100}%`;
  }
};
updateTimelineStep();

const routeState = JSON.parse(localStorage.getItem('neonVectorRouteState') || '{}');
function saveRouteState(patch) {
  Object.assign(routeState, patch);
  localStorage.setItem('neonVectorRouteState', JSON.stringify(routeState));
}
document.querySelectorAll('.map-pin, .map-districts button').forEach((control) => {
  control.addEventListener('click', () => saveRouteState({ district: control.dataset.district }));
});
document.querySelectorAll('.drop-slot').forEach((slot) => {
  slot.addEventListener('click', () => saveRouteState({ loadoutScore: scoreEl?.textContent || '00%' }));
  slot.addEventListener('drop', () => setTimeout(() => saveRouteState({ loadoutScore: scoreEl?.textContent || '00%' }), 0));
});
if (routeState.district) selectDistrict(routeState.district);

const hotspotDescriptions = {
  'Drone route': 'Патруль дронов обновляется каждые 18 секунд.',
  'Hidden vendor': 'Нелегальный продавец появляется только при низком heat.',
  'Extraction path': 'Путь эвакуации открывается после отключения моста.'
};
document.querySelectorAll('.vision-hotspot').forEach((hotspot) => {
  hotspot.addEventListener('click', () => unlockAchievement(hotspot.dataset.hotspot, hotspotDescriptions[hotspot.dataset.hotspot] || 'Neural ready point'));
});




// Weapon profile switcher for the arsenal readout.
const weaponProfiles = {
  arc: {
    stats: [
      ['ARC-9 VANTA', 'rail pistol'],
      ['0.18s', 'neural lock'],
      ['5', 'ammo profiles']
    ],
    image: 'assets/weapon-arc9.png',
    alt: 'Футуристический рельсовый пистолет ARC-9 VANTA',
    label: 'BALLISTICS // ARC-9',
    bars: { Damage: '78%', Stealth: '38%', Control: '64%' }
  },
  mono: {
    stats: [
      ['MONO WIRE', 'close-range filament'],
      ['12m', 'silent reach'],
      ['3', 'counter modes']
    ],
    image: 'assets/weapon-monowire.png',
    alt: 'Киберпанк монопроволока MONO WIRE в тактическом наручном модуле',
    label: 'STEALTH // MONO WIRE',
    bars: { Damage: '52%', Stealth: '91%', Control: '72%' }
  },
  drone: {
    stats: [
      ['WRAITH DRONE', 'autonomous scout'],
      ['4', 'tagged targets'],
      ['90s', 'stealth battery']
    ],
    image: 'assets/weapon-wraith-drone.png',
    alt: 'Компактный разведывательный боевой дрон WRAITH DRONE на неоновой платформе',
    label: 'RECON // WRAITH DRONE',
    bars: { Damage: '42%', Stealth: '74%', Control: '96%' }
  }
};
const weaponReadout = document.querySelector('[data-weapon-readout]');
const weaponFrame = document.querySelector('[data-weapon-frame]') || document.querySelector('.weapon-frame');
const weaponImage = document.querySelector('[data-weapon-image]') || document.querySelector('.weapon-frame img');
const weaponBars = document.querySelector('[data-weapon-bars]');
function selectWeaponProfile(profile) {
  const data = weaponProfiles[profile] || weaponProfiles.arc;
  document.querySelectorAll('[data-weapon]').forEach((button) => button.classList.toggle('active', button.dataset.weapon === profile));
  if (weaponReadout) {
    weaponReadout.innerHTML = data.stats.map(([value, label]) => `<span><b>${value}</b> ${label}</span>`).join('');
  }
  if (weaponFrame) {
    weaponFrame.dataset.weaponLabel = data.label;
  }
  if (weaponBars) {
    weaponBars.innerHTML = Object.entries(data.bars).map(([label, value]) => `<span><b>${label}</b><i style="--v: ${value}"></i></span>`).join('');
  }
  if (weaponImage && weaponImage.getAttribute('src') !== data.image) {
    weaponFrame?.classList.add('is-switching');
    window.setTimeout(() => {
      weaponImage.src = data.image;
      weaponImage.alt = data.alt;
      weaponImage.onload = () => weaponFrame?.classList.remove('is-switching');
      window.setTimeout(() => weaponFrame?.classList.remove('is-switching'), 420);
    }, 120);
  }
  saveRouteState?.({ weapon: profile });
}
document.querySelectorAll('[data-weapon]').forEach((button) => {
  button.addEventListener('click', () => {
    selectWeaponProfile(button.dataset.weapon);
    unlockAchievement('Weapon profile', `${button.textContent.trim()} armed`);
  });
});
if (routeState?.weapon) selectWeaponProfile(routeState.weapon);

// Expansion pack: factions influence map, character abilities, editions, ambient city signal.
const factionDistrict = { helix: 'Helix Spire', chrome: 'Rust Docks', null: 'Null Market' };
const factionsSection = document.querySelector('.factions');
const factionIntel = {
  helix: ['Helix Directorate controls access to clean air, elevators and elite patrol routes.', 'Корпоративная поддержка снижает chaos, но повышает цену любой ошибки.'],
  chrome: ['Chrome Saints open black clinics, weapon mods and smuggler roads.', 'Улицы становятся быстрее и опаснее: больше апгрейдов, больше засад.'],
  null: ['Null Choir erases identities, camera trails and financial fingerprints.', 'Стелс-маршруты усиливаются, но город хуже отличает союзников от целей.']
};
document.querySelectorAll('[data-faction]').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('[data-faction]').forEach((item) => item.classList.toggle('active', item === card));
    const faction = card.dataset.faction;
    const mapShell = document.querySelector('[data-map-shell]');
    const intel = document.querySelector('[data-faction-intel]');
    if (factionsSection) factionsSection.dataset.activeFaction = faction;
    if (mapShell) mapShell.dataset.faction = faction;
    if (intel && factionIntel[faction]) {
      intel.querySelector('strong').textContent = factionIntel[faction][0];
      intel.querySelector('p').textContent = factionIntel[faction][1];
    }
    selectDistrict(factionDistrict[faction]);
    unlockAchievement('Faction influence', card.querySelector('h3')?.textContent || 'Faction selected');
  });
});

const abilityCopy = {
  dash: 'Dash break: рывок через линию огня с окном контратаки.',
  parry: 'Bullet parry: короткое окно отражения для элитных стрелков Helix.',
  deal: 'Street deal: снижает цену входа в районы Chrome Saints.',
  spoof: 'ID spoof: временно меняет профиль доступа в закрытых районах.',
  blind: 'Camera blind: гасит сетку наблюдения на один маршрут.',
  puppet: 'Drone puppet: перехватывает дрон и отмечает цели через стены.'
};
const selectedAbilities = { kael: 'dash', mira: 'spoof' };
const synergyCopy = {
  'dash:spoof': ['Ghost breach', 'Dash break + ID spoof открывают быстрый вход без полной тревоги района.'],
  'dash:blind': ['Blind sprint', 'Каэль прорывается через патруль, пока Мира гасит камеры на маршруте.'],
  'dash:puppet': ['Drone slingshot', 'Дрон вытягивает цели на линию рывка Каэля.'],
  'parry:spoof': ['Mirror guard', 'Отражение огня совпадает с подменой профиля охраны.'],
  'parry:blind': ['Blackout counter', 'Окно парирования становится безопаснее под слепой зоной камер.'],
  'parry:puppet': ['Crossfire loop', 'Перехваченный дрон держит цель в угле для контратаки.'],
  'deal:spoof': ['Market ghost', 'Уличные сделки проходят дешевле, когда ID выглядит легальным.'],
  'deal:blind': ['Quiet trade', 'Камеры молчат, пока Chrome Saints открывают черный вход.'],
  'deal:puppet': ['Saint escort', 'Дрон сопровождает сделку и маркирует засады.' ]
};
function updateSynergy() {
  const panel = document.querySelector('[data-synergy-panel]');
  const copy = synergyCopy[`${selectedAbilities.kael}:${selectedAbilities.mira}`] || synergyCopy['dash:spoof'];
  if (!panel) return;
  panel.querySelector('strong').textContent = copy[0];
  panel.querySelector('p').textContent = copy[1];
}
document.querySelectorAll('[data-ability]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('.hero-character');
    panel?.querySelectorAll('[data-ability]').forEach((item) => item.classList.toggle('active', item === button));
    const readout = panel?.querySelector('.ability-readout');
    if (readout) readout.textContent = abilityCopy[button.dataset.ability];
    const owner = panel?.querySelector('[data-ability-readout="kael"]') ? 'kael' : 'mira';
    selectedAbilities[owner] = button.dataset.ability;
    updateSynergy();
  });
});

document.querySelectorAll('[data-edition]').forEach((button) => {
  button.addEventListener('click', () => {
    unlockAchievement('Wishlist updated', `${button.dataset.edition} edition added`);
    button.textContent = 'Добавлено';
  });
});

let audioContext;
let oscillator;
let gainNode;
document.querySelector('[data-sound-toggle]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 72;
    gainNode.gain.value = 0.018;
    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start();
    button.classList.add('active');
    unlockAchievement('City signal', 'Ambient channel opened');
  } else if (audioContext.state === 'running') {
    await audioContext.suspend();
    button.classList.remove('active');
  } else {
    await audioContext.resume();
    button.classList.add('active');
  }
});
