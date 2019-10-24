/* Self-scoring Trivia
Pre-load your app with some questions and answers.

Test the user's wits & knowledge with whatever-the-heck you know about (so you can actually win). Guess answers, have
the computer tell you how right you are!

Bonus:

Add time-based scoring
Track scores across games (even if the page is reloaded)
Allow users to compete against each other on a high-score board.*/

/*To Do:
-add timer (SCRAPPED)
-add session token for starting over on a catagory
-json string conversion
*/

const triviaGame = document.querySelector(".trivia-game");
const gameBox = document.querySelector(".game-box");
const main = document.querySelector("main");
const header = document.querySelector("header");
const buttonBox = document.querySelector(".button-box");
const url = "https://opentdb.com/api.php?";

console.log(buttonBox)
triviaGame.addEventListener("mousedown", () => {
    triviaGame.style.border = "solid grey 1px";
    triviaGame.style.boxShadow = "inset 3px 3px 3px grey";
})
triviaGame.addEventListener("mouseup", () => {
    triviaGame.style.border = "dashed grey 1px";
    triviaGame.style.boxShadow = "none";
})

class Question {
    constructor(question, wrong, answer) { //takes in a question, array of wrong answers and a right answer
        this.question = question;
        this.wrong = wrong;
        this.answer = answer;
        this.answers = this.wrong.slice(0);
        this.answers.push(this.answer);
        this.shuffleAnswers();
        this.qElement;
        this.aElements = [];
        this.parent;
    }

    shuffleAnswers() { //shuffles an array of answers
        let count = 0;
        let index = this.answers.length - 1;
        let temp;
        let randomIndex;
        while(count < 4) {
            while(index > 0) {
                randomIndex = Math.floor(Math.random() * this.answers.length);
                temp = this.answers[index];
                this.answers[index] = this.answers[randomIndex];
                this.answers[randomIndex] = temp;
                index--;
            }
            count++;
            index = this.answers.length - 1;
        }
    }

