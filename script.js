const input = document.getElementById("input");
const characterDisplay = document.getElementById("characters");

function CountCharacters() {
    // Character Count
    let c = input.value.length;
    // Plural or singular
    let word = `Character${c == 1 ? '' : 's'}`;
    //On page
    characterDisplay.innerHTML = `<b id='number'>${c}</b> ${word}`;

    //Title
    if (c <= 0) {
        document.title = `Just a Character Counter`;
    } else {
        document.title = `${c} ${word}`;
    }
}

CountCharacters();