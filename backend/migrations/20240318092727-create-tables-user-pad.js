'use strict';
const async = require('async');

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series(
    [
      (cb) =>
        db.createTable(
          'user',
          {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            email: 'string',
            passwordHash: 'string',
            createdAt: 'string',
            updatedAt: 'string',
          },
          cb,
        ),
      (cb) =>
        db.createTable(
          'pad',
          {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            userId: 'int',
            title: 'string',
            content: 'string',
            createdAt: 'string',
            updatedAt: 'string',
          },
          cb,
        ),
    ],
    (err, results) => {
      console.log(err, results);
      callback(err, results);
    },
  );
};

exports.down = function (db, callback) {
  async.series(
    [
      (cb) => db.dropTable('user', cb),
      (cb) => db.dropTable('pad', cb),
    ],
    (err, results) => {
      console.log(err, results);
      callback(err, results);
    },
  );
};

exports._meta = {
  version: 1,
};
