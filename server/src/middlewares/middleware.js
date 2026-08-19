import { playerRepo } from "../repos/repository.js"

function logger(req, res, next) {
    console.log(`mehtod: ${req.method} | url: ${req.url}`, "body: ", req.body)
    next()
}

function errorHandler(err, req, res, next) {
    const msgToPrint = err.message || err
    const msgToSend = err.message || 'internal server error'
    const status = err.status || 500
    console.error({status, msgToPrint})
    res.status(status).send(msgToSend)
}

async function checkExistPlayer(req, res, next) {
    const playerId = req.headers['x-player-id']
    if (!playerId) {
        const err = new Error('playerId does not exist, use /start-game first')
        err.status = 401
        throw err
    }
    const {_id, chips} = await playerRepo.getPlayerById(playerId)
    req.player = {id: _id, chips}
    next()
}

export {logger, errorHandler, checkExistPlayer}