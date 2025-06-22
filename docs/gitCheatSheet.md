# Git Essentials — GutenKeys Project Cheatsheet

---

## 1️⃣ Basic Workflow

```bash
git status             # Check current status of repo
git add .              # Stage all changes
git commit -m "Message"  # Commit staged changes
git push               # Push current branch to GitHub
```

---

## 2️⃣ Branch Management

```bash
git branch                   # List local branches
git branch -r                # List remote branches
git checkout main            # Switch to main branch
git checkout -b feature-xyz  # Create new branch from current state and switch to it
git push -u origin feature-xyz  # First push of new branch → link it to GitHub
```

---

## 3️⃣ Renaming Branch (handy for Netlify length limits!)

```bash
git branch -m old-name new-name        # Rename branch locally
git push origin :old-name              # Delete old branch on GitHub
git push -u origin new-name            # Push renamed branch to GitHub
```

---

## 4️⃣ Triggering Deploys (Netlify trick)

```bash
git commit --allow-empty -m "Trigger Netlify deploy"
git push
```

---

## 5️⃣ Archiving old state

```bash
git checkout main
git pull
git checkout -b archive/pre-culture-pivot
git push -u origin archive/pre-culture-pivot
```

→ Now you have a safe branch preserving old version.

---

## 6️⃣ Deleting branch (when done)

**Local:**

```bash
git branch -d feature-xyz
```

**Remote:**

```bash
git push origin --delete feature-xyz
```

---

## 7️⃣ Syncing main branch into current branch (keep up to date)

```bash
git checkout main
git pull
git checkout feature-xyz
git merge main          # Brings latest main changes into your branch
```

---

## 8️⃣ Cleaning up Vite cache (frontend-only tip, but useful!)

```bash
rm -rf node_modules/.vite
npm run dev
```

→ Solves weird import / new file parsing bugs.

---

## Summary

| Common Use Case    | Git Command                                        |
| ------------------ | -------------------------------------------------- |
| New feature branch | `git checkout -b feature-xyz`                      |
| Push first time    | `git push -u origin feature-xyz`                   |
| Rename branch      | `git branch -m old new` → `git push -u origin new` |
| Trigger deploy     | `git commit --allow-empty -m ...` → `git push`     |
| Save old state     | `git checkout -b archive/...`                      |
| Sync latest main   | `git merge main`                                   |

---

## Pro Tip

✅ **Keep your branch names short and meaningful** → avoids Netlify URL issues and makes history readable:

```plaintext
feature/culture-focus  → culture-focus
feature/ui-cleanup     → ui-cleanup
```

---

*Real-world Git in action — the exact flow we used in GutenKeys.*
