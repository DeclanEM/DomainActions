"use strict";

function InjectImages() {
    document.getElementById("1.0.0 Image").setAttribute("src", browser.runtime.getURL("Resources/Icons/Icon_Released.png"));
    document.getElementById("1.1.0 Image").setAttribute("src", browser.runtime.getURL("Resources/Icons/Icon_Latest.png"));
    document.getElementById("1.2.0 Image").setAttribute("src", browser.runtime.getURL("Resources/Icons/Icon_Upcoming.png"));
}

document.addEventListener("DOMContentLoaded", InjectImages);