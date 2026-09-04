/* =====================================================
   PUZZLE MASTER 6.0
   2000 PROCEDURAL LEVELS
===================================================== */

const TOTAL_LEVELS = 2000;
const SAVE_KEY = "PUZZLE_MASTER_6";

let game = JSON.parse(localStorage.getItem(SAVE_KEY)) || {

  unlocked: 1,
  completed: [],
  stars: 0,
  coins: 100,
  lives: 5,

  xp: 0,
  streak: 0,

  correct: 0,
  wrong: 0,

  bestLevel: 1
};

let currentLevel = 1;
let currentQuestion = null;
let timer = null;
let timeLeft = 20;
let answered = false;


/* =====================================================
   SAVE
===================================================== */

function saveGame() {

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(game)
  );

}


/* =====================================================
   RANDOM HELPERS
===================================================== */

function rand(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}


function shuffle(array) {

  return array
    .map(value => ({
      value,
      sort: Math.random()
    }))
    .sort((a,b) => a.sort - b.sort)
    .map(obj => obj.value);

}


/* =====================================================
   QUESTION GENERATORS
===================================================== */

function mathQuestion(level) {

  const difficulty = Math.min(
    10,
    Math.floor(level / 200) + 1
  );

  const type = level % 5;

  if(type === 0) {

    const a = rand(2, 10 * difficulty);
    const b = rand(2, 10 * difficulty);
    const x = rand(1, 20 * difficulty);

    const result = a * x + b;

    return {
      category: "MATH",
      icon: "🔢",
      type: "numeric",
      question:
        `إذا كان ${a} × س + ${b} = ${result}، فما قيمة س؟`,
      answer: x,
      hint:
        `انقل ${b} للطرف الآخر ثم اقسم على ${a}.`
    };
  }


  if(type === 1) {

    const a = rand(2, 20 * difficulty);
    const b = rand(2, 20 * difficulty);

    return {
      category: "MATH",
      icon: "➕",
      type: "mcq",
      question:
        `ما ناتج ${a}² + ${b}²؟`,
      answer: a*a + b*b,
      options: shuffle([
        a*a + b*b,
        a*a + b,
        (a+b)*(a+b),
        a*b
      ]),
      hint:
        `احسب مربع كل عدد ثم اجمعهما.`
    };
  }


  if(type === 2) {

    const start = rand(2, 20);
    const diff = rand(2, 15);
    const n = rand(5, 12);

    const answer =
      start + (n - 1) * diff;

    return {
      category: "MATH",
      icon: "📐",
      type: "numeric",
      question:
        `متتابعة حسابية تبدأ بـ ${start} والفرق ${diff}. ما الحد رقم ${n}؟`,
      answer,
      hint:
        `استخدم: الحد = الأول + (ن−1) × الفرق`
    };
  }


  if(type === 3) {

    const a = rand(2, 12 * difficulty);
    const b = rand(2, 12 * difficulty);

    return {
      category: "MATH",
      icon: "✖️",
      type: "numeric",
      question:
        `ما قيمة ${a} × ${b}؟`,
      answer: a*b,
      hint:
        `اضرب العددين.`
    };
  }


  const a = rand(10, 100 * difficulty);
  const b = rand(2, a);

  return {
    category: "MATH",
    icon: "➗",
    type: "numeric",
    question:
      `ما ناتج ${a} ÷ ${b} إذا كان الناتج عددًا صحيحًا؟`,
    answer:
      Number.isInteger(a/b) ? a/b : Math.round(a/b),
    hint:
      `اقسم العدد الأول على الثاني.`
  };
}


/* =====================================================
   PHYSICS
===================================================== */

