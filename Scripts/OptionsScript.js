"use strict";

let currentWindowElement,
    currentWindowOld,
    exceptActiveElement,
    exceptActiveOld,
    groupLocationOld,
    groupFirstElement,
    groupStartElement,
    groupEndElement,
    groupStartOld,
    bypassCacheElement,
    bypassCacheOld;

function PerformSetup() {

    function InjectLanguage() {
        document.getElementById("CurrentWindowTitle").innerText = browser.i18n.getMessage("options_CurrentWindow");
        document.getElementById("CurrentWindowDescription").innerText = browser.i18n.getMessage("options_CurrentWindowDescription");
        document.getElementById("ExceptActiveTitle").innerText = browser.i18n.getMessage("options_ExceptActive");
        document.getElementById("ExceptActiveDescription").innerText = browser.i18n.getMessage("options_ExceptActiveDescription");
        document.getElementById("GroupLocationTitle").innerText = browser.i18n.getMessage("options_GroupLocation");
        document.getElementById("GroupLocationDescription").innerText = browser.i18n.getMessage("options_GroupLocationDescription");
        document.getElementsByTagName("label")[0].innerText = browser.i18n.getMessage("options_GroupFirst");
        document.getElementsByTagName("label")[1].innerText = browser.i18n.getMessage("options_GroupStart");
        document.getElementsByTagName("label")[2].innerText = browser.i18n.getMessage("options_GroupEnd");
        document.getElementById("BypassCacheTitle").innerText = browser.i18n.getMessage("options_BypassCache");
        document.getElementById("BypassCacheDescription").innerText = browser.i18n.getMessage("options_BypassCacheDescription");
    }

    InjectLanguage();

    currentWindowElement = document.getElementById("CurrentWindowCheckbox");
    exceptActiveElement = document.getElementById("BypassCacheCheckbox");
    groupFirstElement = document.getElementById("GroupFirstRadio");
    groupStartElement = document.getElementById("GroupStartRadio");
    groupEndElement = document.getElementById("GroupEndRadio");
    bypassCacheElement = document.getElementById("ExceptActiveCheckbox");
    let storedSetting = browser.storage.local.get(["currentWindow", "exceptActive", "groupLocation", "bypassCache"]);

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

        switch (setting.groupLocation) {
            case "First":
                groupFirstElement.setAttribute("checked", "checked");
                groupStartElement.removeAttribute("checked");
                groupEndElement.removeAttribute("checked");
                break;
            case "Start":
                groupFirstElement.removeAttribute("checked");
                groupStartElement.setAttribute("checked", "checked");
                groupEndElement.removeAttribute("checked");
                break;
            case "End":
                groupFirstElement.removeAttribute("checked");
                groupStartElement.removeAttribute("checked");
                groupEndElement.setAttribute("checked", "checked");
                break;
            default:
                //First time execution or corruption.
                groupFirstElement.setAttribute("checked", "checked");
                groupStartElement.removeAttribute("checked");
                groupEndElement.removeAttribute("checked");
                break;

        }
        groupLocationOld = setting.groupLocation;

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

    let HandleExceptActiveChange = function() {
        let exceptActiveStatus = exceptActiveElement.checked;
        if (exceptActiveStatus !== exceptActiveOld) {
            exceptActiveOld = exceptActiveStatus;
            browser.storage.local.set({ exceptActive: exceptActiveStatus });
        }
    };

    let HandleGroupLocationChange = function() {

        let groupLocationStatus; //Determine this.

        if (groupFirstElement.checked) {
            groupLocationStatus = "First";
        } else if (groupStartElement.checked) {
            groupLocationStatus = "Start";
        } else {
            groupLocationStatus = "End";
        }

        if (groupLocationStatus !== groupLocationOld) {
            groupLocationOld = groupLocationStatus;
            browser.storage.local.set({ groupFromStart: groupLocationStatus });
        }
    }

    let HandleBypassCacheChange = function() {
        let bypassCacheStatus = bypassCacheElement.checked;
        if (bypassCacheStatus !== bypassCacheOld) {
            bypassCacheOld = bypassCacheStatus;
            browser.storage.local.set({ bypassCache: bypassCacheStatus });
        }
    };

    currentWindowElement.addEventListener("change", HandleCurrentWindowChange);
    exceptActiveElement.addEventListener("change", HandleExceptActiveChange);
    groupFirstElement.addEventListener("change", HandleGroupLocationChange);
    groupStartElement.addEventListener("change", HandleGroupLocationChange);
    groupEndElement.addEventListener("change", HandleGroupLocationChange);
    bypassCacheElement.addEventListener("change", HandleBypassCacheChange);
}

document.addEventListener("DOMContentLoaded", PerformSetup);