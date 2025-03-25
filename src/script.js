const visualizer = document.querySelector('#visualizer');

let time = null;
let previousRow = -1;
const main = document.querySelector('main');
const results = document.querySelector('#results');

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

// listens for key presses, starts the test after recognizes the first key press
document.addEventListener('keydown', (event) => {
    if (!time) startTimer()
    let activeWord = document.querySelector('.active');
    const key = event.key;

    // depending on what key is pressed, do different things
    if (event.code === `Key${key.toUpperCase()}`) letterPress(key, activeWord); 
    else if (key === 'Backspace') backspacePress(activeWord);
    else if (key === ' ') spacePress(activeWord);
});

// occupy the <main> with the visual text box
occupyVisuals(test);

/**
 * This is used when a letter is pressed
 * @param   {String} key The key that was pressed ('Backspace', 'f', 'Space')
 * @param   {Element} activeWord The current active word div 
*/
function letterPress(key, activeWord) { 
    const currentLetter = currentLetterNode(activeWord);
    // (1) when the user enters in extra letter
    if (!currentLetter) { 
        const letterdiv = document.createElement('div'); 
        letterdiv.textContent = key;                    
        letterdiv.classList.add('letter');               
        letterdiv.classList.add('extra');
        activeWord.appendChild(letterdiv);                  
    }
    // (2) when the user enters in the correct letter
    else if (currentLetter.textContent === key) 
        currentLetter.classList.toggle('correct');
    // (3) when the user enters in the incorrect letter
    else currentLetter.classList.toggle('incorrect');
}

/** 
 * This is used when the backspace is pressed
 * @param   {Element} activeWord The current active word div 
*/
function backspacePress(activeWord) {
    previousLetter = currentLetterNode(activeWord).previousSibling;
    // (1) user pressing backspace on an extra letter
    if (activeWord.lastChild.classList.contains('extra')) activeWord.lastChild.remove(); 
    // (2) user pressing backspace on last letter
    else if (!currentLetterNode(activeWord)) { 
        if (activeWord.lastChild.classList.contains('correct')) 
            activeWord.lastChild.classList.toggle('correct');
        else activeWord.lastChild.classList.toggle('incorrect');
    }
    // (3) user pressing backspace on empty input
    else if (activeWord.firstChild === currentLetterNode(activeWord)) {
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
    // (4) user pressing backspace on a letter inside of word
    else { 
        toggleCorrect(previousLetter);
    }
}

/** 
 * This is used when the space is pressed
 * @param   {Element} activeWord The current active word div 
*/
function spacePress(activeWord) { 
    // (1) user is pressing space on the last letter 
    if (!currentLetterNode(activeWord)) { 
        const error = Array.from(activeWord.childNodes).some((letter) => {
            return letter.classList.contains('incorrect') || letter.classList.contains('extra')
        });

        // feature where the visual text box should scroll down 
        const nextWordRect = activeWord.nextSibling.getBoundingClientRect();
        const activeWordRect = activeWord.getBoundingClientRect();
        if (nextWordRect.top > activeWordRect.top) {
            previousRow++;
            if (previousRow >= 1) {
                visualizer.scrollTo(0, previousRow * activeWord.clientHeight);       
            }
        }

        // marks the current word wrong then moves the visual input to the next word
        if (error) activeWord.classList.toggle('error')
        activeWord.classList.toggle('active');
        activeWord.classList.toggle('typed');
        activeWord = activeWord.nextSibling;
        activeWord.classList.toggle('active');
    } 
    // (2) user pressing space on a letter inside of word
    else { 
        currentLetterNode(activeWord).classList.toggle('incorrect'); 
    }
}

/**
 * Returns a the next letter element if there exist one for the current word
 * if there are no other letter elements then return false
 * @param   {Element} activeWord The current active word div 
 * @return  {Element/boolean} Element if there exist a next letter, false if otherwise
*/
function currentLetterNode(activeWord) { 
    const letters = activeWord.childNodes;
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].classList.length === 1) return letters[i]; 
    }
    return false;
}

