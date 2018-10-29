let menu = null;
let highlightMenu = null;

let menuVisible = false;
let highlightMenuVisible = false;
let selectedHighlighedId = null;

let sText = null;
let sElement = null;
let eText = null;
let eElement = null;

let highlighted = [];
let highlightedId = 1;

const toggleMenu = (command, target) => {
    console.log(command);
    menu.style.display = command === "show" ? "block" : "none";
    if (target == "menu") {
        document.querySelector("#highlight").style.display = "block";
        document.querySelector("#remove").style.display = "none";
    }
    else if (target == "highlightMenu") {
        document.querySelector("#highlight").style.display = "none";
        document.querySelector("#remove").style.display = "block";        
    }
    menuVisible = !menuVisible;
};

const setPosition = ({ top, left }, target) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    toggleMenu("show", target);
};

let selectionEndTimeout = null;

window.onload = function() {
    menu = document.querySelector(".menu");
    highlightMenu = document.querySelector(".highlight-menu");

    document.onmousedown = function(e) {
        if(menuVisible) {
            toggleMenu("hide", "menu");
        }
    };

    $("#highlight").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        let nElement = sElement;
        const currentHighlightedId = highlightedId;
        while (nElement != eElement) {
            nElement.setAttribute('group', highlightedId);
            nElement.style.backgroundColor = "yellow";
            nElement.style.color = "black";

            nElement.oncontextmenu = function(e) {
                e.preventDefault();
                window.getSelection().empty();
    
                const origin = {
                    left: e.pageX,
                    top: e.pageY
                };
    
                setPosition(origin, "highlightMenu");
                selectedHighlighedId = currentHighlightedId;
            }

            nElement = nElement.nextElementSibling;
        }

        nElement.setAttribute('group', highlightedId);
        nElement.style.backgroundColor = "yellow";
        nElement.style.color = "black";
        
        nElement.oncontextmenu = function(e) {
            e.preventDefault();
            window.getSelection().empty();

            const origin = {
                left: e.pageX,
                top: e.pageY
            };

            setPosition(origin, "highlightMenu");
            selectedHighlighedId = currentHighlightedId;
        }

        let highlightedElements = document.querySelectorAll('div[group="' + currentHighlightedId + '"]');
        highlighted[currentHighlightedId] = highlightedElements;

        for (highlightedElement of highlightedElements) {
            highlightedElement.onmouseover = function(e) {
                for (tmp of highlightedElements) {
                    tmp.style.backgroundColor = "red";
                    tmp.style.color = "white";
                }
            }

            highlightedElement.onmouseout = function(e) {
                for (tmp of highlightedElements) {
                    tmp.style.backgroundColor = "yellow";
                    tmp.style.color = "black";
                }                
            }
        }

        highlightedId += 1;
        toggleMenu("hide", "menu");
    });

    $("#cancel").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        toggleMenu("hide", "menu");
    });

    $("#remove").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        let highlightedElements = document.querySelectorAll('div[group="' + selectedHighlighedId + '"]');
        console.log(highlightedElements);
        for (highlightedElement of highlightedElements) {
            let arr = highlightedElement.className.split(" ");
            arr.splice(arr.length-1, 1);
            highlightedElement.className = arr.join(" ");

            highlightedElement.style.backgroundColor = "white";
            highlightedElement.style.color = "black";
            highlightedElement.onmouseover = null;
            highlightedElement.onmouseout = null;
        }

        toggleMenu("hide", "highlightMenu");
    });

    document.onselectionchange = selectionChanged;
}

function selectionChanged(e) {
    console.log('sel changed');

    if (selectionEndTimeout) {
        clearTimeout(selectionEndTimeout);
    }

    selectionEndTimeout = setTimeout(function () {
        document.onmouseup = function(e) {
            if (document.getSelection().anchorNode) {
                range = document.getSelection().getRangeAt(0);

                sText = document.getSelection().anchorNode.data;
                sElement = document.getSelection().anchorNode.parentElement;
        
                eText = document.getSelection().extentNode.data;
                eElement = document.getSelection().extentNode.parentElement;

                if (range.toString().trim() != "") {
                    const origin = {
                        left: e.pageX,
                        top: e.pageY
                    };
                    
                    setPosition(origin, "menu");
                }
            }
        };
    }, 500);
}