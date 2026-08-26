function palette() {
  const s = getComputedStyle(document.documentElement);
  const v = (n) => s.getPropertyValue(n).trim();
  return {
    ink: v("--ink"),
    ink2: v("--ink-2"),
    faint: v("--faint"),
    accent: v("--accent"),
    accentFill: v("--accent-fill"),
    paper: v("--paper"),
    warn: v("--warn"),
  };
}

function textBlock(ctx, label, cx, cy, colour, size, weight) {
  const lines = String(label).split("\n");
  ctx.fillStyle = colour;
  ctx.font = `${weight || 400} ${size || 13}px "Kalam", "Comic Sans MS", cursive`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lh = (size || 13) + 4;
  const start = cy - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, start + i * lh));
}

function arrowHead(ctx, x1, y1, x2, y2, colour) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const len = 9;
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - len * Math.cos(a - 0.4), y2 - len * Math.sin(a - 0.4));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - len * Math.cos(a + 0.4), y2 - len * Math.sin(a + 0.4));
  ctx.stroke();
}

function render(canvas, plan, visible, emphasised) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = plan.width * dpr;
  canvas.height = plan.height * dpr;
  canvas.style.width = plan.width + "px";
  canvas.style.height = plan.height + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, plan.width, plan.height);

  const rc = rough.canvas(canvas);
  const c = palette();
  const seed = 42;

  const shown = (item) =>
    visible.has(item.id) || (item.owner && visible.has(item.owner));

  plan.items.forEach((item) => {
    if (!shown(item)) return;
    const hot = emphasised.has(item.id) || (item.owner && emphasised.has(item.owner));
    const stroke = hot ? c.accent : c.ink;
    const width = hot ? 2.2 : 1.4;

    if (item.kind === "lifeline") {
      rc.line(item.x1, item.y1, item.x2, item.y2, {
        stroke: c.faint,
        strokeWidth: 1,
        strokeLineDash: [6, 8],
        seed,
      });
      return;
    }

    if (item.kind === "message" || item.kind === "message-back" || item.kind === "link") {
      const dash = item.kind === "message-back" ? [7, 5] : undefined;
      rc.line(item.x1, item.y1, item.x2, item.y2, {
        stroke,
        strokeWidth: width,
        strokeLineDash: dash,
        seed,
      });
      arrowHead(ctx, item.x1, item.y1, item.x2, item.y2, stroke);
      if (item.label) {
        const mx = (item.x1 + item.x2) / 2;
        const my = (item.y1 + item.y2) / 2;
        const w = ctx.measureText(item.label).width;
        ctx.fillStyle = c.paper;
        ctx.fillRect(mx - w / 2 - 6, my - 20, w + 12, 17);
        textBlock(ctx, item.label, mx, my - 12, hot ? c.accent : c.ink2, 12);
      }
      return;
    }

    if (item.kind === "skip") {
      rc.path(
        `M ${item.x1} ${item.y1} C ${item.bend} ${item.y1}, ${item.bend} ${item.y2}, ${item.x2} ${item.y2}`,
        { stroke: hot ? c.accent : c.ink2, strokeWidth: hot ? 2.4 : 1.4, seed },
      );
      arrowHead(ctx, item.bend, item.y2, item.x2, item.y2, hot ? c.accent : c.ink2);
      if (item.label) textBlock(ctx, item.label, item.bend + 4, (item.y1 + item.y2) / 2, hot ? c.accent : c.faint, 12);
      return;
    }

    if (item.kind === "column-title") {
      textBlock(ctx, item.label, item.x + item.w / 2, item.y + item.h / 2, c.ink2, 15, 700);
      return;
    }

    const fill = hot ? c.accentFill : undefined;
    if (item.kind === "commit" || item.kind === "merge" || item.kind === "rewritten" || item.kind === "add") {
      rc.circle(item.x + item.w / 2, item.y + item.h / 2, item.w, {
        stroke: item.kind === "rewritten" ? c.accent : stroke,
        strokeWidth: width,
        fill,
        fillStyle: "solid",
        seed,
      });
    } else {
      rc.rectangle(item.x, item.y, item.w, item.h, {
        stroke,
        strokeWidth: width,
        fill,
        fillStyle: "solid",
        roughness: 1.4,
        seed,
      });
    }
    textBlock(ctx, item.label, item.x + item.w / 2, item.y + item.h / 2, hot ? c.accent : c.ink, item.kind === "add" ? 18 : 13);
  });
}
