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

    const footer = document.querySelector("#footer");
    footer.innerHTML = "Radio Poggiolo, la radio dei veri sborati.";

    let oldSong = "";

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
      if (radio.playing_next.song.text != oldSong) {
        next.innerText = (radio.playing_next.song.text + " // ").repeat(4);
        oldSong = radio.playing_next.song.text;
      }
      setTimeout(update, 5000);
    }
    update();
  }, 10);
