setTimeout(function(){

  $(document).off("mousemove_without_noise");
  chrome.extension.sendRequest({handler: 'translate', word: "ملك"}, function(response) {
    var e = { clientX: $(window).width(), clientY: 0 };
    showPopup(e, TransOver.formatTranslation(response.translation));
  });
  chrome.extension.sendRequest({handler: 'translate', word: "المنظمة"}, function(response) {
    var e = { clientX: 0, clientY: 20 };
    showPopup(e, TransOver.formatTranslation(response.translation));
  });
  chrome.extension.sendRequest({handler: 'translate', word: "املاك"}, function(response) {
    var e = { clientX: 0, clientY: 250 };
    showPopup(e, TransOver.formatTranslation(response.translation));
  });
  chrome.extension.sendRequest({handler: 'translate', word: "ابنكما"}, function(response) {
    var e = { clientX: 400, clientY: 0 };
    showPopup(e, TransOver.formatTranslation(response.translation));
  });
  chrome.extension.sendRequest({handler: 'translate', word: "اسمه"}, function(response) {
    var e = { clientX: 400, clientY: 850 };
    showPopup(e, TransOver.formatTranslation(response.translation));
  });

  $('#urlInput').keypress(function(event) {
      console.log(event);
      if (event.keyCode == 13) {
          var url = event.target.value;
          console.log(url);
          $.get(url, function(data) {
              //console.log(data);
              var object = $($.parseHTML(data));
              var text = object.text().trim();
              var words = XRegExp.matchChain(text, [XRegExp("[\\p{ArabicWord}]+", "g")]);
              var wordCount = words.length;
              console.log([wordCount, words]);
              var counter = 0;
              var unknownWords = {};
              words.forEach(function(word) {
                chrome.extension.sendRequest({handler: 'translate', word: word}, function(response) {
                    if(!(response.translation instanceof Array)) {
                        unknownWords[word] = response;
                    }
                    counter++;
                    if (counter == wordCount) {
                        console.log(unknownWords);
                    }
                });
              });
          });
      }
  });

}, 500);
