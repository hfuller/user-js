// ==UserScript==
// @name         ShittyStallionServerStatus
// @namespace    http://github.com/hfuller
// @version      1
// @description  dont even worry about it bro
// @author       Hunter Fuller
// @match        https://manage.buyvm.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyvm.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let els = document.getElementsByClassName("dashboard-vm");
    for ( let el of els ) {
        let vserverid = /[^/]*$/.exec(el.href)[0];
        console.log(vserverid);

        let x = new FormData();
        x.append("vserverid", vserverid);

        fetch("https://manage.buyvm.net/ajax/vserver/status", {body: x, method: "POST"}).then((response) => response.json()).then((result) => {
            console.log(result);
            el.innerHTML = el.innerHTML + " - " + result.status;
        });
    }
})();
