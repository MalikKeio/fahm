**********************************************************************
BUCKWALTER ARABIC MORPHOLOGICAL ANALYZER                    README.TXT
Portions (c) 2002 QAMUS LLC (www.qamus.org),
(c) 2002 Trustees of the University of Pennsylvania

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation version 2.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details (../gpl.txt).

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

You can contact LDC by sending electronic mail to: ldc@ldc.upenn.edu
or by writing to:
                Linguistic Data Consortium
                3600 Market Street
                Suite 810
                Philadelphia, PA, 19104-2653, USA.

**********************************************************************

This document describes the components of the Buckwalter Arabic Morphological Analyzer, including the morphology analysis algorithm.

Files included with this document:

* Three lexicon files: dictPrefixes, dictStems, and dictSuffixes.
* Three compatibility tables: tableAB, tableAC, and tableBC.
* Perl code (AraMorph.pl) that makes use of the three lexicon files and three compatibility tables in order to perform morphological analysis and POS-tagging of Arabic words
* Documentation (this readme.txt file)


**********************************************************************
CONTENTS
**********************************************************************
1. Description of the three lexicon files
2. Description of the three compatibility tables
3. Description of the morphology analysis algorithm
4. A review of stem morphological categories
5. Miscellaneous observations
Appendix: Buckwalter transliteration




**********************************************************************
1. DESCRIPTION OF THE THREE LEXICON FILES
**********************************************************************

Each entry in the three lexicon files consists of four tab-delimited fields:
(1) the entry (prefix, stem, or suffix) WITHOUT short vowels and diacritics
(2) the entry (prefix, stem, or suffix) WITH    short vowels and diacritics
(3) its morphological category (for controlling the compatibility of prefixes, stems, and suffixes)
(4) its English gloss(es), including selective POS data within tags <pos>...</pos>

Only fields 1 and 3 are required for morphological analysis.

Arabic script data in the lexicons is provided in the Buckwalter transliteration scheme (See below: "BUCKWALTER TRANSLITERATION"). The Perl code implementation accepts input in Arabic Windows encoding (cp1256).


The following is a description of the three lexicon files:

"dictPrefixes" contains all Arabic prefixes and their concatenations. Sample entries:

w	wa	Pref-Wa	and <pos>wa/CONJ+</pos>
f	fa	Pref-Wa	and;so <pos>fa/CONJ+</pos>
b	bi	NPref-Bi	by;with <pos>bi/PREP+</pos>
k	ka	NPref-Bi	like;such as <pos>ka/PREP+</pos>
wb	wabi	NPref-Bi	and + by/with <pos>wa/CONJ+bi/PREP+</pos>
fb	fabi	NPref-Bi	and + by/with <pos>fa/CONJ+bi/PREP+</pos>
wk	waka	NPref-Bi	and + like/such as <pos>wa/CONJ+ka/PREP+</pos>
fk	faka	NPref-Bi	and + like/such as <pos>fa/CONJ+ka/PREP+</pos>
Al	Al	NPref-Al	the <pos>Al/DET+</pos>
wAl	waAl	NPref-Al	and + the        <pos>wa/CONJ+Al/DET+</pos>
fAl	faAl	NPref-Al	and/so + the     <pos>fa/CONJ+Al/DET+</pos>
bAl	biAl	NPref-BiAl	with/by + the                     <pos>bi/PREP+Al/DET+</pos>
kAl	kaAl	NPref-BiAl	like/such as + the                <pos>ka/PREP+Al/DET+</pos>
wbAl	wabiAl	NPref-BiAl	and + with/by the         <pos>wa/CONJ+bi/PREP+Al/DET+</pos>
fbAl	fabiAl	NPref-BiAl	and/so + with/by + the    <pos>fa/CONJ+bi/PREP+Al/DET+</pos>
wkAl	wakaAl	NPref-BiAl	and + like/such as + the  <pos>wa/CONJ+ka/PREP+Al/DET+</pos>
fkAl	fakaAl	NPref-BiAl	and + like/such as + the  <pos>fa/CONJ+ka/PREP+Al/DET+</pos>


"dictSuffixes" contains all Arabic suffixes and their concatenations. Sample entries:

p	ap	NSuff-ap	[fem.sg.]         <pos>+ap/NSUFF_FEM_SG</pos>
ty	atayo	NSuff-tay	two               <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS</pos>
tyh	atayohi	NSuff-tay	his/its two       <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+hu/POSS_PRON_3MS</pos>
tyhmA	atayohimA	NSuff-tay	their two         <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+humA/POSS_PRON_3D</pos>
tyhm	atayohim	NSuff-tay	their two         <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+hum/POSS_PRON_3MP</pos>
tyhA	atayohA	NSuff-tay	its/their/her two <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+hA/POSS_PRON_3FS</pos>
tyhn	atayohin~a	NSuff-tay	their two         <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+hun~a/POSS_PRON_3FP</pos>
tyk	atayoka	NSuff-tay	your two          <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+ka/POSS_PRON_2MS</pos>
tyk	atayoki	NSuff-tay	your two          <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+ki/POSS_PRON_2FS</pos>
tykmA	atayokumA	NSuff-tay	your two          <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+kumA/POSS_PRON_2D</pos>
tykm	atayokum	NSuff-tay	your two          <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+kum/POSS_PRON_2MP</pos>
tykn	atayokun~a	NSuff-tay	your two          <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+kun~a/POSS_PRON_2FP</pos>
ty	atay~a	NSuff-tay	my two            <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+ya/POSS_PRON_1S</pos>
tynA	atayonA	NSuff-tay	our two           <pos>+atayo/NSUFF_FEM_DU_ACCGEN_POSS+nA/POSS_PRON_1P</pos>


"dictStems" contains all Arabic stems. Sample entries:

