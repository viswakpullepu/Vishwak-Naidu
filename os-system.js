/**
 * VISHWAKOS v2.5 - ULTRA-REFINED DESKTOP RUNTIME & WINDOW MANAGER
 */

(function () {
  let highestZIndex = 100;
  let activeWindows = new Set();
  let currentFocusedWin = null;
  let audioContext = null;
  let isSoundEnabled = true;
  let isPlayingMusic = false;
  let equalizerInterval = null;

  // Window default positions & sizes
  const defaultPositions = {
    'win-terminal': { top: 60, left: 100, width: 620, height: 400 },
    'win-finder': { top: 90, left: 240, width: 680, height: 440 },
    'win-skills': { top: 80, left: 200, width: 580, height: 400 },
    'win-canary': { top: 110, left: 300, width: 520, height: 360 },
    'win-music': { top: 130, left: 340, width: 440, height: 380 },
    'win-resume': { top: 50, left: 140, width: 740, height: 500 },
    'win-apk': { top: 100, left: 220, width: 540, height: 380 },
    'win-browser': { top: 70, left: 160, width: 760, height: 480 },
    'win-settings': { top: 90, left: 220, width: 580, height: 400 }
  };

  // Sound Synthesizer (Web Audio API - zero external assets required)
  function playSystemSound(type) {
    if (!isSoundEnabled) return;
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      const now = audioContext.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'open') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'close') {
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {}
  }

  // Init VishwakOS
  function initVishwakOS() {
    initClock();
    initMenuBarsAndDropdowns();
    initWindowDraggingAndSnapping();
    initWindowResizing();
    initAppLaunchers();
    initDesktopSelectionBox();
    initContextMenu();
    initSpotlight();
    initTerminalCLI();
    initMusicPlayer();
    initCanaryLogs();
    initBrowser();
    initSettings();
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
      playSystemSound('open');
      if (activeWindows.size === 0) {
        openApp('win-terminal');
      }
    } else {
      osContainer.classList.remove('active');
      document.body.style.overflow = '';
      playSystemSound('close');
      closeAllMenus();
    }
  };

  // Open App Window with Dock Bounce Animation
  window.openApp = function (winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    playSystemSound('open');
    closeAllMenus();

    // Trigger dock bounce animation
    const dockItem = document.querySelector(`.os-dock-item[data-app="${winId}"]`);
    if (dockItem) {
      dockItem.classList.add('bouncing');
      setTimeout(() => dockItem.classList.remove('bouncing'), 1200);
    }

    win.classList.remove('minimized');
    win.classList.add('open');
    bringToFront(win);
    activeWindows.add(winId);
    updateDockDots();

    // Set initial position if not already placed
    if (!win.dataset.placed && defaultPositions[winId]) {
      const pos = defaultPositions[winId];
      const maxWidth = window.innerWidth - 40;
      const width = Math.min(pos.width, maxWidth);
      const left = Math.max(20, Math.min(pos.left, window.innerWidth - width - 20));

      win.style.top = `${pos.top}px`;
      win.style.left = `${left}px`;
      win.style.width = `${width}px`;
      win.style.height = `${pos.height}px`;
      win.dataset.placed = "true";
    }
  };

  // Close App Window
  window.closeApp = function (winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    playSystemSound('close');
    win.classList.remove('open', 'maximized', 'snapped-left', 'snapped-right', 'minimized', 'focused');
    activeWindows.delete(winId);
    updateDockDots();
  };

  // Minimize App Window
  window.minimizeApp = function (winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    playSystemSound('click');
    win.classList.add('minimized');
  };

  // Maximize / Restore App Window
  window.toggleMaximizeApp = function (winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    playSystemSound('click');
    win.classList.remove('snapped-left', 'snapped-right');
    win.classList.toggle('maximized');
  };

  // Bring Window to Front
  function bringToFront(win) {
    highestZIndex += 2;
    win.style.zIndex = highestZIndex;

    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('focused'));
    win.classList.add('focused');
    currentFocusedWin = win;
  }

  // Update Dock running app indicator dots
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

  // Close all open dropdown menus & control center
  function closeAllMenus() {
    document.querySelectorAll('.os-dropdown').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.os-menu-btn').forEach(b => b.classList.remove('active-dropdown'));
    const cc = document.getElementById('os-control-center');
    if (cc) cc.classList.remove('show');
    const ctxMenu = document.getElementById('os-context-menu');
    if (ctxMenu) ctxMenu.classList.remove('show');
  }

  // ==========================================================================
  // MENUBAR & DROPDOWNS SYSTEM
  // ==========================================================================
  function initMenuBarsAndDropdowns() {
    document.querySelectorAll('.os-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.querySelector('.os-dropdown');
        const isShown = dropdown && dropdown.classList.contains('show');

        closeAllMenus();

        if (dropdown && !isShown) {
          dropdown.classList.add('show');
          btn.classList.add('active-dropdown');
          playSystemSound('click');
        }
      });
    });

    // Control Center Toggle
    const ccBtn = document.getElementById('os-cc-toggle');
    const cc = document.getElementById('os-control-center');
    if (ccBtn && cc) {
      ccBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = cc.classList.contains('show');
        closeAllMenus();
        if (!isShown) {
          cc.classList.add('show');
          playSystemSound('click');
        }
      });
    }

    // Sound Tile Toggle
    const soundTile = document.getElementById('cc-sound-tile');
    if (soundTile) {
      soundTile.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        soundTile.classList.toggle('active', isSoundEnabled);
        playSystemSound('click');
      });
    }

    // Global document click closes dropdowns
    document.addEventListener('click', () => {
      closeAllMenus();
    });
  }

  // ==========================================================================
  // DRAGGING, SNAPPING & DOUBLE CLICK MAXIMIZE
  // ==========================================================================
  function initWindowDraggingAndSnapping() {
    const windows = document.querySelectorAll('.os-window');

    windows.forEach(win => {
      const header = win.querySelector('.os-window-header');
      if (!header) return;

      win.addEventListener('mousedown', () => bringToFront(win));

      // Double-click header to toggle maximize
      header.addEventListener('dblclick', (e) => {
        if (e.target.closest('.os-btn-light')) return;
        toggleMaximizeApp(win.id);
      });

      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.os-btn-light')) return;
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

          newTop = Math.max(30, newTop); // Keep below menu bar

          // Screen Snapping Previews
          if (moveEvent.clientX <= 4) {
            win.classList.add('snapped-left');
            return;
          } else if (moveEvent.clientX >= window.innerWidth - 6) {
            win.classList.add('snapped-right');
            return;
          } else {
            win.classList.remove('snapped-left', 'snapped-right');
          }

          win.style.left = `${newLeft}px`;
          win.style.top = `${newTop}px`;
        }

        function onMouseUp(upEvent) {
          isDragging = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);

          // Top edge drag to maximize
          if (upEvent.clientY <= 34) {
            toggleMaximizeApp(win.id);
          }
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Window Controls
      const closeBtn = win.querySelector('.os-btn-close');
      const minBtn = win.querySelector('.os-btn-min');
      const maxBtn = win.querySelector('.os-btn-max');

      if (closeBtn) closeBtn.addEventListener('click', () => closeApp(win.id));
      if (minBtn) minBtn.addEventListener('click', () => minimizeApp(win.id));
      if (maxBtn) maxBtn.addEventListener('click', () => toggleMaximizeApp(win.id));
    });
  }

  // ==========================================================================
  // RESIZING HANDLES SYSTEM
  // ==========================================================================
  function initWindowResizing() {
    const windows = document.querySelectorAll('.os-window');

    windows.forEach(win => {
      // Append resize handles
      const handleR = document.createElement('div');
      handleR.className = 'os-resize-handle os-resize-r';
      const handleB = document.createElement('div');
      handleB.className = 'os-resize-handle os-resize-b';
      const handleBR = document.createElement('div');
      handleBR.className = 'os-resize-handle os-resize-br';

      win.appendChild(handleR);
      win.appendChild(handleB);
      win.appendChild(handleBR);

      function attachResize(handle, type) {
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          bringToFront(win);

          const startX = e.clientX;
          const startY = e.clientY;
          const startW = win.offsetWidth;
          const startH = win.offsetHeight;

          function onMouseMove(m) {
            if (type.includes('r')) {
              const newW = Math.max(320, startW + (m.clientX - startX));
              win.style.width = `${newW}px`;
            }
            if (type.includes('b')) {
              const newH = Math.max(200, startH + (m.clientY - startY));
              win.style.height = `${newH}px`;
            }
          }

          function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          }

          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        });
      }

      attachResize(handleR, 'r');
      attachResize(handleB, 'b');
      attachResize(handleBR, 'rb');
    });
  }

  // ==========================================================================
  // DESKTOP LASSO SELECTION BOX
  // ==========================================================================
  function initDesktopSelectionBox() {
    const desktop = document.querySelector('.os-desktop');
    const selBox = document.getElementById('os-selection-box');
    if (!desktop || !selBox) return;

    let isSelecting = false;
    let startX, startY;

    desktop.addEventListener('mousedown', (e) => {
      if (e.target.closest('.os-window') || e.target.closest('.os-icon') || e.target.closest('.os-dock-container')) {
        return;
      }
      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;

      selBox.style.left = `${startX}px`;
      selBox.style.top = `${startY}px`;
      selBox.style.width = '0px';
      selBox.style.height = '0px';
      selBox.style.display = 'block';

      // Clear icon selections
      document.querySelectorAll('.os-icon').forEach(icon => icon.classList.remove('selected'));

      function onMouseMove(m) {
        if (!isSelecting) return;
        const currentX = m.clientX;
        const currentY = m.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selBox.style.left = `${left}px`;
        selBox.style.top = `${top}px`;
        selBox.style.width = `${width}px`;
        selBox.style.height = `${height}px`;

        // Check intersect with icons
        document.querySelectorAll('.os-icon').forEach(icon => {
          const rect = icon.getBoundingClientRect();
          if (left < rect.right && left + width > rect.left &&
              top < rect.bottom && top + height > rect.top) {
            icon.classList.add('selected');
          } else {
            icon.classList.remove('selected');
          }
        });
      }

      function onMouseUp() {
        isSelecting = false;
        selBox.style.display = 'none';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // ==========================================================================
  // RIGHT-CLICK DESKTOP CONTEXT MENU
  // ==========================================================================
  function initContextMenu() {
    const desktop = document.querySelector('.os-desktop');
    const ctxMenu = document.getElementById('os-context-menu');
    if (!desktop || !ctxMenu) return;

    desktop.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.os-window') || e.target.closest('.os-dock-container')) {
        return;
      }
      e.preventDefault();
      closeAllMenus();

      const x = Math.min(e.clientX, window.innerWidth - 200);
      const y = Math.min(e.clientY, window.innerHeight - 200);

      ctxMenu.style.left = `${x}px`;
      ctxMenu.style.top = `${y}px`;
      ctxMenu.classList.add('show');
      playSystemSound('click');
    });
  }

  // ==========================================================================
  // SPOTLIGHT SEARCH (Cmd+Space / Ctrl+Space)
  // ==========================================================================
  function initSpotlight() {
    const spotlightOverlay = document.getElementById('os-spotlight');
    const spotlightInput = document.getElementById('os-spotlight-input');
    const spotlightResults = document.getElementById('os-spotlight-results');
    if (!spotlightOverlay || !spotlightInput) return;

    const apps = [
      { name: 'Terminal', icon: 'fas fa-terminal', id: 'win-terminal', desc: 'Command line terminal' },
      { name: 'Projects Explorer', icon: 'far fa-folder-open', id: 'win-finder', desc: 'Browse GitHub repositories' },
      { name: 'BOUU Music Web', icon: 'fas fa-music', id: 'win-browser', desc: 'Live music streaming client' },
      { name: 'BOUU Android APK', icon: 'fab fa-android', id: 'win-apk', desc: 'Package installer for Android' },
      { name: 'AI Skills Matrix', icon: 'fas fa-bolt', id: 'win-skills', desc: 'Generative AI & Web tools' },
      { name: 'Canary Security', icon: 'fas fa-shield-alt', id: 'win-canary', desc: 'Intrusion detection monitor' },
      { name: 'Music Player', icon: 'fas fa-compact-disc', id: 'win-music', desc: 'Audio visualizer & beats' },
      { name: 'Resume Preview', icon: 'fas fa-file-pdf', id: 'win-resume', desc: 'View and download resume' },
      { name: 'System Settings', icon: 'fas fa-cog', id: 'win-settings', desc: 'Wallpapers and appearance' }
    ];

    function toggleSpotlight(show) {
      if (show === undefined) show = !spotlightOverlay.classList.contains('show');
      if (show) {
        spotlightOverlay.classList.add('show');
        spotlightInput.value = '';
        renderResults(apps);
        setTimeout(() => spotlightInput.focus(), 50);
        playSystemSound('open');
      } else {
        spotlightOverlay.classList.remove('show');
      }
    }

    function renderResults(list) {
      spotlightResults.innerHTML = '';
      if (list.length === 0) {
        spotlightResults.innerHTML = '<div style="padding:12px; color:#9ca3af; text-align:center; font-size:12px;">No matching applications found</div>';
        return;
      }
      list.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = `os-spotlight-item ${idx === 0 ? 'active' : ''}`;
        row.innerHTML = `<i class="${item.icon}" style="font-size:16px; width:20px; text-align:center;"></i> <div><div style="font-weight:600;">${item.name}</div><div style="font-size:11px; opacity:0.7;">${item.desc}</div></div>`;
        row.addEventListener('click', () => {
          openApp(item.id);
          toggleSpotlight(false);
        });
        spotlightResults.appendChild(row);
      });
    }

    spotlightInput.addEventListener('input', () => {
      const q = spotlightInput.value.trim().toLowerCase();
      const filtered = apps.filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
      renderResults(filtered);
    });

    spotlightInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleSpotlight(false);
      if (e.key === 'Enter') {
        const first = spotlightResults.querySelector('.os-spotlight-item');
        if (first) first.click();
      }
    });

    spotlightOverlay.addEventListener('click', (e) => {
      if (e.target === spotlightOverlay) toggleSpotlight(false);
    });

    // Keyboard shortcut (Cmd+Space / Ctrl+Space)
    window.addEventListener('keydown', (e) => {
      const osActive = document.getElementById('vishwak-os')?.classList.contains('active');
      if (osActive && (e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        toggleSpotlight();
      }
    });

    const searchIcon = document.getElementById('os-search-icon');
    if (searchIcon) {
      searchIcon.addEventListener('click', () => toggleSpotlight(true));
    }
  }

  // App Launcher Event Listeners
  function initAppLaunchers() {
    document.querySelectorAll('.os-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        document.querySelectorAll('.os-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
      });
      icon.addEventListener('dblclick', () => {
        const app = icon.getAttribute('data-app');
        if (app) openApp(app);
      });
    });

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

    document.querySelectorAll('[data-os-menu-app]').forEach(btn => {
      btn.addEventListener('click', () => {
        const app = btn.getAttribute('data-os-menu-app');
        if (app) openApp(app);
      });
    });
  }

  // ==========================================================================
  // SYSTEM SETTINGS & WALLPAPER SWITCHER
  // ==========================================================================
  function initSettings() {
    const wpCards = document.querySelectorAll('.wp-choice-card');
    const wpLayer = document.getElementById('os-wallpaper-layer');

    wpCards.forEach(card => {
      card.addEventListener('click', () => {
        wpCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const theme = card.getAttribute('data-wp');
        if (wpLayer && theme) {
          wpLayer.className = `os-wallpaper-layer wp-${theme}`;
          playSystemSound('click');
        }
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
  - apk          : Download BOUU-Music-v1.0.0.apk (Android)
  - bouu         : Open live BOUU Music Web app (bouu-gamma.vercel.app)
  - browser      : Open Safari / Web Browser
  - resume       : View / Download PDF resume
  - settings     : Open System Settings
  - whoami       : Current user information
  - contact      : Get in touch
  - matrix       : Toggle hacker digital rain
  - date         : Display system date and time
  - clear        : Clear the terminal screen`,

      neofetch: `
   \x1b[38;2;224;96;49m     /\\         \x1b[0m \x1b[1mvishwak@cvrce\x1b[0m
   \x1b[38;2;224;96;49m    /  \\        \x1b[0m ------------
   \x1b[38;2;224;96;49m   / /\\ \\       \x1b[0m \x1b[33mOS:\x1b[0m VishwakOS v2.5 (Liquid Glass Desktop)
   \x1b[38;2;224;96;49m  / /__\\ \\      \x1b[0m \x1b[33mHost:\x1b[0m CVR College of Engineering (CSE)
   \x1b[38;2;224;96;49m /_/    \\_\\     \x1b[0m \x1b[33mRole:\x1b[0m AI & Web Digital Builder
                     \x1b[33mTimeline:\x1b[0m 2025 – 2029 (B.Tech)
                     \x1b[33mStack:\x1b[0m GenAI, Vercel, Supabase, Python, WebSockets
                     \x1b[33mSecurity:\x1b[0m Palo Alto Certified, Canarytoken Traps`,

      projects: `Authentic GitHub Projects:
  1. \x1b[35mBOUU Music\x1b[0m         : Ad-free Streaming Web App & Android APK (bouu-gamma.vercel.app)
  2. \x1b[32mppt-reviewer-agent\x1b[0m : AI Presentation Reviewer Agent (FastAPI + LLM)
  3. \x1b[32mCanarytoken\x1b[0m        : Cyber Trap & Intrusion Detection Alerts
  4. \x1b[32manon-chat\x1b[0m          : Real-time ephemeral anonymous chat (WebSockets)
  5. \x1b[32mdemo-restaurant\x1b[0m    : Full-stack ordering platform (Node.js + React)
  6. \x1b[32mvishwak.tech\x1b[0m       : Creative Developer Portfolio & Live Deployments`,

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

      apk: `Opening Package Installer for BOUU-Music-v1.0.0.apk (7.33 MB)...`,

      bouu: `Opening BOUU Music Web (https://bouu-gamma.vercel.app)...`,

      browser: `Opening Safari Web Browser...`,

      settings: `Opening System Settings...`,

      date: () => new Date().toString(),

      sudo: `Nice try! You are already root on VishwakOS.`,

      matrix: `Wake up, Neo... Follow the white rabbit. 🐇 (Digital rain active)`
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmdText = input.value.trim().toLowerCase();
        input.value = '';

        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">vishwak@cvrce:~$</span> <span>${escapeHtml(cmdText)}</span>`;
        outputContainer.appendChild(line);

        if (cmdText === 'clear') {
          outputContainer.innerHTML = '';
          return;
        }

        if (cmdText === 'resume') openApp('win-resume');
        if (cmdText === 'apk') openApp('win-apk');
        if (cmdText === 'settings') openApp('win-settings');

        if (cmdText === 'bouu') {
          openApp('win-browser');
          const urlInput = document.getElementById('browser-url-input');
          const iframe = document.getElementById('browser-frame');
          if (urlInput && iframe) {
            urlInput.value = 'https://bouu-gamma.vercel.app';
            iframe.src = 'https://bouu-gamma.vercel.app';
          }
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
          return;
        } else {
          outLine.innerHTML = `<span style="color:#ef4444">Command not found: ${escapeHtml(cmdText)}. Type <strong>help</strong> for available commands.</span>`;
        }

        outputContainer.appendChild(outLine);

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
