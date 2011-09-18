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

if((typeof process) === 'undefined')
	isNode = !(isPage = true)
else 
	isPage = !(isNode = true)

if(isPage) {
	global = window
}
else {
}

// -----

global.millis = function() { return new Date().getTime() }
global.time = function() { return Math.floor(millis() / 1000) }

Object.prototype.json = function() { return JSON.stringify(this) }
String.prototype.obj = function() { try { return JSON.parse(this) } catch(e) { } return null }

String.prototype.lower = function() { return this.toLowerCase() }
String.prototype.upper = function() { return this.toUpperCase() }
String.prototype.trim = String.prototype.trim || function() {
	return this.replace(/^\s+/gi, "").replace(/\s+$/gi, "")
}
String.prototype.abbr = String.prototype.abbr || function(l) {
	return this.length > l ? this.substring(0, l - 4)+" ..." : this
}
String.prototype.cap = String.prototype.cap || function() {
	return this.substring(0,1).toUpperCase() + this.substring(1)
}


String.prototype.toint = function() { return parseInt(this) || 0 }
String.prototype.toflt = function() { return parseFloat(this) || 0 }

// 1050 -> 10.50 
Number.prototype.toBucks = function() { return ( (""+(this + 0.5)).toint() /100).toFixed(2) }
// 10.50500 -> 1051 
Number.prototype.toCents = function() { return Math.floor((this + 0.005) * 100) }

exports.version = "sleepless.js 1.0"

