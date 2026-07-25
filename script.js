/* ============================================================
   AragoCor Minerals — site behaviour
   - Injects shared header + footer (edit markup here, once)
   - Sticky header scroll state, mega menu, mobile menu
   - FAQ accordions, resource/industry filtering, contact form
   No framework. Runs from a plain file:// open or any host.
   ============================================================ */

var NAV = [
  { label:"Science", href:"science.html", children:[
    ["The science","science.html"],
    ["Technical data sheets","science.html#tds"],
    ["Why aragonite","science.html#why-aragonite"],
    ["Lifecycle strategy","science.html#carbon-negative"]
  ]},
  { label:"Industries", href:"industries.html", children:[
    ["Glass manufacturing","industries.html#glass"],
    ["Agriculture","industries.html#agriculture"],
    ["Water treatment","industries.html#water-treatment"],
    ["Plastics & polymers","industries.html#plastics"],
    ["Construction & cement","industries.html#construction"],
    ["All industries","industries.html"]
  ]},
  { label:"About", href:"about.html" },
  { label:"Contact", href:"contact.html" }
];

/* small inline-SVG icon helpers (lucide paths) */
var ICON = {
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
};

/* ---------- Shared header ---------- */
function aragocorLogo(){ return (window.__resources && window.__resources.logo) || "images/aragocor-logo.png"; }
function buildHeader(active){
  var mainNav = NAV.filter(function(n){ return n.label !== "Contact"; });
  var navHtml = mainNav.map(function(n){
    var isActive = active === n.href ? " active" : "";
    if(n.children){
      var items = n.children.map(function(c){
        return '<a class="dropdown-item" href="'+c[1]+'">'+c[0]+'</a>';
      }).join("");
      return '<div class="nav-group">'+
        '<a class="nav-link'+isActive+'" href="'+n.href+'" aria-haspopup="true" aria-expanded="false">'+n.label+ICON.chevron+'</a>'+
        '<div class="dropdown"><div class="dropdown-inner">'+items+'</div></div>'+
      '</div>';
    }
    return '<a class="nav-link'+isActive+'" href="'+n.href+'">'+n.label+'</a>';
  }).join("");

  var mobileLinks = NAV.map(function(n){
    if(n.children){
      var subs = n.children.map(function(c){
        return '<a class="mobile-sublink" href="'+c[1]+'">'+c[0]+'</a>';
      }).join("");
      return '<div class="mobile-group">'+
        '<button class="mobile-link mobile-parent" aria-expanded="false">'+n.label+ICON.chevron+'</button>'+
        '<div class="mobile-sub">'+subs+'</div>'+
      '</div>';
    }
    return '<a class="mobile-link" href="'+n.href+'">'+n.label+'</a>';
  }).join("");

  return ''+
  '<header class="site-header" id="siteHeader">'+
    '<div class="container-wide header-inner">'+
      '<a class="brand" href="index.html" aria-label="AragoCor Minerals home"><img src="'+aragocorLogo()+'" alt="AragoCor Minerals" decoding="async"></a>'+
      '<nav class="main-nav">'+navHtml+'</nav>'+
      '<div class="header-cta">'+
        '<a class="nav-contact'+(active==="contact.html"?" active":"")+'" href="contact.html">Contact '+ICON.arrow+'</a>'+
      '</div>'+
      '<button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">'+ICON.menu+'</button>'+
    '</div>'+
    '<div class="mobile-menu" id="mobileMenu">'+
      '<div class="container-wide">'+
        mobileLinks+
      '</div>'+
    '</div>'+
  '</header>';
}

