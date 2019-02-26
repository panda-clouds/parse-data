const PCShell = require('shelljs');

class PCBash  {
	constructor() {
		//Empty Constructor
	}
	static putStringInFile(file,path){
		// stringify anything that isn't already a string
		if(typeof file !== "string") file = JSON.stringify(file);
		const fullCommand = "cat <<'EOFSSHFILE' > " + path + "\n" + file + "\nEOFSSHFILE\n";
		return PCBash.runCommandPromise(fullCommand);
	}

	static runCommandPromise(command){

		return new Promise(function (resolve, reject) {
			PCShell.exec(command, {shell: '/bin/bash',async:true},function(code, stdout, stderr) {
				stdout = stdout.replace(/^\s+|\s+$/g, '');

				if(code !== 0){
					reject(stderr);
				}else{
					resolve(stdout);
				}

			});
		});
	}

}


module.exports = PCBash;
