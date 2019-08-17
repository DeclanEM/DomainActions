"use strict";

let currentWindowElement = null;
let currentWindowOld = null;
let bypassCacheElement = null;
let bypassCacheOld = null;
let exceptActiveElement = null;
let exceptActiveOld = null;

function PerformSetup() {
    document.getElementById("CurrentWindowTitle").innerText = browser.i18n.getMessage("options_CurrentWindow");
    document.getElementById("CurrentWindowDescription").innerText = browser.i18n.getMessage("options_CurrentWindowDescription");
    document.getElementById("ExceptActiveTitle").innerText = browser.i18n.getMessage("options_ExceptActive");
    document.getElementById("ExceptActiveDescription").innerText = browser.i18n.getMessage("options_ExceptActiveDescription");
    document.getElementById("BypassCacheTitle").innerText = browser.i18n.getMessage("options_BypassCache");
    document.getElementById("BypassCacheDescription").innerText = browser.i18n.getMessage("options_BypassCacheDescription");

    currentWindowElement = document.getElementById("CurrentWindowCheckbox");
    bypassCacheElement = document.getElementById("ExceptActiveCheckbox");
    exceptActiveElement = document.getElementById("BypassCacheCheckbox");
    let storedSetting = browser.storage.local.get(["currentWindow", "bypassCache", "exceptActive"]);

    storedSetting.then((setting) => {
        switch (setting.currentWindow) {
            case true:
                currentWindowElement.setAttribute("checked", "checked");
                break;
            case false:
                currentWindowElement.removeAttribute("checked");
                break;
            default:
                //First time execution or corruption.
                currentWindowElement.setAttribute("checked", "checked");
                break;
        }
        currentWindowOld = setting.currentWindow;

        switch (setting.bypassCache) {
            case true:
                bypassCacheElement.setAttribute("checked", "checked");
                break;
            case false:
                bypassCacheElement.removeAttribute("checked");
                break;
            default:
                //First time execution or corruption.
                bypassCacheElement.removeAttribute("checked");
                break;
        }
        bypassCacheOld = setting.bypassCache;

        switch (setting.exceptActive) {
            case true:
                exceptActiveElement.setAttribute("checked", "checked");
                break;
            case false:
                exceptActiveElement.removeAttribute("checked");
                break;
            default:
                //First time execution or corruption.
                exceptActiveElement.removeAttribute("checked");
                break;
        }
        exceptActiveOld = setting.exceptActive;
    });

    CreateListeners();
}

function CreateListeners() {
    let HandleCurrentWindowChange = function() {
        let currentWindowStatus = currentWindowElement.checked;
        if (currentWindowStatus !== currentWindowOld) {
            currentWindowOld = currentWindowStatus;
            browser.storage.local.set({ currentWindow: currentWindowStatus });
        }
    };

    let HandleBypassCacheChange = function() {
        let bypassCacheStatus = bypassCacheElement.checked;
        if (bypassCacheStatus !== bypassCacheOld) {
            bypassCacheOld = bypassCacheStatus;
            browser.storage.local.set({ bypassCache: bypassCacheStatus });
        }
    };

    let HandleExceptActiveChange = function() {
        let exceptActiveStatus = exceptActiveElement.checked;
        if (exceptActiveStatus !== exceptActiveOld) {
            exceptActiveOld = exceptActiveStatus;
            browser.storage.local.set({ exceptActive: exceptActiveStatus });
        }
    };

    currentWindowElement.addEventListener("change", HandleCurrentWindowChange);
    bypassCacheElement.addEventListener("change", HandleBypassCacheChange);
    exceptActiveElement.addEventListener("change", HandleExceptActiveChange);
}

document.addEventListener("DOMContentLoaded", PerformSetup);