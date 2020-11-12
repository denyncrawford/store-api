const MongoClient = require('mongodb').MongoClient;
const password = process.env.DATABASE_PASSWORD;
const uri = `mongodb+srv://crawford:${password}@cluster0.ptsmt.mongodb.net/graviton?retryWrites=true&w=majority`;

class Connection {
    static async connectToMongo() {
        if (this.db) return this.db
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        let connection = await client.connect()
        this.db = connection.db('graviton');
        return this.db
    }
    static async getClient() {
       let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        return client;
    }
}

Connection.db = null

module.exports = { Connection }

