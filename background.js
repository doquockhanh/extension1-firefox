// ENTITY
// const os = require('os');
// import os from 'os';
const Info = (function () {
    const _info = { email: "", ip: "", country: "", hostName: "" }
    const prop = {};
    prop.setEmail = function (email) { _info.email = email };
    prop.setIp = function (ip) { _info.ip = ip };
    prop.setCountry = function (country) { _info.country = country };
    prop.setHostName = function (host) { _info.hostName = host }
    prop.getInfo = function () { return _info };
    return prop;
})();

const Tab = (function () {
    let _tab = browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = async () => {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        return tab;
    }
    const prop = {};
    prop.saveCurrentTab = async function () { _tab = await currentTab() };
    prop.getCurrentTab = async function () { return currentTab() };
    prop.getSavedTab = function () { return _tab };
    return prop;
})();

const Running = (function () {
    let status = false;
    const prop = {};
    prop.getStatus = function () { return status };
    prop.setStatus = function (s) { status = s; sendStatus(); };
    function sendStatus() {
        browser.runtime.sendMessage({ status });
    }
    return prop;
})();

// FUNCTION

// Receive Events
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { email, ip, start, stop, loginGoogle, loginYoutube, doLoginYoutube, country } = request;
    console.log(request);
    if (email) Info.setEmail(email);
    if (ip) Info.setIp(ip);
    if (start) {
        Running.setStatus(true);
        main()
    };
    if (stop) Running.setStatus(false);
    if (loginGoogle) doLoginGoogle();
    if (loginYoutube) doLoginYoutube();
    if (country) Info.setCountry(country);
})

async function main() {
    await Tab.saveCurrentTab();
    // await loginGoogleIfNotLoggedIn();
    // await delay(20000); // wait for complete login google
    // await loginYoutubeIfNotLoggedIn();
    // await delay(20000); // wait for complete login youtube
    await getIp();
    await getEmail();
    await getCountry();
    await doLogInfo();
    await doWatchVideo();
}

async function loginYoutubeIfNotLoggedIn() {
    const tab = Tab.getSavedTab();
    await navigateToURL(tab, 'https://www.youtube.com');
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const loginBtn = document.getElementsByClassName('style-scope ytd-masthead')[0];
            if (loginBtn) browser.runtime.sendMessage({ doLoginYoutube: true });
        }
    });
}

async function doLoginYoutube() {
    const tab = Tab.getSavedTab();
    const url = 'https://accounts.google.com/ServiceLogin/signinchooser?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&hl=en&ec=65620&ifkv=AWnogHcdvj-hQyT4uKOCQIVfkr0lAhSZKJazrU70cbVN72ouMI3_9TTrSHyfxa6M9mwsYoxgTuPi&flowName=GlifWebSignIn&flowEntry=ServiceLogin'
    await navigateToURL(tab, url);
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const list = document.getElementsByClassName('lCoei YZVTmd SmR8');
            for (const item of [...list]) {
                if (item.innerText.includes('khanhquocdo.test@gmail.com')) {
                    item.click(); // Sử dụng tài khoản khác
                    break;
                }
            }
            await delay(2000);
            document.getElementsByClassName('whsOnd zHQkBf')[0].value = 'Khanhquoc2901_'; // Nhập Mk
            await delay(1000);
            document.getElementsByClassName('VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b')[0].click() // Tiếp theo
        }
    });
}

async function loginGoogleIfNotLoggedIn() {
    const tab = Tab.getSavedTab();
    await navigateToURL(tab, 'https://www.google.com');
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const loginBtn = document.getElementsByClassName('gb_ha gb_ia gb_ee gb_ed')[0];
            if (loginBtn) browser.runtime.sendMessage({ loginGoogle: true });
        }
    });
}

async function doLoginGoogle() {
    const tab = Tab.getSavedTab();
    const url = 'https://accounts.google.com/ServiceLogin/signinchooser?hl=vi&passive=true&continue=https%3A%2F%2Fwww.google.com%2F&ec=GAZAmgQ&ifkv=AWnogHcRnNbUmW9EhPc6QoRyxIkXi1DQGtbiSWc-GGZhXi1RdrpSBth-fqcyLZjQIVM1KLpWlU2Ykw&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
    await navigateToURL(tab, url);
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const list = document.getElementsByClassName('lCoei YZVTmd SmR8');
            for (const item of [...list]) {
                if (item.innerText.includes('Sử dụng một tài khoản khác')) {
                    console.log(item.innerText);
                    item.click(); // Sử dụng tài khoản khác
                    break;
                }
            }
            await delay(2000);
            document.getElementById('identifierId').value = 'khanhquocdo.test@gmail.com'; // Nhập tk
            await delay(1000);
            document.getElementsByClassName('VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b')[0].click() // Tiếp theo
            await delay(2000);
            document.getElementsByClassName('whsOnd zHQkBf')[0].value = 'Khanhquoc2901_'; // Nhập Mk
            await delay(1000);
            document.getElementsByClassName('VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b')[0].click() // Tiếp theo
        }
    });
}

async function getIp() {
    const tab = Tab.getSavedTab();
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
}

async function getEmail() {
    const tab = Tab.getSavedTab();
    // enter google
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

async function getCountry() {
    const tab = Tab.getSavedTab();
    await navigateToURL(tab, 'https://www.youtube.com');
    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const country = document.getElementById('country-code').innerText;
            browser.runtime.sendMessage({ country });
        },
    })
}

async function doWatchVideo() {
    const tab = Tab.getSavedTab();
    const videos = await getVideos();
    while (Running.getStatus()) {
        const index = Math.floor(Math.random() * videos.length);
        const video = videos[index];
        if (!video?.title) continue;
        await search(video.title);
        await watchVideo();
    }

    async function search(title) {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        let formatTT = title.split(' ')
        formatTT = formatTT.filter((t) => t.length > 1)
        if (formatTT.length > 8) formatTT.splice(-Math.floor(Math.random() * 2) - 1)
        const key = formatTT.join(' ');
        const tab = Tab.getSavedTab();
        await browser.tabs.executeScript(
            tab.id,
            { code: 'const key = ' + key },
            function () {
                browser.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: async () => {
                        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                        document.getElementsByClassName('gsfi ytd-searchbox')[0].value = key;
                        await delay(1000);
                        document.getElementById('search-icon-legacy').click();
                    },
                });
            }
        )
        await delay(6000);
    }

    async function watchVideo() {
        if (Math.floor(Math.random() * 1000) !== 0) return; // 99,9% return 0.1% continue
        await browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const title = document.getElementById('video-title');
                title?.click();
            },
        })
        const wait = Math.floor((Math.random() * 57) + 35); // 35 -> 91s
        await delay(wait * 1000);
    }
}

// HELPER

async function navigateToURL(tab, url, _delay) {
    await browser.tabs.update(tab?.id, { url: url });
    await delay(_delay ? _delay : 5000);
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

//API
const doLogInfo = async () => {
    // Info.setHostName(os.hostname());
    const { email, ip, country, hostName } = Info.getInfo();
    await fetch('https://backend.techlab.asia/api/log/new', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, ip, country, hostName, firefox: true })
    })
}

const getVideos = async () => {
    const videos = await fetch('https://backend.techlab.asia/api/event/videos', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    return videos.json();
}