// --- INERTIAL SMOOTH SCROLLING (LENIS) ---
let lenis;
try {
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom liquid scroll curve
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      lenis.on('scroll', () => {
        try {
          ScrollTrigger.update();
        } catch (e) {
          console.error("ScrollTrigger update error:", e);
        }
      });
    }

    // Run Lenis in its own independent requestAnimationFrame loop
    function raf(time) {
      try {
        lenis.raf(time);
      } catch (e) {
        console.error("Lenis animation frame error:", e);
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
} catch (e) {
  console.error("Lenis initialization error:", e);
}

// --- PRELOADER ENTRANCE & INITIALIZATION ---
function initPreloader() {
  const progressFill = document.querySelector(".progress-bar-fill");
  const preloader = document.getElementById("preloader");
  const mainContent = document.querySelector("main");
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        try {
          if (preloader) preloader.classList.add("loaded");
          if (mainContent) {
            mainContent.classList.remove("hidden");
          }
          // Force refresh GSAP layout metrics after page reveal
          if (typeof ScrollTrigger !== "undefined") {
            try {
              ScrollTrigger.refresh();
            } catch (e) {
              console.error("ScrollTrigger refresh error:", e);
            }
          }
          // Fire entrance animations
          playEntranceAnimations();
        } catch (e) {
          console.error("Preloader completion handler error:", e);
        }
      }, 600);
    }
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }, 80);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreloader);
} else {
  initPreloader();
}


// --- DYNAMIC ENTRANCE ANIMATIONS (GSAP) ---
function playEntranceAnimations() {
  if (typeof gsap !== "undefined") {
    // Reveal logo & nav links from top
    gsap.from("header", {
      y: -60,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    });

    // Reveal floating socials from left
    gsap.from(".floating-socials a", {
      x: -40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.4
    });

    // Stagger letter reveals of name VISHWAK PULLEPU
    gsap.to(".hero-letter", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      stagger: 0.05,
      ease: "elastic.out(1, 0.75)",
      delay: 0.2
    });

    // Fade in Hero elements
    gsap.from(".hero-subtitle-top, .hero-subtitle, .hero-btn", {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.8
    });
  }
}

// --- GSAP SCROLL REVEALS FOR SECTIONS ---
try {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Fade up headers on scroll entrance
    const headers = document.querySelectorAll(".section-header");
    headers.forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Stagger details inside About blocks on scroll
    gsap.from(".about-image-container, .bio-text, .info-sub-card", {
      scrollTrigger: {
        trigger: "#about",
        start: "top 75%"
      },
      opacity: 0,
      y: 50,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out"
    });

    // Stagger project cards reveal
    gsap.from(".project-card", {
      scrollTrigger: {
        trigger: "#projects",
        start: "top 75%"
      },
      opacity: 0,
      y: 60,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out"
    });

    // Stagger certifications reveal
    gsap.from(".awards-grid", {
      scrollTrigger: {
        trigger: "#certifications",
        start: "top 75%"
      },
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out"
    });
  }
} catch (e) {
  console.error("GSAP ScrollTrigger registration/init error:", e);
}

// --- TRAILING CUSTOM CURSOR ---
const cursor = document.getElementById("custom-cursor");
const cursorRing = document.getElementById("custom-cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
});

function updateCursor() {
  const lerpFactor = 0.12;
  ringX += (mouseX - ringX) * lerpFactor;
  ringY += (mouseY - ringY) * lerpFactor;
  
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Set cursor hover active states
const hoverables = document.querySelectorAll("a, button, input, textarea, .tech-item, .art-slide, .glass-card");
hoverables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    document.body.classList.add("hovering");
  });
  el.addEventListener("mouseleave", () => {
    document.body.classList.remove("hovering");
  });
});

// --- PHYSICAL 3D GLASS TILT & GLARE EFFECT ---
const glassCards = document.querySelectorAll(".glass-card");
glassCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    
    // Position of cursor relative to card center (normalized between -1 and 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * -15; // Max 15 degree rotation
    const tiltY = (x - 0.5) * 15;
    
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    
    // Update radial glare position using CSS custom variables
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

// --- MOBILE SLIDING DRAWER NAVIGATION ---
const mobileToggle = document.querySelector(".mobile-nav-toggle");
const mobileMenu = document.querySelector(".mobile-nav-menu");
const closeMobileBtn = document.querySelector(".close-mobile-btn");
const mobileLinks = document.querySelectorAll(".mobile-nav-menu a");

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    mobileMenu.classList.add("open");
  });
}

if (closeMobileBtn && mobileMenu) {
  closeMobileBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});

