/* ==========================================================
   VHSL Cheer Tech Officials Training — content data
   Each section: id, navLabel, kicker, title, subtitle,
   bodyHTML (string), videos: [{src, poster, label}], minSeconds
   ========================================================== */

const TRAINING_SECTIONS = [

// ---------------- 1. WELCOME ----------------
{
  id: "welcome",
  navLabel: "Welcome",
  kicker: "Start Here",
  title: "2026–2027 VHSL Cheer",
  subtitle: "Technical Officials Training",
  minSeconds: 30,
  videos: [],
  bodyHTML: `
    <div style="text-align:center;margin-bottom:1.4rem;">
      <img src="images/vhsl_logo.png" alt="VHSL logo" style="display:block;margin:0 auto;max-width:420px;width:100%;height:auto;">
    </div>
    <div class="card">
      <p>Welcome to the Virginia High School League Cheer Technical Officials training for the
      2026–27 season. This course covers scoresheet updates, new NFHS Spirit rule changes,
      common deductions, appearance violations, and comp-day guidance.</p>
      <p>Work through each tab in order using the sidebar. Some sections include short video
      clips illustrating legal vs. illegal skills — watch each one in full. When you reach the
      end, you'll complete a short knowledge check and submit your verification so your
      commissioner can confirm you've finished the training.</p>
    </div>
    <div class="card tinted">
      <h4>What you'll cover</h4>
      <ul>
        <li>2026 Tech Scoresheet updates</li>
        <li>New NFHS Spirit Rules for 2026–27</li>
        <li>Common deductions and appearance violations</li>
        <li>Comp-day tips, resources, and who to contact</li>
        <li>A short knowledge check and your completion verification</li>
      </ul>
    </div>
  `
},

// ---------------- 2. SCORESHEET UPDATES ----------------
{
  id: "scoresheet",
  navLabel: "Scoresheet Updates",
  kicker: "Section 1",
  title: "2026 Tech Scoresheet",
  subtitle: "<strong>No major changes</strong> — just a few wording and formatting updates",
  minSeconds: 60,
  videos: [],
  bodyHTML: `
    <div class="card tinted">
      <ul>
        <li>No major changes from prior year — only slight changes to wording &amp; formatting.</li>
        <li>Still no maximum penalty on stunt/pyramid/tumbling falls: charge each &amp; every deduction per occurrence.</li>
        <li>Coach's signature is still required.</li>
      </ul>
    </div>
    <figure class="frame" style="max-width:420px;margin:0 auto 1.2rem;">
      <figcaption>2026 VHSL Technical Score Sheet</figcaption>      
    <img src="images/slide02_img1.png" alt="2026 VHSL Competitive Cheer Technical Score Sheet">
    </figure>

    <br>
    <h3>2026 Tech Cheat Sheet</h3>
    <div class="card tinted">
      <ul>
        <li>Most common deductions are at the top for quick reference.</li>
        <li>All other deductions are now organized alphabetically by section for faster navigating.</li>
        <li>All new rules are in bold, underlined text.</li>
        <li>Document is double-sided, with a summary of new rules &amp; rationale on the back.</li>
      </ul>
      <figure class="frame" style="max-width:320px;margin:0 auto 1.2rem;"><img src="images/slide06_img1.png" alt="VHSL Cheer technical official cheat sheet"></figure>
    </div>

    <h3>Time Infractions</h3>
    <div class="card">
      <span class="pill illegal">5-PT DEDUCTION</span>
      <span class="pill legal">1.00 SEC BUFFER</span>
      <p><strong>Time infractions will continue to be assessed a 5-point penalty.</strong>
      Officials should allow a 1.00-second buffer before imposing the deduction, to allow for
      human error in timing.</p>
        <figure class="frame" style="max-width:260px;margin:0 auto 1.2rem;">
      <img src="images/slide03_img1.png" alt="Time infraction reference card">
    </figure>
    </div>

    <h3>Unsportsmanlike Behavior</h3>
    <div class="card"><span class="pill illegal">10-PT DEDUCTION</span>
      <div class="two-col">
        <div>
          <h4>Any of the following institutes unsportsmanlike behavior:</h4>
          <ul>
            <li>Persistent arguing of scores by coaches</li>
            <li>Aggressive/disrespectful language or behavior toward officials</li>
            <li>Profanity heard by officials from coaches or athletes</li>
            <li>Inappropriate gestures or behavior seen by officials</li>
          </ul>
        </div>
        <div>
          <h4>Required process (first working day after occurrence):</h4>
          <ol>
            <li>Notify the Commissioner of the association covering the event</li>
            <li>Commissioner notifies Kelley Haney</li>
            <li>Commissioner files the School Sportsmanship Report Form with VHSL</li>
            <li>Commissioner notifies the offending school's Head Coach &amp; DSA by email</li>
          </ol>
        </div>
      </div>
      <p style="margin-top:.8rem;"><strong>Athlete behavior:</strong> a 2-performance suspension.
      A first-round infraction in a two-round event carries into round two plus the next
      competition; a season-ending infraction carries into next year.</p>
      <figure class="frame" style="max-width:140px;margin:0 auto 1.2rem;">
        <img src="images/slide04_img1.png" alt="Unsportsmanlike behavior reference">
      </figure>
    </div>
  `
},

// ---------------- 3. ILLEGAL CHOREO VS. ILLEGAL EXECUTION ----------------
{
  id: "illegal-choreo-execution",
  navLabel: "Illegal Choreo vs. Execution",
  kicker: "Section 2",
  title: "Illegal Choreo vs. Illegal Execution",
  subtitle: "Always ask: was the illegality intended &amp; choreographed that way? Is it the whole team, or just one athlete?",
  minSeconds: 90,
  bodyHTML: `
    <div class="card tinted">
      <p><strong>Always ask:</strong> was the illegality intended &amp; choreographed that way?
      Is it the whole team, or just one athlete?</p>
    </div>
    <div class="two-col">
      <div class="card">
        <span class="pill illegal">ILLEGAL CHOREOGRAPHY</span>
        <h4>Example 1</h4>
        <p>Team executes pike baskets with flyers holding poms during the toss — done uniformly
        by all groups.</p>
        <p><strong style="color:var(--red);">10-point deduction, assessed once for the whole team,
        regardless of the number of groups.</strong></p>
      </div>
      <div class="card">
        <span class="pill illegal">ILLEGAL EXECUTION</span>
        <h4>Example 2</h4>
        <p>Three athletes noticeably but unintentionally jump upward before dropping to final
        poses; the rest of the team drops without the jump.</p>
        <p><strong style="color:var(--red);">5-point deduction per athlete — 5 × 3 = 15 points total.</strong></p>
      </div>
    </div>

    <h3>Illegal Choreo vs. Illegal Execution (cont.)</h3>
    <div class="card tinted">
      <p><strong>Always ask:</strong> was the illegality intended &amp; choreographed that way?
      Is it the whole team, or just one athlete?</p>
      <p>This training video discusses examples on the difference between illegal choreography
      and illegal execution.</p>
      <ul>
        <li><strong style="color:var(--red);">Illegal skills → Illegal choreography</strong></li>
        <li><strong style="color:#7A1FA2;">Performance errors → Illegal execution</strong></li>
      </ul>
    </div>
    <div class="video-grid" style="max-width:420px;justify-content:center;margin:0 auto;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/illegal_skills_vs_performance_errors.jpg" data-video-id="v22"><source src="videos/illegal_skills_vs_performance_errors.mp4" type="video/mp4"></video></div>
        <div class="video-label">Illegal Skills vs. Performance Errors <span class="watch-check" data-watch-for="v22"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>

    <h3>Anticipating Potential Legalities</h3>
    <div class="card tinted">
      <p><strong>Always count athletes</strong> to quickly map out what skills are legal versus
      illegal.</p>
      <p>This training video discusses scenarios where a tech official should be able to quickly
      determine whether the upcoming skill is legal.</p>
      <p style="text-align:center;"><strong style="color:var(--red);">How many athletes do they
      need to legally perform that skill?</strong></p>
    </div>
    <div class="video-grid" style="max-width:420px;justify-content:center;margin:0 auto;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/anticipating_numbers_braced_flips.jpg" data-video-id="v23"><source src="videos/anticipating_numbers_braced_flips.mp4" type="video/mp4"></video></div>
        <div class="video-label">Examples of Anticipating Numbers: Braced Flips <span class="watch-check" data-watch-for="v23"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
  `
},

// ---------------- 4. RULES COURSE INTRO ----------------
{
  id: "rules-intro",
  navLabel: "Rules Course Intro",
  kicker: "Section 3",
  title: "NFHS/USA Cheer Spirit Rules",
  subtitle: "2026–27 Cheer Rules Course: Changes Only",
  minSeconds: 60,
  videos: [],
  bodyHTML: `
    <div class="img-row" style="justify-content:center;">
      <img src="images/slide07_img1.png" alt="New rules for 2026-2027 graphic">
      <img src="images/slide08_img1.png" alt="NFHS USA Cheer Spirit Rules book cover">
    </div>
    <div class="card">
      <p>This course covers the changes to the 2026–27 NFHS/USA Cheer Spirit Rules for high
      school cheer only. It assumes you've completed the comprehensive rules course from the
      previous year, or have extensive knowledge of the previous year's rule book.</p>
      <p>The 2026–27 rules book is available beginning in June. Rules books may be sent to a
      school by the state high school association or coaches association — check with your
      athletic director or principal — or ordered at <a href="https://usacheer.org" target="_blank" rel="noopener">usacheer.org</a>.</p>
      <p>This training is designed to provide consistent understanding of the rules across the
      country, but the final decision on any interpretation is handled at the state level.
      Always check with your state association or event producer for interpretation questions.</p>
    </div>

    <h3>How to Read the Rules Book</h3>
    <div class="card tinted">
      <ul>
        <li>The first page contains a summary of the new rules.</li>
        <li>Inside the book, new rules or situations have grey shading behind the text.</li>
        <li>Situations and Rulings (FAQs) follow each Section — these help interpret a rule, but are not rules themselves.</li>
        <li>Stick-figure diagrams at the end of the book illustrate specific rules, each labeled legal or illegal.</li>
        <li>Video is available at usacheer.org — an ongoing library you can search by skill type.</li>
        <li>Book corrections/updates are posted online at usacheer.org and nfhs.org.</li>
      </ul>
      <div class="img-row" style="justify-content:center;">
        <img src="images/slide13_img1.png" alt="Rules book FAQ page">
        <img src="images/slide13_img2.png" alt="Rules book diagram page">
        </div>
    </div>

    <h3>Rules Book Reorganization</h3>
    <div class="card">
      <p>Starting with the 2025–26 season, the spirit rule book split out cheer and dance rule
      definitions. This is the 2nd year with this structure:</p>
      <ul>
        <li><strong>Rule 1 — General Risk Management:</strong> basic health issues, the cheer and dance environment,
        practice/game/performance areas, and common rules across the NFHS regarding accommodations,
        manufacturer's logos, and other non-skill-specific rules. Applies to both cheerleaders and dancers.</li>
        <li><strong>Rule 2 — Cheer</strong> (including cheer definitions)</li>
        <li><strong>Rule 3 — Dance</strong> (including dance definitions)</li>
      </ul>
    </div>

    <h3>How Rule Numbers Work</h3>
    <div class="two-col">
      <div class="card tinted">
        <ul>
          <li>Each <strong>Rule</strong> is divided into <strong>Sections</strong> that put rules into categories.</li>
          <li>Each <strong>Section</strong> is divided further into <strong>Articles</strong> that deal with a specific rule.</li>
          <li>A rule is referenced by Rule number, Section number, Article number, and any sub-articles.</li>
        </ul>
        <p class="rule-tag">Example: Rule 2.1.3</p>
      </div>
      <div>
        <figure class="frame" style="margin:0 auto;"><img src="images/slide12_img1.png" alt="Rule book cover reference"></figure>
      </div>
    </div>
  `
}
];

