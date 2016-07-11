RegExp.quote = function(str) {
  return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-79560349-4']);
_gaq.push(['_trackPageview']);

var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

function translate(word, ga_event_name) {
  // FIXME Translate this word by hitting the database
  return "Arabic " + word;
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

      var translation = translate(request.word, Options.translate_by());
      sendResponse({
          translation: translation
      });
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
