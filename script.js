const input = document.getElementById("input");
const characterDisplay = document.getElementById("characters");
const wordDisplay = document.getElementById("words");
const lineDisplay = document.getElementById("lines");

// After this many characters, disable features to not crash computer
const lagLimit = 50000;

async function CountCharacters() {
    // Character Count
    const v = input.value;
    const c = v.length;

    ReduceLag(c);

    // Plural or singular
    const word = `Character${c == 1 ? '' : 's'}`;
    //On page
    characterDisplay.innerHTML = `<b class='number'>${c}</b> ${word}`;

    //Title
    if (c <= 0) {
        document.title = `Just a Character Counter`;
    } else {
        document.title = `${c} ${word}`;
    }

    // Count words and lines, but only under a certain amount of characters
    if (c < lagLimit) {
        requestIdleCallback(() => {
            const words = CountWords(v);
            wordDisplay.innerHTML = `<b class=number>${words}</b> Word${words == 1 ? "" : "s"}`

            const lines = CountLines(v);
            lineDisplay.innerHTML = `<b class=number>${lines}</b> Line${lines == 1 ? "" : "s"}`
        })
    } else {
        wordDisplay.innerHTML = "";
        lineDisplay.innerHTML = "";
    }
}

//Thanks: https://stackoverflow.com/a/37493957/13657726
function CountWords(str) {
    const m = str.match(/[^\s]+/g)
    return m ? m.length : 0;
}

function CountLines(str) {
    //No text = no lines
    if (str.length <= 0) {
        return 0;
        //Otherwise count line break character
    } else {
        return lines = (String(str).match(/\n/g) || '').length + 1;
    }
}

// With a lot of characters, disable TextArea functionality to improve performance (hoperfully)
function ReduceLag(charCount) {
    if (charCount > lagLimit) {
        input.autocomplete = "no";
        input.autocorrect = "no";
        input.autocapitalize = "no";
        input.spellcheck = false;

    } else {
        input.autocomplete = "yes";
        input.autocorrect = "yes";
        input.autocapitalize = "yes";
        input.spellcheck = "default";
    }
}

//Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
function dropHandler(ev) {
    input.className = "";

    // Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                ReadFile(file);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
            ReadFile(file);
        });
    }
}

// Something to do with blobs
async function ReadFile(file) {
    const text = await file.text();

    input.value += text;
    CountCharacters();
}

function DragEnter() {
    input.className = "dropTarget";
}

function DragLeave() {
    input.className = "";
}


input.addEventListener('input', () => CountCharacters());

CountCharacters();