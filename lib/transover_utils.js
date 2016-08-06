TransOver = {};

TransOver.modifierKeys = {
  16: "shift", 17: "ctrl", 18: "alt", 224: "meta", 91: "command", 93: "command", 13: "Return"
};

function getCategory(combination) {
  var category = "";
  var pos = combination.stem[4];
  var cat = combination.stem[2];
  var gloss = combination.stem[3];
  var vocalizedWord = combination.stem[1];
  if (pos.length === 0) {
    if (cat === "Pref-0" || cat === "Suff-0") {
      // null prefix or suffix, do nothing
    } else if (cat.startsWith('F')) {
      category = "FUNC_WORD";
    } else if (cat.startsWith('IV')) {
      category = "VERB_IMPERFECT";
    } else if (cat.startsWith('PV')) {
      category = "VERB_PERFECT";
    } else if (cat.startsWith('CV')) {
      category = "VERB_IMPERATIVE";
    } else if (cat.startsWith('N') && /^[A-Z]/.test(gloss)) { // educated guess (99% correct)
      category = "NOUN_PROP";
    } else if (cat.startsWith('N') && vocalizedWord.endsWith("ِيّ")) {
      category = "NOUN"; // (was NOUN_ADJ: some of these are really ADJ's and need to be tagged manually)
    } else if (cat.startsWith('N')) {
      category = "NOUN";
    } else {
      console.error("No category can be deduced for " + vocalizedWord);
    }
    category = category.replace(/_/g, ".").toLowerCase();
  } else {
    for (var i in pos) {
      category += pos[i].replace(/_/g, ".").toLowerCase();
      category += "+";
    }
    category = category.substr(0, category.length-1);
  }
  return category;
}

function showSeparatedWord(prefix, stem, suffix) {
  var out = "";
  if (prefix !== "") {
    out += prefix + " + ";
  }
  out += stem.replace(/ٱ/g, 'ا');
  if (suffix !== "") {
    out += " + " + suffix;
  }
  return out;
}

// TODO use handlebars or something
TransOver.formatTranslation = function(translation) {
  var css_class = 'pos_translation';

  var formatted_translations = [];
  if (translation instanceof Array) {
    translation.forEach(function(pos_block) {
      console.log(pos_block);
      var formatted_translation = '<div class="fahm-entry"><div class="fahm-word">';
      var word = showSeparatedWord(pos_block.prefix, pos_block.stem, pos_block.suffix);
      formatted_translation += word + '</div> <!-- fahm-word -->';

      formatted_translation += '<div class="fahm-combinations">';
      var fahm_combinations = [];
      pos_block.compatibleCombinations.forEach(function(combination) {
        var fahm_combination = "";
        var vocalizedWord = combination.prefix[1] + combination.stem[1].replace(/ٱ/g, 'ا') + combination.suffix[1];
        fahm_combination += '<table class="fahm-combinations-header"><tbody><tr><td class="fahm-vocalized-word">' + vocalizedWord + '</td>';
        if (combination.prefix[1] !== "" || combination.suffix[1] !== "") {
          fahm_combination += '<td class="fahm-separated-word">'
          fahm_combination += showSeparatedWord(combination.prefix[1], combination.stem[1], combination.suffix[1]);
          fahm_combination += '</td> <!-- fahm-separated-word -->';
        }
        fahm_combination += '<td class="fahm-stem-root">';
        fahm_combination += combination.stem[5];
        fahm_combination += '</td> <!-- fahm-stem-root -->';
        fahm_combination += '</tr></tbody></table>';

        fahm_combination += '<table class="fahm-stem"><tbody><tr>';
        fahm_combination += '<td class="fahm-stem-category">';
        fahm_combination += getCategory(combination);
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
