var events = require('events'),
  sys = require('sys'),
  crypto = require('crypto'),
  shasum = crypto.createHash('sha1');
  request = require('request');

var API = function(opts) {
  var self = this;
  var auth = {
    user: opts.user,
    token: opts.token
  };
};

var modem = function(type, auth, options, callback) {
  var serverOptions = {
    method: 'GET',
    headers: {}
  };

  var data = parseInt(new Date().getTime() / 1000);
  shasum.update(auth.token + data);
  var finaltoken = auth.user + '|' + data + '|' + shasum.digest('hex');

  if (type === true) {
    serverOptions.uri = 'https://cln.cloudlinux.com/api/' + options.uri + 'token=' + finaltoken;
  } else {
    serverOptions.uri = 'https://cln.cloudlinux.com/api/' + options.uri;
  }

  console.log(serverOptions);

  serverOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  request(serverOptions, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    var data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return callback(new Error('JSON failed to parse: ' + e + ' -> "' + body + '"'));
    }
    return callback(undefined, data);

  });
};

// type 16 KarnelCare
// type 1 CloudLinux
// type 2
API.prototype.listLicenses = function(callback) {
  var createOptions = {
    uri: 'ipl/list.json?'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.checkIP = function(ip, callback) {
  var createOptions = {
    uri: 'ipl/check.json?ip=' + ip + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.registerIP = function(ip, type, callback) {
  var createOptions = {
    uri: 'ipl/register.json?ip=' + ip + '&type=' + type + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.removeIP = function(ip, type, callback) {
  var createOptions = {
    uri: 'ipl/remove.json?ip=' + ip + '&type=' + type + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.registerServerKC = function(key, callback) {
  var createOptions = {
    uri: 'kcare/register_server.json?key=' + key + '&'
  };
  modem(false, this.auth, createOptions, callback);
};

API.prototype.unregisterServerKC = function(serverid, callback) {
  var createOptions = {
    uri: 'kcare/unregister_server.json?server_id=' + serverid + '&'
  };
  modem(false, this.auth, createOptions, callback);
};

API.prototype.keyCreateKC = function(limit, note, callback) {
  var createOptions = {
    uri: 'kcare/key/create.json?limit=' + limit + '&note=' + note + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.keyDeleteKC = function(key, callback) {
  var createOptions = {
    uri: 'kcare/key/delete.json?key=' + key + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.keyListKC = function(callback) {
  var createOptions = {
    uri: 'kcare/key/list.json?'
  };
  modem(true, this.auth, createOptions, callback);
};

API.prototype.keyServersKC = function(key, callback) {
  var createOptions = {
    uri: 'kcare/key/servers.json?key=' + key + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

module.exports = API;
