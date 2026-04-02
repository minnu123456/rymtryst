const drop = document.getElementById("dropdown");
const searchDrop = document.getElementById("search");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// header dropdown's logic
const dropbut = document.getElementById("dropbutt");
const searchButt = document.getElementById("searchButt");
let headState = false;
window.addEventListener("click", (e) => {
  if (e.target.closest("#dropbutt") === dropbut) {
    const dropValue = window.getComputedStyle(drop).display;
    if (dropValue == "block") {
      drop.style.display = "none";
    } else if (dropValue == "none") {
      drop.style.display = "block";
    }
  } else if (!drop.contains(e.target)) {
    drop.style.display = "none";
  }

  if (e.target.closest("#searchButt") === searchButt) {
    const searchValue = window.getComputedStyle(searchDrop).display;
    if (searchValue == "flex") {
      searchDrop.style.display = "none";
    } else if (searchValue == "none") {
      searchDrop.style.display = "flex";
    }
  } else if (!searchDrop.contains(e.target)) {
    searchDrop.style.display = "none";
  }
});

document.getElementById("sb_clear").addEventListener("click", () => {
  document.getElementById("sb_main").value = "";
});

// dropdown li elemnts focus logic
drop.addEventListener("click", (e) => {
  const clickedElem = e.target;
  const childs = drop.children;
  const target = clickedElem.parentElement;
  if (Array.from(childs).includes(target)) {
    if (target.classList.contains("ul-highlight")) {
      target.classList.remove("ul-highlight");
      Array.from(drop.querySelectorAll(".sub_dropdown_ul")).forEach((e) => {
        e.style.display = "none";
      });
    } else if (!target.classList.contains("ul-highlight")) {
      Array.from(childs).forEach((e) => {
        e.classList.remove("ul-highlight");
      });
      Array.from(drop.querySelectorAll(".sub_dropdown_ul")).forEach((e) => {
        e.style.display = "none";
      });
      target.classList.add("ul-highlight");
      const sub_drop = target.querySelector(".sub_dropdown_ul");
      sub_drop.style.display = "block";
    }
  }
});

// slide element position management (cause: header positioning is absolute)

window.onload = () => {
  const header = document.querySelector("header").offsetHeight;
  document.getElementById("slide").style.margin = 0;
  document.getElementById("slide").style.marginTop = header + "px";
};
document.addEventListener("resize", () => {
  document.getElementById("slide").style.margin = 0;
  document.getElementById("slide").style.marginTop = header + "px";
});

// the animation logic for slide element
const slide = document.getElementById("slide");
let trackhold = false;

let norm = 0;
slide.addEventListener("pointerdown", (e) => {
  let x = e.clientX;
  let y = e.clientY;
  if (e.button === 0) {
    trackhold = true;
    if (norm == 0) {
      norm = x;
      console.log(norm);
    }
  }
});
slide.addEventListener("pointerup", (e) => {
  trackhold = false;
  if (norm != e.clientX) {
    if (norm > e.clientX && norm - e.clientX > 100) {
      goLeft = true;
    } else if (norm < e.clientX && e.clientX - norm > 100) {
      goRight = true;
    }
  }
  norm = 0;
  console.log(goLeft, goRight);
});
slide.addEventListener("pointerleave", (e) => {
  trackhold = false;
  if (norm != e.clientX) {
    if (norm > e.clientX && norm - e.clientX > 100) {
      goLeft = true;
    } else if (norm < e.clientX && e.clientX - norm > 100) {
      goRight = true;
    }
  }
  norm = 0;
  console.log(goLeft, goRight);
});
async function moveNext() {
  while (true) {
    let track = document.getElementById("track");
    let childs = document.querySelectorAll("#track img");
    if (childs.length === 0) return;

    const width = childs[0].offsetWidth;

    track.style.transition = "transform 0.8s ease-in-out";
    track.style.transform = `translateX(-${width}px)`;

    for (let i = 0; i < 28; i++) {
      if (trackhold == true) {
        let state = true;
        track.getAnimations().forEach((e) => e.pause());
        while (state) {
          if (trackhold == false) {
            state = false;
          } else {
            await delay(50);
          }
        }
        track.getAnimations().forEach((e) => e.play());
      } else if (i == 7) {
        const firstChild = track.firstElementChild;
        track.appendChild(firstChild);

        track.style.transition = "none";
        track.style.transform = `translateX(0)`;
      } else if (goLeft == true || goRight == true) {
        track.style.transition = "none";
        track.style.transition = "transform 0.8s ease-in-out";
        if (goLeft == true) {
          track.style.transform = `translateX(+${width}px)`;
        } else {
          track.style.transform = `translateX(-${width}px)`;
        }
      } else {
        await delay(100);
      }
    }
  }
}

