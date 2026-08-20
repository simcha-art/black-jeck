import { getRound, startGame, startRound, hit, stand } from "./api.js";

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

// const res = await startRound(500)
// const round = await res.json()
// console.log(round)

// const res = await hit();
// if (res.ok) {
//     console.log(await res.json());
// } else {
//     console.log(await res.text());
// }

const response = await startRound(50)
if (response.ok) {
    const newRound = await response.json()
    console.log(newRound)
} else {
    const err = await response.text()
    console.log(err)
}


const res = await stand()
if (res.ok) {
    console.log(await res.json())
} else {
    console.log(await res.text())
}