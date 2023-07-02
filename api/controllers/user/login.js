const bcrypt = require("bcrypt");

module.exports = {
  friendlyName: "Login",
  description: "Login user.",
  inputs: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  exits: {
    success: {
      statusCode: 200,
      description: "If all credentials are correct",
    },
    badCombo: {
      statusCode: 401,
      description: "If wrong credentials",
    },
  },
  fn: async function (inputs, exits) {
    const userRecord = await User.findOne({ email: inputs.email }).populate('wallet');
    if (!userRecord) {
      return exits.badCombo({
        error: "Invalid credentials",
      });
    }
    let passwordCheck = bcrypt.compare(inputs.password, userRecord.password);
    if (!passwordCheck) {
      return exits.badCombo({ error: "Password mismatch" });
    }
    const signPayload = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
    };
    const token = jwToken.sign({ user: signPayload, issuer: "The Sailors" });

    const refreshToExpire = Date.now() + (2 * 24 * 60 * 60 * 1000); // Calculate the refresh token expiration time

    let userTokenRecord = await TokenStore.findOne({ email: inputs.email });

    if (userTokenRecord) {
      await TokenStore.updateOne({ email: inputs.email }).set({
        token: token.access,
        refreshToken: token.refresh,
        toExpire: refreshToExpire
      });
    } else {
      await TokenStore.create({
        id: await sails.helpers.uuidGenerator(),
        token: token.access,
        refreshToken: token.refresh,
        email: userRecord.email,
        toExpire: refreshToExpire, // Set the refresh token expiration time
      });
    }

    return exits.success({
      message: userTokenRecord
        ? `${userRecord.email} already has an active token and refresh token, and will be overwritten`
        : `${userRecord.email} has logged in`,
      access: token.access,
      refresh: token.refresh,
      userRecord,
    });
  },
};
