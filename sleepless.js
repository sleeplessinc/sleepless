/*
Copyright 2020 Sleepless Software Inc. All rights reserved.

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
(function() {

	let M = {};

	let isBrowser = typeof global === "undefined";
	let isNode = ! isBrowser;

	// for convenience
	M.log = function(m) {
		if(isBrowser && window["console"] === undefined) {
			return;		// console doesn't exist in IE unless in debug mode
		}
		if(typeof m === "object") {
			m = o2j(m);
		}
		return console.log(m);
	}

	// throw an error if a condition is true
	M.throwIf = function(c, s) { if(c) { throw new Error(s || "FAILED ASSERTION"); } }

	// convert and return json as object or null if error
	M.j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }

	// convert and return object as JSON or null if exception
	M.o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }

	// convert an arguments object to real array
	// XXX DEPRECATE - or investigate ... suspect Firefox doesn't like this
	M.args = function(a) { return Array.prototype.slice.call(a); } 

	// XXX Deprecate ... not really that useful
	//M.eachVal = function(o, cb) { for(var k in o) { cb(o[k], k); } };

	// convert whatever to float or 0 if not at all numberlike
	// E.g. "123.9" --> 123.9, null --> 0.0, undefined --> 0.0, NaN --> 0.0, 123.9 --> 123.9
	M.toFlt = function(v) { return parseFloat((""+v).replace(/[^-.0-9]/g, "")) || 0.0; }

	// convert whatever to integer or 0 if not at all numberlike
	// E.g. "123" --> 123, null --> 0, undefined --> 0, NaN --> 0, 123 --> 123, -123.9 --> -124
	M.toInt = function(v) {
		var n = toFlt(v);
		return Math[n < 0 ? 'ceil' : 'floor'](n);
	};

	// convert from pennies to dollars
	// E.g.  123456 --> 1234.56
	M.centsToBucks = function(cents) {
		return toFlt( toInt(cents) / 100 );
	}
	M.c2b = M.centsToBucks;

	// convert dollars to pennies
	// E.g.  1234.56 --> 123456
	M.bucksToCents = function(bucks) {
		// return Math.round( toFlt(bucks) * 100 ); --> can't use this; It breaks on #'s like 0.285 - )-:
		return Math.round( (toFlt(bucks) * 1000) / 10 );
	}
	M.b2c = M.bucksToCents;

	// format a number into a string with any # of decimal places,
	// and optional alternative decimal & thousand-separation chars
	// numFmt( 1234.56 )	// "1,235"
	// numFmt( 1234.56, 1 )	// "1,234.6"
	// numFmt( 1234.56, 1, "," )	// "1,234,6"
	// numFmt( 1234.56, 1, "_" )	// "1,234_6"
	// numFmt( 1234.56, 1, ",", "." )	// "1.234,6"
	// numFmt( 1234.56, 1, ".", "" )	// "1234.6"
	M.numFmt = function(n, plcs, dot, sep) {
		n = toFlt(n);
		sep = typeof sep === "string" ? sep : ",";			// thousands separator char
		dot = typeof dot === "string" ? dot : ".";			// decimal point char
		plcs = toInt(plcs);
		var p = Math.pow(10, plcs);
		var n = Math.round( n * p ) / p;
		var sign = n < 0 ? '-' : '';
		n = Math.abs(+n || 0);
		var intPart = parseInt(n.toFixed(plcs), 10) + '';
		var j = intPart.length > 3 ? intPart.length % 3 : 0;
		return sign +
			(j ? intPart.substr(0, j) + sep : '') +
			intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + sep) +
			(plcs ? dot + Math.abs(n - intPart).toFixed(plcs).slice(-plcs) : '');
	}

	// convert something like 0.12 to a string that looks like "12" with
	// optional alternate decimal and thousands-seperator chars
	// NOTE: there is no "%" added, you have to do that yourself if you want it.
	// toPct( 0.4 ) + "%"		// "40%"
	// toPct( 123.4,",", "." )	// "12,340"
	M.toPct = function(n, plcs, dot, sep) {
		return numFmt(n * 100, plcs, dot, sep);
	}

	// Convert whatever to a string that looks like "1,234.56"
	// E.g. toMoney( 1234.56 )				// "1,234.56"
	// E.g. toMoney( 1234.56, 1, ".", "" )	// "1.234,56"
	M.toMoney = function(n, dot, sep) {
		return numFmt(n, 2, dot, sep);
	}

	// Returns a human readable string that describes 'n' as a number of bytes,
	// e.g., "1 KB", "21.5 MB", etc.
	M.byteSize = function(sz) {
		if(typeof sz != "number")
			return sz;
		if(sz < 1024)
			return numFmt(sz, 0) + " B"
		sz = sz / 1024
		if(sz < 1024)
			return numFmt(sz, 1) + " KB"
		sz = sz / 1024
		if(sz < 1024)
			return numFmt(sz, 1) + " MB"
		sz = sz / 1024
		if(sz < 1024)
			return numFmt(sz, 1) + " GB"
		sz = sz / 1024
		return numFmt(sz, 1) + " TB"
	}

	// Return a Unix timestamp for current time, or for a Date object if provided
	M.time = function( dt ) {
		if( ! dt ) dt = new Date();
		return toInt( dt.getTime() / 1000 );
	}

	// convert "YYYY-MM-YY" or "YYYY-MM-YY HH:MM:SS" to Unix timestamp
	M.my2ts = function(m) {
		if( m.length == 10 && /\d\d\d\d-\d\d-\d\d/.test(m) ) {
			m += " 00:00:00";
		}
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

	// convert Unix timestamp to "YYYY-MM-DD HH:MM:SS"
	M.ts2my = function(ts) {
		var d = ts2dt(ts);
		if(!d) {
			return "";
		}
		return ""+
			d.getFullYear()+
			"-"+
			("0"+(d.getMonth() + 1)).substr(-2)+
			"-"+
			("0"+d.getDate()).substr(-2)+
			" "+ 
			("0"+d.getHours()).substr(-2)+
			":"+
			("0"+d.getMinutes()).substr(-2)+
			":"+
			("0"+d.getSeconds()).substr(-2)+
			"";
	}

	// Convert Unix timestamp to Date object
	// Returns null if ts is falsey
	// NOTE: One might expect ts2dt() to return a Date object for "now", but it actually returns null.
	M.ts2dt = function(ts) {
		ts = toInt(ts);
		return ts ? new Date(ts * 1000) : null;
	};

	// Convert Date object to Unix timestamp
	M.dt2ts = function(dt) {
		if(! (dt instanceof Date) )
			return 0;
		return toInt(dt.getTime() / 1000);
	};

	// Convert "MM/DD/YYYY HH:MM:SS" to Date object or null if string can't be parsed
	// If year is 2 digits, it will try guess the century (not recommended).
	// Time part (HH:MM:SS) can be omitted and seconds is optional
	// if utc argument is truthy, then return a UTC version
	M.us2dt = function(us, utc) {

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

		if(utc) {
			return new Date(Date.UTC(year, mon, date, hour, min, sec, ms));
		}

		return new Date(year, mon, date, hour, min, sec, ms);
	}

	// Convert "MM/DD/YYYY HH:MM:SS" to Unix timestamp.
	// If utc argument is truthy, then return a UTC version.
	M.us2ts = function(us, utc) {
		return dt2ts(us2dt(us, utc));
	}

	// Convert Unix timestamp to "MM/DD/YYYY HH:MM:SS".
	M.ts2us = function(ts) {
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

	// Convert Unix timestamp to "MM/DD".
	M.ts2us_md = function(ts) {
		return ts2us(ts).substr(0, 5);
	}

	// Convert Unix timestamp to "MM/DD/YYYY".
	M.ts2us_mdy = function(ts) {
		return ts2us(ts).substr(0, 10);
	}

	// Convert Unix timestamp to "MM/DD/YY"
	M.ts2us_mdy2 = function(ts) {
		var a = ts2us_mdy(ts).split("/");
		if(a.length != 3) {
			return a;
		}
		a[2] = a[2].substr(2);
		return a.join("/");
	}

	// Convert Unix timestamp to "HH:MM"
	M.ts2us_hm = function(ts) {
		return ts2us(ts).substr(11, 5);
	}

	// Convert Unix timestamp to "MM/DD/YYYY HH:MM"
	M.ts2us_mdyhm = function(ts) {
		return ts2us_mdy(ts) + " " + ts2us_hm(ts);
	}

	// Convert Unix timestamp to "MM/DD/YY HH:MM"
	M.ts2us_mdy2hm = function(ts) {
		return ts2us_mdy2(ts) + " " + ts2us_hm(ts);
	}

	// Convert Unix timestamp to something like "01-Jan-2016"
	M.ts2us_dMy = function(ts) {
		var d = ts2dt(ts);
		if(!d) {
			return "";
		}
		var month_names = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
		return ""+
			("0"+d.getDate()).substr(-2)+
			"-"+
			month_names[d.getMonth()]+
			"-"+
			d.getFullYear();
	}


	// Make all lowercase
	// E.g.  "Foo".lcase()		// "foo"
	String.prototype.lcase = function() { return this.toLowerCase() }

	// Make all uppercase
	// E.g.  "Foo".ucase()		// "FOO"
	String.prototype.ucase = function() { return this.toUpperCase() }

	// Capitalize first word
	// E.g.  "foo bar".ucfirst()		// "Foo bar"
	String.prototype.ucfirst = function() {
		return this.substring(0,1).toUpperCase() + this.substring(1)
	}

	// Capitalize all words
	// E.g.  "foo bar".ucwords()		// "Foo Bar"
	String.prototype.ucwords = function( sep ) {
		sep = sep || /[\s]+/;
		var a = this.split( sep );
		for( var i = 0; i < a.length; i++ ) {
			a[ i ] = a[ i ].ucfirst();
		}
		return a.join( " " );
	}

	// Returns true if the string begins with the prefix string
	// E.g.	"Foobar".startsWith( "Foo" ) 		// true
	// E.g.	"foobar".startsWith( "Foo" ) 		// false
	if( String.prototype.startsWith === undefined ) {
		String.prototype.startsWith = function(prefix) {
			return this.substr(0, prefix.length) == prefix;
		}
	}

	// Returns true if the string ends with the suffix string
	// E.g.	"Foobar".endsWith( "bar" ) 		// true
	// E.g.	"foobar".endsWith( "Bar" ) 		// false
	if( String.prototype.endsWith === undefined ) {
		String.prototype.endsWith = function(suffix) {
			return this.substr(-suffix.length) == suffix;
		}
	}

	// Abbreviate to 'l' chars with ellipses
	// E.g. "CADAFAEL THE BATTLE-DECLINER".abbr(20)	// "CADAFAEL THE BAT ..."
	String.prototype.abbr = function(l) {
		l = toInt(l) || 5;
		if(this.length <= l) {
			return "" + this;	// Cuz ... some times this === a String object, not a literal
		}
		return this.substr(0, l - 4) + " ...";
	}

	// Convert a string from something like "prof_fees" to "Prof Fees"
	String.prototype.toLabel = function() {
		var s = this.replace( /[_]+/g, " " );
		s = s.ucwords();
		return s;
	}

	// Convert a string from something like "Prof. Fees" to  "prof_fees"
	String.prototype.toId = function() {
		var s = this.toLowerCase();
		s = s.replace( /[^a-z0-9]+/g, " " );
		s = s.trim();
		s = s.replace( /\s+/g, "_" );
		return s;
	}

	// Returns true if string contains all of the arguments irrespective of case
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

	// Returns true if the string is a valid email address
	String.prototype.is_email = function() {
		return /^[A-Za-z0-9_\+-]+(\.[A-Za-z0-9_\+-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.([A-Za-z]{2,})$/.test(this);
	}

	// So I can use each() instead of forEach
	// E.g. [ 1, 2, 3 ].each( n => { ... } );
	// XXX Deprecated ... don't think it was ever used 
	// Array.prototype.each = Array.prototype.forEach;


	// Returns a human readable relative time description for a Unix timestmap.
	// E.M. agoStr( time() - 60 ) 	// "60 seconds ago"
	// E.M. agoStr( time() - 63 ) 	// "1 minute ago"
	// Pass a truthy value for argument 'no_suffix' to suppress the " ago" at the end
	M.agoStr = function(ts, no_suffix) {
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

		// Read a file from disk
		// Reads async if callback cb is provided,
		// otherwise reads and returns contents synchronously.
		M.getFile = function(path, enc, cb) {
			var fs = require("fs");
			if(!cb) {
				return fs.readFileSync(path, enc);
			}
			fs.readFile(path, enc, cb);
		}

		// Return ASCII sha1 for a string
		M.sha1 = function(s) {
			var h = require("crypto").createHash("sha1");
			h.update(s);
			return h.digest("hex");
		}

		// Return ASCII sha256 for a string
		M.sha256 = function(s) {
			var h = require("crypto").createHash("sha256");
			h.update(s);
			return h.digest("hex");
		}

		// Convert Ctr object into an event emitter (?)
		M.EE = function(Ctr) {
			var EventEmitter = require("events");
			require("util").inherits(Ctr, EventEmitter);
			var o = new Ctr();
			EventEmitter.call(o);
			return o;
		};


	}
	else  {

		M.LS = {
			// XXX Add autoconverstion to/from JSON for objects
			// XXX Add ttl feature
			get: function(k) {
				try {
					return localStorage.getItem(k);
				} catch(e) { }
				return null;
			},
			set: function(k, v) {
				try {
					return localStorage.setItem(k, v);
				} catch(e) { }
				return null;
			},
		};

		// Navigate to new url
		M.jmp = function(url) { document.location = url; }

		// Reload current page
		M.reload = function() { document.location.reload(); }

		// Make an async HTTP GET request for a URL
		M.getFile = function(url, cb) {
			var x = new XMLHttpRequest();
			x.onload = function() { cb(x.responseText, x); };
			x.open("GET", url);
			x.send();
		};

		// Shows a browser notification if permission granted.
		// Ask permission if user hasn't yet been asked and honor their choice thereafter.
		// title = Title string to show in notice (name of app typically)
		// text = String message to display.
		// icon = String path to graphic 
		// onclick = function to call if notification is clicked
		M.showNotification = function(title, text, icon, onclick) {
			if("Notification" in window) {
				let do_notice = function() {
					let n = new Notification(title, {body: text, icon:icon});
					if(onclick) {
						n.addEventListener("click", onclick);
					}
				};
				if(Notification.permission === "granted") {
					do_notice();
				}
				else {
					if(Notification.permission !== "denied") {
						Notification.requestPermission(function(permission) {
							if(Notification.permission === "granted") {
								do_notice();
							}
						});
					}
				}
			}
		};

		// Returns an object constructed from the current page's query args.
		M.getQueryData = function() {
			var o = {};
			var s = document.location.search;
			if(s) {
				var kv = s.substr(1).split("&")
				for(var i = 0; i < kv.length; i++) {
					var aa = kv[i].split("=");
					o[aa[0]] = decodeURIComponent(aa[1]);
				}
			}
			return o
		};

		// Get an element by its id
		// XXX Never liked this name of this thing.
		M.getEl = function(id) {
			return document.getElementById(id);
		};

		HTMLCollection.prototype.toArray = function() {
			let arr = [];
			for(let i = 0; i < this.length; i++) {
				arr.push( this[ i ]);
			}
			return arr;
		};

		NodeList.prototype.toArray = HTMLCollection.prototype.toArray;

		// Add a class to an element
		HTMLElement.prototype.addClass = function(c) {
			let cl = this.classList;
			if( ! cl.contains( c ) )
				cl.add( c );
			return this;
		};

		// Remove a class from an element
		HTMLElement.prototype.remClass = function(c) {
			let cl = this.classList;
			if( cl.contains( c ) )
				cl.remove( c );
			return this;
		};

		// Return all elements matching query selector as an array
		M.QS = function( qs ) {
			return document.querySelectorAll( qs ).toArray();
		};

		// Return first element matching query selector
		M.QS1 = function( qs ) {
			return M.QS( qs )[ 0 ];
		};

		// Get (or set if v is provided) an attribute's value
		HTMLElement.prototype.attr = function(a, v) {
			if(v !== undefined) {
				this.setAttribute(a, v);
				return this;
			}
			else {
				return this.getAttribute(a);
			}
		};

		// Get (or set if v is provided) an element's value
		HTMLElement.prototype.val = function(v) {
			if(v !== undefined) {
				this.value = v;
				return this;
			}
			else {
				return (this.value || "").trim();
			}
		};

		// Get (or set if h is provided) an element's innerHTML
		HTMLElement.prototype.html = function(h) {
			if(h !== undefined) {
				this.innerHTML = h;
				return this;
			}
			else {
				return this.innerHTML;
			}
		};

	}

	// Make all the module properties global (not recommended)
	M.globalize = function( what ) {
		let g = isBrowser ? window : global;
		for( let k in mod ) {
			g[ k ] = mod[ k ];
		}
	}

	if(isNode) {

		M.cache = require( "cache" );
		M.db = require( "db" );
		M.ds = require( "ds" );
		M.log5 = require( "log5" );
		M.markup = require( "sleepless-markup" );
		M.mxu = require( "mxu" );
		M.nav = require( "sleepless-nav" );
		M.rplc8 = require( "rplc8" );
		M.runq = require( "runq" );
		M.runp = require( "runp" );

		module.exports = M;

	} else {

		// XXX can't combine other modules in browser unless we adopt the browser import/module stuff

		window.sleepless = M;

	}

})();