function physicsQuestion(level) {

  const difficulty =
    Math.min(10, Math.floor(level / 200) + 1);

  const type = level % 8;


  /* F = ma */

  if(type === 0) {

    const m = rand(2, 10 * difficulty);
    const a = rand(2, 10);

    return {
      category: "PHYSICS",
      icon: "⚡",
      type: "numeric",
      question:
        `جسم كتلته ${m} kg ويتحرك بعجلة ${a} m/s². ما القوة المحصلة؟`,
      answer: m*a,
      hint:
        `استخدم قانون نيوتن الثاني: F = m × a`
    };
  }


  /* V = IR */

  if(type === 1) {

    const R = rand(2, 20);
    const I = rand(1, 10);

    return {
      category: "PHYSICS",
      icon: "🔌",
      type: "numeric",
      question:
        `مقاومة قيمتها ${R} Ω ويمر بها تيار ${I} A. ما فرق الجهد؟`,
      answer: R*I,
      hint:
        `V = I × R`
    };
  }


  /* KE */

  if(type === 2) {

    const m = rand(2, 20);
    const v = rand(2, 10);

    return {
      category: "PHYSICS",
      icon: "🚀",
      type: "numeric",
      question:
        `جسم كتلته ${m} kg وسرعته ${v} m/s. احسب طاقة حركته.`,
      answer: 0.5*m*v*v,
      hint:
        `KE = ½mv²`
    };
  }


  /* P = VI */

  if(type === 3) {

    const V = rand(10, 100);
    const I = rand(1, 10);

    return {
      category: "PHYSICS",
      icon: "💡",
      type: "numeric",
      question:
        `جهاز يعمل بفرق جهد ${V} V وتيار ${I} A. ما قدرته؟`,
      answer: V*I,
      hint:
        `P = V × I`
    };
  }


  /* W = Fd */

  if(type === 4) {

    const F = rand(5, 50);
    const d = rand(2, 20);

    return {
      category: "PHYSICS",
      icon: "🏋️",
      type: "numeric",
      question:
        `قوة مقدارها ${F} N أثرت خلال مسافة ${d} m في نفس اتجاه الحركة. ما الشغل؟`,
      answer: F*d,
      hint:
        `W = F × d`
    };
  }


  /* momentum */

  if(type === 5) {

    const m = rand(2, 20);
    const v = rand(2, 15);

    return {
      category: "PHYSICS",
      icon: "🎯",
      type: "numeric",
      question:
        `جسم كتلته ${m} kg وسرعته ${v} m/s. ما كمية حركته؟`,
      answer: m*v,
      hint:
        `p = m × v`
    };
  }


  /* PE */

  if(type === 6) {

    const m = rand(2, 20);
    const h = rand(2, 10);

    return {
      category: "PHYSICS",
      icon: "🌍",
      type: "numeric",
      question:
        `اعتبر g = 10 m/s². جسم كتلته ${m} kg على ارتفاع ${h} m. ما طاقة وضعه؟`,
      answer: m*10*h,
      hint:
        `PE = mgh`
    };
  }


  /* distance */

  const v = rand(5, 30);
  const t = rand(2, 20);

  return {
    category: "PHYSICS",
    icon: "🏎️",
    type: "numeric",
    question:
      `سيارة سرعتها ${v} m/s لمدة ${t} ثانية. ما المسافة التي قطعتها؟`,
    answer: v*t,
    hint:
      `d = v × t`
  };
}


/* =====================================================
   LOGIC
===================================================== */

function logicQuestion(level) {

  const type = level % 6;


  if(type === 0) {

    const a = rand(2, 10);
    const b = rand(2, 10);

    return {
      category: "LOGIC",
      icon: "🧠",
      type: "mcq",
      question:
        `إذا كان كل ${a} يتحول إلى ${b}، فماذا يحدث لـ ${a*2}؟`,
      answer: b*2,
      options: shuffle([
        b*2,
        a+b,
        a*b,
        b+a*2
      ]),
      hint:
        `حافظ على نفس قاعدة التحويل.`
    };
  }


  if(type === 1) {

    const start = rand(1, 10);
    const diff = rand(2, 10);

    const seq = [
      start,
      start+diff,
      start+diff*2,
      start+diff*3
    ];

    return {
      category: "LOGIC",
      icon: "🔢",
      type: "mcq",
      question:
        `ما العدد التالي؟ ${seq.join(" ، ")} ، ؟`,
      answer: start+diff*4,
      options: shuffle([
        start+diff*4,
        start+diff*5,
        start+diff*3,
        start*diff
      ]),
      hint:
        `ابحث عن الفرق الثابت بين الأعداد.`
    };
  }


  if(type === 2) {

    const n = rand(3, 15);

    return {
      category: "LOGIC",
      icon: "♟️",
      type: "mcq",
      question:
        `لديك ${n} صناديق، في كل صندوق كرتان. كم كرة لديك؟`,
      answer: n*2,
      options: shuffle([
        n*2,
        n+2,
        n*n,
        n
      ]),
      hint:
        `اضرب عدد الصناديق في عدد الكرات داخل كل صندوق.`
    };
  }


  if(type === 3) {

    const a = rand(3, 12);

    return {
      category: "LOGIC",
      icon: "🔐",
      type: "numeric",
      question:
        `إذا كان 1 = 1، 2 = 4، 3 = 9، فما قيمة ${a}؟`,
      answer: a*a,
      hint:
        `كل عدد يتم ضربه في نفسه.`
    };
  }


  if(type === 4) {

    const a = rand(5, 20);

    return {
      category: "LOGIC",
      icon: "🧩",
      type: "mcq",
      question:
        `عدد إذا أضفت إليه 5 أصبح ${a+5}. ما العدد؟`,
      answer: a,
      options: shuffle([
        a,
        a+5,
        a-5,
        a*5
      ]),
      hint:
        `اطرح 5 من الناتج.`
    };
  }


  const a = rand(2, 10);

  return {
    category: "LOGIC",
    icon: "🔎",
    type: "numeric",
    question:
      `ما ناتج ${a} × ${a} − ${a}؟`,
    answer: a*a-a,
    hint:
      `اضرب أولًا ثم اطرح.`
  };
}


