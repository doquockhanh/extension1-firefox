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
browser.runtime.onMessage.addListener((request) => {
    const { email, ip, start, stop, loginGoogle, loginYoutube, doLoginYoutube, country } = request;
    console.log(request);
    if (start) {
        Running.setStatus(true);
        main()
    };
    if (email) Info.setEmail(email);
    if (ip) Info.setIp(ip);
    if (stop) Running.setStatus(false);
    // if (loginGoogle) doLoginGoogle();
    // if (loginYoutube) doLoginYoutube();
    if (country) Info.setCountry(country);
})

async function main() {
    await Tab.saveCurrentTab();
    await getIp();
    await getEmail();
    await getCountry();
    await doLogInfo();
    await doWatchVideo();
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
        let formatTT = title.split(' ')
        formatTT = formatTT.filter((t) => t.length > 1)
        if (formatTT.length > 8) formatTT.splice(-Math.floor(Math.random() * 2) - 1)
        const key = formatTT.join('+')
        const url = 'https://www.youtube.com/results?search_query=' + key;
        console.log(url);
        await navigateToURL(tab, url);
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
        const wait = Math.floor((Math.random() * 5) + 15); // 35 -> 91s
        const commentAt = Math.floor((Math.random() * 5) + 5); // 5s -> 10s 
        await delay(commentAt * 1000);
        if (Math.floor(Math.random() * 5) === 0) { // 20% comment
            comment();
        };
        await delay((wait - commentAt) * 1000);
    }

    function comment() {
        chrome.tabs.executeScript(null, { file: "jquery.js" }, async function () {
            await browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: async () => {
                    const comments = ["I really love it", "It's look insane!", "It make my day 🥰", "", 'Lol 🤣', "Come and see my boy 😆", "Some one tell me what happend 🥶", "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "😮‍💨", "🤤", "🥶", "🤠", "🥳", "😎", "🤓", "🧐", "😮", "😯", "😲", "😳"]
                    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                    window.scrollBy(0, 400);
                    await delay(2000);
                    document.getElementById('placeholder-area').click();
                    await delay(1000);
                    const index = Math.floor(Math.random() * comments.length);
                    const comment = comments[index];
                    document.getElementById("contenteditable-root").innerText = comment;
                    comments.splice(index, 1);
                    await delay(1000);
                    const submitBtn = document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--disabled yt-spec-button-shape-next--size-m ')[0];
                    submitBtn.classList.remove("yt-spec-button-shape-next--disabled");
                    submitBtn.classList.add('yt-spec-button-shape-next--call-to-action');
                    submitBtn.removeAttribute('disabled');
                    submitBtn.click();
                    await delay(4000);
                    window.scrollBy(0, -400);
                },
            })
        });
    }
}

// HELPER

async function navigateToURL(tab, url, _delay) {
    await browser.tabs.update(tab?.id, { url: url });
    await delay(_delay ? _delay : 5000);
}

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