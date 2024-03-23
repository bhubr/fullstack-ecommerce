'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  return db.createTable('product', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      length: 100,
      notNull: true,
    },
    slug: {
      type: 'string',
      length: 100,
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    pictureUrl: {
      type: 'text',
      notNull: true,
    },
    price: {
      type: 'int',
      notNull: true,
    },
    createdAt: {
      type: 'datetime',
      notNull: true,
    },
    updatedAt: {
      type: 'datetime',
      notNull: true,
    },
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('product', callback);
};

exports._meta = {
  "version": 1
};