    appendQuestion(parent, qNum, round, timerId) { // appends the question (and its answers) to a parent wrapper
        this.parent = parent;
        this.qElement = document.createElement("p");
        this.qElement.innerText = "Question "+qNum+": "+this.question.replace(/(&quot\;)/g,"\"").replace(/(&#039\;)/g, "'");
        this.qElement.classList.add("question");
        this.parent.appendChild(this.qElement);
        this.aElements;
        this.ul = document.createElement("ul");
        this.ul.classList.add("answer-holder");
        for(let i = 0; i < this.answers.length; i++) {
            this.aElements[i] = document.createElement("a");
            this.aElements[i].innerText = this.answers[i].replace(/(&quot\;)/g,"\"").replace(/(&#039\;)/g, "'");
            this.aElements[i].classList.add("answer");
            this.aElements[i].addEventListener("click", (e) => {
                e.preventDefault();
                if(e.target.innerText === this.answer.replace(/(&quot\;)/g,"\"").replace(/(&#039\;)/g, "'")) {
                    clearInterval(timerId);
                    let correct = document.createElement("p") 
                    correct.innerText = "Correct";
                    round.incrementScore(true);
                    correct.classList.add("correct");
                    this.parent.insertBefore(correct, this.ul);
                } else {
                    clearInterval(timerId);
                    let incorrect = document.createElement("p");
                    incorrect.innerText = "Incorrect";
                    round.incrementScore(false);
                    incorrect.classList.add("incorrect");
                    this.parent.insertBefore(incorrect, this.ul);
                }
                this.showAnswer();
                let buttonWrap = document.createElement("div");
                buttonWrap.classList.add("button-wrap");
                let button = document.createElement("a");
                button.innerText = "Next Question";
                button.classList.add("button");
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    round.nextQuestion();
                })
                buttonWrap.appendChild(button);
                this.parent.appendChild(buttonWrap);
            })

            this.ul.appendChild(this.aElements[i]);
        }
        round.recieveUl(this.ul);
        this.parent.appendChild(this.ul);
    }

    showAnswer() { // hides the wrong answers and displays the right answer with a different styling
        for(let i = 0; i < this.wrong.length; i++) {
            for(let j = 0; j < this.answers.length; j++) {
                if(this.answers[j] === this.wrong[i]) {
                    this.aElements[j].classList.add("wrong-answer");
                }
            }
        }
        for(let i = 0; i < this.answers.length; i++) {
            if(this.answers[i] === this.answer) {
                this.aElements[i].classList.add("right-answer");
            }
        }
    }

    resetQuestion() { // resets a question to its original, unanswered state
        for(let i = 0; i < this.aElements.length; i++) {
            this.aElements[i].classList.remove("wrong-answer");
            this.aElements[i].classList.remove("right-answer");
        }
        this.shuffleAnswers();
    }
}

class Round {
    constructor(questions, parent, buttonBox, game) { // takes in an array of Question objects and a parent wrapper reference, and a button box reference, and the game object its in
        this.parent = parent;
        this.eraseParent();
        this.questions = questions;
        this.roundLength = questions.length;
        this.roundCount = -1;
        this.buttonBox = buttonBox;
        this.game = game;
        this.roundScore = 0;
        this.roundScoreEl = document.createElement("p");
        this.roundScoreEl.innerText = "Score: "+this.roundScore;
        this.roundScoreEl.classList.add("score");
        this.wrongCount = 0;
        this.rightCount = 0;
    }

    incrementScore(rightOrWrong) {
        if(rightOrWrong) {
            this.roundScore += 10;
            this.rightCount++;
        } else {
            this.roundScore -= 5;
            this.wrongCount++;
        }
        this.roundScoreEl.innerText = "Score: "+this.roundScore;
    }

    recieveUl(ul) {
        this.ul = ul;
    }

    createScoreBox() {
        let scoreBox = document.createElement("div");
        this.roundScoreEl.innerText = "Score: "+this.roundScore;
        scoreBox.classList.add("score-box");
        this.createTimer();
        scoreBox.appendChild(this.timer);
        scoreBox.appendChild(this.roundScoreEl);
        this.parent.appendChild(scoreBox);
    }

    createTimer() {
        this.timer = document.createElement("p");
        this.timer.innerText = 10;
        this.parent.appendChild(this.timer);
        let count = this.roundCount;
        this.timerId = setInterval(() => {
            this.timer.innerText = parseInt(this.timer.innerText, 10) - 1;
            if(parseInt(this.timer.innerText, 10) === 0) {
                clearInterval(this.timerId);
                let incorrect = document.createElement("p");
                incorrect.innerText = "Time Up!";
                this.incrementScore(false);
                incorrect.classList.add("incorrect");
                this.parent.insertBefore(incorrect, this.ul);
                this.questions[this.roundCount].showAnswer();
                let buttonWrap = document.createElement("div");
                buttonWrap.classList.add("button-wrap");
                let button = document.createElement("a");
                button.innerText = "Next Question";
                button.classList.add("button");
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.nextQuestion();
                })
                buttonWrap.appendChild(button);
                this.parent.appendChild(buttonWrap);
            }
            console.log("counting"+count);
        }, 1000)
    }

    displayQuestion() { // displays the question in the parent according to round count
        this.createScoreBox();
        this.questions[this.roundCount].appendQuestion(this.parent, this.roundCount + 1, this, this.timerId);

    }

    nextQuestion() { // moves to the next question and displays it using displayQuestion
        this.roundCount++;
        if(this.checkFinish()) {
            this.roundFinish();
            return;
        }
        this.eraseParent();
        this.displayQuestion();
        

    }

    checkFinish() { // checks to see if a round is finished based on length and the count, returns a boolean
        if(this.roundCount >= this.roundLength) {
            return true;
        }
        return false;
    }

    roundFinish() { // ends the round and displays landing screen for the end of a round
        this.eraseParent();
        let roundEnd = document.createElement("p");
        roundEnd.innerText = "All "+this.roundLength+" questions have been answered. The round is over. \nYou scored "+this.roundScore+" points out of a possible "+(10 * this.roundLength)+" points.\nYou got "+this.rightCount+" questions right and "+ this.wrongCount+" questions wrong.";
        roundEnd.classList.add("roundend");
        this.parent.appendChild(roundEnd);
        let startOver = document.createElement("a");
        startOver.innerText = "Back to Main Menu";
        startOver.classList.add("button");
        startOver.addEventListener("click", (e) => {
            e.preventDefault();
            for(let i = 0; i < this.questions.length; i++) {
                this.questions[i].resetQuestion();
            }
            this.roundCount = -1;
            this.loading();
            setTimeout(() => {
                this.game.createMainMenu();
            }, 1000);
            this.buttonBox.removeChild(startOver);
        })
        this.buttonBox.appendChild(startOver);
    }

    loading() {
        this.eraseParent();
        let loading = document.createElement("p");
        loading.innerText = "Loading...";
        loading.classList.add("loading");
        this.parent.appendChild(loading);
    }

    eraseParent() { // makes sure the parent div is blank and if not erases whats in it
        while(this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
    }


}

class Game {
    constructor(url, gameParent, buttonBox) {
        this.url = url;
        this.defaultUrl = url;
        this.rounds = [];
        this.gameParent = gameParent;
        this.buttonBox = buttonBox;
    }

    eraseGameParent() { // makes sure the gameparent div is blank and if not erases whats in it
        while(this.gameParent.firstChild) {
            this.gameParent.removeChild(this.gameParent.firstChild);
        }
    }

    createMainMenu() {
        this.eraseGameParent();
        let greeting = document.createElement("p");
        greeting.innerText = "Welcome to Trivia.\nTo begin, select a catagory, difficulty, and quiz length below."
        this.gameParent.appendChild(greeting);
        let mainMenuForm = document.createElement("form");
        mainMenuForm.classList.add("main-menu-form");
        let difficulties = ["easy", "medium", "hard"];
        let catagories;
        let difficultyDropDown;
        let catagoryDropDown;
        let questionNumField = document.createElement("input");
        questionNumField.setAttribute("type", "number");
        questionNumField.setAttribute("name", "questNum");
        questionNumField.setAttribute("max", "50");
        questionNumField.setAttribute("min", "1");
        questionNumField.setAttribute("required", "required");
        let submit = document.createElement("input");
        submit.setAttribute("type", "submit");
        submit.setAttribute("value", "Play Triva!");
        fetch("https://opentdb.com/api_category.php")
            .then(res => res.json())
            .then(res => {
                catagories = res.trivia_categories;
                catagoryDropDown = this.createDropDown(catagories, "Catagory");
                difficultyDropDown = this.createDropDown(difficulties, "Difficulty");
                mainMenuForm.appendChild(catagoryDropDown);
                mainMenuForm.appendChild(difficultyDropDown);
                mainMenuForm.appendChild(questionNumField);
                mainMenuForm.appendChild(submit);
            })
            .catch(err => {
                console.log("error",err);
            })
        mainMenuForm.addEventListener("submit", (e) => {
            e.preventDefault();
            e.target.style.pointerEvents = "none";
            this.url = this.defaultUrl;
            console.log(questionNumField.value)
            let catagory = e.target[0].value;
            if(catagory === " ") {
                catagory = "";
            }
            let difficulty = e.target[1].value;
            if(difficulty === " ") {
                difficulty = "";
            }
            let questionLength = e.target[2].value;
            console.log(questionLength + " cata: " + catagory+ " diff: " + difficulty);
            if(difficulty.length !== "" && catagory.length !== "") {
                this.url = this.url + "amount="+questionLength+"&category="+catagory+"&difficulty="+difficulty+"&type=multiple";
            } else if(difficulty === "") {
                this.url = this.url + "amount="+questionLength+"&category="+catagory+"&type=multiple";
            } else if (catagory === "") {
                this.url = this.url + "amount="+questionLength+"&difficulty="+difficulty+"&type=multiple";
            } else {
                this.url = this.url + "amount="+questionLength+"&type=multiple";
            }
            this.createRound();
        });
        this.gameParent.appendChild(mainMenuForm);

    }

    createDropDown(options, title) { // takes an array of options and a title, returns a select wrapper with options appended and default as any catagory
        let select = document.createElement("select");
        let optionsEl = [];
        if(typeof options[0] === "string") {
            for(let i = 0; i < options.length + 1; i++) {
                optionsEl[i] = document.createElement("option");
                if(i === 0) {
                    optionsEl[i].setAttribute("value", " "); // remember this is a space and not an empty string which is what is need in the url
                    optionsEl[i].setAttribute("selected", "selected");
                    optionsEl[i].innerText = "Any "+title;
                } else {
                    optionsEl[i].setAttribute("value", options[i - 1]);
                    optionsEl[i].innerText = options[i - 1].charAt(0).toUpperCase() + options[i - 1].slice(1);
                }
                select.appendChild(optionsEl[i]);
            }
        } else {
            for(let i = 0; i < options.length + 1; i++) {
                optionsEl[i] = document.createElement("option");
                if(i === 0) {
                    optionsEl[i].setAttribute("value", " "); // remember this is a space and not an empty string which is what is need in the url
                    optionsEl[i].setAttribute("selected", "selected");
                    optionsEl[i].innerText = "Any "+title;
                } else {
                    optionsEl[i].setAttribute("value", options[i - 1].id);
                    optionsEl[i].innerText = options[i - 1].name;
                }
                select.appendChild(optionsEl[i]);
            }  
        }
        
        select.setAttribute("required", "required");
        return select;
    }

    createRound() {
        fetch(this.url) 
            .then(res => res.json())
            .then(res => {
                let questArray = [];
                for(let i = 0; i < res.results.length; i++) {
                    questArray[i] = new Question(res.results[i].question, res.results[i].incorrect_answers, res.results[i].correct_answer);
                }
                this.rounds[this.rounds.length] = new Round(questArray, this.gameParent, this.buttonBox, this);
                this.roundNextQuestion(this.rounds.length - 1);
            })
            .catch(err => {
                console.log("error ",err);
            })
    }

    roundNextQuestion(roundIndex) {
        this.rounds[roundIndex].nextQuestion();
    }
}

let game = new Game(url, triviaGame, gameBox);
game.createMainMenu();
// game.createRound();