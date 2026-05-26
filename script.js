// --- INERTIAL SMOOTH SCROLLING (LENIS) ---
let lenis;
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
    lenis.on('scroll', ScrollTrigger.update);
  }

  if (typeof gsap !== "undefined") {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
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
        if (preloader) preloader.classList.add("loaded");
        if (mainContent) {
          mainContent.classList.remove("hidden");
        }
        // Force refresh GSAP layout metrics after page reveal
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
        // Fire entrance animations
        playEntranceAnimations();
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
  gsap.from(".award-card", {
    scrollTrigger: {
      trigger: "#certifications",
      start: "top 75%"
    },
    opacity: 0,
    scale: 0.9,
    y: 40,
    duration: 1,
    stagger: 0.15,
    ease: "back.out(1.2)"
  });
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

        const basePos = new THREE.Vector3(
          startX + (endX - startX) * localProgress,
          startY + (endY - startY) * localProgress,
          startZ + (endZ - startZ) * localProgress
        );

        // Micro ripple wave adjustments based on sine coordinates
        let rippleX = 0;
        let rippleY = 0;
        
        if (progressVal < 1.0) {
          // Active sine ripples on wave state
          rippleY = Math.sin(basePos.x * 0.015 + elapsedTime * 1.5) * 10 + Math.cos(basePos.z * 0.015 + elapsedTime * 1.2) * 10;
        } else if (progressVal >= 1.0 && progressVal < 2.0) {
          // Breathing pulse on Sphere state
          rippleX = Math.sin(elapsedTime * 2.0 + basePos.y * 0.1) * 3;
          rippleY = Math.cos(elapsedTime * 2.0 + basePos.x * 0.1) * 3;
        } else {
          // Magnetic vortex pull
          rippleX = Math.sin(elapsedTime * 1.5 + basePos.y) * 2;
        }

        // Cursor repel displacement physics
        const distToCursor = Math.sqrt(
          Math.pow(basePos.x - currentMouseX * 160, 2) +
          Math.pow(basePos.z - currentMouseY * 160, 2)
        );
        const cursorRepel = Math.max(0, 50 - distToCursor * 0.3) * 1.8;

        positionArray[idx] = basePos.x + rippleX;
        positionArray[idx + 1] = basePos.y + rippleY + cursorRepel;
        positionArray[idx + 2] = basePos.z;
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
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

if (lenis) {
  lenis.on('scroll', () => {
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
  });
}

// --- DYNAMIC FOOTER CURRENT YEAR ---
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- CONTACT FORM SUCCESS UI STATE MORPH ---
const contactForm = document.getElementById("portfolio-contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".submit-btn");
    const btnText = btn.querySelector("span");
    const originalText = btnText.textContent;

    btnText.textContent = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
      btnText.textContent = "Message Sent!";
      btn.style.background = "#2e7d32";
      btn.style.borderColor = "#2e7d32";
      btn.querySelector("i").className = "fas fa-check";
      contactForm.reset();

      setTimeout(() => {
        btnText.textContent = originalText;
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.querySelector("i").className = "fas fa-paper-plane";
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}
