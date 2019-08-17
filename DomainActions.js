"use strict";

let extensionName = browser.i18n.getMessage("extensionName");
let warning_NoTabs = browser.i18n.getMessage("warning_NoTabs");

async function GetSettings() {
    let value = await browser.storage.local.get(["currentWindow", "bypassCache", "exceptActive"]);
    return { "currentWindow": value.currentWindow, "bypassCache": value.bypassCache, "exceptActive": value.exceptActive };
}

function CreateMenuItems() {
    browser.contextMenus.create({
        id: "DomainActionsMenuItem",
        contexts: ["page"],
        title: extensionName
    });

    browser.contextMenus.create({
        id: "DomainActionsNewWindow",
        parentId: "DomainActionsMenuItem",
        contexts: ["page"],
        title: browser.i18n.getMessage("menuItem_NewWindow")
    });

    browser.contextMenus.create({
        id: "DomainActionsRefreshTabs",
        parentId: "DomainActionsMenuItem",
        contexts: ["page"],
        title: browser.i18n.getMessage("menuItem_Refresh")
    });

    browser.contextMenus.create({
        id: "DomainActionsCloseTabs",
        parentId: "DomainActionsMenuItem",
        contexts: ["page"],
        title: browser.i18n.getMessage("menuItem_Close")
    });
}

async function OnClickedListener(info, tab) {
    let matches = tab.url.match(/^https?\:\/\/(?:www\.)?([^\/:?#]+)(?:[\/:?#]|$)/i);
    let domain = matches && matches[1];

    if (domain === null) {
        console.warn(browser.i18n.getMessage("warning_NoDomain"));
        return;
    } else {
        settings = await GetSettings();
        let querying;
        if (settings.exceptActive) {
            querying = browser.tabs.query({ url: ["*://*." + domain + "/*"], active: false, currentWindow: settings.currentWindow });
        } else {
            querying = browser.tabs.query({ url: ["*://*." + domain + "/*"], currentWindow: settings.currentWindow });
        }

        switch (info.menuItemId) {
            case "DomainActionsNewWindow":
                querying.then(MoveToNewWindow);
                break;
            case "DomainActionsRefreshTabs":
                querying.then(RefreshTabs);
                break;
            case "DomainActionsCloseTabs":
                querying.then(CloseTabs);
                break;
            default:
                return;
        }
    }
}

function MoveToNewWindow(tabs) {
    if (tabs.length < 1) {
        console.warn(warning_NoTabs);
        return;
    }
    let tabIds = tabs.map(tabInfo => tabInfo.id);

    let newWindow = browser.windows.create({
        state: "maximized",
        tabId: tabIds.shift()
    });

    if (tabIds.length < 1) { return; }

    newWindow.then((windowInfo) => {
        browser.tabs.move(tabIds, { windowId: windowInfo.id, index: -1 });
    });
}

function RefreshTabs(tabs) {
    if (tabs.length < 1) {
        console.warn(warning_NoTabs);
        return;
    }
    let tabIds = tabs.map(tabInfo => tabInfo.id);

    for (let tabId of tabIds) {
        browser.tabs.reload(tabId, { "bypassCache": settings.bypassCache });
    }
}

function CloseTabs(tabs) {
    if (tabs.length < 1) {
        console.warn(warning_NoTabs);
        return;
    }
    let tabIds = tabs.map(tabInfo => tabInfo.id);
    browser.tabs.remove(tabIds);
}

function InstalledHandler(details) {
    if (details.reason === "update") {
        browser.notifications.create(
            "UpdateNotification", {
                "iconUrl": browser.runtime.getURL("Icons/Icon_96.png"),
                "message": browser.i18n.getMessage("notification_UpdateText"),
                "title": extensionName,
                "type": "basic"
            });
    } else if (details.reason === "install") {
        browser.notifications.create(
            "InstallNotification", {
                "iconUrl": browser.runtime.getURL("Icons/Icon_96.png"),
                "message": browser.i18n.getMessage("notification_InstallText"),
                "title": extensionName,
                "type": "basic"
            });
    }
};

function NotificationClickHandler(id, index) {
    browser.notifications.clear(id);

    if (id === "UpdateNotification") {
        browser.tabs.create({ url: browser.runtime.getURL("Scripts/Changelog.html") });
    } else if (id === "InstallNotification") {
        browser.tabs.create({ url: browser.runtime.getURL("Scripts/Onboard.html") });
    }
}

let settings = { "currentWindow": true, "bypassCache": false, "exceptActive": false };
CreateMenuItems();

browser.contextMenus.onClicked.addListener(OnClickedListener);
browser.runtime.onInstalled.addListener(InstalledHandler);
browser.notifications.onClicked.addListener(NotificationClickHandler);