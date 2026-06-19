document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE DETECTION ---
  const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // Add mobile class to body for CSS overrides
  if (isMobile) {
    document.body.classList.add('is-mobile');
  }

  // --- SMOOTH SCROLLING (LENIS) ---
  // Only initialize smooth scroll on desktop. Native mobile scroll is hardware accelerated and smoother.
  if (!isMobile && typeof Lenis !== "undefined") {
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

if (!isMobile) {
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
}

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
        
        // --- SUCCESS OVERLAY & PAPER PLANE ANIMATION ---
        const successOverlay = document.getElementById("success-overlay");
        
        // 1. Show the Green Full-Screen Overlay
        if (successOverlay) {
          successOverlay.classList.add("active");
        }
        
        // 2. Hide original icon
        icon.style.opacity = '0';
        
        // 3. Wait 1.5s for user to read "Message Sent" then launch the plane!
        setTimeout(() => {
          // Create a clone and append to body, starting in the center of the screen
          const plane = document.createElement("i");
          plane.className = "fas fa-paper-plane flying-paper-plane";
          plane.style.left = `${window.innerWidth / 2}px`;
          plane.style.top = `${window.innerHeight / 2 + 50}px`; // slightly below center
          document.body.appendChild(plane);
          
          // Fade out the overlay so we can see the website as the plane flies
          if (successOverlay) {
            successOverlay.classList.remove("active");
          }
          
          // Calculate safe sway distance to prevent mobile overflow
          const swayDist = Math.min(200, window.innerWidth / 2 - 40);

          // GSAP Timeline for the flight path
          if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // Initial blast off from the center
            tl.to(plane, {
              y: window.innerHeight / 2 - 100,
              rotation: -45,
              scale: window.innerWidth < 768 ? 2 : 3, // Smaller plane on mobile
              duration: 0.8,
              ease: "power2.out",
              onComplete: () => {
                // Trigger smooth scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            })
            // Loop / Circling animation
            .to(plane, {
              x: window.innerWidth / 2 - swayDist,
              rotation: -80,
              duration: 0.8,
              ease: "sine.inOut"
            })
            .to(plane, {
              x: window.innerWidth / 2 + swayDist,
              rotation: -10,
              duration: 0.8,
              ease: "sine.inOut"
            })
            .to(plane, {
              x: window.innerWidth / 2,
              rotation: -45,
              duration: 0.5,
              ease: "sine.inOut"
            })
            // Blast off top of screen
            .to(plane, {
              y: -500, // Fly off top of screen
              scale: 1,
              duration: 0.6,
              ease: "power3.in",
              onComplete: () => {
                plane.remove(); // Cleanup clone
                icon.style.opacity = '1'; // Restore original icon
                icon.className = "fas fa-check"; // Set to checkmark
              }
            });
          } else {
            // Fallback
            icon.className = "fas fa-check";
            icon.style.opacity = '1';
          }
        }, 1500);

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

});


// --- GITHUB CALENDAR & REPOSITORIES FETCH LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
  const username = "viswakpullepu";
  
  // Initialize GitHub Calendar Contribution Graph
  if (typeof GitHubCalendar !== 'undefined') {
    GitHubCalendar(".calendar", username, { responsive: true, global_stats: false });
  }

  const repoContainer = document.getElementById("github-repos");
  const loadingIndicator = document.getElementById("github-loading");

  if (!repoContainer) return;

  const langColors = {
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    TypeScript: "#3178c6",
    Shell: "#89e051"
  };

  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(repos => {
      if (loadingIndicator) loadingIndicator.style.display = "none";
      repoContainer.style.display = ""; // Defaults to grid due to class

      if (!Array.isArray(repos) || repos.length === 0) {
        repoContainer.innerHTML = "<p>No repositories found or API rate limit reached.</p>";
        return;
      }

      const repoDataMap = {
        "activity-generator": { type: "Digital Tool", image: "assets/repo_activity.png", desc: "A sleek digital utility for generating and tracking custom activities and workflows." },
        "anon-chat": { type: "Web App", image: "assets/repo_anon_chat.png", desc: "A real-time anonymous messaging platform built for secure and untraceable communication." },
        "Canarytoken": { type: "Cybersecurity Tool", image: "assets/repo_canary.png", desc: "A digital trap and tracking system designed to alert you of unauthorized system access." },
        "cvresportsoff": { type: "Web Service", image: "assets/repo_cvresports.png", desc: "An export and management utility for CV and esports related tracking systems." },
        "demo-restaurant-backend": { type: "Backend API", image: "assets/repo_rest_backend.png", desc: "Robust server-side architecture and database management for a modern restaurant application." },
        "demo-restaurant-frontend": { type: "Web App", image: "assets/repo_rest_frontend.png", desc: "An elegant, responsive customer-facing interface for a restaurant ordering system." },
        "interior-design": { type: "Website", image: "assets/repo_interior.png", desc: "A visually stunning landing page for premium interior design and architectural services." },
        "kotha-s-atelier": { type: "Web App", image: "assets/repo_atelier.png", desc: "A sophisticated web application tailored for an atelier, focusing on premium digital presentation." },
        "LORVEN": { type: "Digital Agency", image: "assets/repo_lorven.png", desc: "Corporate portfolio and service showcase for a comprehensive digital services company." },
        "ngl---clone": { type: "Web App", image: "assets/repo_ngl.png", desc: "A functional frontend clone of the popular NGL anonymous Q&A platform." },
        "password-strength-checker": { type: "Security Utility", image: "assets/repo_python.png", desc: "A Python-based cryptographic tool for evaluating and validating password entropy." },
        "ppt-reviewer-agent": { type: "AI Tool", image: "assets/project1.png", desc: "An AI-powered analyzer built with FastAPI that reviews presentations and provides actionable design suggestions." },
        "professional-resume": { type: "Digital Profile", image: "assets/project2.png", desc: "A cleanly formatted, code-based professional resume repository." },
        "resume-builder-app": { type: "Web App", image: "assets/project3.png", desc: "A full-stack resume maker with AI-powered suggestions and ATS optimization." },
        "resume-maker": { type: "Digital Tool", image: "assets/repo_generic.png", desc: "A lightweight client-side application for generating and downloading PDF resumes in real-time." },
        "REVISO": { type: "Landing Page", image: "assets/repo_ts.png", desc: "A sleek pre-registration portal featuring modern UI components and conversion optimization." },
        "Vishwak-Naidu": { type: "Portfolio Website", image: "assets/repo_vishwak.png", desc: "My primary creative developer portfolio, featuring glassmorphism and advanced GSAP animations." },
        "viswak-portfolio": { type: "Website", image: "assets/repo_js.png", desc: "An alternative, streamlined version of my professional web development portfolio." },
        "viswakpullepu": { type: "Profile Readme", image: "assets/repo_profile.png", desc: "The foundational README repository that acts as the front page of my GitHub profile." },
        "vn-music-assistant": { type: "Web App", image: "assets/repo_music.png", desc: "A digital music utility designed to assist with audio playback and frequency analysis." }
      };

      repos.forEach(repo => {
        const langColor = langColors[repo.language] || "#ccc";
        const langHtml = repo.language ? `<span><i class="repo-lang-color" style="background:${langColor}"></i> ${repo.language}</span>` : "";
        
        // Fallback logic in case of unmapped repositories in the future
        let repoConfig = repoDataMap[repo.name] || { 
          type: "Open Source", 
          image: "assets/repo_generic.png",
          desc: repo.description || "No description provided." 
        };
        
        const desc = repoConfig.desc;
        
        // Match specific data if configured, otherwise fallback

        
        const card = document.createElement("a");
        card.href = repo.html_url;
        card.target = "_blank";
        card.className = "github-repo-card glass-card";
        
        card.innerHTML = `
          <div class="repo-image-box">
            <span class="repo-type-badge">${repoConfig.type}</span>
            <img src="${repoConfig.image}" alt="${repo.name} Preview" loading="lazy" />
          </div>
          <div class="repo-content">
            <div>
              <div class="repo-name"><i class="far fa-folder-open"></i> ${repo.name}</div>
              <div class="repo-desc">${desc}</div>
            </div>
            <div class="repo-meta">
              ${langHtml}
              <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
              <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
          </div>
        `;
        repoContainer.appendChild(card);
      });
      
      // --- VERCEL DEPLOYMENTS LOGIC ---
      const vercelLoading = document.getElementById("vercel-loading");
      const vercelContainer = document.getElementById("vercel-deployments");
      
      if (vercelLoading && vercelContainer) {
        // Filter repos that have a homepage containing 'vercel.app'
        const vercelRepos = repos.filter(repo => repo.homepage && repo.homepage.includes("vercel.app"));
        
        if (vercelRepos.length > 0) {
          vercelLoading.style.display = "none";
          vercelContainer.style.display = "";
          
          vercelRepos.forEach(repo => {
            const card = document.createElement("a");
            card.href = repo.homepage;
            card.target = "_blank";
            card.className = "vercel-card";
            
            // Format repo name cleanly
            const cleanName = repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            card.innerHTML = `
              <div>
                <div class="vercel-card-header">
                  <h3 class="vercel-card-title">
                    <svg viewBox="0 0 116 100" fill="#fff" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M57.5 0L115 100H0L57.5 0z"/></svg>
                    ${cleanName}
                  </h3>
                  <div class="vercel-status">
                    <div class="vercel-status-dot"></div>
                    Ready
                  </div>
                </div>
                <p class="vercel-card-desc">${repo.description || 'Production deployment successfully running on Vercel Edge Network.'}</p>
              </div>
              <div class="vercel-card-footer">
                <span style="color: #666; font-size: 0.8rem; font-family: 'Courier New', monospace;">${repo.homepage.replace('https://', '')}</span>
                <button class="vercel-link-btn">Visit <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i></button>
              </div>
            `;
            vercelContainer.appendChild(card);
          });
        } else {
          vercelLoading.innerHTML = "<p>No active Vercel deployments found.</p>";
        }
      }
      
      // Refresh GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 500);
      }
    })
    .catch(error => {
      console.error("Error fetching GitHub repos:", error);
      if (loadingIndicator) {
        loadingIndicator.innerHTML = "<p>Unable to load GitHub repositories at the moment. (API Rate Limit)</p>";
      }
    });
});

