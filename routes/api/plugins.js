const router = require('express').Router()
const { authenticate } = require('passport');

  const { Connection } = require('../../models/database')

  const projection = {
    name: 1 ,
    id: 1,
    version: 1,
    description: 1,
    _id: 0
  }

  // Public dat get routes

  // Get all plugins

  router.get('/', async (req, res) => {
      await Connection.connectToMongo()
      const database = Connection.db;
      const plugins = database.collection('plugins');
      let getAll = await plugins.find({}).project(projection).toArray()
      console.log(getAll);
      res.status(200).json({ plugins: getAll })
  })

  // Get plugin by id

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

  // Insert or update plugin

  router.post('/publish', authenticate('headerapikey', { session: false, failureRedirect: '/api/unauthorized' }),
  async (req, res) => {
    await Connection.connectToMongo()
    const database = Connection.db;
    const plugins = database.collection('plugins');
    let plugin = req.body;
    let upsert = await plugins.replaceOne(
      { id: plugin.id },
      plugin,
      { upsert: true});
    upsert = upsert.ops
    res.status(200).json({ upsert })
  });

module.exports = router
