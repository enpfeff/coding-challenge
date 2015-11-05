#Coding Challenge
##Prompt

A chain is defined as follows:

tan
rant
train
rating
 
Each word in the chain is one letter longer than the previous word, and contains all the letters of the previous word in any order.  
The challenge is to find the longest chain from the given list of words.  Language and platform of your choosing.

##Algorithm
1.  Get words and create a hash map that points to meta data, create words array (unsorted)
2.  Parse the Words and create an adjancency list do this by - for all words in words Array
    -  take a word and remove a letter from it
    -  find all permutations of that new word formed
    -  if that permutation is a word add it to the edge list (adjancency list)
    -  loop through all characters of the word removing one character at a time doing the same operations
3.  Sort the words Array from shortest to longest
4.  for all words in the words array 
    - if the edges list is > 0 find the maxChain of each of the edges and add 1 to it, this is the current words maxChain 
    - because the array is sorted shortest to longest maxChain will be defined for all words in the edge list
    - else the maxChain = 0