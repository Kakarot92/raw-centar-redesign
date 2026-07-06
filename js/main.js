(function(){
  "use strict";
  document.documentElement.classList.add("js");

  var clamp = function(v,a,b){ return Math.min(b, Math.max(a, v)); };
  var lerp  = function(a,b,t){ return a + (b - a) * t; };
  var easeOut = function(t){ return 1 - Math.pow(1 - t, 3); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- preloader ---------- */
  var preloader = document.getElementById("preloader");
  var preNum = document.getElementById("preNum");
  var preBar = document.getElementById("preBar");
  function finishLoad(){
    document.body.classList.add("loaded");
    document.body.classList.remove("no-scroll");
    if (preloader){
      preloader.classList.add("done");
      setTimeout(function(){ preloader.style.display = "none"; }, 1000);
    }
  }
  if (reduced || !preloader){
    if (preloader) preloader.style.display = "none";
    document.body.classList.add("loaded");
  } else {
    document.body.classList.add("no-scroll");
    var p0 = null, DUR = 1500;
    (function count(ts){
      if (p0 === null) p0 = ts;
      var k = easeOut(clamp((ts - p0) / DUR, 0, 1));
      var v = Math.round(k * 100);
      preNum.textContent = v;
      preBar.style.width = v + "%";
      if (k < 1) requestAnimationFrame(count);
      else setTimeout(finishLoad, 180);
    })(performance.now());
  }

  /* ---------- custom cursor ---------- */
  var dot = document.getElementById("cursorDot");
  var ring = document.getElementById("cursorRing");
  var cursorOn = finePointer && !reduced && dot && ring;
  var mx = -100, my = -100, rx = -100, ry = -100;
  if (cursorOn){
    document.documentElement.classList.add("custom-cursor");
    window.addEventListener("mousemove", function(e){ mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener("mouseover", function(e){
      if (e.target.closest("a, button, summary, .stack-card, .prob, .member")) ring.classList.add("big");
    });
    document.addEventListener("mouseout", function(e){
      if (e.target.closest("a, button, summary, .stack-card, .prob, .member")) ring.classList.remove("big");
    });
  }

  /* ---------- nav + meni ---------- */
  var nav = document.getElementById("nav");
  function navState(){ nav.classList.toggle("scrolled", window.scrollY > 40); }

  var menuBtn = document.getElementById("menuBtn");
  var overlay = document.getElementById("menuOverlay");
  function closeMenu(){
    overlay.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  menuBtn.addEventListener("click", function(){
    var open = !overlay.classList.contains("open");
    overlay.classList.toggle("open", open);
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("no-scroll", open);
  });
  overlay.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

  /* ---------- philosophy ---------- */
  var phil  = document.querySelector(".philosophy");
  var lines = Array.prototype.slice.call(document.querySelectorAll(".phil-line"));
  var ticks = Array.prototype.slice.call(document.querySelectorAll("#philCount i"));
  var philIdx = -1;
  function philState(){
    var r = phil.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    var idx = clamp(Math.floor(p * lines.length), 0, lines.length - 1);
    if (r.top > 0) idx = 0;
    if (idx !== philIdx){
      philIdx = idx;
      lines.forEach(function(el, i){ el.classList.toggle("active", i === idx); });
      ticks.forEach(function(el, i){ el.classList.toggle("on", i <= idx); });
    }
  }

  /* ---------- proces: horizontalni scrub ---------- */
  var procSec  = document.getElementById("proces");
  var procPin  = document.getElementById("procPin");
  var procTrack = document.getElementById("procTrack");
  var procTarget = 0, procCur = -1;
  function procState(){
    if (window.innerWidth < 900){ procTarget = 0; return; }
    var r = procSec.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    procTarget = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  /* ---------- hero hint ---------- */
  var hint = document.getElementById("heroHint");
  function hintState(){
    hint.style.opacity = clamp(1 - window.scrollY / 140, 0, 1).toFixed(3);
  }

  /* ---------- glavna petlja ---------- */
  function frame(){
    if (cursorOn){
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px) translate(-50%,-50%)";
    }
    if (window.innerWidth >= 900){
      if (procCur < 0) procCur = procTarget;
      procCur = reduced ? procTarget : lerp(procCur, procTarget, 0.12);
      if (Math.abs(procCur - procTarget) < 0.0005) procCur = procTarget;
      var max = procTrack.scrollWidth - procPin.clientWidth;
      procTrack.style.transform = "translateX(" + (-procCur * Math.max(max, 0)).toFixed(1) + "px)";
    } else {
      procTrack.style.transform = "";
    }
    requestAnimationFrame(frame);
  }

  /* ---------- scroll ---------- */
  function onScroll(){
    navState();
    hintState();
    philState();
    procState();
  }

  /* ---------- reveals ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  /* ---------- counters ---------- */
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target;
      var end = parseInt(el.getAttribute("data-target"), 10);
      if (reduced){ el.textContent = end; return; }
      var t0 = null, dur = 1500;
      function step(ts){
        if (t0 === null) t0 = ts;
        var k = easeOut(clamp((ts - t0) / dur, 0, 1));
        el.textContent = Math.round(end * k);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".count").forEach(function(el){ cio.observe(el); });

  /* ---------- faq: jedno otvoreno ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll("#faqList details"));
  faqItems.forEach(function(d){
    d.addEventListener("toggle", function(){
      if (!d.open) return;
      faqItems.forEach(function(o){ if (o !== d) o.open = false; });
    });
  });

  /* ---------- lokalno vreme ---------- */
  var clock = document.getElementById("clock");
  function tick(){
    clock.textContent = new Date().toLocaleTimeString("sr-RS", { hour12: false });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- boot ---------- */
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  requestAnimationFrame(frame);
})();
