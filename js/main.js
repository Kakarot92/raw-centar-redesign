(function(){
  "use strict";
  var clamp = function(v,a,b){ return Math.min(b, Math.max(a, v)); };
  var lerp  = function(a,b,t){ return a + (b - a) * t; };
  var easeOut = function(t){ return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function(t){ return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  function navState(){ nav.classList.toggle("scrolled", window.scrollY > 40); }

  /* ---------- hero: put napretka (step-linija, "korak po korak") ---------- */
  var hero   = document.getElementById("pocetna");
  var canvas = document.getElementById("chart");
  var ctx    = canvas.getContext("2d");
  var copy   = document.getElementById("heroCopy");
  var hint   = document.getElementById("heroHint");

  var XF = [-0.02, 0.14, 0.22, 0.36, 0.44, 0.58, 0.66, 0.80, 0.87, 0.93];
  var YF = [ 0.88, 0.88, 0.77, 0.77, 0.65, 0.65, 0.51, 0.51, 0.37, 0.32];
  var W = 0, H = 0, DPR = 1, pts = [], total = 0;

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    pts = XF.map(function(x, i){ return { x: x * W, y: YF[i] * H }; });
    total = 0;
    for (var i = 1; i < pts.length; i++){
      total += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
    }

    /* linija sme da se vidi samo desno od teksta, da ga ne prekriva */
    var heroRect = hero.getBoundingClientRect();
    var copyRect = copy.getBoundingClientRect();
    canvas.style.setProperty("--safe-x", Math.round(copyRect.right - heroRect.left + 24) + "px");
  }

  function draw(prog, pulse){
    ctx.clearRect(0, 0, W, H);

    /* isprekidana bazna linija — "juče" */
    ctx.strokeStyle = "rgba(250,250,246,.13)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 7]);
    ctx.beginPath();
    ctx.moveTo(0, pts[0].y);
    ctx.lineTo(W, pts[0].y);
    ctx.stroke();
    ctx.setLineDash([]);

    /* stepenasta linija napretka */
    var L = prog * total, end = pts[0], done = false;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(221,245,34,.78)";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(221,245,34,.5)";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length && !done; i++){
      var a = pts[i-1], b = pts[i];
      var seg = Math.hypot(b.x - a.x, b.y - a.y);
      if (L >= seg){ ctx.lineTo(b.x, b.y); L -= seg; end = b; }
      else {
        var k = seg ? L / seg : 0;
        end = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
        ctx.lineTo(end.x, end.y);
        done = true;
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* tačka na vrhu + puls */
    var r = 4 + Math.sin(pulse) * 1.2;
    ctx.fillStyle = "rgba(221,245,34," + (0.22 + 0.12 * (Math.sin(pulse) * .5 + .5)) + ")";
    ctx.beginPath(); ctx.arc(end.x, end.y, r + 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#DDF522";
    ctx.beginPath(); ctx.arc(end.x, end.y, r, 0, Math.PI * 2); ctx.fill();

    if (prog >= 1){
      ctx.font = "italic 700 13px Archivo, sans-serif";
      ctx.fillStyle = "rgba(221,245,34,.9)";
      ctx.textAlign = "right";
      ctx.fillText("+1%", end.x - 14, end.y - 16);
      ctx.textAlign = "left";
    }
  }

  var t0 = null, prog = reduced ? 1 : 0, pulseT = 0.8;
  function frame(ts){
    if (hero.getBoundingClientRect().bottom > 0){
      if (prog < 1){
        if (t0 === null) t0 = ts;
        prog = clamp((ts - t0) / 2400, 0, 1);
      } else {
        pulseT += 0.045;
      }
      draw(easeInOut(prog), pulseT);
    }
    requestAnimationFrame(frame);
  }

  function heroFade(){
    if (reduced) return;
    var y = window.scrollY, vh = window.innerHeight;
    copy.style.opacity = clamp(1 - y / (vh * 0.75), 0, 1).toFixed(3);
    copy.style.transform = "translateY(" + (y * 0.16).toFixed(1) + "px)";
    hint.style.opacity = clamp(1 - y / 140, 0, 1).toFixed(3);
  }

  /* ---------- philosophy ---------- */
  var phil  = document.querySelector(".philosophy");
  var lines = Array.prototype.slice.call(document.querySelectorAll(".phil-line"));
  var ticks = Array.prototype.slice.call(document.querySelectorAll("#philCount i"));
  var philIdx = -1;
  function philState(){
    var r = phil.getBoundingClientRect();
    var totalH = r.height - window.innerHeight;
    var p = totalH > 0 ? clamp(-r.top / totalH, 0, 1) : 0;
    var idx = clamp(Math.floor(p * lines.length), 0, lines.length - 1);
    if (r.top > 0) idx = 0;
    if (idx !== philIdx){
      philIdx = idx;
      lines.forEach(function(el, i){ el.classList.toggle("active", i === idx); });
      ticks.forEach(function(el, i){ el.classList.toggle("on", i <= idx); });
    }
  }

  /* ---------- scroll ---------- */
  function onScroll(){
    navState();
    heroFade();
    philState();
  }

  /* ---------- reveals ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  /* ---------- counters ---------- */
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target;
      var end = parseInt(el.getAttribute("data-target"), 10);
      if (reduced){ el.textContent = end; return; }
      var s0 = null, dur = 1500;
      function step(ts){
        if (s0 === null) s0 = ts;
        var k = easeOut(clamp((ts - s0) / dur, 0, 1));
        el.textContent = Math.round(end * k);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".count").forEach(function(el){ cio.observe(el); });

  /* ---------- faq: jedno otvoreno u isto vreme ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll("#faqList details"));
  faqItems.forEach(function(d){
    d.addEventListener("toggle", function(){
      if (!d.open) return;
      faqItems.forEach(function(o){ if (o !== d) o.open = false; });
    });
  });

  /* ---------- boot ---------- */
  resize();
  onScroll();
  if (reduced){ draw(1, 0.8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function(){ resize(); onScroll(); if (reduced) draw(1, 0.8); });
  if (!reduced) requestAnimationFrame(frame);
})();
