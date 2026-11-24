
/* =========================================
   PASSWORD SETTINGS
========================================= */

// Your website password
const SITE_PASSWORD = "123456";


/* =========================================
   PASSWORD SCREEN
========================================= */

let pageWaitingForPassword = "home-page";

const passwordGate = document.getElementById("password-gate");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");
const passwordCard = document.getElementById("password-card");
const togglePasswordButton = document.getElementById("toggle-password");

// Check if the visitor has already entered the password.
let isAuthenticated =
    sessionStorage.getItem("isAuthenticated") === "true";

// Hide password screen if already authenticated.
if (isAuthenticated) {
    passwordGate.classList.add("hidden");
}

passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (passwordInput.value === SITE_PASSWORD) {

        passwordError.textContent = "";

        // Remember successful login.
        sessionStorage.setItem("isAuthenticated", "true");
        isAuthenticated = true;

        const destination = pageWaitingForPassword;

        passwordInput.value = "";
        passwordGate.classList.add("hidden");

        completePageNavigation(destination);

    } else {

        passwordError.textContent =
            "Oops! That's not the correct password. Try again. 💜";

        passwordCard.classList.remove("shake");
        void passwordCard.offsetWidth;
        passwordCard.classList.add("shake");

        passwordInput.select();
    }
});


// Show or hide password.
togglePasswordButton.addEventListener("click", function () {

    const passwordIsHidden = passwordInput.type === "password";

    passwordInput.type = passwordIsHidden ? "text" : "password";

    togglePasswordButton.textContent =
        passwordIsHidden ? "Hide" : "Show";
});


/* =========================================
   PAGE NAVIGATION - PASSWORD ONLY ONCE
========================================= */

function showPage(pageId) {

    // Check that the requested page exists.
    if (!document.getElementById(pageId)) return;

    // Stop videos and close gift popup.
    closeGiftPopup();

    document.querySelectorAll("video").forEach(function (video) {
        video.pause();
    });

    // Already entered password? Navigate directly.
    if (isAuthenticated) {
        completePageNavigation(pageId);
        return;
    }

    // Remember the page to open after login.
    pageWaitingForPassword = pageId;

    passwordError.textContent = "";
    passwordInput.value = "";
    passwordInput.type = "password";
    togglePasswordButton.textContent = "Show";

    passwordGate.classList.remove("hidden");

    passwordInput.focus();
}


// Navigate to selected page.
function completePageNavigation(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) return;

    selectedPage.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   PAGE 1 - WELCOME
========================================= */

function showSurprise() {
    showPage("surprise-page");
}

function goHome() {
    showPage("home-page");
}


/* =========================================
   PAGE 2 - BIRTHDAY MESSAGE
========================================= */

function revealMessage() {

    const message = document.getElementById("hidden-message");
    const button = document.getElementById("message-button");

    message.classList.toggle("show");

    if (message.classList.contains("show")) {
        button.textContent = "Hide Message 💌";
    } else {
        button.textContent = "Read More 💌";
    }

    createConfetti();
}

function showGallery() {
    showPage("gallery-page");
}

function goSurprise() {
    showPage("surprise-page");
}


/* =========================================
   PAGE 3 - BIRTHDAY VIDEO
========================================= */

