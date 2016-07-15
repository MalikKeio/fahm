TransOver = {};

TransOver.modifierKeys = {
  16: "shift", 17: "ctrl", 18: "alt", 224: "meta", 91: "command", 93: "command", 13: "Return"
};

var categories = {};
$.getJSON(chrome.extension.getURL('/data/categories.json'), function(contents) {
  categories = contents;
});

// TODO use handlebars or something
TransOver.formatTranslation = function(translation) {
  var css_class = 'pos_translation';

  var formatted_translations = [];
  if (translation instanceof Array) {
    translation.forEach(function(pos_block) {
      var formatted_translation = '<div class="fahm-entry"><div class="fahm-word">';
      var word = pos_block.prefix + pos_block.stem + pos_block.suffix;
      formatted_translation += word + '</div> <!-- fahm-word -->';

      formatted_translation += '<div class="fahm-combinations">';
      var fahm_combinations = [];
      pos_block.compatibleCombinations.forEach(function(combination) {
        var fahm_combination = "";
        var vocalizedWord = combination.prefix[1] + combination.stem[1] + combination.suffix[1];
        fahm_combination += '<table class="fahm-combinations-header"><tbody><tr><td class="fahm-vocalized-word">' + vocalizedWord + '</td>';
        if (combination.prefix[1] !== "" || combination.suffix[1] !== "") {
          fahm_combination += '<td class="fahm-separated-word">'
          if (combination.prefix[1] !== "") {
            fahm_combination += combination.prefix[1] + " + ";
          }
          fahm_combination += combination.stem[1];
          if (combination.suffix[1] !== "") {
            fahm_combination += " + " + combination.suffix[1];
          }
          fahm_combination += '</td> <!-- fahm-separated-word -->';
        }
        fahm_combination += '<td class="fahm-stem-root">';
        fahm_combination += combination.stem[4];
        fahm_combination += '</td> <!-- fahm-stem-root -->';
        fahm_combination += '</tr></tbody></table>';

        fahm_combination += '<table class="fahm-stem"><tbody><tr>';
        fahm_combination += '<td class="fahm-stem-category">';
        fahm_combination += categories[combination.stem[2]] || combination.stem[2];
        fahm_combination += '</td> <!-- fahm-stem-category -->';
        fahm_combination += '<td class="fahm-stem-english">';
        fahm_combination += combination.stem[3];
        fahm_combination += '</td> <!-- fahm-stem-english -->';
        fahm_combination += "</tr></tbody></table> <!-- fahm-stem -->";
        fahm_combinations.push(fahm_combination);
      });
      formatted_translation += fahm_combinations.join('');
      formatted_translation += '</div> <!-- fahm-combinations -->';

      formatted_translation += '</div> <!-- fahm-entry -->';
      formatted_translations.push(formatted_translation);
    });
    return '<div class="' + css_class + '">' + formatted_translations.join("<hr>") + '</div>';
  }
  else {
    return '<div class="' + css_class + '">' + TransOver.escape_html(translation) + '</div>';
  }
}

TransOver.escape_html = function(text) {
  return text.replace(XRegExp("(<|>|&)", 'g'), function ($0, $1) {
      switch ($1) {
        case '<': return "&lt;";
        case '>': return "&gt;";
        case '&': return "&amp;";
      }
  });
}

TransOver.regexp_escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
