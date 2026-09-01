/**
 * VISHWAKOS - INTERACTIVE DESKTOP RUNTIME & WINDOW MANAGER
 */

(function () {
  let highestZIndex = 100;
  let activeWindows = new Set();
  let audioContext = null;
  let isPlayingMusic = false;
  let equalizerInterval = null;

  // Window default positions
  const defaultPositions = {
    'win-terminal': { top: 70, left: 120, width: 580, height: 380 },
    'win-finder': { top: 100, left: 280, width: 640, height: 420 },
    'win-skills': { top: 90, left: 220, width: 560, height: 390 },
    'win-canary': { top: 120, left: 340, width: 500, height: 340 },
    'win-music': { top: 140, left: 380, width: 420, height: 360 },
    'win-resume': { top: 60, left: 160, width: 720, height: 480 },
    'win-apk': { top: 110, left: 240, width: 520, height: 360 },
    'win-browser': { top: 75, left: 180, width: 720, height: 460 }
  };

  // Init VishwakOS
  function initVishwakOS() {
    initClock();
    initWindowDragging();
    initAppLaunchers();
    initTerminalCLI();
    initMusicPlayer();
    initCanaryLogs();
    initBrowser();
  }

  // Live Clock in Menu Bar
  function initClock() {
    const clockElem = document.getElementById('os-live-clock');
    if (!clockElem) return;
    function updateTime() {
      const now = new Date();
      let hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      clockElem.textContent = `${hours}:${mins} ${ampm}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Toggle OS Fullscreen Mode
  window.toggleVishwakOS = function (open) {
    const osContainer = document.getElementById('vishwak-os');
    if (!osContainer) return;

    if (open === undefined) {
      open = !osContainer.classList.contains('active');
    }

    if (open) {
      osContainer.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Open Terminal and Finder by default if first time
      if (activeWindows.size === 0) {
        openApp('win-terminal');
      }
    } else {
      osContainer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Open App Window
  function openApp(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    win.classList.remove('minimized');
    win.classList.add('open');
    bringToFront(win);
    activeWindows.add(winId);
    updateDockDots();

    // Set initial position if not already placed
    if (!win.dataset.placed && defaultPositions[winId]) {
      const pos = defaultPositions[winId];
      // Responsive check
      const maxWidth = window.innerWidth - 40;
      const width = Math.min(pos.width, maxWidth);
      const left = Math.max(20, Math.min(pos.left, window.innerWidth - width - 20));

      win.style.top = `${pos.top}px`;
      win.style.left = `${left}px`;
      win.style.width = `${width}px`;
      win.style.height = `${pos.height}px`;
      win.dataset.placed = "true";
    }
  }

  // Close App Window
  function closeApp(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.classList.remove('open', 'maximized', 'minimized');
    activeWindows.delete(winId);
    updateDockDots();
  }

  // Minimize App Window
  function minimizeApp(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.classList.add('minimized');
  }

  // Maximize / Restore App Window
  function toggleMaximizeApp(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    win.classList.toggle('maximized');
  }

  // Bring Window to Front
  function bringToFront(win) {
    highestZIndex += 2;
    win.style.zIndex = highestZIndex;
  }

  // Update Dock running app indicators
  function updateDockDots() {
    document.querySelectorAll('.os-dock-item').forEach(item => {
      const target = item.getAttribute('data-app');
      if (target && activeWindows.has(target)) {
        item.classList.add('has-dot');
      } else {
        item.classList.remove('has-dot');
      }
    });
  }

  // Dragging System
  function initWindowDragging() {
    const windows = document.querySelectorAll('.os-window');

    windows.forEach(win => {
      const header = win.querySelector('.os-window-header');
      if (!header) return;

      // Bring to front on click
      win.addEventListener('mousedown', () => bringToFront(win));

      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.os-btn-light')) return; // Ignore traffic lights
        if (win.classList.contains('maximized')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = win.offsetLeft;
        initialTop = win.offsetTop;
        bringToFront(win);

        function onMouseMove(moveEvent) {
          if (!isDragging) return;
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          let newLeft = initialLeft + dx;
          let newTop = initialTop + dy;

          // Boundary checks
          newTop = Math.max(34, newTop); // Keep below menu bar
          win.style.left = `${newLeft}px`;
          win.style.top = `${newTop}px`;
        }

        function onMouseUp() {
          isDragging = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Window Action Buttons
      const closeBtn = win.querySelector('.os-btn-close');
      const minBtn = win.querySelector('.os-btn-min');
      const maxBtn = win.querySelector('.os-btn-max');

      if (closeBtn) closeBtn.addEventListener('click', () => closeApp(win.id));
      if (minBtn) minBtn.addEventListener('click', () => minimizeApp(win.id));
      if (maxBtn) maxBtn.addEventListener('click', () => toggleMaximizeApp(win.id));
    });
  }

  // App Launcher event listeners
  function initAppLaunchers() {
    // Desktop Icons
    document.querySelectorAll('.os-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const app = icon.getAttribute('data-app');
        if (app) openApp(app);
      });
    });

    // Dock Items
    document.querySelectorAll('.os-dock-item').forEach(item => {
      item.addEventListener('click', () => {
        const app = item.getAttribute('data-app');
        if (app) {
          const win = document.getElementById(app);
          if (win && win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            bringToFront(win);
          } else {
            openApp(app);
          }
        }
      });
    });

    // Menu Bar App Links
    document.querySelectorAll('[data-os-menu-app]').forEach(btn => {
      btn.addEventListener('click', () => {
        const app = btn.getAttribute('data-os-menu-app');
        if (app) openApp(app);
      });
    });
  }

  // ==========================================================================
  // TERMINAL CLI ENGINE
  // ==========================================================================
  function initTerminalCLI() {
    const input = document.getElementById('term-input');
    const outputContainer = document.getElementById('term-history');
    if (!input || !outputContainer) return;

    const commands = {
      help: `Available commands:
  - neofetch     : System & Profile Specs
  - projects     : List authentic GitHub projects
  - skills       : Show AI and Web toolbelt
  - education    : Academic timeline (CVRCE 2025-2029)
  - apk          : Download bouu.apk Android Music Player
  - browser      : Open Safari / Web Browser
  - resume       : View / Download PDF resume
  - whoami       : Current user information
  - contact      : Get in touch
  - matrix       : Toggle hacker digital rain
  - date         : Display system date and time
  - clear        : Clear the terminal screen`,

      neofetch: `
   \x1b[38;2;224;96;49m     /\\         \x1b[0m \x1b[1mvishwak@cvrce\x1b[0m
   \x1b[38;2;224;96;49m    /  \\        \x1b[0m ------------
   \x1b[38;2;224;96;49m   / /\\ \\       \x1b[0m \x1b[33mOS:\x1b[0m VishwakOS v2.0 (Liquid Glass)
   \x1b[38;2;224;96;49m  / /__\\ \\      \x1b[0m \x1b[33mHost:\x1b[0m CVR College of Engineering (CSE)
   \x1b[38;2;224;96;49m /_/    \\_\\     \x1b[0m \x1b[33mRole:\x1b[0m AI & Web Digital Builder
                     \x1b[33mTimeline:\x1b[0m 2025 – 2029 (B.Tech)
                     \x1b[33mStack:\x1b[0m GenAI, Vercel, Supabase, Python, WebSockets
                     \x1b[33mSecurity:\x1b[0m Palo Alto Certified, Canarytoken Traps`,

      projects: `Authentic GitHub Projects:
  1. \x1b[32mppt-reviewer-agent\x1b[0m : AI Presentation Reviewer Agent (FastAPI + LLM)
  2. \x1b[32mCanarytoken\x1b[0m        : Cyber Trap & Intrusion Detection Alerts
  3. \x1b[32manon-chat\x1b[0m          : Real-time ephemeral anonymous chat (WebSockets)
  4. \x1b[32mdemo-restaurant\x1b[0m    : Full-stack ordering platform (Node.js + React)
  5. \x1b[32mvishwak.tech\x1b[0m       : Creative Developer Portfolio & Live Deployments`,

      skills: `Tools & Technical Focus:
  - \x1b[36mAI & LLMs\x1b[0m       : ChatGPT, Gemini, Claude, Copilot, Perplexity, v0.dev
  - \x1b[36mWeb & Cloud\x1b[0m     : Vercel, Supabase, WordPress, Webflow, Git, GitHub
  - \x1b[36mDesign & Tools\x1b[0m  : Figma, Canva, MS Excel, Postman, Linux Basics
  - \x1b[36mCybersecurity\x1b[0m   : Network Traffic Analysis, VLANs, Firewalls, Canary`,

      education: `Academic Background:
  - B.Tech in CSE           : CVR College of Engineering (2025 – 2029)
  - Intermediate (MPC)      : Sri Chaitanya Junior College (2023 – 2025)
  - Secondary School (10th) : Sri Chaitanya Techno School (Graduated 2023)`,

      whoami: `vishwak — AI-Powered Digital Creator & Computer Science Student at CVRCE`,

      contact: `Get In Touch:
  - Email    : viswakpullepu1@gmail.com
  - Web      : https://vishwak.tech
  - GitHub   : https://github.com/viswakpullepu
  - LinkedIn : https://linkedin.com/in/vishwakpullepu`,

      resume: `Opening Resume Viewer application...`,

      apk: `Opening Package Installer for bouu.apk (23.42 MB)...`,

      browser: `Opening Safari Web Browser...`,

      date: () => new Date().toString(),

      sudo: `Nice try! You are already root on VishwakOS.`,

      matrix: `Wake up, Neo... Follow the white rabbit. 🐇 (Digital rain active)`
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmdText = input.value.trim().toLowerCase();
        input.value = '';

        // Add prompt line to history
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">vishwak@cvrce:~$</span> <span>${escapeHtml(cmdText)}</span>`;
        outputContainer.appendChild(line);

        if (cmdText === 'clear') {
          outputContainer.innerHTML = '';
          return;
        }

        if (cmdText === 'resume') {
          openApp('win-resume');
        }

        if (cmdText === 'apk') {
          openApp('win-apk');
        }

        if (cmdText === 'browser' || cmdText === 'safari' || cmdText === 'web') {
          openApp('win-browser');
        }

        const outLine = document.createElement('div');
        outLine.className = 'term-line term-output';

        if (cmdText in commands) {
          const res = typeof commands[cmdText] === 'function' ? commands[cmdText]() : commands[cmdText];
          outLine.innerText = res;
        } else if (cmdText === '') {
          // Empty enter
          return;
        } else {
          outLine.innerHTML = `<span style="color:#ef4444">Command not found: ${escapeHtml(cmdText)}. Type <strong>help</strong> for available commands.</span>`;
        }

        outputContainer.appendChild(outLine);

        // Auto scroll to bottom
        const termBody = document.querySelector('.terminal-body');
        if (termBody) termBody.scrollTop = termBody.scrollHeight;
      }
    });

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }

  // ==========================================================================
  // MUSIC PLAYER & EQUALIZER VISUALIZER
  // ==========================================================================
  function initMusicPlayer() {
    const playBtn = document.getElementById('music-play-btn');
    const albumArt = document.querySelector('.music-album-art');
    const canvas = document.getElementById('music-waveform');
    if (!playBtn || !canvas) return;

    const ctx = canvas.getContext('2d');

    function drawWave(animating) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const height = animating ? Math.random() * (canvas.height - 10) + 6 : 8;
        const x = i * (barWidth + 2);
        const y = canvas.height - height;

        ctx.fillStyle = '#ec4899';
        ctx.fillRect(x, y, barWidth, height);
      }
    }

    drawWave(false);

    playBtn.addEventListener('click', () => {
      isPlayingMusic = !isPlayingMusic;

      if (isPlayingMusic) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (albumArt) albumArt.classList.add('playing');
        equalizerInterval = setInterval(() => drawWave(true), 120);
      } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (albumArt) albumArt.classList.remove('playing');
        clearInterval(equalizerInterval);
        drawWave(false);
      }
    });
  }

  // ==========================================================================
  // CANARY LOGS SIMULATOR
  // ==========================================================================
  function initCanaryLogs() {
    const logBox = document.getElementById('canary-logs');
    if (!logBox) return;

    const dummyLogs = [
      { time: '12:04:18', type: 'ok', msg: 'Decoy token deployed: /assets/auth_token.json' },
      { time: '13:15:22', type: 'ok', msg: 'Network trap listening on port 8080' },
      { time: '15:42:09', type: 'warn', msg: 'Simulated probe detected: IP 192.168.1.104' },
      { time: '17:20:45', type: 'ok', msg: 'Password entropy check: 84.6 bits (High)' },
      { time: '19:08:11', type: 'ok', msg: 'VLAN boundary integrity: Secure' }
    ];

    logBox.innerHTML = '';
    dummyLogs.forEach(log => {
      const row = document.createElement('div');
      row.className = 'canary-log-item';
      row.innerHTML = `<span class="canary-log-time">[${log.time}]</span> <span class="${log.type === 'ok' ? 'canary-log-ok' : 'canary-log-warn'}">${log.type.toUpperCase()}:</span> <span>${log.msg}</span>`;
      logBox.appendChild(row);
    });
  }

  // ==========================================================================
  // SAFARI / BROWSER APP
  // ==========================================================================
  function initBrowser() {
    const urlInput = document.getElementById('browser-url-input');
    const iframe = document.getElementById('browser-frame');
    const reloadBtn = document.getElementById('browser-reload-btn');
    const openTabBtn = document.getElementById('browser-opentab-btn');

    if (!urlInput || !iframe) return;

    function navigate(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      urlInput.value = url;
      iframe.src = url;
      if (openTabBtn) openTabBtn.href = url;
    }

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        navigate(urlInput.value.trim());
      }
    });

    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        iframe.src = iframe.src;
      });
    }

    // Quick Bookmarks
    document.querySelectorAll('[data-browser-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-browser-target');
        if (target) navigate(target);
      });
    });
  }

  // DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initVishwakOS);
})();
