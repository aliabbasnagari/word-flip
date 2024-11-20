var GAME_SIZE = [4, 4];
var ACTIVE_CARDS = [];
var WORD_PAIRS = [];
var PAIRS_FOUND = 0;

var dance_duration = 1000;


function pairExists(pair, pairs_list) {
    return pairs_list.includes(`${pair[0]} ${pair[1]}`) || pairs_list.includes(`${pair[1]} ${pair[0]}`);
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(word, parent) {
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
    card.word = word;

    // Insert card container into the DOM
    parent.appendChild(card);
}


function flipCard(card) {
    if (card.dataset.face == 0 && ACTIVE_CARDS.length < 2) {
        card.classList.toggle("flip");
        card.dataset.face = 1;  // Mark the card as face-up
        ACTIVE_CARDS.push(card);
    } else if (card.dataset.face == 1) {
        card.classList.toggle("flip");
        card.dataset.face = 0;  // Mark the card as face-down
        ACTIVE_CARDS = ACTIVE_CARDS.filter(C => C !== card);
    }


    console.log(ACTIVE_CARDS);

    if (ACTIVE_CARDS.length == 2) {

        if (pairExists([ACTIVE_CARDS[0].word, ACTIVE_CARDS[1].word], WORD_PAIRS)) {
            console.log("FOUNDED");

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
            console.log("NOT FOUNDED");
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
            }, 2000);
        }
    }
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

    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.onclick = () => popup.style.display = 'none';
    window.onclick = (event) => event.target === popup && (popup.style.display = 'none');

    var card_container = document.getElementById("cardContainer");
    card_container.style.gridTemplateColumns = 'repeat(4, 1fr)';

    var message = document.getElementById("wflipMessages");

    function loadGame(game_size) {
        GAME_SIZE = game_size;
        ACTIVE_CARDS = [];
        WORD_PAIRS = [];
        PAIRS_FOUND = 0;

        card_container.replaceChildren();
        card_container.style.gridTemplateColumns = `repeat(${GAME_SIZE[1]}, 1fr)`;

        message.innerHTML = '<h3> Loading... </h3>';
        fetch(`https://mytoronto.thedev.ca/wp-json/words/v1/random-words/?count=${(GAME_SIZE[0] * GAME_SIZE[1]) / 2}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching words: ${response.statusText}`);
                }
                return response.json();
            })
            .then(words_json => {
                try {
                    WORD_PAIRS = words_json.words;
                    console.log(WORD_PAIRS);

                    var words = shuffle(WORD_PAIRS.flatMap(item => item.split(" ")));
                    console.log(words);

                    words.forEach(word => {
                        createCard(word, card_container);
                    });
                    message.innerHTML = '';
                } catch (error) {
                    throw new Error(`Error creating cards: ${error.message}`);
                }
            }).catch(error => {
                console.error(error);
                message.innerHTML = `<h3>Error: ${error.message}</h3>`;
            });
    }

});