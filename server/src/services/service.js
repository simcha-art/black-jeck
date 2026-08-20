import { playerRepo, roundsRepo } from "../repos/repository.js";
import {
    calculateHand,
    checkWinnig,
    dealerTakeCards,
    isBust,
    takeCard,
} from "../helper/gamefuncs.js";

export const service = {
    createNewPlayer: () => {
        return playerRepo.createPlayer(1000);
    },
    getOpenRound: (playerId) => {
        return roundsRepo.getOpenRoundByPlayerId(playerId);
    },
    OpenNewRound: async (player, bet) => {
        let err;
        const existRound = await service.getOpenRound(player.id);
        if (existRound) {
            err = new Error("there is already open round");
            err.status = 409;
            throw err;
        }
        if (bet <= 0) {
            err = new Error("bet must be larger then 0");
            err.status = 400;
            throw err;
        } else if (bet > player.chips) {
            err = new Error("bet must be less then chips");
            err.status = 400;
            throw err;
        }

        const updatedPlayer = await playerRepo.decreasePlayerChips(
            player.id,
            bet,
        );
        const playerId = player.id;
        const dealerCards = [takeCard(), takeCard()];
        const playerCards = [takeCard(), takeCard()];
        const status = "in-progress";
        const chips = updatedPlayer.chips;
        const roundId = await roundsRepo.createRound(
            playerId,
            bet,
            playerCards,
            dealerCards,
            status,
        );
        return { roundId, playerCards, dealerUpCard: dealerCards[0], chips };
    },
    winningRound: async (playerId, winningMsg) => {
        const WINNING_MSG_ALLOWED = [
            "player_bust",
            "dealer_bust",
            "player_win",
            "dealer_win",
            "push",
        ];
        if (!WINNING_MSG_ALLOWED.includes(winningMsg)) {
            const err = new Error("invalid winningMsg");
            err.status = 500;
            throw err;
        }
        const winnedRound = await roundsRepo.updateRound(playerId, {
            status: winningMsg,
        });
        return winnedRound;
    },
    hit: async (player) => {
        `
        1. player add card
        2. calcualte sum
        3. check if burned
        4. if burned => change to player_bust
        `;
        const round = await service.getOpenRound(player.id);
        if (!round) {
            const err = new Error("there isn't open round for this player");
            err.status = 404;
            throw err;
        }

        round.playerCards.push(takeCard());
        const updatedRound = roundsRepo.updateRound(player.id, {
            playerCards: round.playerCards,
        });
        const handSum = calculateHand(round.playerCards);
        if (isBust(handSum)) {
            const endedRound = await service.winningRound(
                player.id,
                "player_bust",
            );
            return {
                playerCards: endedRound.playerCards,
                playerTotal: handSum,
                status: endedRound.status,
                chips: player.chips,
            };
        } else {
            return {
                playerCards: round.playerCards,
                playerTotal: handSum,
                status: round.status,
                chips: player.chips,
            };
        }
    },
    stand: async (player) => {
        console.log("start stand operation")
        const round = await service.getOpenRound(player.id);
        console.log("originRound: ", round);
        if (!round) {
            const err = new Error("there isn't open round for this player");
            err.status = 404;
            throw err;
        }
        console.log("buildiing dealer cards")
        const [ dealerCards, dealerTotal ] = dealerTakeCards(round.dealerCards);
        console.log("dealerCards", dealerCards, "dealerTotal: ", dealerTotal)
        const playerCards = round.playerCards;
        const playerTotal = calculateHand(playerCards);
        console.log("player cards: ", playerCards)
        console.log("player total: ", playerTotal)
        let status;
        if (isBust(dealerTotal)) {
            console.log("dealer_bust")
            status = "dealer_bust";
        } else {
            const winner = checkWinnig(playerTotal, dealerTotal);
            console.log("check winning")
            if (winner === "dealer") status = "dealer_win";
            else if (winner === "player") status = "player_win";
            else status = "push";
        }
        console.log("status: ", status)
        console.log("updating round with dealer cards")
        const updatedRound = await roundsRepo.updateRound(player.id, {dealerCards});
        console.log("updating round status for winning")
        const winnedRound = await service.winningRound(player.id, status);

        let updatedPlayer;
        let payout;
        if (status === "push"){
            console.log("updating chips = 1")
            payout = round.bet
            updatedPlayer = await playerRepo.increasePlayerChips(player.id, round.bet);
        }
        else if (["dealer_bust", "player_win"].includes(status)) {
            console.log("updating chips = 2")
            payout = round.bet * 2
            updatedPlayer = await playerRepo.increasePlayerChips(player.id, payout);
        }
        else updatedPlayer = player;

        const chips = updatedPlayer.chips;
        console.log("total chips: ", chips)

        return {
            playerCards,
            dealerCards,
            playerTotal,
            dealerTotal,
            status,
            chips,
        };
    },
};
