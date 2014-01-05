
var l = console.log
require("./sleepless.js")

o = { a:[1,2,3], t:true, f:false, o:{key:'val'}, pi:3.1415, n:null };
j = JSON.stringify(o);

throwIf( typeof nop !== "function" );

throwIf( o2j(o) !== j );
throwIf( o2j(j2o(j)) !== j );

throwIf( toInt(3) !== 3 );
throwIf( toInt(3.0) !== 3 );
throwIf( toInt("3") !== 3 );
throwIf( toInt("1,234") !== 1234 );
throwIf( toInt("1,234.56") !== 1234 );
throwIf( toInt("-1,234.56") !== -1234 );
throwIf( toInt(-1234.56) !== -1234 );

throwIf( toFlt(3) !== 3 );
throwIf( toFlt(3.0) !== 3 );
throwIf( toFlt("3") !== 3 );
throwIf( toFlt("1,234") !== 1234 );
throwIf( toFlt("1,234.56") !== 1234.56 );
throwIf( toFlt("-1,234.56") !== -1234.56 );
throwIf( toFlt(-1234.56) !== -1234.56 );

throwIf( c2b("10") !== 0.1 );
throwIf( c2b("12345") !== 123.45 );
throwIf( c2b(12345) !== 123.45 );
throwIf( c2b(1) !== 0.01 );
throwIf( b2c("100") !== 10000 );
throwIf( b2c("1.23") !== 123 );
throwIf( b2c("1,234.56") !== 123456 );
throwIf( b2c("1,234.5") !== 123450 );
throwIf( b2c("1,234") !== 123400 );
throwIf( b2c("0.01") !== 1 );
throwIf( b2c("0.01") !== 1 );

throwIf( toMoney("0.01") !== "0.01", "0.01" );
throwIf( toMoney("31415.015") !== "31,415.02" );
throwIf( toMoney("31415.01") !== "31,415.01" );
throwIf( toMoney("31415.99") !== "31,415.99" );
throwIf( toMoney(0.01) !== "0.01");
throwIf( toMoney(31415.015) !== "31,415.02");
throwIf( toMoney(31415.01) !== "31,415.01" );
throwIf( toMoney(31415.99) !== "31,415.99" );
throwIf( toMoney(-0.01) !== "-0.01" );
throwIf( toMoney(-31415.016) !== "-31,415.02" );
throwIf( toMoney(-31415.01) !== "-31,415.01" );
throwIf( toMoney(-31415.99) !== "-31,415.99" );

throwIf( my2ts("2014-01-01") !== 1391241600 );
throwIf( my2ts("2014-01-01 12:13:14") !== 1391285594 );

throwIf( dt2ts() !== 0 );
throwIf( ts2us(1384565221) !== "11/15/2013 17:27:01" );
throwIf( ts2us_md(1384565221) !== "11/15" );
throwIf( ts2us_mdy(1384565221) !== "11/15/2013" );
throwIf( ts2us_mdy2(1384565221) !== "11/15/13" );
throwIf( ts2us_hm(1384565221) !== "17:27" );
throwIf( ts2us_mdyhm(1384565221) !== "11/15/2013 17:27" );
throwIf( ts2us_mdy2hm(1384565221) !== "11/15/13 17:27" );

throwIf( !( us2dt("11/15/2013 17:27:01") instanceof Date) );
throwIf( dt2ts( us2dt("11/15/2013 17:27:01") ) !== 1384565221 );

throwIf( "foO".lcase() !== "foo" );
throwIf( "foO".ucase() !== "FOO" );
throwIf( "foO".ucfirst() !== "FoO" );
throwIf( "foo baR".ucwords() !== "Foo BaR" );
throwIf( "foo bar baz".abbr(7) !== "foo ..." );
throwIf( "foo".abbr(7) != "foo" );		// XXX why doesn't this work with !== ?
throwIf( " \tfoo bar \n".trim() !== "foo bar" );

throwIf( "Foo Bar".toId() !== "foo_bar" );
throwIf( "Foo_Bar".toId() !== "foo_bar" );
throwIf( " Foo_Bar ! ".toId() !== "foo_bar" );
throwIf( "foo_bar".toLabel() !== "Foo Bar" );
throwIf( "foo_bar".toLabel() !== "Foo Bar" );
throwIf( "foo_bar!".toLabel() !== "Foo Bar!" );

getFile("test.js", "utf8", function(err, data) {
	throwIf( err, err );
	throwIf( getFile("test.js").toString() !== data.toString() );
});