const SECTION_4 = {
  id: "braced-flips",
  navLabel: "Definitions & Braced Flips",
  kicker: "Section 3 · Rule Changes",
  title: "Definitions & Braced Flip Rules",
  subtitle: "Rules 2.3.5.d and 2.3.5.k",
  minSeconds: 90,
  bodyHTML: `
    <div class="card">
      <h4>Summary of Changes</h4>
      <ul>
        <li><strong>Braced Flips:</strong> bracers can now drop to a load position when the top is descending,
        if the top lands in a horizontal position at prep level or below.</li>
        <li><strong>Braced Flips:</strong> can now have hand-to-foot as the only connection, with restrictions
        — no twists allowed, and the top must be caught by the original bases.</li>
        <li><strong>Braced Release Transitions:</strong> the top may not pass over the torso of another top person or bracer.</li>
        <li>Vertical releases from an extended position to an extended position may not perform more than a single twist.</li>
        <li>A top dismounting to a new group may perform a ¼ twist during the dismount.</li>
        <li>Non-release stunt catchers who are not original bases must not be involved with another skill when the transition is initiated.</li>
        <li>New definitions added for <strong>"tumbling"</strong> and <strong>"Loading Position/Load."</strong></li>
      </ul>
    </div>

    <h3>Definition: Tumbling</h3>
    <div class="card tinted">
      <p><strong>Tumbling:</strong> Any hip-over-head skill that is not supported by a base(s) and that
      begins and ends on the performing surface.</p>
    </div>
    <div class="video-grid" data-video-group="tumbling-yes" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s15_tumbling_standing_bhs.jpg" data-video-id="v1"><source src="videos/s15_tumbling_standing_bhs.mp4" type="video/mp4"></video></div>
        <div class="video-label">Standing BHS <span class="watch-check" data-watch-for="v1"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s15_tumbling_ro_bhs_tuck.jpg" data-video-id="v2"><source src="videos/s15_tumbling_ro_bhs_tuck.mp4" type="video/mp4"></video></div>
        <div class="video-label">Round-Off BHS <span class="watch-check" data-watch-for="v2"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
    <p style="color:var(--text-soft);font-size:.9rem;">Both clips: feet start and end on the performing surface and the hip rotates over the head.</p>

    <h4 style="margin-top:1.4rem;">NOT Considered Tumbling</h4>
    <p>Because of the adjusted definition, none of these are tumbling — either the skill starts/ends
    off the performing surface, or there's no head-over-hip rotation.</p>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s16_not_tumbling_round_off_up.jpg" data-video-id="v3"><source src="videos/s16_not_tumbling_round_off_up.mp4" type="video/mp4"></video></div>
        <div class="video-label">Seat Roll <span class="watch-check" data-watch-for="v3"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s16_not_tumbling_seat_roll.jpg" data-video-id="v4"><source src="videos/s16_not_tumbling_seat_roll.mp4" type="video/mp4"></video></div>
        <div class="video-label">Front Roll Out from Prone <span class="watch-check" data-watch-for="v4"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s16_not_tumbling_front_roll_prone.jpg" data-video-id="v5"><source src="videos/s16_not_tumbling_front_roll_prone.mp4" type="video/mp4"></video></div>
        <div class="video-label">Round Off Up <span class="watch-check" data-watch-for="v5"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>

    <h3>Definition: Loading Position / Load</h3>
    <div class="card tinted">
      <p><strong>Loading Position/Load:</strong> The top person is supported under their foot/feet
      below the bases' shoulder level.</p>
    </div>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s17_load_position_target_to_load.jpg" data-video-id="v6"><source src="videos/s17_load_position_target_to_load.mp4" type="video/mp4"></video></div>
        <div class="video-label">Extended Target to Load <span class="watch-check" data-watch-for="v6"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s17_load_position_prep_to_load.jpg" data-video-id="v7"><source src="videos/s17_load_position_prep_to_load.mp4" type="video/mp4"></video></div>
        <div class="video-label">Load to Prep <span class="watch-check" data-watch-for="v7"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>

    <h3>Braced Flip Bracers</h3>
    <div class="card">
      <span class="pill legal" style="display:inline-block;">LEGAL — Rule 2.3.5.d</span>   
      <p>Bracer(s) for a braced flip must be in a multi-base prep with a spotter and remain
      stationary until the top person is descending.</p>
      <p><strong>New verbiage:</strong> if the flip ends in a cradle, horizontal position at prep
      level or below, or on the performing surface, the bracers may release the top person or move
      to a loading position once the top person begins to descend.</p>
      <p>Bracer must still start in a double-base prep with a spot and cannot be pressed up at any time.</p>
    </div>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s19_bracer_moving_legal_2yrs_ago.jpg" data-video-id="v8"><source src="videos/s19_bracer_moving_legal_2yrs_ago.mp4" type="video/mp4"></video></div>
        <div class="video-label">Legal Two Years Ago <span class="watch-check" data-watch-for="v8"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s19_bracer_moving_legal_last_year.jpg" data-video-id="v9"><source src="videos/s19_bracer_moving_legal_last_year.mp4" type="video/mp4"></video></div>
        <div class="video-label">Legal Last Year <span class="watch-check" data-watch-for="v9"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
    <p class="pill legal" style="display:inline-block;">BOTH NOW LEGAL THIS YEAR</p>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s20_bracer_moving_legal_this_year_1.jpg" data-video-id="v10"><source src="videos/s20_bracer_moving_legal_this_year_1.mp4" type="video/mp4"></video></div>
        <div class="video-label">¾ Back Layout to Prone <span class="watch-check" data-watch-for="v10"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s20_bracer_moving_legal_this_year_2.jpg" data-video-id="v11"><source src="videos/s20_bracer_moving_legal_this_year_2.mp4" type="video/mp4"></video></div>
        <div class="video-label">1¼ Front Rotation to Prone <span class="watch-check" data-watch-for="v11"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>

    <h3>Braced Flip Bracers</h3>
    <div class="card">
    <span class="pill legal" style="display:inline-block;">LEGAL — Rule 2.3.5.k (new)</span>    
      <p>If the only connection is the bracer's hand to a top's foot/feet:</p>
      <ol>
        <li>The top person cannot perform any twists.</li>
        <li>The bracer must be in a double-base prep with a spotter.</li>
        <li>The top person must be caught by the original bases.</li>
      </ol>
      <p>This allows a basic hand-to-foot connection braced flip. The top cannot twist (including
      an Arabian entry into the flip) and must go to the original bases/spot.</p>
    </div>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s22_hand_to_foot_braced_flip_front.jpg" data-video-id="v12"><source src="videos/s22_hand_to_foot_braced_flip_front.mp4" type="video/mp4"></video></div>
        <div class="video-label">Front View — Legal <span class="watch-check" data-watch-for="v12"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s22_hand_to_foot_braced_flip_side.jpg" data-video-id="v13"><source src="videos/s22_hand_to_foot_braced_flip_side.mp4" type="video/mp4"></video></div>
        <div class="video-label">Side View — Legal <span class="watch-check" data-watch-for="v13"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
     <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s23_hand_to_foot_one_bracer_two_groups.jpg" data-video-id="v14"><source src="videos/s23_hand_to_foot_one_bracer_two_groups.mp4" type="video/mp4"></video></div>
        <div class="video-label">One Bracer, Two Groups — Legal <span class="watch-check" data-watch-for="v14"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s24_hand_to_foot_interpretation_change.jpg" data-video-id="v15"><source src="videos/s24_hand_to_foot_interpretation_change.mp4" type="video/mp4"></video></div>
        <div class="video-label">Interpretation Change — Legal <span class="watch-check" data-watch-for="v15"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
    <p style="color:var(--text-soft);font-size:.9rem;">This interpretation changed from NFHS/USA Cheer's original decision: the bracer may drop to a
    loading position for a better line with the top, just like other braced flips.</p>

    <div class="card">
      <span class="pill illegal">ILLEGAL — Rule 2.3.5.k.1</span>
      <p>Hand-to-foot connection with an Arabian entry into the flip is <strong>not allowed</strong> —
      no spinning of any amount is permitted by the top on a hand-to-foot connection.</p>
    </div>
    <div class="video-grid" style="max-width:420px;justify-content:center;margin:0 auto;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s25_hand_to_foot_arabian_entry.jpg" data-video-id="v16"><source src="videos/s25_hand_to_foot_arabian_entry.mp4" type="video/mp4"></video></div>
        <div class="video-label">Arabian Entry — Illegal <span class="watch-check" data-watch-for="v16"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
    `
};

