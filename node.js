
import fs from "fs";
import crypto from "crypto";
import https from "https";


// Read a file from disk
// Reads async if callback cb is provided,
// otherwise reads and returns contents synchronously.
function get_file( path, enc, cb ) {
	if(!cb) {
		return fs.readFileSync(path, enc);
	}
	fs.readFile(path, enc, cb);
}


export {
	get_file,
};


