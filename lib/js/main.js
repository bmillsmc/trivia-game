/* Self-scoring Trivia
Pre-load your app with some questions and answers.

Test the user's wits & knowledge with whatever-the-heck you know about (so you can actually win). Guess answers, have
the computer tell you how right you are!

Bonus:

Add time-based scoring
Track scores across games (even if the page is reloaded)
Allow users to compete against each other on a high-score board.*/

const triviaGame = document.querySelector(".trivia-game");

class Question {
    constructor(question, wrong, answer) { //takes in a question, array of wrong answers and a right answer
        this.question = question;
        this.wrong = wrong;
        this.answer = answer;
        this.answers = this.wrong;
        this.answers.push(this.answer);
        this.shuffleAnswers();
        this.qElement;
        this.aElements;
        this.parent;
    }

    shuffleAnswers() { //shuffles an array of answers
        let count = 0;
        let index = this.answers.length - 1;
        let temp;
        let randomIndex;
        while(count < 20) {
            while(index > 0) {
                randomIndex = Math.floor(Math.random * index);
                temp = this.answers[index];
                this.answers[index] = this.answers[randomIndex];
                this.answers[randomIndex] = temp;
                index--;
            }
            count++;
        }
    }

    appendQuestion(parent) { // appends the question (and its answers) to a parent wrapper
        this.parent = parent;
        this.qElement = document.createElement("p");
        this.qElement.innerText = this.question;
        this.qElement.classList.add("question");
        parent.appendChild(qElement);
        this.aElements;
        for(let i = 0; i < this.answers.length; i++) {
            this.aElements[i] = document.createElement("p");
            this.aElements[i].innerText = this.answers[i];
            this.aElements[i].classList.add("answer");
            parent.appendChild(aElements[i]);
        }
    }

    showAnswer() { // hides the wrong answers and displays the right answer with a different styling
        for(let i = 0; i < this.wrong.length; i++) {
            for(let j = 0; j < this.answers.length; j++) {
                if(this.answers[j] === this.wrong[i]) {
                    this.aElements[j].classList.add("hidden");
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
        for(let i = 0; i < aElements.length; i++) {
            this.aElements[i].classList.remove("hidden");
            this.aElements[i].classList.remove("right-answer");
        }
    }
}

class Round {
    constructor(questions, parent) { // takes in an array of Question objects and a parent wrapper reference
        this.parent = parent;
        this.questions = questions;
        this.roundLength = questions.length;
        this.roundCount = 0;
    }

    displayQuestion() { // displays the question in the parent according to round count
        this.question[roundCount].appendQuestion(this.parent);
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

    }

    eraseParent() { // makes sure the parent div is blank and if not erases whats in it
        for(let i = 0; i < this.parent.childNodes; i++) {
            this.parent.removeChild(this.parent.childNodes[i]);
        }
    }
}