// --- DYNAMIC MORPHING THREE.JS WEBGL PARTICLE SYSTEM ---
const canvas = document.getElementById("three-bg-canvas");
if (canvas && typeof THREE !== "undefined") {
  try {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 240;
    camera.position.y = 30;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle cloud parameters
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    
    // Set up coordinate arrays for 4 geometric states
    const positionsCurrent = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const stateWave = [];
    const stateSphere = [];
    const stateTorus = [];
    const stateVortex = [];

    const baseColor = new THREE.Color("#e06031");

    // Pre-calculate vertices for all 3D geometries on load
    for (let i = 0; i < particleCount; i++) {
      // 1. WAVE STATE (State 0) - Distributed Wave Grid
      const gridX = (i % 50 - 25) * 8;
      const gridZ = (Math.floor(i / 50) - 20) * 8;
      stateWave.push(gridX, 0, gridZ);

      // 2. SPHERE STATE (State 1) - Golden Ratio distribution
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 80;
      stateSphere.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

      // 3. TORUS KNOT STATE (State 2) - Double Orbit Torus Knot rings
      const angle = (i / particleCount) * Math.PI * 4;
      const torusR = 60 + 20 * Math.sin(3 * angle);
      stateTorus.push(
        torusR * Math.cos(2 * angle),
        20 * Math.cos(3 * angle),
        torusR * Math.sin(2 * angle)
      );

      // 4. VORTEX STATE (State 3) - Concentrated swirl
      const vortexR = (i / particleCount) * 120 + 5;
      const vortexTheta = i * 0.15;
      stateVortex.push(
        vortexR * Math.cos(vortexTheta),
        (i / particleCount) * 140 - 70,
        vortexR * Math.sin(vortexTheta)
      );

      // Initial position set to wave state
      positionsCurrent[i * 3] = gridX;
      positionsCurrent[i * 3 + 1] = 0;
      positionsCurrent[i * 3 + 2] = gridZ;

      // Apply color gradient maps
      const rScalar = 1.0 - (i / particleCount) * 0.4;
      colors[i * 3] = baseColor.r * rScalar;
      colors[i * 3 + 1] = baseColor.g * rScalar;
      colors[i * 3 + 2] = baseColor.b * rScalar;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positionsCurrent, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Circle shader attributes
    const pSize = window.innerWidth < 768 ? 3.0 : 4.5;
    const material = new THREE.PointsMaterial({
      size: pSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Global morph progress target driven dynamically by GSAP ScrollTrigger
    let morphProgress = { value: 0 }; // 0 = Wave, 1 = Sphere, 2 = Torus, 3 = Vortex
    
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.to(morphProgress, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0 // Ties morphing strictly to inertial scroll speed!
        },
        value: 3.0 // Cycles through all states
      });
    }

    // Smooth cursor follow variables
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener("mousemove", (event) => {
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();

    // Animation render loop
    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const positionArray = geometry.attributes.position.array;
      
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const progressVal = morphProgress.value;
      
      // Determine the interpolation state
      let stateStart = stateWave;
      let stateEnd = stateSphere;
      let localProgress = progressVal;

      if (progressVal >= 1.0 && progressVal < 2.0) {
        stateStart = stateSphere;
        stateEnd = stateTorus;
        localProgress = progressVal - 1.0;
      } else if (progressVal >= 2.0) {
        stateStart = stateTorus;
        stateEnd = stateVortex;
        localProgress = progressVal - 2.0;
      }

      // Morph vertices position + apply mathematical ripples
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        
        // Coordinate interpolation (lerp)
        const startX = stateStart[idx];
        const startY = stateStart[idx + 1];
        const startZ = stateStart[idx + 2];

        const endX = stateEnd[idx];
        const endY = stateEnd[idx + 1];
        const endZ = stateEnd[idx + 2];

        const baseX = startX + (endX - startX) * localProgress;
        const baseY = startY + (endY - startY) * localProgress;
        const baseZ = startZ + (endZ - startZ) * localProgress;

        // Micro ripple wave adjustments based on sine coordinates
        let rippleX = 0;
        let rippleY = 0;
        
        if (progressVal < 1.0) {
          // Active sine ripples on wave state
          rippleY = Math.sin(baseX * 0.015 + elapsedTime * 1.5) * 10 + Math.cos(baseZ * 0.015 + elapsedTime * 1.2) * 10;
        } else if (progressVal >= 1.0 && progressVal < 2.0) {
          // Breathing pulse on Sphere state
          rippleX = Math.sin(elapsedTime * 2.0 + baseY * 0.1) * 3;
          rippleY = Math.cos(elapsedTime * 2.0 + baseX * 0.1) * 3;
        } else {
          // Magnetic vortex pull
          rippleX = Math.sin(elapsedTime * 1.5 + baseY) * 2;
        }

        // Cursor repel displacement physics
        const distToCursor = Math.sqrt(
          Math.pow(baseX - currentMouseX * 160, 2) +
          Math.pow(baseZ - currentMouseY * 160, 2)
        );
        const cursorRepel = Math.max(0, 50 - distToCursor * 0.3) * 1.8;

        positionArray[idx] = baseX + rippleX;
        positionArray[idx + 1] = baseY + rippleY + cursorRepel;
        positionArray[idx + 2] = baseZ;
      }

      geometry.attributes.position.needsUpdate = true;

      // Automatic panning camera rotates particles
      particles.rotation.y = elapsedTime * 0.03 + currentMouseX * 0.2;
      particles.rotation.x = currentMouseY * 0.12;

      renderer.render(scene, camera);
    }

    animate();

    // Resize canvas event handler
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  } catch(e) {
    console.error("ThreeJS WebGL Error:", e);
  }
}

// --- ACTIVE LINK ON SCROLL SECTIONS ---
try {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");

  if (lenis) {
    lenis.on('scroll', () => {
      try {
        let scrollY = window.pageYOffset;

        sections.forEach((current) => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 150;
          const sectionId = current.getAttribute("id");

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active");
              }
            });
          }
        });
      } catch (e) {
        console.error("Lenis scroll event callback error:", e);
      }
    });
  }
} catch (e) {
  console.error("Active links on scroll initialization error:", e);
}

