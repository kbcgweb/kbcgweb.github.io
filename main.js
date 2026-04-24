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

/* ── YouTube audio player helpers ── */
function extractYouTubeId(embedUrl) {
    var match = embedUrl.match(/\/embed\/([^?/]+)/);
    return match ? match[1] : null;
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    seconds = Math.floor(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    if (h > 0) return h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    return m + ":" + (s < 10 ? "0" : "") + s;
}

var ytAudioPlayer = null;
var ytVideoId = null;
var ytProgressTimer = null;

fetch("content/texts.json")
  .then(function(r) { return r.json(); })
  .then(function(data) {
    document.getElementById("motto").textContent = data.motto;
    document.getElementById("verse").textContent = data.verse;
    document.getElementById("cite").textContent = data.cite;
    document.getElementById("sermon-title").textContent = data.sermon_title;
    document.getElementById("sermon-pastor-name").textContent = data.sermon_pastor_name;
    document.getElementById("sermon-video").src = data.youtube_embed;

    ytVideoId = extractYouTubeId(data.youtube_embed);
    if (ytVideoId) {
      document.getElementById("sermon-audio-wrap").style.display = "";
      if (window.YT && window.YT.Player) initYtAudioPlayer();
    }
  });

function onYouTubeIframeAPIReady() {
    if (ytVideoId) initYtAudioPlayer();
}

function initYtAudioPlayer() {
    if (ytAudioPlayer) return;
    ytAudioPlayer = new YT.Player("yt-audio-hidden", {
        height: "1",
        width: "1",
        videoId: ytVideoId,
        playerVars: {
            autoplay: 0, controls: 0, disablekb: 1,
            fs: 0, modestbranding: 1, playsinline: 1, rel: 0
        },
        events: {
            onReady: onAudioPlayerReady,
            onStateChange: onAudioStateChange
        }
    });
}

function onAudioPlayerReady() {
    var checkDuration = setInterval(function() {
        var dur = ytAudioPlayer.getDuration();
        if (dur > 0) {
            document.getElementById("yt-audio-duration").textContent = formatTime(dur);
            clearInterval(checkDuration);
        }
    }, 500);

    document.getElementById("yt-audio-play").addEventListener("click", function() {
        var state = ytAudioPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            ytAudioPlayer.pauseVideo();
        } else {
            ytAudioPlayer.playVideo();
        }
    });

    document.getElementById("yt-audio-track").addEventListener("click", function(e) {
        var rect = this.getBoundingClientRect();
        var fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        var duration = ytAudioPlayer.getDuration();
        if (duration > 0) ytAudioPlayer.seekTo(fraction * duration, true);
    });
}

function onAudioStateChange(event) {
    var playerEl = document.getElementById("yt-audio-player");
    var iconPlay = document.getElementById("icon-play");
    var iconPause = document.getElementById("icon-pause");

    switch (event.data) {
        case YT.PlayerState.PLAYING:
            iconPlay.style.display = "none";
            iconPause.style.display = "";
            playerEl.classList.remove("buffering");
            startProgressTimer();
            break;
        case YT.PlayerState.PAUSED:
            iconPlay.style.display = "";
            iconPause.style.display = "none";
            playerEl.classList.remove("buffering");
            stopProgressTimer();
            break;
        case YT.PlayerState.BUFFERING:
            playerEl.classList.add("buffering");
            break;
        case YT.PlayerState.ENDED:
            iconPlay.style.display = "";
            iconPause.style.display = "none";
            playerEl.classList.remove("buffering");
            stopProgressTimer();
            document.getElementById("yt-audio-progress").style.width = "0%";
            document.getElementById("yt-audio-current").textContent = "0:00";
            break;
        default:
            playerEl.classList.remove("buffering");
    }
}

function startProgressTimer() {
    stopProgressTimer();
    ytProgressTimer = setInterval(function() {
        if (!ytAudioPlayer) return;
        var current = ytAudioPlayer.getCurrentTime();
        var duration = ytAudioPlayer.getDuration();
        if (duration > 0) {
            document.getElementById("yt-audio-progress").style.width = (current / duration * 100) + "%";
            document.getElementById("yt-audio-current").textContent = formatTime(current);
            document.getElementById("yt-audio-duration").textContent = formatTime(duration);
        }
    }, 250);
}

function stopProgressTimer() {
    if (ytProgressTimer) { clearInterval(ytProgressTimer); ytProgressTimer = null; }
}

