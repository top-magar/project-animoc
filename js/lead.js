document.addEventListener("DOMContentLoaded", async () => {
    // Countdown Timer Elements
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minsElement = document.getElementById("mins");
    const secsElement = document.getElementById("secs");

    let serverTimeOffset = 0; // Offset to sync local and server time
    let timer; // Declare the timer globally

    // Function to fetch accurate time from the server
    async function fetchServerTime() {
        try {
            const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
            const data = await response.json();
            const serverTime = new Date(data.utc_datetime).getTime();
            const localTime = new Date().getTime();
            serverTimeOffset = serverTime - localTime; // Calculate time difference
        } catch (error) {
            console.error("Failed to fetch server time, falling back to local time.");
            serverTimeOffset = 0; // Default to no offset if fetch fails
        }
    }

    // Function to update countdown
    function updateCountdown() {
        const now = new Date().getTime() + serverTimeOffset; // Adjust time
        const dropTime = new Date("2025-03-01T18:00:00Z").getTime();
        const timeLeft = dropTime - now;

        if (timeLeft <= 0) {
            clearInterval(timer);
            daysElement.textContent = "0";
            hoursElement.textContent = "0";
            minsElement.textContent = "0";
            secsElement.textContent = "0";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

        daysElement.textContent = days;
        hoursElement.textContent = hours;
        minsElement.textContent = mins;
        secsElement.textContent = secs;
    }

    // Initialize Countdown with Server Time Sync
    async function initializeCountdown() {
        await fetchServerTime(); // Get server time offset first
        updateCountdown(); // Initial update
        timer = setInterval(updateCountdown, 1000);
    }

    initializeCountdown();

    // Modal Elements
    const passwordModal = document.querySelector(".password-modal");
    const openModalBtn = document.getElementById("openPasswordModal");
    const closeModalBtn = document.querySelector(".modal__close-button");
    const modalOverlay = document.querySelector(".modal-overlay");
    const passwordInput = document.getElementById("input");
    const submitBtn = document.getElementById("submit");

    // Define the correct password
    const validPassword = "animoc123";  // Change to your actual password
    const redirectURL = "index.html";  // Replace with the path of your first uploaded site

    // Check authentication status
    if (window.location.pathname.includes("index.html")) {
        if (localStorage.getItem("isAuthenticated") !== "true") {
            window.location.href = "lead.html"; // Redirect back to password page
        }
    }

    // Open Modal with GSAP animation
    gsap.set(passwordModal, { y: "-100%", opacity: 0, visibility: "hidden" });

    function openModal() {
        passwordModal.style.visibility = "visible";
        gsap.to(passwordModal, { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" });
    }

    function closeModal() {
        gsap.to(passwordModal, { y: "-100%", opacity: 0, duration: 0.5, ease: "power3.in", onComplete: () => {
            passwordModal.style.visibility = "hidden";
        }});
    }

    // Check password and authenticate
    function checkPassword(event) {
        event.preventDefault();
        if (passwordInput.value === validPassword) {
            localStorage.setItem("isAuthenticated", "true"); // Store authentication flag
            window.location.href = "index.html"; // Redirect to the first uploaded site
        } else {
            alert("Incorrect password! Please try again.");
        }
    }

    // Logout Functionality
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("isAuthenticated");
            window.location.href = "lead.html"; // Redirect to login page
        });
    }

    // Event Listeners
    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);
    submitBtn.addEventListener("click", checkPassword);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});
