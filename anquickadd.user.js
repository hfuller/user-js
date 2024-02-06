// ==UserScript==
// @name         ActionNetwork quick add activists
// @namespace    http://github.com/hfuller/user-js
// @updateURL    https://github.com/hfuller/user-js/raw/master/anquickadd.user.js
// @downloadURL  https://github.com/hfuller/user-js/raw/master/anquickadd.user.js
// @version      4
// @description  Make it easy to add a bunch of activists at once, such as when transcribing a sign up sheet
// @author       Hunter Fuller <hfuller@pixilic.com>
// @match        https://actionnetwork.org/user_search/group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=actionnetwork.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("welcome to my usered script");

    let justAdded = false;
    if ( localStorage.getItem('hfuller_justadded') ) {
        console.log("Activist just added");
        localStorage.removeItem('hfuller_justadded');
        justAdded = true;
    }

    if ( document.location.href.endsWith("/new_user") ) {
        console.log("focusing");
        document.getElementById("user_first_name").focus();

        console.log("Adding submit hook");
        document.getElementsByTagName('form')[0].addEventListener('submit', function(){
            console.log("We are in the submit hook");
            let sourceCode = document.getElementById('source_code_source_code').value;
            console.log("Saving source code into local storage - " + sourceCode);
            localStorage.setItem('hfuller_sourcecode', sourceCode);
            localStorage.setItem('hfuller_justadded', true);
        });

        console.log("Populating source code from local storage");
        document.getElementById('source_code_source_code').value = localStorage.getItem("hfuller_sourcecode");
    } else if ( document.location.href.includes("/user_search/") ) {
        console.log("Adding Add Activist link to breadcrumbs");
        let breadcrumbs = document.getElementsByClassName("step_complete");
        //console.log(breadcrumbs);
        //breadcrumbs[breadcrumbs.length-1].href = "new_user";
        //breadcrumbs[breadcrumbs.length-1].innerHTML = "Add Activist";
        let newcrumb = breadcrumbs[breadcrumbs.length-1].cloneNode();
        newcrumb.href = "new_user";
        newcrumb.innerHTML = "Add Activist";
        breadcrumbs[breadcrumbs.length-1].parentElement.insertBefore(newcrumb, breadcrumbs[breadcrumbs.length-1].nextSibling);
        if ( justAdded ) {
            newcrumb.click();
        }

        let search = document.getElementById('search_user_field');
        console.log(search);
        if ( search ) {
            console.log('focusing');
            search.focus();
        }

        for ( let button of document.getElementsByClassName("button") ) {
            if ( button.innerHTML == "View Record" ) {
                let newbutton = document.createElement('a');
                newbutton.innerHTML = "Edit";
                newbutton.href = button.href + "?gotoedit";
                //newbutton.classList = "button"; //infinite loop because getElementsByClassName is being lazily evaluated somehow?!?!?!?!!
                newbutton.classList = "tempbutton";
                button.parentElement.insertBefore(newbutton, button);
            }
        }
        window.setInterval(function() {
            for ( let button of document.getElementsByClassName("tempbutton") ) {
                button.classList = "button";
            }
        }, 200);

        if ( document.title.startsWith("View Activist") && window.location.search == "?gotoedit" ) {
            for ( let el of document.getElementsByClassName("button") ) {
                if ( el.innerHTML == "Edit Activist" ) {
                    document.getElementsByTagName("body")[0].style.display = "none";
                    history.replaceState(null, "", window.location.pathname);
                    el.click();
                }
            }
        }
    }

})();
