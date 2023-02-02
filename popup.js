const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
startBtn.addEventListener("click", async () => { browser.runtime.sendMessage({ start: true }); });
stopBtn.addEventListener("click", async () => { browser.runtime.sendMessage({ stop: true }); });

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request.hasOwnProperty('status')) return;
    if (request.status) {
        document.getElementById('show-status').innerText = 'Extension running!'
    } else {
        document.getElementById('show-status').innerText = 'Extension stopped!'
    }
})