/* ---------- Shared footer ---------- */
function buildFooter(){
  var cols = [
    { title:"Material", links:[
      ["Science","science.html"],["Why Aragonite","science.html#why-aragonite"],
      ["Lifecycle Strategy","science.html#carbon-negative"],["The Bahamas Origin","about.html#origin"]]},
    { title:"Industries", links:[
      ["Glass Manufacturing","industries.html#glass"],["Agriculture","industries.html#agriculture"],
      ["Water Treatment","industries.html#water-treatment"],["Polymers","industries.html#plastics"],
      ["Construction","industries.html#construction"],["All Industries","industries.html"]]},
    { title:"Technical", links:[
      ["The Science","science.html"],["Technical Data Sheets","science.html#tds"],
      ["Aragonite vs Limestone","science.html#why-aragonite"],["Lifecycle Strategy","science.html#carbon-negative"]]},
    { title:"Company", links:[
      ["About","about.html"],["Contact","contact.html"],
      ["Request Sample","contact.html?type=sample"]]}
  ];
  var colHtml = cols.map(function(c){
    var li = c.links.map(function(l){ return '<li><a class="link-underline" href="'+l[1]+'">'+l[0]+'</a></li>'; }).join("");
    return '<div class="footer-col"><h4>'+c.title+'</h4><ul>'+li+'</ul></div>';
  }).join("");

  return ''+
  '<footer class="site-footer">'+
    '<div class="aurora-bg" aria-hidden="true"></div>'+
    '<div class="grid-bg" aria-hidden="true"></div>'+
    '<div class="container-wide footer-inner">'+
      '<div class="footer-top">'+
        '<div class="footer-brand">'+
          '<div class="footer-brand-lockup">'+
            '<img class="footer-primary-logo" src="'+aragocorLogo()+'" alt="AragoCor Minerals">'+
            '<span class="footer-logo-divider" aria-hidden="true"></span>'+
            '<div class="footer-partner">'+
              '<span>Partner company</span>'+
              '<img src="images/aragosan-logo.png" alt="Aragosan">'+
            '</div>'+
          '</div>'+
          '<p>AragoCor Minerals supplies high-purity natural oolitic aragonite for technical evaluation and industrial applications.</p>'+
          '<ul class="footer-contact">'+
            '<li>'+ICON.pin+' Stockton, California, United States</li>'+
            '<li>'+ICON.mail+' <a href="mailto:sales@aragocorminerals.com">sales@aragocorminerals.com</a></li>'+
            '<li>'+ICON.globe+' <a href="https://www.aragocorminerals.com">www.aragocorminerals.com</a></li>'+
          '</ul>'+
        '</div>'+
        '<div class="footer-cols">'+colHtml+'</div>'+
      '</div>'+
      '<div class="hairline" style="margin-top:4rem;opacity:.3"></div>'+
      '<div class="footer-bottom">'+
        '<p>© <span id="yr"></span> AragoCor Minerals LLC. High-purity natural oolitic aragonite calcium carbonate.</p>'+
        '<p style="display:flex;gap:1.25rem;flex-wrap:wrap"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Use</a><a href="contact.html">Contact</a></p>'+
      '</div>'+
      '<p class="footer-disclaimer" style="margin-top:1.25rem;font-size:.75rem;line-height:1.6;color:hsl(var(--pearl) / 0.5);max-width:60rem">All published figures are representative values for preliminary evaluation only and do not constitute a warranty or a lot-specific certificate of analysis. Confirm current specifications and lot documentation before procurement.</p>'+
    '</div>'+
    '<a href="#top" class="back-to-top">Back to top '+ICON.arrowUp+'</a>'+
  '</footer>';
}

