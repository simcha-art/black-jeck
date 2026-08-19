import { getCollections } from "../db/mongodb.js";
import { ObjectId, Collection, ReturnDocument } from "mongodb";

const /**@type {{ playersCollection:Collection ,roundsCollection: Collection}}*/{playersCollection, roundsCollection} = getCollections()

export const playerRepo = {
    createPlayer: async (chips) => {
        const result = await playersCollection.insertOne({chips, created_at: new Date().toISOString()})
        return result.insertedId.toString()
    },
    getPlayerById: async (playerId) => {
        const player = await playersCollection.findOne({_id: new ObjectId(playerId)})
        return player
    }, 
    decreasePlayerChips: async (playerId, bet) => {
        return await playersCollection.findOneAndUpdate({_id: playerId}, {$inc: {chips: -bet}}, {returnDocument: "after"})
    },
    increasePlayerChips: async (playerId, amount) => {
        return await playersCollection.findOneAndUpdate({_id: new ObjectId(playerId)}, {$inc: {chips: amount}}, {returnDocument: "after"})
    }
    
}

export const roundsRepo = {
    createRound: async (playerId, bet, playerCards, dealerCards, status) => {
        const result = await roundsCollection.insertOne({
            playerId,
            bet,
            playerCards,
            dealerCards,
            status,
            created_at: new Date().toISOString()
        })
        return result.insertedId
    },
    getOpenRoundByPlayerId: async (playerId) => {
        const round = await roundsCollection.findOne({playerId, status: "in-progress"})
        return round
    },

    updateRound: async (playerId, updatedData) => {
        const updatedRound = await roundsCollection.findOneAndUpdate({playerId, status: "in-progress"}, {$set: updatedData}, {returnDocument: "after"})
        return updatedRound
    }
}


