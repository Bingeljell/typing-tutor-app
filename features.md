## ✨ Typing Tutor App Features

### 🔤 Core Typing Experience

* **Typing Input Box Focus**: Automatically focuses the input field when a new exercise is loaded (with a small delay to accommodate animations).
* **Enter to Advance**: Pressing `Enter` after completing an exercise triggers the next one.
* **Character-by-Character Feedback**: Typed text is highlighted in real-time with green (correct), red (incorrect), yellow (extra chars), and gray (pending input).

### 📚 Content Modes

* **Modes Supported**: Users can switch between 'classic', 'pop', 'news', and 'stem' datasets.
* **Category Switch Logic**: Switching modes resets the current exercise index and safely reloads with proper bounds checking.

### 🎯 Exercise Tracking

* **Progress HUD**: Shows "Level X — Exercise Y of Z" above each exercise.
* **Animated Dot Tracker**: Visual indicator for each exercise in the level with current (yellow), completed (green), and pending (gray).
* **Sentence Progress Bar**: A horizontal visual progress bar based on character length typed.

### 📈 Stats

* **Accuracy**: Displayed after completion, calculated with fuzzy matching logic (see `logic.md`).
* **Words Per Minute (WPM)**: Updated live and shown in stats box.
* **Elapsed Time**: Timer starts on first keypress and stops on completion.

### 💬 Factoid Display

* **Trivia Popup**: After a correct completion, a category-colored animated box displays a fun fact related to the sentence.

### 🔄 Utility Buttons

* **Restart**: Resets the current exercise.
* **Next Exercise**: Advances to the next part manually if already completed.
* **Enter Shortcut**: Doubles as Next Exercise shortcut.

### 🧠 UI/UX Enhancements

* **Centered Layout**: Entire interface is centered vertically and horizontally.
* **Tailwind-First Styling**: Clean and consistent UI via utility classes.
* **Smart Quote Normalization**: Handles curly/smart quotes so they don't break comparisons.

### 🧪 Error Handling

* **Category Bounds Protection**: Prevents crashes when switching to a category with fewer exercises.
* **Safe Target Fetching**: Returns early if targetExercise is undefined.

### ⌨️ Keyboard-Friendly

* Entire app can be navigated and completed using the keyboard alone.
