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

var word_pairs = word_pairs_json.words;

console.log(word_pairs);
console.log(word_pairs.includes(["Heart", "Beat"]));


function pairExists(pair, pair_list) {
    return pair_list.some(words =>
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



var words = shuffle(word_pairs.flat());
var word_pair = [];


words.forEach(word => {
    createCard(word);
});

// JavaScript code to create and insert the card element
function createCard(word) {
    // Create card element with onclick attribute
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("onclick", "flipCard(this)");

    // Create card front face
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";
    cardFront.textContent = "Reveal";

    // Create card back face
    const cardBack = document.createElement("div");
    cardBack.className = "card-face card-back";
    cardBack.textContent = word;

    // Append faces to card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.word = word;

    // Insert card container into the DOM
    document.getElementById("cardContainer").appendChild(card);
}


function flipCard(card) {
    if (card.classList.toggle("flip")) {
        if (word_pair.length == 2) {
            let pp = [word_pair[1], word_pair[0]];
            if (word_pairs.includes(word_pair) || word_pairs.includes(pp)) {
                console.log("Found");
            }
        } else {
            word_pair.push(card.word);
        }
    } else {
        word_pair = word_pair.filter(word => word !== card.word);
    }
    console.log(card.word);
    console.log(word_pair);
}

document.addEventListener('DOMContentLoaded', function () {


});