;--- ktb
;; katab-u_1
ktb	katab	PV	write
ktb	kotub	IV	write
ktb	kutib	PV_Pass	be written;be fated;be destined
ktb	kotab	IV_Pass_yu	be written;be fated;be destined
;; kAtab_1
kAtb	kAtab	PV	correspond with
kAtb	kAtib	IV_yu	correspond with
;; >akotab_1
>ktb	>akotab	PV	dictate;make write
Aktb	>akotab	PV	dictate;make write
ktb	kotib	IV_yu	dictate;make write
ktb	kotab	IV_Pass_yu	be dictated
;

;; kitAb_1
ktAb	kitAb	Ndu	book
ktb	kutub	N	books
;; kitAboxAnap_1
ktAbxAn	kitAboxAn	NapAt	library;bookstore
ktbxAn	kutuboxAn	NapAt	library;bookstore
;; kutubiy~_1
ktby	kutubiy~	Ndu	book-related
;; kutubiy~_2
ktby	kutubiy~	Ndu	bookseller
ktby	kutubiy~	Nap	booksellers     <pos>kutubiy~/NOUN</pos>
;; kut~Ab_1
ktAb	kut~Ab	N	kuttab (village school);Quran school
ktAtyb	katAtiyb	Ndip	kuttab (village schools);Quran schools
;; kutay~ib_1
ktyb	kutay~ib	NduAt	booklet
;; kitAbap_1
ktAb	kitAb	Nap	writing
;; kitAbap_2
ktAb	kitAb	Napdu	essay;piece of writing
ktAb	kitAb	NAt	writings;essays
;; kitAbiy~_1
ktAby	kitAbiy~	N-ap	writing;written     <pos>kitAbiy~/ADJ</pos>
;; katiybap_1
ktyb	katiyb	Napdu	brigade;squadron;corps
ktA}b	katA}ib	Ndip	brigades;squadrons;corps
ktA}b	katA}ib	Ndip	Phalangists
;; katA}ibiy~_1
ktA}by	katA}ibiy~	Nall	brigade;corps     <pos>katA}ibiy~/NOUN</pos>
ktA}by	katA}ibiy~	Nall	brigade;corps     <pos>katA}ibiy~/ADJ</pos>
;; katA}ibiy~_2
ktA}by	katA}ibiy~	Nall	Phalangist     <pos>katA}ibiy~/NOUN</pos>
ktA}by	katA}ibiy~	Nall	Phalangist     <pos>katA}ibiy~/ADJ</pos>
;; makotab_1
mktb	makotab	Ndu	bureau;office;department
mkAtb	makAtib	Ndip	bureaus;offices
;; makotabiy~_1
mktby	makotabiy~	N-ap	office     <pos>makotabiy~/ADJ</pos>
;; makotabap_1
mktb	makotab	NapAt	library;bookstore
mkAtb	makAtib	Ndip	libraries;bookstores



The POS information of each entry is made explicit for all entries only in the lexicons of Prefixes and Suffixes. The POS information for each entry in the lexicon of Stems is assigned when the lexicon is read into memory, on the basis of each entry's morphological category. Here is the actual code for that:

if     ($cat  =~ m/^(Pref-0|Suff-0)$/) {$POS = ""} # null prefix or suffix
elsif  ($cat  =~ m/^F/)                {$POS = "$voc/FUNC_WORD"}
elsif  ($cat  =~ m/^IV/)               {$POS = "$voc/VERB_IMPERFECT"}
elsif  ($cat  =~ m/^PV/)               {$POS = "$voc/VERB_PERFECT"}
elsif  ($cat  =~ m/^CV/)               {$POS = "$voc/VERB_IMPERATIVE"}
elsif (($cat  =~ m/^N/)
  and ($gloss =~ m/^[A-Z]/))           {$POS = "$voc/NOUN_PROP"} # educated guess (99% correct)
elsif (($cat  =~ m/^N/)
  and  ($voc  =~ m/iy~$/))             {$POS = "$voc/NOUN"} # (was NOUN_ADJ: some of these are really ADJ's and need to be tagged manually)
elsif  ($cat  =~ m/^N/)                {$POS = "$voc/NOUN"}
else                                   { die "no POS can be deduced in $filename (line $.) "; };

Explicit POS information is needed in the lexicon of Stems in cases where the above algorithm would produce an incorrect or vague POS assignment. Typically this applies to Function Words that are assigned tags such as PREP, ADV, CONJ, INTERJ, DEM_PRON, and NEG_PART, instead of the vague POS tag FUNC_WORD.

A 6th field of information is the unique Lemma ID, currently stored in the lexicon of Stems as a quasi-comment line (with two semicolons):

;; katab-u_1
;; kAtab_1
;; >akotab_1

;; kitAb_1
;; kitAboxAnap_1
;; kutubiy~_1
;; kutubiy~_2
;; kut~Ab_1
;; kutay~ib_1
;; kitAbap_1
;; kitAbap_2

When the lexicon is loaded into memory we extract the lemma ID  and lexicon entries as follows:

      if (m/^;; /)  {  $lemmaID = $';  }
      }
      elsif (m/^;/) {  # comment
      }
      else {           # entry
         ($entry, $voc, $cat, $glossPOS) = split (/\t/, $_);
      }

We subsequently split the English gloss and POS information ($glossPOS) into separate $gloss and $POS data fields. When the lexicon is read into memory the gloss and POS and lemma ID information are stored as the 4th, 5th and 6th fields, respectively, as seen in the following line of code:

   push ( @{ $temp_hash{$entry} }, "$entry\t$voc\t$cat\t$gloss\t$POS\t$lemmaID") ;



**********************************************************************
2. DESCRIPTION OF THE THREE COMPATIBILITY TABLES
**********************************************************************

Each of the three compatibility tables lists pairs of compatible morphological categories:

Compatibility table "tableAB" lists compatible Prefix and Stem morphological categories, such as:

  NPref-Al N
  NPref-Al N-ap
  NPref-Al N-ap_L
  NPref-Al N/At
  NPref-Al N/At_L
  NPref-Al N/ap
  NPref-Al N/ap_L

