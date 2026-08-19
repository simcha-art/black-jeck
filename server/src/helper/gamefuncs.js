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

export { takeCard };
