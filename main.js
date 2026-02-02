const toggleButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Toggle on button click
toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Collapse the menu when any link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
    });
});

(function () {
    // 1) Put your images here (relative paths)
    const pastorImages = [
        "IMG_8130.jpg",
        "IMG_8131.jpg",
        "IMG_8136.jpg"
        //"timothy.jpg"
        // "pastor_sohn_2.jpg",
        // "pastor_2.jpg",
        // "pastor_3.jpg"
    ];

    const slidesHost = document.getElementById("pastorSlides");
    const prevBtn = document.getElementById("pastorPrev");
    const nextBtn = document.getElementById("pastorNext");
    const dotsHost = document.getElementById("pastorDots");
    const carousel = document.getElementById("pastorCarousel");

    if (!slidesHost || !prevBtn || !nextBtn || !dotsHost || !carousel) return;
    if (!pastorImages.length) return;

    // 2) Build slides (fade swap)
    const slides = pastorImages.map((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Pastor photo " + (i + 1);
        img.style.position = "absolute";
        img.style.inset = "0";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.opacity = "0";
        img.style.transition = "opacity 450ms ease";
        img.style.userSelect = "none";
        img.draggable = false;
        slidesHost.appendChild(img);
        return img;
    });

    // 3) Build dots
    const dots = pastorImages.map((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to photo " + (i + 1));
        b.style.width = "9px";
        b.style.height = "9px";
        b.style.borderRadius = "999px";
        b.style.border = "0";
        b.style.padding = "0";
        b.style.cursor = "pointer";
        b.style.background = "rgba(255,255,255,0.55)";
        b.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.15)";
        b.addEventListener("click", () => { goTo(i); resetAuto(); });
        dotsHost.appendChild(b);
        return b;
    });

    // 4) Random start
    let idx = Math.floor(Math.random() * slides.length);

    function render() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.opacity = (i === idx) ? "1" : "0";
            dots[i].style.background = (i === idx)
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.55)";
        }
    }

    function goTo(i) {
        idx = (i + slides.length) % slides.length;
        render();
    }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    prevBtn.addEventListener("click", () => { prev(); resetAuto(); });
    nextBtn.addEventListener("click", () => { next(); resetAuto(); });

    // 5) Auto-advance every 1–2 seconds
    let intervalId = null;
    function startAuto() {
        stopAuto();
        const ms = 4000 + Math.floor(Math.random() * 1001); // 1000..2000
        intervalId = setInterval(next, ms);
    }
    function stopAuto() {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
    }
    function resetAuto() {
        startAuto();
    }

    // Optional: pause on hover
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    // Init
    render();
    startAuto();
})();

(function () {
    function initMiniCarousel(root) {
        const list = (root.getAttribute("data-images") || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        if (!list.length) return;

        const slidesHost = root.querySelector(".slides");
        const prevBtn = root.querySelector(".prev");
        const nextBtn = root.querySelector(".next");
        const dotsHost = root.querySelector(".dots");

        if (!slidesHost || !prevBtn || !nextBtn || !dotsHost) return;

        // Build slides
        const slides = list.map((src, i) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = (root.getAttribute("aria-label") || "ministry") + " " + (i + 1);
            img.draggable = false;
            slidesHost.appendChild(img);
            return img;
        });

        // Build dots
        const dots = list.map((_, i) => {
            const b = document.createElement("button");
            b.type = "button";
            b.setAttribute("aria-label", "Go to photo " + (i + 1));
            b.addEventListener("click", () => { goTo(i); resetAuto(); });
            dotsHost.appendChild(b);
            return b;
        });

        let idx = 0;

        function render() {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.opacity = (i === idx) ? "1" : "0";
                dots[i].style.background = (i === idx)
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.55)";
            }
        }

        function goTo(i) {
            idx = (i + slides.length) % slides.length;
            render();
        }
        function next() { goTo(idx + 1); }
        function prev() { goTo(idx - 1); }

        prevBtn.addEventListener("click", () => { prev(); resetAuto(); });
        nextBtn.addEventListener("click", () => { next(); resetAuto(); });

        // Auto advance (optional)
        let intervalId = null;
        function startAuto() {
            stopAuto();
            intervalId = setInterval(next, 4500);
        }
        function stopAuto() {
            if (intervalId) clearInterval(intervalId);
            intervalId = null;
        }
        function resetAuto() { startAuto(); }

        // Pause on hover
        root.addEventListener("mouseenter", stopAuto);
        root.addEventListener("mouseleave", startAuto);

        render();
        startAuto();
    }

    document.querySelectorAll(".ministry-carousel").forEach(initMiniCarousel);
})();

fetch("content/texts.json")
  .then(r => r.json())
  .then(data => {
    document.getElementById("motto").textContent = data.motto;
    document.getElementById("verse").textContent = data.verse;
    document.getElementById("cite").textContent = data.cite;
    document.getElementById("sermon-title").textContent = data.sermon_title;
    document.getElementById("sermon-pastor-name").textContent = data.sermon_pastor_name;
    document.getElementById("sermon-video").src = data.youtube_embed;
  });