Compatibility table "tableAC" lists compatible Prefix and Suffix morphological categories, such as:

  NPref-Al Suff-0
  NPref-Al NSuff-u
  NPref-Al NSuff-a
  NPref-Al NSuff-i
  NPref-Al NSuff-An
  NPref-Al NSuff-ayn

Compatibility table "tableBC" lists compatible Stem and Suffix morphological categories, such as:

  PV PVSuff-a
  PV PVSuff-ah
  PV PVSuff-A
  PV PVSuff-Ah
  PV PVSuff-at
  PV PVSuff-ath

In the above examples, Prefix category "NPref-Al" is listed as being compatible with Stem categories "N", "N-ap", and "N-ap_L", and Suffix categories "Suff-0", "NSuff-u", etc. Morphological category pairs that are not listed in the compatibility tables (e.g. "NPref-Al PVSuff-a") are simply incompatible.


**********************************************************************
3. DESCRIPTION OF THE MORPHOLOGY ANALYSIS ALGORITHM
**********************************************************************

The algorithm performs the following functions:
 - tokenization
 - word segmentation
 - dictionary lookup
 - compatibility check
 - analysis report
 - second lookup (orthographic variants)

------------
TOKENIZATION

In order to function with ordinary Arabic text the current algorithm performs some very basic tokenization. Arabic words are defined as one or more contiguous Arabic characters. Non-Arabic strings are split on white space and left unanalyzed.

Ideally, tokenization should take place outside the morphology analysis module, primarily because we believe that the nature of Arabic orthography calls for a statistical analysis of the entire input text in order to determine the best tokenization strategy. The analysis should identify and deal with potential problems such as:

1. use of the letter ra' (U+0631) is as numeric comma
2. use of the Arabic-Indic digit zero (U+0660) as punctuation
3. confusion of word-final ya' (U+064A) and alif maqsura (U+0649)
3. confusion of word-final ha' (U+0647) and ta' marbuta (U+0629)

-----------------
WORD SEGMENTATION

Arabic words are segmented into prefix, stem and suffix strings according to the following rules:

  - the prefix can be 0 to 4 characters long
  - the stem can be 1 to infinite characters long
  - the suffix can be 0 to 6 characters long

Given these rules, the input word is segmented into a finite number of 3-part segments: prefix, stem, and suffix. For example, the following are the possible segmentation of the world "wAlgAz":

	wAlgAz
	wAlgA	z
	wAlg	Az
	wAl	gAz
	wA	lgAz
	w	AlgAz
w	AlgAz
w	AlgA	z
w	Alg	Az
w	Al	gAz
w	A	lgAz
wA	lgAz
wA	lgA	z
wA	lg	Az
wA	l	gAz
wAl	gAz
wAl	gA	z
wAl	g	Az
wAlg	Az
wAlg	A	z

-----------------
DICTIONARY LOOKUP

Dictionary lookup consists of asking, for each segmentation:

  does the prefix exist? (in the hash table of prefixes)
  does the stem exist? (in the hash table of stems)
  does the suffix exist? (in the hash table of suffixes)

If all three components (prefix, stem, suffix) are found in their respective hash tables, the next step is to determine whether their respective morphological categories are compatible.

-------------------
COMPATIBILITY CHECK

For each of the three components (prefix, stem, suffix) the compatibily check asks:

  is prefix category A compatible with the stem category B? (does the pair exist in hash table AB?)
  is prefix category A compatible with suffix category B? (does the pair exist in hash table AC?)
  is stem category B compatible with suffix category C? (does the pair exist in hash table BC?)

If all three pairs are found in their respective tables, the three components are compatible and the word is valid.

---------------
ANALYSIS REPORT


INPUT STRING: ������
LOOK-UP WORD: wAlgAz
  SOLUTION 1: (wa>alogAz) wa/CONJ+>alogAz/NOUN
     (GLOSS): and + mysteries/enigmas/riddles +
  SOLUTION 2: (waAlgAz) wa/CONJ+Al/DET+gAz/NOUN
     (GLOSS): and + the + gas +

Solution #1 was found to be valid because:

1. All 3 components "w+AlgAz+(null)" exist in their respective lexicons:

   w	wa	Pref-Wa	and <pos>wa/CONJ+</pos>
   AlgAz	>alogAz	N	mysteries;enigmas;riddles
		Suff-0

2. The morphological categories of all 3 components are listed as compatible pairs in the relevant compatibility tables:

   Pref-Wa N        (in "tableAB")
   N Suff-0         (in "tableBC")
   Pref-Wa Suff-0   (in "tableAC")

Solution #2 was found to be valid because:

1. All 3 components "wAl+gAz+(null)" exist in their respective lexicons:

   wAl	waAl	NPref-Al	and + the        <pos>wa/CONJ+Al/DET+</pos>
   gAz	gAz	Ndu	gas
		Suff-0

2. The morphological categories of all 3 components are listed as compatible pairs in the relevant compatibility tables:

   NPref-Al Ndu     (in "tableAB")
   Ndu Suff-0       (in "tableBC")
   NPref-Al Suff-0  (in "tableAC")

Note that the stem "gAz" actually occurs several times in the lexicon:

   gAz	gAz	Ndu	gas
   gAz	gAz	NAt	gasses
   gAz	gAz	NK	invader;raider;aggressor
   gAz	gAz	Nuwn_Niyn	invader;raider;aggressor

The stems that are not accepted as valid have morphological categories that are not listed as compatible pairs in at least one of the compatibility tables. Specifically, the following pairs are not listed as compatible:

   NAt Suff-0    (not listed in "tableBC")
   NPref-Al NK   (not listed in "tableAB")

The morphological categories "Ndu", "NAt", "NK", and "Nuwn_Niyn" are a form of mnemonic notation representing the inflectional suffixation properties of the noun stem in question. "Ndu", for example, means that the noun stem takes the dual suffixes -Ani and -ayni, and "NAt", means that it takes the plural suffix -At. "NK" means that the noun stem takes the suffix -K (kasratAn), and "Nuwn_Niyn" means that it takes the suffixes -uwna and -iyna.