const SECTION_5 = {
  id: "release-dismount",
  navLabel: "Release & Dismount Rules",
  kicker: "Section 3 · Rule Changes",
  title: "Release & Dismount Rules",
  subtitle: "Rules 2.4.2.c, 2.5.5.g, 2.5.6.c, and 2.7.8.d",
  minSeconds: 90,
  bodyHTML: `
    <div class="card">
      <h4>Non-Release Rule Change — 2.4.2.c</h4>
      <p>Verbiage was added to clarify that in non-release stunts/lifts, catchers who are not the
      original bases must not be involved with any other skill when the transition is initiated.
      A new base a top is moving to cannot be doing another skill/motion when the movement toward
      them begins.</p>
    </div>

    <div class="card">
      <span class="pill illegal">ILLEGAL — Rule 2.5.5.g (new)</span>
      <p>The top person may not pass over the torso of another top person or bracer. This clarifies
      that a top cannot go over the torso of a bracer during a braced release pyramid — similar to
      a 2.5 pyramid, since the bracer would be supporting the top's full weight while not being a
      legal (grounded) base.</p>
    </div>
    <div class="video-grid" style="max-width:420px;justify-content:center;margin:0 auto;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s28_release_top_over_torso.jpg" data-video-id="v17"><source src="videos/s28_release_top_over_torso.mp4" type="video/mp4"></video></div>
        <div class="video-label">Top Over Torso — Illegal <span class="watch-check" data-watch-for="v17"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
   
    <div class="card">
      <span class="pill legal">LEGAL — Rule 2.5.6.c</span>
      <p>Vertical releases from an extended position to an extended position may not perform more
      than a single twist. Until this year, the top for a high-to-high release could only execute
      a ¼ twist — now up to one full twist is allowed.</p>
    </div>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s30_release_tick_full_around.jpg" data-video-id="v18"><source src="videos/s30_release_tick_full_around.mp4" type="video/mp4"></video></div>
        <div class="video-label">High-to-High Tick Full Around <span class="watch-check" data-watch-for="v18"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s30_release_tick_half_around.jpg" data-video-id="v19"><source src="videos/s30_release_tick_half_around.mp4" type="video/mp4"></video></div>
        <div class="video-label">High-to-High Tick Half Around <span class="watch-check" data-watch-for="v19"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>

    <div class="card">
      <span class="pill legal">Rule 2.7.8.d</span>
      <p>In dismounts to catchers who are not the original bases, the top person must not execute
      any skill (toe touch, straddle, full twist, etc.) following the release.
      <strong>Exception: a ¼ twist is allowed.</strong> New bases must be in place before the
      dismount begins, and must be near the original stunt.</p>
    </div>
    <div class="video-grid" style="justify-content:center;">
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s32_dismount_quarter_turn_prep.jpg" data-video-id="v20"><source src="videos/s32_dismount_quarter_turn_prep.mp4" type="video/mp4"></video></div>
        <div class="video-label">Prep to New Bases, ¼ Turn <span class="watch-check" data-watch-for="v20"><span class="dot"></span>Not watched</span></div>
      </div>
      <div class="video-card">
        <div class="video-wrap"><video controls preload="metadata" poster="posters/s32_dismount_pop_down_new_bases.jpg" data-video-id="v21"><source src="videos/s32_dismount_pop_down_new_bases.mp4" type="video/mp4"></video></div>
        <div class="video-label">Pop-Down to New Bases <span class="watch-check" data-watch-for="v21"><span class="dot"></span>Not watched</span></div>
      </div>
    </div>
    <p style="color:var(--text-soft);font-size:.9rem;">Remember: if the visual starts from below shoulder level with bases under the feet, that's a
    toss — and would NOT be legal.</p>
  `
};