moveNext();

// animation logic for blur-in and out
async function blurin(el) {
  if (!el) return true;
  const childs = el.children;
  const parent = el.parentElement;
  let d = 0;
  let i = 0;
  let delayy = 4000;
  let interval = 100;

  parent.querySelector(".leftt").addEventListener("click", () => {
    d = -1;
  });
  parent.querySelector(".rightt").addEventListener("click", () => {
    d = 1;
  });
  while (true) {
    i = (i + childs.length) % childs.length;

    let elem = childs[i];
    elem.style.animation = "none";
    void elem.offsetHeight;
    elem.style.animation = "slowBlur 4s ease";

    for (let l = 0; l < delayy / interval; l++) {
      if (el.active == false) {
        elem.style.animation = "none";
        elem.style.visibility = "visible";
        while (!el.active) {
          await delay(50);
        }
        elem.style.visibility = "hidden";
        elem.style.animation = "none";
        break;
      } else if (d !== 0) {
        elem.style.animation = "none";
        if (d === -1) i = i - 2;
        break;
      } else {
        await delay(interval);
      }
    }

    d = 0;
    i = (i + 1) % childs.length;
  }
}
const blurIns = document.querySelectorAll(".bluro");
blurIns.forEach((e) => {
  blurin(e);
});

window.addEventListener("load", (e) => {
  //book animation
  const target = document.getElementById("front");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        target.style.animation = "book 2s ease-in-out both";
      }
    },
    {
      root: null,
      rootMargin: "-30% 0px -70% 0px",
      threshold: 0,
    },
  );

  //section highliter
  const page = document.getElementById("bgpage");
  const latestActivity = document.getElementById("latestActivities");

  const bluroos = document.querySelectorAll(".bluro");
  let animIn = latestActivity;
  latestActivity.classList.add("bgnone");
  page.style.height = latestActivity.offsetHeight + "px";
  page.style.top =
    latestActivity.getBoundingClientRect().top + window.scrollY + "px";

  const focusAnim = document.querySelectorAll(".focusAnim");
  const observo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (window.animIn) {
            window.animIn.classList.remove("bgnone");
          }
          entry.target.classList.add("bgnone");
          window.animIn = entry.target;
          const rect = entry.target.getBoundingClientRect();
          page.style.height = entry.target.offsetHeight + "px";
          page.style.top = rect.top + window.scrollY + "px";
          const bluroo = entry.target.querySelector(".bluro");
          bluroos.forEach((e) => {
            if (e == bluroo) {
              e.active = true;
            } else {
              e.active = false;
            }
          });
        }
      });
    },
    {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0.1,
    },
  );
  for (let i = 0; i < focusAnim.length; i++) {
    observo.observe(focusAnim[i]);
  }
  observer.observe(target);
  triggerSplash();
});

function triggerSplash() {
  const splash = document.getElementById("splashscreen");
  const splashLogo = document.querySelector("#splashscreen > img");
  const headerLogo = document.getElementById("h-logo");

  const rect = headerLogo.getBoundingClientRect();
  const splashRect = splashLogo.getBoundingClientRect();

  const targetX = rect.left + rect.width / 2 - window.innerWidth / 2;
  const targetY = rect.top + rect.height / 2 - window.innerHeight / 2;

  splashLogo.style.transform = `translate(${targetX}px, ${targetY}px) scale(${
    rect.width / splashRect.width
  })`;
  splashLogo.addEventListener(
    "transitionend",
    (e) => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      splash.classList.add("finished");
    },
    { once: true },
  );
}

document.querySelectorAll("img").forEach((e) => {
  e.addEventListener("click", () => {
    disableScroll();
    const img = document.createElement("img");
    const ifCon = document.getElementById("if-container");
    const imgFocus = document.getElementById("imgfocus");
    img.src = e.src;
    ifCon.replaceChildren();
    ifCon.appendChild(img);
    imgFocus.style.display = "flex";
  });
});

function disableScroll() {
  document.body.style.overflow = "hidden";
}

function enableScroll() {
  document.body.style.overflow = "auto";
}

function imgFocusExit() {
  enableScroll();
  document.getElementById("imgfocus").style.display = "none";
}

const tab = document.getElementById("tab");
const searchDefault = tab.cloneNode(true);
const input = document.getElementById("sb_main");
let tabData;
let elem;

input.addEventListener("input", async () => {
  tabData = await searchSetup(input.value);
  tab.innerHTML = "";
  tabData.forEach((e) => {
    elem = document.createElement("a");
    elem.classList.add("tab_elements");
    elem.innerText = e[0];
    elem.href = e[1];
    tab.appendChild(elem);
  });
});
