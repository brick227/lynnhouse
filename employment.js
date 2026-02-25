
const ROLES = [
  {
    id: "victim-advocate",
    title: "Victim Advocate",
    type: "Full-Time",
    location: "Flandreau, SD",
    tags: ["Advocacy", "Crisis", "Safety Planning"],
    overview: "Provide crisis support, safety planning, and survivor-centered advocacy services.",
    requirements: [
      "Trauma-informed communication",
      "Confidential documentation",
      "Ability to respond calmly in crisis situations",
    ],
    preferred: ["Experience in DV/SA advocacy", "Bilingual a plus", "Valid driver’s license"],
    keywords: ["advocacy","safety","crisis","confidentiality","trauma","planning","documentation"]
  },
  {
    id: "executive-director",
    title: "Executive Director",
    type: "Full-Time",
    location: "Flandreau, SD",
    tags: ["Leadership", "Operations", "Fundraising"],
    overview: "Lead program strategy, staff operations, and partnerships to strengthen survivor services and community impact.",
    requirements: [
      "Demonstrated leadership and team management",
      "Strong communication and stakeholder coordination",
      "Commitment to survivor-centered, trauma-informed services"
    ],
    preferred: [
      "Nonprofit or program leadership experience",
      "Grant writing / fundraising experience",
      "Budget oversight and compliance familiarity"
    ],
    keywords: ["leadership","management","operations","fundraising","grants","compliance","strategy","partnerships","budget"]
  },

  {
    id: "case-manager",
    title: "Case Manager",
    type: "Full-Time",
    location: "Flandreau, SD",
    tags: ["Casework", "Resources", "Coordination"],
    overview: "Coordinate services, maintain case notes, and connect survivors to resources and referrals.",
    requirements: [
      "Strong organization and follow-through",
      "Accurate notes and reporting",
      "Resource navigation and referral skills",
    ],
    preferred: ["Human services background", "Experience with grant reporting"],
    keywords: ["case","coordination","documentation","resources","reporting","notes","intake"]
  },
  {
    id: "outreach-coordinator",
    title: "Outreach Coordinator",
    type: "Part-Time",
    location: "Regional",
    tags: ["Education", "Prevention", "Community"],
    overview: "Deliver community education, prevention programming, and partner coordination.",
    requirements: [
      "Public speaking and facilitation",
      "Ability to build partner relationships",
      "Event planning and outreach",
    ],
    preferred: ["Training experience", "Social media comfort"],
    keywords: ["training","education","outreach","presentation","prevention","community","facilitation"]
  },
  {
    id: "admin-support",
    title: "Administrative Support",
    type: "Part-Time",
    location: "Flandreau, SD",
    tags: ["Admin", "Scheduling", "Records"],
    overview: "Support office operations, scheduling, and basic records management with confidentiality.",
    requirements: [
      "Strong attention to detail",
      "Comfort with email/office tools",
      "Professional communication",
    ],
    preferred: ["Experience with nonprofits", "Basic bookkeeping familiarity"],
    keywords: ["scheduling","records","office","data","email","confidentiality","organization"]
  }
];

const elRoleCards = document.getElementById("roleCards");
const elRoleDetail = document.getElementById("roleDetail");
const elApplyPanel = document.getElementById("applyPanel");
const elApplyTitle = document.getElementById("applyTitle");
const elApplyForm = document.getElementById("applyForm");
const elResultPanel = document.getElementById("resultPanel");
const elFitResult = document.getElementById("fitResult");

let selectedRole = null;

function renderRoleCards(){
  ROLES.forEach(role => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "emp-role-card";
    card.innerHTML = `
      <div class="emp-role-top">
        <h4>${role.title}</h4>
        <span class="chip">${role.type}</span>
      </div>
      <div class="muted emp-role-meta">${role.location}</div>
      <div class="emp-tag-row">
        ${role.tags.map(t => `<span class="pill">${t}</span>`).join("")}
      </div>
      <p class="muted emp-role-desc">${role.overview}</p>
    `;
    card.addEventListener("click", () => selectRole(role.id));
    elRoleCards.appendChild(card);
  });
}