const SECTION_6 = {
  id: "appearance",
  navLabel: "Appearance Violations",
  kicker: "Section 4",
  title: "Appearance Violations",
  subtitle: "Hair, jewelry, and accessory rulings",
  minSeconds: 75,
  videos: [],
  bodyHTML: `
    <h3>Hair Bows Falling on the Mat</h3>
      <div class="card">
        <p><strong>The deduction is for the bow falling onto the mat</strong> — NOT for athletes
        stepping on it. Rule 1.1.5 requires hair accessories to be securely fastened. Once the
        deduction is applied for the fall, there are no additional deductions for subsequent contact.</p>
        <span class="pill illegal">1-PT DEDUCTION (ONCE ONLY)</span>
        <ul>
          <li>Bow becomes loose and falls out — 1-point deduction.</li>
          <li>Fallen bow is then stepped on by several athletes — no additional deduction.</li>
          <li>An athlete's hand lands on it during a back handspring — no additional deduction.</li>
          <li>A base unintentionally stands on it while holding a stunt — no additional deduction.</li>
        </ul>
      <figure class="frame" style="margin:0 auto;"><img src="images/slide34_img1.jpg" alt="Hair bow example"></figure>
    </div>

    <h3>Long Hair / Ponytails</h3>
    <div class="card">
      <p>There's no requirement for hair to be short or pulled up — but Rule 1.1.5 requires that
      hair/style not interfere with the safe execution of stunting or tumbling.</p>
      <table class="contacts">
        <tr><th>Ruling</th><th>Situation</th></tr>
        <tr><td><span class="pill legal">NO DEDUCTION</span></td><td>A long ponytail hangs past the waist; the athlete does not stunt or tumble.</td></tr>
        <tr><td><span class="pill illegal">1-PT DEDUCTION</span></td><td>Long hair is landed on during an inverted skill (e.g., back walkover) — safety risk.</td></tr>
        <tr><td><span class="pill illegal">1-PT DEDUCTION</span></td><td>A flyer's hair hits the backspot's face or obstructs their view coming into a cradle - safety risk.</td></tr>
      </table>
    <div class="img-row" style="justify-content:center;">
      <img src="images/slide35_img1.jpg" alt="Hair example 1">
      <img src="images/slide35_img2.jpg" alt="Hair example 2">
      <img src="images/slide35_img3.jpg" alt="Hair example 3">
     </div>
    </div>

    <h3>Beads / Ribbons / Bands / Charms on Shoes</h3>
    <div class="card">
      <span class="pill legal">LEGAL</span>
      <p>Beads/ribbons attached directly to the shoes do not meet the definition of jewelry, since
      they aren't worn on the "body." These accessories should still be worn so they don't create
      a safety risk (e.g., a base's hands becoming tangled in shoe charms while holding a stunt).</p>
      <p class="rule-tag">Rule 2 Definitions</p>
      <div class="img-row" style="justify-content:center;">
        <img src="images/slide36_img3.png" alt="Shoe accessory example 3">
        <img src="images/slide36_img5.png" alt="Shoe accessory example 5">
        <img src="images/slide36_img6.png" alt="Shoe accessory example 6">
        <img src="images/slide36_img7.png" alt="Shoe accessory example 7">
      </div>
    </div>

    <h3>Memorial Ribbons Pinned to Uniform</h3>
      <div class="card">
        <span class="pill legal">LEGAL</span>
        <p>Rule 2.1.20 allows state associations to permit special-occasion, commemorative, or
        memorial patches not to exceed 4 square inches. The VHSL Rule Interpreter and State
        Director agree these ribbons are permissible. Coaches should notify their
        Commissioner/Meet Referee if their team plans to wear one.</p>
      <figure class="frame" style="margin:0 auto;"><img src="images/slide37_img1.png" alt="Memorial ribbon example"></figure>
    </div>
  `
};

