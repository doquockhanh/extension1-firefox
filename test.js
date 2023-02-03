// const a = [];
// for (let i = 0; i < 2000; i++) {
//     a.push(Math.floor(Math.random() * 402));
// }
// console.log(Math.max(...a));
// console.log(Math.min(...a));

// const getMails = async () => {
//     const mail = await fetch('https://backend.techlab.asia/api/event/mail', {
//         method: 'POST',
//         mode: 'cors',
//         cache: 'no-cache',
//         credentials: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ firefox: true })
//     });

//     return mail.json();
// }

// console.log(getMails());

// chrome.runtime.onInstalled.addListener(function () {
//     chrome.contextMenus.create({
//         "id": "sampleContextMenu",
//         "title": "Sample Context Menu",
//         "contexts": ["selection"]
//     });
// });

// chrome.runtime.onInstalled.addListener(function () {
//     chrome.contextMenus.create({
//         "id": "sampleContextMenu",
//         "title": "Sample Context Menu",
//         "contexts": ["selection"]
//     });
// });

// // This will run when a bookmark is created.
// chrome.bookmarks.onCreated.addListener(function () {
//     // do something
// });

// chrome.runtime.onInstalled.addListener(function () {
//     // ERROR! Events must be registered synchronously from the start of
//     // the page.
//     chrome.bookmarks.onCreated.addListener(function () {
//         // do something
//     });
// });

// chrome.runtime.onMessage.addListener(function (message, sender, reply) {
//     chrome.runtime.onMessage.removeListener(event);
// });

// browser.webNavigation.onCompleted.addListener(function () {
//     alert("This is my favorite website!");
// }, { url: [{ urlMatches: 'https://www.google.com/' }] });

// chrome.runtime.onMessage.addListener(function (message, callback) {
//     if (message.data == "setAlarm") {
//         chrome.alarms.create({ delayInMinutes: 5 })
//     } else if (message.data == "runLogic") {
//         chrome.tabs.executeScript({ file: 'logic.js' });
//     } else if (message.data == "changeColor") {
//         chrome.tabs.executeScript(
//             { code: 'document.body.style.backgroundColor="orange"' });
//     };
// });


async function navigate(url, callback) {
    const filter = { url: [{ urlMatches: url }] }
    browser.webNavigation.onCompleted.addListener(callback, filter);
}
