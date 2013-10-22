
var l = console.log
s = require("./sleepless.js")

o = { a:[1,2,3], t:true, f:false, o:{key:'val'}, pi:3.1415, n:null };
j = JSON.stringify(o);

throwIf( o2j(o) !== j );
throwIf( o2j(j2o(j)) !== j );

throwIf( "foO".lower() !== "foo" );
throwIf( "foO".upper() !== "FOO" );
throwIf( "foO".cap() !== "FoO" );
throwIf( "foO".ucfirst() !== "FoO" );
throwIf( "foo baR".ucwords() !== "Foo BaR" );
throwIf( "foo bar baz".abbr(7) !== "foo ..." );
throwIf( "foo".abbr(7) != "foo" );		// XXX why doesn't this work with !== ?
throwIf( " \tfoo bar \n".trim() !== "foo bar" );
throwIf( toInt("3.1415") !== 3 );
throwIf( toFloat("3.1415") !== 3.1415 );

throwIf( money("0.01") !== "0.01", "0.01" );
throwIf( money("31415.015") !== "31,415.02" );
throwIf( money("31415.01") !== "31,415.01" );
throwIf( money("31415.99") !== "31,415.99" );
throwIf( money(0.01) !== "0.01");
throwIf( money(31415.015) !== "31,415.02");
throwIf( money(31415.01) !== "31,415.01" );
throwIf( money(31415.99) !== "31,415.99" );
throwIf( money(-0.01) !== "-0.01" );
throwIf( money(-31415.016) !== "-31,415.02" );
throwIf( money(-31415.01) !== "-31,415.01" );
throwIf( money(-31415.99) !== "-31,415.99" );

getFile("test.js", function(err, data) {
	throwIf( err, err );
	throwIf( getFile("test.js").toString() !== data.toString() );
});

