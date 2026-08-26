function buildBoard(spec, host) {
  const plan = layout(spec);

  host.innerHTML = `
    <div class="board">
      <div class="board__scroll"><canvas></canvas></div>
      <div class="say"><p class="say__text"></p><p class="say__aside"></p></div>
      <div class="transport">
        <button class="t-prev">back</button>
        <button class="t-next">next</button>
        <button class="t-play">play</button>
        <span class="ticks"></span>
        <span class="counter"></span>
      </div>
    </div>`;

  const canvas = host.querySelector("canvas");
  const sayText = host.querySelector(".say__text");
  const sayAside = host.querySelector(".say__aside");
  const ticks = host.querySelector(".ticks");
  const counter = host.querySelector(".counter");

  let at = 0;
  let timer = null;

  ticks.innerHTML = spec.steps
    .map((_, i) => `<button class="tick" data-i="${i}" aria-label="step ${i + 1}"></button>`)
    .join("");

  function paint() {
    const visible = new Set(
      plan.items.filter((i) => i.kind === "column-title").map((i) => i.id),
    );
    for (let i = 0; i <= at; i++) (spec.steps[i].add || []).forEach((id) => visible.add(id));
    const emphasised = new Set(spec.steps[at].emphasise || []);

    render(canvas, plan, visible, emphasised);
    sayText.textContent = spec.steps[at].say;
    sayAside.textContent = spec.steps[at].aside || "";
    sayAside.hidden = !spec.steps[at].aside;
    counter.textContent = `${at + 1} / ${spec.steps.length}`;
    ticks.querySelectorAll(".tick").forEach((t, i) => {
      t.classList.toggle("is-on", i <= at);
      t.classList.toggle("is-at", i === at);
    });
  }

  function go(i) {
    at = Math.max(0, Math.min(spec.steps.length - 1, i));
    paint();
  }

  host.querySelector(".t-next").addEventListener("click", () => go(at + 1));
  host.querySelector(".t-prev").addEventListener("click", () => go(at - 1));
  host.querySelector(".t-play").addEventListener("click", (e) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      e.target.textContent = "play";
      return;
    }
    e.target.textContent = "pause";
    go(0);
    timer = setInterval(() => {
      if (at >= spec.steps.length - 1) {
        clearInterval(timer);
        timer = null;
        e.target.textContent = "play";
        return;
      }
      go(at + 1);
    }, 3200);
  });
  ticks.addEventListener("click", (e) => {
    const t = e.target.closest(".tick");
    if (t) go(Number(t.dataset.i));
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint);
  paint();
}