function openVideoSurprise() {

    const videoBox = document.getElementById("birthday-video-box");
    const video = document.getElementById("birthday-video");

    videoBox.classList.add("show");

    video.currentTime = 0;

    video.play().catch(function () {
        // Visitor can press Play manually.
    });

    createConfetti();

    videoBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function replayVideo() {

    const video = document.getElementById("birthday-video");

    video.currentTime = 0;

    video.play().catch(function () {});
}


function closeBirthdayVideo() {

    const video = document.getElementById("birthday-video");
    const videoBox = document.getElementById("birthday-video-box");

    video.pause();
    video.currentTime = 0;

    videoBox.classList.remove("show");
}


function showMysteryPage() {
    showPage("mystery-page");
}

function goGallery() {
    showPage("gallery-page");
}


/* =========================================
   PAGE 4 - MYSTERY GIFT VIDEOS
========================================= */

const giftData = {

    1: {
        title: "Your First Little Surprise! 💌",
        message: "A little video made especially for you! 💜",
        video: "videos/1.mp4"
    },

    2: {
        title: "Another Special Surprise! 🌙",
        message: "Here is another little surprise for you! ✨",
        video: "videos/gift2.mp4"
    },

    3: {
        title: "Your Last Mystery Surprise! 💜",
        message: "I saved something special just for you! ♡",
        video: "videos/gift3.mp4"
    }
};


let giftOpenTimer = null;


function openMysteryGift(giftNumber) {

    const gift = giftData[giftNumber];

    if (!gift) return;

    const popup = document.getElementById("gift-popup");
    const title = document.getElementById("result-title");
    const message = document.getElementById("result-message");
    const video = document.getElementById("mystery-video");
    const source = document.getElementById("mystery-video-source");
    const popupGift = document.getElementById("popup-gift");

    const buttons = document.querySelectorAll(".gift-button");
    const selectedButton = buttons[giftNumber - 1];

    // Cancel previous animation timer.
    if (giftOpenTimer) {
        clearTimeout(giftOpenTimer);
    }

    // Stop previous video.
    video.pause();
    video.currentTime = 0;

    title.textContent = gift.title;
    message.textContent = gift.message;

    source.src = gift.video;
    popupGift.textContent = "🎁";

    video.load();

    // Animate selected gift.
    if (selectedButton) {

        selectedButton.classList.remove("opening");

        void selectedButton.offsetWidth;

        selectedButton.classList.add("opening");
    }

    // Show popup after animation.
    giftOpenTimer = setTimeout(function () {

        popup.classList.add("show");

        createConfetti();

        video.play().catch(function () {

            message.textContent =
                "Your surprise is ready! Press Play to watch it. 💜";

        });

    }, 650);
}


/* =========================================
   CLOSE GIFT POPUP
========================================= */

function closeGiftPopup() {

    const popup = document.getElementById("gift-popup");
    const video = document.getElementById("mystery-video");

    if (!popup || !video) return;

    if (giftOpenTimer) {

        clearTimeout(giftOpenTimer);

        giftOpenTimer = null;
    }

    video.pause();
    video.currentTime = 0;

    popup.classList.remove("show");
}


// Close popup when clicking outside content.
document.getElementById("gift-popup").addEventListener("click", function (event) {

    if (event.target === this) {
        closeGiftPopup();
    }

});


// Close popup using Escape key.
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeGiftPopup();
    }

});


/* =========================================
   PURPLE CONFETTI
========================================= */

function createConfetti() {

    const symbols = ["💜", "✨", "⭐", "💫", "♡", "✦"];

    for (let i = 0; i < 45; i++) {

        const item = document.createElement("div");

        item.className = "confetti";

        item.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        item.style.left = Math.random() * 100 + "vw";

        item.style.fontSize =
            (14 + Math.random() * 20) + "px";

        item.style.animationDuration =
            (2 + Math.random() * 3) + "s";

        document.body.appendChild(item);

        setTimeout(function () {
            item.remove();
        }, 5500);
    }
}


/* =========================================
   FLOATING PURPLE HEARTS AND STARS
========================================= */

function createFloatingDecoration() {

    const container = document.getElementById("floating-container");

    if (!container) return;

    const decoration = document.createElement("div");

    const symbols = ["💜", "✨", "⭐", "💫", "♡", "✦"];

    decoration.className = "floating-heart";

    decoration.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

    decoration.style.left = Math.random() * 100 + "%";

    decoration.style.fontSize =
        (14 + Math.random() * 23) + "px";

    decoration.style.animationDuration =
        (6 + Math.random() * 5) + "s";

    container.appendChild(decoration);

    setTimeout(function () {
        decoration.remove();
    }, 11000);
}


// Create floating decorations every 700 milliseconds.
setInterval(createFloatingDecoration, 700);
