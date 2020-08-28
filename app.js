const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;
const Cron = require('./config/backup');

// create express app
const app = express();
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");

  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });
app.listen(2000, () => {
  console.log("Server is listening on port 2000");
});

//Check db and restore every 10 minutes
new CronJob(
  '0 */10 * * * *',
  function () {
    console.log('Backup started!');
    Cron.dbAutoBackUp();
  },
  null,
  true,
  'UTC'
);

// const chokidar = require('chokidar');

// // Initialize watcher.
// const watcher = chokidar.watch('C:\\Bhavin\\Error.csv', {
//   ignored: /(^|[\/\\])\../, // ignore dotfiles
//   persistent: true
// });

// // Add event listeners.
// watcher.on('unlink', (path, stats) => {
//   console.log('Backup started!');
//   Cron.dbAutoBackUp();
//   // console.log(stats);
//   // if (stats)
//   //   console.log(`File ${path} changed size to ${stats.size}`);
// });