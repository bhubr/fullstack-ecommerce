'use strict';

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
  db.createTable(
    'user',
    {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      fullName: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      email: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      passwordHash: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      createdAt: 'string',
      updatedAt: 'string',
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('user', callback);
};

exports._meta = {
  version: 1,
};