For more details see below: A REVIEW OF STEM MORPHOLOGICAL CATEGORIES.

------------------------------------
SECOND LOOKUP (ORTHOGRAPHIC VARIANTS)

When a word returns no analysis we check the orthography of the input string and create a list of alternate spellings based on the following hypotheses:

  - word final  Y' should be y'
  - word final  Y' should be }
  - word final  y' should be }
  - word final  Y  should be y
  - word final  y  should be Y
  - word final  h  should be p
  - word medial w' should be &
  - word medial Y  should be y

Here is an example of output with Second Lookup:

INPUT STRING: ������
LOOK-UP WORD: mw'AtY
     Comment: mw'AtY NOT FOUND
 ALTERNATIVE: mw'Aty
     Comment: mw'Aty NOT FOUND
 ALTERNATIVE: m&Aty
  SOLUTION 1: (mu&Atiy) mu&Atiy/NOUN
     (GLOSS):  + favorable/suitable +

Currently, Second Lookup is invoked only when first lookup fails. Ideally, a list of alternate orthographic forms would be built during Tokenization (based on a statistical analysis of the input text), in which case Second Lookup would be invoked based on the level of confidence one has in the orthography of the input text. Currently the input word "Ely" is analyzed as the proper noun "Ali", even in cases where the context clearly shows that it was a typo for the preposition "ElY". If our level of confidence is low we would invoke Second Lookup for all words ending in ya' or alif maqsura, regardless of whether they are found or not.



**********************************************************************
4. A REVIEW OF STEM MORPHOLOGICAL CATEGORIES
**********************************************************************

Each Arabic stem is assigned a morphological category using a form of mnemonic notation (N, Ndu, NduAt, Nprop, PV, IV, FW, FW-Wa, FW-WaBi, etc.) that denotes both the basic POS classification (Noun, Verb, or Function Word) and the set of prefixes and suffixes that can be attached to that stem (i.e. whose morphological category is compatible with that of the stem). This review covers the morphological categories of the following stem groups:

 - Function Word stems
 - Noun stems
 - Noun stems: special cases
 - Verb stems
 - Verb stems: special cases

-------------------
FUNCTION WORD STEMS

Function words (i.e., "particles", pronouns, and other words that do not function as Nouns or Verbs) fall into two broad categories: those that accept only the prefix conjunctions wa- and fa- (e.g., wa-huwa, fa-min) and those that accept these conjunctions as well as the prepositions bi- and li- (e.g., wa-li->ay~, fa-bi-man). The mnemonic morphological categories we use to distinguish these two types of functions words are, respectively, "FW-Wa" and "FW-WaBi". A third category, "FW", is used for words that take no prefix at all, such as interjections and abbreviations, but also proper names that occur as the second word in multi-word names (e.g. laHom, the 2nd word in "bayot laHom).

Note that the prefixes bi- and li- attach directly to pronoun suffixes -hu -hum, etc., with no intervening stem. These combinations are entered directly as Function Words in the lexicon of stems. Examples:

   bh	bihi	FW-Wa	with/by + it/him           <pos>bi/PREP+hi/PRON_3MS</pos>
   bhmA	bihimA	FW-Wa	with/by + them both        <pos>bi/PREP+himA/PRON_3D</pos>
   bhA	bihA	FW-Wa	with/by + it/them/her      <pos>bi/PREP+hA/PRON_3FS</pos>
   bhm	bihim	FW-Wa	with/by + them [masc.pl.]  <pos>bi/PREP+him/PRON_3MP</pos>

   lh	lahu	FW-Wa	to/for + it/him (it/he has)                   <pos>la/PREP+hu/PRON_3MS</pos>
   lhmA	lahumA	FW-Wa	to/for + them both (they both have)           <pos>la/PREP+humA/PRON_3D</pos>
   lhA	lahA	FW-Wa	to/for + it/them/her (it/she has, they have)  <pos>la/PREP+hA/PRON_3FS</pos>
   lhm	lahum	FW-Wa	to/for + them [masc.pl.] (they have)          <pos>la/PREP+hum/PRON_3MP</pos>

----------
NOUN STEMS

The morphological categories assigned to noun stems are mnemonic notation representing the inflectional suffixation properties of the noun stem in question. "Ndu", for example, means that the noun stem takes the dual suffixes -Ani and -ayni, and "NAt", means that it takes the plural suffix -At. The following is a summary of the main noun stem morphological categories.

"Nall" denotes nouns whose base form is masculine singular, and that allow for all possible inflectional suffixes. Typically these are nisbah adjectives modifying rational entities (e.g., lugawiy~, lubonAniy~), and active participles of all triliteral and quadriliteral forms (occasionally excluding triliteral Form I) provided that these denote rational entities (e.g., murAsil, qAdir, mutarojim, muToma}in~).

Summary: Noun stems with inflectional category "Nall" can take all noun inflectional suffixes:
  masc.du. (-Ani, -ayoni,-A, -ayo)
  masc.pl. (-uwna, -iyna, -uw, -iy)
  fem.sg. (-ap)
  fem.du. (-atAni,-atayoni,-atA,-atayo)
  fem.pl. (-At)

"N/ap" denotes nouns whose base form is masculine singular, and that allow for all possible inflectional suffixes except for the masculine plural. This suffixation category is typical of nouns having the triliteral pattern faEiyl, which often is used attributively and applied to rational entities, and normally take a broken plural for the masculine and a feminine plural for the feminine. Examples: jadiyd (pl. judud, jadiyd-At), kariym (pl. kirAm, kariym-At).

Summary: Noun stems with inflectional category "N/ap" can take all possible inflectional suffixes except for the masculine plural:
  masc.du. (-Ani, -ayoni,-A, -ayo)
  fem.sg. (-ap)
  fem.du. (-atAni,-atayoni,-atA,-atayo)
  fem.pl. (-At)

