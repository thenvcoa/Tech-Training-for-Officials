/* ==========================================================
   VHSL Cheer Tech Officials Training — app logic
   ========================================================== */

// ---- CONFIGURATION ----
// Paste the "Web app URL" you get after deploying the Google Apps Script
// (see /apps-script/README.md) here:
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Require BOTH the minimum dwell time AND (if the section has videos) that
// every video has been watched to completion, before unlocking the next tab.
// Set to false if you'd rather require only ONE of the two conditions.
const REQUIRE_BOTH_TIME_AND_VIDEOS = true;

// Minimum percentage of questions an official must get right on the
// knowledge check to pass and unlock the verification page.
const QUIZ_PASS_PERCENT = 85;

const STORAGE_KEY = "vhsl_cheer_training_progress_v1";

let state = {
  currentIndex: 0,
  sectionProgress: {}, // id -> { enteredAt, elapsedBeforePause, videosWatched: {videoId:true}, unlocked, quizAnswers, quizSubmitted }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.sectionProgress = saved.sectionProgress || {};
      state.currentIndex = 0; // always resume review from first incomplete section on reload
    }
  } catch (e) { /* ignore */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sectionProgress: state.sectionProgress }));
  } catch (e) { /* ignore */ }
}

function getProgress(sectionId) {
  if (!state.sectionProgress[sectionId]) {
    state.sectionProgress[sectionId] = {
      elapsedSeconds: 0,
      videosWatched: {},
      unlocked: false,
      timerStart: null,
      quizAnswers: {},
      quizSubmitted: false,
      quizPassed: false,
      quizResult: {},
      explanationsReviewed: false,
      currentQuestionIndex: 0
    };
  }
  const p = state.sectionProgress[sectionId];
  // Defensive defaults for progress saved by an earlier version of this quiz.
  if (!p.quizResult) p.quizResult = {};
  if (typeof p.explanationsReviewed !== "boolean") p.explanationsReviewed = false;
  if (typeof p.currentQuestionIndex !== "number") p.currentQuestionIndex = 0;
  return p;
}

function allVideoIdsForSection(section) {
  const matches = [...section.bodyHTML.matchAll(/data-video-id="([^"]+)"/g)];
  return [...new Set(matches.map(m => m[1]))];
}

function sectionMeetsRequirements(section) {
  const p = getProgress(section.id);
  const timeOk = p.elapsedSeconds >= (section.minSeconds || 0);
  const videoIds = allVideoIdsForSection(section);
  const videosOk = videoIds.length === 0 || videoIds.every(id => p.videosWatched[id]);
  if (section.isQuiz) {
    return p.quizPassed && p.explanationsReviewed;
  }
  if (videoIds.length === 0) return timeOk;
  return REQUIRE_BOTH_TIME_AND_VIDEOS ? (timeOk && videosOk) : (timeOk || videosOk);
}

function isSectionUnlockedForNav(index) {
  if (index === 0) return true;
  // a section is reachable if every prior section's requirements are already met
  for (let i = 0; i < index; i++) {
    if (!sectionMeetsRequirements(TRAINING_SECTIONS[i])) return false;
  }
  return true;
}

// ---------- Timer ----------
let timerInterval = null;
function startTimer(section) {
  stopTimer();
  const p = getProgress(section.id);
  p.timerStart = Date.now();
  timerInterval = setInterval(() => {
    p.elapsedSeconds += 1;
    updateGateBanner(section);
    saveState();
  }, 1000);
}
function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ---------- Rendering ----------
function renderSidebar() {
  const list = document.getElementById("nav-list");
  list.innerHTML = "";
  TRAINING_SECTIONS.forEach((section, i) => {
    const li = document.createElement("li");
    const unlocked = isSectionUnlockedForNav(i);
    const complete = sectionMeetsRequirements(section);
    const btn = document.createElement("button");
    btn.className = "navlink" + (i === state.currentIndex ? " active" : "") +
                     (complete ? " complete" : "") + (!unlocked ? " locked" : "");
    btn.setAttribute("aria-current", i === state.currentIndex ? "true" : "false");
    btn.disabled = !unlocked;
    btn.innerHTML = `<span class="step-badge">${complete ? "&#10003;" : (i+1)}</span>
      <span>${section.navLabel}</span>
      ${!unlocked ? '<span class="lock-icon">&#128274;</span>' : ""}`;
    btn.addEventListener("click", () => { if (unlocked) goToSection(i); });
    li.appendChild(btn);
    list.appendChild(li);
  });

  const doneCount = TRAINING_SECTIONS.filter(s => sectionMeetsRequirements(s)).length;
  const pct = Math.round((doneCount / TRAINING_SECTIONS.length) * 100);
  document.getElementById("overall-track-fill").style.width = pct + "%";
  document.getElementById("overall-track-label").textContent = `${pct}% complete`;
}

