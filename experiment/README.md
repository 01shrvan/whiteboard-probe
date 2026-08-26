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

## outcome

use transfer questions, not recall, as the primary outcome. record recall separately for diagnosis only.

## pre-registered decision rule

- c beats b on both concepts -> build v1
- c wins one and ties the other -> run exactly one further pair of concepts, then decide
- c ties b on both -> stop; the step layer is decoration
- neither b nor c beats a -> stop

this experiment is directional only. with 20 participants, do not claim a population effect.

## files

- `questions.json` — the two teaching concepts, fixed before participants see any data
- `test.html` — local study runner
- `results.csv` — append one row per completed participant

## privacy

collect only a participant id and experiment responses. do not collect names, email, or unrelated personal data.

## analysis

compare transfer scores by arm and concept. keep the decision rule above fixed. if the result is mixed, use the single-extension cap rather than extending until a preferred result appears.
