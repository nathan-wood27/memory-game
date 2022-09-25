const gameContainer = document.getElementById("game");
const numberOfMatchesInput = document.querySelector('#number-of-matches-input');

numberOfMatchesInput.addEventListener('focus', function(e){
    numberOfMatchesInput.parentElement.classList.add('active');
});

numberOfMatchesInput.addEventListener('blur', function(e){
    if(numberOfMatchesInput.value === ''){
        numberOfMatchesInput.parentElement.classList.remove('active');
    }
});

const form = document.querySelector('#choose-number-of-matches');

let COLORS = [];

let newScoreCategoryObject = new Object();

form.addEventListener('submit', function(e){
  e.preventDefault();
  
  if(gameContainer.classList.contains('first-play')){    
    colorsArray = pickTheColors(numberOfMatchesInput.value);
    createDivsForColors(colorsArray);    
    gameContainer.classList.remove('first-play');
    startGame.innerText = 'Restart Game';
  }else if(numberOfMatchesInput.value * 2 !== COLORS.length){
    newGameBoard();
    COLORS = [];
    newColorsArray = pickTheColors(numberOfMatchesInput.value);
    createDivsForColors(newColorsArray);  
  }else{
    startOver();
  }
});

function pickTheColors(number){
  let i = number
  while(i > 0){
    i--;
    let r = Math.floor(Math.random()*255);
    let g = Math.floor(Math.random()*255);
    let b = Math.floor(Math.random()*255);
    COLORS.push(`color-${i}`);
    COLORS[`color-${i}`]= `rgb(${r},${g},${b})`;
    COLORS.push(`color-${i}`);
    COLORS[`color-${i}`]= `rgb(${r},${g},${b})`;
  }
  shuffle(COLORS);
  if(localStorage.getItem('lowestScores')){ 
    let myLocalStorage = JSON.parse(localStorage.getItem('lowestScores'));
    newScoreCategoryObject = myLocalStorage;
    if(myLocalStorage[COLORS.length/2]){
      bestScore.innerText =  `Your Best Score For This Number of Cards is ${myLocalStorage[COLORS.length/2].score}`;
    }else{      
      bestScore.innerText = "You don't have a best score for this number of cards yet."
    }
  }else{
    
    bestScore.innerText = "You don't have a best score yet."
  }
  return COLORS;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

const isAMatch = document.getElementById('it-is-a-match');
const youWin = document.getElementById('you-win');
const playAgain = document.querySelector('#you-win .btn');
const bestScore = document.getElementById('best-score');
const currentScore = document.getElementById('current-score');
let startGame = document.getElementById('start-game');
let score = 0;
let lowestScore = 100000000000000000;

currentScore.innerText = score;




playAgain.addEventListener('click', startOver);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let head = document.querySelector('head');
  newStyle = document.createElement('style');
  let addColorsToStyle = '';
  let i = 0;

  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.add('square');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

    addColorsToStyle = addColorsToStyle + `#game .square.${color}.check, #game .square.${color}.match {background:${COLORS[color]};}`
    i++;
  }
  
  newStyle.append(addColorsToStyle);
  newStyle.id = 'added-square-color-styles';
  head.append(newStyle);
  
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  const gameContainer = event.target.parentElement;
  if(gameContainer.className === 'start'){
    gameContainer.classList.remove('start');
  }
  else if(event.target.classList.contains('check')){    
    event.target.classList.add('removed-check');
  }
  else if(event.target.classList.contains('removed-check')){    
    event.target.classList.remove('removed-check');
  }
  else{    
    gameContainer.classList.toggle('refresh');
  }  
  event.target.classList.toggle('check');
  if (gameContainer.className === 'refresh'){
    gameContainer.classList.add('checking');
    const eachCheckedDiv = document.querySelectorAll('#game .square.check');
    checkForMatch(eachCheckedDiv);
    removeChecksFromDivs(eachCheckedDiv,gameContainer);
  }
}

// Removes the check classes from each div
function removeChecksFromDivs(divs){

  setTimeout(function(){
    for(var i = 0, len = divs.length; i < len; i++){
      divs[i].classList.remove('check');
    }
    gameContainer.classList.remove('checking');
  }, 1000);
}

// Checks for a Match, if so checks for game completion and 
//throws up you win! otherwise shows match! then continues game
function checkForMatch(divs){
  score++;
  currentScore.innerText = score;
  let firstDiv
  let secondDiv
  let firstDivId
  let secondDivId
  for(var i = 0, len = divs.length; i < len; i++){
    if(i === 0){
      firstDiv = divs[i];
      firstDivId = divs[i].className;
    }else {
      secondDiv = divs[i];
      secondDivId = divs[i].className;
    }
    if(firstDivId === secondDivId){
      firstDiv.classList.add('match');
      secondDiv.classList.add('match');
      if(checkForFinished()){
        youWin.className = 'active';
        form.classList.add('d-none');
      }else{
        isAMatch.classList.add('active');
        setTimeout(function(){
          isAMatch.classList.remove('active');
        }, 1000);
      }      
    }
  }
}

function checkForFinished(){  
  const eachMatchedDiv = document.querySelectorAll('#game .square.match');
  if(eachMatchedDiv.length === COLORS.length){    
    if(lowestScore > score){
      addScoreToLocalStorage(COLORS.length/2,score);
    }    
    return true;    
  }else{
    return false;
  }
}

function startOver(){
  score = 0;
  currentScore.innerText = score;
  if(localStorage.getItem('lowestScores')){ 
    let myLocalStorage = JSON.parse(localStorage.getItem('lowestScores'));
    bestScore.innerText =  `Your Best Score For This Number of Cards is ${myLocalStorage[COLORS.length/2].score}`;
  }
  let newColors = shuffle(COLORS);
  const eachSquareDiv = document.querySelectorAll('#game .square');
  for(var i = 0, len = eachSquareDiv.length; i < len; i++){
    eachSquareDiv[i].className = 'square';
    eachSquareDiv[i].classList.add(newColors[i]);
  }   
  gameContainer.classList.remove('refresh');
  gameContainer.classList.add('start');
  youWin.classList.remove('active');
  form.classList.remove('d-none');
}

function newGameBoard(){
  const allSquares = document.querySelectorAll('#game .square');
  for(var i = 0, len = allSquares.length; i < len; i++){
    allSquares[i].remove();
  }
  document.getElementById('added-square-color-styles').remove();
}


function addScoreToLocalStorage(number,score) {
  let newScoreForCategoryObject = new Object();
  newScoreForCategoryObject.score = score;
  newScoreCategoryObject[number] = newScoreForCategoryObject;
  localStorage.setItem('lowestScores',JSON.stringify(newScoreCategoryObject));
}
