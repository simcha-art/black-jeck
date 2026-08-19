import { service } from "../services/service.js";

async function createPlayer(req, res, next) {
    try {
        const playerId = await service.createNewPlayer();
        res.json({ playerId });
    } catch (error) {
        next(error);
    }
}

async function getOpenRound(req, res, next) {
    try {
        const round = await service.getOpenRound(req.player.id);
        res.json(round);
    } catch (error) {
        next(error);
    }
}

async function OpenNewRound(req, res, next) {
    try {
        const player = req.player;
        const bet = req.body.bet;
        if (!bet || typeof bet !== "number") {
            const err = new Error("you must enter bet of type number to start a round")
            err.status = 400;
            throw err
        }
        const newRound = await service.OpenNewRound(player, bet)
        res.json(newRound)
    } catch (error) {
        next(error)
    }
}

export { createPlayer, getOpenRound, OpenNewRound };
