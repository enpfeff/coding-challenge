/**
 * Created by ianpfeffer on 11/4/15.
 * Copyright Netscout 2015
 */

// Sources
var http = require('http');
var _ = require('lodash');

//My Vars
var wordsUrl = 'http://www-01.sil.org/linguistics/wordlists/english/wordlist/wordsEn.txt';

// total time
var total = 0;


//====================================================
//  Main
//====================================================

http.get(wordsUrl, function(res) {
    var start = new Date();
    var temp = '';
    var wordsHash = {};
    var wordsArray = [];

    res.on('data', function(d) {
        temp += d;
    });
    res.on('end', function() {
        markTime('Request took', start);
        start = new Date();

        _.each(temp.split('\r\n'), function(word) {
            if (word) {
                wordsArray.push(word);
                wordsHash[word] = {edges: []}
            }
        });
        markTime('Parsing Took', start);
        wordsHash = parseObject(wordsArray, wordsHash);

        start = new Date();
        wordsArray = sortArrayByWordLength(wordsArray);
        markTime('Sorting took', start);

        start = new Date();
        findInDegrees(wordsArray, wordsHash);
        markTime('Finding max chain took', start);

        console.log('total', total + ' ms');
        process.exit(0);
    });
}).on('error', function(err) {
    console.log('Fatal:  Could not get words File', err);
    process.exit(1);
});

//====================================================
//  Helpers
//====================================================

// sorts array for the algorithm
function sortArrayByWordLength(array) {
    return _.sortBy(array, function(n) {
        return n.length;
    });
}

// mark the time so i can get some metrics
function markTime(msg, start) {
    var time = new Date() - start;
    total += time;
    console.log(msg, time);
}

//recursively look for all permutations of the word
function findAllPermutations(str, index, buffer) {
    // normalize input
    if (typeof str == "string")
        str = str.split("");
    if (index === undefined)
        index = 0;
    if (buffer === undefined)
        buffer = [];

    if (index >= str.length)
    // return array
        return _.uniq(buffer);
    for (var i = index; i < str.length; i++)
        buffer.push(toggleLetters(str, index, i));
    return findAllPermutations(str, index + 1, buffer);
}
// helper for the permutations function
function toggleLetters(str, index1, index2) {
    if (index1 != index2) {
        var temp = str[index1];
        str[index1] = str[index2];
        str[index2] = temp;
    }
    return str.join("");
}

function showChain(array, hash) {
    var ret = _.sortBy(array, function(word) {
        return hash[word].maxLength
    });
}

//====================================================
//  Parsing the words to develop adjancy List
//====================================================

function parseObject(words, hash) {
    var start = new Date();
    _.each(words, function(word) {
        var temp;
        var previousTemp = '';
        var length = word.length;
        if (length > 0) {
            for (var i = 1; i <= length; i++) {
                temp = word.substr(0, i - 1) + word.substring(i);
                if (temp !== previousTemp) {
                    _.each(findAllPermutations(temp), function(perm) {
                        if (hash[perm] !== undefined) {
                            hash[word].edges.push(perm);
                        }
                    });
                }
                previousTemp = temp;
            }
        }
    });
    markTime('Hashing took', start);

    return hash;
}

//====================================================
//  Go through the sorted array and determine the max Length
//====================================================

// becasue its sorted any words that are in the edge list will have the maxLength property initialized
function findInDegrees(array, hash) {
    var maxChain = {
        name: '',
        max: ''
    };
    _.each(array, function(word) {
        if (hash[word].edges.length > 0) {
            var max = 0;
            _.each(hash[word].edges, function(edge) {
                if (hash[edge].maxLength > max) {
                    max = hash[edge].maxLength;
                }
            });
            max += 1;
            hash[word].maxLength = max;

            if (max > maxChain.max) {
                maxChain.max = max;
                maxChain.name = word;
            }
        } else {
            hash[word].maxLength = 0;
        }
    });
    console.log(maxChain);
}

