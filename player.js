window.onload = () =>
  setTimeout(() => {
    const css = `
@keyframes marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}`;
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;

    const head = document.querySelector("head");
    head.appendChild(style);

    const card = document.querySelector(".card");
    card.style.opacity = 0.97;

    const cardBody = document.querySelector(".card-body");
    const nowplaying = document.querySelector(".nowplaying");

    const title = document.querySelector(".card-title");
    title.style.marginBottom = 0;
    title.style.flex = 1.4;
    cardBody.removeChild(title);

    const header = document.createElement("div");
    header.style.display = "flex";
    header.appendChild(title);

    const nextLabelText = document.createElement("span");
    nextLabelText.innerText = "Next: ";
    nextLabelText.style.marginRight = "0.4rem";
    header.appendChild(nextLabelText);

    const next = document.createElement("span");
    next.style.whiteSpace = "nowrap";
    next.style.overflow = "hidden";
    next.style.display = "inline-block";
    next.style.animation = "marquee 15s linear infinite";

    const nextWrapper = document.createElement("div");
    nextWrapper.style.flex = 1;
    nextWrapper.style.overflow = "hidden";

    nextWrapper.appendChild(next);
    header.appendChild(nextWrapper);

    const listeners = document.createElement("div");
    listeners.style.marginBottom = "1rem";

    cardBody.insertBefore(header, nowplaying);
    cardBody.insertBefore(listeners, nowplaying);

    const footerLinks = document.createElement("div");
    footerLinks.style.padding = "1rem";
    footerLinks.style.paddingTop = "0.6rem";
    footerLinks.innerHTML = `Inviaci i tuoi messaggi vocali sborati 
    <a target=\"_blank\" href=\"https://t.me/poggiolo_bot\">
    @poggiolo_bot
    </a>
    <br/>
    Vota e discuti nuove proposte musicali
    <a target=\"_blank\" href=\"https://t.me/poggiolofm\">
    @poggiolofm
    </a>`;
    card.appendChild(footerLinks);

    let previousImgSong = "";
    async function update() {
      const data = await fetch("/api/frontend/dashboard/stations", {
        headers: {
          Accept: "application/json",
          "X-Api-Key": "5bceaf91cadc091c:6a1f7489e5e678e0139afb9d3d08d1d6",
        },
      }).then((res) => res.json());
      const radio = data.find(
        (element) => element.station.public_player_url == window.location.href
      );
      listeners.innerText = `Sborati in ascolto: ${radio.listeners.total}`;
      if (radio.playing_next.song.text != previousImgSong) {
        next.innerText = (radio.playing_next.song.text + " // ").repeat(4);
        previousImgSong = radio.playing_next.song.text;
      }
      setTimeout(update, 5000);
    }
    update();

    async function backgrounds() {
      const baseUrl = "https://poggiolo.github.io/radio/backgrounds";
      const imageUrls = await fetch(`${baseUrl}/index.txt`)
        .then((res) => res.text())
        .then((index) => index.trim().split("\n"));

      const body = document.querySelector("body");

      const footer = document.querySelector("#footer");
      footer.innerHTML = "Radio Poggiolo, la radio dei veri sborati.";

      const images = [];

      for (const imageUrl of imageUrls) {
        const author = imageUrl.split("/")[0];
        const img = document.createElement("img");
        img.src = `${baseUrl}/${imageUrl}`;
        img.style.position = "absolute";
        img.style.top = 0;
        img.style.left = 0;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.zIndex = -1;
        img.style.transition = "opacity 0.2s";
        img.style.opacity = 0;
        body.appendChild(img);
        images.push([img, author]);
      }

      const interval = 15 * 60 * 1000;

      let previousImg = null;
      function updateBackground() {
        const index = Math.round(Date.now() / interval) % images.length;
        const [img, author] = images[index];
        img.style.opacity = 1;
        if (previousImg != null) {
          previousImg.style.opacity = 0;
        }
        previousImg = img;

        footer.innerHTML = `Radio Poggiolo, la radio dei veri sborati.<br>Sfondo by ${author}`;
        setTimeout(updateBackground, interval);
      }

      updateBackground();
    }

    backgrounds();
  }, 10);
