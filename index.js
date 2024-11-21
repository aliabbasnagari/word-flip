var GAME = {
    state: {
        GAME_SIZE: [4, 4],
        ACTIVE_CARDS: [],
        WORD_PAIRS: [],
        PAIRS_FOUND: 0,
        SCORE: 0,
        CLICKS: 0,
        TOTAL_TIME_ELAPSED: 0,
        TIME_CHECKPOINT: 0,
    },
    elements: {
        cardContainer: null,
        messageSpan: null,
        flywordSpan: null,
        popup: {
            main: null,
            closeBtn: null,
        },
    },
    values: {
        API_URL: "https://mytoronto.thedev.ca/wp-json/words/v1/random-words/?count=8",
        DANCE_DURATION: 1000,
    },
    init() {
        this.elements.cardContainer = document.getElementById("cardContainer");
        this.elements.messageSpan = document.getElementById("wfMessage");
        this.elements.flywordSpan = document.getElementById("wfFlyword");
        this.elements.popup.main = document.getElementById('wfPopup');
        this.elements.popup.closeBtn = this.elements.popup.main.querySelector('.wf-close-btn');

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
            TOTAL_TIME_ELAPSED: 0,
            TIME_CHECKPOINT: 0,
        }
        this.elements.cardContainer.replaceChildren();
        this.elements.cardContainer.style.gridTemplateColumns = `repeat(${game_size[1]}, 1fr)`;
    },
    loadWords() {
        this.elements.messageSpan.innerHTML = '<h3> Loading... </h3>';
        fetch(this.values.API_URL).then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching words: ${response.statusText}`);
            }
            return response.json();
        }).then(words_json => {
            const fragment = document.createDocumentFragment();
            this.state.WORD_PAIRS = words_json.words;
            this.elements.messageSpan.innerHTML = `score <h2>0</h2>`;
            this.state.WORD_PAIRS.flatMap(item => item.split(" ")).forEach(word => {
                fragment.appendChild(createCard(word));
            });
            this.elements.cardContainer.appendChild(fragment);
            this.elements.messageSpan.innerHTML = `score <h2>0</h2>`;
        }).catch(error => {
            console.error(error);
            this.elements.messageSpan.innerHTML = `<h3>Error: ${error.message}</h3>`;
        });
    },
    checkStatus() {
        if (this.state.ACTIVE_CARDS.length == 2) {
            let pair = pairExists([this.state.ACTIVE_CARDS[0].dataset.word, this.state.ACTIVE_CARDS[1].dataset.word], this.state.WORD_PAIRS);
            if (pair != null) {
                console.log("FOUNDED");
                TIME_ELAPSED = (new Date() - TIME_ELAPSED) / 1000;
                let points = parseInt((20) * (2 / CLICKS) * (15 / TIME_ELAPSED));
                animateCounter(messageSpan, SCORE, SCORE + points, 1000);
                SCORE += points;
                console.log(`Score: ${SCORE.toFixed(2)} C: ${CLICKS} T: ${TIME_ELAPSED} P: ${points.toFixed(2)}`);
                CLICKS = 0;
                TIME_ELAPSED = new Date();

                flywordSpan.textContent = `${pair}`;
                flywordSpan.classList.add('fly');
                setTimeout(() => flywordSpan.classList.remove('fly'), 2000);


                PAIRS_FOUND++;
                if (PAIRS_FOUND == WORD_PAIRS.length) {
                    let concatenated_words = WORD_PAIRS.map(word => word).join(" <br> ");
                    let title = popup.querySelector('h2');
                    let message = popup.querySelector('p');
                    title.innerHTML = "&#127881 Nice Going!";
                    message.innerHTML = `Congrats! You solved the puzzle. <br><br> <b>${concatenated_words}</b> `;
                    popup.style.display = 'block';

                    console.log('WON');
                }

                ACTIVE_CARDS[0].cardBack.style.opacity = 0.3;
                ACTIVE_CARDS[1].cardBack.style.opacity = 0.3;

                ACTIVE_CARDS[0].dataset.face = 2;
                ACTIVE_CARDS[1].dataset.face = 2;

                ACTIVE_CARDS[0].classList.add("dance");
                ACTIVE_CARDS[1].classList.add("dance");
                setTimeout(() => ACTIVE_CARDS = [], dance_duration);

            } else {
                setTimeout(() => {
                    if (ACTIVE_CARDS[0]) {
                        ACTIVE_CARDS[0].classList.toggle("flip");
                        ACTIVE_CARDS[0].dataset.face = 0;
                    }
                    if (ACTIVE_CARDS[1]) {
                        ACTIVE_CARDS[1].classList.toggle("flip");
                        ACTIVE_CARDS[1].dataset.face = 0;
                    }
                    ACTIVE_CARDS = [];
                }, 3000);
            }
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
    if (card.dataset.face == 0 && GAME.state.ACTIVE_CARDS.length < 2) {
        card.classList.toggle("flip");
        card.dataset.face = 1;  // Mark the card as face-up
        GAME.state.ACTIVE_CARDS.push(card);
        GAME.state.CLICKS++;
    } else if (card.dataset.face == 1) {
        card.classList.toggle("flip");
        card.dataset.face = 0;  // Mark the card as face-down
        GAME.state.ACTIVE_CARDS = GAME.state.ACTIVE_CARDS.filter(C => C !== card);
    }
    GAME.checkStatus();
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

document.addEventListener('DOMContentLoaded', () => {
    var btn_44 = document.getElementById("btn44");
    var btn_45 = document.getElementById("btn45");
    var btn_54 = document.getElementById("btn54");
    var btn_56 = document.getElementById("btn56");
    var btn_65 = document.getElementById("btn65");
    var btn_66 = document.getElementById("btn66");

    btn_44.addEventListener('click', () => loadGame([4, 4]));
    btn_45.addEventListener('click', () => loadGame([4, 5]));
    btn_54.addEventListener('click', () => loadGame([5, 4]));
    btn_56.addEventListener('click', () => loadGame([5, 6]));
    btn_65.addEventListener('click', () => loadGame([6, 5]));
    btn_66.addEventListener('click', () => loadGame([6, 6]));

    GAME.init();

    function loadGame(game_size) {
        GAME.reset(game_size);
        GAME.loadWords();
    }
});