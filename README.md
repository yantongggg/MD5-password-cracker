# 🔐 MD5 Password Cracker (Web-Based, Multi-Threaded)

A browser-based **MD5 password cracker** that uses **Web Workers for parallel brute-force attacks**.  
Tracks real-time **progress**, **heartbeats**, **ETA**, and detects **hash type** automatically.  
Designed for **educational** and **demonstration** purposes only.

![screenshot](docs/demo_screenshot.png)

## ⚙️ Features

- ✅ Brute-force password cracking for **MD5 hashes**
- 🚀 Utilizes `navigator.hardwareConcurrency` to spawn **multiple Web Workers**
- 💓 Worker **heartbeat monitor** (per second)
- 📈 Real-time **progress bar**, % completed
- ⏳ Displays **estimated time remaining (ETA)**
- 🧠 Auto-detects hash type (MD5, SHA1, SHA256)
- 🧪 One-click **demo hashes** to test functionality
- 📦 100% runs **locally in browser** (no backend/server)

---

## 🖥️ Demo

Try it here: [yantongggg.github.io/MD5-password-cracker](https://yantongggg.github.io/MD5-password-cracker)

---

## 📸 Screenshots

| Cracking Progress | Heartbeat Monitor |
|------------------|-------------------|
| ![Progress](docs/progress.png) | ![Heartbeat](docs/heartbeat.png) |

---

## 🧪 How to Use

1. Paste an MD5 hash into the input field (or click "🧪 Try Demo Hash").
2. Click **Start Cracking**.
3. The system will:
   - Automatically detect the hash type
   - Spawn multiple workers
   - Display heartbeat, progress, and ETA

**Note:** This demo supports MD5 only.

---

## 🛠️ Tech Stack

- JavaScript (ES6+)
- HTML + CSS (vanilla)
- Web Workers (multi-threading)
- [blueimp-md5](https://github.com/blueimp/JavaScript-MD5)

---

## 🚫 Disclaimer

This tool is for **educational purposes** only.  
Do **not** use it for unauthorized access or malicious activities.  
Always respect privacy and legal boundaries.

---

## 🪪 License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and distribute it for personal or commercial purposes.
