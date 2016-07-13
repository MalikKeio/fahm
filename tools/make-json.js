#!/usr/bin/env node
var fs = require('fs');

function makeTable(filename) {
  fs.readFile(filename, 'utf8', function(err, contents) {
    var lines = contents.split('\r\n');
    var contentLines = lines.filter(function(line) {
      return line.length !== 0 && !line.startsWith(';');
    });
    var table = [];
    contentLines.forEach(function(line) {
      var parts = line.split(' ');
      table.push(parts);
    })
    fs.writeFile('../data/' + filename + '.json', JSON.stringify(table), function(err) {
       if (err) throw err;
       console.log(filename +" saved");
    });
  });
}

makeTable('tableab');
makeTable('tableac');
makeTable('tablebc');

var _toAbjad = {"'": "ء", "|": "آ", ">": "أ", "&": "ؤ", "<": "إ", "}": "ئ",
        "A": "ا", "b": "ب", "p": "ة", "t": "ت", "v": "ث", "j": "ج", "H": "ح",
        "x": "خ", "d": "د", "*": "ذ", "r": "ر", "z": "ز", "s": "س", "$": "ش",
        "S": "ص", "D": "ض", "T": "ط", "Z": "ظ", "E": "ع", "g": "غ", "_": "ـ",
        "f": "ف", "q": "ق", "k": "ك", "l": "ل", "m": "م", "n": "ن", "h": "ه",
        "w": "و", "Y": "ى", "y": "ي", "F": "ً", "N": "ٌ", "K": "ٍ", "a": "َ",
        "u": "ُ", "i": "ِ", "~": "ّ", "o": "ْ", "`": "ـٰ", "{": "ٱ", "P": "پ",
        "J": "چ", "V": "ڤ", "G": "گ"}

function toAbjad(str) {
    abjadString = "";
    for(var i = 0; i < str.length; i++) {
        var newChar = _toAbjad[str[i]];
        if (typeof newChar !== "undefined") {
            abjadString += newChar;
        } else {
            throw "Unknown char: " + str[i];
        }
    }
    return abjadString;
}
var stems = {};
// get stems
function getAbjadStem(abcStem) {
  var stem = "";
  for (var i = 0; i < abcStem.length; i++) {
    stem += toAbjad(abcStem[i]);
    if ( i !== abcStem.length - 1) {
      stem += " ";
    }
  }
  return stem;
}
var aratoolsFile = fs.readFileSync("stems.x", 'utf8');
var lines = aratoolsFile.split('\n');
var contentLines = lines.filter(function(line) {
  return line.length !== 0 && !line.startsWith(';');
});
for (var i = 0; i < contentLines.length; i++) {
  var parts = contentLines[i].split("\t");
  try {
    var word = toAbjad(parts[1]);
    var id = word + ":" + parts[3];
    var stem = getAbjadStem(parts[10]);
    if (stems[id] !== stem) {
      stems[id] = stem;
    } else if (stem !== "") {
      console.warn('Stem "' + stem + '" found twice with different words at ID: ' + id);
    }
  } catch(e) {
    console.log("Error on line: " + contentLines[i]);
    throw e;
  }
}
function makeDict(filename, withStem) {
  fs.readFile(filename, 'utf8', function(err, contents) {
    var lines = contents.split('\r\n');
    var contentLines = lines.filter(function(line) {
      return line.length !== 0 && !line.startsWith(';');
    });
    var table = [];
    contentLines.forEach(function(line) {
      var parts = line.split('\t');
      try {
          var word = toAbjad(parts[0]);
          // Remove <pos>...</pos>
          var posIndex = parts[3].indexOf('<pos>');
          if (posIndex > -1) {
            var newGloss = parts[3].substr(0, posIndex).trim();
            if (newGloss !== "") parts[3] = newGloss;
          }

          var entry = [word, toAbjad(parts[1]), parts[2], parts[3]];
          if (withStem) {
            entry.push(stems[word + ":" + parts[2]]);
          }
          table.push(entry);
      } catch(e) {
        console.log("Error on line: " + line);
        throw e;
      }
    })
    fs.writeFile('../data/' + filename + '.json', JSON.stringify(table), function(err) {
       if (err) throw err;
       console.log(filename +" saved");
    });
  });
}
makeDict("dictprefixes");
makeDict("dictstems", true);
makeDict("dictsuffixes");