"N-ap" denotes nouns whose base form is masculine singular, and that allow for all possible inflectional suffixes except for the masculine plural and the feminine plural. Typically these are nisbah adjectives--or nouns functioning as adjectives--modifying non-rational entities. Examples: mufahoras, taEoliymiy~.

Summary: Noun stems with inflectional category "N-ap" can take all possible inflectional suffixes except for the masculine plural and the feminine plural:
  masc.du. (-Ani, -ayoni,-A, -ayo)
  fem.sg. (-ap)
  fem.du. (-atAni,-atayoni,-atA,-atayo)

"NduAt" denotes nouns that are masculine singular in their base form, and that inflect for the dual masculine and feminine plural. Typically these are the countable verbal nouns of triliteral and quadriliteral derived forms. Examples: taloxiyS, liqA', AimotiHAn.

Summary: Noun stems with inflectional category "NduAt" take only the inflectional suffixes of the masculine dual and the feminine plural:
  masc.du. (-Ani, -ayoni,-A, -ayo)
  fem.pl. (-At)

"Ndu" denotes nouns whose base form is masculine singular, and that allow inflection for the dual. Nouns of this inflectional category take broken plurals. Examples: masokan, lafoZ, kitAb.

Summary: Noun stems with inflectional category "Ndu" take only the inflectional suffixes of the masculine dual:
  masc.du. (-Ani, -ayoni,-A, -ayo)

"N/At" denotes nouns that are masculine singular in their base form, and that inflect for the feminine plural but not for the masculine dual. Typically these are the "semi-countable" verbal nouns of triliteral and quadriliteral derived forms, and the so-called "plural-of-plural" forms. Examples: taSar~uf, taEAwun, buHuwv. (Note: by "semi-countable" we mean that their use as countable nouns is unattested and improbable.)

Summary: Noun stems with inflectional category "N/At" take only the inflectional suffixes of the feminine plural:
  fem.pl. (-At)

"N" denotes nouns that do not inflect for number. Typically these are verbal nouns of verb form I (e.g., tarok, HuSuwl) and triptote broken plurals (e.g., suk~An, $uEuwb).

Summary: Noun stems with inflectional category "N" do not take inflectional suffixes.

"NapAt" denotes nouns whose base form is feminine singular, and that allow inflection for the feminine dual and the feminine plural. Nouns of this inflectional category rarely take broken plurals. Examples: laHoZ-ap, >usor-ap, mubAdal-ap.

Summary: Noun stems with inflectional category "NapAt" take only the inflectional suffixes of the feminine singular, dual and plural:
  fem.sg. (-ap)
  fem.du. (-atAni,-atayoni,-atA,-atayo)
  fem.pl. (-At)

"Napdu" denotes nouns whose base form is feminine singular, and that allow inflection for the dual, but not the feminine plural. Nouns of this inflectional category take broken plurals. Examples: <ujor-ap, maso>al-ap, gurof-ap.

Summary: Noun stems with inflectional category "Napdu" take only the inflectional suffixes of the feminine singular and plural:
  fem.sg. (-ap)
  fem.pl. (-At)

"Nap" denotes nouns whose base form is feminine singular, and do not inflect for number. Typically they are verbal nouns of triliteral and quadriliteral verb form I (e.g., kitAb-ap, maEorif-ap, sayoTar-ap) and triptote broken plurals (e.g., >alobis-ap, EamAliq-ap).

Summary: Noun stems with inflectional category "Nap" take only the inflectional suffixes of the feminine singular:
  fem.sg. (-ap)

"NAt" denotes nouns that are feminine plural in their base or dictionary citation form, and whose singular form is unattested. Examples: mutaTal~ab-At, muxAbar-At.

Summary: Noun stems with inflectional category "NAt" take only the inflectional suffixes of the feminine plural:
  fem.pl. (-At)

"NF" denotes nouns that acquire an independent lexical meaning when they function as adverbs or interjections by means of the indefinite accusative case marker suffix -AF (fatoHatAn on an alif chair).

Summary: Noun stems with inflectional category "NF" take only the indefinite accusative case marker suffix:
  indef.acc. (-AF)

"Npair" denotes nouns that acquire an independent lexical meaning when inflected for the dual. Hence, they could be said to be dual in their base form. Examples: Al-wAlid-An, Al-rAfid-An.

Summary: Noun stems with inflectional category "Npair" take only the inflectional suffixes of the masculine dual:
  masc.du. (-Ani, -ayoni,-A, -ayo)

"Nel" denotes the masculine elative noun, which typically inflects for the dual only. Examples: >akobar, >ajad~. (Note: all broken plurals are provided via their own entries in the lexicon.)

Summary: Noun stems with inflectional category "Nel" take only the inflectional suffixes of the masculine dual:
  masc.du. (-Ani, -ayoni,-A, -ayo)

"Ndip" denotes diptote nouns. Noun stems associated with this suffixation category include mostly broken plural patterns, such as the triliteral patterns mafAEil (e.g., majAlis) and faEA}il (e.g., qabA}il), and the quadriliteral patterns faEAliyl (e.g., jamAhiyr) and faEAlil (e.g., jamArik).

Summary: Noun stems with inflectional category "Ndip" do not take inflectional suffixes.

"Nprop" denotes proper names, which typically do not inflect nor take possessive pronoun suffixes (e.g., miSor, $ubAT, muHam~ad, jiyhAn). If the proper noun does have a suffix, the latter is concatenated with the stem in the lexicon entry: e.g., EarafAt, Hamozap, mAjidap, Eaboduh).

Summary: Noun stems with inflectional category "Nprop" do not take inflectional suffixes.

"Numb" denotes the inflectional suffixation characteristics of a limited class of nouns associated exclusively with Arabic numerals 20 through 90 (in increments of 10). Examples: xamos-uwna, sit~-uwna.

Summary: Noun stems with inflectional category "Numb" take two suffixes:
  nom. (-uwna)
  gen./acc. (-iyna)

