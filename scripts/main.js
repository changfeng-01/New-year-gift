(() => {
  const sectionIds = ["welcome", "letter", "photos", "surprise"];
  const collapsedLetterMaxHeight = 240;

  const shouldReduceMotion = () => {
    try {
      return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    } catch {
      return false;
    }
  };

  const resolveScrollBehavior = (behavior) => {
    if (behavior === "smooth" && shouldReduceMotion()) return "auto";
    return behavior;
  };

  const getContentSource = () => {
    const fallback = {
      letter: {
        title: "一封小信",
        paragraphs: [
          "今年也辛苦啦。",
          "愿你在新的日子里，少一点内耗，多一点笃定；少一点焦虑，多一点睡眠。",
          "如果你偶尔觉得世界太吵，就把心收回来，先照顾好自己。"
        ],
        sign: "— 来自我"
      },
      photos: [
        { src: "./assets/photos/photo-01.svg", alt: "合照 1" },
        { src: "./assets/photos/photo-02.svg", alt: "合照 2" },
        { src: "./assets/photos/photo-03.svg", alt: "合照 3" },
        { src: "./assets/photos/photo-04.svg", alt: "合照 4" }
      ],
      timeline: [],
      quotes: []
    };

    const globalContent = window.NEW_YEAR_GIFT_CONTENT;
    if (!globalContent || typeof globalContent !== "object") return fallback;
    return { ...fallback, ...globalContent };
  };

  const normalizeTextList = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(/\n{2,}|\r\n{2,}|\r{2,}/)
        .map((chunk) => chunk.replace(/\s+/g, " ").trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeLetter = (rawLetter) => {
    if (!rawLetter || typeof rawLetter !== "object") {
      return {
        title: "一封小信",
        paragraphs: [],
        sign: ""
      };
    }

    const title = typeof rawLetter.title === "string" ? rawLetter.title.trim() : "一封小信";
    const paragraphs = normalizeTextList(rawLetter.paragraphs ?? rawLetter.body ?? rawLetter.content ?? "");
    const sign = typeof rawLetter.sign === "string" ? rawLetter.sign.trim() : "";

    return { title, paragraphs, sign };
  };

  const normalizePhotoItem = (rawPhoto, index) => {
    if (typeof rawPhoto === "string") {
      const src = rawPhoto.trim();
      if (!src) return null;
      return { src, alt: `合照 ${index + 1}` };
    }

    if (!rawPhoto || typeof rawPhoto !== "object") return null;
    const src = typeof rawPhoto.src === "string" ? rawPhoto.src.trim() : "";
    if (!src) return null;
    const alt = typeof rawPhoto.alt === "string" ? rawPhoto.alt.trim() : `合照 ${index + 1}`;
    return { src, alt };
  };

  const normalizePhotos = (rawPhotos) => {
    if (!Array.isArray(rawPhotos)) return [];
    return rawPhotos.map((item, index) => normalizePhotoItem(item, index)).filter(Boolean);
  };

  const normalizeTimelineItem = (rawItem, index) => {
    const fallbackTitle = `片段 ${index + 1}`;

    if (typeof rawItem === "string") {
      const text = rawItem.trim();
      if (!text) return null;
      const parts = text.split("|").map((chunk) => chunk.trim()).filter(Boolean);
      if (parts.length === 0) return null;
      if (parts.length === 1) return { time: "", title: fallbackTitle, desc: parts[0] };
      if (parts.length === 2) return { time: parts[0], title: parts[1] || fallbackTitle, desc: "" };
      return { time: parts[0], title: parts[1] || fallbackTitle, desc: parts.slice(2).join(" | ") };
    }

    if (!rawItem || typeof rawItem !== "object") return null;
    const time =
      typeof rawItem.time === "string"
        ? rawItem.time.trim()
        : typeof rawItem.date === "string"
          ? rawItem.date.trim()
          : "";
    const title = typeof rawItem.title === "string" ? rawItem.title.trim() : fallbackTitle;
    const desc =
      typeof rawItem.desc === "string"
        ? rawItem.desc.trim()
        : typeof rawItem.text === "string"
          ? rawItem.text.trim()
          : typeof rawItem.content === "string"
            ? rawItem.content.trim()
            : "";

    if (!title && !desc) return null;
    return { time, title: title || fallbackTitle, desc };
  };

  const normalizeTimeline = (rawTimeline) => {
    if (!Array.isArray(rawTimeline)) return [];
    return rawTimeline.map((item, index) => normalizeTimelineItem(item, index)).filter(Boolean);
  };

  const normalizeQuoteItem = (rawQuote, index) => {
    const fallbackText = `第 ${index + 1} 句`;

    if (typeof rawQuote === "string") {
      const text = rawQuote.trim();
      if (!text) return null;
      return { text, from: "" };
    }

    if (!rawQuote || typeof rawQuote !== "object") return null;
    const text =
      typeof rawQuote.text === "string"
        ? rawQuote.text.trim()
        : typeof rawQuote.quote === "string"
          ? rawQuote.quote.trim()
          : typeof rawQuote.content === "string"
            ? rawQuote.content.trim()
            : "";
    if (!text) return null;
    const from =
      typeof rawQuote.from === "string"
        ? rawQuote.from.trim()
        : typeof rawQuote.author === "string"
          ? rawQuote.author.trim()
          : "";
    return { text: text || fallbackText, from };
  };

  const normalizeQuotes = (rawQuotes) => {
    if (!Array.isArray(rawQuotes)) return [];
    return rawQuotes.map((item, index) => normalizeQuoteItem(item, index)).filter(Boolean);
  };

  const renderLetter = (letter) => {
    const titleElement = document.getElementById("letterTitle");
    const cardElement = document.getElementById("letterCard");
    const bodyElement = document.getElementById("letterBody");
    const signElement = document.getElementById("letterSign");

    if (!(titleElement instanceof HTMLElement)) return null;
    if (!(cardElement instanceof HTMLElement)) return null;
    if (!(bodyElement instanceof HTMLElement)) return null;
    if (!(signElement instanceof HTMLElement)) return null;

    titleElement.textContent = letter.title;
    bodyElement.replaceChildren(
      ...letter.paragraphs.map((paragraph) => {
        const paragraphElement = document.createElement("p");
        paragraphElement.textContent = paragraph;
        return paragraphElement;
      })
    );

    if (letter.sign) {
      signElement.hidden = false;
      signElement.textContent = letter.sign;
    } else {
      signElement.hidden = true;
      signElement.textContent = "";
    }

    return { cardElement };
  };

  const renderPhotoGrid = ({ photos, onPhotoClick }) => {
    const gridElement = document.getElementById("photoGrid");
    if (!(gridElement instanceof HTMLElement)) return null;

    gridElement.replaceChildren(
      ...photos.map((photo, index) => {
        const buttonElement = document.createElement("button");
        buttonElement.type = "button";
        buttonElement.className = "photo-button";
        buttonElement.dataset.photoIndex = String(index);
        buttonElement.setAttribute("aria-label", `${photo.alt}，点击预览`);

        const imgElement = document.createElement("img");
        imgElement.className = "photo-img";
        imgElement.alt = photo.alt;
        imgElement.loading = "lazy";
        imgElement.decoding = "async";
        imgElement.src = photo.src;

        buttonElement.append(imgElement);
        buttonElement.addEventListener("click", () => onPhotoClick(index));
        return buttonElement;
      })
    );

    return { gridElement };
  };

  const renderTimeline = ({ timeline }) => {
    const listElement = document.getElementById("timelineList");
    if (!(listElement instanceof HTMLElement)) return null;

    const panelElement = listElement.closest(".surprise-panel");
    if (panelElement instanceof HTMLElement) panelElement.hidden = timeline.length === 0;
    if (timeline.length === 0) {
      listElement.replaceChildren();
      return { listElement };
    }

    listElement.replaceChildren(
      ...timeline.map((item) => {
        const cardElement = document.createElement("article");
        cardElement.className = "timeline-card";
        cardElement.setAttribute("role", "listitem");

        const timeElement = document.createElement("p");
        timeElement.className = "timeline-time";
        timeElement.textContent = item.time || "";
        timeElement.hidden = !item.time;

        const titleElement = document.createElement("p");
        titleElement.className = "timeline-title";
        titleElement.textContent = item.title || "";
        titleElement.hidden = !item.title;

        const descElement = document.createElement("p");
        descElement.className = "timeline-desc";
        descElement.textContent = item.desc || "";
        descElement.hidden = !item.desc;

        cardElement.append(timeElement, titleElement, descElement);
        return cardElement;
      })
    );

    return { listElement };
  };

  const initQuotePicker = ({ quotes }) => {
    const buttonElement = document.getElementById("quoteButton");
    const textElement = document.getElementById("quoteText");
    const fromElement = document.getElementById("quoteFrom");
    if (!(buttonElement instanceof HTMLButtonElement)) return null;
    if (!(textElement instanceof HTMLElement)) return null;

    const panelElement = buttonElement.closest(".surprise-panel");
    if (panelElement instanceof HTMLElement) panelElement.hidden = quotes.length === 0;
    if (quotes.length === 0) {
      textElement.textContent = "";
      if (fromElement instanceof HTMLElement) {
        fromElement.textContent = "";
        fromElement.hidden = true;
      }
      buttonElement.disabled = true;
      return { pick: () => null };
    }

    buttonElement.disabled = false;
    buttonElement.setAttribute("aria-controls", "quoteText");

    let lastIndex = -1;

    const commitQuote = (quote) => {
      textElement.textContent = quote?.text || "";
      if (fromElement instanceof HTMLElement) {
        const from = quote?.from || "";
        fromElement.textContent = from ? `— ${from}` : "";
        fromElement.hidden = !from;
      }
    };

    const pick = () => {
      if (quotes.length === 1) {
        lastIndex = 0;
        commitQuote(quotes[0]);
        return quotes[0];
      }

      let tries = 0;
      let nextIndex = Math.floor(Math.random() * quotes.length);
      while (nextIndex === lastIndex && tries < 6) {
        tries += 1;
        nextIndex = Math.floor(Math.random() * quotes.length);
      }
      lastIndex = nextIndex;
      const next = quotes[nextIndex];
      commitQuote(next);
      return next;
    };

    buttonElement.addEventListener("click", () => {
      pick();
      try {
        textElement.scrollIntoView({ behavior: resolveScrollBehavior("smooth"), block: "nearest", inline: "nearest" });
      } catch {}
    });

    pick();
    return { pick };
  };

  const initPhotoLightbox = ({ photos }) => {
    const lightboxElement = document.getElementById("lightbox");
    const imageElement = document.getElementById("lightboxImage");
    if (!(lightboxElement instanceof HTMLElement)) return null;
    if (!(imageElement instanceof HTMLImageElement)) return null;

    const closeButton = lightboxElement.querySelector(".lightbox-close");
    const closeTriggers = Array.from(lightboxElement.querySelectorAll("[data-lightbox-close='true']"));

    let lastFocusedElement = null;
    let isOpen = false;
    let activeIndex = 0;

    const syncImage = () => {
      const photo = photos[activeIndex];
      if (!photo) return;
      imageElement.alt = photo.alt || "";
      imageElement.src = photo.src;
    };

    const onKeyDown = (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    const open = (index) => {
      if (!Number.isFinite(index)) return;
      const nextIndex = Math.min(Math.max(0, index), photos.length - 1);
      const photo = photos[nextIndex];
      if (!photo) return;

      activeIndex = nextIndex;
      lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      syncImage();
      lightboxElement.hidden = false;
      document.body.classList.add("is-lightbox-open");
      isOpen = true;
      window.addEventListener("keydown", onKeyDown);

      if (closeButton instanceof HTMLButtonElement) {
        closeButton.focus({ preventScroll: true });
      } else {
        lightboxElement.focus?.({ preventScroll: true });
      }
    };

    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      lightboxElement.hidden = true;
      document.body.classList.remove("is-lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
      imageElement.src = "";
      imageElement.alt = "";
      if (lastFocusedElement) {
        try {
          lastFocusedElement.focus({ preventScroll: true });
        } catch {}
      }
      lastFocusedElement = null;
    };

    for (const trigger of closeTriggers) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        close();
      });
    }

    imageElement.addEventListener("error", () => {
      if (!isOpen) return;
      imageElement.alt = "图片加载失败";
    });

    return { open, close };
  };

  const setLetterCollapsed = ({ cardElement, toggleButton, isCollapsed }) => {
    cardElement.dataset.collapsed = isCollapsed ? "true" : "false";
    toggleButton.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
    toggleButton.textContent = isCollapsed ? "展开全文" : "收起";
  };

  const initLetter = () => {
    const toggleButton = document.getElementById("letterToggleButton");
    const actionsElement = document.getElementById("letterActions");
    if (!(toggleButton instanceof HTMLButtonElement)) return;
    if (!(actionsElement instanceof HTMLElement)) return;

    const { letter: rawLetter } = getContentSource();
    const letter = normalizeLetter(rawLetter);
    const rendered = renderLetter(letter);
    if (!rendered) return;

    const { cardElement } = rendered;
    const isOverflowing = cardElement.scrollHeight > collapsedLetterMaxHeight + 32;
    if (!isOverflowing) {
      cardElement.dataset.collapsed = "false";
      actionsElement.hidden = true;
      toggleButton.setAttribute("aria-expanded", "true");
      return;
    }

    actionsElement.hidden = false;
    setLetterCollapsed({ cardElement, toggleButton, isCollapsed: true });

    toggleButton.addEventListener("click", () => {
      const currentlyCollapsed = cardElement.dataset.collapsed !== "false";
      setLetterCollapsed({ cardElement, toggleButton, isCollapsed: !currentlyCollapsed });
      if (currentlyCollapsed) {
        try {
          cardElement.scrollIntoView({ behavior: resolveScrollBehavior("smooth"), block: "start", inline: "nearest" });
        } catch {}
      }
    });
  };

  const getSectionById = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    return sectionElement instanceof HTMLElement ? sectionElement : null;
  };

  const getNavLinks = () => {
    const navLinks = Array.from(document.querySelectorAll(".bottom-nav .nav-item"));
    return navLinks.filter((link) => link instanceof HTMLAnchorElement);
  };

  const setActiveNav = (activeSectionId) => {
    const navLinks = getNavLinks();
    for (const link of navLinks) {
      const targetId = link.getAttribute("data-scroll");
      const isActive = targetId === activeSectionId;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  const scrollToSection = (sectionId, behavior = "smooth") => {
    const sectionElement = getSectionById(sectionId);
    if (!sectionElement) return false;

    const resolvedBehavior = resolveScrollBehavior(behavior);

    try {
      sectionElement.scrollIntoView({ behavior: resolvedBehavior, block: "start", inline: "nearest" });
      return true;
    } catch {
      try {
        const topOffset = sectionElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: topOffset, behavior: resolvedBehavior });
        return true;
      } catch {
        return false;
      }
    }
  };

  const normalizeHashToSectionId = (hashValue) => {
    if (typeof hashValue !== "string") return null;
    const raw = hashValue.startsWith("#") ? hashValue.slice(1) : hashValue;
    if (!raw) return null;
    return sectionIds.includes(raw) ? raw : null;
  };

  const updateHash = (sectionId) => {
    if (!sectionIds.includes(sectionId)) return;
    const nextHash = `#${sectionId}`;
    if (window.location.hash === nextHash) return;
    try {
      history.replaceState(null, "", nextHash);
    } catch {
      window.location.hash = nextHash;
    }
  };

  const bindNavClicks = () => {
    const navLinks = getNavLinks();
    for (const link of navLinks) {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("data-scroll");
        if (!targetId || !sectionIds.includes(targetId)) return;
        event.preventDefault();
        const didScroll = scrollToSection(targetId, "smooth");
        if (didScroll) {
          setActiveNav(targetId);
          updateHash(targetId);
        }
      });
    }

    const pageLinks = Array.from(document.querySelectorAll('a[data-scroll]:not(.bottom-nav .nav-item)'));
    for (const link of pageLinks) {
      if (!(link instanceof HTMLAnchorElement)) continue;
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("data-scroll");
        if (!targetId || !sectionIds.includes(targetId)) return;
        event.preventDefault();
        const didScroll = scrollToSection(targetId, "smooth");
        if (didScroll) {
          setActiveNav(targetId);
          updateHash(targetId);
        }
      });
    }
  };

  const initScratchCard = () => {
    const cardElement = document.getElementById("scratchCard");
    const canvasElement = document.getElementById("scratchCanvas");
    const resetButton = document.getElementById("scratchResetButton");
    if (!(cardElement instanceof HTMLElement)) return null;
    if (!(canvasElement instanceof HTMLCanvasElement)) return null;

    const panelElement = cardElement.closest(".surprise-panel");
    const context = canvasElement.getContext("2d");
    if (!context) {
      if (panelElement instanceof HTMLElement) panelElement.hidden = true;
      return null;
    }

    let isDrawing = false;
    let lastPoint = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let canvasDpr = 0;
    let lastRatioCheckAt = 0;
    let isRevealed = cardElement.classList.contains("is-revealed");

    const getLocalPoint = (event) => {
      const rect = canvasElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;

      const clientX = typeof event.clientX === "number" ? event.clientX : NaN;
      const clientY = typeof event.clientY === "number" ? event.clientY : NaN;
      if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;

      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const syncCanvasResolution = () => {
      const rect = cardElement.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      if (width < 2 || height < 2) return false;

      const didChange = width !== canvasWidth || height !== canvasHeight || dpr !== canvasDpr;
      if (!didChange) return true;

      canvasWidth = width;
      canvasHeight = height;
      canvasDpr = dpr;
      canvasElement.width = Math.max(1, Math.round(width * dpr));
      canvasElement.height = Math.max(1, Math.round(height * dpr));
      try {
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      } catch {
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
      return true;
    };

    const paintCoverLayer = () => {
      const ok = syncCanvasResolution();
      if (!ok) return false;

      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const gradient = context.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, "rgba(235, 240, 255, 0.9)");
      gradient.addColorStop(0.5, "rgba(180, 190, 230, 0.9)");
      gradient.addColorStop(1, "rgba(140, 150, 195, 0.92)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      context.fillStyle = "rgba(0, 0, 0, 0.08)";
      const maxDotCount = Math.min(160, Math.floor((canvasWidth * canvasHeight) / 900));
      for (let index = 0; index < maxDotCount; index += 1) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const radius = Math.random() * 1.8 + 0.6;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = "rgba(0, 0, 0, 0.26)";
      context.font = "700 16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("刮开这里", canvasWidth / 2, canvasHeight / 2);
      return true;
    };

    const computeErasedRatio = () => {
      try {
        const pixelWidth = canvasElement.width;
        const pixelHeight = canvasElement.height;
        if (pixelWidth <= 0 || pixelHeight <= 0) return 0;

        const imageData = context.getImageData(0, 0, pixelWidth, pixelHeight);
        const alpha = imageData.data;
        const step = Math.max(12, Math.floor(Math.min(pixelWidth, pixelHeight) / 60));
        let transparentSamples = 0;
        let sampleCount = 0;

        for (let y = 0; y < pixelHeight; y += step) {
          for (let x = 0; x < pixelWidth; x += step) {
            sampleCount += 1;
            const offset = (y * pixelWidth + x) * 4 + 3;
            if (alpha[offset] === 0) transparentSamples += 1;
          }
        }

        if (sampleCount === 0) return 0;
        return transparentSamples / sampleCount;
      } catch {
        return 0;
      }
    };

    const commitRevealed = () => {
      if (isRevealed) return;
      isRevealed = true;
      cardElement.classList.add("is-revealed");
      canvasElement.style.pointerEvents = "none";
    };

    const checkRevealed = ({ force } = { force: false }) => {
      if (isRevealed) return;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (!force && now - lastRatioCheckAt < 180) return;
      lastRatioCheckAt = now;

      const ratio = computeErasedRatio();
      if (ratio >= 0.55) commitRevealed();
    };

    const drawStroke = (fromPoint, toPoint) => {
      const brushSize = Math.max(18, Math.round(Math.min(canvasWidth, canvasHeight) * 0.12));
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = brushSize;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(fromPoint.x, fromPoint.y);
      context.lineTo(toPoint.x, toPoint.y);
      context.stroke();
      context.beginPath();
      context.arc(toPoint.x, toPoint.y, brushSize * 0.52, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const startDrawing = (event) => {
      if (isRevealed) return;
      if (typeof event.button === "number" && event.button !== 0) return;
      const localPoint = getLocalPoint(event);
      if (!localPoint) return;
      if (!syncCanvasResolution()) return;
      if (!canvasWidth || !canvasHeight) return;

      event.preventDefault();
      try {
        canvasElement.setPointerCapture(event.pointerId);
      } catch {}

      isDrawing = true;
      lastPoint = localPoint;
      drawStroke(localPoint, localPoint);
      checkRevealed({ force: false });
    };

    const continueDrawing = (event) => {
      if (!isDrawing) return;
      if (isRevealed) return;
      const localPoint = getLocalPoint(event);
      if (!localPoint || !lastPoint) return;

      event.preventDefault();
      drawStroke(lastPoint, localPoint);
      lastPoint = localPoint;
      checkRevealed({ force: false });
    };

    const stopDrawing = (event) => {
      if (!isDrawing) return;
      event.preventDefault();
      isDrawing = false;
      lastPoint = null;
      checkRevealed({ force: true });
    };

    const ensureReady = () => {
      if (!syncCanvasResolution()) return false;
      if (!isRevealed) paintCoverLayer();
      return true;
    };

    const reset = () => {
      isRevealed = false;
      cardElement.classList.remove("is-revealed");
      canvasElement.style.pointerEvents = "";
      paintCoverLayer();
    };

    canvasElement.addEventListener("pointerdown", startDrawing);
    canvasElement.addEventListener("pointermove", continueDrawing);
    canvasElement.addEventListener("pointerup", stopDrawing);
    canvasElement.addEventListener("pointercancel", stopDrawing);
    canvasElement.addEventListener("lostpointercapture", stopDrawing);

    if (resetButton instanceof HTMLButtonElement) {
      resetButton.addEventListener("click", (event) => {
        event.preventDefault();
        reset();
      });
    }

    let resizeFrame = 0;
    const scheduleEnsure = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        ensureReady();
      });
    };

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => scheduleEnsure());
      try {
        observer.observe(cardElement);
      } catch {}
      window.addEventListener(
        "beforeunload",
        () => {
          try {
            observer.disconnect();
          } catch {}
        },
        { once: true }
      );
    } else {
      window.addEventListener("resize", scheduleEnsure, { passive: true });
    }

    return { ensureReady, reset };
  };

  const initSurprise = () => {
    const revealButton = document.getElementById("revealButton");
    const surpriseContent = document.getElementById("surpriseContent");
    if (!(revealButton instanceof HTMLButtonElement)) return;
    if (!(surpriseContent instanceof HTMLElement)) return;

    let scratchCard = null;

    const reveal = () => {
      if (surpriseContent.hidden) {
        surpriseContent.hidden = false;
        revealButton.setAttribute("aria-expanded", "true");
        const focusable = surpriseContent.querySelector("a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])");
        if (focusable instanceof HTMLElement) {
          focusable.focus({ preventScroll: true });
        }
        window.requestAnimationFrame(() => {
          scratchCard = scratchCard ?? initScratchCard();
          scratchCard?.ensureReady?.();
        });
      } else {
        surpriseContent.hidden = true;
        revealButton.setAttribute("aria-expanded", "false");
        revealButton.focus({ preventScroll: true });
      }
    };

    revealButton.setAttribute("aria-controls", "surpriseContent");
    revealButton.setAttribute("aria-expanded", "false");
    revealButton.addEventListener("click", reveal);
  };

  const initSurpriseExtras = () => {
    const { timeline: rawTimeline, quotes: rawQuotes } = getContentSource();
    const timeline = normalizeTimeline(rawTimeline);
    renderTimeline({ timeline });

    const quotes = normalizeQuotes(rawQuotes);
    initQuotePicker({ quotes });
  };

  const initPhotos = () => {
    const { photos: rawPhotos } = getContentSource();
    const photos = normalizePhotos(rawPhotos);
    if (photos.length === 0) return;

    const lightbox = initPhotoLightbox({ photos });
    renderPhotoGrid({
      photos,
      onPhotoClick: (index) => {
        if (!lightbox) return;
        lightbox.open(index);
      }
    });
  };

  const pickBestActiveSectionId = () => {
    const viewportCenterY = window.scrollY + window.innerHeight * 0.45;
    let bestSectionId = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const sectionId of sectionIds) {
      const sectionElement = getSectionById(sectionId);
      if (!sectionElement) continue;
      const rect = sectionElement.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;
      const clampedY = Math.min(Math.max(viewportCenterY, sectionTop), sectionBottom);
      const distance = Math.abs(viewportCenterY - clampedY);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestSectionId = sectionId;
      }
    }

    return bestSectionId;
  };

  const initActiveTracking = () => {
    let lastActiveId = null;

    const commitActive = (sectionId) => {
      if (!sectionId || sectionId === lastActiveId) return;
      lastActiveId = sectionId;
      setActiveNav(sectionId);
      updateHash(sectionId);
    };

    const sections = sectionIds.map(getSectionById).filter(Boolean);
    if (sections.length === 0) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);
          if (visibleEntries.length === 0) return;
          visibleEntries.sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
          const topEntry = visibleEntries[0];
          const sectionElement = topEntry.target;
          const sectionId = sectionElement instanceof HTMLElement ? sectionElement.id : null;
          if (sectionId && sectionIds.includes(sectionId)) commitActive(sectionId);
        },
        { root: null, threshold: [0.25, 0.35, 0.5, 0.65], rootMargin: "-42% 0px -42% 0px" }
      );

      for (const section of sections) observer.observe(section);
      window.addEventListener(
        "beforeunload",
        () => {
          try {
            observer.disconnect();
          } catch {}
        },
        { once: true }
      );
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const best = pickBestActiveSectionId();
        if (best) commitActive(best);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  const initFromHash = () => {
    const initialSectionId = normalizeHashToSectionId(window.location.hash) ?? "welcome";
    setActiveNav(initialSectionId);

    const sectionElement = getSectionById(initialSectionId);
    if (!sectionElement) return;

    const shouldJump =
      window.location.hash &&
      normalizeHashToSectionId(window.location.hash) &&
      Math.abs(sectionElement.getBoundingClientRect().top) > 6;

    if (!shouldJump) return;

    window.requestAnimationFrame(() => {
      scrollToSection(initialSectionId, "auto");
    });
  };

  const initBgm = () => {
    const bgm = document.getElementById("bgm");
    const startBtn = document.getElementById("startBtn");
    const openLetterBtn = document.getElementById("openLetterBtn");
    
    if (!(bgm instanceof HTMLAudioElement) || !(startBtn instanceof HTMLButtonElement)) return;

    startBtn.addEventListener("click", () => {
      bgm.play().catch(() => console.log("BGM autoplay prevented"));
      startBtn.hidden = true;
      if (openLetterBtn) openLetterBtn.hidden = false;
    });
  };

  const init = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    initBgm();
    bindNavClicks();
    initLetter();
    initPhotos();
    initSurprise();
    initSurpriseExtras();
    initFromHash();
    initActiveTracking();

    window.addEventListener("hashchange", () => {
      const sectionId = normalizeHashToSectionId(window.location.hash);
      if (!sectionId) return;
      setActiveNav(sectionId);
      scrollToSection(sectionId, "smooth");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
