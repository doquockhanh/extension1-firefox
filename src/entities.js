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