document.addEventListener("DOMContentLoaded", function () {
    const video = document.querySelector(".video-background");

    // Function to play video again when it ends
    function replayVideo() {
        video.currentTime = 0; // Reset video to start
        video.play();
    }

    // Event listener for video ended
    video.addEventListener("ended", replayVideo);

    const inputContainer = document.getElementById('input-container');
    const coundownForm = document.getElementById('countdownForm');
    const dateEl = document.getElementById('date-picker');

    const countdownEl = document.getElementById('countdown')
    const countdownElTitle = document.getElementById('countdown-title');
    const countdownBtn = document.getElementById('countdown-button');
    const timeElements = document.querySelectorAll('span');

    const completeEl = document.getElementById('complete');
    const completeElInfo = document.getElementById('complete-info');
    const completeBtn = document.getElementById('complete-button');

    let countdownTitle = '';
    let countdownDate = '';
    let countdownValue = new Date();
    let countdownActive;
    let savedCountdown;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = (hour * 24);

    // Set Date Input Min with Today's Date
    const today = new Date().toISOString().split('T')[0];
    dateEl.setAttribute('min', today);

    // Populate Countdown / Complete UI
    const updateDOM = () => {
        countdownActive = setInterval(() => {
            const nowUTC = new Date().getTime();
            const nowIST = nowUTC + (5.5 * 60 * 60 * 1000);
            const distance = countdownValue - nowIST;

            const days = Math.floor(distance / day);
            const hours = Math.floor((distance % day) / hour);
            const minutes = Math.floor((distance % hour) / minute);
            const seconds = Math.floor((distance % minute) / second);

            inputContainer.hidden = true;

            if (distance < 0) {
                countdownEl.hidden = true;
                clearInterval(countdownActive);
                completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
                completeEl.hidden = false;
            } else {
                countdownElTitle.textContent = `${countdownTitle}`;
                timeElements[0].textContent = ` ${days.toString().padStart(2, '0')}`;
                timeElements[1].textContent = `${hours.toString().padStart(2, '0')}`;
                timeElements[2].textContent = `${minutes.toString().padStart(2, '0')}`;
                timeElements[3].textContent = `${seconds.toString().padStart(2, '0')}`;

                for (let i = 0; i < timeElements.length - 1; i++) {
                    timeElements[i].textContent += ' :';
                }

                completeEl.hidden = true;
                countdownEl.hidden = false;
            }
        }, second);
    };

    const updateCountDown = e => {
        e.preventDefault();
        countdownTitle = e.srcElement[0].value;
        countdownDate = e.srcElement[1].value;
        savedCountdown = {
            title: countdownTitle,
            date: countdownDate,
        };
        localStorage.setItem('countdown', JSON.stringify(savedCountdown));

        if (countdownDate === '') {
            alert('Please select a date for the countdown.');
        } else {
            countdownValue = new Date(countdownDate).getTime();
            updateDOM();
        }
    };

    function reset() {
        countdownEl.hidden = true;
        completeEl.hidden = true;
        inputContainer.hidden = false;
        clearInterval(countdownActive);
        countdownTitle = '';
        countdownDate = '';
        localStorage.removeItem('countdown');
    }

    function restorePreviousCountdown() {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = 'Reboot 2024';
        countdownDate = '2024-03-29';
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }

    coundownForm.addEventListener('submit', updateCountDown);
    countdownBtn.addEventListener('click', reset);

    restorePreviousCountdown();
});