const SECTION_7 = {
  id: "tips-resources",
  navLabel: "Tips, Resources & Contacts",
  kicker: "Section 5",
  title: "Tips, Resources & Contacts",
  subtitle: "Comp-day guidance and who to reach out to",
  minSeconds: 75,
  videos: [],
  bodyHTML: `
    <h3>Tech Tips for Success</h3>
    <div class="card">
      <ol>
        <li>Don't be afraid to pull out your book if needed, especially when quoting direct language to explain infractions to coaches.</li>
        <li>Before your first event, get very familiar with your cheat sheet &amp; rule book (colored sticky tabs help for quick page-finding!).</li>
        <li>Deductions need 2 of 3 techs to validate. If there's a discrepancy, or fewer than 3 techs, the head tech makes the final call.</li>
        <li>When in doubt, always rule in favor of the kids.</li>
        <li>Don't forget coaches' signatures!</li>
        <li>Coaches should NOT be arguing with officials about deductions — period. Cite a sportsmanship violation and/or involve the meet referee if needed.</li>
        <li>Always refer coaches with lingering questions to their commissioner via email the day after the event.</li>
      </ol>
      <p><strong>Most importantly</strong> — don't be intimidated. We are all human and make
      mistakes. We are all in this together!</p>
    <figure class="frame" style="max-width:300px;margin:0 auto;"><img src="images/slide38_img1.jpeg" alt="Team unity"></figure>
      </div>

    <h3>Resources for Tech Officials</h3>
    <div class="card">
      <p><strong>NFHS Spirit Rule Changes</strong> —
      <a href="https://nfhs.org/sports/spirit/rules" target="_blank" rel="noopener">nfhs.org/sports/spirit/rules</a></p>
      <p><strong>USACheer Rule Interpretation Videos</strong> —
      <a href="https://usacheer.org/safety/rules" target="_blank" rel="noopener">usacheer.org/safety/rules</a></p>
      <p><strong>VHSL Cheer Resource Center</strong> — a Google Drive with numerous videos of
      stunts, pyramids, and legality rulings. If you need visual representations of the rubric
      and/or rule changes, this is an excellent resource!</p>
      <p><a href="https://sites.google.com/view/vhslcheercoachesresourcecenter/home" target="_blank" rel="noopener">sites.google.com/view/vhslcheercoachesresourcecenter/home</a></p>
      <figure class="frame" style="max-width:220px;margin:0 auto;"><img src="images/slide39_img1.png" alt="VHSL Cheer Resource Center QR code"></figure>
    </div>

    <h3>To Obtain an Official Ruling on the Legality of Skills</h3>
    <div class="card">
      <p><strong>Contact Bill Ahern.</strong> Subject line: <em>Your High School, Virginia</em> —
      please CC Kelley Haney.</p>
      <br><div class="two-col">
        <div>
          <h4>Kelley Haney</h4>
          <p>Assistant Director, VHSL<br><a href="mailto:khaney@vhsl.org">khaney@vhsl.org</a><br>434-977-8475</p>
        </div>
        <div>
          <h4>Bill Ahern</h4>
          <p>VHSL Rules Interpreter<br><a href="mailto:bahern@varsity.com">bahern@varsity.com</a></p>
        </div>
      </div>
    </div>

    <h3>All Other Questions — Route to Your Commissioner</h3>
    <div class="card">
      <table class="contacts">
        <tr><th>Region</th><th>Commissioner</th><th>Email</th></tr>
        <tr><td>Southwest</td><td>Joan Frost</td><td><a href="mailto:admin@fabconva.com">admin@fabconva.com</a></td></tr>
        <tr><td>Central</td><td>Joi Delaney</td><td><a href="mailto:joidelaney@gmail.com">joidelaney@gmail.com</a></td></tr>
        <tr><td>Eastern</td><td>Lanita Hicks</td><td><a href="mailto:cheer4life78@gmail.com">cheer4life78@gmail.com</a></td></tr>
        <tr><td>Harrisonburg</td><td>Carrie Hodges</td><td><a href="mailto:hcoacheer@gmail.com">hcoacheer@gmail.com</a></td></tr>
        <tr><td>Northern</td><td>Lesley Farquharson</td><td><a href="mailto:thenvcoa@gmail.com">thenvcoa@gmail.com</a></td></tr>
        <tr><td>Northwest</td><td>Melissa Summerscales</td><td><a href="mailto:northwestcoa@gmail.com">northwestcoa@gmail.com</a></td></tr>
      </table>
    </div>
  `
};

