const numCrackers = navigator.hardwareConcurrency || 4;
const deadCrackers = {};
let crackers = [];
let totalAttempts = {};
let totalCombos = 0;
let found = false;
let startTime = 0;

document.getElementById("demoBtn").onclick = () => {
  const testHashes = {
    "abc": "900150983cd24fb0d6963f7d28e17f72",
    "1234": "81dc9bdb52d04dc20036dbd8313ed055",
    "qwe": "76d80224611fc919a5d54f0ff9fba446",
    "test": "098f6bcd4621d373cade4e832627b4f6",
    "admin": "21232f297a57a5a743894a0e4a801fc3"
  };

  const entries = Object.entries(testHashes);
  const [word, hash] = entries[Math.floor(Math.random() * entries.length)];
  document.getElementById("md5hash").value = hash;

  log(`🧪 Using demo hash for "${word}"`);
};

document.getElementById("startBtn").onclick = () => {
  startTime = Date.now();
  const hash = document.getElementById("md5hash").value.trim();
  const maxLength = 8;
  found = false;

  const hashType = detectHashType(hash);
  document.getElementById("hashTypeBox").textContent = `🔍 Detected Hash Type: ${hashType}`;

  if (hashType !== "MD5") {
    log(`❌ Unsupported hash type: ${hashType}. Currently only MD5 is supported.`);
    return;
  }

  if (hash.length !== 32) {
    log("❌ Invalid MD5 hash.");
    return;
  }

  totalAttempts = {};
  totalCombos = Math.pow(62, maxLength); // 26+26+10 chars

  log(`📊 Total combinations (max): ${totalCombos}`);
  log(`Starting cracking with ${numCrackers} crackers...`);

  for (let i = 0; i < numCrackers; i++) {
    totalAttempts[i] = 0;
    crackers[i] = new Worker("cracker.js");

    crackers[i].postMessage({
      type: "init",
      crackerId: i,
      totalCrackers: numCrackers,
      hash,
      maxLength
    });

    crackers[i].onmessage = e => {
      const data = e.data;
      if (data.type === "found") {
        found = true;
        const resultEl = document.getElementById("resultBox");
        resultEl.textContent = `✅ Cracked by Cracker ${data.crackerId}: "${data.password}"`;
        log(`✅ Password found by cracker ${data.crackerId}: ${data.password}`);
        setTimeout(terminateCrackers, 100);
      } else if (data.type === "log") {
        log(`[Cracker ${data.crackerId}]: ${data.message}`);
        if (data.message.includes("finished")) {
          removeHeartbeat(data.crackerId);
        }
      } else if (data.type === "heartbeat") {
        updateHeartbeat(data.crackerId);
      } else if (data.type === "progress") {
        totalAttempts[data.crackerId] = data.attempts;
      
        const total = Object.values(totalAttempts).reduce((a, b) => a + b, 0);
        const percent = ((total / totalCombos) * 100).toFixed(2);
        const progressBar = document.getElementById("progress");
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
      
        const elapsedSec = (Date.now() - startTime) / 1000;
        const attemptsPerSecond = total / elapsedSec;
        const remainingAttempts = totalCombos - total;
        const etaSec = remainingAttempts / (attemptsPerSecond || 1);
        const etaFormatted = etaSec > 3600
          ? `${(etaSec / 3600).toFixed(1)}h`
          : etaSec > 60
            ? `${(etaSec / 60).toFixed(1)}m`
            : `${etaSec.toFixed(0)}s`;
      
        const now = new Date().toLocaleTimeString();
        log(`📈 [${now}] Cracker ${data.crackerId} tried ${data.attempts} → ETA ~${etaFormatted}`);
      }
      
    };
  }
};

function detectHashType(hash) {
  const len = hash.length;
  if (/^[a-f0-9]+$/i.test(hash)) {
    if (len === 32) return "MD5";
    if (len === 40) return "SHA1";
    if (len === 64) return "SHA256";
  }
  return "Unknown";
}

function removeHeartbeat(crackerId) {
  deadCrackers[crackerId] = true;
  const elId = `heartbeat-${crackerId}`;
  const hb = document.getElementById(elId);
  if (hb) hb.remove();
}

function updateHeartbeat(crackerId) {
  if (deadCrackers[crackerId]) return;

  const elId = `heartbeat-${crackerId}`;
  let hb = document.getElementById(elId);

  if (!hb) {
    hb = document.createElement("div");
    hb.className = "heartbeat-item";
    hb.id = elId;
  }

  const now = new Date().toLocaleTimeString();
  hb.textContent = `💓 Cracker ${crackerId} alive @ ${now}`;

  const container = document.getElementById("heartbeatLog");
  const all = [...container.children].filter(e => e.id !== elId);
  all.push(hb);
  all.sort((a, b) => {
    const ida = parseInt(a.id.split("-")[1]);
    const idb = parseInt(b.id.split("-")[1]);
    return ida - idb;
  });

  container.innerHTML = "";
  all.forEach(e => container.appendChild(e));
}


function terminateCrackers() {
  crackers.forEach(c => c.terminate());
  log("🛑 All crackers terminated.");
}

function log(msg) {
  const el = document.getElementById("log");
  el.innerHTML += msg.replaceAll("\n", "<br>") + "<br>";
}
