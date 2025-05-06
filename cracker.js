importScripts("https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js");

let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let crackerId, totalCrackers, targetHash, maxLength;
let attemptCount = 0;

self.onmessage = e => {
  if (e.data.type === "init") {
    ({ crackerId, totalCrackers, hash: targetHash, maxLength } = e.data);

    setInterval(() => {
      self.postMessage({ type: "heartbeat", crackerId });
    }, 1000);

    setInterval(() => {
      self.postMessage({ type: "progress", crackerId, attempts: attemptCount });
    }, 1000);

    crack();
  }
};

async function crack() {
  postLog(`Cracker ${crackerId} started.`);
  for (let length = 1; length <= maxLength; length++) {
    if (await findCombination('', length)) return;
  }
  postLog(`Cracker ${crackerId} finished. No password found.`);
}

async function findCombination(prefix, length) {
  if (length === 0) {
    attemptCount++;
    if (md5(prefix) === targetHash) {
      self.postMessage({ type: "found", crackerId, password: prefix });
      return true;
    }
    return false;
  }

  for (let i = 0; i < chars.length; i++) {
    if (prefix.length === 0 && (i % totalCrackers) !== crackerId) continue;

    // 给浏览器机会处理 setInterval
    if (prefix.length === 0) await new Promise(r => setTimeout(r, 0));

    if (await findCombination(prefix + chars[i], length - 1)) return true;
  }

  return false;
}

function postLog(message) {
  self.postMessage({ type: "log", crackerId, message });
}