// --- DYNAMIC FOOTER CURRENT YEAR ---
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- CONTACT FORM SUBMISSION (FORMSPREE) ---
const contactForm = document.getElementById("portfolio-contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".submit-btn");
    const btnText = btn.querySelector("span");
    const originalText = btnText.textContent;
    const icon = btn.querySelector("i");

    btnText.textContent = "Sending...";
    btn.disabled = true;

    // Get form data
    const formData = new FormData(contactForm);
    const emailStr = formData.get("email");

    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      btnText.textContent = "Invalid Email!";
      btn.style.background = "#c62828";
      btn.style.borderColor = "#c62828";
      icon.className = "fas fa-times-circle";
      
      setTimeout(() => {
        btnText.textContent = originalText;
        btn.style.background = "";
        btn.style.borderColor = "";
        icon.className = "fas fa-paper-plane";
        btn.disabled = false;
      }, 3000);
      
      return; // Stop form submission
    }

    try {
      // Formspree endpoint URL
      const response = await fetch("https://formspree.io/f/xpqezneo", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Success state
        btnText.textContent = "Message Sent!";
        btn.style.background = "#2e7d32";
        btn.style.borderColor = "#2e7d32";
        icon.className = "fas fa-check";
        contactForm.reset();
      } else {
        // Error state from Formspree
        btnText.textContent = "Oops! Error.";
        btn.style.background = "#c62828";
        btn.style.borderColor = "#c62828";
        icon.className = "fas fa-exclamation-triangle";
      }
    } catch (error) {
      // Network/Fetch error state
      btnText.textContent = "Network Error!";
      btn.style.background = "#c62828";
      btn.style.borderColor = "#c62828";
      icon.className = "fas fa-wifi";
    }

    // Reset button back to normal after 3 seconds
    setTimeout(() => {
      btnText.textContent = originalText;
      btn.style.background = "";
      btn.style.borderColor = "";
      icon.className = "fas fa-paper-plane";
      btn.disabled = false;
    }, 3000);
  });
}

// --- CERTIFICATE MODAL SYSTEM WITH ROLLOUT ANIMATION ---
try {
  const awardCards = document.querySelectorAll(".award-card");
  const certModal = document.getElementById("cert-modal");
  const certModalClose = document.querySelector(".cert-modal-close");
  const certModalIframe = document.getElementById("cert-modal-iframe");
  const certModalImg = document.getElementById("cert-modal-img");
  const certModalOverlay = document.querySelector(".cert-modal-overlay");

  if (awardCards && certModal && certModalClose && (certModalIframe || certModalImg)) {
    awardCards.forEach((card) => {
      card.addEventListener("click", () => {
        const fileSrc = card.getAttribute("data-pdf");
        if (!fileSrc) return;

        // Detect if the file is a PDF
        const isPdf = fileSrc.toLowerCase().endsWith(".pdf");

        // 1. Add rolling-out animation class for a premium transition effect
        card.classList.add("rolling-out");

        // 2. Pause Lenis smooth scrolling to lock background interaction
        if (lenis) {
          try { lenis.stop(); } catch(e) {}
        }

        // 3. Open the modal after the rollout animation completes (400ms delay)
        setTimeout(() => {
          if (isPdf) {
            if (certModalImg) {
              certModalImg.style.display = "none";
              certModalImg.src = "";
            }
            if (certModalIframe) {
              certModalIframe.style.display = "block";
              certModalIframe.src = fileSrc;
            }
          } else {
            if (certModalIframe) {
              certModalIframe.style.display = "none";
              certModalIframe.src = "";
            }
            if (certModalImg) {
              certModalImg.style.display = "block";
              certModalImg.src = fileSrc;
            }
          }
          
          certModal.classList.add("active");
          
          // Remove rolling-out class from card once modal is fully open
          setTimeout(() => {
            card.classList.remove("rolling-out");
          }, 300);
        }, 400);
      });
    });

    const closeModal = () => {
      certModal.classList.remove("active");
      
      // Clean up sources and hide elements to release resources
      setTimeout(() => {
        if (certModalIframe) {
          certModalIframe.src = "";
          certModalIframe.style.display = "none";
        }
        if (certModalImg) {
          certModalImg.src = "";
          certModalImg.style.display = "none";
        }
      }, 500);

      // Resume Lenis smooth scrolling
      if (lenis) {
        try { lenis.start(); } catch(e) {}
      }
    };

    certModalClose.addEventListener("click", closeModal);
    if (certModalOverlay) {
      certModalOverlay.addEventListener("click", closeModal);
    }
  }
} catch (e) {
  console.error("Certificate modal initialization error:", e);
}

// --- EASTER EGG LOGIC ---
const secretTrigger = document.getElementById('secret-trigger');
const eeModal = document.getElementById('ee-modal');
const eeClose = document.querySelector('.ee-close');
const eeTerminalBody = document.getElementById('ee-terminal-body');
const eeInputLine = document.getElementById('ee-input-line');
const eeInput = document.getElementById('ee-input');
const eeTerminal = document.getElementById('ee-terminal');
const eeGallery = document.getElementById('ee-gallery');
const eeGalleryTitle = document.getElementById('ee-gallery-title');
const eeGalleryMsg = document.getElementById('ee-gallery-msg');

