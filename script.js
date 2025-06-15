const input = document.getElementById("input");
const characterDisplay = document.getElementById("characters");
const wordDisplay = document.getElementById("words");
const lineDisplay = document.getElementById("lines");
const timeDisplay = document.getElementById("time");

// After this many characters, disable features to not crash computer
const lagLimit = 50000;

async function CountCharacters(selection) {
    // Character Count
    let v;
    if (selection != null) {
        v = selection;
    } else {
        v = input.value;
    }
    const characters = v.replaceAll("\n", "").length;

    ReduceLag(characters);

    // Plural or singular
    let word;
    if (selection != null) {
        word = `Selected`;
    } else {
        word = `Character${characters == 1 ? '' : 's'}`;
    }
    //On page
    characterDisplay.innerHTML = `<b class='number'>${characters}</b> ${word}`;

    //Title
    if (characters <= 0) {
        document.title = `Just a Character Counter`;
    } else {
        document.title = `${characters} ${word}`;
    }

    // Count words and lines, but only under a certain amount of characters
    if (characters < lagLimit) {
        requestIdleCallback(() => {
            const words = CountWords(v);
            wordDisplay.innerHTML = `<b class=number>${words}</b> Word${words == 1 ? "" : "s"}`

            const lines = CountLines(v);
            lineDisplay.innerHTML = `<b class=number>${lines}</b> Line${lines == 1 ? "" : "s"}`

            //Using word calculation, show aproximate time to speak (but only if over 1 minute long)
            const time = CountTime(words);

            if (time < 0.1) {
                timeDisplay.innerHTML = "<b class=number>0</b> Minutes"
            } else {
                timeDisplay.innerHTML = `~<b class=number>${time}</b> Minute${time == 1 ? "" : "s"}`
            }
        })
    } else {
        wordDisplay.innerHTML = "";
        lineDisplay.innerHTML = "";
        timeDisplay.innerHTML = "";
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

// Time to speak in minutes (assuming 140 words per minute)
function CountTime(wordCount) {
    let estimation = (wordCount / 140);
    //So only a couple words isn't shown as 0 seconds
    if (wordCount > 0 && estimation < 0.1) {
        estimation = 0.1;
    }
    return estimation.toFixed(1)
}

//User selects part of the text in the input box
let inSelectMode = false;
function CountSelectedCharacters() {
    const selection = window.getSelection().toString();
    if (selection.length <= 0) {
        EndSelectMode();
    } else {
        inSelectMode = true;
        CountCharacters(selection);
    }
}

function EndSelectMode() {
    if (inSelectMode) {
        inSelectMode = false;
        CountCharacters();
    }
}

function EndIfNoSelection() {
    if (window.getSelection().toString().length <= 0) {
        EndSelectMode();
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
input.addEventListener('selectionchange', () => CountSelectedCharacters());
input.addEventListener('blur', () => EndIfNoSelection());

CountCharacters();