/* Extension using the JavaScript Speech API for text to speech */
/* originally written by Sayamindu Dasgupta <sayamindu@media.mit.edu>, April 2014 */
/* translated by N. Kishi for Hiratoki Workshop, August 2017 */

new (function() {
    var ext = this;

    /*function _get_voices() {
        var ret = [];
        var voices = speechSynthesis.getVoices();
        
        for(var i = 0; i < voices.length; i++ ) {
            ret.push(voices[i].name);
            console.log(voices.toString());
        }

        return ret;
    }

    ext.set_voice = function() {
    };*/

    ext.speak_text = function (text, callback) {
        var u = new SpeechSynthesisUtterance(text.toString());
        u.onend = function(event) {
            if (typeof callback=="function") callback();
        };
        
        speechSynthesis.speak(u);
    };

    ext._shutdown = function() {};

    ext._getStatus = function() {
        if (window.SpeechSynthesisUtterance === undefined) {
            return {status: 1, msg: 'Your browser does not support text to speech. Try using Google Chrome or Safari.'};
        }
        return {status: 2, msg: 'Ready'};
    };

    var descriptor = {
        blocks: [
            //['', 'set voice to %m.voices', 'set_voice', ''],
            ['w', '%s を読み上げる', 'speak_text', 'Hello!'],
        ],
        /*menus: {
            voices: _get_voices(),
        },*/
    };

    ScratchExtensions.register('01 Text2SpeechJ', descriptor, ext);
})();