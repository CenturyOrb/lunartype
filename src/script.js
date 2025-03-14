const visualizer = document.querySelector('#visualizer');

let previousRow = -1;
let previousInput = '';
let currentInput = '';

const test = [
  "both", "banana", "cherry", "dog", "elephant", "flower", "guitar", "happy", "ice", "jungle",
  "kangaroo", "lemon", "mountain", "notebook", "ocean", "pencil", "queen", "rainbow", "sun", "tiger",
  "umbrella", "violin", "whale", "xylophone", "yogurt", "zebra", "airplane", "butterfly", "candle",
  "dragon", "engine", "forest", "giraffe", "horizon", "island", "jacket", "kitchen", "lantern",
  "magnet", "night", "octopus", "pyramid", "quartz", "robot", "satellite", "tornado", "universe",
  "volcano", "wizard", "xenon", "yawn", "zeppelin", "anchor", "bubble", "cactus", "diamond",
  "explore", "feather", "glacier", "harmony", "insect", "jigsaw", "kingdom", "lighthouse",
  "mystery", "nebula", "orchestra", "parrot", "quiver", "rocket", "symphony", "treasure", "utopia",
  "vortex", "whisper", "xylitol", "yonder", "zeppelin", "avocado", "balloon", "crystal", "dolphin",
  "emerald", "firefly", "goblin", "hurricane", "illusion", "journey", "koala", "labyrinth", "meadow",
  "nectar", "onyx", "penguin", "quasar", "radiant", "safari", "twilight", "umbrella", "velocity",
  "whimsical", "xenophile", "yogurt", "zeppelin", "alchemy", "breeze", "cascade", "delight",
  "enigma", "fortune", "graceful", "horizon", "infinity", "jubilant", "kaleidoscope", "lunar",
  "miracle", "nirvana", "opulence", "phenomenon", "quirky", "resonance", "serendipity", "tranquil",
  "unravel", "vivacious", "wanderlust", "xenogenesis", "yearning", "zenith", "aurora", "bountiful",
  "charisma", "destiny", "euphoria", "fascinate", "glorious", "halcyon", "idyllic", "jovial",
  "kindred", "luminous", "melody", "nostalgia", "overture", "panorama", "quintessence", "rhapsody",
  "sublime", "timeless", "unison", "vivid", "whirlwind", "xenophobic", "yonder", "zephyr",
  "arcadia", "bliss", "celestial", "daydream", "effervescent", "fable", "golden", "haven", "incantation",
  "jubilation", "kismet", "labyrinthine", "mystical", "noble", "oracle", "paradox", "quasar",
  "reverie", "sonnet", "talisman", "utmost", "verve", "wistful", "xylophonist", "yesteryear", "zen"
];

// add detected to finishing the last word of the second line
// this should be done on the spacePress function
document.addEventListener('keydown', (event) => {
    let activeWord = document.querySelector('.active');
    const key = event.key;
    if (event.code === `Key${key.toUpperCase()}`) letterPress(key, activeWord); 
    else if (key === 'Backspace') backspacePress(activeWord);
    else if (key === ' ') spacePress(activeWord);
});

occupyVisuals(test);

function letterPress(key, activeWord) { 
    const currentLetter = currentLetterNode(activeWord);
    
    // user enters in extra characters
    if (!currentLetter) { 
        const letterdiv = document.createElement('div'); 
        letterdiv.textContent = key;                    
        letterdiv.classList.add('letter');               
        letterdiv.classList.add('extra');
        activeWord.appendChild(letterdiv);                  
    }
    // user enters in correct or wrong character
    else if (currentLetter.textContent === key) 
        currentLetter.classList.toggle('correct');
    else currentLetter.classList.toggle('incorrect');
    currentInput += key;
}

function backspacePress(activeWord) {
    previousLetter = currentLetterNode(activeWord).previousSibling;
    if (activeWord.lastChild.classList.contains('extra')) activeWord.lastChild.remove(); // if there are extra letters
    else if (!currentLetterNode(activeWord)) { // if it's the last letter 
        if (activeWord.lastChild.classList.contains('correct')) 
            activeWord.lastChild.classList.toggle('correct');
        else activeWord.lastChild.classList.toggle('incorrect');
    }
    else if (activeWord.firstChild === currentLetterNode(activeWord)) {
        // swap active and typed classes of previous and active 
        const previousWord = activeWord.previousSibling;
        const error = Array.from(previousWord.childNodes).some((letter) => {
            return letter.classList.contains('incorrect') || letter.classList.contains('extra');
        });
        if (previousWord && error) { 
            activeWord.classList.toggle('active');
            previousWord.classList.toggle('active'); 
            previousWord.classList.toggle('typed');
        }
    }
    else { // if inside the word 
        toggleCorrect(previousLetter);
    }
    currentInput = currentInput.slice(0, -1);
}

function spacePress(activeWord) { 
    if (!currentLetterNode(activeWord)) { 
        // add functoinality to move on to next word
        // save previous full input
        const error = Array.from(activeWord.childNodes).some((letter) => {
            return letter.classList.contains('incorrect') || letter.classList.contains('extra')
        });
        const nextWordRect = activeWord.nextSibling.getBoundingClientRect();
        const activeWordRect = activeWord.getBoundingClientRect();
        if (nextWordRect.top > activeWordRect.top) {
            previousRow++;
            console.log(previousRow);
            if (previousRow >= 1) {
                visualizer.scrollTo(0, previousRow * activeWord.clientHeight);       
            }
        }
        if (error) activeWord.classList.toggle('error')
        activeWord.classList.toggle('active');
        activeWord.classList.toggle('typed');
        activeWord = activeWord.nextSibling;
        activeWord.classList.toggle('active');
        previousInput = currentInput;
        currentInput = '';
    } else { 
        currentLetterNode(activeWord).classList.toggle('incorrect'); 
        currentInput += ' ';
    }
}

// returns first letter that hasn't been valued 
// if the whole word has been valued or overflowed, return false
function currentLetterNode(activeWord) { 
    const letters = activeWord.childNodes;
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].classList.length === 1) return letters[i]; 
    }
    return false;
}

function toggleCorrect(letter) { 
    if (letter.classList.contains('correct'))
        letter.classList.toggle('correct');
    else letter.classList.toggle('incorrect');
}

function occupyVisuals(words) {
    let word;
    for (let i = 0; i < words.length; i++) {
        word = words[i];
        displayWord(word, i);
    }
}

function displayWord(word, id) {
    let chars = word.split('');
    const worddiv = document.createElement('div');   
    worddiv.classList.add('word');                   
    if (id === 0) worddiv.classList.toggle('active');

    chars.forEach(char => { 
        const letterdiv = document.createElement('div');
        letterdiv.textContent = char;
        letterdiv.classList.add('letter');
        worddiv.appendChild(letterdiv);
        visualizer.appendChild(worddiv);
    });
}
