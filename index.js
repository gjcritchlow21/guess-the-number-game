/*----------Readline Interface-------------*/
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

/*------------Global Variables-------------*/
let min = 1;
let max; // empty variable to set later
let guessCount = 8;
let compGuess = smartGuess(min, max);

/*----------------Functions-----------------*/
//random number generator
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//smart guess, picks down the middle
function smartGuess(min, max) {
  return Math.floor((min + max) / 2);
}
//sanitizes input
function sanitize(string) {
  return string.trim().toLowerCase();
}

/*------------------- Game Play--------------*/
gameChoice();
//async function for user to pick game that they'd like to play
async function gameChoice() {
  let choice = await ask(
    "Hello, lets play a game! You choose: I Guess your number (1) OR you guess mine (2)"
  );
  choice = parseInt(choice);
  //check to make sure user picks correct game
  while (choice >= 3) {
    choice = await ask("1 or 2?! Not that hard!");
    choice = parseInt(choice);
  }
  //game choice
  if (choice === 1) {
    compGuessStart();
  } else {
    humanGuesser();
  }
}

/*---------------Human Guessing Game-------------*/
async function compGuessStart() {
  //Welcome message that starts he computer guessing game
  console.log(
    "Welcome Tik Tok and Instagram Influencers! Let's test your worth, set a range between 1 and whatevr. Pick a number between that and I will try to guess it. If I get it in 8 or less turns, you die. If I don't guess it, you will get 10 million new followers!\n "
  );
  //settin the high range
  max = await ask(
    "First, Lets set that high range. It has to be higher then 1. \n>_"
  );
  //making sure the number coming in IS a number
  max = parseInt(max);
  //check to make sure it truly is a number
  while (isNaN(max) || max <= 1) {
    max = await ask(
      "Don't dumb yourself down for the 'Gram, try again. This time, a number greater then 1.\n>_"
    );
    max = parseInt(max);
  }
  //sets the user number to  variable to check against for cheating
  let secretAns = await ask(
    "Second, what is you number? I won't peek!...not like I have to anyway\n>_ "
  );
  //turning that into a number
  let secretNumb = parseInt(secretAns);
  //comp guess that is within rane
  compGuess = smartGuess(min, max);
  //first guess
  let answer = await ask(`Is your number ${compGuess}?\n>_ `);
  //sanitizes the input to check for sepcific inputs
  answer = sanitize(answer);
  //game meat and bones, if you dont guess it correctly, run the while loop
  if (answer === "y") {
    console.log(
      "Wow, you must've gone viral! You may want to get that checked out!"
    );
    process.exit();
  } else if (compGuess === secretNumb && answer === "n") {
    //cheat dectector 1
    console.log(
      "You're already cheating at life, you don't need to do it in this game! Goodbye!"
    );
    process.exit();
  } else {
    guessCount--;
    while (answer !== "y") {
      //into the thick of it, loop while answer is no
      let highLow = await ask(`Is it Higher or Lower than ${compGuess}?\n>_`); //asks high or low and sanitizes input
      highLow = sanitize(highLow);
      if (compGuess < secretNumb && highLow === "l") {
        //cheat detector checks if players guess is higher then guess with a low answer
        console.log(
          "You're already cheating at life, you don't need to do it in this game! Goodbye!"
        );
        process.exit();
      } else if (compGuess > secretNumb && highLow === "h") {
        //cheat detector works opposite as above
        console.log(
          "You're already cheating at life, you don't need to do it in this game! Goodbye!"
        );
        process.exit();
      } else if (compGuess === secretNumb && answer === "n") {
        //cheat detector
        console.log(
          "You're already cheating at life, you don't need to do it in this game! Goodbye!"
        );
        process.exit();
      } else if (guessCount === 0) {
        //game ender if under 8 guesses are used
        console.log("Ooh, you ran out of guesses! Too bad! Goodbye, n00b!");
        process.exit();
      } else if (highLow === "h") {
        //if guess is high, resets the min and guesses again
        min = compGuess + 1;
        compGuess = smartGuess(min, max);
        guessCount--;
        console.log(guessCount + " Guess Left");
      } else if (highLow === "l") {
        //if low, resets the max and guess again
        max = compGuess - 1;
        compGuess = smartGuess(min, max);
        guessCount--;
        console.log(guessCount + " Guess Left");
      } else {
        //catch all
        console.log(
          "Your Tik Tok/Instagram vernacular does not register with the general public, try again."
        );
      }
      //re asks and sets answer variable
      answer = await ask(`Is your number ${compGuess}?\n>_ `);
      answer = sanitize(answer);
    }
    console.log(
      "Dammit! You survived. I promised you followers, albeit not quality followers, here are your Russian bot farmed users! Enjoy!"
    );
    process.exit();
  }
}

/*---------------Human Guessing Game-------------*/
async function humanGuesser() {
  console.log(
    "Welcome Human, Lets play a guessing game! I'll pick a number between 1 and 100, and you try to guess it. Guess away!"
  );
  compsNumber = randomNumber(1, 100); //sets computer number
  let guess = await ask("What is your guess?\n>_"); //first guess
  guess = parseInt(guess); //parse it into a numbah
  if (guess === compsNumber) {
    console.log("Wow first try. I'll guess ill have to try harder next time!");
    process.exit();
  } else {
    while (guess !== compsNumber) {
      //while loop until number is guessed
      if (guess < compsNumber) {
        console.log("Too low, guess again!");
      } else if (guess > compsNumber) {
        console.log("Too High, guess again!");
      } else {
        console.log(
          "Yay, you have guessed my number! You get to live! er, I mean good job!"
        );
        process.exit();
      }
      guess = await ask(">_"); //reask/reset of the guess var
    }
  }
}
