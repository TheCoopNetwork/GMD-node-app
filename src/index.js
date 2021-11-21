if (require('electron-squirrel-startup')) return process.exit(0); //do not restart multiple times during installer
const log = require('electron-log');

const SingleInstance = require('single-instance');
const locker = new SingleInstance('gmd-node');
locker.lock().then(() => {
    main();
}).catch(err => {
    console.log('app already running');
});



main = async ()=> {	
    const osAbstraction = require('./os-abstract').osAbstraction;
	osAbstraction.initFile(__dirname);
	osAbstraction.startBackend();
	launchUIWhenBackendIsUp(osAbstraction);
}

launchUIWhenBackendIsUp = (osAbstraction)=> {
	const my_url = 'http://localhost:6876';
	const request = require('request');
	let retry = (function() {
		let count = 0;
		return function(max, timeout, next) {
			request(my_url+'/index.html', function (error, response, body) {
				if (error || response.statusCode !== 200) {
					log.info(''+my_url + ' not yet accessible. waiting to initialize +error='+error+' status.code='+response);				
					if (count++ < max) {
						return setTimeout(function() {
						retry(max, timeout, next);
						}, timeout);
				} else {
					return next(new Error('max retries reached'));
				}
			}
			log.debug('get http request to '+my_url+' success');
			next(null, body);
		});
		}
	})();

	retry(90, 1000, ()=>{
		require('./electron-app').mainElectron(my_url, osAbstraction);
	});
}
