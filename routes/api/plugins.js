const router = require('express').Router()

  const { Connection } = require('../../models/database')

  const projection = {
    name: 1 ,
    id: 1,
    version: 1,
    description: 1,
    _id: 0
  }

  // Public dat get routes

  router.get('/', async (req, res) => {
      await Connection.connectToMongo()
      const database = Connection.db;
      const plugins = database.collection('plugins');
      let getAll = await plugins.find({}).project(projection).toArray()
      console.log(getAll);
      res.status(200).json({ plugins: getAll })
  })

  router.get('/:pluginID', async (req, res) => {
    await Connection.connectToMongo()
    const database = Connection.db;
     const plugins = database.collection('plugins');;
    const pluginId = req.params.pluginID
    let plugin = await plugins.findOne({ id : pluginId }, projection)
    if (!plugin || plugin.length == 0) 
      res.sendStatus(404) 
    res.status(200).json({ plugin })
  })
  
  // Publishing

  router.post('/publish', async (req, res) => {
    await Connection.connectToMongo()
    const database = Connection.db;
    const plugins = database.collection('plugins');
    const users = database.collection('users');
    let plugin = req.body;
    let API_KEY = req.get('Authorization');
    let user = await users.findOne({API_KEY})
    if (!user || user.length == 0) res.sendStatus(401)
    let upsert = await plugins.replaceOne(
      { id: plugin.id },
      plugin,
      { upsert: true});
    upsert = upsert.ops
    res.status(200).json({ upsert })
  });

module.exports = router