const friendsData = {
  // Nikitha aliases
  'nikitha': { codename: 'The Catalyst', folderKey: 'squad', msg: 'Hey Nikitha, thanks for always bringing the classic elegance and keeping the group grounded. You\'re the best.' },
  'nikita': { codename: 'The Catalyst', folderKey: 'squad', msg: 'Hey Nikitha, thanks for always bringing the classic elegance and keeping the group grounded. You\'re the best.' },
  'nikki': { codename: 'The Catalyst', folderKey: 'squad', msg: 'Hey Nikitha, thanks for always bringing the classic elegance and keeping the group grounded. You\'re the best.' },
  
  // Sahithi aliases
  'sahithi': { codename: 'The Spark', folderKey: 'squad', msg: 'Hey Sahithi! The brightest energy in the group. Never stop bringing those good vibes.' },
  'sahiti': { codename: 'The Spark', folderKey: 'squad', msg: 'Hey Sahithi! The brightest energy in the group. Never stop bringing those good vibes.' },
  
  // Akhilesh aliases
  'akhilesh': { codename: 'The Anchor', folderKey: 'squad', msg: 'Welcome back, Akhilesh. The cool, calm, and collected core of our squad.' },
  'akilesh': { codename: 'The Anchor', folderKey: 'squad', msg: 'Welcome back, Akhilesh. The cool, calm, and collected core of our squad.' },
  'akhil': { codename: 'The Anchor', folderKey: 'squad', msg: 'Welcome back, Akhilesh. The cool, calm, and collected core of our squad.' },
  
  // Akshara aliases
  'akshara': { codename: 'The Radiance', folderKey: 'squad', msg: 'Hey Akshara! Always bringing the best smiles and the best moments. Keep shining.' },
  'aksara': { codename: 'The Radiance', folderKey: 'squad', msg: 'Hey Akshara! Always bringing the best smiles and the best moments. Keep shining.' },
  
  // Vashishta aliases
  'vashishta': { codename: 'The Wingman', folderKey: 'squad', msg: 'Vashishta logging in. Twinning in traditional! The absolute best partner in crime.' },
  'vashishtha': { codename: 'The Wingman', folderKey: 'squad', msg: 'Vashishta logging in. Twinning in traditional! The absolute best partner in crime.' },
  'vashista': { codename: 'The Wingman', folderKey: 'squad', msg: 'Vashishta logging in. Twinning in traditional! The absolute best partner in crime.' },
  
  // Jayavardan aliases
  'jaya vardan': { codename: 'The Maverick', folderKey: 'jayavardan', msg: 'Jaya Vardan has entered the terminal. The legend himself. Welcome back.' },
  'jayavardan': { codename: 'The Maverick', folderKey: 'jayavardan', msg: 'Jaya Vardan has entered the terminal. The legend himself. Welcome back.' },
  'jaya': { codename: 'The Maverick', folderKey: 'jayavardan', msg: 'Jaya Vardan has entered the terminal. The legend himself. Welcome back.' },
  'jaya vardhan': { codename: 'The Maverick', folderKey: 'jayavardan', msg: 'Jaya Vardan has entered the terminal. The legend himself. Welcome back.' },
  'jaya aunty': { codename: 'The Maverick', folderKey: 'jayavardan', msg: 'Jaya Vardan has entered the terminal. The legend himself. Welcome back.' },
  'jayaamma': { codename: 'The Maverick', folderKey: 'jayavardan', msg: 'Jaya Vardan has entered the terminal. The legend himself. Welcome back.' },

  // Group aliases
  'squad': { codename: 'Core Memory', folderKey: 'squad', msg: 'The best friends a guy could ask for. Squad forever.' },
  'cvr2024': { codename: 'Core Memory', folderKey: 'squad', msg: 'The best friends a guy could ask for. Squad forever.' }
};

