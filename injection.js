// injection.js
const { VocabCard, loadVocabFromCSV, saveVocabToCSV, wordExists } = require('./utils')

// In-memory word storage
let vocabCards = []

// Fun words to inject into the vocabulary list
const funWords = [
    { word: 'lugubrious', definition: 'looking or sounding sad and dismal' },
    { word: 'apathy', definition: 'lack of interest, enthusiasm, or concern' },
    { word: 'obsequious', definition: 'obedient or attentive to an excessive degree' },
    { word: 'proffer', definition: 'to hold out something for someone for acceptance' },
    { word: 'bereft', definition: 'deprived of or lacking something' },
    { word: 'lament', definition: 'a passionate expression of grief or sorrow' },
    { word: 'putrid', definition: 'decaying or rotting and emitting a foul smell' },
    { word: 'wane', definition: 'to decrease in size, extent, or degree' },
    { word: 'blithe', definition: 'showing a casual and cheerful indifference' },
    { word: 'inure', definition: 'to accustom someone to something, especially something unpleasant' },
    { word: 'mellifluous', definition: 'sweet or musical pleasant to hear' },
    { word: 'serendipity', definition: 'the occurrence of events by chance in a happy or beneficial way' },
    { word: 'halcyon', definition: 'denoting a period of time in the past that was idyllically happy and peaceful' },
    // Add more words to reach 200
]

    // Load existing vocab data and inject new words
    ; (async function () {
        vocabCards = loadVocabFromCSV()

        // Add each fun word to the vocabCards
        funWords.forEach(({ word, definition }) => {
            if (!wordExists(vocabCards, word)) {
                vocabCards.push(new VocabCard(word, definition))
                console.log(`Added new word: "${word}"`)
            }
        })

        // Save the updated list to the CSV
        saveVocabToCSV(vocabCards)
    })();
