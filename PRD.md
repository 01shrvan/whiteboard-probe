# Chalk — answers that get drawn, not written

*Working name. Status: draft for decision. Evidence in this repo.*

## 0. Step zero — the experiment that gates everything

**The central claim of this document is unproven, and it is the same kind of
unearned claim this series has killed twice.**

The claim is *build order teaches*. The evidence is five examples that look
pedagogically meaningful — written by the same model whose output is being
judged, and found convincing by the person who wrote them. That is not evidence.
It is exactly the error the Grasp review caught as "library equals retention",
committed again in a new costume.

**So it gets tested before anything is built.**

### The design, three arms not two

A two-arm test — static diagram plus prose against stepped diagram plus narration
— varies two things at once. If the stepped arm wins, you cannot tell whether
construction helped or whether short per-step captions are simply better writing
than a paragraph. You would conclude "construction teaches" when the finding might
be "captions beat prose".

| Arm | Diagram | Text |
| --- | --- | --- |
| A | static, complete | prose explanation |
| B | static, complete | the same step narrations, shown all at once |
| C | stepped reveal | same narrations, synchronised to each step |

Same content in all three. Same test afterwards, written before the arms are built
so it cannot be tuned to flatter one.

### What gets measured

**Transfer questions, not recall.** "What happens if the second message is removed"
tests a mental model. "What did you see in step three" tests memory of an
animation, which arm C would win for reasons that have nothing to do with
understanding. Recall answers are collected but are not the outcome.

This also blunts the **novelty confound** — arm C is inherently more engaging, and
some of any advantage will be attention rather than comprehension. A transfer
question is harder to answer from attention alone. It does not eliminate the
confound; nothing cheap does. It is named here so the result is not read as
cleaner than it is.

### The decision rule, fixed in advance

Written before any data exists, because the mixed result is where rationalisation
lives.

| Result | Meaning | Action |
| --- | --- | --- |
| C beats B on **both** concepts | Construction is doing real work | Build v1 |
| Mixed — C wins one, ties the other | Inconclusive | **One** further pair of concepts, then decide. No third extension. |
| C ties B on both | The narration was doing the work | The step layer is decoration. Do not build. |
| Neither B nor C beats A | Nothing helped | Stop. |

The single-extension cap is the important line. "Run more concepts" is otherwise
an unbounded escape hatch that terminates exactly when the desired answer appears.

### What the result can and cannot say

Twenty people across three arms is **six or seven per condition**. That is a
directional signal, not a population effect.

A pass therefore licences: *promising enough to justify building v1.*
It does not licence: *construction improves learning.* The second claim needs an
order of magnitude more people, and this document should never make it.

Days, not weeks. Everything below is contingent on it.

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
2. **Build order *appears* to teach.** Each topic ends on a step that changes
   what you thought — why TCP's third message is not a formality, why OAuth has a
   code step at all, that rebase copies commits rather than moving them. Whether
   a reader actually understands more because of the sequence is untested, and is
   the subject of section 0.
3. **One bug in five, and it was mine, not the model's** — comparison column titles
   were laid out but never revealed. Found in seconds, fixed in two lines.
   *Do not over-read this.* n=5 says deterministic layout makes some failures
   easier to debug. It does not establish that layout defects are generally easier
   than semantic ones, which is a much larger claim.

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

**The headline metric is appropriate-form accuracy, not refusal rate.** A wrong
refusal is as damaging as a wrong diagram — "how does OAuth work" answered in prose
is a broken product. Measuring only refusals metrics one direction of a two-sided
error. Classification, not generation, is where this product will feel intelligent
or stupid.

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

**v1 ships three forms and declines the rest.** Not because three provably cover
most questions — nothing here establishes that, and the golden set exists to find
out. Three is the smallest surface that can test the thesis without turning the
project into a layout-engine factory. Seven mediocre engines is worse than three
good ones.

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

**Out of v1:** accounts, history, export, the other four forms, collaboration,
embedding. If the core loop is not good, none of them matter.

