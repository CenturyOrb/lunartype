const inputBox = document.querySelector('#textInput');
const visualizer = document.querySelector('#visualizer');
inputBox.focus();

let letterIndex = 0; // the next letter that the user needs to type
let previousInput = '';

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

inputBox.addEventListener('keydown', (event) => {
    let activeWord = document.querySelector('.active');
    const firstLetter = activeWord.childNodes[0];
    if (event.key !== 'Backspace') return;
    if (letterIndex !== 0) return;
    if (!activeWord.previousSibling) return;
    if (!activeWord.previousSibling.classList.contains('error')) return;
    // go to previous IF the previous is incorrect
    activeWord.classList.toggle('active');
    activeWord.classList.toggle('typed');
    activeWord = activeWord.previousSibling;
    activeWord.classList.toggle('active');
    activeWord.classList.toggle('typed');
    activeWord.classList.toggle('error');
    inputBox.value = previousInput + ' ';
    letterIndex = previousInput.length;
    console.log(previousInput + '|');
});

inputBox.addEventListener('input', () => {
    const latestLetter = inputBox.value.substring(inputBox.value.length - 1);
    const currentWord = document.querySelector('.active');    
    /*
     * if a user enters in a backspace
     *  (1) remove incorrect or correct tag 
     *  (2) update letterIndex
     *
     * if a user enters in a space 
     *  (1) reset inputBox visuals
     *  (2) letterIndex resets
     *  (3) store previous input 
     * 
     * if the user enters in a letter
     *  (1) add incorrect or correct tag to current visual letter 
    */
    if (letterIndex > inputBox.value.length) {
        console.log('backspace');
        console.log('index: ' + letterIndex);
        const deletedLetter = currentWord.childNodes[inputBox.value.length];                          
        if (deletedLetter.classList.contains('correct')) deletedLetter.classList.toggle('correct');   
        else deletedLetter.classList.toggle('incorrect');                                             
        letterIndex--;                                                                                
    } else if (latestLetter === ' ') {
        /* - space at the end 
         * - space in the middle of a word
        */
        console.log('space');
        console.log('index: ' + letterIndex);
        if (letterIndex === currentWord.childNodes.length) {
            currentWord.nextSibling.classList.toggle('active');
            if (currentWord.textContent !== inputBox.value.substring(0, inputBox.value.length - 1)) 
                currentWord.classList.toggle('error'); 
            currentWord.classList.toggle('active');
            currentWord.classList.toggle('typed');
            previousInput = inputBox.value.slice(0, -1);
            inputBox.value = '';   
            letterIndex = 0;       
        } else { 
            currentWord.childNodes[letterIndex].classList.add('incorrect');
            letterIndex++;
        }
    } else { 
        console.log('letter');
        console.log('index: ' + letterIndex);
        if (letterIndex >= currentWord.textContent.length) return;
        const typedLetter = currentWord.childNodes[letterIndex];
        if (latestLetter === currentWord.textContent.substring(letterIndex, letterIndex + 1)) { 
            typedLetter.classList.toggle('correct');
        } else {
            typedLetter.classList.toggle('incorrect');
        }
        letterIndex++;
    }
});

inputBox.addEventListener('click', () => {
    if (inputBox.placeholder != null) inputBox.placeholder = '';
});

occupyVisuals(test);

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
    worddiv.id = 'word-' + id;
    if (id === 0) worddiv.classList.toggle('active');

    chars.forEach(char => { 
        const letterdiv = document.createElement('div');
        letterdiv.textContent = char;
        letterdiv.classList.add('letter');
        worddiv.appendChild(letterdiv);
        visualizer.appendChild(worddiv);
    });
}

