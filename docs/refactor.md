# Typing Tutor App — Planned Refactor

## 🎯 Goals
- Simplify component structure
- Eliminate prop drilling (reduce passing of many props)
- Centralize app-wide state for better scalability
- Prepare codebase for backend integration (users, database)

---

## 🛠 Planned Changes

### 1️⃣ **Use React Context**
- Create `AppContext` to hold:
  - `name`
  - `progress`
  - `category`, `setCategory`
  - `currentPart`, `setCurrentPart`
  - `currentParts`, `setCurrentParts`
- Replace prop drilling with `useContext` for cleaner access.

---

### 2️⃣ **Organize Components**
- Move major sections into folders:
/src/components/Typing
TypingBox.jsx
ProgressHUD.jsx
FactoidBox.jsx
/src/components/Stats
StatsPage.jsx
/src/context
AppContext.jsx


---

### 3️⃣ **Add a resetAppState utility**
- A shared function that resets:
- progress
- currentPart
- currentParts
- name (optional)
- Use this in all reset buttons.

---

### 4️⃣ **Improve progress saving**
- Ensure progress saves on unmount or route change (optional future enhancement).
- Consider batching saves rather than every keystroke.

---

### 5️⃣ **Prepare for backend**
- Abstract `localStorage` access to a service layer
- Plan shape of user and progress data for database

---

### 6️⃣ **General code cleanup**
- Remove unused states and variables
- Ensure consistent naming conventions
- Write helper functions for repeated logic (e.g. normalize text)

---

## 📝 Notes
- Refactor can be done in stages.
- Start with Context + prop cleanup, then file structure.