-------------------------
NOUN STEMS: SPECIAL CASES

Noun stems require more detailed morphological categories in two cases:

(1) Noun stems begins with "l" (lam) are compatible with a special subset of prefixes containing the preposition li- and the definite article Al-. These stems take the normal morphological categories outlined above but with an additional mnemonic notation: "N_L", "Ndu_L", "Ndip_L".

(2) Noun stems that end with weak letters hamza or waw/ya' will undergo orthographic change depending on which inflectional suffixes are attached. Each orthographic variant is assigned a morphological category that denotes the set of suffixes allowed for that particular orthographic variant.

  ElmA'	EulamA'	N0_Nh	scholars;scientists
  ElmA&	EulamA&	Nh	scholars;scientists
  ElmA}	EulamA}	Nhy	scholars;scientists

The list of actual suffixes that are compatible with each variant form can be obtained by extracting the suffix categories that are compatible with each stem category (in "tableBC") and looking up those suffix categories in the lexicon of suffixes. For example, a search for "N0_Nh" in "tableBC" extracts:

  N0_Nh Suff-0
  N0_Nh NSuff-u
  N0_Nh NSuff-a
  N0_Nh NSuff-i
  N0_Nh NSuff-h

and a search for "Suff-0", "NSuff-u", "NSuff-a", etc. in "dictSuffixes" extracts:

  		Suff-0
  ;	u	NSuff-u	[def.nom.]     <pos>+u/CASE_DEF_NOM</pos>
  ;	a	NSuff-a	[def.acc.]     <pos>+a/CASE_DEF_ACC</pos>
  ;	i	NSuff-i	[def.gen.]     <pos>+i/CASE_DEF_GEN</pos>
  h	h	NSuff-h	its/his          <pos>+hu/POSS_PRON_3MS</pos>
  hmA	hmA	NSuff-h	their            <pos>+humA/POSS_PRON_3D</pos>
  hm	hm	NSuff-h	their            <pos>+hum/POSS_PRON_3MP</pos>
  hA	hA	NSuff-h	its/their/her    <pos>+hA/POSS_PRON_3FS</pos>
  hn	hn~a	NSuff-h	their            <pos>+hun~a/POSS_PRON_3FP</pos>
  k	ka	NSuff-h	your             <pos>+ka/POSS_PRON_2MS</pos>
  k	ki	NSuff-h	your             <pos>+ki/POSS_PRON_2FS</pos>
  kmA	kumA	NSuff-h	your             <pos>+kumA/POSS_PRON_2D</pos>
  km	kum	NSuff-h	your             <pos>+kum/POSS_PRON_2MP</pos>
  kn	kun~a	NSuff-h	your             <pos>+kun~a/POSS_PRON_2FP</pos>
  nA	nA	NSuff-h	our              <pos>+nA/POSS_PRON_1P</pos>

which means that the stem form EulamA' is compatible with the null suffix, case-ending suffixes -u, -i, -a (which are commented out in the lexicon of suffixes), and the full set of possessive pronoun suffixes, excluding the 1st pers.sg. -iy.

----------
VERB STEMS

Three morphological categories -- "PV" (Perfect Verb), "IV" (Imperfect Verb), and "CV" (Imperative, or Command Verb) -- denote regular verb stems, which are defined as those stems which undergo no orthographic variation and which combine with the full set of unmodified verbal prefixes and suffixes. The best example is the proverbial kataba: the "PV" stem combines with all PV suffixes (katab- -a, -A, -uwA, etc.) and the "IV" stem combines with all Imperfect Verbs prefixes and suffixes (ya-, ta-, na-, >a- -kotub- -Ani, -uwna, etc.). The stems for imperative verb forms have been entered only for a few imperatives in common use, such as xu* (xu*- -o, -iy, -uwA).

Verbs that do not take direct object pronoun suffixes are assigned PV and IV morphological categories with the text "_intr" added. Examples: "PV_intr", "IV_intr", and "CV_intr".

Imperfect verbs that take prefixes with the short vowel "u" (yu-, tu-, nu-, >u-) for the active voice are assigned IV morphological categories with the text "_yu" added. Examples: "IV_yu" and "IV_intr_yu".

Verb stems for the passive voice are assigned PV and IV morphological categories with the text "_Pass" added. Examples: "PV_Pass" and "IV_Pass_yu".

-------------------------
VERB STEMS: SPECIAL CASES

Perfect Verb stems require more detailed morphological categories in several cases:

