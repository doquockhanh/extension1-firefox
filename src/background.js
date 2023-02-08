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
    await executeScript(tab.id, () => {
        const ip = document.getElementsByClassName('NEM4H VL3Jfb BmP5tf')[0]?.innerText;
        browser.runtime.sendMessage({ ip });
    });
}

async function getEmail() {
    const tab = Tab.getSavedTab();
    // enter google
    await navigateToURL(tab, 'https://google.com/');
    // get Email
    await executeScript(tab.id, () => {
        const emailRegex = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;
        // Parse emails from the HTML of the page
        let emails = document.body.innerHTML.match(emailRegex);
        browser.runtime.sendMessage({ email: emails[0] });
    });
}

async function getCountry() {
    const tab = Tab.getSavedTab();
    await navigateToURL(tab, 'https://www.youtube.com');
    await executeScript(tab.id, () => {
        const country = document.getElementById('country-code').innerText;
        browser.runtime.sendMessage({ country });
    });
}

async function doWatchVideo() {
    const tab = Tab.getSavedTab();
    const videos = await getVideos();
    while (Running.getStatus()) {
        //random video
        const index = Math.floor(Math.random() * videos.length);
        const video = videos[index];
        if (!video?.title) continue;

        //search
        await search(video.title);

        // watch video
        if (Math.floor(Math.random() * 2) === 0) { // 0.1% watch video
            await watchVideo();
            continue;
        }

        //go to youtube home page
        if (Math.floor(Math.random() * 5) === 0) {
            await flexInYoutubeHomePage();
        }
    }

    async function search(title) {
        let formatTT = title.split(' ')
        formatTT = formatTT.filter((t) => t.length > 1)
        if (formatTT.length > 8) formatTT.splice(-Math.floor(Math.random() * 2) - 1)
        const key = formatTT.join('+')
        const url = 'https://www.youtube.com/results?search_query=' + key;
        console.log(url);
        await navigateToURL(tab, url, 8000);
    }

    async function watchVideo() {
        // click title
        await executeScript(tab.id, () => {
            document.getElementsByClassName('yt-simple-endpoint style-scope ytd-video-renderer')[0]?.click();
        })
        const wait = Math.floor((Math.random() * 57) + 35) * 1000; // 35 -> 91s

        // ALL code below excute done on $wait time

        const commentAt = Math.floor((Math.random() * 5) + 5) * 1000; // 5s -> 10s 
        await delay(commentAt);

        // comment
        if (Math.floor(Math.random() * 5) === 0) { // 20% comment
            await comment();
        };
        const commentTime = 6500; // 6.5s

        //scroll down
        await scrollDown();
        const scrollTime = 8000; // 8s

        await delay(wait - commentAt - commentTime - scrollTime);
    }

    async function comment() {
        await executeScript(tab.id, async () => {
            const comments = ["I really love it", "It's look insane!", "It make my day 🥰", ":)))))", 'Lol 🤣', "Come and see my boy 😆", "Some one tell me what happend 🥶", "OMG!!", "Ohh 😮", "Great :))))", "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂"]
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
            await delay(2000);
        });
    }

    async function scrollDown() {
        await executeScript(tab.id, async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const viewHeight = window.innerHeight;
            for (let i = 0; i < 5; i++) {
                window.scrollBy(0, viewHeight);
                await delay(1000)
            }
            await delay(3000);
            window.scrollBy(0, -(viewHeight * 5 + 400));
        })
    }
}

async function flexInYoutubeHomePage() {
    const tab = Tab.getSavedTab();
    await navigateToURL(tab, "https://www.youtube.com/");
    await executeScript(tab.id, async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const viewHeight = window.innerHeight;
        for (let i = 0; i < 5; i++) {
            window.scrollBy(0, viewHeight);
            await delay(1400)
        }
    })
}