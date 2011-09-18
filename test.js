var l = console.log
s = require("./sleepless.js")
l("millis="+millis())
l("time="+time())
l({x:7}.json())
l("{\"x\":[1,2]}".obj())
l(".lower "+"JoE".lower())
l(".upper "+"Joe".upper())
l(".cap "+"joE".cap())
l(".abbr "+"joe hitchens".abbr(5))
l(".trim "+" \tjoe hitchens \n".trim())
var s = "3.1415"
l(".toint "+s.toint())
l(".toflt "+s.toflt())
var n = 3.1415
l(".toBucks "+n.toBucks())
l(".toCents "+n.toCents())