function renderSection(index) {
  const section = TRAINING_SECTIONS[index];
  const main = document.getElementById("main-content");

  const prevLocked = !isSectionUnlockedForNav(index);
  main.innerHTML = `
    <section class="section active" id="section-${section.id}">
      <span class="kicker">${section.kicker}</span>
      <h2 class="display">${section.title}</h2>
      ${section.subtitle ? `<p class="subtitle">${section.subtitle}</p>` : ""}
      ${prevLocked ? `<div class="locked-msg">&#128274; Complete the previous section to unlock this one.</div>` : section.bodyHTML}
      <div class="gate-banner" id="gate-banner"></div>
    </section>
  `;

  if (prevLocked) return;

  if (section.isQuiz) buildQuiz(section);
  if (section.isForm) buildForm(section);

  wireVideos(section);
  startTimer(section);
  updateGateBanner(section);
}

function updateGateBanner(section) {
  const banner = document.getElementById("gate-banner");
  if (!banner) return;
  const p = getProgress(section.id);
  const videoIds = allVideoIdsForSection(section);
  const timeOk = p.elapsedSeconds >= (section.minSeconds || 0);
  const videosOk = videoIds.length === 0 || videoIds.every(id => p.videosWatched[id]);
  const met = sectionMeetsRequirements(section);
  const idx = TRAINING_SECTIONS.findIndex(s => s.id === section.id);
  const isLast = idx === TRAINING_SECTIONS.length - 1;

  let reqsHTML = "";
  if (section.isQuiz) {
    if (!p.quizPassed) {
      reqsHTML = `<span class="req"><span class="dot"></span>Score ${QUIZ_PASS_PERCENT}%+ to continue</span>`;
    } else if (!p.explanationsReviewed) {
      reqsHTML = `<span class="req"><span class="dot"></span>Scroll through every explanation below to continue</span>`;
    } else {
      reqsHTML = `<span class="req done"><span class="dot"></span>Knowledge check complete</span>`;
    }
  } else if (section.isForm) {
    reqsHTML = `<span class="req done"><span class="dot"></span>Fill out the form below to finish</span>`;
  } else {
    const remaining = Math.max(0, (section.minSeconds||0) - p.elapsedSeconds);
    reqsHTML = `<span class="req ${timeOk ? "done" : ""}"><span class="dot"></span>${timeOk ? "Time requirement met" : `On this page: ${remaining}s remaining`}</span>`;
    if (videoIds.length > 0) {
      const watchedCount = videoIds.filter(id => p.videosWatched[id]).length;
      reqsHTML += `<span class="req ${videosOk ? "done" : ""}"><span class="dot"></span>${videosOk ? "All videos watched" : `Videos watched: ${watchedCount}/${videoIds.length}`}</span>`;
    }
  }

  const metChanged = banner.getAttribute("data-met") !== String(met);
  banner.setAttribute("data-met", String(met));

  banner.innerHTML = `
    ${reqsHTML}
    <div class="gate-spacer"></div>
    <button class="btn btn-secondary" id="btn-back" ${idx===0?"disabled":""}>&larr; Back</button>
    <button class="btn btn-primary" id="btn-continue" ${(met && !isLast) ? "" : "disabled"}>
      Continue &rarr;
    </button>
  `;
  const backBtn = document.getElementById("btn-back");
  if (backBtn) backBtn.addEventListener("click", () => goToSection(idx - 1));
  const contBtn = document.getElementById("btn-continue");
  if (contBtn) contBtn.addEventListener("click", () => goToSection(idx + 1));

  // Only rebuild the sidebar nav when this section's completion state actually flips --
  // not on every 1-second timer tick. Rebuilding every tick wastes work and risks yanking
  // a nav button out from under a person mid-click.
  if (metChanged) renderSidebar();
}

function goToSection(index) {
  if (index < 0 || index >= TRAINING_SECTIONS.length) return;
  if (!isSectionUnlockedForNav(index)) return;
  stopTimer();
  state.currentIndex = index;
  renderSection(index);
  renderSidebar();
  document.getElementById("main-content").scrollTo?.(0,0);
  window.scrollTo(0,0);
  closeSidebarMobile();
}

function wireVideos(section) {
  const videos = document.querySelectorAll(`#section-${section.id} video`);
  const p = getProgress(section.id);
  videos.forEach(video => {
    const id = video.getAttribute("data-video-id");
    if (p.videosWatched[id]) {
      markWatchUI(id, true);
    }
    video.addEventListener("ended", () => {
      p.videosWatched[id] = true;
      markWatchUI(id, true);
      saveState();
      updateGateBanner(section);
    });
    // also count as watched if user scrubs to the end
    video.addEventListener("timeupdate", () => {
      if (video.duration && video.currentTime >= video.duration - 0.35) {
        if (!p.videosWatched[id]) {
          p.videosWatched[id] = true;
          markWatchUI(id, true);
          saveState();
          updateGateBanner(section);
        }
      }
    });
  });
}

