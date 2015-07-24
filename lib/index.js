var util  = require('util'),
    spawn = require('child_process').spawn,
    _ = require('underscore'),
    parseSarOutput = require('./parser');

// Quick and dirty sar parser
module.exports = function(server, params){
    if(server!='beo')
        params = ['beo','ssh',server,'sar'].concat(params);
    else
       params = [server,'sar'].concat(params);

  var sar = spawn('ssh', params, { cwd: undefined,
    env: _.extend({}, process.env, {LANG: 'C'})
  });

  sar.stdout.on('data', function (data) {
    parseSarOutput(data, function(err, arr){
      arr.forEach(function(o){
        sar.emit('stats', o);
      });
    });
  });

  sar.stderr.on('data', function (data) {
    console.error(data);
  });

  return sar;
};
