RegExp.quote = function(str) {
  return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-79560349-4']);
_gaq.push(['_trackPageview']);

var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

var _toAbjad = {"'": "ء", "|": "آ", ">": "أ", "&": "ؤ", "<": "إ", "}": "ئ",
        "A": "ا", "b": "ب", "p": "ة", "t": "ت", "v": "ث", "j": "ج", "H": "ح",
        "x": "خ", "d": "د", "*": "ذ", "r": "ر", "z": "ز", "s": "س", "$": "ش",
        "S": "ص", "D": "ض", "T": "ط", "Z": "ظ", "E": "ع", "g": "غ", "_": "ـ",
        "f": "ف", "q": "ق", "k": "ك", "l": "ل", "m": "م", "n": "ن", "h": "ه",
        "w": "و", "Y": "ى", "y": "ي", "F": "ً", "N": "ٌ", "K": "ٍ", "a": "َ",
        "u": "ُ", "i": "ِ", "~": "ّ", "o": "ْ", "`": "ـٰ", "{": "ٱ", "P": "پ",
        "J": "چ", "V": "ڤ", "G": "گ"}
var _toABC = {};
for (var key in _toAbjad) {
  if (_toAbjad.hasOwnProperty(key)) {
     _toABC[_toAbjad[key]] = key;
  }
}
function toABC(str, backward) {
    var lookUpTable = backward ? _toAbjad : _toABC;
    abcString = "";
    for(var i = 0; i < str.length; i++) {
        var newChar = lookUpTable[str[i]];
        if (typeof newChar !== "undefined") {
            abcString += newChar;
        } else {
            console.warn("Unknown char: " + str[i]);
        }
    }
    return abcString;
}
function getStem(abcStem) {
  var stem = "";
  for (var i = 0; i < abcStem.length; i++) {
    stem += toABC(abcStem[i], true);
    if ( i !== abcStem.length - 1) {
      stem += " ";
    }
  }
  return stem;
}

var dictprefixes = [], dictstems = [], dictsuffixes = [],
    tableab = [], tableac = [], tablebc = [];
$.getJSON(chrome.extension.getURL('/data/dictprefixes.json'), function(contents) {
  dictprefixes = contents;
});
$.getJSON(chrome.extension.getURL('/data/dictstems.json'), function(contents) {
  dictstems = contents;
});
$.getJSON(chrome.extension.getURL('/data/dictsuffixes.json'), function(contents) {
  dictsuffixes = contents;
});
$.getJSON(chrome.extension.getURL('/data/tableab.json'), function(contents) {
  tableab = contents;
});
$.getJSON(chrome.extension.getURL('/data/tableac.json'), function(contents) {
  tableac = contents;
});
$.getJSON(chrome.extension.getURL('/data/tablebc.json'), function(contents) {
  tablebc = contents;
});

function _findWord(word, dict) {
  var results = [];
  for (var i = 0; i < dict.length; i++) {
    if (dict[i][0] === word) {
      results.push(dict[i]);
    }
  }
  return results;
}
function _checkAgainstTable(category1, category2, table) {
  for (var i = 0; i < table.length; i++) {
    if (table[i][0] === category1 && table[i][1] === category2) {
      return true;
    }
  }
  return false;
}


function findInDatabase(word) {
  // FIXME We must strip the vocalization!
  // Segmentation
  var segmentations = [];
  for (var i = 0; i <= 4 /*max prefix size is 4*/; i++) {
    for (var j = 0; j <= 6 /*max suffix size is 6*/; j++) {
      if (i + j < word.length) {
        segmentations.push({
          prefix: word.substring(0, i),
          stem: word.substring(i, word.length - j),
          suffix: word.substring(word.length - j)
        });
      }
    }
  }
  console.log(segmentations);

  var results = segmentations.filter(function(seg) {
    var validPrefixes = _findWord(seg.prefix, dictprefixes);
    if (validPrefixes.length === 0) return false;
    var validStems = _findWord(seg.stem, dictstems);
    if (validStems.length === 0) return false;
    var validSuffixes = _findWord(seg.suffix, dictsuffixes);
    if (validSuffixes.length === 0) return false;

    var compatibleCombinations = []
    for (var i = 0; i < validPrefixes.length; i++) {
      for (var j = 0; j < validStems.length; j++) {
        for (var k = 0; k < validSuffixes.length; k++) {
          var pre = validPrefixes[i], stem = validStems[j], suf = validSuffixes[k];
          if (_checkAgainstTable(pre[2], stem[2], tableab) &&
              _checkAgainstTable(pre[2], suf[2], tableac) &&
              _checkAgainstTable(stem[2], suf[2], tablebc) ) {
            compatibleCombinations.push({
              prefix: pre,
              stem: stem,
              suffix: suf
            })
          }
        }
      }
    }
    if (compatibleCombinations.length > 0) {
      seg.compatibleCombinations = compatibleCombinations;
      return true;
    } else {
      return false;
    }
  });
  return results;
}
function translate(word, ga_event_name, done) {
  var result = findInDatabase(word);
  if (result.length === 0) {
      done("No result for " + word);
  } else {
      done(result);
  }
}

function figureOutSlTl(tab_lang) {
  var res = {};

  if (Options.target_lang() == tab_lang && Options.reverse_lang()) {
    res.tl = Options.reverse_lang();
    res.sl = Options.target_lang();
    console.log('reverse translate into: ', {tl: res.tl, sl: res.sl});
  }
  else {
    res.tl = Options.target_lang();
    res.sl = Options.from_lang();
    console.log('normal translate into:', {tl: res.tl, sl: res.sl});
  }

  return res;
}

function on_translation_response(data, word, tl, last_translation, sendResponse, ga_event_name) {
  var output, translation = {tl: tl};

  console.log('raw_translation: ', data);

  if (!data.dict && !data.sentences ||
    (data.sentences && data.sentences[0].trans.match(new RegExp(TransOver.regexp_escape(word), 'i')))) {

    translation.succeeded = false;

    if (data.src == tl || Options.do_not_show_oops()) {
      output = '';
    }
    else {
      output = 'Oops.. No translation found.';
    }
  }
  else {
    translation.succeeded = true;
    translation.word = word;

    output = [];
    if (data.dict) { // full translation
      data.dict.forEach(function(t) {
          output.push({pos: t.pos, meanings: t.terms});
      });
    } else { // single word or sentence(s)
      data.sentences.forEach(function(s) {
          output.push(s.trans)
      })
      output = output.join(" ")
    }

    translation.sl = data.src;
  }

  if (! output instanceof String) {
    output = JSON.stringify(output);
  }

  translation.translation = output;

  $.extend(last_translation, translation);

  _gaq.push(['_trackEvent', ga_event_name, translation.sl, translation.tl]);

  console.log('response: ', translation);
  sendResponse(translation);
}

var last_translation = {};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    switch (request.handler) {
      case 'get_last_tat_sl_tl':
      console.log('get_last_tat_sl_tl');
      sendResponse({last_tl: localStorage['last_tat_tl'], last_sl: localStorage['last_tat_sl']});
      break;
      case 'get_options':
      sendResponse({
          options: JSON.stringify({
              except_urls: Options.except_urls(),
              target_lang: Options.target_lang(),
              reverse_lang: Options.reverse_lang(),
              delay: Options.delay(),
              word_key_only: Options.word_key_only(),
              selection_key_only: Options.selection_key_only(),
              tts: Options.tts(),
              tts_key: Options.tts_key(),
              popup_show_trigger: Options.popup_show_trigger(),
              translate_by: Options.translate_by()
          })
      });
      break;
      case 'translate':
      console.log("received to translate: " + request.word);
      var arabicWord = true;
      for (var i = 0; i < request.word.length; i++) {
          var charCode = request.word.charCodeAt(i);
          if (charCode < 1536 || charCode > 1791) {
              arabicWord = false;
              console.log("Not arabic char: " + request.word[i]);
              break;
          }
      }

      if (arabicWord) {
          translate(request.word, Options.translate_by(), function(translation) {
              sendResponse({
                  translation: translation
              });
          });
      }
      break;
      case 'tts':
      if (last_translation.succeeded) {
        console.log("tts: " + last_translation.word + ", sl: " + last_translation.sl);
        _gaq.push(['_trackEvent', 'tts', last_translation.sl, last_translation.tl]);

        var msg = new SpeechSynthesisUtterance();
        msg.lang = last_translation.sl;
        msg.text = last_translation.word;
        msg.rate = 0.7;
        speechSynthesis.speak(msg);
      }
      sendResponse({});
      break;
      default:
      console.log("Error! Unknown handler");
      sendResponse({});
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendRequest(tab.id, 'open_type_and_translate');
});

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == 'install') {
      chrome.tabs.create({url: chrome.extension.getURL('options.html')});
    }
});
