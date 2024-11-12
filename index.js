var ELE_TO_WORD = new WeakMap();
var WORD_TO_ELE = new WeakMap();

var word_pairs_json = {
    "words": [
        ["Sun", "Moon"],
        ["Love", "Hate"],
        ["Ocean", "Waves"],
        ["Book", "Knowledge"],
        ["Fire", "Ice"],
        ["Friend", "Foe"],
        ["Day", "Night"],
        ["Heart", "Beat"]
    ]
};

var ACTIVE_CARDS = [];


function pairExists(pair, pairs_list) {
    return pairs_list.some(words =>
        (words[0] === pair[0] && words[1] === pair[1]) ||
        (words[0] === pair[1] && words[1] === pair[0])
    );
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


var word_pairs = word_pairs_json.words;

console.log(word_pairs);
console.log(pairExists(["Beat", "Heart"], word_pairs));

var words = shuffle(word_pairs.flat());
var word_pair = [];


function createCard(word, parent) {
    // Create card element with onclick attribute
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("onclick", "flipCard(this)");

    // Create card front face
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";
    cardFront.textContent = `(${word})`;// "Reveal";

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

    if (ACTIVE_CARDS.length == 2 && pairExists([ACTIVE_CARDS[0].word, ACTIVE_CARDS[1].word], word_pairs)) {
        console.log("FOUNDED");
        var clr = getRandomColor();
        ACTIVE_CARDS[0].cardBack.style.border = "6px solid " + clr;
        ACTIVE_CARDS[1].cardBack.style.border = "6px solid " + clr;
        ACTIVE_CARDS = [];
        // border 
        // backgroundColor 
    }

    console.log(ACTIVE_CARDS);
}


function CheckCardStatus() {

}

// function getRandomColor() {
//     const colorList = [
//         "#FF6347", // Tomato Red
//         "#4682B4", // Steel Blue
//         "#FFD700", // Gold
//         "#8A2BE2", // Blue Violet
//         "#32CD32", // Lime Green
//         "#FF4500", // Orange Red
//         "#2F4F4F", // Dark Slate Gray
//         "#800080", // Purple
//         "#FFFF00", // Yellow
//         "#00BFFF", // Deep Sky Blue
//         "#DC143C", // Crimson
//         "#00FF00", // Lime
//         "#D2691E", // Chocolate
//         "#0000FF", // Blue
//         "#FF1493", // Deep Pink
//         "#C71585", // Medium Violet Red
//         "#32CD32", // Lime Green
//         "#8B0000", // Dark Red
//         "#A52A2A", // Brown
//         "#FFD700"  // Golden Yellow
//     ];

//     return colorList[Math.floor(Math.random() * colorList.length)];
// }

function getRandomColor() {
    // Define the color list only once if not already defined
    if (!getRandomColor.colorList || getRandomColor.colorList.length === 0) {
        getRandomColor.colorList = [
            "#FF6347", // Tomato Red
            "#4682B4", // Steel Blue
            "#FFD700", // Gold
            "#8A2BE2", // Blue Violet
            "#32CD32", // Lime Green
            "#FF4500", // Orange Red
            "#2F4F4F", // Dark Slate Gray
            "#800080", // Purple
            "#FFFF00", // Yellow
            "#00BFFF", // Deep Sky Blue
            "#DC143C", // Crimson
            "#00FF00", // Lime
            "#D2691E", // Chocolate
            "#0000FF", // Blue
            "#FF1493", // Deep Pink
            "#C71585", // Medium Violet Red
            "#8B0000", // Dark Red
            "#A52A2A" // Brown
        ];
    }

    // Select a random color index
    const randomIndex = Math.floor(Math.random() * getRandomColor.colorList.length);

    // Remove and return the selected color
    return getRandomColor.colorList.splice(randomIndex, 1)[0];
}

document.addEventListener('DOMContentLoaded', function () {
    var card_container = document.getElementById("cardContainer");
    words.forEach(word => {
        createCard(word, card_container);
    });



});