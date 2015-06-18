var events = require('events'),
  sys = require('sys'),
  crypto = require('crypto'),

  request = require('request');

var API = function(opts) {
  var self = this;
  this.auth = {
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
  var finaltoken = auth.user + '|' + data + '|' + crypto.createHash('sha1').update(auth.token + data).digest('hex');

  if (type === true) {
    serverOptions.uri = 'https://cln.cloudlinux.com/api/' + options.uri + 'token=' + finaltoken;
  } else {
    serverOptions.uri = 'https://cln.cloudlinux.com/api/' + options.uri;
  }

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

/**
 * listLicenses -
 * Return all IP licenses owned by authorized user.
 * Success response data (json objects list):
    ip(string)
    type(int) ­ license type (1,2,16)
      type 16 KarnelCare
      type 1 CloudLinux
      type 2
    registered(boolean) ­ true if server was registered in CLN with this license (CLN licenses only). created(string) ­ license creation time
 * @param callback
 */
API.prototype.listLicenses = function(callback) {
  var createOptions = {
    uri: 'ipl/list.json?'
  };
  modem(true, this.auth, createOptions, callback);
};

/**
 * checkIP -
 * Check if IP license is registered by any customer.
 * Will return list of registered license types or empty list if provided IP is not registered yet.
 * @param ip - string - IP address to check
 * @param callback
 */
API.prototype.checkIP = function(ip, callback) {
  var createOptions = {
    uri: 'ipl/check.json?ip=' + ip + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

/**
 * registerIP -
 * Will register IP based license for authorized user.
 * On success response returns information about created or already registered license.
 * @param ip - string - IP address to register
 * @param type - string - IP license type (1,2 or 16)
 * @param callback
 */
API.prototype.registerIP = function(ip, type, callback) {
  var createOptions = {
    uri: 'ipl/register.json?ip=' + ip + '&type=' + type + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

/**
 * removeIP -
 * Will remove IP based license from authorized user licenses.
 * Success response data (boolean):
    true when IP license was removed
    false if IP license was not found OR not owned by user
 * @param ip - string - IP address to remove
 * @param type - string - IP license type (1,2 or 16) If empty ­ will remove licenses with all types
 * @param callback
 */
API.prototype.removeIP = function(ip, type, callback) {
  var createOptions = {
    uri: 'ipl/remove.json?ip=' + ip + '&type=' + type + '&'
  };
  modem(true, this.auth, createOptions, callback);
};



/** KarnelCare **/

/**
 * registerServerKC -
 * Will register KC server by KernalCare Key.
 * Success response data (json object):
      server_id(string) ­ 16 characters containing alphanum (small & capital letters), with first character always being a letter
      code(int):
        0 ­ success (server_id is not empty)
        1 ­ account locked
        2 ­ unknown key
        3 ­ key limit reached
 * @param key - string - KernalCare registration key.
 * @param callback
 */
API.prototype.registerServerKC = function(key, callback) {
  var createOptions = {
    uri: 'kcare/register_server.json?key=' + key + '&'
  };
  modem(false, this.auth, createOptions, callback);
};

/**
 * unregisterServerKC -
 * Will remove server registration for KC key.
 * Success response data (boolean):
    true if server was removed.
    false if server/key does not exists or server was not registered with provided key
 * @param serverid - String -­ Server id to unregister
 * @param callback
 */
API.prototype.unregisterServerKC = function(serverid, callback) {
  var createOptions = {
    uri: 'kcare/unregister_server.json?server_id=' + serverid + '&'
  };
  modem(false, this.auth, createOptions, callback);
};

/**
 * keyCreateKC -
 * Will generate new KC key for authorized user.
 * Success response data (string): returns newly generated KC key.
 * @param limit - String -­ key servers limit
 * @param note - String -­ key description up to 100 characters
 * @param callback
 */
API.prototype.keyCreateKC = function(limit, note, callback) {
  var createOptions = {
    uri: 'kcare/key/create.json?limit=' + limit + '&note=' + note + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

/**
 * keyDeleteKC -
 * Will delete KC key owned by authorized user.
 * Success response data (boolean):
    true if key was deleted
    false if key was not found
 * @param key - String -­ KC key to delete
 * @param callback
 */
API.prototype.keyDeleteKC = function(key, callback) {
  var createOptions = {
    uri: 'kcare/key/delete.json?key=' + key + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

/**
 * keyListKC -
 * Return list of all KC keys registered by authorized user.
 * Success response data (json objects list):
 * @param callback
 */
API.prototype.keyListKC = function(callback) {
  var createOptions = {
    uri: 'kcare/key/list.json?'
  };
  modem(true, this.auth, createOptions, callback);
};

/**
 * keyServersKC -
 * Return list of servers registered with key owned by authorized user.
 * Success response data (json objects list):
 * @param key - String -­ KC key linked to servers
 * @param callback
 */
API.prototype.keyServersKC = function(key, callback) {
  var createOptions = {
    uri: 'kcare/key/servers.json?key=' + key + '&'
  };
  modem(true, this.auth, createOptions, callback);
};

module.exports = API;
