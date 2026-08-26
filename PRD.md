# Chalk — answers that get drawn, not written

*Working name. Status: draft for decision. Evidence in this repo.*

## 1. Context

This is the third idea in a sequence, and the first with evidence behind it.

**Grasp** proposed generating interactive widgets and mechanically verifying them.
A one-day probe killed it: six widgets, six-for-six on first-pass arithmetic,
**zero gate activations**. The verification architecture it was built around would
have caught nothing, while every real defect was layout and framing — the part it
gated weakest. The clearest case was a recursion widget that computed perfectly
and rendered as 200px of empty canvas.

**The lesson: models are good at structure and bad at space.**

This idea is built on that lesson. The model emits structure — form, nodes, edges,
step order — and never a coordinate. Layout is code.

### What the probe proved

Five topics, one generation pass each, no tuning. All five render. Judged by eye,
not inferred:

| Topic | Form chosen | Verdict |
| --- | --- | --- |
| TCP handshake | sequence | Good |
| OAuth code flow | sequence | Good — dashed back-channel vs solid front-channel is the concept made visual |
| Hash map collisions | structure | Good |
| git rebase vs merge | comparison | Good, after one bug fix |
| Transformer block | dataflow | Best of the set |

Three findings that matter:

1. **The model picked four different forms.** It did not default to
   flowchart-for-everything, which was the expected failure.
2. **Build order teaches.** Each topic ends on a step that changes what you
   thought — why TCP's third message is not a formality, why OAuth has a code step
   at all, that rebase copies commits rather than moving them.
3. **One bug in five, and it was mine, not the model's** — comparison column titles
   were laid out but never revealed. A layout bug, found in seconds, fixed in two
   lines. Contrast with Grasp, where the defects were judgement and therefore
   unfixable.

## 2. What it is

A chat box. You ask a question. The answer is **drawn, one piece at a time, with a
line of narration per step** — and you can scrub back and forth through it.

Not a finished diagram. Napkin, Eraser, Mermaid, Excalidraw and every chatbot that
emits mermaid all hand you the final picture. **A teacher at a whiteboard never
does that.** They draw one piece, say a sentence, add the next, then circle
something and add an arrow that changes what you thought. The understanding is in
the sequence, and every existing tool throws the sequence away.

That is the entire thesis, and it is the only part worth protecting.

## 3. The discipline that stops it being slop

**Chalk must be able to say: this is not a diagram question.**

Ask it why the First World War started, or how to make carbonara, and the honest
answer is prose or nothing. Every tool that promises *ask anything, get a diagram*
produces boxes-and-arrows garbage for the majority of questions, because most
questions have no structure to draw.

So the first step of every request is a **classification, not a generation**:

| Verdict | Response |
| --- | --- |
| Has structure, fits a known form | Draw it |
| Has structure, no form fits | Say so, answer in prose |
| No structure | Say so plainly, draw nothing |

Same discipline as Grasp's two-tier design — knowing when to decline is what makes
the answers worth trusting. The difference is it costs one cheap call here instead
of three weeks of gates.

**A refusal is a feature and must be demoable.** If Chalk cannot be shown declining
a question, the classification is decorative.

## 4. Forms are a closed set

The model picks from a fixed vocabulary. **It cannot invent a form**, because every
form is a layout engine somebody has to write.

| Form | For | v1 |
| --- | --- | --- |
| sequence | protocols, handshakes, request flows | yes |
| dataflow | pipelines, architectures, model internals | yes |
| comparison | this vs that, before and after | yes |
| structure | data structures, memory layout | later |
| state | state machines, lifecycles | later |
| timeline | ordered events with duration | later |
| tree | hierarchies, recursion, parsing | later |

**v1 ships three forms and declines the rest.** Those three cover protocols,
systems and comparisons — most of what technical people actually ask about. Seven
mediocre layout engines is worse than three good ones.

## 5. Architecture

```
question
  |
classify      structural? which form? or decline
  |  decline -> prose answer, no diagram, said plainly
  |
generate      form + nodes + edges + steps, as JSON
  |
validate      schema; closed form vocabulary; no dangling
              node or edge refs; every step id must exist
  |  invalid -> one retry with the error, then decline
  |
layout        deterministic, per form, code not model
  |
render        hand-drawn stroke, stepped reveal, narration
  |
persist       permanent URL, shareable
```

