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
const QUIZ_PASS_PERCENT = 80;

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
      quizPassed: false
    };
  }
  return state.sectionProgress[sectionId];
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
    return p.quizPassed;
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
    reqsHTML = `<span class="req ${p.quizPassed ? "done" : ""}"><span class="dot"></span>${p.quizPassed ? "Passed knowledge check" : `Score ${QUIZ_PASS_PERCENT}%+ to continue`}</span>`;
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
// Officials only ever see: which option they picked, and — after
// submitting — their overall score, percentage, and pass/fail. We never
// reveal which individual questions were right or wrong, so the same
// question set can be reused as an honest check each time someone retries.
function buildQuiz(section) {
  const container = document.getElementById("quiz-container");
  const p = getProgress(section.id);

  function renderQuestions() {
    container.innerHTML = QUIZ_DATA.map((item, qi) => `
      <div class="quiz-card" data-qi="${qi}">
        <div class="quiz-q"><span class="qnum">${qi+1}</span><p>${item.q}</p></div>
        <div class="quiz-options">
          ${item.options.map((opt, oi) => `
            <div class="quiz-option${p.quizAnswers[qi] === oi ? " selected" : ""}" data-oi="${oi}" role="button" tabindex="0">${opt}</div>
          `).join("")}
        </div>
      </div>
    `).join("") + `<button class="btn btn-primary" id="quiz-submit-btn" style="margin-top:1rem;">Submit Answers</button>
      <div id="quiz-summary" style="margin-top:1rem;"></div>`;

    container.querySelectorAll(".quiz-option").forEach(optEl => {
      optEl.addEventListener("click", () => {
        const card = optEl.closest(".quiz-card");
        card.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
        optEl.classList.add("selected");
        const qi = card.getAttribute("data-qi");
        p.quizAnswers[qi] = parseInt(optEl.getAttribute("data-oi"), 10);
        saveState();
      });
    });

    document.getElementById("quiz-submit-btn").addEventListener("click", () => {
      const unanswered = [];
      QUIZ_DATA.forEach((item, qi) => {
        if (p.quizAnswers[qi] === undefined) unanswered.push(qi + 1);
      });
      const summary = document.getElementById("quiz-summary");
      if (unanswered.length > 0) {
        summary.innerHTML = `
          <div class="quiz-summary fail">
            Please answer all ${QUIZ_DATA.length} questions before submitting.<br>
            Missing question${unanswered.length > 1 ? "s" : ""}: ${unanswered.join(", ")}.
          </div>`;
        const firstCard = container.querySelector(`.quiz-card[data-qi="${unanswered[0] - 1}"]`);
        if (firstCard) firstCard.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      let correctCount = 0;
      QUIZ_DATA.forEach((item, qi) => {
        if (p.quizAnswers[qi] === item.correct) correctCount++;
      });
      const percent = Math.round((correctCount / QUIZ_DATA.length) * 100);
      const passed = percent >= QUIZ_PASS_PERCENT;

      p.quizSubmitted = true;
      p.quizPassed = passed;
      saveState();

      // Lock in the chosen answers visually, but reveal nothing about
      // which ones were right or wrong.
      container.querySelectorAll(".quiz-option").forEach(o => { o.style.pointerEvents = "none"; });
      document.getElementById("quiz-submit-btn").disabled = true;

      if (passed) {
        summary.innerHTML = `
          <div class="quiz-summary pass">
            You scored ${correctCount} / ${QUIZ_DATA.length} (${percent}%) — Passed!
          </div>`;
      } else {
        summary.innerHTML = `
          <div class="quiz-summary fail">
            You scored ${correctCount} / ${QUIZ_DATA.length} (${percent}%).<br>
            A score of ${QUIZ_PASS_PERCENT}% or higher is required to pass.<br>
            Please go back and review the training material, then try again.
          </div>
          <button class="btn btn-secondary" id="quiz-retry-btn" style="margin-top:.8rem;">Try Again</button>`;
        document.getElementById("quiz-retry-btn").addEventListener("click", () => {
          p.quizAnswers = {};
          p.quizSubmitted = false;
          saveState();
          renderQuestions();
        });
      }

      updateGateBanner(section);
    });
  }

  renderQuestions();
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
  QUIZ_DATA.forEach((item, qi) => { if (p.quizAnswers[qi] === item.correct) correct++; });
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
