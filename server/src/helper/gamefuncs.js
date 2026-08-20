function takeCard() {
    const ranks = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];
    const suits = ["hearts", "diamonds", "clubs", "spades"];

    const randomIndexRanks = Math.floor(Math.random() * ranks.length);
    const randomIndexSuits = Math.floor(Math.random() * suits.length);

    const randomCard = {
        rank: ranks[randomIndexRanks],
        suit: suits[randomIndexSuits],
    };
    return randomCard;
}

function calculateHand(handCards) {
    const cards = handCards.map((card) => card.rank);
    const val = {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        J: 10,
        Q: 10,
        K: 10,
        A: 11,
        a: 1,
    };
    let total = cards.reduce((acc, cur) => acc + val[cur], 0);
    let i = 0;
    while (total > 21 && cards.includes("A")) {
        const index = cards.findIndex((card) => card === "A");
        cards[index] = "a";
        total = cards.reduce((acc, cur) => acc + val[cur], 0);
        i++;
    }
    return total;
}

function isBust(number) {
    return (number > 21)
}


function dealerTakeCards(handCards) {
    let total = calculateHand(handCards)
    while (total < 17) {
        handCards.push(takeCard())
        total = calculateHand(handCards)
    }
    return [handCards, total]
}

function checkWinnig(playerTotal, dealerTotal) {
    if (playerTotal > dealerTotal) return "player"
    else if (playerTotal === dealerTotal) return "push"
    else return "dealer"
}

export { takeCard, calculateHand, isBust, dealerTakeCards, checkWinnig };


