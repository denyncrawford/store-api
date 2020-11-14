  const router = require('express').Router()
  const passport = require('passport');
  const { getLastVersion, getRelase } = require('../../models/plugins.js')

  const { Connection } = require('../../models/database')

  const projections = {
    all: {
      name: 1 ,
      id: 1,
      version: 1,
      description: 1,
      _id: 0
    },
    detailed: {
      owner_id: 0,
      _id: 0
    }
  }

  // Messages 

  const errorMessages = {
    403: { 
      code: 403,
      message:"You are not the owner of this plugin, please modify the payload data.",
      status: "forbidden"
    },
    404: {
      code: 404,
      message: "Sorry, we cant't find this plugin.",
      status: "not found"
    }
  }

  // Connector

  const connect = async () => {
    await Connection.connectToMongo()
    const database = Connection.db;
    return  plugins = database.collection('plugins');
  }

  // Getting Data

  // Get all plugins

  router.get('/', async (req, res) => {
    const plugins = await connect();
      let getAll = await plugins.find({}).project(projections.all).toArray()
      res.status(200).json({ plugins: getAll })
  })

  // Get plugin by ID

  router.get('/:pluginID', async (req, res) => {
    const plugins = await connect();
    const pluginId = req.params.pluginID
    let plugin = await plugins.findOne({ id : pluginId }, {projection: projections.detailed})
    if (!plugin || plugin.length == 0) 
      res.sendStatus(404) 
    res.status(200).json({ plugin })
  })
  
  // Publishing

  // Insert or update plugin

  router.post('/publish', passport.authenticate('headerapikey', { session: false, failureRedirect: '/auth/unauthorized' }),
  async (req, res) => {
    const plugins = await connect();
    const user = req.user;
    let payload = req.body;
    payload.owner_id = user._id;
    payload.version = getLastVersion(payload.releases);
    let plugin_check = await plugins.findOne({id: payload.id});
    if (Boolean(plugin_check) && plugin_check?.owner_id?.toString() == user._id?.toString()) {
      let plugin = await plugins.replaceOne(
        { id: payload.id },
        payload);
      plugin = plugin.ops
      res.status(200).json({ plugin })
    } else if (Boolean(plugin_check) && plugin_check?.owner_id?.toString() != user._id?.toString()) {
      res.status(403).json(errorMessages[403]);
    } else if (Boolean(plugin_check) == false) {
      await plugins.insertOne(payload);
      res.status(200).json({ plugin: payload })
    }
  });

  // Deleting

  router.delete('/:pluginID', passport.authenticate('headerapikey', { session: false, failureRedirect: '/auth/unauthorized' }),
  async (req, res, done) => {
    const plugins = await connect();
    const pluginId = req.params.pluginID;
    const user = req.user;
    let plugin = await plugins.findOneAndDelete({$and:[{id:pluginId},{owner_id: user._id}]});
    plugin = plugin.value;
    let error = errorMessages[404];
    error.message += " Make sure that you are the owner of this plugin."
    if (!Boolean(plugin)) { res.status(404).json(error); return done(); }
    res.status(200).json({plugin})
  })

  // Downlading

  router.get('/:pluginID/download', async (req, res) => {
    const pluginId = req.params.pluginID;
    const plugins = await connect();
    let plugin = await plugins.findOne({ id : pluginId });
    let last_release_url = getRelase(plugin.releases, plugin.version).url
    res.status(200).redirect(last_release_url)
  })

  router.get('/:pluginID/download/:release', async (req, res, done) => {
    const pluginId = req.params.pluginID;
    const release = req.params.release;
    const plugins = await connect();
    let plugin = await plugins.findOne({ id : pluginId });
    let get_release_url = getRelase(plugin.releases, release).url
    if (!get_release_url) {res.status(404).json(errorMessages[404]); return done()}
    res.status(200).redirect(get_release_url)
  })

module.exports = router
