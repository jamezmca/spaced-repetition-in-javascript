const readline = require('readline')
const { VocabCard, loadVocabFromCSV, saveVocabToCSV, wordExists } = require('./utils')

// In-memory word storage
let vocabCards = []

// Maximum number of new words to introduce per day
const MAX_NEW_WORDS_PER_DAY = 5
let newWordsIntroducedToday = 0

// Function to simulate the prompt function for getting user input
function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise(resolve => rl.question(question, answer => {
        rl.close()
        resolve(answer)
    }))
}

// Show word list in console, grouped by categories
function showWordCategories() {
    const today = new Date()
    const dueWords = vocabCards.filter(card => new Date(card.reviewDate) <= today)
    const newWords = vocabCards.filter(card => card.isNew)

    console.log('Word Categories:')
    console.log(`Words due for review: ${dueWords.length}`)
    console.log(`New words available for introduction: ${newWords.length}`)
}

// Generate a progress bar based on how many words have been reviewed today
function printProgressBar(percentage) {
    const totalBlocks = 20 // Total length of the progress bar
    const filledBlocks = Math.round(totalBlocks * percentage)
    const emptyBlocks = totalBlocks - filledBlocks

    const bar = `[${'█'.repeat(filledBlocks)}${'-'.repeat(emptyBlocks)}] ${Math.round(percentage * 100)}%`
    console.log(bar)
}

// Review all words (both new and due words)
async function reviewSession() {
    const today = new Date()
    let totalWordsReviewed = 0

    // Get new words (that haven't been reviewed yet)
    const newWords = vocabCards.filter(card => card.isNew)

    // Get all words due today
    const dueWords = vocabCards.filter(card => (new Date(card.reviewDate) <= today && !card.isNew))

    // Calculate total words for today (due words + up to 5 new words)
    const totalWordsForToday = dueWords.length + Math.min(MAX_NEW_WORDS_PER_DAY, newWords.length)

    // Introduce new words up to the daily limit
    for (const card of newWords) {
        if (newWordsIntroducedToday >= MAX_NEW_WORDS_PER_DAY) {
            console.log("Daily limit for new words reached.")
            break
        }

        let attempts = 0
        let correct = false

        // First encounter: Show the definition and ask the user to copy it verbatim
        console.log(`New word: "${card.word}". Definition: "${card.definition}".`)

        while (!correct && attempts < 5) {
            const userAnswer = await prompt(`Copy the definition for "${card.word}":\n`)
            attempts++

            if (userAnswer.trim().toLowerCase() === card.definition.toLowerCase()) {
                correct = true
                console.log(`Correct! It took you ${attempts} attempt(s).`)
            } else if (attempts < 5) {
                console.log("Incorrect, try again.")
            }
        }

        if (!correct) {
            console.log(`You've reached 5 attempts. The correct definition is: "${card.definition}".`)
        }

        card.updateCard(attempts) // Mark the word as no longer new
        console.log(`Next review for "${card.word}" on: ${card.reviewDate.toDateString()}`)
        newWordsIntroducedToday++
        totalWordsReviewed++
        printProgressBar(totalWordsReviewed / totalWordsForToday)

        if (newWordsIntroducedToday >= MAX_NEW_WORDS_PER_DAY) {
            break
        }
    }

    // Start reviewing due words
    for (const card of dueWords) {
        let attempts = 0
        let correct = false

        if (card.isNew) {
            // First encounter: Show the definition to the user
            console.log(`First time encountering "${card.word}". Definition: "${card.definition}".`)
            card.isNew = false // Mark the word as no longer new
            saveVocabToCSV(vocabCards) // Save this update immediately
        }

        while (!correct && attempts < 5) {
            const userAnswer = await prompt(`Define: "${card.word}"\n`)
            attempts++

            if (userAnswer.trim().toLowerCase() === card.definition.toLowerCase()) {
                correct = true
                console.log(`Correct! It took you ${attempts} attempt(s).`)
            } else if (attempts < 5) {
                console.log("Incorrect, try again.")
            }
        }

        if (!correct) {
            console.log(`You've reached 5 attempts. The correct definition is: "${card.definition}".`)
        }

        card.updateCard(attempts)
        console.log(`Next review for "${card.word}" on: ${card.reviewDate.toDateString()}`)

        totalWordsReviewed++
        printProgressBar(totalWordsReviewed / totalWordsForToday)
    }

    if (dueWords.length === 0 && newWordsIntroducedToday === 0) {
        console.log('No cards due for review today.')
    }

    // Save the updated vocab cards to CSV
    saveVocabToCSV(vocabCards)
}

// Example usage
; (async function () {
    // Load vocab cards from CSV (if the file exists)
    vocabCards = loadVocabFromCSV()

    // Show how many words are in each category
    showWordCategories()

    // Simulate a review session
    await reviewSession()

    // Show the word categories again to check progress
    showWordCategories()
})();
