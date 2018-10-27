var selectionEndTimeout = null;
var range = null;

const menu = document.querySelector(".menu");
let menuVisible = false;

const toggleMenu = command => {
    console.log(command);
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
};

window.onload = function () {
    document.onmousedown = function(e) {
        if(menuVisible) {
            toggleMenu("hide");
            menuSelectionEnabled = false;
        }
    };

    $("#highlight").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        var span = document.createElement('span');
        span.className = 'highlight';
        span.appendChild(range.extractContents());
        range.insertNode(span);

        toggleMenu("hide");
    });

    $("#cancel").on('mousedown', function(e) {
        e.preventDefault();
        window.getSelection().empty();

        toggleMenu("hide");
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
                        
                        setPosition(origin);
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