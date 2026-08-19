import { getRound , startGame , startRound} from "./api.js";

// const res = await getRound()
// if (!res.ok) {
//     console.log(await res.text())
// }

// const round = await res.json()
// if (!round) {
//     console.log("there is no round for this player, use start-round first")
// } else {
//     console.log(round)
// }


const res = await startRound(500)
const round = await res.json()
console.log(round)