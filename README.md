# Spaced Repetition Vocabulary Learning System

This project is a **spaced repetition system** designed to help users learn vocabulary efficiently. It persists the vocabulary list across sessions using a CSV file, making it easy to review words in future sessions. The project also includes an injection file to add new vocabulary words and ensure that words are reviewed at optimal intervals.

## Table of Contents
1. [Overview](#overview)
2. [Learning Methodology](#learning-methodology)
3. [First Encounter and Attempts](#first-encounter-and-attempts)
4. [Features](#features)
5. [Setup and Running](#setup-and-running)
6. [Project Structure](#project-structure)
7. [Usage](#usage)

## Overview

This project uses a **spaced repetition** algorithm to help users review and remember vocabulary words more effectively. It keeps track of how well users remember words and adjusts the intervals between reviews based on their performance. The goal is to **increase the interval between reviews** for words the user knows well while reviewing challenging words more frequently.

The system also allows you to **inject fun vocabulary words** into the learning process through the `injection.js` script.

## Learning Methodology

This project implements a **spaced repetition algorithm** inspired by the **SuperMemo 2 (SM-2) algorithm**, which is widely used in flashcard learning systems like Anki.

### Key Points of the Learning Methodology:

- **First Encounter of a Word**: 
  - When you encounter a word for the first time, the system will show you the definition and prompt you to copy it verbatim. This helps introduce the word and give context before asking you to recall it.
  
- **Subsequent Reviews**: 
  - For words you have already encountered, the system will prompt you to define the word from memory. If you get it wrong, the system gives you up to 5 attempts before showing the correct definition.

- **Adjusting Review Intervals**:
  - The system tracks how well you remember each word. If you answer correctly, it increases the time before the next review (i.e., the interval). If you get the word wrong or require multiple attempts, the interval is shortened.
  - The system ensures that you review more challenging words more frequently, while words you know well are reviewed less often.

- **Progress Tracking**:
  - After each review session, the system updates the next review date and ease factor for each word, adjusting the difficulty for future reviews.
  - A **progress bar** is displayed during the review session, giving a visual representation of how much of the day's session has been completed.

## First Encounter and Attempts

### First Encounter with a Word:
- The **first time** you encounter a word, the system will:
  - Show you the word and its definition.
  - Ask you to copy the definition verbatim. This ensures you understand the word and its meaning before attempting to recall it from memory.

### Future Reviews:
- For **subsequent encounters** with the word:
  - The system will ask you to **define the word from memory**.
  - If you get it wrong, the system will give you **up to 5 attempts** to get the word correct.
  - After 5 failed attempts, the correct definition will be shown, and the word will be reviewed again in the future with a shorter review interval.

This method balances learning new words with reviewing previously learned ones, ensuring that difficult words are revisited more frequently, while easier words are spaced out.

## Features

- **Spaced Repetition Algorithm**: 
  - Uses an SM-2-based algorithm to determine optimal review intervals for each word based on your performance.
  
- **First Encounter Behavior**: 
  - Words you encounter for the first time will show the definition and ask you to copy it, rather than immediately requiring recall.

- **5 Attempts Rule**: 
  - On subsequent reviews, you have 5 attempts to get the word right before the system shows the correct definition.

- **CSV Persistence**: 
  - All vocabulary data is stored in a `vocab.csv` file, so your progress is saved between sessions.
  
- **Word Injection**: 
  - The `injection.js` script allows you to inject new vocabulary words into the system, ensuring that each word is unique and preventing duplicates.

- **Progress Bar**: 
  - Shows the percentage of words reviewed during each session.

- **Unique Word Handling**: 
  - The system ensures that no duplicate words are added to the vocabulary list.

## Setup and Running

### Prerequisites:
- **Node.js**: You will need Node.js installed to run the scripts.

### Installation:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Node.js** (if you haven't already):
   - Download and install Node.js from [nodejs.org](https://nodejs.org/).

3. **Install Dependencies**:
   - No external dependencies are required for this project. It uses built-in Node.js modules such as `fs`.

### Running the Code

#### Running the Learning System
To start a spaced repetition learning session:

```bash
node learn.js
```

- The system will load your vocabulary from `vocab.csv`.
- It will guide you through reviewing words that are due for review and new words you are encountering for the first time.
- After completing a session, your progress will be saved to the CSV file.

#### Injecting New Words
You can inject new words into your vocabulary list by running the `injection.js` script:

```bash
node injection.js
```

- This will add predefined words (such as fun or uncommon words) to your vocabulary.
- The script ensures that no duplicate words are added.

## Project Structure

```
.
├── vocab.csv            # Stores the vocabulary list and user progress
├── learn.js             # The main script for learning and reviewing words
├── injection.js         # Script to inject new words into the vocabulary list
└── utils.js             # Utility functions and classes shared by learn.js and injection.js
```

### Explanation of Files:

- **`learn.js`**: 
  - The core learning system that runs the spaced repetition algorithm. It reads vocabulary from the CSV file, runs the review session, and updates the file with progress after each session.

- **`injection.js`**: 
  - A script to add new words to your vocabulary list. You can define a list of words to inject, and it ensures no duplicates are added to the CSV file.

- **`utils.js`**: 
  - A helper file that contains shared classes and functions for handling vocabulary data, such as reading from and writing to CSV, as well as the `VocabCard` class.

## Usage

### Learning Sessions:
- When you run `learn.js`, the system will load all words from `vocab.csv`.
- **New Words**: If you are encountering a word for the first time, it will show the definition and ask you to copy it.
- **Reviewing Words**: For subsequent encounters, the system will ask you to define the word from memory. You will have 5 attempts to recall the word before the system shows you the correct definition.
- Based on your performance, the system will adjust the time interval until the next review.

### Injecting Words:
- You can customize the words to be injected by editing the `funWords` array in `injection.js`.
- The injection script ensures that no duplicate words are added.

## Learning Methodology in Depth:

The project employs a spaced repetition system based on the SM-2 algorithm:
- **First Encounter**: When encountering a new word, you are shown the definition to help build an initial understanding. This reduces cognitive load in early encounters.
- **Review Cycle**: The interval between reviews increases for words you answer correctly, while words you struggle with are reviewed more frequently.
- **Ease Factor**: Each word has an ease factor, which controls how quickly the interval grows or shrinks depending on your performance.

This methodology helps **optimize long-term retention** of vocabulary, allowing you to focus more on words you find difficult while saving time on words you already know well.