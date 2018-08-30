"use strict";
/*
 * Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */
console.log("Loading user schema");
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// create a schema
var userSchema = new mongoose.Schema({
    email_address: {	// Email address / login for the user
    type: String,
    unique: true,
    required: true
  	},
    first_name: {	// First name of the user.
    type: String,
    required: true
  	},
    wins: {type: Number, default: 0}, // Number of user wins
    losses: {type: Number, default: 0}, // Number of user losses
  	hash: String,	// The password of the user
  	salt: String,
    date_time: {type: Date, default: Date.now} // The date and time when the user was added to the database
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
};

// Create a model for the userSchema
var User = mongoose.model('User', userSchema);

// Make the userSchema available to users in the application
module.exports = User;
