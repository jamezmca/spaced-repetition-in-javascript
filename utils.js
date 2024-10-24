const fs = require('fs');
const path = require('path');

// Path to the CSV file where vocab words will be stored
const CSV_FILE_PATH = path.join(__dirname, 'vocab.csv');

// Vocabulary card class
class VocabCard {
    constructor(word, definition, repetitions = 0, interval = 1, easeFactor = 2.5, reviewDate = new Date(), isNew = true) {
        this.word = word;
        this.definition = definition;
        this.repetitions = repetitions;
        this.interval = interval;
        this.easeFactor = easeFactor;
        this.reviewDate = new Date(reviewDate);
        this.isNew = isNew;
    }

    // Calculate next review date
    calculateNextReviewDate() {
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + this.interval);
        this.reviewDate = nextReview;
    }

    // Update card based on correct attempts
    updateCard(correctAttempts) {
        if (correctAttempts <= 5) {
            if (this.repetitions === 0) {
                this.interval = 1;
            } else if (this.repetitions === 1) {
                this.interval = 6;
            } else {
                this.interval = Math.ceil(this.interval * this.easeFactor);
            }
            this.repetitions++;
            this.isNew = false; // Word is no longer new after first correct attempt
        } else {
            this.interval = 1;
            this.repetitions = 0;
        }

        this.easeFactor = this.easeFactor + (0.1 - (5 - correctAttempts) * (0.08 + (5 - correctAttempts) * 0.02));
        if (this.easeFactor < 1.3) {
            this.easeFactor = 1.3; // Ensure it doesn't drop below 1.3
        }

        this.calculateNextReviewDate(); // Update next review date
    }
}

// Helper function to escape commas in CSV fields
function escapeCommas(value) {
    return value.includes(',') ? `"${value}"` : value;
}

// Function to load vocabulary from CSV (handling both escaped and non-escaped entries)
function loadVocabFromCSV() {
    if (!fs.existsSync(CSV_FILE_PATH)) {
        console.log('No CSV file found. Starting fresh.');
        return [];
    }

    const data = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const rows = data.split('\n').filter(row => row.trim().length > 0);

    const cards = rows.map(row => {
        // Handle quoted fields and split by commas only outside of quotes
        const fields = [];
        let currentField = '';
        let insideQuotes = false;

        for (let i = 0; i < row.length; i++) {
            const char = row[i];

            // Toggle insideQuotes flag when encountering double quotes
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                // If a comma is encountered outside of quotes, end the current field
                fields.push(currentField.trim());
                currentField = '';
            } else {
                // Add the character to the current field
                currentField += char;
            }
        }
        // Add the last field after the loop
        fields.push(currentField.trim());

        if (fields.length === 7) {  // Ensure there are 7 fields per row
            const [word, definition, repetitions, interval, easeFactor, reviewDate, isNew] = fields.map(field => field.replace(/^"(.*)"$/, '$1'));
            return new VocabCard(
                word,
                definition,
                parseInt(repetitions),
                parseInt(interval),
                parseFloat(easeFactor),
                new Date(reviewDate),
                isNew === 'true'
            );
        } else {
            console.log(`Invalid row: ${row}`);
        }
    });

    return cards.filter(card => card !== undefined);
}

// Function to save vocabulary to CSV (escaping commas)
function saveVocabToCSV(cards) {
    const csvData = cards.map(card => [
        escapeCommas(card.word),
        escapeCommas(card.definition),
        card.repetitions,
        card.interval,
        card.easeFactor,
        card.reviewDate.toISOString(),
        card.isNew
    ].join(',')).join('\n');

    fs.writeFileSync(CSV_FILE_PATH, csvData, 'utf-8');
}

// Check if a word already exists in the vocabCards
function wordExists(vocabCards, word) {
    return vocabCards.some(card => card.word.toLowerCase() === word.toLowerCase());
}

// Export utility functions and classes
module.exports = {
    VocabCard,
    loadVocabFromCSV,
    saveVocabToCSV,
    wordExists
};
