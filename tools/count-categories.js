#!/usr/bin/env node

var fs = require('fs');
var prefixes = JSON.parse(fs.readFileSync('../data/dictprefixes.json', 'utf8'));
var stems = JSON.parse(fs.readFileSync('../data/dictstems.json', 'utf8'));
var suffixes = JSON.parse(fs.readFileSync('../data/dictsuffixes.json', 'utf8'));


var categories = {};

for (var i = 0; i < stems.length; i++) {
  for (var j in stems[i][4]) {
    var category = stems[i][4][j];
    categories[category] = "";
  }
}
for (var i = 0; i < prefixes.length; i++) {
  for (var j in prefixes[i][4]) {
    var category = prefixes[i][4][j];
    categories[category] = "";
  }
}
for (var i = 0; i < suffixes.length; i++) {
  for (var j in suffixes[i][4]) {
    var category = suffixes[i][4][j];
    categories[category] = "";
  }
}
fs.writeFileSync("categories.json", JSON.stringify(categories, null, 4));
