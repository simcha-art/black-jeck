export async function getRound() {
    const playerId = localStorage.getItem("playerId");
    const headers = { "content-type": "application/json" };
    if (playerId) Object.assign(headers, { "x-player-id": playerId });
    const res = await fetch("http://localhost:3000/my-round", {
        method: "get",
        headers: headers,
    });
    return res;
}

export async function startGame() {
    const res = await fetch("http://localhost:3000/start-game", {
        method: "post",
    });
    if (!res.ok) {
        const errMessage = await res.text();
        console.error(res.status, errMessage);
        return;
    }
    const { playerId } = await res.json();
    localStorage.setItem("playerId", playerId);
    return;
}

export async function startRound(bet) {
    const playerId = localStorage.getItem("playerId");
    const res = fetch("http://localhost:3000/start-round", {
        method: "post",
        headers: {
            "content-type": "application/json",
            "x-player-id": playerId,
        },
        body: JSON.stringify({ bet }),
    });
    return res
}
