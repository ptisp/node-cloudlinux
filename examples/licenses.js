var CLINUX = require('../lib/cloudlinux');

var config = {
  user: process.env.CLINUX_USER,
  token: process.env.CLINUX_TOKEN
};

var clexample = new CLINUX(config);

clexample.listLicenses( function(err, data){
  if (err) {
    console.log('ERROR');
    console.log(err);
  } else {
    console.log(data);
  }
});
clexample.keyListKC( function(err, data){
  if (err) {
    console.log('ERROR');
    console.log(err);
  } else {
    console.log(data);
  }
});
