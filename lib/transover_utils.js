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

// TODO use handlebars or something
TransOver.formatTranslation = function(translation) {
  var formatted_translation = '',
      css_class = 'pos_translation';

  if (translation instanceof Array) {
    formatted_translation += '<div class="' + css_class + '"><table><tbody><tr>';
    translation.forEach(function(pos_block) {
        formatted_translation += '<td class="fahm-vocalized rtl">' + pos_block.vocalized + '</td><td class="fahm-translation">' + pos_block.translation + '</td><td class="fahm-stem rtl">' + pos_block.stem + '</td><td class="fahm-type">' + pos_block["type-human"] + '</td><td class="fahm-verb-form">';
        formatted_translation += TransOver.toRomanNumberals(pos_block["verb-form"]);
        formatted_translation += "</td>";
        var options = pos_block.options;
        formatted_translation += '<td class="fahm-prefixes-suffixes">';
        if (options) {
          if (options.wa) formatted_translation += " و";
          if (options.li) formatted_translation += " لـ";
          if (options.bi) formatted_translation += " بـ";
          if (options.el) formatted_translation += " الـ";
          if (options.ah) formatted_translation += " ة";
          if (options.aat) formatted_translation += " ات";
          if (options.ya) formatted_translation += " يـ";
          if (options.ta) formatted_translation += " تـ";
          if (options.sa) formatted_translation += " سـ";
        }
        formatted_translation += "</td></tr>";
    });
    formatted_translation += "</tbody>";
    formatted_translation += "</table>";
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
