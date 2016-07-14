TransOver = {};

TransOver.modifierKeys = {
  16: "shift", 17: "ctrl", 18: "alt", 224: "meta", 91: "command", 93: "command", 13: "Return"
};

TransOver.toRomanNumberals = function(integer) {
  if (isNaN(integer) || integer === null) return "";
  else {
    var lookUpTable = {1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII"};
    var romanNumeral = lookUpTable[integer];
    if (typeof romanNumeral !== "undefined") {
      return romanNumeral;
    } else {
      console.warn("Unexpected verb form number: " + integer);
      return "";
    }
  }
}

var categories = {};
$.getJSON(chrome.extension.getURL('/data/categories.json'), function(contents) {
  categories = contents;
});

// TODO use handlebars or something
TransOver.formatTranslation = function(translation) {
  var formatted_translation = '',
      css_class = 'pos_translation';

  if (translation instanceof Array) {
    formatted_translation += '<div class="' + css_class + '">';
    translation.forEach(function(pos_block) {
      formatted_translation += '<div class="fahm-entry"><div class="fahm-word">';
      var word = pos_block.prefix + pos_block.stem + pos_block.suffix;
      formatted_translation += word + '</div> <!-- fahm-word -->';

      formatted_translation += '<div class="fahm-combinations">';
      pos_block.compatibleCombinations.forEach(function(combination) {
        var vocalizedWord = combination.prefix[1] + combination.stem[1] + combination.suffix[1];
        formatted_translation += '<table class="fahm-combinations-header"><tbody><tr><td class="fahm-vocalized-word">' + vocalizedWord + '</td>';
        if (combination.prefix[1] !== "" || combination.suffix[1] !== "") {
          formatted_translation += '<td class="fahm-separated-word">'
          if (combination.prefix[1] !== "") {
            formatted_translation += combination.prefix[1] + " + ";
          }
          formatted_translation += combination.stem[1];
          if (combination.suffix[1] !== "") {
            formatted_translation += " + " + combination.suffix[1];
          }
          formatted_translation += '</td> <!-- fahm-separated-word -->';
        }
        formatted_translation += '<td class="fahm-stem-root">';
        formatted_translation += combination.stem[4];
        formatted_translation += '</td> <!-- fahm-stem-root -->';
        formatted_translation += '</tr></tbody></table>';

        formatted_translation += '<table class="fahm-stem"><tbody><tr>';
        formatted_translation += '<td class="fahm-stem-category">';
        formatted_translation += categories[combination.stem[2]] || combination.stem[2];
        formatted_translation += '</td> <!-- fahm-stem-category -->';
        formatted_translation += '<td class="fahm-stem-english">';
        formatted_translation += combination.stem[3];
        formatted_translation += '</td> <!-- fahm-stem-english -->';
        formatted_translation += "</tr></tbody></table> <!-- fahm-stem -->";

      });
      formatted_translation += '</div> <!-- fahm-combinations -->';

      formatted_translation += '</div> <!-- fahm-entry --> <hr>'
    });
    formatted_translation += '</div>';
  }
  else {
    formatted_translation = '<div class="' + css_class + '">' + TransOver.escape_html(translation) + '</div>';
  }

  return formatted_translation;
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