/* =====================================================
   BOSS
===================================================== */

function bossQuestion(level) {

  const type = level % 4;


  if(type === 0) {

    const m = rand(5, 20);
    const a = rand(3, 10);

    return {
      category: "BOSS",
      icon: "👑",
      type: "numeric",
      question:
        `👑 BOSS: جسم كتلته ${m} kg تؤثر عليه قوة محصلة تجعله يتسارع ${a} m/s². احسب القوة.`,
      answer: m*a,
      hint:
        `F = ma`
    };
  }


  if(type === 1) {

    const V = rand(20,100);
    const R = rand(2,10);

    return {
      category: "BOSS",
      icon: "👑",
      type: "numeric",
      question:
        `👑 BOSS: دائرة كهربية جهدها ${V} V ومقاومتها ${R} Ω. احسب شدة التيار.`,
      answer: V/R,
      hint:
        `I = V ÷ R`
    };
  }


  if(type === 2) {

    const v = rand(5,20);
    const t = rand(5,20);

    return {
      category: "BOSS",
      icon: "👑",
      type: "numeric",
      question:
        `👑 BOSS: جسم يتحرك بسرعة ثابتة ${v} m/s لمدة ${t} s. ما الإزاحة؟`,
      answer: v*t,
      hint:
        `d = vt`
    };
  }


  const a = rand(10,50);

  return {
    category: "BOSS",
    icon: "👑",
    type: "mcq",
    question:
      `👑 BOSS: أي قانون يربط القوة بالكتلة والعجلة؟`,
    answer: "F = ma",
    options: shuffle([
      "F = ma",
      "V = IR",
      "P = VI",
      "W = Fd"
    ]),
    hint:
      `إنه قانون نيوتن الثاني.`
  };
}


/* =====================================================
   CREATE 2000 LEVELS
===================================================== */

const LEVELS = [];

for(let i = 1; i <= TOTAL_LEVELS; i++) {

  let q;

  if(i % 10 === 0) {

    q = bossQuestion(i);

  } else {

    const type = i % 3;

    if(type === 0) {
      q = physicsQuestion(i);
    }

    else if(type === 1) {
      q = mathQuestion(i);
    }

    else {
      q = logicQuestion(i);
    }

  }

  q.level = i;

  LEVELS.push(q);
}


/* =====================================================
   PAGE SYSTEM
===================================================== */

function showPage(id) {

  document
    .querySelectorAll(".page")
    .forEach(page =>
      page.classList.remove("active")
    );

  document
    .getElementById(id)
    .classList.add("active");
}


function goHome() {

  clearInterval(timer);

  showPage("homePage");

  updateUI();

}


/* =====================================================
   LEVEL MAP
===================================================== */

function openLevels() {

  clearInterval(timer);

  showPage("levelsPage");

  renderLevels();

}


function renderLevels() {

  const grid =
    document.getElementById("levelsGrid");

  grid.innerHTML = "";

  const fragment =
    document.createDocumentFragment();


  for(let i = 1; i <= TOTAL_LEVELS; i++) {

    const btn =
      document.createElement("button");

    btn.className = "level";

    if(i % 10 === 0) {
      btn.classList.add("boss");
    }

    if(game.completed.includes(i)) {
      btn.classList.add("completed");
    }

    if(i === game.unlocked) {
      btn.classList.add("current");
    }

    if(i > game.unlocked) {

      btn.classList.add("locked");

      btn.innerHTML =
        `<span>🔒</span>`;

    } else {

      btn.innerHTML =
        `<span>${i}</span>`;

      btn.onclick = () =>
        startLevel(i);

    }

    fragment.appendChild(btn);
  }

  grid.appendChild(fragment);

  updateLevelProgress();

}


