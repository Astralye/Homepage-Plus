// Boot server as a windows service.
var Service = require('node-windows').Service;

// Maybe make this relative later
const path = require('path');

var svc = new Service({
  name:'testing service',
  description: 'The nodejs.org example web server.',
  script: 'E:\\Desktop\\Homepage-Plus\\Homepage-Plus\\server'
});

svc.on('install',function(){
  svc.start();
});

svc.install();