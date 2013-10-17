/*
Copyright 2011 Sleepless Software Inc. All rights reserved.

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
global.nop = function(){}
global.millis = function() { return new Date().getTime() }
global.time = function() { return Math.floor(millis() / 1000) }
global.j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
global.o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }
global.p10(v) { return parseInt(v, 10) || 0 }
global.pflt(v) { return parseFloat(v) || 0.0 }
// -------
Object.prototype.json = function() { return o2j(this); }
// -------
String.prototype.trim = String.prototype.trim || function() {return this.replace(/^\s+|\s+$/g, "")}
String.prototype.obj = function() { return j2o(this); }
String.prototype.lower = function() { return this.toLowerCase() }
String.prototype.upper = function() { return this.toUpperCase() }
String.prototype.abbr = function(l, s) {
	return this.length > l ? this.substring(0, l - 4)+(s || " ...") : this
}
String.prototype.toInt = function() { return p10(this); }
String.prototype.toFlt = function() { return pflt(this); }
String.prototype.ucfirst = function() {
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
Number.prototype.toBucks = function() { return ( (""+(this + 0.5)).toInt() /100).toFixed(2) }
Number.prototype.toCents = function() { return Math.floor((this + 0.005) * 100) }


