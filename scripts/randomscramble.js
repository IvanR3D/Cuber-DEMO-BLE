import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";

let scramble = "";

async function setScramble() {
    scramble = await randomScrambleForEvent("333");
    document.getElementById("scramble-text").textContent = scramble.toString();
}

// Expose scramble globally
window.scramble = scramble;
window.setScramble = setScramble;