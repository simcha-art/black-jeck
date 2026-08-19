import {MongoClient} from "mongodb";
import env from "dotenv"
env.config({path: "./server/.env"})

const URI = process.env.LONG_MONGODB_URI

const client = new MongoClient(URI)
let db;
let playersCollection;
let roundsCollection;

async function connectToMongo() {
    try {
        console.log("start connectiong to mongodb")
        await client.connect()
        console.log("connected to mongodb")
        console.log("start creating db")
        createDB()
        console.log("db created, start creating collections")
        createCollections()
    } catch (error) {
        console.error(error.message)
    }
}

function createDB() {
    db = client.db("blackjack")
}

function createCollections() {
    playersCollection = db.collection("playersCollection")
    roundsCollection = db.collection("roundsCollection")
}


export function getCollections() {
    if (!db) {
        createDB()
    }
    if (!playersCollection || !roundsCollection){
        createCollections()
    }
    return {playersCollection, roundsCollection}
}


await connectToMongo()
