// HELPER
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function navigateToURL(tab, url, _delay) {
    await browser.tabs.update(tab?.id, { url: url });
    await delay(_delay ? _delay : 5000);
}

const executeScript = async (tabId, func, _delay) => {
    await browser.scripting.executeScript({
        target: { tabId: tabId },
        func: func,
    });
    await delay(_delay ? _delay : 1000) // default 1s
}

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