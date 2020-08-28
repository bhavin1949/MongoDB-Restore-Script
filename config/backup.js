
const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require('path');
const { spawn } = require('child_process');
const rmdir = require('rimraf');
const us = require('underscore');
const mongoose = require("mongoose");
const dbConfig = require("../config/database.config");
var Db = require('mongodb').Db,
    Server = require('mongodb').Server;
var db = new Db('gemfind', new Server('localhost', 27017));
// Concatenate root directory path with our backup folder.
const backupDirPath = "C:\\disk back up\\MongoDB\\"

const dbOptions = {
    user: 'gemfind',
    pass: 'Express#321',
    host: '34.205.171.23',
    port: 27017,
    database: 'gemfind',
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: backupDirPath
};

// return stringDate as a date object.
exports.stringToDate = dateString => {
    return new Date(dateString);
};

// Check if variable is empty or not.
exports.empty = mixedVar => {
    let undef, key, i, len;
    const emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {

    mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var dbo = client.db;
        //db.collection("company_details").findOne({}, function (err, result) {
        dbo.listCollections().toArray(function (err, collectionNames) {
            if (err) {
                console.log(err);
            }
            else {
                if (collectionNames.length <= 0) {
                    var folderName = getMostRecentFileName("C:\\disk back up\\MongoDB");
                    var finalFolder = "C:\\disk back up\\MongoDB\\" + folderName;

                    var args = [finalFolder]
                    mongodump = spawn('C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongorestore', args);
                    mongodump.stdout.on('data', function (data) {
                        console.log('stdout: ' + data);
                    });
                    mongodump.stderr.on('data', function (data) {
                        console.log('MongoDB restore successfully.');
                    });
                    mongodump.on('exit', function (code) {
                        console.log('mongodump exited with code ' + code);
                    });
                }
            }
        });
        //});
    });
}

function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    return us.max(files, function (f) {
        var fullpath = path.join(dir, f);
        return fs.statSync(fullpath).ctime;
    });
}