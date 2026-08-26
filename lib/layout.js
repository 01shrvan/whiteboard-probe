const NODE_W = 132;
const NODE_H = 44;
const PAD = 40;

function sequence(spec) {
  const laneGap = 190;
  const headY = 44;
  const firstMsg = 118;
  const msgGap = 66;
  const items = [];
  const laneX = spec.lanes.map((_, i) => PAD + 70 + i * laneGap);

  spec.nodes.forEach((n) => {
    items.push({
      id: n.id,
      kind: "actor",
      label: n.label,
      x: laneX[n.lane] - NODE_W / 2,
      y: headY - NODE_H / 2,
      w: NODE_W,
      h: NODE_H,
    });
  });

  const bottom = firstMsg + spec.edges.length * msgGap + 20;
  spec.nodes.forEach((n) => {
    items.push({
      id: n.id + "__life",
      kind: "lifeline",
      owner: n.id,
      x1: laneX[n.lane],
      y1: headY + NODE_H / 2,
      x2: laneX[n.lane],
      y2: bottom,
    });
  });

  spec.edges.forEach((e, i) => {
    const from = spec.nodes.find((n) => n.id === e.from);
    const to = spec.nodes.find((n) => n.id === e.to);
    const y = firstMsg + i * msgGap;
    items.push({
      id: e.id,
      kind: e.kind === "back" ? "message-back" : "message",
      label: e.label,
      x1: laneX[from.lane],
      y1: y,
      x2: laneX[to.lane],
      y2: y,
    });
  });

  return { items, width: PAD * 2 + 70 + (spec.lanes.length - 1) * laneGap + 70, height: bottom + PAD };
}

function structure(spec) {
  const slotW = 74;
  const slotH = 52;
  const top = 70;
  const items = [];
  const arr = spec.nodes.find((n) => n.kind === "array");
  const left = PAD;

  for (let i = 0; i < spec.slots; i++) {
    items.push({
      id: arr.id + "__slot" + i,
      owner: arr.id,
      kind: "slot",
      label: String(i),
      x: left + i * slotW,
      y: top,
      w: slotW,
      h: slotH,
    });
  }

  const perSlot = {};
  spec.nodes
    .filter((n) => n.kind === "entry")
    .forEach((n) => {
      const depth = perSlot[n.slot] || 0;
      perSlot[n.slot] = depth + 1;
      items.push({
        id: n.id,
        kind: "entry",
        label: n.label,
        x: left + n.slot * slotW - 22,
        y: top + slotH + 34 + depth * 62,
        w: slotW + 44,
        h: 42,
      });
    });

  (spec.edges || []).forEach((e) => {
    const a = items.find((i) => i.id === e.from);
    const b = items.find((i) => i.id === e.to);
    if (!a || !b) return;
    items.push({
      id: e.id,
      kind: "message",
      label: e.label,
      x1: a.x + a.w / 2,
      y1: a.y + a.h,
      x2: b.x + b.w / 2,
      y2: b.y,
    });
  });

  const maxDepth = Math.max(1, ...Object.values(perSlot));
  return { items, width: left * 2 + spec.slots * slotW, height: top + slotH + 34 + maxDepth * 62 + PAD };
}

function comparison(spec) {
  const colW = 340;
  const rowH = 84;
  const top = 78;
  const items = [];

  spec.columns.forEach((c, i) => {
    items.push({
      id: "__col" + i,
      kind: "column-title",
      label: c,
      x: PAD + i * colW,
      y: 30,
      w: colW - 40,
      h: 30,
    });
  });

  spec.nodes.forEach((n) => {
    const trackX = PAD + n.col * colW + 60 + (n.track || 0) * 120;
    items.push({
      id: n.id,
      kind: n.kind === "merge" ? "merge" : n.kind === "rewritten" ? "rewritten" : "commit",
      label: n.label,
      x: trackX,
      y: top + n.row * rowH,
      w: 52,
      h: 52,
    });
  });

  spec.edges.forEach((e) => {
    const a = items.find((i) => i.id === e.from);
    const b = items.find((i) => i.id === e.to);
    items.push({
      id: e.id,
      kind: "link",
      x1: a.x + a.w / 2,
      y1: a.y + a.h,
      x2: b.x + b.w / 2,
      y2: b.y,
    });
  });

  const maxRow = Math.max(...spec.nodes.map((n) => n.row));
  return { items, width: PAD * 2 + spec.columns.length * colW, height: top + (maxRow + 1) * rowH + PAD };
}

function dataflow(spec) {
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: "TB", nodesep: 46, ranksep: 46, marginx: PAD, marginy: PAD });
  g.setDefaultEdgeLabel(() => ({}));

  spec.nodes.forEach((n) => {
    const lines = n.label.split("\n");
    g.setNode(n.id, { width: n.kind === "add" ? 40 : 160, height: n.kind === "add" ? 40 : 30 + lines.length * 18 });
  });
  spec.edges.forEach((e) => {
    if (e.kind === "skip") return;
    g.setEdge(e.from, e.to, {}, e.id);
  });

  dagre.layout(g);

  const items = [];
  spec.nodes.forEach((n) => {
    const p = g.node(n.id);
    items.push({
      id: n.id,
      kind: n.kind,
      label: n.label,
      x: p.x - p.width / 2,
      y: p.y - p.height / 2,
      w: p.width,
      h: p.height,
    });
  });

  spec.edges.forEach((e) => {
    const a = items.find((i) => i.id === e.from);
    const b = items.find((i) => i.id === e.to);
    if (!a || !b) return;
    if (e.kind === "skip") {
      const offset = Math.max(a.x, b.x) + Math.max(a.w, b.w) / 2 + 96;
      items.push({
        id: e.id,
        kind: "skip",
        label: e.label,
        x1: a.x + a.w / 2,
        y1: a.y + a.h / 2,
        x2: b.x + b.w / 2,
        y2: b.y + b.h / 2,
        bend: offset,
      });
    } else {
      items.push({
        id: e.id,
        kind: "link",
        label: e.label,
        x1: a.x + a.w / 2,
        y1: a.y + a.h,
        x2: b.x + b.w / 2,
        y2: b.y,
      });
    }
  });

  const gr = g.graph();
  return { items, width: gr.width + 200, height: gr.height + PAD };
}

const engines = { sequence, structure, comparison, dataflow };

function layout(spec) {
  const engine = engines[spec.form];
  if (!engine) throw new Error("no layout engine for form: " + spec.form);
  return engine(spec);
}
