# ⌨️ Typing Tutor App

A fun and interactive typing tutor built with **React + Vite**.  
Designed for kids and adults to improve typing speed and accuracy through engaging exercises, factoids, and game modes.  

---

## ✨ Features

### 🔤 Core Typing
- Real-time feedback (green = correct, red = incorrect, yellow = extra, gray = pending):contentReference[oaicite:0]{index=0}  
- Press `Enter` to move to the next exercise:contentReference[oaicite:1]{index=1}  
- Auto-focus on typing input when exercise starts  

### 📚 Modes & Content
- Multiple content sets: **Classic, Pop, News, STEM**:contentReference[oaicite:2]{index=2}  
- Level + Part structure with progress HUD and trackers:contentReference[oaicite:3]{index=3}  
- Trivia factoids displayed after each completed exercise:contentReference[oaicite:4]{index=4}  

### 📈 Stats & Tracking
- Live **WPM** and **accuracy** (with fuzzy word matching logic):contentReference[oaicite:5]{index=5}  
- Sentence progress bar + per-level dot tracker:contentReference[oaicite:6]{index=6}  
- Elapsed time timer per exercise:contentReference[oaicite:7]{index=7}  

### 🎮 Game Modes
- **Time Trial Mode** for quick practice:contentReference[oaicite:8]{index=8}  
- **Multiplayer Race (in progress)** – real-time P2P typing races using WebRTC / PeerJS:contentReference[oaicite:9]{index=9}  

### 🧠 Extras
- Smart handling of curly quotes and safe input checks:contentReference[oaicite:10]{index=10}  
- Restart & Next Exercise buttons (keyboard-friendly):contentReference[oaicite:11]{index=11}  
- Clean **TailwindCSS**-based UI:contentReference[oaicite:12]{index=12}  

---

## 🛠 Tech Stack

- **Frontend**: React + Vite:contentReference[oaicite:13]{index=13}  
- **Styling**: TailwindCSS:contentReference[oaicite:14]{index=14}  
- **Logic**: Custom typing engine with fuzzy accuracy + WPM calculation:contentReference[oaicite:15]{index=15}  
- **Multiplayer**: Peer-to-Peer (WebRTC/PeerJS) [in progress]:contentReference[oaicite:16]{index=16}  
- **Deployment**: Netlify (auto-deploy from GitHub):contentReference[oaicite:17]{index=17}  

---

## 🚀 Roadmap
- ✅ Time Trial Mode  
- ✅ Shareable scores via link  
- 🚧 Multiplayer race mode with live opponent stats  
- 🚧 Leaderboards (Firebase or mock JSON)  
- 🎵 Optional sound effects & richer factoids  
- 📊 Teacher/Parent dashboards (future):contentReference[oaicite:18]{index=18}  

---

## 📦 Getting Started

```bash
# Clone repo
git clone https://github.com/your-username/typing-tutor-app

# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