const QUIZ_DATA = [
  { cat: "Scoresheet & Procedures", q: "What penalty applies to a time infraction, and what buffer should officials allow?",
    options: ["5-point deduction, with a 1.00-second buffer for human timing error.",
              "10-point deduction, with no buffer allowed.",
              "5-point deduction, with no buffer allowed.",
              "3-point deduction, with a 2.00-second buffer for human timing error."], correct: 0 },
  { cat: "Scoresheet & Procedures", q: "A team uniformly performs an illegal skill across every group. How is it scored?",
    options: ["5 points per athlete performing the skill.",
              "10 points, charged once for the whole team.",
              "10 points per group performing the skill.",
              "No deduction, since it was performed uniformly."], correct: 1 },
  { cat: "Scoresheet & Procedures", q: "What is an example of unsportsmanlike behavior at an event?",
    options: ["An athlete cheering loudly for their own team.",
              "A parent taking photos courtside.",
              "A coach persistently arguing scores.",
              "A coach asking a single clarifying question about a deduction."], correct: 2 },

  { cat: "New Rules 2026–27", q: "Under 2-3-5d, when may a bracer release the top person or move to a load position during a flip inversion?",
    options: ["At any point during the flip.",
              "When the top person is descending to a cradle, horizontal position, or the performance surface.",
              "Only after the top has fully landed and released.",
              "Only if the top is performing a twist."], correct: 1 },
  { cat: "New Rules 2026–27", q: "What does new rule 2-5-5g prohibit?",
    options: ["A bracer moving to load position before the top begins descending.",
              "A new base catching a top who dismounts to new bases.",
              "A top person twisting more than once during a release.",
              "A top person passing over another top person or bracer during stunts."], correct: 3 },
  { cat: "New Rules 2026–27", q: "Which skill recently became legal under 2-5-6c?",
    options: ["A double twist during a vertical release.",
              "A single (full) twist during a vertical release from an extended position to an extended position.",
              "Any number of twists during a horizontal release.",
              "A single (full) twist during a vertical release from a non-extended position to an extended position."], correct: 1 },

  { cat: "Other Common Deductions", q: "Is a back tuck basket toss legal?",
    options: ["Yes, as long as a spotter is present.",
              "Yes, if the toss is minimal and doesn't go significantly higher than the bases' arms/hands at the catch.",
              "No, top persons must not be inverted during tosses to cradle.",
              "Yes, but only legal in non-tumbling divisions."], correct: 2 },
  { cat: "Other Common Deductions", q: "A flyer is released from prep level to a flatback position. When is this legal?",
    options: ["Anytime, regardless of toss height.",
              "Only if the toss is minimal.",
              "Only from below prep level, never prep level.",
              "Never — flatback releases are always illegal."], correct: 1 },
  { cat: "Other Common Deductions", q: "Can a sign be shared between athletes during a shoulder sit dismount, using both hands?",
    options: ["Yes, as long as both athletes are stable.",
              "Yes, but only during cheer (not dance) routines.",
              "No, only a pom can be shared.",
              "No signs or poms may ever be shared."], correct: 2 },

  { cat: "Appearance Violations", q: "A hair bow falls onto the mat and is stepped on by three athletes. How many deductions?",
    options: ["1 point for the fall, plus 1 point per athlete who steps on it (4 total).",
              "3 points total, one per athlete contact.",
              "1 point total — no additional deduction for subsequent contact with the fallen bow.",
              "No deduction unless it causes a stunt/tumbling fall."], correct: 2 },
  { cat: "Appearance Violations", q: "An athlete's ponytail hangs past the waist but they never stunt or tumble. Is this a deduction?",
    options: ["Yes, 1 point deduction for excessive hair length.",
              "None — no safety interference occurred.",
              "Yes, but only if a coach is notified in advance.",
              "Yes, 1 point, regardless of stunting/tumbling involvement."], correct: 1 },
  { cat: "Appearance Violations", q: "Are beads and charms attached directly to an athlete's shoes legal?",
    options: ["No, all jewelry-like items are illegal regardless of placement.",
              "Only if approved in writing by the state association.",
              "No, shoes must be free of all decoration.",
              "Yes — not worn on the body, so they fall outside the jewelry definition, provided they don't create a safety risk."], correct: 3 },

  { cat: "Comp Day Tips", q: "How many techs are needed to validate a deduction?",
    options: ["All 3 techs must unanimously agree.",
              "1 tech is sufficient if experienced.",
              "2 of 3. If there's a discrepancy or fewer than 3 techs are present, the head tech makes the final call.",
              "A majority vote among all officials at the event."], correct: 2 },
  { cat: "Comp Day Tips", q: "A coach persistently argues a deduction with the head tech official. What's the appropriate response?",
    options: ["Reverse the deduction to avoid conflict.",
              "Ignore it and continue scoring.",
              "Argue back with the coach.",
              "Cite a sportsmanship violation and/or involve the meet referee — coaches should not be arguing with officials, period."], correct: 3 },
];