if (secretTrigger && eeModal) {
  let typeSpeed = 40;
  let terminalState = 'ID'; 
  let matchedFriend = null;
  let hazardInterval = null;
  
  secretTrigger.addEventListener('click', () => {
    eeModal.classList.remove('hidden');
    eeTerminal.classList.remove('hidden');
    eeGallery.classList.add('hidden');
    eeTerminalBody.innerHTML = '';
    eeInputLine.classList.add('hidden');
    eeInput.value = '';
    terminalState = 'ID';
    matchedFriend = null;
    
    if(hazardInterval) clearInterval(hazardInterval);
    document.querySelector('.ee-overlay').classList.remove('hazard-flash');
    eeTerminal.classList.remove('hazard-shake');
    
    const lines = [
      "> WARNING: UNAUTHORIZED ACCESS DETECTED",
      "> INITIATING TRACE...",
      "> TRACE FAILED.",
      "> PLEASE IDENTIFY YOURSELF (Enter your name or secret code):"
    ];
    
    let lineIdx = 0;
    
    function typeLine() {
      if(lineIdx < lines.length) {
        let p = document.createElement('div');
        eeTerminalBody.appendChild(p);
        let charIdx = 0;
        let line = lines[lineIdx];
        
        function typeChar() {
          if(charIdx < line.length) {
            p.textContent += line.charAt(charIdx);
            charIdx++;
            setTimeout(typeChar, typeSpeed);
          } else {
            lineIdx++;
            setTimeout(typeLine, 300);
          }
        }
        typeChar();
      } else {
        eeInputLine.classList.remove('hidden');
        eeInput.focus();
      }
    }
    
    setTimeout(typeLine, 500);
  });
  
  eeClose.addEventListener('click', () => {
    eeModal.classList.add('hidden');
    if(hazardInterval) clearInterval(hazardInterval);
    document.querySelector('.ee-overlay').classList.remove('hazard-flash');
    eeTerminal.classList.remove('hazard-shake');
  });
  
  function unlockGalleryForFriend(response) {
    let txt = "> CLEARANCE ACCEPTED.\n> Decrypting profile: " + matchedFriend.codename + "...";
    let cIdx = 0;
    function typeRes() {
      if(cIdx < txt.length) {
        response.textContent += txt.charAt(cIdx);
        cIdx++;
        setTimeout(typeRes, 30);
      } else {
        setTimeout(() => {
          eeTerminal.classList.add('hidden');
          eeGallery.classList.remove('hidden');
          eeGalleryTitle.textContent = "Agent: " + matchedFriend.codename;
          eeGalleryMsg.textContent = matchedFriend.msg;
          
          const galleryContainer = document.getElementById('scrolling-gallery');
          if (galleryContainer) {
            galleryContainer.innerHTML = '';
            const assets = window.galleryAssets && window.galleryAssets[matchedFriend.folderKey] ? window.galleryAssets[matchedFriend.folderKey] : [];
            
            if (assets.length === 0) {
              galleryContainer.innerHTML = '<p style="color:var(--accent-color); padding: 50px;">No classified intel found for this agent.</p>';
            } else {
              for (let i = 0; i < 2; i++) {
                assets.forEach(src => {
                  let img = document.createElement('img');
                  img.src = src;
                  img.alt = matchedFriend.codename;
                  galleryContainer.appendChild(img);
                  if (typeof attachTeasingToImage === 'function') {
                    attachTeasingToImage(img);
                  }
                });
              }
            }
          }
        }, 1000);
      }
    }
    typeRes();
  }

  eeInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
      const val = eeInput.value.trim().toLowerCase();
      eeInputLine.classList.add('hidden');
      
      let p = document.createElement('div');
      p.textContent = "> " + eeInput.value;
      eeTerminalBody.appendChild(p);
      
      let response = document.createElement('div');
      response.style.marginTop = '10px';
      eeTerminalBody.appendChild(response);
      
      if (terminalState === 'ID') {
        if (val === 'whoami') {
          let txt = "> vishwak_pullepu\n> ROLE: CYBERSECURITY ENTHUSIAST & DEVELOPER\n> STATUS: READY TO BUILD AWESOME THINGS.";
          let cIdx = 0;
          function typeRes() {
            if(cIdx < txt.length) {
              response.textContent += txt.charAt(cIdx);
              cIdx++;
              setTimeout(typeRes, 30);
            } else {
              setTimeout(() => {
                let restart = document.createElement('div');
                restart.style.marginTop = '10px';
                restart.textContent = "> PLEASE IDENTIFY YOURSELF (Enter your name or secret code):";
                eeTerminalBody.appendChild(restart);
                eeInputLine.classList.remove('hidden');
                eeInput.value = '';
                eeInput.focus();
              }, 1000);
            }
          }
          typeRes();
          return;
        }
        
        if (val === 'matrix') {
          let txt = "> Wake up, Neo...\n> The Matrix has you...\n> Follow the white rabbit.";
          let cIdx = 0;
          function typeRes() {
            if(cIdx < txt.length) {
              response.textContent += txt.charAt(cIdx);
              cIdx++;
              setTimeout(typeRes, 50);
            } else {
              setTimeout(() => {
                eeModal.classList.add('hidden');
                startMatrixRain();
              }, 1500);
            }
          }
          typeRes();
          return;
        }
        
        if (val === 'sudo hire vishwak') {
          let txt = "> INITIATING HIRING PROTOCOL...\n> DISPENSING CONFETTI...\n> PLEASE WAIT...";
          let cIdx = 0;
          function typeRes() {
            if(cIdx < txt.length) {
              response.textContent += txt.charAt(cIdx);
              cIdx++;
              setTimeout(typeRes, 30);
            } else {
              for(let i=0; i<80; i++) {
                 let conf = document.createElement('div');
                 conf.style.position = 'fixed';
                 conf.style.width = '10px';
                 conf.style.height = '10px';
                 conf.style.backgroundColor = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][Math.floor(Math.random()*6)];
                 conf.style.left = Math.random() * 100 + 'vw';
                 conf.style.top = '-10px';
                 conf.style.zIndex = '999999999';
                 document.body.appendChild(conf);
                 
                 let anim = conf.animate([
                   { transform: `translate3d(0,0,0) rotate(0deg)`, opacity: 1 },
                   { transform: `translate3d(${Math.random()*200 - 100}px, 100vh, 0) rotate(${Math.random()*720}deg)`, opacity: 0 }
                 ], {
                   duration: Math.random() * 2000 + 1000,
                   easing: 'cubic-bezier(.37,0,.63,1)'
                 });
                 anim.onfinish = () => conf.remove();
              }
              
              setTimeout(() => {
                let restart = document.createElement('div');
                restart.style.marginTop = '10px';
                restart.textContent = "> RESUME DOWNLOADED (JK, NOT LINKED YET).\n> PLEASE IDENTIFY YOURSELF (Enter your name or secret code):";
                eeTerminalBody.appendChild(restart);
                eeInputLine.classList.remove('hidden');
                eeInput.value = '';
                eeInput.focus();
              }, 2000);
            }
          }
          typeRes();
          return;
        }

        if (val === 'rm -rf /') {
          let txt = "> DELETING SYSTEM FILES...\n";
          let cIdx = 0;
          function typeRes() {
            if(cIdx < txt.length) {
              response.textContent += txt.charAt(cIdx);
              cIdx++;
              setTimeout(typeRes, 30);
            } else {
               let files = ['/boot/vmlinuz', '/etc/passwd', '/home/vishwak', '/var/www', '/usr/bin'];
               let fIdx = 0;
               let delInt = setInterval(() => {
                 if(fIdx < files.length) {
                   let d = document.createElement('div');
                   d.textContent = "> deleted " + files[fIdx];
                   eeTerminalBody.appendChild(d);
                   fIdx++;
                 } else {
                   clearInterval(delInt);
                   setTimeout(() => {
                     let m = document.createElement('div');
                     m.style.color = 'red';
                     m.textContent = "> NICE TRY. REBOOTING...";
                     eeTerminalBody.appendChild(m);
                     setTimeout(() => {
                       location.reload();
                     }, 1500);
                   }, 1000);
                 }
               }, 200);
            }
          }
          typeRes();
          return;
        }

        let isJayaRegex = val.startsWith('j') && val.endsWith('n');
        if(friendsData[val] || isJayaRegex) {
          matchedFriend = friendsData[val] || friendsData['jayavardan'];
          if (matchedFriend.folderKey === 'jayavardan') {
             unlockGalleryForFriend(response);
          } else {
            terminalState = 'SECRET';
            let txt = "> USER RECOGNIZED.\n> AWAITING SECRET CLEARANCE CODE:";
            let cIdx = 0;
            function typeRes() {
              if(cIdx < txt.length) {
                response.textContent += txt.charAt(cIdx);
                cIdx++;
                setTimeout(typeRes, 30);
              } else {
                setTimeout(() => {
                  eeInputLine.classList.remove('hidden');
                  eeInput.value = '';
                  eeInput.focus();
                }, 500);
              }
            }
            typeRes();
          }
        } else {
          let txt = "> ACCESS DENIED. INTRUDER LOGGED.";
          let cIdx = 0;
          function typeRes() {
            if(cIdx < txt.length) {
              response.textContent += txt.charAt(cIdx);
              cIdx++;
              setTimeout(typeRes, 30);
            } else {
              setTimeout(() => {
                eeInputLine.classList.remove('hidden');
                eeInput.value = '';
                eeInput.focus();
              }, 1000);
            }
          }
          typeRes();
        }
      } else if (terminalState === 'SECRET') {
        if (val === 'hacker') {
          unlockGalleryForFriend(response);
        } else {
          let txt = "> INCORRECT CODE. SECURITY ALERT TRIGGERED.\n> INITIATING LOCKDOWN PROTOCOL...";
          terminalState = 'ID';
          matchedFriend = null;
          let cIdx = 0;
          
          function typeRes() {
            if(cIdx < txt.length) {
              response.textContent += txt.charAt(cIdx);
              cIdx++;
              setTimeout(typeRes, 20);
            } else {
              const overlay = document.querySelector('.ee-overlay');
              overlay.classList.add('hazard-flash');
              eeTerminal.classList.add('hazard-shake');
              
              hazardInterval = setInterval(() => {
                 let errLine = document.createElement('div');
                 errLine.style.color = '#ff0000';
                 errLine.style.fontWeight = 'bold';
                 errLine.style.textShadow = '0 0 10px red';
                 errLine.textContent = "ERROR: UNAUTHORIZED ACCESS! ".repeat(Math.floor(Math.random() * 3 + 1));
                 eeTerminalBody.appendChild(errLine);
                 eeTerminalBody.scrollTop = eeTerminalBody.scrollHeight;
              }, 60);
              
              setTimeout(() => {
                clearInterval(hazardInterval);
                overlay.classList.remove('hazard-flash');
                eeTerminal.classList.remove('hazard-shake');
                eeTerminalBody.innerHTML = '';
                
                let restart = document.createElement('div');
                restart.style.marginTop = '10px';
                restart.textContent = "> SYSTEM REBOOTED.\n> PLEASE IDENTIFY YOURSELF (Enter your name or secret code):";
                eeTerminalBody.appendChild(restart);
                eeInputLine.classList.remove('hidden');
                eeInput.value = '';
                eeInput.focus();
              }, 3000); 
            }
          }
          typeRes();
        }
      }
    }
  });

  // MASSIVE TEASE DOWNLOAD SEQUENCE
  const teaseSequence = [
    { text: "Oh, caught you staring! Trying to steal our pics, huh? 😏", btn: "Maybe... can I have it?" },
    { text: "Whoa there, hold on! You can't just click and save around here.", btn: "But I really want it!" },
    { text: "Are you sure your device can even handle this much awesomeness?", btn: "I can handle it, promise!" },
    { text: "I don't know... this is highly classified squad material.", btn: "I have clearance!" },
    { text: "Clearance? We'll see about that. Are you actually going to look at it, or just let it rot in your downloads folder?", btn: "I will cherish it!" },
    { text: "Okay, fine. But you have to promise not to print it out and stick it on your ceiling.", btn: "I won't put it on the ceiling." },
    { text: "What about framing it on your bedside table? Gonna wake up to our faces?", btn: "No bedside table either, I swear!" },
    { text: "Are you absolutely, 100%, undeniably sure you want this picture?", btn: "YES! Just give me the picture!" },
    { text: "Alright, alright. I guess you've earned it. But keep it safe!", btn: "FINALLY! Download Image" }
  ];

  // CANCEL TEASE SEQUENCE
  const cancelSequence = [
    { text: "Oh, playing hard to get? You clicked it, now you HAVE to take it!", btn: "No, seriously, let me out!" },
    { text: "Nope. No escape. The squad has spoken. You're downloading this.", btn: "I don't want it anymore!" },
    { text: "Too late! It's happening!", btn: "Please no!" },
    { text: "Resistance is futile. Just download it already!", btn: "Fine, force download!" },
    { text: "Downloading forcefully to your device right now... 😂", btn: "Get it over with!" }
  ];

  function attachTeasingToImage(img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      let step = 0;
      let cancelStep = -1;
      
      const teaseContainer = document.createElement('div');
      teaseContainer.style.position = 'fixed';
      teaseContainer.style.top = '0';
      teaseContainer.style.left = '0';
      teaseContainer.style.width = '100vw';
      teaseContainer.style.height = '100vh';
      teaseContainer.style.background = 'rgba(0,0,0,0.9)';
      teaseContainer.style.zIndex = '99999999';
      teaseContainer.style.display = 'flex';
      teaseContainer.style.justifyContent = 'center';
      teaseContainer.style.alignItems = 'center';
      
      const teaseBox = document.createElement('div');
      teaseBox.style.background = '#111';
      teaseBox.style.padding = '40px';
      teaseBox.style.borderRadius = '15px';
      teaseBox.style.border = '1px solid var(--accent-color)';
      teaseBox.style.textAlign = 'center';
      teaseBox.style.maxWidth = '500px';
      teaseBox.style.color = 'var(--text-primary)';
      teaseBox.style.boxShadow = '0 10px 40px rgba(0,0,0,0.8)';
      
      const imgPreview = document.createElement('img');
      imgPreview.src = img.src;
      imgPreview.style.width = '100%';
      imgPreview.style.borderRadius = '8px';
      imgPreview.style.marginBottom = '25px';
      imgPreview.style.maxHeight = '250px';
      imgPreview.style.objectFit = 'cover';
      
      const teaseText = document.createElement('h3');
      teaseText.style.fontSize = '22px';
      teaseText.style.marginBottom = '25px';
      teaseText.style.lineHeight = '1.5';
      teaseText.style.color = 'var(--accent-color)';
      teaseText.textContent = teaseSequence[step].text;
      
      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.flexDirection = 'column';
      btnContainer.style.gap = '15px';
      
      const actionBtn = document.createElement('button');
      actionBtn.style.padding = '15px 25px';
      actionBtn.style.background = 'var(--accent-color)';
      actionBtn.style.color = '#000';
      actionBtn.style.border = 'none';
      actionBtn.style.borderRadius = '8px';
      actionBtn.style.cursor = 'pointer';
      actionBtn.style.fontWeight = 'bold';
      actionBtn.style.fontSize = '16px';
      actionBtn.textContent = teaseSequence[step].btn;
      
      const cancelBtn = document.createElement('button');
      cancelBtn.style.padding = '10px 25px';
      cancelBtn.style.background = 'transparent';
      cancelBtn.style.color = 'var(--text-secondary)';
      cancelBtn.style.border = '1px solid #555';
      cancelBtn.style.borderRadius = '8px';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.textContent = "Okay fine, I give up. Cancel.";
      
      btnContainer.appendChild(actionBtn);
      btnContainer.appendChild(cancelBtn);
      
      teaseBox.appendChild(imgPreview);
      teaseBox.appendChild(teaseText);
      teaseBox.appendChild(btnContainer);
      teaseContainer.appendChild(teaseBox);
      document.body.appendChild(teaseContainer);
      
      if(window.lenis) { try { window.lenis.stop(); } catch(e){} }
      
      const closeModal = () => {
        teaseContainer.remove();
        if(window.lenis) { try { window.lenis.start(); } catch(e){} }
      };
      
      cancelBtn.addEventListener('click', () => {
        if(cancelStep === -1) cancelStep = 0;
        else cancelStep++;
        
        if(cancelStep < cancelSequence.length) {
          teaseText.textContent = cancelSequence[cancelStep].text;
          cancelBtn.textContent = cancelSequence[cancelStep].btn;
          actionBtn.style.display = 'none'; 
          
          teaseBox.style.transform = 'scale(0.95) rotate(-2deg)';
          setTimeout(() => teaseBox.style.transform = 'scale(1) rotate(0deg)', 150);
        } else {
          const link = document.createElement('a');
          link.href = img.src;
          const filename = img.src.split('/').pop();
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          closeModal();
        }
      });
      
      actionBtn.addEventListener('click', () => {
        step++;
        if(step < teaseSequence.length) {
          teaseText.textContent = teaseSequence[step].text;
          actionBtn.textContent = teaseSequence[step].btn;
          
          teaseBox.style.transform = 'scale(1.02)';
          setTimeout(() => teaseBox.style.transform = 'scale(1)', 150);
        } else {
          const link = document.createElement('a');
          link.href = img.src;
          const filename = img.src.split('/').pop();
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          closeModal();
        }
      });
    });
  }
}

