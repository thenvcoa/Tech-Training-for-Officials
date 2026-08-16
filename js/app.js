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
      currentQuestionIndex: 0,
      quizMode: null,
      quizAttempts: 0,
      videoConsumed: {}
    };
  }
  const p = state.sectionProgress[sectionId];
  // Defensive defaults for progress saved by an earlier version of this quiz.
  if (!p.quizResult) p.quizResult = {};
  if (typeof p.explanationsReviewed !== "boolean") p.explanationsReviewed = false;
  if (typeof p.currentQuestionIndex !== "number") p.currentQuestionIndex = 0;
  if (typeof p.quizMode === "undefined") p.quizMode = null;
  if (typeof p.quizAttempts !== "number") p.quizAttempts = 0;
  if (!p.videoConsumed) p.videoConsumed = {};
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
// Two modes, chosen once and locked in:
//   Beginner — no timer, free navigation, videos replayable, unlimited retries.
//   Advanced — timed questions that auto-advance, one-way (no back/skip), each
//     video plays once, and a failed attempt means a full restart from Q1.
// Either way, passing requires QUIZ_PASS_PERCENT correct, and — only after
// passing — officials must scroll through every explanation before continuing.
function buildQuiz(section) {
  const container = document.getElementById("quiz-container");
  const p = getProgress(section.id);
  const total = QUIZ_DATA.length;
  let advancedTimer = null;

  function letterFor(i) { return String.fromCharCode(65 + i); }

  function renderExplanationMedia(media, label) {
    if (!media || media.type === "none" || !media.ref) return "";
    if (media.type === "image") {
      return `<div class="quiz-media-wrap image"><img src="images/${media.ref}.png" alt="${label}"></div>`;
    }
    if (media.type === "video") {
      return `<div class="quiz-media-wrap"><video controls preload="metadata" poster="posters/${media.ref}.jpg" src="videos/${media.ref}.mp4"></video></div>`;
    }
    if (media.type === "gdrive") {
      return `<div class="quiz-media-wrap"><iframe src="https://drive.google.com/file/d/${media.ref}/preview" title="${label}" loading="lazy" allow="autoplay"></iframe></div>`;
    }
    return "";
  }

  // Question-time media. In Advanced mode, videos are self-hosted and gated
  // to a single, uninterruptible playback — no native controls, no seeking,
  // and once it ends (or once the question is left) it's gone for good.
  function renderQuestionMedia(qi, media) {
    if (!media || media.type === "none" || !media.ref) return "";
    if (media.type === "image") {
      return `<div class="quiz-media-wrap image"><img src="images/${media.ref}.png" alt="Question visual"></div>`;
    }
    if (media.type === "gdrive") {
      return `<div class="quiz-media-wrap"><iframe src="https://drive.google.com/file/d/${media.ref}/preview" title="Question video" loading="lazy" allow="autoplay"></iframe></div>`;
    }
    if (media.type === "video") {
      if (p.quizMode !== "advanced") {
        return `<div class="quiz-media-wrap"><video controls preload="metadata" poster="posters/${media.ref}.jpg" src="videos/${media.ref}.mp4"></video></div>`;
      }
      if (p.videoConsumed[qi]) {
        return `<div class="quiz-media-wrap video-consumed"><div class="quiz-video-consumed-msg">🔒 Video already played — advanced mode allows one viewing per question.</div></div>`;
      }
      return `
        <div class="quiz-media-wrap video-once">
          <video preload="metadata" poster="posters/${media.ref}.jpg" playsinline></video>
          <button type="button" class="quiz-play-once-btn" data-play-ref="${media.ref}" data-qi="${qi}">&#9658; Play Video (one time only)</button>
        </div>`;
    }
    return "";
  }

  function wireOncePlayButtons(onEnded) {
    container.querySelectorAll(".quiz-play-once-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest(".video-once");
        const video = wrap.querySelector("video");
        const ref = btn.getAttribute("data-play-ref");
        const qi = parseInt(btn.getAttribute("data-qi"), 10);
        video.src = `videos/${ref}.mp4`;
        btn.remove();
        video.play();
        if (onEnded) onEnded();
        video.addEventListener("ended", () => {
          p.videoConsumed[qi] = true;
          saveState();
          wrap.outerHTML = `<div class="quiz-media-wrap video-consumed"><div class="quiz-video-consumed-msg">🔒 Video played — advanced mode allows one viewing per question.</div></div>`;
        });
      });
    });
  }

  // ---------- Mode select ----------
  function renderModeSelect() {
    container.innerHTML = `
      <div class="quiz-mode-select">
        <div class="quiz-mode-card beginner">
          <div class="quiz-mode-card-title">🟢 Beginner</div>
          <p class="quiz-mode-card-sub">Recommended for new or first-time officials</p>
          <ul>
            <li>No time limit — think it through</li>
            <li>Jump between questions freely, change any answer</li>
            <li>Rewatch any video as many times as you like</li>
            <li>Unlimited retakes until you pass</li>
          </ul>
          <button type="button" class="btn btn-primary" data-choose-mode="beginner">Choose Beginner</button>
        </div>
        <div class="quiz-mode-card advanced">
          <div class="quiz-mode-card-title">🔴 Advanced</div>
          <p class="quiz-mode-card-sub">Recommended for returning or veteran officials</p>
          <ul>
            <li>Timed questions — auto-advances when time runs out</li>
            <li>One-way — no going back, no skipping ahead</li>
            <li>Each video plays once and can't be replayed</li>
            <li>One attempt at a time — a miss means restarting from Question 1</li>
          </ul>
          <button type="button" class="btn btn-primary" data-choose-mode="advanced">Choose Advanced</button>
        </div>
      </div>
      <p class="quiz-mode-warning">⚠️ Once you choose a mode, you can't switch to the other one — pick whichever fits you best.</p>
    `;
    container.querySelectorAll("[data-choose-mode]").forEach(btn => {
      btn.addEventListener("click", () => renderModeConfirm(btn.getAttribute("data-choose-mode")));
    });
  }

  function renderModeConfirm(mode) {
    const label = mode === "beginner" ? "Beginner" : "Advanced";
    container.innerHTML = `
      <div class="quiz-mode-confirm">
        <p>You selected <strong>${label} mode</strong>. This can't be changed once you begin.</p>
        <div class="quiz-nav-bar" style="justify-content:center;">
          <button type="button" class="btn btn-secondary" id="quiz-mode-back-btn">&larr; Go Back</button>
          <button type="button" class="btn btn-primary" id="quiz-mode-confirm-btn">Yes, Start ${label}</button>
        </div>
      </div>
    `;
    document.getElementById("quiz-mode-back-btn").addEventListener("click", renderModeSelect);
    document.getElementById("quiz-mode-confirm-btn").addEventListener("click", () => {
      p.quizMode = mode;
      p.currentQuestionIndex = 0;
      saveState();
      renderEntry();
    });
  }

  // ---------- Beginner mode (untimed, free navigation, unlimited retries) ----------
  function allAnswered() {
    return QUIZ_DATA.every((_, i) => p.quizAnswers[i] !== undefined);
  }

  function renderBeginnerPlaying() {
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
        <div class="quiz-mode-badge beginner">🟢 Beginner Mode</div>
        <div class="quiz-progress-dots">${dotsHTML}</div>
        ${bannerHTML}
        <div class="quiz-game-card">
          <div class="quiz-game-kicker">Question ${qi + 1} of ${total}</div>
          ${renderQuestionMedia(qi, item.media)}
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
        renderBeginnerPlaying();
      });
    });
    container.querySelectorAll("[data-jump]").forEach(btn => {
      btn.addEventListener("click", () => {
        p.currentQuestionIndex = parseInt(btn.getAttribute("data-jump"), 10);
        saveState();
        renderBeginnerPlaying();
      });
    });
    const prevBtn = document.getElementById("quiz-prev-btn");
    if (prevBtn) prevBtn.addEventListener("click", () => { p.currentQuestionIndex = Math.max(0, qi - 1); saveState(); renderBeginnerPlaying(); });
    const nextBtn = document.getElementById("quiz-next-btn");
    if (nextBtn) nextBtn.addEventListener("click", () => { p.currentQuestionIndex = Math.min(total - 1, qi + 1); saveState(); renderBeginnerPlaying(); });

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
      p.quizAttempts = (p.quizAttempts || 0) + 1;
      saveState();
      updateGateBanner(section);

      if (passed) {
        renderReview();
      } else {
        const firstWrong = QUIZ_DATA.findIndex((_, i) => result[i] === false);
        p.currentQuestionIndex = firstWrong === -1 ? 0 : firstWrong;
        saveState();
        renderBeginnerPlaying();
      }
    });
  }

  // ---------- Advanced mode (timed, sequential, one-shot) ----------
  function clearAdvancedTimer() {
    if (advancedTimer) { clearInterval(advancedTimer); advancedTimer = null; }
  }

  function renderAdvancedPlaying() {
    clearAdvancedTimer();
    const qi = p.currentQuestionIndex;
    const item = QUIZ_DATA[qi];
    const isLast = qi === total - 1;
    let secondsLeft = item.timeLimit || 30;
    let timerStartedAt = null; // becomes non-null once counting actually begins

    const dotsHTML = QUIZ_DATA.map((_, i) => {
      let cls = "quiz-dot locked";
      if (i === qi) cls += " current";
      else if (i < qi) cls += " answered";
      return `<span class="${cls}" aria-label="Question ${i + 1}">${i + 1}</span>`;
    }).join("");

    const chosen = p.quizAnswers[qi];
    const choicesHTML = item.choices.map((choice, oi) => {
      const cls = "quiz-choice" + (chosen === oi ? " selected" : "");
      return `
        <button type="button" class="${cls}" data-oi="${oi}">
          <span class="quiz-choice-letter">${letterFor(oi)}</span>
          <span class="quiz-choice-text">${choice}</span>
        </button>`;
    }).join("");

    const hasVideo = item.media && item.media.type === "video" && !p.videoConsumed[qi];

    container.innerHTML = `
      <div class="quiz-game-wrap">
        <div class="quiz-mode-badge advanced">🔴 Advanced Mode — one attempt, no going back</div>
        <div class="quiz-progress-dots">${dotsHTML}</div>
        <div class="quiz-timer-bar-wrap">
          <div class="quiz-timer-bar" id="quiz-timer-bar" style="width:100%;"></div>
        </div>
        <p class="quiz-timer-text" id="quiz-timer-text">${hasVideo ? "Watch the video to begin the timer" : `${secondsLeft}s remaining`}</p>
        <div class="quiz-game-card">
          <div class="quiz-game-kicker">Question ${qi + 1} of ${total}</div>
          ${renderQuestionMedia(qi, item.media)}
          <p class="quiz-question-text">${item.question}</p>
          <div class="quiz-choices">${choicesHTML}</div>
        </div>
        <div class="quiz-nav-bar">
          <div class="gate-spacer"></div>
          <button class="btn btn-primary" id="quiz-adv-next-btn" ${chosen === undefined ? "disabled" : ""}>${isLast ? "Finish Quiz" : "Next →"}</button>
        </div>
      </div>
    `;

    function startTimerNow() {
      if (timerStartedAt) return;
      timerStartedAt = Date.now();
      const text = document.getElementById("quiz-timer-text");
      if (text) text.textContent = `${secondsLeft}s remaining`;
      advancedTimer = setInterval(() => {
        secondsLeft -= 1;
        const bar = document.getElementById("quiz-timer-bar");
        const text = document.getElementById("quiz-timer-text");
        if (bar) bar.style.width = Math.max(0, (secondsLeft / (item.timeLimit || 30)) * 100) + "%";
        if (text) text.textContent = secondsLeft > 0 ? `${secondsLeft}s remaining` : "Time's up!";
        if (secondsLeft <= 0) {
          clearAdvancedTimer();
          advance();
        }
      }, 1000);
    }

    if (hasVideo) {
      wireOncePlayButtons(startTimerNow);
    } else {
      startTimerNow();
    }

    container.querySelectorAll(".quiz-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        p.quizAnswers[qi] = parseInt(btn.getAttribute("data-oi"), 10);
        saveState();
        renderAdvancedPlaying();
      });
    });

    function advance() {
      clearAdvancedTimer();
      saveState();
      if (isLast) {
        finishAdvanced();
      } else {
        p.currentQuestionIndex = qi + 1;
        saveState();
        renderAdvancedPlaying();
      }
    }

    const nextBtn = document.getElementById("quiz-adv-next-btn");
    if (nextBtn) nextBtn.addEventListener("click", () => { if (p.quizAnswers[qi] !== undefined) advance(); });
  }

  function finishAdvanced() {
    const result = {};
    QUIZ_DATA.forEach((q, i) => { result[i] = q.correct.includes(p.quizAnswers[i]); });
    const correctCount = Object.values(result).filter(Boolean).length;
    const percent = Math.round((correctCount / total) * 100);
    const passed = percent >= QUIZ_PASS_PERCENT;

    p.quizSubmitted = true;
    p.quizResult = result;
    p.quizPassed = passed;
    p.quizAttempts = (p.quizAttempts || 0) + 1;
    saveState();
    updateGateBanner(section);

    if (passed) {
      renderReview();
    } else {
      renderAdvancedFail(correctCount, percent);
    }
  }

  function renderAdvancedFail(correctCount, percent) {
    container.innerHTML = `
      <div class="quiz-game-wrap">
        <div class="quiz-summary fail">
          You scored ${correctCount} / ${total} (${percent}%). You need ${QUIZ_PASS_PERCENT}%+ to pass Advanced mode.<br>
          Per Advanced mode rules, you'll restart the full 20-question quiz from Question 1 — this was attempt #${p.quizAttempts}.
        </div>
        <div class="quiz-nav-bar" style="justify-content:center;margin-top:1rem;">
          <button type="button" class="btn btn-primary" id="quiz-adv-restart-btn">Restart Advanced Quiz</button>
        </div>
      </div>
    `;
    document.getElementById("quiz-adv-restart-btn").addEventListener("click", () => {
      p.quizAnswers = {};
      p.quizSubmitted = false;
      p.quizResult = {};
      p.videoConsumed = {};
      p.currentQuestionIndex = 0;
      saveState();
      renderAdvancedPlaying();
    });
  }

  // ---------- Shared: explanation review (both modes land here after passing) ----------
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
          ${renderExplanationMedia(item.media, "Question video")}
          <p class="quiz-question-text">${item.question}</p>
          <div class="quiz-choices">${choicesHTML}</div>
          <div class="quiz-explanation">
            <h4>Explanation</h4>
            ${item.explanation ? `<p>${item.explanation}</p>` : ""}
            ${renderExplanationMedia(item.explanationMedia, "Explanation video")}
          </div>
        </div>`;
    }).join("");

    const correctCount = Object.values(p.quizResult).filter(Boolean).length;
    const percent = Math.round((correctCount / total) * 100);
    const modeLabel = p.quizMode === "advanced" ? "Advanced" : "Beginner";

    container.innerHTML = `
      <div class="quiz-game-wrap">
        <div class="quiz-summary pass" style="margin-bottom:1rem;">
          🎉 You passed ${modeLabel} mode with ${correctCount} / ${total} (${percent}%) in ${p.quizAttempts} attempt${p.quizAttempts === 1 ? "" : "s"}!
          Scroll through every explanation below — the Continue button at the bottom of the page unlocks once you've reached the end.
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

  // ---------- Entry point ----------
  function renderEntry() {
    if (p.quizPassed) {
      renderReview();
    } else if (p.quizMode === "beginner") {
      renderBeginnerPlaying();
    } else if (p.quizMode === "advanced") {
      renderAdvancedPlaying();
    } else {
      renderModeSelect();
    }
  }

  renderEntry();
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
      quizScore: computeQuizScore(),
      quizMode: computeQuizMode(),
      quizAttempts: computeQuizAttempts()
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

function computeQuizMode() {
  const p = getProgress("knowledge-check");
  return p.quizMode === "advanced" ? "Advanced" : "Beginner";
}

function computeQuizAttempts() {
  const p = getProgress("knowledge-check");
  return p.quizAttempts || 1;
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