function selectRole(roleId){
  selectedRole = ROLES.find(r => r.id === roleId);
  // Highlight selected
  document.querySelectorAll(".emp-role-card").forEach(btn => btn.classList.remove("active"));
  // Find by title match (simple) and add active
  const btns = Array.from(document.querySelectorAll(".emp-role-card"));
  const idx = ROLES.findIndex(r => r.id === roleId);
  if (btns[idx]) btns[idx].classList.add("active");

  elRoleDetail.innerHTML = `
    <div class="emp-detail-inner">
      <div class="emp-detail-head">
        <div>
          <div class="chip">Role</div>
          <h3>${selectedRole.title}</h3>
          <div class="muted">${selectedRole.type} • ${selectedRole.location}</div>
        </div>
        <button class="btn btn-solid" type="button" id="btnInterested">I’m Interested</button>
      </div>

      <div class="emp-detail-grid">
        <div class="panel">
          <h4>Overview</h4>
          <p class="muted">${selectedRole.overview}</p>
          <h4>Key tags</h4>
          <div class="emp-tag-row">
            ${selectedRole.tags.map(t => `<span class="pill">${t}</span>`).join("")}
          </div>
        </div>
        <div class="panel">
          <h4>Requirements</h4>
          <ul class="bullets">${selectedRole.requirements.map(x => `<li>${x}</li>`).join("")}</ul>
          <h4>Preferred</h4>
          <ul class="bullets">${selectedRole.preferred.map(x => `<li>${x}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnInterested").addEventListener("click", openApply);
}

function openApply(){
  elApplyPanel.hidden = false;
  elApplyTitle.textContent = `Apply for: ${selectedRole.title}`;
  elApplyPanel.scrollIntoView({behavior:"smooth", block:"start"});
}

function computeFitScore(text, keywords){
  const norm = (text || "").toLowerCase();
  const hits = keywords.filter(k => norm.includes(k));
  const score = Math.round((hits.length / Math.max(1, keywords.length)) * 100);
  let label = "Developing";
  if (score >= 70) label = "Strong";
  else if (score >= 40) label = "Moderate";
  return {score, label, hits, gaps: keywords.filter(k => !hits.includes(k))};
}

function safeMailto(to, subject, body){
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

elApplyForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedRole){
    alert("Please select a role first.");
    return;
  }

  const fd = new FormData(elApplyForm);
  const resume = document.getElementById("resumeFile")?.files?.[0];
  if (!resume){
    alert("Resume upload is required.");
    return;
  }

  const combined = [
    fd.get("skills"),
    fd.get("questions"),
    fd.get("coverLetter"),
    fd.get("notes")
  ].filter(Boolean).join(" ");

  const fit = computeFitScore(combined, selectedRole.keywords);

  elFitResult.innerHTML = `
    <div class="emp-fit-top">
      <div class="emp-fit-score">${fit.score}%</div>
      <div>
        <div class="emp-fit-label">${fit.label} match</div>
        <div class="muted">Based on keywords relevant to this role.</div>
      </div>
    </div>
    <div class="emp-fit-cols">
      <div class="panel">
        <h4>Matches</h4>
        <div class="emp-chip-row">
          ${(fit.hits.length ? fit.hits : ["No keyword matches yet"]).map(x => `<span class="chip">${x}</span>`).join("")}
        </div>
      </div>
      <div class="panel">
        <h4>Possible gaps</h4>
        <div class="emp-chip-row">
          ${(fit.gaps.slice(0,8).length ? fit.gaps.slice(0,8) : ["None"]).map(x => `<span class="chip">${x}</span>`).join("")}
        </div>
      </div>
    </div>
  `;

  elResultPanel.hidden = false;

  const applicantEmail = (fd.get("email") || "").toString();
  const applicantName = (fd.get("name") || "").toString();
  const roleTitle = selectedRole.title;

  const subjectApplicant = `Application Received — ${roleTitle}`;
  const bodyApplicant =
`Hello ${applicantName || "there"},

Thank you for your interest in the ${roleTitle} role at The Wholeness Center.
We received your application and will follow up as soon as possible.

If you need immediate support, call (605) 997-5594.

— The Wholeness Center`;

  const subjectAdmin = `New Application — ${roleTitle}`;
  const bodyAdmin =
`New application submitted.

Role: ${roleTitle}
Name: ${applicantName}
Email: ${applicantEmail}
Phone: ${fd.get("phone") || ""}
Location: ${fd.get("location") || ""}
Preferred contact: ${fd.get("contactMethod") || ""}

Skills/keywords: ${fd.get("skills") || ""}

Notes:
${fd.get("notes") || ""}

(Front-end demo: attach resume manually or add backend automation.)`;

  document.getElementById("emailApplicant").href = safeMailto(applicantEmail, subjectApplicant, bodyApplicant);
  document.getElementById("emailAdmin").href = safeMailto("admin@wholenesscenter.org", subjectAdmin, bodyAdmin);

  document.getElementById("downloadJSON").onclick = () => {
    const payload = Object.fromEntries(fd.entries());
    payload.role = selectedRole;
    payload.fit = fit;
    payload.resume_filename = resume.name;

    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `application_${selectedRole.id}.json`;
    a.click();
  };
});

renderRoleCards();
