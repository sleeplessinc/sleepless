/*
Copyright 2013 Sleepless Software Inc. All rights reserved.

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
	// browser
	isBrowser = true;
	isNode = false;
	global = window
}
else  {
	// node
	isNode = true;
	isBrowser = false;
}
// -------
global.throwIf = function(c, s) { if(c) { throw new Error(s || "FAILED ASSERTION"); } }
global.nop = function(){}
global.time = function() { return (new Date).uts() }
global.j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
global.o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }
global.toInt = global.p10 = function(v) { return parseInt(""+v, 10) || 0 }
global.toFloat = global.pflt = function(v) { return parseFloat(""+v) || 0.0 }
global.log = function(m) { return console.log(m); }
global.money = function(n, decPoint, thousandsSep) {
	var n = Math.round( pflt(n) * 100 ) / 100;
    var sign = n < 0 ? '-' : '';
    n = Math.abs(+n || 0);
    var intPart = parseInt(n.toFixed(2), 10) + '';
    var j = intPart.length > 3 ? intPart.length % 3 : 0;
    return sign + (j ? intPart.substr(0, j) + "," : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + ",") + (2 ? "." + Math.abs(n - intPart).toFixed(2).slice(2) : '');
}
// -------
/*
Object.prototype.json = function() { return o2j(this); }
Object.prototype.toInt = function() { return p10(this.toString()) }
Object.prototype.toFloat = function() { return pflt(this.toString()) }
Object.prototype.toMoney = function(decPoint, thousandsSep) {
	var n = Math.round( this.toFloat() * 100 ) / 100;
    var sign = n < 0 ? '-' : '';
    n = Math.abs(+n || 0);
    var intPart = parseInt(n.toFixed(2), 10) + '';
    var j = intPart.length > 3 ? intPart.length % 3 : 0;
    return sign + (j ? intPart.substr(0, j) + "," : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + ",") + (2 ? "." + Math.abs(n - intPart).toFixed(2).slice(2) : '');
};
*/
// -------
Date.prototype.millis = function() { return (new Date()).getTime() }
Date.prototype.uts = function() { return Math.floor(this.millis() / 1000) }	// unix timestamp; secs from epoch
// -------
String.prototype.trim = String.prototype.trim || function() {return this.replace(/^\s+|\s+$/g, "")}
String.prototype.obj = function() { return j2o(this); }
String.prototype.lower = function() { return this.toLowerCase() }
String.prototype.upper = function() { return this.toUpperCase() }
String.prototype.abbr = function(l) {
	l = p10(l) || 5;
	if(this.length <= l) {
		return this;
	}
	return this.substr(0, l - 4) + " ...";
}
String.prototype.cap = String.prototype.ucfirst = function() {
	return this.substring(0,1).toUpperCase() + this.substring(1)
}
String.prototype.ucwords = function( sep ) {
	sep = sep || /[\s]+/;
	var a = this.split( sep );
	for( var i = 0; i < a.length; i++ ) {
		a[ i ] = a[ i ].ucfirst();
	}
	return a.join( " " );
}
// -------
if(isNode) {
	// node

	// XXX make XHR version of this for browser?
	global.getFile = function(path, cb) {
		var fs = require("fs");
		if(!cb) {
			return fs.readFileSync(path);
		}
		fs.readFile(path, cb);
	}
}
else  {
	// browser
}
