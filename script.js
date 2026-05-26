// --- PRELOADER SIMULATION & ENTRANCE ---
document.addEventListener("DOMContentLoaded", () => {
  const progressFill = document.querySelector(".progress-bar-fill");
  const preloader = document.getElementById("preloader");
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add("loaded");
      }, 500);
    }
    progressFill.style.width = `${progress}%`;
  }, 100);
});

// --- CUSTOM CURSOR ---
const cursor = document.getElementById("custom-cursor");
const cursorRing = document.getElementById("custom-cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
let ringX = mouseX;
let ringY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Set inner dot immediately
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

// Smooth lerp (linear interpolation) loop for trailing cursor ring
function updateCursor() {
  const lerpFactorRing = 0.15;
  
  ringX += (mouseX - ringX) * lerpFactorRing;
  ringY += (mouseY - ringY) * lerpFactorRing;
  
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;
  
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Detect cursor hovering over interactive elements
const hoverables = document.querySelectorAll("a, button, input, textarea, .tech-item, .art-slide");
hoverables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    document.body.classList.add("hovering");
  });
  el.addEventListener("mouseleave", () => {
    document.body.classList.remove("hovering");
  });
});

// --- MOBILE NAV TOGGLE ---
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

// --- THREE.JS INTERACTIVE PARTICLE FIELD ---
const canvas = document.getElementById("three-bg-canvas");
if (canvas && typeof THREE !== "undefined") {
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 220;
  camera.position.y = 80;
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create responsive wave grid particles
  const countX = 65;
  const countY = 65;
  const spacing = 10;
  const particleCount = countX * countY;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Accent color in HSL/RGB: e06031 is RGB(224, 96, 49)
  const baseColor = new THREE.Color("#e06031");

  let i = 0;
  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      // Centered positions
      const posX = (x - countX / 2) * spacing;
      const posZ = (y - countY / 2) * spacing;
      const posY = 0;

      positions[i * 3] = posX;
      positions[i * 3 + 1] = posY;
      positions[i * 3 + 2] = posZ;

      // Color gradient scaling from center
      const distFromCenter = Math.sqrt(posX * posX + posZ * posZ) / 400;
      const particleColor = baseColor.clone().multiplyScalar(1 - Math.min(distFromCenter, 0.7));

      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;

      i++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Small circle sprite for points
  const pSize = window.innerWidth < 768 ? 2.5 : 4.0;
  const material = new THREE.PointsMaterial({
    size: pSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse interaction variables
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener("mousemove", (event) => {
    // Normalise mouse coords between -1 and 1
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const positionArray = geometry.attributes.position.array;

    // Smoothly lerp normalized mouse movements
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Dynamic wave ripples based on sine coordinates + mouse offset
    let idx = 0;
    for (let x = 0; x < countX; x++) {
      for (let y = 0; y < countY; y++) {
        const posX = positionArray[idx * 3];
        const posZ = positionArray[idx * 3 + 2];

        // Complex wave equations
        const wave1 = Math.sin(posX * 0.015 + elapsedTime * 1.5) * 12;
        const wave2 = Math.cos(posZ * 0.015 + elapsedTime * 1.2) * 12;
        
        // Mouse hover displacement effect
        const distToMouse = Math.sqrt(Math.pow(posX - currentMouseX * 180, 2) + Math.pow(posZ - currentMouseY * 180, 2));
        const mouseRepel = Math.max(0, 45 - distToMouse * 0.3) * 1.5;

        positionArray[idx * 3 + 1] = wave1 + wave2 + mouseRepel;
        idx++;
      }
    }

    geometry.attributes.position.needsUpdate = true;

    // Subtle automatic camera panning
    particles.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.15;
    particles.rotation.x = currentMouseY * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// --- ACTIVE LINK SECTIONS ON SCROLL ---
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
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

// --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
const revealElements = document.querySelectorAll(".reveal-on-scroll");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

// --- CONTACT FORM SUBMISSION ---
const contactForm = document.getElementById("portfolio-contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".submit-btn");
    const btnText = btn.querySelector("span");
    const originalText = btnText.textContent;

    // Morph state
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
