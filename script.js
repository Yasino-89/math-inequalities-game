// قوالب الأسئلة
const templates = [
    { subject: "عدد الطلاب", operator: ">", operatorText: "أكبر من" },
    { subject: "عدد الكتب", operator: "<", operatorText: "أصغر من" },
    { subject: "عدد السيارات", operator: "≠", operatorText: "لا يساوي" },
    { subject: "وزن الصندوق", operator: "≥", operatorText: "أكبر أو يساوي" },
    { subject: "عدد الكراسي", operator: "≤", operatorText: "أصغر أو يساوي" },
    { subject: "عدد التفاحات", operator: ">", operatorText: "أكبر من" },
    { subject: "عدد الأقلام", operator: "<=", operatorText: "أصغر أو يساوي" },
    { subject: "سعر المنتج", operator: "≥", operatorText: "أكبر أو يساوي" }
];

// دالة توليد سؤال عشوائي
function generateRandomQuestion() {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const randomValue = Math.floor(Math.random() * 50) + 1; // قيمة عشوائية بين 1 و50
    return {
        text: `${template.subject} ${template.operatorText} ${randomValue}`,
        operator: template.operator,
        value: randomValue
    };
}

let currentQuestion = {};
let selectedSymbol = "";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 30;
let timerInterval;

// عناصر الصفحة
const questionElement = document.getElementById("question");
const variableInput = document.getElementById("variable");
const numberInput = document.getElementById("number");
const feedbackElement = document.getElementById("feedback");
const submitButton = document.getElementById("submit");
const nextButton = document.getElementById("next-question");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const timerElement = document.getElementById("timer");
const buttons = document.querySelectorAll(".btn-symbol");
const selectedSymbolElement = document.getElementById("selected-symbol");

// تحديث أعلى النقاط
highScoreElement.textContent = `أعلى النقاط: ${highScore}`;

// بدء اللعبة
document.getElementById("start-game").addEventListener("click", () => {
    const studentName = document.getElementById("student-name").value.trim() || "ضيف";
    document.getElementById("player-name").textContent = `مرحبًا، ${studentName}!`;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    generateQuestion();
});

// توليد سؤال عشوائي
function generateQuestion() {
    currentQuestion = generateRandomQuestion();
    questionElement.textContent = currentQuestion.text;

    feedbackElement.innerHTML = "";
    variableInput.value = "";
    numberInput.value = "";
    selectedSymbol = "";
    selectedSymbolElement.textContent = "؟";
    buttons.forEach((btn) => btn.classList.remove("bg-blue-500", "text-white"));

    resetTimer();
}

// إعادة ضبط المؤقت
function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerElement.textContent = `الوقت: ${timeLeft} ثانية`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `الوقت: ${timeLeft} ثانية`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            feedbackElement.innerHTML = `<p class="text-red-500 font-bold">انتهى الوقت! الإجابة الصحيحة هي: <span class="text-green-500">${currentQuestion.operator} ${currentQuestion.value}</span></p>`;
            nextButton.classList.remove("hidden");
            submitButton.classList.add("hidden");
        }
    }, 1000);
}

// التعامل مع اختيار الرموز
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedSymbol = button.getAttribute("data-symbol");
        buttons.forEach((btn) => btn.classList.remove("bg-blue-500", "text-white"));
        button.classList.add("bg-blue-500", "text-white");
        selectedSymbolElement.textContent = selectedSymbol;
    });
});

// إرسال الإجابة
submitButton.addEventListener("click", () => {
    const variable = variableInput.value.trim();
    const number = parseInt(numberInput.value, 10);

    if (!selectedSymbol || isNaN(number)) {
        feedbackElement.textContent = "يرجى ملء جميع الحقول!";
        feedbackElement.className = "text-red-500";
        return;
    }

    const userAnswer = `${variable || "x"} ${selectedSymbol} ${number}`;
    const correctAnswer = `x ${currentQuestion.operator} ${currentQuestion.value}`;
    const isCorrect = selectedSymbol === currentQuestion.operator && number === currentQuestion.value;

    feedbackElement.innerHTML = `
        <p>إجابتك: <span class="text-blue-500 font-bold">${userAnswer}</span></p>
        <p>الإجابة الصحيحة: <span class="text-green-500 font-bold">${correctAnswer}</span></p>
        <p class="${isCorrect ? "text-green-500" : "text-red-500"} font-bold mt-2">
            ${isCorrect ? "إجابة صحيحة! 🎉" : "إجابة خاطئة!"}
        </p>
    `;

    if (isCorrect) {
        score++;
        scoreElement.textContent = `النقاط: ${score}`;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.textContent = `أعلى النقاط: ${highScore}`;
        }
    }

    clearInterval(timerInterval);
    nextButton.classList.remove("hidden");
    submitButton.classList.add("hidden");
});

// الانتقال للسؤال التالي
nextButton.addEventListener("click", () => {
    nextButton.classList.add("hidden");
    submitButton.classList.remove("hidden");
    generateQuestion();
});
