"use strict";

function InjectLanguage()
{
    document.getElementById("tabTitle").innerText = browser.i18n.getMessage("onboard_TabTitle");
    document.getElementById("extensionName").innerText = browser.i18n.getMessage("extensionName");
    document.getElementById("installThanks").innerText = browser.i18n.getMessage("onboard_InstallThanks");
    document.getElementById("explainerOne").innerText = browser.i18n.getMessage("onboard_ExplainerOne");
    document.getElementById("explainerTwo").innerText = browser.i18n.getMessage("onboard_ExplainerTwo");
    document.getElementById("explainerThree").innerText = browser.i18n.getMessage("onboard_ExplainerThree");
    document.getElementById("newWindowTitle").innerText = browser.i18n.getMessage("menuItem_NewWindow");
    document.getElementById("newWindowExplain").innerText = browser.i18n.getMessage("onboard_NewWindowExplain");
    document.getElementById("refreshTitle").innerText = browser.i18n.getMessage("menuItem_Refresh");
    document.getElementById("refreshExplain").innerText = browser.i18n.getMessage("onboard_RefreshExplain");
    document.getElementById("closeTitle").innerText = browser.i18n.getMessage("menuItem_Close");
    document.getElementById("closeExplain").innerText = browser.i18n.getMessage("onboard_CloseExplain");
	document.getElementById("optionsHeader").innerText = browser.i18n.getMessage("onboard_OptionsHeader");
    document.getElementById("currentWindowTitle").innerText = `${browser.i18n.getMessage("options_CurrentWindow")} ${browser.i18n.getMessage("onboard_EnabledByDefault")}`;
	document.getElementById("currentWindowExplain").innerText = browser.i18n.getMessage("onboard_CurrentWindowExplain");
    document.getElementById("exceptActiveTitle").innerText = `${browser.i18n.getMessage("options_ExceptActive")} ${browser.i18n.getMessage("onboard_DisabledByDefault")}`;
	document.getElementById("exceptActiveExplain").innerText = browser.i18n.getMessage("onboard_ExceptActiveExplain");
    document.getElementById("bypassCacheTitle").innerText = `${browser.i18n.getMessage("options_BypassCache")} ${browser.i18n.getMessage("onboard_DisabledByDefault")}`;
    document.getElementById("bypassCacheExplain").innerText = browser.i18n.getMessage("onboard_BypassCacheExplain");
    document.getElementById("firefoxStore").innerText = browser.i18n.getMessage("onboard_FirefoxStore");
    document.getElementById("github").innerText = browser.i18n.getMessage("onboard_Github");
}

InjectLanguage();