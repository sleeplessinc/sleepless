<?php
$letters = array( 
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "e",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z"
            );
$urls = array(
            "http://clients1.google.com/complete/search?hl=en&q=",
            "http://completion.amazon.com/search/complete?mkt=1&search-alias=aps&x=updateAmazon&q=",
            "http://sugg.search.yahoo.net/sg/?output=fxjsonp&nresults=10&command=",
            "http://www.soovle.com/ask.php?q=",
            "http://suggestqueries.google.com/complete/search?nolabels=t&hl=en&ds=yt&client=suggest&json=t&jsonp=window.google.ac.jsonRPCDone&q="
        );

$handle = fopen("/home/soovleco/public_html/top/topresults.js", "w");

#for ( $letCt = 0; $letCt < 1; $letCt++ )
for ( $letCt = 0; $letCt < count($letters); $letCt++ )
{
    $startCommasMain = true;
    
    $index = array();
    $ctIndex = array();
    for ( $urlCt = 0; $urlCt < count($urls); $urlCt++ )
    {
        $queryURL = $urls[$urlCt].$letters[$letCt];

        $client = curl_init($queryURL);

        curl_setopt($client,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($client, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");
        $pageContents = curl_exec($client);
        curl_close($client);

        $pageContents = preg_replace("/^[^]].*?\[/","[", $pageContents);
        $pageContents = preg_replace("/][^]]*$/","]", $pageContents);
        
        print $pageContents."\n";
        $data = json_decode($pageContents);
        print $data."\n";

        if ( !$data || !$data[1] )
        {
            continue;
        }

        for ( $i = 0; $i < count($data[1]); $i++ )
        {
            $curTerm = $data[1][$i];
            if ( is_array($curTerm) )
            {
                $curTerm = $curTerm[0];
            }

            if ( !$index[$curTerm] )
            {
                $index[$curTerm] = array();
                $index[$curTerm][0] = 0;
            }

            $index[$curTerm][count($index[$curTerm])] = $urlCt;
            $index[$curTerm][0]++;
        }
    }

    foreach ($index as $term => $value)
    {
        $curCt = $value[0];

        if ( !$ctIndex["".$curCt] )
        {
            $ctIndex["".$curCt] = array();
        }

        $ctIndex["".$curCt][count($ctIndex["".$curCt])] = $term;
    }

    krsort($ctIndex);

    foreach ($ctIndex as $count => $termArray)
    {
        print "\n$count: ".join("\t", $ctIndex[$count]);
        for ( $termCt = 0; $termCt < count($termArray); $termCt++ )
        {
            fwrite($handle,$termArray[$termCt]."\n");
        }
    }
}
?>
