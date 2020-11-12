const MongoClient = require('mongodb').MongoClient;
const password = process.env.DATABASE_PASSWORD;
const uri = `mongodb+srv://crawford:${password}@plugins.xpvqw.mongodb.net/graviton?retryWrites=true&w=majority`;

class Connection {
    static async connectToMongo() {
        if (this.db) return this.db
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = await client.connect()
        this.db = db.db('graviton')
        return this.db
    }
}

Connection.db = null

module.exports = {Connection}

