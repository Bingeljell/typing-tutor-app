## 🧠 Typing Tutor App Logic Overview

### 🎯 Typing Completion Logic

* The app considers an exercise complete when the user's input matches the **length** of the target sentence (not necessarily exact match).
* This allows for **flexibility**: users can make typos and continue, but still must type full length.
* Upon completion:

  * Timer stops
  * Stats display (Accuracy, WPM, Time)
  * Fun fact box is revealed

### ✅ Accuracy Logic

* Located in `calculateAccuracy()` in `typingUtils.js`
* Uses fuzzy word-matching:

  * Normalizes quotes (smart to straight)
  * Splits input and target by spaces
  * Compares each target word to input within a window (+/- 1 index)
  * Uses `string-similarity` to measure likeness
  * Words are counted correct if similarity >= 0.8
* Skips duplicate matches via `matchedIndices`
* Returns accuracy as `% of correct target words`

### 🚀 WPM Logic

* Found in `calculateWPM()`
* Counts total input words
* Divides by elapsed time in minutes
* Returns rounded result

### 🧩 Real-Time Text Rendering

* Powered by `diffChars()` from the `diff` package
* Compares normalized input vs. target
* Renders:

  * Green for correct
  * Red for removed/missing
  * Yellow for extra
  * Gray for untyped
* Updates dynamically on each keystroke

### 🛡 Input Sanitization

* Curly quotes (like `“”` or `‘’`) are replaced with standard equivalents before comparison
* Trimming applied to input and target strings

### 📦 Data Model

Each exercise object:

```js
{
  id: 'classics-001-2',
  level: 1,
  part: 2,
  category: 'classic',
  text: '...',
  factoid: '...'
}
```

* `id` encodes category + level + part
* Used to calculate HUD, per-level progress


### 🔁 Mode Switching & Safety

The app uses a currentParts object to track the last seen part for each category

{
  classic: 0,
  pop: 0,
  news: 0,
  stem: 0
}

On mode switch:

The current part is stored into currentParts[category]

The new mode retrieves its saved part from currentParts[mode]

Both currentPart and category are updated together safely

### 💥 Error Handling

* If `targetExercise` is undefined (due to invalid index), component exits early with a fallback message (optional)
* Helps avoid `undefined.level` runtime errors when switching categories

### 🧠 Future-Proofing (Optional)

* You could track `lastSeenPart` per category for resume logic
* Save accuracy & WPM history in `localStorage` to build learner profiles
* Add per-character timing for burst speed analysis