// --- 3D SKILL SPHERE (TagCloud.js) ---
document.addEventListener("DOMContentLoaded", () => {
  const container = '#skill-sphere';
  
  // Massive array of Devicon HTML tags to create a dense 3D sphere
  const skills = [
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://chatgpt.com&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://gemini.google.com&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://claude.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://github.com/features/copilot&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://huggingface.co&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://midjourney.com&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://openai.com/dall-e-3&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://perplexity.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://stability.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://notion.so&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://jasper.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://runwayml.com&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://v0.dev&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://mistral.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://leonardo.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://copy.ai&size=64" style="width: 32px; height: 32px; border-radius: 6px;" />',
    '<i class="devicon-react-original colored"></i>',
    '<i class="devicon-nodejs-plain colored"></i>',
    '<i class="devicon-nextjs-original"></i>',
    '<i class="devicon-tailwindcss-original colored"></i>',
    '<i class="devicon-express-original"></i>',
    '<i class="devicon-spring-original colored"></i>',
    '<i class="devicon-git-plain colored"></i>',
    '<i class="devicon-github-original"></i>',
    '<i class="devicon-docker-plain colored"></i>',
    '<i class="devicon-figma-plain colored"></i>',
    '<i class="devicon-vscode-plain colored"></i>',
    '<i class="devicon-postman-plain colored"></i>',
    '<i class="devicon-amazonwebservices-plain-wordmark colored"></i>',
    '<i class="devicon-azure-plain colored"></i>',
    '<i class="devicon-mongodb-plain colored"></i>',
    '<i class="devicon-postgresql-plain colored"></i>',
    '<i class="devicon-firebase-plain colored"></i>',
    '<i class="devicon-tensorflow-original colored"></i>',
    '<i class="devicon-pytorch-original colored"></i>',
    '<i class="devicon-opencv-plain colored"></i>',
    '<i class="devicon-numpy-original colored"></i>',
    '<i class="devicon-pandas-original colored"></i>',
    '<i class="devicon-linux-plain"></i>',
    '<i class="devicon-networkx-plain colored"></i>',
    '<i class="devicon-npm-original-wordmark colored"></i>',
    '<i class="devicon-webpack-plain colored"></i>',
    '<i class="devicon-babel-plain colored"></i>',
    '<i class="devicon-jest-plain colored"></i>',
    '<i class="devicon-graphql-plain colored"></i>',
    '<i class="devicon-redis-plain colored"></i>',
    '<i class="devicon-ubuntu-plain colored"></i>',
    '<i class="devicon-kubernetes-plain colored"></i>',
    '<i class="devicon-android-plain colored"></i>',
    '<i class="devicon-apple-original"></i>',
    '<i class="devicon-windows8-original colored"></i>',
    '<i class="devicon-chrome-plain colored"></i>',
    '<i class="devicon-firefox-plain colored"></i>',
    '<i class="devicon-slack-plain colored"></i>',
    '<i class="devicon-trello-plain colored"></i>',
    '<i class="devicon-jira-plain colored"></i>',
    '<i class="devicon-markdown-original"></i>',
    '<i class="devicon-json-plain colored"></i>',
    '<i class="devicon-yaml-plain colored"></i>',
    '<i class="devicon-sqlite-plain colored"></i>',
    '<i class="devicon-oracle-original colored"></i>',
    '<i class="devicon-vuejs-plain colored"></i>',
    '<i class="devicon-angularjs-plain colored"></i>',
    '<i class="devicon-svelte-plain colored"></i>',
    '<i class="devicon-jquery-plain colored"></i>',
    '<i class="devicon-wordpress-plain colored"></i>',
    '<i class="devicon-webflow-original"></i>',
    '<i class="devicon-debian-plain colored"></i>',
    '<i class="devicon-nginx-original colored"></i>',
    '<i class="devicon-apache-plain colored"></i>',
    '<i class="devicon-heroku-original colored"></i>',
    '<i class="devicon-digitalocean-plain colored"></i>',
    '<i class="devicon-bitbucket-original colored"></i>',
    '<i class="devicon-gitlab-plain colored"></i>',
    '<i class="devicon-confluence-original colored"></i>',
    '<i class="devicon-discord-plain colored"></i>'
  ];

  // Configure TagCloud
  const options = {
    radius: window.innerWidth < 768 ? 160 : 250,
    maxSpeed: 'fast',
    initSpeed: 'normal',
    direction: 135,
    keep: true
  };

  // Only init if TagCloud is loaded and container exists
  if (typeof TagCloud !== 'undefined' && document.querySelector(container)) {
    TagCloud(container, skills, options);
    
    // WORKAROUND: TagCloud v2.2.0 escapes HTML by default.
    // We manually convert the escaped text back into actual HTML DOM nodes.
    setTimeout(() => {
      document.querySelectorAll('.tagcloud--item').forEach(item => {
        item.innerHTML = item.textContent;
      });
    }, 100);
  }
});
