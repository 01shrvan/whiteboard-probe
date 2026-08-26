# whiteboard-probe

Second probe. The first one (grasp-probe) killed a plan by testing its core
assumption in a few hours instead of six weeks. Same method here.

## The idea being tested

Every AI diagram tool — Napkin, Eraser, Mermaid, Excalidraw, tldraw — hands you
a **finished** diagram.

A teacher at a whiteboard does not do that. They draw one piece, say a sentence,
add the next piece, then circle something and add an arrow that changes what you
thought. **The understanding is in the sequence, and every existing tool throws
the sequence away.**

## Why this survives what killed the last probe

grasp-probe died because the model had to make layout decisions and made bad
ones — the recursion widget rendered as 200px of empty canvas.

Here the model never touches layout. It emits **structure**: form, nodes, edges,
and step order. A layout engine computes every coordinate deterministically.

Two consequences:

- **No code generation, so no sandbox.** The model emits JSON against a schema.
  That deletes the entire security chapter and the runtime repair loop.
- **A malformed diagram fails schema validation**, not at runtime.

## The assumption under test

> Given a topic, can a model pick the **right diagram form** and a **build order
> that teaches**?

Not "can it draw boxes". It can. The question is whether it chooses a sequence
diagram over a flowchart when the topic is a protocol, and whether step 3 lands
before step 4 for a reason.

## Method

Five topics, deliberately spanning different natural forms so a model defaulting
to flowchart-for-everything is exposed:

| Topic | Form it should choose |
| --- | --- |
| TCP three-way handshake | sequence |
| OAuth authorization code flow | sequence, more actors |
| Hash map collision resolution | data structure |
| git rebase vs merge | side-by-side comparison |
| Transformer block wiring | dataflow |

One generation pass per topic. No tuning. Layout by engine, rendering hand-drawn.

## Judging

Not "does it render". It will render.

1. Is the **form** right for the concept?
2. Does the **order** teach, or is it just topological?
3. Is there a step that **changes what you thought** — the whiteboard move?

## Running

```
npm install
npm run dev
```
