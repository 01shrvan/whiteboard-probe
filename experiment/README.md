# chalk section 0 experiment

this is the pre-registered three-arm test that decides whether the product thesis survives.

## question

does synchronised construction improve transfer learning beyond the same step narration shown statically?

## arms

| arm | diagram | text |
| --- | --- | --- |
| a | static, complete | prose explanation |
| b | static, complete | the same step narrations, all at once |
| c | stepped reveal | the same narrations, synchronised to each step |

all three arms use the same underlying content and the same transfer test.

## participants

20 study codes are pre-assigned. give each person exactly one code and do not let them choose it.

- 01–07 -> arm a
- 08–14 -> arm b
- 15–20 -> arm c
- odd codes see tcp first, even codes see git first

this gives 7 / 7 / 6 participants across the three arms and counterbalances concept order.

## outcome

use transfer questions, not recall, as the primary outcome. record recall separately for diagnosis only.

score each transfer answer 0–2 using `scoring.md`, blind to arm whenever practical. the participant-level primary score is the mean of the four transfer answers.

## pre-registered decision rule

- c beats b on both concepts -> build v1
- c wins one and ties the other -> run exactly one further pair of concepts, then decide
- c ties b on both -> stop; the step layer is decoration
- neither b nor c beats a -> stop

this experiment is directional only. with 20 participants, do not claim a population effect.

## files

- `questions.json` — the two teaching concepts and transfer questions, fixed before data collection
- `test.html` — browser study runner
- `scoring.md` — transfer scoring rubric

responses are stored in the browser's local storage. press `alt+shift+o` to reveal the operator export control, then export the accumulated csv from the browser used for the study.

## privacy

collect only the study code and experiment responses. do not collect names, email, or unrelated personal data.

## analysis

compare participant-level transfer means by arm and concept. report raw scores and n per arm. keep the decision rule above fixed. if the result is mixed, use the single-extension cap rather than extending until a preferred result appears.