// --- LASER POINTER CURSOR ---
const heroNameTrigger = document.getElementById('hero-name-trigger');
let clickCount = 0;
let clickTimeout;
let laserActive = false;

if (heroNameTrigger) {
  heroNameTrigger.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimeout);
    
    if (clickCount >= 5) {
      toggleLaser();
      clickCount = 0;
    } else {
      clickTimeout = setTimeout(() => {
        clickCount = 0;
      }, 500); // 5 clicks within 500ms per gap
    }
  });
}

function toggleLaser() {
  laserActive = !laserActive;
  if (laserActive) {
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousemove', drawLaser);
    document.addEventListener('touchmove', drawLaser, {passive: false});
  } else {
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', drawLaser);
    document.removeEventListener('touchmove', drawLaser);
  }
}

function drawLaser(e) {
  if (e.type === 'touchmove') e.preventDefault(); // Prevent scrolling while drawing laser
  let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

  const laserDot = document.createElement('div');
  laserDot.style.position = 'fixed';
  laserDot.style.left = clientX + 'px';
  laserDot.style.top = clientY + 'px';
  laserDot.style.width = '6px';
  laserDot.style.height = '6px';
  laserDot.style.borderRadius = '50%';
  laserDot.style.backgroundColor = '#ff0000';
  laserDot.style.boxShadow = '0 0 10px #ff0000, 0 0 20px #ff0000';
  laserDot.style.pointerEvents = 'none';
  laserDot.style.zIndex = '9999999999';
  
  document.body.appendChild(laserDot);
  
  const anim = laserDot.animate([
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(0)' }
  ], {
    duration: 1000,
    easing: 'ease-out'
  });
  
  anim.onfinish = () => laserDot.remove();
}