/* ---------- Header behaviour ---------- */
function initHeader(){
  var header = document.getElementById("siteHeader");
  if(!header) return;
  var mobileMenu = document.getElementById("mobileMenu");
  var toggle = document.getElementById("menuToggle");
  var transparent = header.hasAttribute("data-transparent");

  function onScroll(){
    if(!transparent){ header.classList.add("scrolled"); return; }
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });

  if(toggle && mobileMenu){
    toggle.addEventListener("click", function(){
      var open = mobileMenu.classList.toggle("open");
      toggle.innerHTML = open ? ICON.x : ICON.menu;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobileMenu.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        mobileMenu.classList.remove("open");
        toggle.innerHTML = ICON.menu;
        toggle.setAttribute("aria-expanded","false");
        toggle.setAttribute("aria-label","Open menu");
      });
    });
    document.addEventListener("keydown", function(event){
      if(event.key === "Escape" && mobileMenu.classList.contains("open")){
        mobileMenu.classList.remove("open");
        toggle.innerHTML = ICON.menu;
        toggle.setAttribute("aria-expanded","false");
        toggle.setAttribute("aria-label","Open menu");
        toggle.focus();
      }
    });
  }

  // Mobile submenu expand/collapse
  header.querySelectorAll(".mobile-parent").forEach(function(btn){
    btn.addEventListener("click", function(){
      var group = btn.closest(".mobile-group");
      var open = group.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Desktop dropdown: tap-to-open on touch, ESC to close
  header.querySelectorAll(".nav-group").forEach(function(group){
    var link = group.querySelector(".nav-link");
    group.addEventListener("mouseenter", function(){ link.setAttribute("aria-expanded","true"); });
    group.addEventListener("mouseleave", function(){ link.setAttribute("aria-expanded","false"); });
  });
}

/* ---------- FAQ accordions ---------- */
function initAccordions(){
  document.querySelectorAll(".acc-trigger").forEach(function(btn, index){
    var item = btn.closest(".acc-item");
    var panel = item && item.querySelector(".acc-panel");
    if(!item || !panel) return;
    var panelId = panel.id || "accordion-panel-"+index;
    panel.id = panelId;
    btn.setAttribute("aria-controls", panelId);
    btn.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
    btn.addEventListener("click", function(){
      var isOpen = item.classList.contains("open");
      // single-collapse within same accordion
      var parent = item.closest(".accordion");
      if(parent){ parent.querySelectorAll(".acc-item.open").forEach(function(o){ if(o!==item){ o.classList.remove("open"); o.querySelector(".acc-panel").style.maxHeight=null; var other=o.querySelector(".acc-trigger"); if(other) other.setAttribute("aria-expanded","false"); } }); }
      if(isOpen){ item.classList.remove("open"); panel.style.maxHeight=null; btn.setAttribute("aria-expanded","false"); }
      else { item.classList.add("open"); panel.style.maxHeight = panel.scrollHeight + "px"; btn.setAttribute("aria-expanded","true"); }
    });
  });
}

/* ---------- Generic card filtering (resources + industries hub) ---------- */
function initFilters(){
  // Text search inputs with data-filter-target
  document.querySelectorAll("[data-search]").forEach(function(input){
    var target = document.querySelector(input.getAttribute("data-search"));
    if(!target) return;
    input.addEventListener("input", function(){ applyFilter(target); });
  });
  // Category chips
  document.querySelectorAll("[data-filter-group]").forEach(function(group){
    var target = document.querySelector(group.getAttribute("data-filter-group"));
    group.querySelectorAll(".filter-chip").forEach(function(chip){
      chip.addEventListener("click", function(){
        group.querySelectorAll(".filter-chip").forEach(function(c){ c.classList.remove("active"); });
        chip.classList.add("active");
        if(target){ target.setAttribute("data-active-cat", chip.getAttribute("data-cat")||"All"); applyFilter(target); }
      });
    });
  });
  // preselect category from ?cat=
  var qc = new URLSearchParams(location.search).get("cat");
  if(qc){
    var map = { tds:"Technical Data Sheet", sds:"Safety Data Sheet", whitepapers:"White Paper" };
    var wanted = map[qc];
    if(wanted){
      var chip = document.querySelector('.filter-chip[data-cat="'+wanted+'"]');
      if(chip) chip.click();
    }
  }
  // initialize counts for any grids on load
  document.querySelectorAll("[data-count]").forEach(function(c){
    var t = document.querySelector(c.getAttribute("data-count"));
    if(t) applyFilter(t);
  });
}
function applyFilter(target){
  var q = "";
  var searchInput = document.querySelector('[data-search="#'+target.id+'"]');
  if(searchInput) q = searchInput.value.toLowerCase();
  var cat = target.getAttribute("data-active-cat") || "All";
  var shown = 0;
  target.querySelectorAll("[data-card]").forEach(function(card){
    var text = (card.getAttribute("data-text")||"").toLowerCase();
    var cCat = card.getAttribute("data-cat")||"";
    var okText = !q || text.indexOf(q) !== -1;
    var okCat = cat === "All" || cCat === cat;
    var show = okText && okCat;
    card.style.display = show ? "" : "none";
    if(show) shown++;
  });
  var empty = document.querySelector('[data-empty="#'+target.id+'"]');
  if(!shown && q && !empty){
    empty = document.createElement("p");
    empty.setAttribute("data-empty", "#"+target.id);
    empty.style.cssText = "margin-top:2rem;color:hsl(var(--muted-foreground))";
    empty.textContent = "No industries match your search.";
    target.insertAdjacentElement("afterend", empty);
  } else if(empty){
    empty.style.display = shown || !q ? "none" : "";
  }
  var counter = document.querySelector('[data-count="#'+target.id+'"]');
  if(counter){ var total = target.querySelectorAll("[data-card]").length; counter.textContent = "Showing "+shown+" of "+total; }
}

/* ---------- Technical comparison application filter ---------- */
function initComparisonFilters(){
  var buttons = document.querySelectorAll("[data-comparison-filter]");
  var rows = document.querySelectorAll("[data-comparison-row]");
  var status = document.getElementById("comparison-status");
  if(!buttons.length || !rows.length) return;

  var labels = {
    all: "all decision factors",
    glass: "factors relevant to glass evaluation",
    agriculture: "factors relevant to agriculture evaluation",
    water: "factors relevant to water-treatment evaluation",
    polymers: "factors relevant to polymer evaluation",
    construction: "factors relevant to construction evaluation"
  };

  buttons.forEach(function(button){
    button.addEventListener("click", function(){
      var filter = button.getAttribute("data-comparison-filter") || "all";
      buttons.forEach(function(item){
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      rows.forEach(function(row){
        var apps = (row.getAttribute("data-apps") || "").split(/\s+/);
        row.hidden = filter !== "all" && apps.indexOf(filter) === -1;
      });
      if(status) status.textContent = "Showing " + (labels[filter] || labels.all);
    });
  });
}

/* ---------- Contact form ---------- */
function initContact(){
  var form = document.getElementById("contactForm");
  if(!form) return;
  var type = new URLSearchParams(location.search).get("type");
  var sel = document.getElementById("requestType");
  if(sel && type){
    var map = { engineer:"Consultation", sample:"Sample", download:"Technical Data", "case-study":"Consultation" };
    if(map[type]) sel.value = map[type];
  }
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var d = new FormData(form);
    var reqType = (d.get("requestType") || "Inquiry");
    var lines = [];
    d.forEach(function(v,k){ if(String(v).trim()) lines.push(k+": "+v); });
    var subject = encodeURIComponent("AragoCor "+reqType+" — "+(d.get("name")||"Website inquiry"));
    var body = encodeURIComponent(lines.join("\n"));
    showToast("Opening your email", "Your request has been prepared in your mail app. Send it to reach an AragoCor specialist.");
    window.location.href = "mailto:sales@aragocorminerals.com?subject="+subject+"&body="+body;
  });
}
function showToast(title, desc){
  var t = document.getElementById("toast");
  if(!t){
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = '<div class="tt">'+title+'</div><div class="td">'+desc+'</div>';
  requestAnimationFrame(function(){ t.classList.add("show"); });
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.classList.remove("show"); }, 4500);
}

/* ---------- Hero background video ---------- */
function initHeroVideo(){
  var video = document.querySelector("[data-hero-video]");
  if(!video) return;

  video.controls = false;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

  function playVideo(){
    var playAttempt = video.play();
    if(playAttempt && typeof playAttempt.catch === "function"){
      playAttempt.catch(function(){});
    }
  }

  function syncMotionPreference(){
    if(reduceMotion && reduceMotion.matches){
      video.pause();
      video.currentTime = 0;
      video.classList.remove("is-ready");
    } else {
      playVideo();
    }
  }
  video.addEventListener("playing", function(){ video.classList.add("is-ready"); });
  video.addEventListener("emptied", function(){ video.classList.remove("is-ready"); });
  if(reduceMotion){
    if(typeof reduceMotion.addEventListener === "function") reduceMotion.addEventListener("change", syncMotionPreference);
    else if(typeof reduceMotion.addListener === "function") reduceMotion.addListener(syncMotionPreference);
  }
  syncMotionPreference();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", function(){
  var headerMount = document.getElementById("header-mount");
  if(headerMount){
    var active = headerMount.getAttribute("data-active") || "";
    var transparent = headerMount.getAttribute("data-transparent") === "true";
    headerMount.outerHTML = buildHeader(active);
    if(transparent){ var h = document.getElementById("siteHeader"); if(h) h.setAttribute("data-transparent","true"); }
  }
  var footerMount = document.getElementById("footer-mount");
  if(footerMount){ footerMount.outerHTML = buildFooter(); }

  var yr = document.getElementById("yr"); if(yr) yr.textContent = new Date().getFullYear();

  initHeader();
  initAccordions();
  initFilters();
  initComparisonFilters();
  initContact();
  initHeroVideo();
});