function markWatchUI(videoId, watched) {
  const el = document.querySelector(`.watch-check[data-watch-for="${videoId}"]`);
  if (!el) return;
  if (watched) {
    el.classList.add("done");
    el.innerHTML = `<span class="dot"></span>Watched`;
  }
}

// ---------- Quiz ----------
// Trivia-game style knowledge check. Officials move freely between
// questions (no timer, no forced order) and can change any answer right up
// until they submit. A failed attempt colors each question's choices —
// green for the correct one, red for whatever they picked instead — but
// never reveals *why*. Only after reaching the pass threshold do the full
// explanations (and any explanation videos) unlock, and officials must
// scroll through every one of them before the training lets them continue.
function buildQuiz(section) {
  const container = document.getElementById("quiz-container");
  const p = getProgress(section.id);
  const total = QUIZ_DATA.length;

  function letterFor(i) { return String.fromCharCode(65 + i); }

  function renderVideoEmbed(type, ref, label) {
    if (!type || type === "none" || !ref) return "";
    if (type === "youtube") {
      return `<div class="quiz-video-wrap"><iframe src="https://www.youtube.com/embed/${ref}" title="${label}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    if (type === "gdrive") {
      return `<div class="quiz-video-wrap"><iframe src="https://drive.google.com/file/d/${ref}/preview" title="${label}" loading="lazy" allow="autoplay"></iframe></div>`;
    }
    if (type === "mp4") {
      return `<div class="quiz-video-wrap"><video controls preload="metadata" src="${ref}"></video></div>`;
    }
    return "";
  }

  function allAnswered() {
    return QUIZ_DATA.every((_, i) => p.quizAnswers[i] !== undefined);
  }

  function scoreNow() {
    let correct = 0;
    QUIZ_DATA.forEach((item, i) => { if (item.correct.includes(p.quizAnswers[i])) correct++; });
    return correct;
  }

  function renderPlaying() {
    const qi = p.currentQuestionIndex;
    const item = QUIZ_DATA[qi];
    const answeredCount = Object.keys(p.quizAnswers).filter(k => p.quizAnswers[k] !== undefined).length;
    const unansweredCount = total - answeredCount;
    const attempted = p.quizSubmitted;

    const dotsHTML = QUIZ_DATA.map((_, i) => {
      let cls = "quiz-dot";
      if (i === qi) cls += " current";
      if (p.quizAnswers[i] !== undefined) cls += " answered";
      if (attempted) {
        if (p.quizResult[i] === true) cls += " correct";
        else if (p.quizResult[i] === false) cls += " incorrect";
      }
      return `<button type="button" class="${cls}" data-jump="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`;
    }).join("");

    const chosen = p.quizAnswers[qi];
    const resultKnown = attempted && p.quizResult[qi] !== undefined;

    const choicesHTML = item.choices.map((choice, oi) => {
      let cls = "quiz-choice";
      if (chosen === oi) cls += " selected";
      if (resultKnown) {
        if (item.correct.includes(oi)) cls += " correct";
        else if (chosen === oi) cls += " incorrect";
      }
      return `
        <button type="button" class="${cls}" data-oi="${oi}">
          <span class="quiz-choice-letter">${letterFor(oi)}</span>
          <span class="quiz-choice-text">${choice}</span>
        </button>`;
    }).join("");

    let bannerHTML = "";
    if (attempted) {
      const correctCount = Object.values(p.quizResult).filter(v => v === true).length;
      const percent = Math.round((correctCount / total) * 100);
      bannerHTML = `
        <div class="quiz-summary fail" style="margin-bottom:1rem;">
          You scored ${correctCount} / ${total} (${percent}%). You need ${QUIZ_PASS_PERCENT}%+ to pass.
          Green choices below are correct — red is what you picked. Fix the red ones and resubmit.
        </div>`;
    }

    container.innerHTML = `
      <div class="quiz-game-wrap">
        <div class="quiz-progress-dots">${dotsHTML}</div>
        ${bannerHTML}
        <div class="quiz-game-card">
          <div class="quiz-game-kicker">Question ${qi + 1} of ${total}</div>
          ${renderVideoEmbed(item.videoType, item.videoRef, "Question video")}
          <p class="quiz-question-text">${item.question}</p>
          <div class="quiz-choices">${choicesHTML}</div>
        </div>
        <div class="quiz-nav-bar">
          <button class="btn btn-secondary" id="quiz-prev-btn" ${qi === 0 ? "disabled" : ""}>&larr; Previous</button>
          <button class="btn btn-secondary" id="quiz-next-btn" ${qi === total - 1 ? "disabled" : ""}>Next &rarr;</button>
          <div class="gate-spacer"></div>
          <button class="btn btn-primary" id="quiz-submit-btn">${attempted ? "Resubmit Quiz" : "Submit Quiz"}</button>
        </div>
        ${unansweredCount > 0 ? `<p class="quiz-unanswered-note">${unansweredCount} question${unansweredCount === 1 ? "" : "s"} still unanswered — skip around freely, they'll just count as incorrect if you submit without going back.</p>` : ""}
      </div>
    `;

    container.querySelectorAll(".quiz-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        p.quizAnswers[qi] = parseInt(btn.getAttribute("data-oi"), 10);
        saveState();
        renderPlaying();
      });
    });
    container.querySelectorAll("[data-jump]").forEach(btn => {
      btn.addEventListener("click", () => {
        p.currentQuestionIndex = parseInt(btn.getAttribute("data-jump"), 10);
        saveState();
        renderPlaying();
      });
    });
    const prevBtn = document.getElementById("quiz-prev-btn");
    if (prevBtn) prevBtn.addEventListener("click", () => {
      p.currentQuestionIndex = Math.max(0, qi - 1); saveState(); renderPlaying();
    });
    const nextBtn = document.getElementById("quiz-next-btn");
    if (nextBtn) nextBtn.addEventListener("click", () => {
      p.currentQuestionIndex = Math.min(total - 1, qi + 1); saveState(); renderPlaying();
    });
    const submitBtn = document.getElementById("quiz-submit-btn");
    if (submitBtn) submitBtn.addEventListener("click", () => {
      const result = {};
      QUIZ_DATA.forEach((q, i) => { result[i] = q.correct.includes(p.quizAnswers[i]); });
      const correctCount = Object.values(result).filter(Boolean).length;
      const percent = Math.round((correctCount / total) * 100);
      const passed = percent >= QUIZ_PASS_PERCENT;

      p.quizSubmitted = true;
      p.quizResult = result;
      p.quizPassed = passed;
      saveState();
      updateGateBanner(section);

      if (passed) {
        renderReview();
      } else {
        const firstWrong = QUIZ_DATA.findIndex((_, i) => result[i] === false);
        p.currentQuestionIndex = firstWrong === -1 ? 0 : firstWrong;
        saveState();
        renderPlaying();
      }
    });
  }

  function renderReview() {
    const itemsHTML = QUIZ_DATA.map((item, qi) => {
      const chosen = p.quizAnswers[qi];
      const choicesHTML = item.choices.map((choice, oi) => {
        let cls = "quiz-choice review";
        if (item.correct.includes(oi)) cls += " correct";
        else if (chosen === oi) cls += " incorrect";
        return `<div class="${cls}"><span class="quiz-choice-letter">${letterFor(oi)}</span><span class="quiz-choice-text">${choice}</span></div>`;
      }).join("");
      return `
        <div class="quiz-review-item">
          <div class="quiz-game-kicker">Question ${qi + 1} of ${total}</div>
          ${renderVideoEmbed(item.videoType, item.videoRef, "Question video")}
          <p class="quiz-question-text">${item.question}</p>
          <div class="quiz-choices">${choicesHTML}</div>
          <div class="quiz-explanation">
            <h4>Explanation</h4>
            ${item.explanation ? `<p>${item.explanation}</p>` : ""}
            ${renderVideoEmbed(item.explanationVideoType, item.explanationVideoRef, "Explanation video")}
          </div>
        </div>`;
    }).join("");

    const correctCount = Object.values(p.quizResult).filter(Boolean).length;
    const percent = Math.round((correctCount / total) * 100);

    container.innerHTML = `
      <div class="quiz-game-wrap">
        <div class="quiz-summary pass" style="margin-bottom:1rem;">
          🎉 You passed with ${correctCount} / ${total} (${percent}%)! Scroll through every explanation
          below — the Continue button at the bottom of the page unlocks once you've reached the end.
        </div>
        <div class="quiz-review-list">${itemsHTML}</div>
        <div id="quiz-review-sentinel" style="height:1px;"></div>
      </div>
    `;

    if (p.explanationsReviewed) return;

    const sentinel = document.getElementById("quiz-review-sentinel");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !p.explanationsReviewed) {
          p.explanationsReviewed = true;
          saveState();
          updateGateBanner(section);
          observer.disconnect();
        }
      });
    }, { threshold: 0.01 });
    observer.observe(sentinel);
  }

  if (p.quizPassed) {
    renderReview();
  } else {
    renderPlaying();
  }
}

// ---------- Form ----------
function buildForm(section) {
  const select = document.getElementById("input-association");
  ASSOCIATIONS.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a; opt.textContent = a;
    select.appendChild(opt);
  });

  const form = document.getElementById("verify-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById("input-name").value.trim();
    const email = document.getElementById("input-email").value.trim();
    const association = document.getElementById("input-association").value;

    const nameField = document.getElementById("field-name");
    const emailField = document.getElementById("field-email");
    const assocField = document.getElementById("field-association");
    [nameField, emailField, assocField].forEach(f => f.classList.remove("invalid"));

    if (!name) { nameField.classList.add("invalid"); valid = false; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { emailField.classList.add("invalid"); valid = false; }
    if (!association) { assocField.classList.add("invalid"); valid = false; }
    if (!valid) return;

    const submitBtn = document.getElementById("submit-btn");
    const status = document.getElementById("submit-status");
    submitBtn.disabled = true;
    status.textContent = "Submitting…";

    const payload = {
      name, email, association,
      commissionerEmail: COMMISSIONER_EMAILS[association] || "",
      completedAt: new Date().toISOString(),
      quizScore: computeQuizScore()
    };

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script web apps don't return CORS headers by default
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => {
      // no-cors gives an opaque response, so we optimistically treat the request as sent
      onSubmitSuccess(section);
    }).catch(() => {
      status.textContent = "Something went wrong sending your verification. Please check your connection and try again, or email your commissioner directly.";
      submitBtn.disabled = false;
    });
  });
}

function computeQuizScore() {
  const p = getProgress("knowledge-check");
  let correct = 0;
  QUIZ_DATA.forEach((item, qi) => { if (item.correct.includes(p.quizAnswers[qi])) correct++; });
  return `${correct}/${QUIZ_DATA.length}`;
}

function onSubmitSuccess(section) {
  document.getElementById("verify-form-wrap").querySelector("#verify-form").style.display = "none";
  document.getElementById("success-panel").style.display = "block";
  const p = getProgress(section.id);
  p.formSubmitted = true;
  p.elapsedSeconds = section.minSeconds; // satisfy timer requirement now that they've completed the real gate (submission)
  saveState();
  updateGateBanner(section);
  renderSidebar();
}

// ---------- Mobile sidebar ----------
function openSidebarMobile() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebar-scrim").classList.add("show");
}
function closeSidebarMobile() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-scrim").classList.remove("show");
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  document.getElementById("hamburger-btn").addEventListener("click", openSidebarMobile);
  document.getElementById("sidebar-scrim").addEventListener("click", closeSidebarMobile);

  // resume at the first not-yet-complete section
  let resumeIndex = TRAINING_SECTIONS.findIndex(s => !sectionMeetsRequirements(s));
  if (resumeIndex === -1) resumeIndex = TRAINING_SECTIONS.length - 1;
  state.currentIndex = resumeIndex;

  renderSidebar();
  renderSection(state.currentIndex);
});

window.addEventListener("beforeunload", () => { saveState(); });