// --- DARK WEB MODE ---
const darkWebTrigger = document.getElementById('dark-web-trigger');
if (darkWebTrigger) {
  darkWebTrigger.addEventListener('click', () => {
    document.body.classList.toggle('dark-web-mode');
    
    // Add glitch sound effect
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
  });
}

// --- MATRIX DIGITAL RAIN ---
function startMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '99999999';
  canvas.style.pointerEvents = 'none'; // so you can still click things underneath
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const charArray = characters.split('');
  
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const matrixInterval = setInterval(draw, 33);
  
  // Create an exit button for the matrix rain
  const exitBtn = document.createElement('button');
  exitBtn.textContent = 'EXIT MATRIX';
  exitBtn.style.position = 'fixed';
  exitBtn.style.bottom = '20px';
  exitBtn.style.right = '20px';
  exitBtn.style.zIndex = '100000000';
  exitBtn.style.padding = '10px 20px';
  exitBtn.style.background = '#0F0';
  exitBtn.style.color = '#000';
  exitBtn.style.fontFamily = 'monospace';
  exitBtn.style.fontWeight = 'bold';
  exitBtn.style.border = 'none';
  exitBtn.style.cursor = 'pointer';
  document.body.appendChild(exitBtn);
  
  exitBtn.addEventListener('click', () => {
    clearInterval(matrixInterval);
    canvas.remove();
    exitBtn.remove();
  });
}


// --- KONAMI CODE SNAKE GAME ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let konamiPosition = 0;