**What is absent, deliberately:** no code generation, therefore **no sandbox, no
runtime repair loop, no render gate**. The model emits JSON against a schema. A
malformed answer fails validation in milliseconds instead of crashing a browser.
That deletes the three riskiest weeks of the Grasp plan and its entire security
chapter.

**Latency:** structure JSON is small. Classification plus generation should land in
single-digit seconds, with narration streaming while layout computes.

## 6. Scope

**In for v1:** chat input, classification with honest refusal, three forms, schema
validation, stepped playback with scrub, hand-drawn rendering, permanent shareable
URL per answer.

**Out of v1:** accounts, history, diagram editing, export, the other four forms,
collaboration, embedding. If the core loop is not good, none of them matter.

## 7. Distribution

Same channel as the last plan and a better fit here: **every answer gets a
permanent URL.** `/c/tcp-three-way-handshake` is a page that can rank for a query
with real volume, where the incumbent results are static prose with one diagram.

Server-rendered with the diagram's final state as a static fallback, so it is
crawlable and useful without JavaScript.

Secondary: the share button. A stepped explanation is more shareable than a
paragraph, and technical communities argue about exactly these concepts.

## 8. Staging

| Week | Ships |
| --- | --- |
| 1 | Chat shell, classification, honest refusal path. **Refusal works before generation does.** |
| 2 | Generation to schema, validation, one form end to end |
| 3 | The other two forms, layout hardening |
| 4 | Persistence, permanent URLs, SSR fallback, share |
| 5 | Streaming, latency, error states, cost ceiling |
| 6 | Polish, deploy |

Week 1 builds the refusal before the feature. If that order inverts, the refusal
never gets built — it is the part with no demo appeal and all of the integrity.

## 9. Definition of done

v1 is finished when all five can be demonstrated live:

1. Ask a protocol question, get a sequence diagram that builds.
2. Ask a comparison question, get two things side by side.
3. **Ask a non-structural question and watch it decline** — clearly, with no junk
   diagram.
4. Show a malformed generation caught by the schema, retried, then fixed or
   honestly declined.
5. Share a URL that opens the same answer for someone else.

## 10. Risks

- **R1 — Crowded space.** Napkin, Eraser, Mermaid, Excalidraw, tldraw, and every
  chatbot that emits mermaid. *Position:* they all output finished pictures. Build
  order and narration is the wedge, and it is narrow. If someone ships stepped
  reveal, the differentiation is gone.
- **R2 — Layout engines are the real work.** Three forms means three engines, each
  with edge cases the probe never hit: twenty nodes, long labels, dense edges. Most
  likely thing to eat the schedule.
- **R3 — Quality at breadth.** Five hand-picked topics says nothing about arbitrary
  questions. *Mitigation:* a golden set of fifty questions across the three forms
  plus a refusal slice, run on every prompt change.
- **R4 — Refusal rate.** Too strict feels broken, too loose draws nonsense. Needs
  tuning against real questions and is the first metric to watch.
- **R5 — Retention.** Unproven, as before. Search arrival and share are the
  acquisition hypothesis. There is no return mechanism yet, and inventing one on
  paper would repeat the last mistake.
- **R6 — Cost per answer.** Two model calls per question. Cap it, cache by
  normalised question, measure before scaling.

## 11. Open questions

1. Name. *Chalk* is a placeholder.
2. Does the hand-drawn style survive dense diagrams, or does it need to switch to
   clean strokes past a node count?
3. One model call or two? One is faster and cheaper; two are easier to tune
   separately.
4. Are answers public by default? Public compounds and is indexable, which is the
   whole distribution plan — but people will paste private architecture into the box.

## 12. The honest summary

The engineering risk is low: no sandboxing, no code execution, deterministic
layout, and a probe that already works. **The product risk is the crowd.**

Worth building if the build-order thesis is genuinely the wedge. Not worth building
as another way to get a diagram out of a prompt — that already exists, several
times over, from better-funded teams.
