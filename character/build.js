import { 
    checkAuth, 
    fetchCharacter,
    logout, 
    createCharacter,
    // updateBottom,
    // updateHead,
    // updateMiddle,
    // updateCatchphrases,
    updateCharacter
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const catchphrasesEl = document.getElementById('chatchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;
let charId = 0;

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;
    // update the head in supabase with the correct data
    await updateCharacter(`head`, headDropdown.value, charId);
    await refreshData();
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    console.log(middleDropdown.value);
    // update the middle in supabase with the correct data
    await updateCharacter(`middle`, middleDropdown.value, charId);
    await refreshData();
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    // update the bottom in supabase with the correct data
    await updateCharacter(`bottom`, bottomDropdown.value, charId);
    await refreshData();
});

// const catchphrase = [];
catchphraseButton.addEventListener('click', async() => {
    const catchphrase = [];
    catchphrase.push(catchphraseInput.value);
    // go fetch the old catch phrases
    const character = await fetchCharacter();
    // update the catchphrases array locally by pushing the new catchphrase into the old array
    for (let c of character.catchphrases){
        catchphrase.push(c);
    }
    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    await updateCharacter(`catchphrases`, catchphrase, charId);
    refreshData();
    catchphraseInput.value = '';
});

window.addEventListener('load', async() => {
    charId = 0;
    // on load, attempt to fetch this user's character
    const character = await fetchCharacter();
    charId = character.id;
    // if this user turns out not to have a character
    // create a new character with correct defaults for all properties (head, middle, bottom, catchphrases)
    // and put the character's catchphrases in state (we'll need to hold onto them for an interesting reason);
    const defaultObj = {
        head: `bird`,
        middle: `blue`,
        bottom: `leg`, 
        catchphrases: []
    };

    if (!character) {
        await createCharacter(defaultObj);
        refreshData();
    }
    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}



async function fetchAndDisplayCharacter() {
    // fetch the caracter from supabase
    const fetchChar = await fetchCharacter();
    // if the character has a head, display the head in the dom
    headEl.style.backgroundImage = `url(../assets/${fetchChar.head}-head.png)`;
    switch (fetchChar.head) {
        case `bird`:
            changeChar(`head`, 0);
            break;
        case `duck`:
            changeChar(`head`, 1);
            break;
        case `dog`:
            changeChar(`head`, 2);
            break;
        case `horse`:
            changeChar(`head`, 3);
            break;
        }
                    
    // if the character has a middle, display the middle in the dom
    middleEl.style.backgroundImage = `url(../assets/${fetchChar.middle}-middle.png)`;
    switch (fetchChar.middle) {
        case `blue`:
            changeChar(`middle`, 0);
            break;
        case `dress`:
            changeChar(`middle`, 1);
            break;
        case `pink`:
            changeChar(`middle`, 2);
            break;
        case `red`:
            changeChar(`middle`, 3);
            break;
    }
    
    // if the character has a pants, display the pants in the dom
    bottomEl.style.backgroundImage = `url(../assets/${fetchChar.bottom}-pants.png)`;
    console.log(fetchChar.id);

    switch (fetchChar.bottom) {
        case `leg`:
            changeChar(`bottom`, 0);
            break;
        case `white`:
            changeChar(`bottom`, 1);
            break;
        case `blue`:
            changeChar(`bottom`, 2);
            break;
    }
    
    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    catchphrasesEl.textContent = ``;
    for (let c of fetchChar.catchphrases){
        const catchphrase = document.createElement(`p`);
        catchphrase.textContent = c;
        catchphrasesEl.append(catchphrase);
    }
}

function changeChar(index, val){
    document.getElementById(
        `${index}-dropdown`).selectedIndex = val;
}

async function refreshData() {
    displayStats();
    await fetchAndDisplayCharacter();
}
