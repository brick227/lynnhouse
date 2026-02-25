(function(){
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function normalize(s){ return (s||"").toLowerCase().replace(/\s+/g," ").trim(); }

  function setMatched(targetText){
    const t = normalize(targetText);
    $all("[data-qual]").forEach(el=>{
      const q = normalize(el.getAttribute("data-qual"));
      if(!q) return;
      if(q === t){
        el.classList.add("matched");
      }
    });
  }

  function clearMatched(){
    $all("[data-qual].matched").forEach(el=>el.classList.remove("matched"));
  }

  function wireChecklist(containerId){
    const box = document.getElementById(containerId);
    if(!box) return;
    box.addEventListener("change", (e)=>{
      if(e.target && e.target.matches("input[type='checkbox']")){
        clearMatched();
        // apply all checked items
        $all("input[type='checkbox']:checked", box).forEach(cb=>{
          setMatched(cb.value);
        });
      }
    });
  }

  function wireOther(inputId, btnId, listId, labelPrefix){
    const inp = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const list = document.getElementById(listId);
    if(!inp || !btn || !list) return;

    btn.addEventListener("click", ()=>{
      const val = inp.value.trim();
      if(!val) return;
      const id = "other-" + Math.random().toString(16).slice(2);
      const li = document.createElement("li");
      li.innerHTML = `<label class="check"><input type="checkbox" value="${val}" /> <span>${val}</span></label>`;
      list.appendChild(li);
      inp.value = "";
      // auto-check + highlight
      const cb = li.querySelector("input");
      cb.checked = true;
      clearMatched();
      // apply all checked items including new one
      list.closest(".picker").querySelectorAll("input[type='checkbox']:checked").forEach(cb2=> setMatched(cb2.value));
    });
  }

  wireChecklist("degreePicker");
  wireChecklist("certPicker");

  wireOther("degreeOther","degreeAdd","degreeOtherList");
  wireOther("certOther","certAdd","certOtherList");
})();
