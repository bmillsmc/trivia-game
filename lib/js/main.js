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
    }

    shuffleAnswers(answers) { //shuffles an array of answers
        let count = 0;
        let index = answers.length - 1;
        let temp;
        let randomIndex;
        while(count < 20) {
            while(index > 0) {
                randomIndex = Math.floor(Math.random * index);
                temp = answers[index];
                answers[index] = answers[randomIndex];
                answers[randomIndex] = temp;
                index--;
            }
            count++;
        }
        return answers;
    }

    appendQuestion(parent) { // appends the question to a parent wrapper
        let qElement = document.createElement("p");
        qElement.innerText = this.question;
        qElement.classList.add("question");
        parent.appendChild(qElement);
        let aElements;
        let answers = this.wrong.push(this.answer);
        answers = this.shuffleAnswers(answers);
        for(let i = 0; i < answers.length; i++) {
            aElements[i] = document.createElement("p");
            aElements[i].innerText = answers[i];
            aElements[i].classList.add("answer");
            parent.appendChild(aElements[i]);
        }
    }
}