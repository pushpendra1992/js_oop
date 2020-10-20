//----------------------------- Data ----------------------------------------------------------
const data = [{
        question: "International Women’s Day?",
        options: ["January 12", "March 8", "December 1", "September 8"],
        correctAnswer: 1,
    },
    {
        question: "Indian Air Force Day?",
        options: ["December 4", "January 15", "October 8", "December 7"],
        correctAnswer: 2,
    },
    {
        question: " Hindi Diwas?",
        options: ["November 11", "September 8", "September 14", "December 16"],
        correctAnswer: 2,
    },
    {
        question: " International Non-violence Day?",
        options: ["October 2", "January 30", "May 21", "October 31"],
        correctAnswer: 0,
    },
    {
        question: "National Sports Day?",
        options: ["November 14", "August 20", "June 5", "August 29"],
        correctAnswer: 3,
    },
];

const questions = JSON.parse(localStorage.getItem("quizData")) || data;

// ----------------- Code --------------------------------------------------------------------------

class Quiz {
    constructor(quizzes) {
        this.quizzes = quizzes;
        this.score = 0;
        this.activeIndex = 0;
    }

    incrementScore() {
        return ++this.score;
    }

    next() {
        if (this.activeIndex >= this.quizzes.length - 1)
            return;
        else
            return ++this.activeIndex;
    }

    prev() {
        if (this.activeIndex <= 0)
            return;
        else
            return --this.activeIndex;
    }

    getCurrentQuiz() {
        return this.quizzes[this.activeIndex];
    }

    render() {
        root.innerHTML = "";
        score.innerText = this.score;
        this.getCurrentQuiz().createUI();
        document.querySelector(".options").addEventListener("click", this.optionHandler.bind(this), {
            once: true
        });
    }

    optionHandler(e) {
        if (!e.target.classList.contains("option"))
            return;

        const options = document.querySelectorAll(".option");
        const selection = [...options].indexOf(e.target);
        const question = this.getCurrentQuiz();

        question.userAnswered = selection;
        question.isCompleted = true;

        if (question.isAnswerCorrect(selection)) {
            options[selection].classList.add("correct");
            score.innerText = ++this.score;
        } else {
            options[selection].classList.add("incorrect");
            options[question.correctAnswer].classList.add("correct");
        }
        console.log(question);
        localStorage.setItem("quizData", JSON.stringify(this.quizzes));
        this.isQuizOver();
    }
}

class Question {
    constructor(question, options, correctAnswer) {
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.isCompleted = false;
        this.userAnswered = null;
    }

    isAnswerCorrect(index) {
        return this.correctAnswer === index;
    }

    createUI() {
        const p = document.createElement("p");
        p.innerText = this.question;
        const options = document.createElement("div");
        options.classList.add("options");
        const option = this.options.map((opt) => `<p class="option">${opt}</p>`).join("");
        options.innerHTML = option;
        root.append(p, options);
    }
}

const root = document.querySelector(".question");
const score = document.querySelector(".score");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

const ques = questions.map((obj) => new Question(obj.question, obj.options, obj.correctAnswer));
const quiz = new Quiz(ques);

quiz.render();

prev.addEventListener("click", function () {
    quiz.prev();
    quiz.render();
});

next.addEventListener("click", function () {
    quiz.next();
    quiz.render();
});
