/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uuid: {
      type: "string",
      unique: true,
      required: true,
    },
    email: {
      type: "string",
      unique: true,
      required: true,
    },
    name: {
      type: "string",
      unique: true,
      required: true,
    },
    password: {
      type: "string",
      required: true,
      minLength: 8,
    },

    role: {
      type: "string",
      defaultsTo: "user",
    },
  },
};
