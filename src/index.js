var selectionEndTimeout = null;
var range = null;

const menu = document.querySelector(".menu");
const highlightMenu = document.querySelector(".highlight-menu");

let menuVisible = false;
let highlightMenuVisible = false;
let selectedSpan = null;

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

window.onload = function () {
    document.onmousedown = function(e) {
        if(menuVisible) {
            toggleMenu("hide", "menu");
        }
    };

    $("#highlight").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        var span = document.createElement('span');
        span.className = 'highlight';
        span.appendChild(range.extractContents());
        range.insertNode(span);

        span.oncontextmenu = function(e) {
            e.preventDefault();
            window.getSelection().empty();

            const origin = {
                left: e.pageX,
                top: e.pageY
            };

            setPosition(origin, "highlightMenu");
            selectedSpan = span;
        } 

        toggleMenu("hide", "menu");
    });

    $("#cancel").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        toggleMenu("hide", "menu");
    });

    $("span").on('contextmenu', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        const origin = {
            left: e.pageX,
            top: e.pageY
        };

        setPosition(origin, "highlightMenu");
        selectedSpan = e.target;
    });

    $("#remove").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        toggleMenu("hide", "highlightMenu");

        selectedSpan.replaceWith(selectedSpan.innerHTML);
    });

    let test = document.querySelectorAll("d-byline div div");
    test[1].setAttribute("style", "display:none;");    
    test[2].setAttribute("style", "display:none");    

    document.onselectionchange = userSelectionChanged;
}

function userSelectionChanged(e) {
    if (selectionEndTimeout) {
        clearTimeout(selectionEndTimeout);
    }

    selectionEndTimeout = setTimeout(function () {
        document.onmouseup = function(e) {
            if (document.getSelection().anchorNode) {
                let selectedTagName = document.getSelection().anchorNode.parentElement.tagName;
            
                if (selectedTagName.toLowerCase() == "p") {
                    range = document.getSelection().getRangeAt(0);
                
                    if (range.toString().trim() != "") {
                        const origin = {
                            left: e.pageX,
                            top: e.pageY
                        };
                        
                        setPosition(origin, "menu");
                    }
                }
            }
        };
    }, 500);
}

function getSelectionText() {
    Offset = window.getSelection().anchorOffset;
    // extendOffset = window.getSelection().extentOffset;

    // baseElement = window.getSelection().baseNode.

    console.log("selection: " + window.getSelection().baseNode);
    return window.getSelection().toString();
}