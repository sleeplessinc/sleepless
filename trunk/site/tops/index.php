<?php

    if (isset($_REQUEST['d']))
    {
        @require "topresults".$_REQUEST['d'].".php";
    }
    else
    {
        require "topresults.php";
    }
?>
<html>
<head>
<title>
    The top internet keywords for today - <?php print date("m.d.y"); ?>
</title>
<meta name="description" content="Today's top internet keywords.  This list is compiled from the four major providers of search suggestions and then aggregated for you.  Use the regular expression tool to quickly find the phrases you should know about.  Then try out the search suggestion tool to get more.">

<style type="text/css">
.pagetitle {
    font-weight: bold;
    font-size: 23px;
    font-family: Arial;
    padding-bottom:18px;
}

.heading{
    font-weight: bold;
    font-size: 26px;
    margin-top: 10px;
}

.column{
    float: left;
}

.letter {
    padding-left: 5px;
    padding-right: 5px;
}

.correction {
    padding: 1px;
    font-weight:bold;
    max-width:260px;
}
</style>
<script type="text/javascript">
    var marked = [];
    function HuntCompletions(event)
    {
        var value = document.getElementById("value").value; 
        var lettersToCheck = [];
        value = value.toLowerCase();
        if ( value != "" )
        {
            var spans = document.getElementsByTagName("span");
            for ( var spanCt = 0; spanCt < spans.length; spanCt++ )
            {
                var curSpan = spans[spanCt];
                if ( curSpan.className == "notthisone" )
                    continue;

                lettersToCheck[curSpan.parentNode.parentNode.id] = curSpan.parentNode.parentNode;
                if ( curSpan.firstChild.nodeValue.match(".*"+value+".*"))
                {
                    curSpan.parentNode.style.display = "";
                }
                else
                {
                    curSpan.parentNode.style.display = "none";
                }
            }
        }
        else
        {
            var spans = document.getElementsByTagName("span");
            for ( var spanCt = 0; spanCt < spans.length; spanCt++ )
            {
                var curSpan = spans[spanCt];
                if ( curSpan.className == "notthisone" )
                    continue;
                lettersToCheck[curSpan.parentNode.parentNode.id] = curSpan.parentNode.parentNode;
                curSpan.parentNode.style.display = "";
            }
        }

        for ( var letter in lettersToCheck )
        {
            var letterBox = lettersToCheck[letter];
            var stillVisible = 0;
            var children = letterBox.getElementsByTagName("div");
            for (var divCt = 0; divCt < children.length; divCt++ )
            {
                if ( children[divCt].style.display != "none" && children[divCt].className != "heading" )
                {
                    stillVisible = 1;
                    break;
                }
            }

            if ( !stillVisible )
            {
                letterBox.style.display = "none";
            }
            else
            {
                letterBox.style.display = "";
            }
        }
    }

    function FindCompletions(regExString)
    {
        document.getElementById("value").value = regExString; 
        HuntCompletions();
    }

    function DoSearch(site)
    {
        switch(site)
        {
            case "google": document.location.href = "http://www.google.com/search?hl=en&q="+encodeURIComponent(document.getElementById('search').value);
                break;
            case "amazon": document.location.href = "http://www.amazon.com/s/?url=search-alias%3Daps&tag=soovle-20&field-keywords="+encodeURIComponent(document.getElementById('search').value);
                break;
            case "yahoo": document.location.href = "http://search.yahoo.com/search?ei=UTF-8&p="+encodeURIComponent(document.getElementById('search').value);
                break;
            case "ask": document.location.href = "http://www.ask.com/web?search=search&qsrc=0&o=0&l=dir&q="+encodeURIComponent(document.getElementById('search').value);
                break;
            case "youtube": document.location.href = "http://www.youtube.com/results?search_type=&aq=f&search_query="+encodeURIComponent(document.getElementById('search').value);
                break;
        }
    }

</script>
</head>
<body onload="document.getElementById('search').focus()">
    <div style="width:145px">
        <a href="http://soovle.com" style="position:relative;top:1px"><img src="/images/soovle.png" border="none"></a>
        <a href="http://soovle.com"><img src="/images/stars.png" border="none"></a>
        <a href="http://soovle.com/top/"><img src="/images/startop.png" border="none"></a>
    </div>
    <div id="needhelp" style="position:absolute;font-size:12px;margin-left:10px;font-weight:bold">
        Find better search terms. <br>
        Click on the stars and <a href="/" style="color:blue">let the web help</a>.
    </div>
    <div style="float:right;height:1px;">
        <div style="position:relative;width:200px;font-weight:bold;font-size:12px">
            Click on the provider icons to see their search results.
            <div align="center" style="padding:2px">
                <img src="http://soovle.com/images/googlefavicon.png"/>
                <img height="16" src="http://www.amazon.com/favicon.ico"/>
                <img src="http://www.yahoo.com/favicon.ico"/>
                <img src="http://soovle.com/images/askfavicon.ico"/>
                <img src="http://www.youtube.com/favicon.ico"/>
            </div>
        </div>
    </div>
    <div class="pagetitle" align="center">
        <div style="clear:both" align="center">
            Top Internet Keywords For - <?php print date("m.d.y"); ?>
        </div>
        <div style="padding-top:5px; font-size:12px;" align="center">
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

for ( $letCt = 0; $letCt < count($letters); $letCt++ )
{
    if ( $letCt <> 0 )
    {
        print " - \n";
    }
    print "<a style='text-decoration:underline;cursor:pointer;' onclick='FindCompletions(\"^".$letters[$letCt]."\")'>".$letters[$letCt]."</a>";
}
    print " - <a style='text-decoration:underline;cursor:pointer;' onclick='FindCompletions(\"\")'>all</a>";
        ?>
        </div>
