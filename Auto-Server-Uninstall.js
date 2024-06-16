var Service = require('node-windows').Service;

var svc = new Service({
  name:'testing service',
  description: 'The nodejs.org example web server.',
  script: 'E:\\Desktop\\Full stack demo\\server\\server.js'
});

svc.on('uninstall',function(){
	console.log('Uninstall Complete');
});

svc.uninstall();
