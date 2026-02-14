const drop = document.getElementById("dropdown");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// header dropdown logic
const dropbut = document.getElementById("dropbutt");
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
      sub_drop.style.display = "grid";
    }
  }
});

// slide element position management (cause: header positioning is absolute)

/*
window.onload = () => {
  const header = document.querySelector("header").offsetHeight;
  document.getElementById("slide").style.margin = 0;
  document.getElementById("slide").style.marginTop = header + "px";
};
document.addEventListener("resize", () => {
  document.getElementById("slide").style.margin = 0;
  document.getElementById("slide").style.marginTop = header + "px";
});
*/
// the animation logic for slide element
const slide = document.getElementById("slide");
let trackhold = false;
slide.addEventListener("pointerdown", (e) => {
  if (e.button === 0) {
    trackhold = true;
  }
});
slide.addEventListener("pointerup", () => {
  trackhold = false;
});
slide.addEventListener("pointerleave", () => {
  trackhold = false;
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
            console.log("h");
            await delay(50);
          }
        }
        track.getAnimations().forEach((e) => e.play());
      } else if (i == 7) {
        const firstChild = track.firstElementChild;
        track.appendChild(firstChild);

        track.style.transition = "none";
        track.style.transform = `translateX(0)`;
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
  const target = document.querySelectorAll(".front");

  const observer = new IntersectionObserver(
    (entries) => {
      // Removed brackets []
      entries.forEach((entry) => {
        // Loop through all changes
        if (entry.isIntersecting) {
          entry.target.style.animation = "book 2s ease-in-out both";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "-30% 0px -70% 0px",
      threshold: 0,
    },
  );

  observer.observe(target[0]);

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

function resizeTextToFit(containerSelector, maxLines = 2) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let fontSize = parseFloat(window.getComputedStyle(container).fontSize);

  // Helper to calculate current lines
  const getLineCount = (el) => {
    const style = window.getComputedStyle(el);
    const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    return Math.round(el.scrollHeight / lh);
  };

  // Shrink if text is too wide OR if it exceeds max lines
  while (
    (container.scrollWidth > container.offsetWidth ||
      getLineCount(container) > maxLines) &&
    fontSize > 1
  ) {
    fontSize -= 0.5;
    container.style.fontSize = fontSize + "px";
    container.style.height = fontSize + "px";
    container.style.lineHeight = fontSize + "px";
  }
}

resizeTextToFit(".back h2", 2);