function checkKonami(input) {
  if (input === konamiCode[konamiPosition]) {
    konamiPosition++;
    if (konamiPosition === konamiCode.length) {
      launchSnakeGame();
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
}

document.addEventListener('keydown', (e) => {
  checkKonami(e.key);
});

let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, {passive: true});

document.addEventListener('touchend', e => {
  let touchEndX = e.changedTouches[0].screenX;
  let touchEndY = e.changedTouches[0].screenY;
  handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, {passive: true});

function handleSwipe(startX, startY, endX, endY) {
  let diffX = endX - startX;
  let diffY = endY - startY;
  if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return; // Tap, not swipe
  
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) checkKonami('ArrowRight');
    else checkKonami('ArrowLeft');
  } else {
    if (diffY > 0) checkKonami('ArrowDown');
    else checkKonami('ArrowUp');
  }
}

function launchSnakeGame() {
  // Create Modal
  if (document.getElementById('snake-modal')) return;
  
  const modal = document.createElement('div');
  modal.id = 'snake-modal';
  
  const title = document.createElement('h1');
  title.textContent = "HACKER SNAKE";
  title.style.marginBottom = '10px';
  title.style.color = '#0f0';
  
  const scoreBoard = document.createElement('div');
  scoreBoard.id = 'snake-score';
  scoreBoard.textContent = "SCORE: 0";
  
  const canvas = document.createElement('canvas');
  canvas.id = 'snake-canvas';
  canvas.width = 400;
  canvas.height = 400;
  
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'snake-gameover';
  
  const gameOverTitle = document.createElement('h2');
  gameOverTitle.textContent = "SYSTEM FAILURE";
  
  const finalScore = document.createElement('p');
  finalScore.style.fontSize = '20px';
  finalScore.textContent = "Final Score: 0";
  
  const restartBtn = document.createElement('button');
  restartBtn.className = 'snake-btn';
  restartBtn.textContent = "REBOOT (Play Again)";
  
  const exitBtn = document.createElement('button');
  exitBtn.className = 'snake-btn';
  exitBtn.textContent = "EXIT SYSTEM";
  exitBtn.style.borderColor = '#f00';
  exitBtn.style.color = '#f00';
  exitBtn.style.marginTop = '10px';
  
  gameOverScreen.appendChild(gameOverTitle);
  gameOverScreen.appendChild(finalScore);
  gameOverScreen.appendChild(restartBtn);
  gameOverScreen.appendChild(exitBtn);
  
  modal.appendChild(title);
  modal.appendChild(scoreBoard);
  modal.appendChild(canvas);
  modal.appendChild(gameOverScreen);
  document.body.appendChild(modal);
  
  if(window.lenis) { try { window.lenis.stop(); } catch(e){} }
  
  // Game Logic
  const ctx = canvas.getContext('2d');
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;
  
  let snake = [];
  let velocityX = 0;
  let velocityY = 0;
  let foodX = 15;
  let foodY = 15;
  let score = 0;
  let gameInterval;
  
  function resetGame() {
    snake = [
      {x: 10, y: 10},
      {x: 10, y: 11},
      {x: 10, y: 12}
    ];
    velocityX = 0;
    velocityY = -1;
    score = 0;
    scoreBoard.textContent = "SCORE: 0";
    placeFood();
    gameOverScreen.style.display = 'none';
    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
  }
  
  function placeFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
  }
  
  function gameLoop() {
    // Move snake
    let head = {x: snake[0].x + velocityX, y: snake[0].y + velocityY};
    
    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      return gameOver();
    }
    
    // Check collision with self
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return gameOver();
      }
    }
    
    snake.unshift(head);
    
    // Check collision with food
    if (head.x === foodX && head.y === foodY) {
      score += 10;
      scoreBoard.textContent = "SCORE: " + score;
      placeFood();
    } else {
      snake.pop();
    }
    
    // Draw background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
    
    // Draw snake
    ctx.fillStyle = "lime";
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }
  }
  
  function gameOver() {
    clearInterval(gameInterval);
    finalScore.textContent = "Final Score: " + score;
    gameOverScreen.style.display = 'flex';
  }
  
  // Controls
  function keyHandler(e) {
    if (gameOverScreen.style.display === 'flex') return;
    if (e.key === 'ArrowUp' && velocityY !== 1) { velocityX = 0; velocityY = -1; e.preventDefault(); }
    if (e.key === 'ArrowDown' && velocityY !== -1) { velocityX = 0; velocityY = 1; e.preventDefault(); }
    if (e.key === 'ArrowLeft' && velocityX !== 1) { velocityX = -1; velocityY = 0; e.preventDefault(); }
    if (e.key === 'ArrowRight' && velocityX !== -1) { velocityX = 1; velocityY = 0; e.preventDefault(); }
  }
  
  document.addEventListener('keydown', keyHandler);

  let gameTouchStartX = 0;
  let gameTouchStartY = 0;
  
  modal.addEventListener('touchstart', e => {
    gameTouchStartX = e.changedTouches[0].screenX;
    gameTouchStartY = e.changedTouches[0].screenY;
  }, {passive: true});

  modal.addEventListener('touchend', e => {
    let gameTouchEndX = e.changedTouches[0].screenX;
    let gameTouchEndY = e.changedTouches[0].screenY;
    if (gameOverScreen.style.display === 'flex') return;

    let diffX = gameTouchEndX - gameTouchStartX;
    let diffY = gameTouchEndY - gameTouchStartY;
    
    if (Math.abs(diffX) < 20 && Math.abs(diffY) < 20) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && velocityX !== -1) { velocityX = 1; velocityY = 0; } // Right
      else if (diffX < 0 && velocityX !== 1) { velocityX = -1; velocityY = 0; } // Left
    } else {
      if (diffY > 0 && velocityY !== -1) { velocityX = 0; velocityY = 1; } // Down
      else if (diffY < 0 && velocityY !== 1) { velocityX = 0; velocityY = -1; } // Up
    }
  }, {passive: true});
  
  restartBtn.addEventListener('click', resetGame);
  exitBtn.addEventListener('click', () => {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', keyHandler);
    modal.remove();
    if(window.lenis) { try { window.lenis.start(); } catch(e){} }
  });
  
  resetGame();
}