/**
 * Toggles the correctness of the given letter element 
 * @param   {Element} letter Element you want to toggle correctness
*/
function toggleCorrect(letter) { 
    if (letter.classList.contains('correct'))
        letter.classList.toggle('correct');
    else letter.classList.toggle('incorrect');
}

/**
 * Occupies the text visualizer with words 
 * @param {string[]} words A string array of words used for the test 
*/
function occupyVisuals(words) {
    let word;
    for (let i = 0; i < words.length; i++) {
        word = words[i];
        displayWord(word, i);
    }
}

/**
 * Displays word in text visualizer
 * @param {string} word Word to display
 * @param {int} i the nth word being displayed into text visualizer
*/
function displayWord(word, i) {
    let chars = word.split('');
    const worddiv = document.createElement('div');   
    worddiv.classList.add('word');                   
    if (i === 0) worddiv.classList.toggle('active');

    chars.forEach(char => { 
        const letterdiv = document.createElement('div');
        letterdiv.textContent = char;
        letterdiv.classList.add('letter');
        worddiv.appendChild(letterdiv);
        visualizer.appendChild(worddiv);
    });
}

/**
 * Starts the test timer that when is depleted will stop the test
*/
function startTimer() { 
    time = (new Date()).getMilliseconds() + 30000;
    window.setTimeout(timeOut, time); 
}

/**
 * Runs post test logic manipulating DOM
*/
async function timeOut() { 
    // count the amount of correct words in visualizer
    const words = visualizer.childNodes;
    let letters = 0;
    const wpm = Array.from(words).filter(isCorrect).length * 2; 
    Array.from(words).forEach((word) => { 
        if (isCorrect(word)) letters += word.textContent.length;
    });
     
    visualizer.classList.toggle('display-none');
    results.classList.toggle('display-none');
    results.classList.toggle('display-flex');

    const date = results.querySelector('*:nth-child(2)');
    date.textContent = currentDate();
    const dateClientWidth = date.clientWidth;
    date.style.width = dateClientWidth + 'px';
    date.textContent = '';

    await wpmDisplay(wpm + ' wpm', letters, results.querySelector('*:nth-child(1)'));
    await wpmDisplay(currentDate() , letters, results.querySelector('*:nth-child(2)')); 
}

/**
 * @param   {Element}   word Word Element to check if correct or not
 * @return  {boolean}    true if word is correct, false otherwise 
*/
const isCorrect = function(word) {
    if (word.classList.contains('error')) return false;
    if (word.classList.contains('active')) return false;
    if (!word.classList.contains('typed')) return false;
    return true;
}

/**
 * @param   {string}  text Text to be displayed like being typed out slowly
 * @param   {int}     letters The amount of letters being typed during the session
 * @param   {Node}    textNode The node that will be targed for content string modification
 * @returns A promise that is returned after the text has been displayed
*/
function wpmDisplay(text, letters, textNode) {
    const letterInterval = 30 / letters;
    let chars = text.split('');  
    return inter(chars, letterInterval, textNode);
}

/**
 * Adds a characters to the content of the targeted text node based off an interval
 * @param   {char}     chars The characters that are subjected to be added to the node
 * @param   {double}   interval Seconds per letter/character being displayed
 * @param   {Node}     textNode Node that is being modified  
*/
function inter(chars, interval, textNode) { 
    return new Promise((resolve) => {
        if (chars.length === 0) {
            resolve();
            return;
        }
        const char = chars.shift();                                                
        textNode.textContent += char;                                         
        setTimeout(() => inter(chars, interval, textNode).then(resolve), interval * 1000);  
    });
}

/**
 * Calculates the current date in mm/dd/yyyy form
 * @returns  Date in string form of mm/dd/yyyy
*/
const currentDate = function() { 
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    
    const dateUS = mm + '/' + dd + '/' + yyyy;
    return dateUS;
}