**Permanently out, at any version: custom drawing tools.** The moment a user can
drag a node, Chalk is a worse Excalidraw. The product draws the explanation *for*
you; it is not a canvas you operate. Expect this request constantly and refuse it
every time — it is the single most plausible way this becomes a generic whiteboard.

## 7. Distribution

Same channel as the last plan and a better fit here: **every answer gets a
permanent URL.** `/c/tcp-three-way-handshake` is a page that can rank for a query
with real volume, where the incumbent results are static prose with one diagram.

**The static fallback must be genuinely useful on its own**, not a screenshot with
a "load the interactive version" button. Against Wikipedia, Cloudflare, MDN,
GeeksforGeeks and Stack Overflow, a page whose only content is an image ranks
nowhere. Server-rendered, it carries: the question as a title, a short prose
answer, every step narration as readable text, the diagram in its final state, and
the closing takeaway. The stepped reveal is then an *enhancement* on a page that
already stands up — which is also what makes it accessible.

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

Ranked by what they actually prove, because they are not equal.

**Thesis-level — these decide whether Chalk is worth existing:**

1. **Construction beats narration alone** — arm C outperforms arm B in section 0.
2. **Ask a non-structural question and watch it decline**, clearly, with no junk
   diagram. And ask a structural one and watch it *not* wrongly decline.

**Product-level:**

3. Ask a protocol question, get a sequence diagram that builds.
4. Ask a comparison question, get two things side by side, correctly labelled.
5. Share a URL that opens the same answer for someone else, and reads correctly
   with JavaScript disabled.

**Engineering hygiene — necessary, but proves nothing about the idea:**

6. A malformed generation is caught by the schema, retried, then fixed or honestly
   declined.

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
  plus a refusal slice, run on every prompt change. **Schema validity is not
  quality** — a response can have valid nodes, valid edges and no dangling
  references while asserting a wrong causal relationship, ordering steps
  confusingly, or emphasising the wrong thing. So each golden answer carries human
  labels: form appropriate, ordering meaningful, no misleading relationship,
  narration matches the visual change, final state coherent. Not to gate every
  generation forever, but because labelled failures are the only way to learn what
  the model is bad at.
- **R4 — Classification quality.** A two-sided error, not a refusal rate. Drawing
  something unstructured and refusing something drawable damage trust equally, and
  "how does OAuth work" answered in prose is as broken as a flowchart about
  carbonara. Tracked as a full confusion matrix over the golden set — false
  positives, false negatives, and appropriate-form accuracy when a diagram *is*
  warranted but the wrong form is chosen. First dashboard metric once the golden
  set exists.
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

## 12. The four invariants

Compromise on any of these and Chalk becomes the thing it exists to avoid.

1. **The model never controls geometry.** Structure only. No x, y, width, height
   or path data in the schema, ever.
2. **Classification happens before generation.** No question reaches the renderer
   without first being judged drawable.
3. **Construction is the explanation**, not an animated final diagram. If the
   whole thing could be revealed at once with no loss, the step layer is decoration.
4. **Narration and visual change are synchronised.** When the text says the client
   sends the code, the code arrow appears on *that* step. Otherwise these are
   slides with a transition.

## 13. The honest summary

Engineering risk is low: no sandboxing, no code execution, deterministic layout, a
probe that already works. **The product risk is the crowd**, and the thesis risk is
section 0.

**Chalk is probably a feature, not a company** — and that is the stated position
rather than a buried risk. A chatbot can add "show me visually" and generate a
sequence. What it cannot trivially copy is a system that knows when *not* to draw,
and a construction order designed around the hypothesis that sequence can teach
rather than merely render.

That hypothesis is unproven. Section 0 exists to prove or kill it, and until it
returns, this paragraph is a bet and not a claim.

That may not be a business. It is a good product, and a very good thing to have
built. Given the alternative was six weeks of verification machinery that its own
probe showed would never fire, that is the right trade.

One correction to the comparison with Grasp: Grasp scored higher on defensibility
because of its verification infrastructure. That infrastructure was measured, in
this repo, firing **zero times across six widgets**. A moat around a gate that
never triggers is not a moat. Chalk's low defensibility score is honest; Grasp's
higher one never was.
