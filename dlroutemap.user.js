// ==UserScript==
// @name         DL Route Map Optimizer
// @namespace    http://github.com/hfuller/user-js
// @updateURL    https://github.com/hfuller/user-js/raw/main/dlroutemap.user.js
// @downloadURL  https://github.com/hfuller/user-js/raw/main/dlroutemap.user.js
// @version      6
// @description  Make the route map not so... scrolly...
// @author       Hunter Fuller <hfuller@pixilic.com>
// @match        https://www.delta.com/*/route-map
// @icon         https://www.google.com/s2/favicons?sz=64&domain=delta.com
// @grant        GM_addElement
// ==/UserScript==

(function() {
    'use strict';

    console.log("Fixing up styling.");
    for ( let thing of ['inspire-sub-nav', 'delta-logo-container', 'intro'] ) {
        for ( let el of document.getElementsByClassName(thing) ) {
            el.style.display = "none";
        }
    }
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';

    console.log("Adding lib");
    GM_addElement('script', {
        src: 'https://unpkg.com/tabulator-tables@5.5.0/dist/js/tabulator.min.js',
        type: 'text/javascript'
    });
    GM_addElement('link', {
        rel: 'stylesheet',
        href: 'https://unpkg.com/tabulator-tables@5.5.0/dist/css/tabulator.min.css'
    });

    setTimeout(function() {
        for ( let el of document.getElementsByClassName('container-custom') ) {
            console.log("We are going to dink with the container");
            el.style.margin = '0px';
            for ( let kid of el.firstChild.childNodes ) {
                console.log(kid);
                if ( kid.classList.contains('result-panel') ) {
                    kid.classList = 'col-md-4 result-panel';
                } else {
                    kid.classList = 'col-md-8';
                }
                kid.style.padding = "0px !important";
                kid.style.margin = "0px !important";
            }

            let map = document.getElementById("map");
            let notmap = map.cloneNode();
            notmap.id = "notmap";
            notmap.style.display = "none";
            map.parentElement.insertBefore(notmap, map);
        }

        for ( let el of document.getElementsByClassName('close') ) {
            el.click();
        }

        for ( let el of document.getElementsByClassName("mat-button-wrapper") ) {
            el.addEventListener('click', function() {
                document.getElementsByTagName('main')[0].style.zIndex = 999; //just below calendar which is at 1000
            });
        }

        document.getElementsByClassName('search-button')[0].addEventListener('click', function() {
            document.getElementById("notmap").style.display = "none";
            document.getElementById("map").style.display = "block";

            console.log("Saving");
            localStorage.setItem('hfuller_origin', document.getElementById('Origin').value);
            localStorage.setItem('hfuller_destination', document.getElementById('Destination').value);
            localStorage.setItem('hfuller_type', document.getElementById('mat-input-0').value);
            for ( let el of document.getElementsByClassName('mat-start-date') ) { localStorage.setItem('hfuller_mat-start-date', el.value); }
            for ( let el of document.getElementsByClassName('mat-end-date') ) { localStorage.setItem('hfuller_mat-end-date', el.value); }
            localStorage.setItem('hfuller_depart', document.getElementById('mat-input-1').value);

            setTimeout(function() {
                let tabulate = document.getElementsByClassName('title')[1]; //HACK
                tabulate.innerHTML = "Make Table";
                tabulate.addEventListener('click', makeFlightTable);
            }, 1500);
        });
        document.getElementsByClassName('search-button')[0].nextSibling.remove();

        /*
        document.getElementById('Origin').value = localStorage.getItem('hfuller_origin');
        document.getElementById('Destination').value = localStorage.getItem('hfuller_destination');
        document.getElementById('mat-input-1').value = localStorage.getItem('hfuller_depart');
        document.getElementById('mat-input-0').value = localStorage.getItem('hfuller_type');
        for ( let el of document.getElementsByClassName('mat-start-date') ) { el.value = localStorage.getItem('hfuller_mat-start-date'); }
        for ( let el of document.getElementsByClassName('mat-end-date') ) { el.value = localStorage.getItem('hfuller_mat-end-date'); }
        */
    }, 1000);

    /*
    console.log("Adding lib");
    let fileref = document.createElement('script');
    fileref.id = "hfLib";
    fileref.src = "https://unpkg.com/tabulator-tables@5.5.0/dist/js/tabulator.min.js";
    document.getElementsByTagName("head")[0].appendChild(fileref);
    let fileref2 = document.createElement('link');
    fileref2.rel = "stylesheet";
    fileref2.href = "https://unpkg.com/tabulator-tables@5.5.0/dist/css/tabulator.min.css";
    document.getElementsByTagName("head")[0].appendChild(fileref2);
    */


    window.makeFlightTable = function() {

        let flights = [];
        for ( let el of document.getElementsByClassName('flight-code') ) {
            let first = true;
            let flight = null;
            for ( let row of el.parentElement.parentElement.parentElement.getElementsByClassName('details-row') ) {
                if ( row.firstChild.innerText.startsWith('DL') ) {
                    if ( flight != null ) {
                        flights.push(flight);
                    }
                    flight = {"1st":first ? "TRUE" : "", "number": row.firstChild.innerText};
                    first = false;
                } else {
                    flight[row.firstChild.innerText] = row.lastChild.innerText;
                }
            }
            flights.push(flight);
        }
        console.log(flights);
        new Tabulator('#notmap', { data: flights, autoColumns: true });
        document.getElementById("map").style.display = "none";
        let notmap = document.getElementById("notmap");
        notmap.style.display = "block";
        notmap.style.height = "100%";
        setTimeout(function() {
            for ( let el of document.getElementsByClassName("tabulator-tableholder") ) {
                el.style.overflow = "scroll";
                el.style.paddingBottom = "16px";
            }
        }, 1000);
        let main = document.getElementsByTagName('main')[0];
        main.style.margin = "0px";
        main.style.position = "absolute";
        main.style.top = "0px";
        main.style.height = "100%";
        main.style.background = "white";
        main.style.zIndex = "931857895797";
        for ( let el of document.getElementsByClassName("zoom-container") ) { el.style.display = "none"; }
        for ( let el of document.getElementsByClassName("legend-box") ) { el.style.display = "none"; }

    };

})();
