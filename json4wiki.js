// Wikipeida extension for ScrachX
// written by N. Kishi 2017
/* Extension reading wikipedia API */
/* originally written by by N. Kishi for Hiratoki Workshop, August 2017 */
// api_key is not needed.  
// try to cache the search terms for preventing overuse, hopefully.

(function(ext) {
  var cacheDuration = 1800000; //ms, 30 minutes
  var cachedTemps = {};
  var jaWikiURL = "https://ja.wikipedia.org/w/api.php";
  var wikiURL = "https://en.wikipedia.org/w/api.php";

  ext._shutdown = function() {};

  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

  ext.getWiki = function(term,callback) {

    var temp = '';
    if( term == null || term == '' ){
          return callback(null);
    }

    if (term in cachedTemps &&
        Date.now() - cachedTemps[term].time < cacheDuration) {
      // data is cached
      callback(cachedTemps[term].data);
    }
    console.log("0e-empty");

longURL = wikiURL + '?' + $.param({
    'action' : 'opensearch',
    'search' : term,
    'prop'  : 'revisions',
    'rvprop' : 'content',
    'format' : 'json',
    'limit' : 1
});

   $.ajax({
      url: longURL,
      dataType: 'jsonp',
      timeout: 2000,      // two seconds;
      success: function(data) {
       //Received the data. Cache and return the data.
        cachedTemps[term] = {data: data, time: Date.now()};
        console.log("0"+data);
        temp = data[2][0];
        callback(temp);
      },
      error: function(data){
         console.log("1e-fetch failed");
         callback(null);
      },
    }); // end $.ajax

  };  // end ext.getWiki

  ext.getJaWiki = function(term,callback2) {

    var temp = '';
    if( term == null || term == '' ){
          return callback2(null);
    }

    if (term in cachedTemps &&
        Date.now() - cachedTemps[term].time < cacheDuration) {
      // data is cached
      callback2(cachedTemps[term].data);
    }
    console.log("1empty");

longURL = jaWikiURL + '?' + $.param({
    'action' : 'opensearch',
    'search' : term,
    'prop'  : 'revisions',
    'rvprop' : 'content',
    'format' : 'json',
    'limit' : 1
});

   $.ajax({
      url: longURL,
      dataType: 'jsonp',
      timeout: 2000,      // two seconds;
      success: function(data) {
       //Received the data. Cache and return the data.
        cachedTemps[term] = {data: data, time: Date.now()};
        //console.log("0"+data);
        temp = data[2][0];
        console.log("1"+temp);
        callback2(temp);
      },
      error: function(data){
         console.log("fetch failed");
         callback2(null);
      },
    }); // end $.ajax

  };  // end ext.getJaWiki

  ext.empty = function(term,callback2) {
    console.log("empty");
  };

  var descriptor = {
    blocks: [
      ['R', ' %s の日本語ウィキペディア記事', 'getJaWiki','東京'],
      ['R', ' %s の英語 Wikipedia Article', 'getWiki','Bee']
/*
['R', '日本語ウィキペディア記事', 'empty']
*/
    ]
  };  // end descriptor;
ScratchExtensions.register('04 Wikipedia', descriptor, ext);

  } 
)({});


