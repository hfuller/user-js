// ==UserScript==
// @name         ActionNetwork quick add activists
// @namespace    http://github.com/hfuller/user-js
// @updateURL    https://github.com/hfuller/user-js/raw/master/anquickadd.user.js
// @downloadURL  https://github.com/hfuller/user-js/raw/master/anquickadd.user.js
// @version      2
// @description  Make it easy to add a bunch of activists at once, such as when transcribing a sign up sheet
// @author       Hunter Fuller <hfuller@pixilic.com>
// @match        https://actionnetwork.org/user_search/group/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=actionnetwork.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if ( document.location.href.endsWith("/new_user") ) {
        console.log("focusing");
        document.getElementById("user_first_name").focus();

        console.log("Adding submit hook");
        document.getElementsByTagName('form')[0].addEventListener('submit', function(){
            console.log("We are in the submit hook");
            let sourceCode = document.getElementById('source_code_source_code').value;
            console.log("Saving source code into local storage - " + sourceCode);
            localStorage.setItem('hfuller_sourcecode', sourceCode);
        });

        console.log("Populating source code from local storage");
        document.getElementById('source_code_source_code').value = localStorage.getItem("hfuller_sourcecode");
    } else if ( document.location.href.includes("/user_search/") ) {
        console.log("Adding Add Activist link to breadcrumbs");
        let breadcrumbs = document.getElementsByClassName("step_complete");
        //console.log(breadcrumbs);
        //breadcrumbs[breadcrumbs.length-1].href = "new_user";
        //breadcrumbs[breadcrumbs.length-1].innerHTML = "Add Activist";
        let el = breadcrumbs[breadcrumbs.length-1].cloneNode();
        el.href = "new_user";
        el.innerHTML = "Add Activist";
        breadcrumbs[breadcrumbs.length-1].parentElement.insertBefore(el, breadcrumbs[breadcrumbs.length-1].nextSibling);

    }

})();
