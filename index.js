var GAME = {
    state: {
        GAME_SIZE: [4, 4],
        ACTIVE_CARDS: [],
        WORD_PAIRS: [],
        PAIRS_FOUND: 0,
        SCORE: 0,
        CLICKS: 0,
        CLICK_CHECKPOINT: 0,
        TIME_CHECKPOINT: 0,
        IS_LOADING: false,
        IS_PLAYING: false,
    },
    elements: {
        cardContainer: null,
        messageSpan: null,
        flywordSpan: null,
        clicksDisplay: null,
        popup: {
            main: null,
            closeBtn: null,
        },
    },
    values: {
        API_URL: "https://mytoronto.thedev.ca/wp-json/words/v1/random-words/?count=8",
        ANIM_DURATION: 1900,
    },
    timer: {
        stopwatchInterval: null,
        stopwatchDisplay: null,
        elapsedTime: 0,
        startStopwatch() {
            if (this.stopwatchInterval) return;
            this.stopwatchInterval = setInterval(() => {
                this.elapsedTime++;
                this.updateStopwatchDisplay();
            }, 1000);
        },
        stopStopwatch() {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;
        },
        resetStopwatch() {
            this.stopStopwatch();
            this.elapsedTime = 0;
            this.updateStopwatchDisplay();
        },
        updateStopwatchDisplay() {
            if (this.elapsedTime >= 0) {
                const hours = Math.floor(this.elapsedTime / 3600);
                const minutes = Math.floor((this.elapsedTime % 3600) / 60);
                const seconds = this.elapsedTime % 60;
                if (this.stopwatchDisplay)
                    this.stopwatchDisplay.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else if (this.stopwatchDisplay) {
                this.stopwatchDisplay.textContent = '00:00:00';
            }
        }
    },
    init() {
        this.elements.cardContainer = document.getElementById("cardContainer");
        this.elements.messageSpan = document.getElementById("wfMessage");
        this.elements.flywordSpan = document.getElementById("wfFlywordContainer");
        this.elements.clicksDisplay = document.getElementById('wfClicks');
        this.elements.popup.main = document.getElementById('wfPopup');
        this.elements.popup.closeBtn = this.elements.popup.main.querySelector('.wf-close-btn');
        this.timer.stopwatchDisplay = document.getElementById('wfTimer');

        this.elements.cardContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        this.elements.popup.closeBtn.onclick = () => this.elements.popup.main.style.display = 'none';
        window.onclick = (event) => event.target === this.elements.popup.main && (this.elements.popup.main.style.display = 'none');
    },
    reset(game_size = [4, 4]) {
        this.state = {
            GAME_SIZE: game_size,
            ACTIVE_CARDS: [],
            WORD_PAIRS: [],
            PAIRS_FOUND: 0,
            SCORE: 0,
            CLICKS: 0,
            CLICK_CHECKPOINT: 0,
            TIME_CHECKPOINT: 0,
            IS_LOADING: false,
            IS_PLAYING: false,
        }
        this.elements.cardContainer.replaceChildren();
        this.elements.cardContainer.style.gridTemplateColumns = `repeat(${game_size[1]}, 1fr)`;
        this.timer.resetStopwatch();
    },
    loadWords() {
        this.state.IS_LOADING = true;
        this.elements.messageSpan.innerHTML = '<h3> Loading... </h3>';
        fetch(this.values.API_URL).then(response => {
            if (!response.ok) throw new Error(`Error fetching words: ${response.statusText}`);
            return response.json();
        }).then(words_json => {
            const fragment = document.createDocumentFragment();

            //this.state.WORD_PAIRS = words_json.words;
            this.state.WORD_PAIRS = [
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW",
                "MMMMMMM WWWWWWW"
            ]

            console.log(this.state.WORD_PAIRS);

            // const words = shuffle(this.state.WORD_PAIRS.flatMap(item => item.split(" ")));
            const words = this.state.WORD_PAIRS.flatMap(item => item.split(" "));
            console.log(words);
            words.forEach(word => {
                fragment.appendChild(createCard(word));
            });
            this.elements.cardContainer.appendChild(fragment);
            //this.elements.messageSpan.innerHTML = `score <h2>0</h2>`;
            this.elements.messageSpan.innerHTML = ``;
            this.elements.clicksDisplay.textContent = `Clicks: ${this.state.CLICKS}`;

            const fly = document.createElement('span');
            fly.classList.add('wf-flyword');
            fly.innerHTML = "Match The Two Word Phrases!";
            this.elements.flywordSpan.appendChild(fly);

            setTimeout(() => {
                this.elements.flywordSpan.removeChild(fly);
                GAME.timer.startStopwatch();
                this.state.IS_PLAYING = true;
            }, this.values.ANIM_DURATION);
        }).catch(error => {
            console.error(error);
            this.elements.messageSpan.innerHTML = `<h3>Error: ${error.message}</h3>`;
        }).finally(() => {
            this.state.IS_LOADING = false
        });
    },
    calculatePoints(currClicks, currTime) {
        // Constants for scoring
        const BASE_POINTS = 20;        // Base score multiplier
        const MIN_TIME = 1;            // Minimum time to avoid division by zero
        const MIN_CLICKS = 2;          // Minimum clicks to avoid division by zero

        // Ensure valid inputs
        currClicks = Math.max(currClicks, MIN_CLICKS); // Avoid division by zero or invalid clicks
        currTime = Math.max(currTime, MIN_TIME);       // Avoid division by zero or invalid time

        // Calculate points
        const efficiencyFactor = Math.round(2 / currClicks); // Higher score for fewer clicks
        const speedFactor = Math.ceil(15 / currTime);        // Higher score for faster matches
        const points = BASE_POINTS * efficiencyFactor * speedFactor;

        // Ensure points are non-negative
        return Math.max(0, points);
    },
    checkStatus() {
        if (this.state.IS_PLAYING) {
            this.elements.clicksDisplay.textContent = `Clicks: ${this.state.CLICKS}`;
            if (this.state.ACTIVE_CARDS.length == 2) {
                const pair = pairExists([this.state.ACTIVE_CARDS[0].dataset.word, this.state.ACTIVE_CARDS[1].dataset.word], this.state.WORD_PAIRS);
                if (pair != null) {
                    console.log("FOUNDED");
                    this.state.PAIRS_FOUND++;
                    const currTime = this.timer.elapsedTime - this.state.TIME_CHECKPOINT;
                    const currClicks = this.state.CLICKS - this.state.CLICK_CHECKPOINT;
                    this.state.TIME_CHECKPOINT = this.timer.elapsedTime;
                    this.state.CLICK_CHECKPOINT = this.state.CLICKS;
                    //const points = parseInt((20) * Math.round((2 / currClicks)) * Math.ceil((15 / currTime)));
                    const points = this.calculatePoints(currClicks, currTime);
                    this.state.SCORE += points;

                    //animateCounter(this.elements.messageSpan, this.state.SCORE - points, this.state.SCORE, 1000);
                    console.log("Score: ", this.state.SCORE);

                    console.log({
                        Points: points,
                        Score: this.state.SCORE,
                        Clicks: this.state.CLICKS,
                        TimeCheckpoint: this.state.TIME_CHECKPOINT,
                        ClickCheckpoint: this.state.CLICK_CHECKPOINT,
                        currTime: currTime,
                        currClicks: currClicks
                    });


                    this.state.ACTIVE_CARDS[0].cardBack.style.opacity = 0.3;
                    this.state.ACTIVE_CARDS[1].cardBack.style.opacity = 0.3;

                    const clr = getRandomColor();
                    this.state.ACTIVE_CARDS[0].cardBack.style.backgroundColor = clr;
                    this.state.ACTIVE_CARDS[1].cardBack.style.backgroundColor = clr;

                    this.state.ACTIVE_CARDS[0].dataset.face = 2;
                    this.state.ACTIVE_CARDS[1].dataset.face = 2;

                    this.state.ACTIVE_CARDS[0].classList.add("dance");
                    this.state.ACTIVE_CARDS[1].classList.add("dance");

                    const fly = document.createElement('span');
                    fly.classList.add('wf-flyword');
                    fly.innerHTML = pair;
                    this.elements.flywordSpan.appendChild(fly);

                    setTimeout(() => {
                        this.elements.flywordSpan.removeChild(fly);
                        this.state.ACTIVE_CARDS = [];
                        this.checkWin();
                    }, this.values.ANIM_DURATION);
                } else {
                    setTimeout(() => {
                        if (this.state.ACTIVE_CARDS[0]) {
                            this.state.ACTIVE_CARDS[0].classList.toggle("flip");
                            this.state.ACTIVE_CARDS[0].dataset.face = 0;
                        }
                        if (this.state.ACTIVE_CARDS[1]) {
                            this.state.ACTIVE_CARDS[1].classList.toggle("flip");
                            this.state.ACTIVE_CARDS[1].dataset.face = 0;
                        }
                        this.state.ACTIVE_CARDS = [];
                    }, this.values.ANIM_DURATION);
                }
            }
        }
    },
    checkWin() {
        if (this.state.IS_PLAYING && this.state.PAIRS_FOUND == this.state.WORD_PAIRS.length) {
            const concatenated_words = this.state.WORD_PAIRS.map(word => word).join(" <br> ");
            const title = this.elements.popup.main.querySelector('h2');
            const message = this.elements.popup.main.querySelector('p');
            title.innerHTML = "&#127881 Nice Going!";
            message.innerHTML = `Congrats! You found all matches. <br><br> <b>${concatenated_words}</b> `;
            this.elements.popup.main.style.display = 'block';
            this.timer.stopStopwatch();

            console.log('WON');
            this.state.IS_PLAYING = false;
        }
    }
};


function pairExists(pair, pairs_list) {
    const forward = `${pair[0]} ${pair[1]}`;
    const backward = `${pair[1]} ${pair[0]}`;
    if (pairs_list.includes(forward))
        return forward;
    else if (pairs_list.includes(backward))
        return backward;
    return null;
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(word) {
    // Create card element
    const card = document.createElement("div");
    card.className = "card";
    card.addEventListener('click', () => flipCard(card));

    // Create card front face
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";
    //cardFront.textContent = `(${word})`;// "Reveal";

    // Create card back face
    const cardBack = document.createElement("div");
    cardBack.className = "card-face card-back";
    cardBack.textContent = word;

    // Append faces to card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.cardBack = cardBack;
    card.dataset.face = 0;
    card.dataset.word = word;

    return card;
}


function flipCard(card) {
    if (GAME.state.IS_PLAYING && card.dataset.face == 0 && GAME.state.ACTIVE_CARDS.length < 2) {
        card.classList.toggle("flip");
        card.dataset.face = 1;  // Mark the card as face-up
        GAME.state.ACTIVE_CARDS.push(card);
        GAME.state.CLICKS++;
        GAME.checkStatus();
    } else if (card.dataset.face == 1) {
        //card.classList.toggle("flip");
        //card.dataset.face = 0;  // Mark the card as face-down
        //GAME.state.ACTIVE_CARDS = GAME.state.ACTIVE_CARDS.filter(C => C !== card);
    }
}

function animateCounter(counter, start, end, duration) {
    const range = end - start;
    let current = start;
    const increment = range / (duration / 10);

    function updateCounter() {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        counter.innerHTML = `score <h2>${Math.round(current)}</h2>`;
        // Add animation effect
        counter.style.transform = "scale(1.2)";
        setTimeout(() => {
            counter.style.transform = "scale(1)";
        }, 100);
    }

    const timer = setInterval(updateCounter, 10);
}

function getRandomColor() {
    // Define the color list only once if not already defined
    if (!getRandomColor.colorList || getRandomColor.colorList.length === 0) {
        getRandomColor.colorList = [
            "#FF6347", // Tomato Red
            "#4682B4", // Steel Blue
            "#FFD700", // Gold
            "#AA2BE2", // Blue Violet
            "#2F4A4F", // Dark Slate Gray
            "#500FFF", // Purple
            "#00BFFF", // Deep Sky Blue
            "#DC143C", // Crimson
            "#99FF00", // Lime
            "#D2691E", // Chocolate
            "#FF1493", // Deep Pink
            "#8B0000", // Dark Red
            "#52280b", // Brown
            '#89A8B2',
        ];
    }
    const randomIndex = Math.floor(Math.random() * getRandomColor.colorList.length);
    return getRandomColor.colorList.splice(randomIndex, 1)[0];
}

let debounceTimeout;
function debounce(func, wait) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, wait);
}

document.addEventListener('DOMContentLoaded', () => {
    var btnStart = document.getElementById("btnStart");
    btnStart.addEventListener('click', () => !GAME.state.IS_LOADING && loadGame([4, 4]));

    GAME.init();

    function loadGame(game_size) {
        GAME.reset(game_size);
        GAME.loadWords();
        GAME.elements.cardContainer.scrollIntoView({ behavior: 'smooth' });
    }
});