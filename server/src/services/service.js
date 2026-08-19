import { playerRepo, roundsRepo } from "../repos/repository.js";
import { takeCard } from "../helper/gamefuncs.js";

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

        const updatedPlayer = await playerRepo.decreasePlayerChips(player.id, bet);
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
};
