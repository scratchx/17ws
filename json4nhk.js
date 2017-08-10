/* Extension reading RSS feed at NHK (www3.nhk.or.jp), using rss2json.com */
/* originally written by by N. Kishi for Hiratoki Workshop, August 2017 */
// rss2json.com api_key may not be needed by light users

(function(ext) {
var latestFeed = {};
var latestList = [];
var pointer = 0;
var feedURL = "http://www3.nhk.or.jp/rss/news/cat0.xml";
var nhkURL = "http://www3.nhk.or.jp/rss/news/"
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

  var table={'ヘッドライン':'cat0','社会':'cat1',
			'文化・エンタメ':'cat2','科学・医療':'cat3'};

  ext.updateFeed1 = function(subject, callback) {
        cat4subject = table[subject];
        feedURL = nhkURL+cat4subject+".xml";
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
        feedURL = nhkURL+x+".xml";
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
      [' ', 'NHK主要ニュースを取得する', 'updateFeed'],
      ['r', '部門(Feed)タイトル','feedTitle'],
      ['r', '部門(Feed)の記事数','feedEntriesLength'],
      [' ', '次の記事に移動', 'toNextItem'],
      ['r', '現在の記事のタイトル','getCurrentTitle'],
      ['r', '現在の記事の本文','getCurrentContent'],
      [' ', 'NHKニュース %m.subject を取得する', 'updateFeed1','ヘッドライン'],
      [' ', 'NHKニュース %s (xml名）を取得する', 'updateFeed2','cat5'],
      ['r', '%n 番目の記事のタイトル','getEntryTitle',0],
      ['r', '%n 番目の記事の本文','getEntryContent',0]
/** in English
      [' ', 'get nhk headlines', 'updateFeed'],
      ['r', 'title of the nhk feed','feedTitle'],
      ['r', 'number of nhk items','feedEntriesLength'],
      [' ', 'move to next nhk item', 'toNextItem'],
      ['r', 'get title of current nhk item','getCurrentTitle'],
      ['r', 'get content of current nhk item','getCurrentContent'],
      [' ', 'get nhk news on %m.subject', 'updateFeed1','ヘッドライン'],
      [' ', 'get nhk news in %s .xml', 'updateFeed2','cat5'],
      ['r', 'get title of nhk item %n','getEntryTitle',0],
      ['r', 'get content of nhk item %n','getEntryContent',0]
**/
    ],
    menus:{
       subject:['ヘッドライン','社会','文化・エンタメ','科学・医療']
    },
    url: 'http://www3.nhk.or.jp/toppage/rss/index.html'
  };

  ScratchExtensions.register('02 NHK news', descriptor, ext);
}
)({});

