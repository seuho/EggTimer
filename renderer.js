document.addEventListener("DOMContentLoaded", () => {
  const appBase = document.getElementById("app-base");

  const TIMER_DURATIONS = {
    softboiled: 4 * 60,
    mediumboiled: 7 * 60,
    hardboiled: 10 * 60,
    poached: 3 * 60,
  };

  let eggFrames = [];
  const timers = {};
  const eggAnimations = {};
  const eggIndexes = {};

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  const formatTime = sec => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  const finalEggFor = type => window.assetAPI.getAssetPath(`${capitalize(type)}.svg`);

  async function loadView(relativeHtmlPath) {
    try {
      const htmlPath = await window.assetAPI.getAssetPath(relativeHtmlPath); // e.g., components/softboiled/softboiled.html
      const res = await fetch(htmlPath);
      const html = await res.text();
      appBase.innerHTML = html;
      await setImages();
      attachEventHandlers();
    } catch (err) {
      console.error("Failed to load view:", err);
    }
  }
  

  async function setImages() {
    await Promise.all([setControlBtnImages(), setCloudImages(), setEggImages(), preloadEggFrames(), setInitialEggAnimationImages(), setAlarmSound()]);
  }

  async function preloadEggFrames() {
    eggFrames = await Promise.all(
      Array.from({ length: 5 }, (_, i) => window.assetAPI.getAssetPath(`${i + 1}.svg`))
    );
  }
  
  async function setInitialEggAnimationImages() {
    const eggTypes = ["softboiled", "mediumboiled", "hardboiled", "poached"];
    const frame1Path = await window.assetAPI.getAssetPath("1.svg");
  
    eggTypes.forEach(type => {
      const img = document.getElementById(`egg-animation-${type}`);
      if (img) {
        img.src = frame1Path;
        img.style.display = "block"; // or keep as is if already styled via CSS
      }
    });
  }
  
  async function setAlarmSound() {
    const alarm = document.getElementById("alarm-sound");
    if (alarm && window.assetAPI) {
      try {
        alarm.src = await window.assetAPI.getAssetPath("alarm.mp3");
      } catch (err) {
        console.warn("Failed to set alarm sound:", err);
      }
    }
  }
  

  async function setControlBtnImages() {
    const ids = { close: "Close.svg", minimize: "Minimize.svg", back: "Back.svg" };
    for (const [id, file] of Object.entries(ids)) {
      const el = document.getElementById(id);
      if (el && window.assetAPI) {
        try {
          el.src = await window.assetAPI.getAssetPath(file);
        } catch (err) {
          console.warn(`Failed to set ${id} image:`, err);
        }
      }
    }
  }

  async function setCloudImages() {
    if (!window.assetAPI) return;
    for (let i = 1; i <= 10; i++) {
      const img = document.getElementById(`cloud-${i}`);
      if (img) {
        try {
          const src = await window.assetAPI.getAssetPath("Cloud.svg");
          img.src = src;
        } catch (err) {
          console.warn("Failed to load Cloud.svg:", err);
        }
      }
    }
  }

  function setEggImages() {
    ["softboiled", "mediumboiled", "hardboiled", "poached"].forEach(async type => {
      const img = document.getElementById(`egg-${type}`);
      if (img) img.src = await window.assetAPI.getAssetPath(`${capitalize(type)}.svg`);
    });
  }

  function startEggAnimation(type) {
    const img = document.getElementById(`egg-animation-${type}`);
    if (!img) return;

    eggIndexes[type] = 0;
    img.style.display = "block";

    eggAnimations[type] = setInterval(() => {
      img.src = eggFrames[eggIndexes[type]];
      eggIndexes[type] = (eggIndexes[type] + 1) % eggFrames.length;
    }, 200);
  }

  async function stopEggAnimation(type) {
    const img = document.getElementById(`egg-animation-${type}`);
    if (!img) return;

    clearInterval(eggAnimations[type]);
    img.src = await finalEggFor(type);
  }

  function startTimer(type) {
    if (timers[type].interval) return;

    startEggAnimation(type);
    const targetTime = Date.now() + timers[type].remaining * 1000;

    timers[type].interval = setInterval(() => {
      const now = Date.now();
      timers[type].remaining = Math.max(0, Math.ceil((targetTime - now) / 1000));
      updateDisplay(type);

      if (timers[type].remaining <= 0) {
        clearInterval(timers[type].interval);
        timers[type].interval = null;

        stopEggAnimation(type);
        updateDisplay(type, "Time’s up!");
        window.electronAPI?.restoreWindow?.();

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

    const img = document.getElementById(`egg-animation-${type}`);
    if (img) {
      clearInterval(eggAnimations[type]);
      img.src = eggFrames[0];
      img.style.display = "block";
    }

    const alarm = document.getElementById("alarm-sound");
    if (alarm) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  }

  function updateDisplay(type, message = null) {
    const display = document.getElementById(`${type}-timer`);
    if (display) {
      display.textContent = message || formatTime(timers[type].remaining);
    }
  }

  function attachEventHandlers() {
    const soft = document.getElementById("softboiled-link");
      if (soft) soft.addEventListener("click", () => loadView("components/softboiled/softboiled.html"));
    
      const medium = document.getElementById("mediumboiled-link");
      if (medium) medium.addEventListener("click", () => loadView("components/mediumboiled/mediumboiled.html"));
    
      const hard = document.getElementById("hardboiled-link");
      if (hard) hard.addEventListener("click", () => loadView("components/hardboiled/hardboiled.html"));
    
      const poached = document.getElementById("poached-link");
      if (poached) poached.addEventListener("click", () => loadView("components/poached/poached.html"));
    
      const back = document.getElementById("back");
      if (back) back.addEventListener("click", () => loadView("components/home/home.html"));
    
      const start = document.getElementById("start-btn");
      if (start) start.addEventListener("click", () => loadView("components/home/home.html"));
    
      document.getElementById("min-btn")?.addEventListener("click", () => window.electronAPI?.minimizeWindow?.());
      document.getElementById("close-btn")?.addEventListener("click", () => window.electronAPI?.closeWindow?.());
    
      document.querySelectorAll(".start").forEach(btn =>
        btn.addEventListener("click", () => startTimer(btn.getAttribute("data-type")))
      );
    
      document.querySelectorAll(".reset").forEach(btn =>
        btn.addEventListener("click", () => resetTimer(btn.getAttribute("data-type")))
      );    
  }

  // Initialize timers
  Object.keys(TIMER_DURATIONS).forEach(type => {
    timers[type] = { remaining: TIMER_DURATIONS[type], interval: null };
  });

  // Load initial landing page
  loadView("components/landing/landing.html");
});
