"use strict";

let settings;
let extensionName = browser.i18n.getMessage("extensionName");
let warning_NoTabs = browser.i18n.getMessage("warning_NoTabs");

async function GetSettings() {
    let value = await browser.storage.local.get(["currentWindow", "exceptActive", "groupLocation", "bypassCache"]);
    //Defines settings as either a set value from storage or a default value.
    return {
        "currentWindow": ((value.currentWindow === undefined) ? true : value.currentWindow),
        "exceptActive": ((value.exceptActive === undefined) ? false : value.exceptActive),
        "groupLocation": ((value.groupLocation === undefined) ? "First" : value.groupLocation),
        "bypassCache": ((value.bypassCache === undefined) ? false : value.bypassCache)
    };
}

function CreateMenuItems() {
    browser.contextMenus.create({
        id: "DomainActionsMenuItem",
        contexts: ["page"],
        title: extensionName
    });

    browser.contextMenus.create({
        id: "DomainActionsNewWindow",
        icons: {
            "16": "Icons/Icon_NewWindow.svg"
        },
        parentId: "DomainActionsMenuItem",
        contexts: ["page"],
        title: browser.i18n.getMessage("menuItem_NewWindow")
    });

    browser.contextMenus.create({
        id: "DomainActionsGroupTabs",
        icons: {
            "16": "Icons/Icon_GroupTabs.svg"
        },
        parentId: "DomainActionsMenuItem",
        contexts: ["page"],
        title: browser.i18n.getMessage("menuItem_GroupTabs")
    });

    browser.contextMenus.create({
        id: "DomainActionsRefreshTabs",
        icons: {
            "16": "Icons/Icon_Refresh.svg"
        },
        parentId: "DomainActionsMenuItem",
        contexts: ["page"],
        title: browser.i18n.getMessage("menuItem_Refresh")
    });

    browser.contextMenus.create({
        id: "DomainActionsCloseTabs",
        icons: {
            "16": "Icons/Icon_Close.svg"
        },
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
            case "DomainActionsGroupTabs":
                querying.then(GroupTabs);
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

function GroupTabs(tabs) {
    if (tabs.length < 1) {
        console.warn(warning_NoTabs);
        return;
    }
    let tabIds = tabs.map(tabInfo => tabInfo.id);

    switch (settings.groupLocation)
    {
        case "Start":
            //TO-DO: Implement fix for Pinned Tabs.
            browser.tabs.move(tabIds, { index: 0 });
            break;
        case "First":
            let baseTabId = tabIds.shift();
            if (tabIds.length < 1) {
                console.warn(warning_NoTabs);
                return;
            }
            let baseTab = browser.tabs.get(baseTabId);
            baseTab.then(function(result)
            {
                browser.tabs.move(tabIds, { index: result.index });
            });
            break;
        case "End":
            browser.tabs.move(tabIds, { index: -1 });
            break;
    }
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

CreateMenuItems();

browser.contextMenus.onClicked.addListener(OnClickedListener);
browser.runtime.onInstalled.addListener(InstalledHandler);
browser.notifications.onClicked.addListener(NotificationClickHandler);