PV stems ending in "n" (e.g. barohan-, {ixotazan-) combine with a special set of PV suffixes that begin with assimilated "n": barohan-~a (i.e., barohan-na), and barohan-~A (i.e., barohan-nA). The mnemonic notation for these stems is "PV-n".

PV stems ending in "t" (e.g. vab~at-, {ilotafat-) combine with a special set of PV suffixes that begin with assimilated "t": vab~at-~u (i.e., vab~at-tu), vab~at-~um (i.e., vab~at-tum), etc. The mnemonic notation for these stems is "PV-t".

Certain verb forms based on hollow and doubled roots have two PV stems: one that combines with PV suffixes that begin with a consonant ("PV_C") and one that combines with PV suffixes that begin with a vowel ("PV_V"). Examples of "PV_V: qAl-/>aHab~- -a, -at, -atA, -A, and -uwA. Examples of "PV_C: qul-/>aHabab- -tu/a/i, -tum, -tumA, tun~a, -na, and -nA.

Stems that would be assigned the "PV_C" category but happen to end in "t" or "n" are assigned categories "PV_Ct" and "PV_Cn" instead. Examples include mut-~u (i.e., mut-tu, from mAt/yamuwt), and janan-~A (i.e., janan-nA).

PV stems ending in ">" (hamza on alif) combine with a reduced set of PV suffixes, and undergo orthographic change for the masc.du. and masc.pl. Note the dictionary entries for bada>-.

  bd>	bada>	PV->	start;begin
  bd|	bada|	PV-|	start;begin
  bd&	bada&	PV_w	start;begin

The stem with category "PV->" combines with PV suffixes -a, -at, -na, -nA, -tu/a/i, and -uwA. (Purists will consider the spelling of bada>-uwA to be incorrect, but because it occurs frequently we consider it a valid orthographic variant.) The stem with category "PV-|" combines with an assimilated version of the masc.du. suffix.: bada|-(null) (i.e., bada>-A). The stem with category "PV-&" combines with the masc.pl. suffix.: bada&-uwA.

Perfect Verb stems for finally-weak verbs undergo orthographic changes, as seen in the following examples taken directly from the lexicon:

  bnY	banaY	PV_0	build;erect
  bnA	banA	PV_h	build;erect
  bny	banay	PV_Atn	build;erect
  bn	ban	PV_ttAw	build;erect

  dEA	daEA	PV_0h	call;invite
  dEw	daEaw	PV_Atn	call;invite
  dE	daE	PV_ttAw	call;invite

  x$y	xa$iy	PV_no-w	fear;be afraid
  x$	xa$	PV_w	fear;be afraid

The morphological categories are represented via mnemonic notation for the various subsets of PV suffixes that are allowed. Stems with category "PV_0", for example, take the PV null suffix. Stems with category "PV_h" take the full set of direct object pronoun suffixs. Stems with category "PV_0h" combine the features of "PV_0" and "PV_h". The details about which PV suffix is compatible with which PV stem can be obtained by searching for the stem category in "tableBC" in order to extract the related suffix categories, and then searching for these suffix categories in the lexicon of suffixes. For example, a search for "PV_no-w" in "tableBC" extracts:

  PV_no-w PVSuff-a
  PV_no-w PVSuff-ah
  PV_no-w PVSuff-A
  PV_no-w PVSuff-Ah
  PV_no-w PVSuff-at
  PV_no-w PVSuff-ath
  PV_no-w PVSuff-n
  PV_no-w PVSuff-nh
  PV_no-w PVSuff-t
  PV_no-w PVSuff-th

and a search for "PVSuff-a", "PVSuff-ah", "PVSuff-A", etc. in "dictSuffixes" will extract the actual suffixes.

Imperfect Verb stems require require more detailed morphological categories (other than "IV") in several cases:

IV stems ending in "n" (e.g. barohan-, {ixotazan-) combine with a special set of IV suffixes that begin with assimilated "n": yu-barohin-~a (i.e., yu-barohin-na). The mnemonic notation for these stems is "IV-n".

IV stems for finally-weak verbs undergo orthographic changes, as seen in the following examples taken directly from the lexicon:

  bny	boniy	IV_0hAnn	build;erect
  bn	bon	IV_0hwnyn	build;erect

  dEw	doEuw	IV_0hAnn	call;invite
  dE	doE	IV_0hwnyn	call;invite

  x$Y	xo$aY	IV_0	fear;be afraid
  x$A	xo$A	IV_h	fear;be afraid
  x$y	xo$ay	IV_Ann	fear;be afraid
  x$	xo$a	IV_0hwnyn	fear;be afraid

The morphological categories denote the various subsets of IV suffixes that are allowed. Stems with category "IV_0", for example, take the IV null suffix. Stems with category "IV_h" take the full set of direct object pronoun suffixs. Stems with category "IV_0hAnn" combine the features of "IV_0" and "IV_h" and take the dual suffix (e.g. ya-boniy-Ani, ya-doEuw-Ani) and the fem.pl suffix (e.g. ya-boniy-na, ya-doEuw-na). The details about which IV suffix is compatible with which IV stem can be obtained by searching for the stem category in "tableBC" in order to extract the related suffix categories, and then searching for these suffix categories in the lexicon of suffixes. For example, a search for "IV_Ann" in "tableBC" extracts:

  IV_Ann IVSuff-A
  IV_Ann IVSuff-Ah
  IV_Ann IVSuff-Ak
  IV_Ann IVSuff-An
  IV_Ann IVSuff-Anh
  IV_Ann IVSuff-Ank
  IV_Ann IVSuff-n
  IV_Ann IVSuff-nh
  IV_Ann IVSuff-nk

and a search for "IVSuff-A", "IVSuff-Ah", "IVSuff-Ak", etc. in "dictSuffixes" will extract the actual suffixes.


**********************************************************************
5. MISCELLANEOUS OBSERVATIONS
**********************************************************************

Topics discussed below:
 - sub-standard orthography
 - short vowels and diacritics
 - noun case endings and verb mood endings

------------------------
SUB-STANDARD ORTHOGRAPHY

The Buckwalter Arabic Morphological Analyzer is being used for POS-tagging a considerable amount of text data, and various orthographic anomalies have been observed in the source text. The author is unsure whether these anomalies should be treated through a Second Lookup feature that is invoked regardless of whether the word is found or not, or whether the lexicon should include additional entries to account for variant "sub-standard" orthography.

Real data shows that ">" (hamza on alif) is a relatively frequent typo for "<" (hamza under alif). For example, numerous occurrences of "qAl ... >n" were found in the text. In order to deal with this problem the author has made additional entries in the stem lexicon and labeled them (in comment lines) as "sub-standard orthography." Examples:

; sub-standard orthography:
  >n	<in~	FW-Wa-n~	that/indeed      <pos><in~/FUNC_WORD</pos>

Note that the output analysis of ">n" now includes "<n":

INPUT STRING: ��
LOOK-UP WORD: >n
  SOLUTION 1: (>an) >an/FUNC_WORD
     (GLOSS):  + to +
  SOLUTION 2: (>an~a) >an~a/FUNC_WORD
     (GLOSS):  + that +
  SOLUTION 3: (<in) <in/FUNC_WORD
     (GLOSS):  + if/whether +
  SOLUTION 4: (<in~a) <in~a/FUNC_WORD
     (GLOSS):  + that/indeed +
  SOLUTION 5: (<in) <in/ABBREV
     (GLOSS):  + N. +

Another example of "sub-standard" orthography is what POS taggers have dubbed "the missing hamza" problem. Stem-initial hamza is typically written as bare alif, and is handled by simple double entry:

  <slAm	<isolAm	N	Islam
  AslAm	<isolAm	N	Islam

But the spelling of stem-medial and stem-final hamza on alif as a bare alif is not standard orthography and is largely avoided because it results in ambiguity. For example, note the pairs bd> / bdA and s>l / sAl. The spelling "tAjyn" (for "t>jyn"), for example, was found to be frequent. In order to deal with this problem the author has made additional entries in the stem lexicon and labeled them (in comment lines) with "AFP missing hamza". Examples:

;; {isota>ojar_1
<st>jr	{isota>ojar	PV	hire;rent
Ast>jr	{isota>ojar	PV	hire;rent
; AFP missing hamza
AstAjr	{isota>ojar	PV	hire;rent
st>jr	sota>ojir	IV	hire;rent

t>jyr	ta>ojiyr	NduAt	leasing;lease
; AFP missing hamza problem
tAjyr	ta>ojiyr	NduAt	leasing;lease

r>Y	ra>aY	PV_0	see;think;believe
; AFP missing hamza problem
rAY	ra>aY	PV_0	see;think;believe


---------------------------
SHORT VOWELS AND DIACRITICS

All short vowels and diacritics are stripped out of the input string and play no part in the current analysis. It has been suggested that short vowels and diacritics could be used in a pattern-matching with the vocalized string of the entry. The following example can be used to devise an algorithm for that:

INPUT STRING: �����
LOOK-UP WORD: EmAn
  SOLUTION 1: (EumAn) EumAn/NOUN_PROP
     (GLOSS):  + Oman +
  SOLUTION 2: (Eam~An) Eam~An/NOUN_PROP
     (GLOSS):  + Amman +
  SOLUTION 3: (Eam~Ani) Eam~/NOUN+Ani/NSUFF_MASC_DU_NOM
     (GLOSS):  + paternal uncle + two

---------------------------------------
NOUN CASE ENDINGS AND VERB MOOD ENDINGS

Following user request, the author made the necessary short-vowel case ending entries in "dictSuffixes" and the appropriate entries in the compatibility tables to account for them, but after the feature was implemented, users requested that the feature be disabled, so the entries in "dictSuffixes" have all been commented out. The entries in the compatibility tables have been left intact, however.

The addition of short vowels serving as mood markers for the Imperfect Verb is not a current priority.




**********************************************************************
APPENDIX: BUCKWALTER TRANSLITERATION
**********************************************************************

(Fields are: Buckwalter transliteration, Arabic Windows, Unicode)

'  C1  U+0621 ARABIC LETTER HAMZA
|  C2  U+0622 ARABIC LETTER ALEF WITH MADDA ABOVE
>  C3  U+0623 ARABIC LETTER ALEF WITH HAMZA ABOVE
&  C4  U+0624 ARABIC LETTER WAW WITH HAMZA ABOVE
<  C5  U+0625 ARABIC LETTER ALEF WITH HAMZA BELOW
}  C6  U+0626 ARABIC LETTER YEH WITH HAMZA ABOVE
A  C7  U+0627 ARABIC LETTER ALEF
b  C8  U+0628 ARABIC LETTER BEH
p  C9  U+0629 ARABIC LETTER TEH MARBUTA
t  CA  U+062A ARABIC LETTER TEH
v  CB  U+062B ARABIC LETTER THEH
j  CC  U+062C ARABIC LETTER JEEM
H  CD  U+062D ARABIC LETTER HAH
x  CE  U+062E ARABIC LETTER KHAH
d  CF  U+062F ARABIC LETTER DAL
*  D0  U+0630 ARABIC LETTER THAL
r  D1  U+0631 ARABIC LETTER REH
z  D2  U+0632 ARABIC LETTER ZAIN
s  D3  U+0633 ARABIC LETTER SEEN
$  D4  U+0634 ARABIC LETTER SHEEN
S  D5  U+0635 ARABIC LETTER SAD
D  D6  U+0636 ARABIC LETTER DAD
T  D8  U+0637 ARABIC LETTER TAH
Z  D9  U+0638 ARABIC LETTER ZAH
E  DA  U+0639 ARABIC LETTER AIN
g  DB  U+063A ARABIC LETTER GHAIN
_  DC  U+0640 ARABIC TATWEEL
f  DD  U+0641 ARABIC LETTER FEH
q  DE  U+0642 ARABIC LETTER QAF
k  DF  U+0643 ARABIC LETTER KAF
l  E1  U+0644 ARABIC LETTER LAM
m  E3  U+0645 ARABIC LETTER MEEM
n  E4  U+0646 ARABIC LETTER NOON
h  E5  U+0647 ARABIC LETTER HEH
w  E6  U+0648 ARABIC LETTER WAW
Y  EC  U+0649 ARABIC LETTER ALEF MAKSURA
y  ED  U+064A ARABIC LETTER YEH
F  F0  U+064B ARABIC FATHATAN
N  F1  U+064C ARABIC DAMMATAN
K  F2  U+064D ARABIC KASRATAN
a  F3  U+064E ARABIC FATHA
u  F5  U+064F ARABIC DAMMA
i  F6  U+0650 ARABIC KASRA
~  F8  U+0651 ARABIC SHADDA
o  FA  U+0652 ARABIC SUKUN
`      U+0670 ARABIC LETTER SUPERSCRIPT ALEF
{      U+0671 ARABIC LETTER ALEF WASLA
P  81  U+067E ARABIC LETTER PEH
J  8D  U+0686 ARABIC LETTER TCHEH
V      U+06A4 ARABIC LETTER VEH
G  90  U+06AF ARABIC LETTER GAF

QAMUS LLC
Tim Buckwalter
7010 NE Dolphin Dr.
Bainbridge Island, WA 98110-1050
timbuckwalter@qamus.org


**********************************************************************
                                END OF FILE
**********************************************************************
