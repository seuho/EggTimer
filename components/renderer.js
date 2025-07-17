document.addEventListener("DOMContentLoaded", () => {
  const appBase = document.getElementById("app-base");

  // Load initial landing screen
  loadView("components/landing/landing.html");

  function loadView(path) {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        appBase.innerHTML = html;
        attachEventHandlers();
      });
  }

  const eggFrames = [
    "./assets/1.svg",
    "./assets/2.svg",
    "./assets/3.svg",
    "./assets/4.svg",
    "./assets/5.svg"
  ];

  const eggAnimations = {};
  const eggIndexes = {};

  function startEggAnimation(type) {
    const eggImg = document.getElementById(`egg-animation-${type}`);
    if (!eggImg) return;

    eggImg.style.display = "block";
    eggIndexes[type] = 0;

    eggAnimations[type] = setInterval(() => {
      eggImg.src = eggFrames[eggIndexes[type]];
      eggIndexes[type] = (eggIndexes[type] + 1) % eggFrames.length;
    }, 200);
  }

  function stopEggAnimation(type) {
    const eggImg = document.getElementById(`egg-animation-${type}`);
    if (!eggImg) return;

    clearInterval(eggAnimations[type]);
    eggAnimations[type] = null;
    eggImg.src = finalEggFor(type);
  }

  const TIMER_DURATIONS = {
    softboiled: 4 * 60,
    mediumboiled: 7 * 60,
    hardboiled: 10 * 60,
    poached: 3 * 60
  };

  const timers = {};

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateDisplay(type) {
    const display = document.getElementById(`${type}-timer`);
    if (display) {
      display.textContent = formatTime(timers[type].remaining);
    }
  }

  function finalEggFor(type) {
    return `./assets/${capitalize(type)}.svg`;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function startTimer(type) {
    if (timers[type].interval) return;

    startEggAnimation(type);

    const startTime = Date.now();
    const targetTime = startTime + timers[type].remaining * 1000;

    timers[type].interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = targetTime - now;
      timers[type].remaining = Math.max(0, Math.ceil(remainingMs / 1000));
      updateDisplay(type);

      if (timers[type].remaining <= 0) {
        clearInterval(timers[type].interval);
        timers[type].interval = null;

        const display = document.getElementById(`${type}-timer`);
        if (display) display.textContent = "Time’s up!";

        stopEggAnimation(type);

        if (window.electronAPI?.restoreWindow) {
          window.electronAPI.restoreWindow();
        }

        const alarm = document.getElementById("alarm-sound");
        if (alarm) {
          alarm.currentTime = 0;
          alarm.play().catch(e => console.warn("Alarm error:", e));
        }
      }
    }, 1000);
  }

  function resetTimer(type) {
    clearInterval(timers[type].interval);
    timers[type].interval = null;
    timers[type].remaining = TIMER_DURATIONS[type];
    updateDisplay(type);

    const eggImg = document.getElementById(`egg-animation-${type}`);
    if (eggImg) {
      clearInterval(eggAnimations[type]);
      eggAnimations[type] = null;
      eggImg.src = "./assets/1.svg";
      eggImg.style.display = "block";
    }

    const alarm = document.getElementById("alarm-sound");
    if (alarm) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  }

  // Initialize timers
  Object.keys(TIMER_DURATIONS).forEach(type => {
    timers[type] = {
      remaining: TIMER_DURATIONS[type],
      interval: null
    };
  });

  function attachEventHandlers() {
    // Home navigation
    const softLink = document.getElementById('softboiled-link');
    if (softLink) softLink.addEventListener('click', () => loadView("components/softboiled/softboiled.html"));

    const mediumLink = document.getElementById('mediumboiled-link');
    if (mediumLink) mediumLink.addEventListener('click', () => loadView("components/mediumboiled/mediumboiled.html"));

    const hardLink = document.getElementById('hardboiled-link');
    if (hardLink) hardLink.addEventListener('click', () => loadView("components/hardboiled/hardboiled.html"));

    const poachedLink = document.getElementById('poached-link');
    if (poachedLink) poachedLink.addEventListener('click', () => loadView("components/poached/poached.html"));

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        loadView("components/home/home.html"); // SPA-style switch
      });
    }

    // Go back to home page
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => loadView("components/home/home.html"));
    }

    // Minimize/Close (Electron)
    const minBtn = document.getElementById('min-btn');
    if (minBtn) {
      minBtn.addEventListener('click', () => window.electronAPI?.minimizeWindow());
    }

    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => window.electronAPI?.closeWindow());
    }

    // Start/Reset buttons (for timers)
    document.querySelectorAll(".start").forEach(button => {
      button.addEventListener("click", () => {
        const type = button.getAttribute("data-type");
        startTimer(type);
      });
    });

    document.querySelectorAll(".reset").forEach(button => {
      button.addEventListener("click", () => {
        const type = button.getAttribute("data-type");
        resetTimer(type);
      });
    });
  }
});
