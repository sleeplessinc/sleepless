/*
Copyright 2015 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/

if((typeof process) === 'undefined') {
	isBrowser = true;
	isNode = false;
	global = window;	// so i can define global functions outside this module
}
else  {
	isNode = true;
	isBrowser = false;
}


// for convenience
global.log = function(m) {
	if(isBrowser && window["console"] === undefined) {
		return;		// console doesn't exist in IE unless in debug mode
	}
	if(typeof m === "object") {
		m = o2j(m);
	}
	return console.log(m);
}

// throw an error if a condition is true
global.throwIf = function(c, s) { if(c) { throw new Error(s || "FAILED ASSERTION"); } }

// a default no-op function for callbacks
global.nop = function(){}

// return json as object or null if error
global.j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }

// return object as JSON or null if error  
global.o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }

// convert an arguments object to real array
// xxx DEPRECATE - suspect firefox doesn't like this
global.args = function(a) { return Array.prototype.slice.call(a); } 


// convert whatever to float
global.toFlt = function(v) { return parseFloat((""+v).replace(/[^-.0-9]/g, "")) || 0.0; }

// convert whatever to integer
global.toInt = function(v) {
	var n = toFlt(v);
	return Math[n < 0 ? 'ceil' : 'floor'](n);
};

// convert from cents to bucks
global.centsToBucks = function(cents) {
	return toFlt( toInt(cents) / 100 );
}
global.c2b = global.centsToBucks;

// convert bucks to cents
global.bucksToCents = function(bucks) {
	//return toInt( toFlt(bucks) * 100 );
	return Math.round( toFlt(bucks) * 100 );
}
global.b2c = global.bucksToCents;

// convert whatever to a string that looks like "1,234.56"
global.toMoney = function(n, decimal, separator) {
    if(separator === undefined)
        separator = ",";
    if(decimal === undefined)
        decimal = ".";
    var n = Math.round( toFlt(n) * 100 ) / 100;
    var sign = n < 0 ? '-' : '';
    n = Math.abs(+n || 0);
    var intPart = parseInt(n.toFixed(2), 10) + '';
    var j = intPart.length > 3 ? intPart.length % 3 : 0;
    return sign +
		(j ? intPart.substr(0, j) + separator : '') +
		intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + separator) +
		(2 ? decimal + Math.abs(n - intPart).toFixed(2).slice(2) : '');
}



// return "now" as unix timestamp
global.time = function() { return toInt(new Date().getTime() / 1000); }


// convert "YYYY-MM-YY HH:MM:SS" to unix timestamp
global.my2ts = function(m) {
	if(m === "0000-00-00 00:00:00") {
		return 0;
	}
	var a = m.split( /[^\d]+/ );
	if(a.length != 6) {
		return 0;
	}
	var year = toInt(a[0]);
	var month = toInt(a[1]);
	var day = toInt(a[2]);
	var hour = toInt(a[3]);
	var minute = toInt(a[4]);
	var second = toInt(a[5]);
	var d = new Date(year, month - 1, day, hour, minute, second, 0);
	return toInt(d.getTime() / 1000);
}

// convert unix timestamp to Date 
global.ts2dt = function(ts) {
	ts = toInt(ts);
	return ts ? new Date(ts * 1000) : null;
}

// convert Date to unix timestamp
global.dt2ts = function(dt) {
	if(! (dt instanceof Date) )
		return 0;
	return toInt(dt.getTime() / 1000);
}

// Convert "MM/DD/YYYY HH:MM:SS" to Date object or null if "s" can't be parsed
// If year is 2 digits, it will try guess what you meant
// Time part (HH:MM:SS) can be omitted and seconds is optional
global.us2dt = function(us) {

	if(!us) {
		return null;
	}

	var m = (""+us).split( /[^\d]+/ );

	if(m.length < 3) {
		return null;
	}
	while(m.length < 7) {
		m.push("0");
	}

	// try to convert 2 digit year to 4 digits (best guess)
	var year = toInt(m[2]);
	var nowyear = new Date().getFullYear();
	if(year <= ((nowyear + 10) - 2000))
		year = 2000 + year;
	if(year < 100)
		year = 1900 + year;

	var mon = toInt(m[0]) - 1;
	var date = toInt(m[1]);

	var hour = toInt(m[3]);
	var min = toInt(m[4]);
	var sec = toInt(m[5]);
	var ms = toInt(m[6]);

	return new Date(year, mon, date, hour, min, sec, ms);
}


// convert "MM/DD/YYYY HH:MM:SS" to unix timestamp
global.us2ts = function(us) {
	return dt2ts(us2dt(us));
}

// convert unix timestamp to "MM/DD/YYYY HH:MM:SS"
global.ts2us = function(ts) {
	var d = ts2dt(ts);
	if(!d) {
		return "";
	}
	return ""+
		("0"+(d.getMonth() + 1)).substr(-2)+
		"/"+
		("0"+d.getDate()).substr(-2)+
		"/"+
		d.getFullYear()+
		" "+ 
		("0"+d.getHours()).substr(-2)+
		":"+
		("0"+d.getMinutes()).substr(-2)+
		":"+
		("0"+d.getSeconds()).substr(-2)+
		"";
}

// convert unix timestamp to "MM/DD"
global.ts2us_md = function(ts) {
	return ts2us(ts).substr(0, 5);
}

// convert unix timestamp to "MM/DD/YYYY"
global.ts2us_mdy = function(ts) {
	return ts2us(ts).substr(0, 10);
}

// convert unix timestamp to "MM/DD/YY"
global.ts2us_mdy2 = function(ts) {
	var a = ts2us_mdy(ts).split("/");
	if(a.length != 3) {
		return a;
	}
	a[2] = a[2].substr(2);
	return a.join("/");
}

// convert unix timestamp to "HH:MM"
global.ts2us_hm = function(ts) {
	return ts2us(ts).substr(11, 5);
}

// convert unix timestamp to "MM/DD/YYYY HH:MM"
global.ts2us_mdyhm = function(ts) {
	return ts2us_mdy(ts) + " " + ts2us_hm(ts);
}

// convert unix timestamp to "MM/DD/YY HH:MM"
global.ts2us_mdy2hm = function(ts) {
	return ts2us_mdy2(ts) + " " + ts2us_hm(ts);
}




// make all lowercase
String.prototype.lcase = function() { return this.toLowerCase() }

// make all uppercase
String.prototype.ucase = function() { return this.toUpperCase() }

// capitalize first word
String.prototype.ucfirst = function() {
	return this.substring(0,1).toUpperCase() + this.substring(1)
}

// capitalize all words
String.prototype.ucwords = function( sep ) {
	sep = sep || /[\s]+/;
	var a = this.split( sep );
	for( var i = 0; i < a.length; i++ ) {
		a[ i ] = a[ i ].ucfirst();
	}
	return a.join( " " );
}

String.prototype.startsWith = function(prefix) {
	return this.substr(0, prefix.length) == prefix;
}

// abbreviate to l chars with ellipses
String.prototype.abbr = function(l) {
	l = toInt(l) || 5;
	if(this.length <= l) {
		return this;
	}
	return this.substr(0, l - 4) + " ...";
}

// convert a string from something like "prof_fees" to "Prof Fees"
String.prototype.toLabel = function() {
	var s = this.replace( /[_]+/g, " " );
	s = s.ucwords();
	return s;
}

// convert a string from something like "Prof. Fees" to  "prof_fees"
String.prototype.toId = function() {
	var s = this.toLowerCase();
	s = s.replace( /[^a-z0-9]+/g, " " );
	s = s.trim();
	s = s.replace( /\s+/g, "_" );
	return s;
}

// test a string to see if it contains all of the arguments
// "I,\nhave a lovely bunch of coconuts".looksLike("i have", "coconuts") == true
String.prototype.looksLike = function() {
    var a = Array.prototype.slice.call(arguments);        // convert arguments to true array
    var s = "_" + this.toLowerCase().toId() + "_"; //.split("_"); //toLowerCase();
    for(var i = 0; i < a.length; i++) {
        var t = "_" + (a[i].toLowerCase().toId()) + "_";
        if(s.indexOf(t) == -1)
            return false;
    }
    return true;
}

global.agoStr = function(ts, no_suffix) {
	if(ts == 0)
		return "";

    var t = time() - ts;
	if(t < 1)
		return "Just now";

	var v = ""
	var round = Math.round
        
    if(t>31536000) v = round(t/31536000,0)+' year'; 
    else if(t>2419200) v = round(t/2419200,0)+' month'; 
    else if(t>604800) v = round(t/604800,0)+' week'; 
    else if(t>86400) v = round(t/86400,0)+' day'; 
    else if(t>3600) v = round(t/3600,0)+' hour'; 
    else if(t>60) v = round(t/60,0)+' minute'; 
    else v = t+' second'; 
        
    if(toInt(v) > 1)
		v += 's'; 

    return v + (no_suffix ? "" : " ago");
}



if(isNode) {

	// XXX make XHR version of this for browser?
	global.getFile = function(path, enc, cb) {
		var fs = require("fs");
		if(!cb) {
			return fs.readFileSync(path, enc);
		}
		fs.readFile(path, enc, cb);
	}

	global.sha1 = function(s) {
		var h = require("crypto").createHash("sha1");
		h.update(s);
		return h.digest("hex");
	}

	global.EE = function(ctr) {
		var EventEmitter = require("events");
		require("util").inherits(ctr, EventEmitter);
		var o = new ctr();
		EventEmitter.call(o);
		return o;
	};


}
else  {
	// isBrowser

	// return element with id
	I = function(id) { return document.getElementById(id); }

	// return value of element with id (generally an input type element)
	// if input is a checkbox, return true/false (checked/unchecked)
	V = function(id) {
		var e = I(id);
		return (e.type === "checkbox") ? (e.checked ? 1 : 0) : e.value.trim();
	}

	// return value of element with id as unix timestamp
	V.ts = function(id) { return us2ts(V(id)); }

	// return value of element with id as integer
	V.int = function(id) { return toInt(V(id)); }

	// return value of element with id as float
	V.flt = function(id) { return toFlt(V(id)); }

	// navigate to new url
	jmp = function(url) { document.location = url; }

	// reload page
	reload = function() { document.location.reload(); }

	// XXX XHR?
	getFile = function(path, enc, cb) { }

}

