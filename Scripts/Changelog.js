"use strict";

function InjectImages() {
    document.getElementById("1.0.0 Image").setAttribute("src", browser.runtime.getURL("Icons/Icon_Released.png"));
    document.getElementById("1.1.0 Image").setAttribute("src", browser.runtime.getURL("Icons/Icon_Upcoming.png"));
}

document.addEventListener("DOMContentLoaded", InjectImages);