function updateLevelProgress() {

  document.getElementById(
    "levelProgressText"
  ).textContent =
    `${game.unlocked} / ${TOTAL_LEVELS}`;

  const percent =
    ((game.unlocked - 1) /
    (TOTAL_LEVELS - 1)) * 100;

  document.getElementById(
    "levelProgress"
  ).style.width =
    percent + "%";

}


/* =====================================================
   START LEVEL
===================================================== */

function startLevel(level) {

  if(level > game.unlocked) return;

  currentLevel = level;

  currentQuestion =
    LEVELS[level - 1];

  answered = false;

  showPage("quizPage");

  setupQuestion();

}


/* =====================================================
   SETUP QUESTION
===================================================== */

function setupQuestion() {

  clearInterval(timer);

  document.getElementById(
    "currentLevel"
  ).textContent =
    currentLevel;

  document.getElementById(
    "categoryName"
  ).textContent =
    currentQuestion.category;

  document.getElementById(
    "categoryIcon"
  ).textContent =
    currentQuestion.icon;

  document.getElementById(
    "questionText"
  ).textContent =
    currentQuestion.question;

  document.getElementById(
    "difficulty"
  ).textContent =
    currentQuestion.category === "BOSS"
      ? "👑 BOSS LEVEL"
      : `LEVEL ${currentLevel}`;


  document.getElementById(
    "quizProgressBar"
  ).style.width =
    ((currentLevel / TOTAL_LEVELS) * 100) + "%";


  const answers =
    document.getElementById("answers");

  const numeric =
    document.getElementById("numericAnswer");

  answers.innerHTML = "";

  numeric.classList.add("hidden");


  if(currentQuestion.type === "mcq") {

    currentQuestion.options
      .forEach(option => {

        const btn =
          document.createElement("button");

        btn.className = "answer";

        btn.textContent = option;

        btn.onclick = () =>
          checkAnswer(option, btn);

        answers.appendChild(btn);

      });

  } else {

    numeric.classList.remove("hidden");

    document.getElementById(
      "answerInput"
    ).value = "";

    setTimeout(() => {
      document.getElementById(
        "answerInput"
      ).focus();
    },100);

  }


  startTimer();

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

  timeLeft =
    currentQuestion.category === "BOSS"
      ? 30
      : 20;

  updateTimer();

  timer =
    setInterval(() => {

      timeLeft--;

      updateTimer();

      if(timeLeft <= 0) {

        clearInterval(timer);

        if(!answered) {

          answered = true;

          wrongAnswer("انتهى الوقت ⏱️");

        }

      }

    },1000);

}


function updateTimer() {

  document.getElementById(
    "timer"
  ).textContent =
    timeLeft;

}


/* =====================================================
   NUMERIC
===================================================== */

function checkNumeric() {

  if(answered) return;

  const input =
    document.getElementById(
      "answerInput"
    );

  const value =
    Number(input.value);

  if(input.value === "") return;

  checkAnswer(value);

}


document.addEventListener(
  "keydown",
  e => {

    if(
      e.key === "Enter" &&
      document
        .getElementById("quizPage")
        .classList.contains("active")
    ) {

      if(
        currentQuestion &&
        currentQuestion.type === "numeric"
      ) {

        checkNumeric();

      }

    }

  }
);


/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer(value, button=null) {

  if(answered) return;

  answered = true;

  clearInterval(timer);

  const correct =
    String(value).trim().toLowerCase() ===
    String(currentQuestion.answer).trim().toLowerCase();


  if(button) {

    if(correct) {
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
    }

  }


  if(correct) {

    correctAnswer();

  } else {

    wrongAnswer(
      `الإجابة الصحيحة: ${currentQuestion.answer}`
    );

  }

}


/* =====================================================
   CORRECT
===================================================== */

function correctAnswer() {

  game.correct++;

  game.streak++;

  game.xp +=
    currentQuestion.category === "BOSS"
      ? 100
      : 20 + Math.min(game.streak * 2,30);

  game.coins +=
    currentQuestion.category === "BOSS"
      ? 30
      : 5;

  game.stars +=
    currentQuestion.category === "BOSS"
      ? 3
      : 1;


  if(!game.completed.includes(currentLevel)) {

    game.completed.push(currentLevel);

  }


  if(currentLevel === game.unlocked &&
     game.unlocked < TOTAL_LEVELS) {

    game.unlocked++;

  }


  if(currentLevel > game.bestLevel) {

    game.bestLevel =
      currentLevel;

  }


  saveGame();

  showResult(true);

}


