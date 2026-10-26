const questions = [
{
question: "Which language is used to structure a web page?",
options: ["Python", "HTML", "Java", "C++"],
answer: 1
},
{
question: "Which CSS property changes the text colour?",
options: ["font-style", "background", "color", "text-align"],
answer: 2
},
{
question: "Which keyword declares a block-scoped variable in JavaScript?",
options: ["let", "print", "display", "echo"],
answer: 0
},
{
question: "What does CPU stand for?",
options: [
"Central Program Utility",
"Computer Processing User",
"Central Process Unit",
"Central Processing Unit"
],
answer: 3
},
{
question: "Which HTML tag creates a hyperlink?",
options: ["<link>", "<a>", "<href>", "<url>"],
answer: 1
},
{
question: "Which data structure follows FIFO?",
options: ["Stack", "Tree", "Queue", "Graph"],
answer: 2
},
{
question: "Which symbol is used for a single-line comment in JavaScript?",
options: ["//", "<!-- -->", "**", "##"],
answer: 0
},
{
question: "Which of these is a relational database management system?",
options: ["HTML", "CSS", "Photoshop", "MySQL"],
answer: 3
},
{
question: "What does CSS stand for?",
options: [
"Creative Style System",
"Cascading Style Sheets",
"Computer Styled Sections",
"Colorful Style Sheets"
],
answer: 1
},
{
question: "Which method displays a message in the browser console?",
options: [
"console.log()",
"print.console()",
"message.log()",
"browser.print()"
],
answer: 0
}
];

// DOM ELEMENTS

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const timerDisplay = document.getElementById("timer");
const questionCounter = document.getElementById("question-counter");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const selectionMessage = document.getElementById("selection-message");

// QUIZ STATE

let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 300;
let timerInterval = null;
let quizFinished = false;

// START QUIZ

function startQuiz() {
clearInterval(timerInterval);

currentQuestion = 0;
userAnswers = new Array(questions.length).fill(null);
timeLeft = 300;
quizFinished = false;

welcomeScreen.classList.add("hidden");
resultScreen.classList.add("hidden");
quizScreen.classList.remove("hidden");

renderQuestion();
updateTimerDisplay();

timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
        finishQuiz();
    }
}, 1000);

}

// DISPLAY QUESTION

function renderQuestion() {
const question = questions[currentQuestion];

questionText.textContent = question.question;
optionsContainer.innerHTML = "";

question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "option-btn";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const optionText = document.createElement("span");
    optionText.textContent = option;

    button.append(letter, optionText);

    button.setAttribute(
        "aria-pressed",
        String(userAnswers[currentQuestion] === index)
    );

    if (userAnswers[currentQuestion] === index) {
        button.classList.add("selected");
    }

    button.addEventListener("click", () => {
        selectAnswer(index);
    });

    optionsContainer.appendChild(button);
});

updateProgress();

prevBtn.disabled = currentQuestion === 0;

prevBtn.style.opacity = currentQuestion === 0 ? "0.5" : "1";
prevBtn.style.cursor = currentQuestion === 0 ? "not-allowed" : "pointer";

nextBtn.innerHTML =
    currentQuestion === questions.length - 1
        ? "Finish quiz ✓"
        : "Next question →";

selectionMessage.textContent =
    userAnswers[currentQuestion] === null
        ? "Select one answer to continue."
        : "Answer saved. You can change it before finishing.";

nextBtn.disabled = false;
nextBtn.style.opacity = "1";


}

// SELECT ANSWER

function selectAnswer(index) {
userAnswers[currentQuestion] = index;


const buttons = optionsContainer.querySelectorAll(".option-btn");

buttons.forEach((button, buttonIndex) => {
    const isSelected = buttonIndex === index;

    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
});

selectionMessage.textContent = "Answer saved successfully.";


}

// UPDATE PROGRESS

function updateProgress() {
const total = questions.length;
const questionNumber = currentQuestion + 1;
const percentage = Math.round((questionNumber / total) * 100);
questionCounter.textContent =
    `QUESTION ${String(questionNumber).padStart(2, "0")} OF ${total}`;

progressPercent.textContent = `${percentage}% completed`;
progressBar.style.width = `${percentage}%`;


}

// TIMER

function updateTimerDisplay() {
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;

timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

if (timeLeft <= 60) {
    timerDisplay.style.color = "#D94F70";
} else {
    timerDisplay.style.color = "#25213B";
}
}

// NEXT QUESTION

function goToNextQuestion() {
if (quizFinished) return;
if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
} else {
    finishQuiz();
}

}

// PREVIOUS QUESTION

function goToPreviousQuestion() {
if (quizFinished || currentQuestion === 0) return;


currentQuestion--;
renderQuestion();


}

// FINISH QUIZ

function finishQuiz() {
if (quizFinished) return;


quizFinished = true;

clearInterval(timerInterval);

const correctAnswers = questions.reduce((total, question, index) => {
    return total + (userAnswers[index] === question.answer ? 1 : 0);
}, 0);

const totalQuestions = questions.length;
const unanswered = userAnswers.filter(answer => answer === null).length;
const incorrect = totalQuestions - correctAnswers - unanswered;
const percentage = Math.round((correctAnswers / totalQuestions) * 100);

quizScreen.classList.add("hidden");
welcomeScreen.classList.add("hidden");
resultScreen.classList.remove("hidden");

document.getElementById("score").textContent = correctAnswers;

document.getElementById("total-score").textContent = totalQuestions;

document.getElementById("correct-count").textContent = correctAnswers;

document.getElementById("wrong-count").textContent =
    incorrect + unanswered;

document.getElementById("score-percentage").textContent =
    `${percentage}% accuracy`;

document.getElementById("score-bar").style.width = `${percentage}%`;

const resultHeading = document.getElementById("result-heading");
const resultMessage = document.getElementById("result-message");

if (percentage >= 80) {
    resultHeading.textContent = "Brilliant work! ✨";
    resultMessage.textContent =
        "Your hard work is shining through. Keep challenging yourself!";
} else if (percentage >= 50) {
    resultHeading.textContent = "You're making progress! 🌷";
    resultMessage.textContent =
        "Every attempt makes you better. Keep learning and growing!";
} else {
    resultHeading.textContent = "Every expert starts somewhere. 💜";
    resultMessage.textContent =
        "Review what you learned and try again. Your next attempt can be even better!";
}


}

// RESTART QUIZ

function restartQuiz() {
clearInterval(timerInterval);


currentQuestion = 0;
userAnswers = [];
timeLeft = 300;
quizFinished = false;

resultScreen.classList.add("hidden");
quizScreen.classList.add("hidden");
welcomeScreen.classList.remove("hidden");

timerDisplay.style.color = "#25213B";
progressBar.style.width = "10%";
document.getElementById("score-bar").style.width = "0%";
}

// EVENT LISTENERS

startBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", goToNextQuestion);

prevBtn.addEventListener("click", goToPreviousQuestion);

restartBtn.addEventListener("click", restartQuiz);