<?
    $favIcons = array(
                    "http://soovle.com/images/googlefavicon.png",
                    "http://www.amazon.com/favicon.ico",
                    "http://www.yahoo.com/favicon.ico",
                    "http://soovle.com/images/askfavicon.ico",
                    "http://www.youtube.com/favicon.ico"
                );
    $searchUrls = array (
                    "http://www.google.com/search?hl=en&q=",
                    "http://www.amazon.com/s/?url=search-alias%3Daps&tag=soovle-20&field-keywords=",
                    "http://search.yahoo.com/search?ei=UTF-8&p=",
                    "http://www.ask.com/web?search=search&qsrc=0&o=0&l=dir&q=",
                    "http://www.youtube.com/results?search_type=&aq=f&search_query="
                );
    ?>
        <div style="padding-top:5px;" align="center">
            <span class="notthisone" style="font-size: 12px">Search: </span><input id="search" value="">
            <span class="notthisone" align="center" style="padding:2px;">
                <span class="notthisone" onclick="DoSearch('google')" style="cursor:pointer"><img border="none" style="position:relative; top:3px" src="http://www.soovle.com/images/googlefavicon.png"/></span>
                <span class="notthisone" onclick="DoSearch('amazon')" style="cursor:pointer"><img border="none" style="position:relative; top:3px" src="http://www.amazon.com/favicon.ico" height="16"/></span>
                <span class="notthisone" onclick="DoSearch('yahoo')" style="cursor:pointer"><img border="none" style="position:relative; top:3px" src="http://www.yahoo.com/favicon.ico"/></span>
                <span class="notthisone" onclick="DoSearch('ask')" style="cursor:pointer"><img border="none" style="position:relative; top:3px" src="http://www.soovle.com/images/askfavicon.ico"/></span>
                <span class="notthisone" onclick="DoSearch('youtube')" style="cursor:pointer"><img border="none" style="position:relative; top:3px" src="http://www.youtube.com/favicon.ico"/></span>
            </span>
            <input type="hidden" value="" id="value">
        </div>
    </div>
    <div style="float:left;margin-top:20px;margin-right:10px">
        <div style="text-align:center;color:green;font-size:11px;font-weight:bold">
            - Google Ads -
        </div>
        <script type="text/javascript"><!--
        google_ad_client = "pub-9497684905356183";
        /* 160x600, soovle-top */
        google_ad_slot = "1497338186";
        google_ad_width = 160;
        google_ad_height = 600;
        //-->
        </script>
        <script type="text/javascript"
        src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
        </script>
    </div>
    <?
    $letterCt = 0;
    $columnCt = 1;
    print "\t<div class='column' id='column1'>\n";
    foreach ( $topResults as $letter => $corrections )
    {
        print "\t\t<div class='letter' id='letter$letter'>\n";
        print "\t\t\t<div class='heading'>".$letter."</div>\n";
        for ( $corCt = 0; $corCt < count($corrections); $corCt++ )
        {
            $corArray = $corrections[$corCt];
            $curTerm = $corArray[0];
            $curTerm = str_replace("'", "\\'",$curTerm);
            $curHTMLTerm = str_replace("'", "&apos;",$corArray[0]);
            print "\t\t\t\t<div class='correction'><span style='cursor:pointer' onclick='document.getElementById(\"search\").value=this.firstChild.nodeValue;document.getElementById(\"search\").focus();'>".$corArray[0]."</span>\n";

            print "\t\t\t\t\t<a href='".$searchUrls[$corArray[1]].$curTerm."'><img height='16' border='none' src='".$favIcons[$corArray[1]]."'></a>\n";
            if ( isset($corArray[2]) && $corArray[2] <> "" )
            {
                print "\t\t\t\t\t<a href='".$searchUrls[$corArray[2]].$curTerm."'><img height='16' border='none' src='".$favIcons[$corArray[2]]."'></a>\n";
            }

            if ( isset($corArray[3]) && $corArray[3] <> "" )
            {
                print "\t\t\t\t\t<a href='".$searchUrls[$corArray[3]].$curTerm."'><img height='16'  border='none' src='".$favIcons[$corArray[3]]."'></a>\n";
            }

            if ( isset($corArray[4]) && $corArray[4] <> "" )
            {
                print "\t\t\t\t\t<a href='".$searchUrls[$corArray[4]].$curTerm."'><img height='16'  border='none' src='".$favIcons[$corArray[4]]."'></a>\n";
            }

            if ( isset($corArray[5]) && $corArray[5] <> "" )
            {
                print "\t\t\t\t\t<a href='".$searchUrls[$corArray[5]].$curTerm."'><img height='16'  border='none' src='".$favIcons[$corArray[5]]."'></a>\n";
            }
            
            print "\t\t\t\t</div>\n";
        }
        print "\t\t</div>\n";

        if ( $letterCt % 7 == 1 && $letterCt > 1 )
        {
            $columnCt++;
            print "\t</div>\n\t<div class='column' id='column$columnCt'>\n";
        }

        $letterCt++;
    }

    if (!( $letterCt % 7 == 1 && $letterCt > 1 ))
    {
        print "\t</div>\n";
    }
?>
        <script type="text/javascript">
        var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
        document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
        </script>
        <script type="text/javascript">
        var pageTracker = _gat._getTracker("UA-5733862-1");
        pageTracker._trackPageview();
        </script>
</body>
</html>
