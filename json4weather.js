/* Extension reading RSS feed at livedoor weather forecast, using rss2json.com */
/* originally written by by N. Kishi for Hiratoki Workshop, August 2017 */
// rss2json.com api_key may not be needed by light users

(function(ext) {
var latestFeed = {};
var latestList = [];
var pointer = 0;
var feedURL = "http://weather.livedoor.com/forecast/rss/area/130010.xml";
var livedoorURL = "http://weather.livedoor.com/forecast/rss/area/";

var secondParameter = {
   // Get your own api_key from rss2json.com
   api_key :  "o0d2vpx0e4bchbfnfzfi7lf6th2j6gdfqdhla10s"
};

   $.getScript("https://rss2json.com/gfapi.js", 
    	function() {
     		google.load("feeds", "1");
    	});

  ext._shutdown = function() {};

  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

  ext.updateFeed = function(callback) {
        //feedURL = asahiURL+"newsheadlines"+".rdf";
        secondParameter.callback = callback;
	var feed = new google.feeds.Feed(String(feedURL),secondParameter);
        pointer =0;
        feed.load(function(result) {
            if (result.error) {
                console.log("There was an error loading a feed. (" + result.error.code + ") " + result.error.message);
            } else {
                latestFeed = result.feed;
                latestList = result.feed.entries;
                console.log("feed is loaded: "+ latestFeed.title);
            }
        });
    };

  var table={'東京':'130010','横浜':'140010',
			'さいたま':'110010','千葉':'120010'};

  ext.updateFeed1 = function(subject, callback) {
        cat4subject = table[subject];
        feedURL = livedoorURL+cat4subject+".xml";
        secondParameter.callback = callback;
	var feed = new google.feeds.Feed(String(feedURL),secondParameter);
        pointer =0;
        feed.load(function(result) {
            if (result.error) {
                console.log("There was an error loading a feed. (" + result.error.code + ") " + result.error.message);
               
            } else {
                latestFeed = result.feed;
                latestList = result.feed.entries;
                console.log("feed is loaded: "+ latestFeed.title);            
            }
        });
    };

  ext.updateFeed2 = function(x, callback) {
        feedURL = livedoorURL+x+".xml";
        secondParameter.callback = callback;
	var feed = new google.feeds.Feed(String(feedURL),secondParameter);
        pointer =0;
        feed.load(function(result) {
            if (result.error) {
                console.log("There was an error loading a feed. (" + result.error.code + ") " + result.error.message);
               
            } else {
                latestFeed = result.feed;
                latestList = result.feed.entries;
                console.log("feed is loaded: "+ latestFeed.title);            
            }
        });
    };

   ext.feedTitle = function() {
        if (latestFeed) {
            return latestFeed.title;
        }
        return '';
    };
    
   ext.feedEntriesLength = function() {
        if (latestList) {
            return latestList.length;
        }
        return 0;
    };
    
    ext.getEntryTitle = function(pos) {
        if(pos <0) return '';
        if(pos >= latestList.length) return '';
        return latestList[pos].title;
    };

    ext.getEntryContent = function(pos) {
        if(pos <0) return '';
        if(pos >= latestList.length) return '';
        return latestList[pos].content;
    };

     ext.toNextItem = function(callback) {
        pointer++;
    };


     ext.getCurrentTitle = function() {
        if(pointer <0) return '';
        if(pointer >= latestList.length) return '';
        return latestList[pointer].title;
    };

    ext.getCurrentContent = function() {
        if(pointer <0) return '';
        if(pointer >= latestList.length) return '';
        return latestList[pointer].content;
    };
 
  var descriptor = {
    blocks: [
/** block name in Japanese **/
      [' ', 'livedoor天気予報を取得する', 'updateFeed'],
      ['r', '予報(Feed)タイトル','feedTitle'],
      ['r', '予報(Feed)の日数','feedEntriesLength'],
      [' ', '次の日に移動', 'toNextItem'],
      ['r', '現在の日のタイトル','getCurrentTitle'],
      ['r', '現在の日の本文','getCurrentContent'],
      [' ', ' %m.subject の天気予報を取得する', 'updateFeed1','東京'],
      [' ', ' %s (地点番号）の天気予報を取得する', 'updateFeed2','130010'],
      ['r', '%n 日目の予報のタイトル','getEntryTitle',0],
      ['r', '%n 日目の予報の本文','getEntryContent',0]
    ],
    menus:{
       subject:['東京','横浜','さいたま','千葉']
    },
    url: 'http://weather.livedoor.com/weather_hacks/rss_feed_list'
  };

  ScratchExtensions.register('03 Livedoor Weather', descriptor, ext);
}
)({});