/* =====================================================
   WRONG
===================================================== */

function wrongAnswer(message) {

  game.wrong++;

  game.streak = 0;

  game.lives--;

  if(game.lives <= 0) {

    game.lives = 5;

    alert(
      "💔 انتهت الأرواح!\nتمت إعادة الأرواح إلى 5."
    );

  }

  saveGame();

  showResult(false,message);

}


/* =====================================================
   RESULT
===================================================== */

function showResult(success,message="") {

  const modal =
    document.getElementById("resultModal");

  const icon =
    document.getElementById("resultIcon");

  const title =
    document.getElementById("resultTitle");

  const msg =
    document.getElementById("resultMessage");


  if(success) {

    icon.textContent =
      currentQuestion.category === "BOSS"
        ? "👑"
        : "🎉";

    title.textContent =
      currentQuestion.category === "BOSS"
        ? "هزمت الـ BOSS!"
        : "إجابة صحيحة!";

    msg.textContent =
      currentQuestion.category === "BOSS"
        ? "مذهل! أنت مستعد للمستوى التالي."
        : "أداء ممتاز، استمر!";

    document.getElementById(
      "resultStars"
    ).textContent =
      currentQuestion.category === "BOSS"
        ? "+3"
        : "+1";

    document.getElementById(
      "resultCoins"
    ).textContent =
      currentQuestion.category === "BOSS"
        ? "+30"
        : "+5";

    document.getElementById(
      "resultXP"
    ).textContent =
      currentQuestion.category === "BOSS"
        ? "+100 XP"
        : "+20 XP";


    const next =
      document.getElementById("nextBtn");

    if(currentLevel < TOTAL_LEVELS) {

      next.textContent =
        "المرحلة التالية →";

      next.onclick = () => {

        modal.classList.remove("show");

        startLevel(currentLevel + 1);

      };

    } else {

      next.textContent =
        "🏆 إنهاء اللعبة";

      next.onclick = () => {

        modal.classList.remove("show");

        goHome();

      };

    }

  } else {

    icon.textContent = "❌";

    title.textContent =
      "إجابة خاطئة";

    msg.textContent =
      message;

    document.getElementById(
      "resultStars"
    ).textContent =
      "0";

    document.getElementById(
      "resultCoins"
    ).textContent =
      "0";

    document.getElementById(
      "resultXP"
    ).textContent =
      "0 XP";


    document.getElementById(
      "nextBtn"
    ).textContent =
      "إعادة المرحلة ↻";


    document.getElementById(
      "nextBtn"
    ).onclick = () => {

      modal.classList.remove("show");

      startLevel(currentLevel);

    };

  }


  modal.classList.add("show");

  updateUI();

}


/* =====================================================
   HINT
===================================================== */

function useHint() {

  if(!currentQuestion) return;

  if(game.coins < 10) {

    alert("🪙 تحتاج إلى 10 عملات لاستخدام التلميح.");

    return;

  }

  game.coins -= 10;

  saveGame();

  document.getElementById(
    "questionInfo"
  ).textContent =
    "💡 " + currentQuestion.hint;

  updateUI();

}


/* =====================================================
   STATS
===================================================== */

function openStats() {

  clearInterval(timer);

  showPage("statsPage");

  document.getElementById(
    "statsXP"
  ).textContent =
    game.xp;

  document.getElementById(
    "statsCompleted"
  ).textContent =
    game.completed.length;

  document.getElementById(
    "statsCorrect"
  ).textContent =
    game.correct;

  document.getElementById(
    "statsWrong"
  ).textContent =
    game.wrong;

}


/* =====================================================
   UI
===================================================== */

function updateUI() {

  document.getElementById(
    "stars"
  ).textContent =
    game.stars;

  document.getElementById(
    "coins"
  ).textContent =
    game.coins;

  document.getElementById(
    "lives"
  ).textContent =
    game.lives;

  document.getElementById(
    "xp"
  ).textContent =
    game.xp;

  document.getElementById(
    "streak"
  ).textContent =
    game.streak;

  document.getElementById(
    "bestLevel"
  ).textContent =
    game.bestLevel;


  const total =
    game.correct + game.wrong;

  const accuracy =
    total === 0
      ? 0
      : Math.round(
          (game.correct / total) * 100
        );

  document.getElementById(
    "accuracy"
  ).textContent =
    accuracy + "%";

}


/* =====================================================
   INIT
===================================================== */

updateUI();