const SECTION_8 = {
  id: "knowledge-check",
  navLabel: "Knowledge Check",
  kicker: "Section 6",
  title: "Knowledge Check",
  subtitle: "14 quick questions covering everything above",
  minSeconds: 60,
  videos: [],
  isQuiz: true,
  bodyHTML: `<div id="quiz-container"></div>`
};

const ASSOCIATIONS = [
  "Southwest", "Central", "Eastern", "Harrisonburg", "Northern", "Northwest"
];

const COMMISSIONER_EMAILS = {
  "Southwest": "admin@fabconva.com",
  "Central": "joidelaney@gmail.com",
  "Eastern": "cheer4life78@gmail.com",
  "Harrisonburg": "hcoacheer@gmail.com",
  "Northern": "thenvcoa@gmail.com",
  "Northwest": "northwestcoa@gmail.com"
};

const SECTION_9 = {
  id: "verify",
  navLabel: "Verification",
  kicker: "Final Step",
  title: "Training Complete — Verify Your Completion",
  subtitle: "Enter your details so your commissioner can confirm you've finished the training.",
  minSeconds: 15,
  videos: [],
  isForm: true,
  bodyHTML: `
    <div class="card">
      <p>You've reviewed the 2026–2027 scoresheet updates, new rules, common deductions,
      appearance violations, and comp-day guidance. Keep your cheat sheet and rule book close on
      comp day — and when in doubt, ask your Commissioner.</p>
      <p style="font-weight:700;color:var(--gold);">We are all in this together!</p>
    </div>
    <div id="verify-form-wrap">
      <form id="verify-form" class="form-grid" novalidate>
        <div class="form-field" id="field-name">
          <label for="input-name">Full name</label>
          <input type="text" id="input-name" name="name" autocomplete="name" required>
          <div class="form-error">Please enter your full name.</div>
        </div>
        <div class="form-field" id="field-email">
          <label for="input-email">Email address</label>
          <input type="email" id="input-email" name="email" autocomplete="email" required>
          <div class="form-error">Please enter a valid email address.</div>
        </div>
        <div class="form-field" id="field-association">
          <label for="input-association">Your association</label>
          <select id="input-association" name="association" required>
            <option value="" disabled selected>Select your association…</option>
          </select>
          <div class="form-error">Please select your association.</div>
        </div>
        <button type="submit" class="btn btn-primary" id="submit-btn">Submit Verification</button>
        <p id="submit-status" style="font-size:.85rem;color:var(--text-soft);"></p>
      </form>
      <div id="success-panel" class="success-panel" style="display:none;">
        <div class="check-circle">&#10003;</div>
        <h3>Nice work — training complete!</h3>
        <p>Your verification has been sent. Your commissioner will receive a confirmation email.
        Now let's go have a great season!</p>
      </div>
    </div>
  `
};

TRAINING_SECTIONS.push(SECTION_4, SECTION_5, SECTION_6, SECTION_7, SECTION_8, SECTION_9);
