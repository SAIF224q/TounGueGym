# Feature 2 Implementation Instructions
# Smart Revisit System (Adaptive Repetition v1)

## Context

TounGueGym already supports:
- AI-generated pronunciation practice
- guided repetition flow
- pronunciation breakdowns
- domains and difficulty modes
- favorites
- session-based practice

The app now needs:
# memory and adaptive reinforcement.

This feature introduces:
> scientifically-informed repetition scheduling.

The goal is to help users retain pronunciation fluency over time through adaptive resurfacing of difficult words.

---

# Objective

Implement a:
# Smart Revisit System

The system should:
- remember difficult words
- adapt future sessions
- prioritize weak items
- reinforce pronunciation memory
- create progressive improvement over multiple days

This feature is based on:
- spaced repetition
- deliberate practice
- overlearning
- motor memory consolidation

---

# Product Philosophy

The app should evolve from:
> a pronunciation content generator

into:
> a progressive articulation training system.

The experience should feel:
- intelligent
- lightweight
- non-judgmental
- adaptive
- calm

Avoid:
- gamification overload
- aggressive scoring
- complicated analytics

---

# Research Principles Being Implemented

## 1. Spaced Repetition
Words should reappear over time based on difficulty.

---

## 2. Deliberate Practice
Users improve faster when focusing on weak areas.

---

## 3. Overlearning
Even partially mastered words should occasionally return.

---

## 4. Motor Memory Consolidation
Repeated exposure strengthens pronunciation automaticity.

---

# Feature Overview

At the end of each practice item, users rate difficulty:

```txt
How did this feel?

🙂 Easy
😐 Tricky
☠️ Difficult
```

The app stores:
- difficulty feedback
- repetition count
- last practiced timestamp

Future sessions should:
- prioritize difficult words
- occasionally revisit medium items
- gradually reduce easy-item frequency

---

# UX Requirements

The experience should feel:
- lightweight
- natural
- low-pressure

The user should feel:
> “the app remembers what I struggle with.”

Avoid:
- percentages
- grades
- failure language

Use supportive wording.

---

# Difficulty Feedback UI

## Suggested Labels

### Easy
User pronounced comfortably.

### Tricky
Minor struggle or hesitation.

### Difficult
Strong articulation difficulty.

---

# Recommended Visual Style

Minimal segmented buttons.

Example:
```txt
🙂 Easy
😐 Tricky
☠️ Difficult
```

Do NOT:
- use red error colors
- show failure warnings
- create stressful UX

---

# Data Model

# Create Adaptive Practice Record

Suggested type:

```ts
type PracticeHistoryRecord = {
  itemId: string
  rating: "easy" | "tricky" | "difficult"
  repetitionCount: number
  lastPracticedAt: number
  nextReviewAt?: number
}
```

---

# Storage Requirements

Use:
```txt
localStorage
```

Suggested key:
```txt
practice_history
```

---

# Scheduling Logic (v1)

Keep logic intentionally simple.

---

# Easy

Behavior:
- reduce appearance frequency
- occasionally revisit

Suggested:
- revisit after several sessions

---

# Tricky

Behavior:
- moderate resurfacing

Suggested:
- revisit within upcoming sessions

---

# Difficult

Behavior:
- aggressive reinforcement

Suggested:
- reappear sooner and more frequently

---

# IMPORTANT

Do NOT implement complex spaced repetition algorithms yet.

No:
- Anki-style interval math
- SM-2 algorithms
- machine learning scheduling

Simple logic is preferred for v1.

---

# Suggested Simple Logic

Example pseudocode:

```ts
if rating === "difficult":
  priority += 3

if rating === "tricky":
  priority += 2

if rating === "easy":
  priority += 1
```

Then:
- sort practice items by priority
- mix old + new items

---

# Session Composition Strategy

Future sessions should combine:
- new generated words
- resurfaced difficult items

Example:
```txt
70% new items
30% revisit items
```

This ratio can be adjusted later.

---

# Suggested Flow

```txt
Practice item completed
↓
User rates difficulty
↓
Store history
↓
Future sessions prioritize weak items
```

---

# Technical Requirements

# 1. Create Repetition Engine

Suggested file:
```bash
src/lib/repetition-engine.ts
```

Responsibilities:
- store ratings
- calculate revisit priority
- select revisit candidates
- merge revisit items into sessions

---

# 2. Update Zustand Store

File:
```bash
src/store/usePracticeStore.ts
```

Add:
- practice history state
- rating actions
- revisit item retrieval

---

# 3. Add Rating Step To Practice Flow

After:
```txt
Repeat Stage
```

Add:
```txt
Difficulty Rating Step
```

The flow becomes:

```txt
Observe
↓
Chunk
↓
Pronounce
↓
Context
↓
Repeat
↓
Rate Difficulty
↓
Next Item
```

---

# 4. Update Session Generation

When generating new sessions:
- fetch revisit candidates
- merge with new AI-generated items

Avoid duplicates.

---

# 5. Preserve Existing Features

Do NOT break:
- favorites
- AI generation
- guided repetition flow
- localStorage hydration
- session summary

---

# Suggested Folder Changes

```bash
src/
├── lib/
│   ├── repetition-engine.ts
│   └── spaced-repetition.ts (optional)
```

---

# Suggested Helper Functions

```ts
ratePracticeItem()
getRevisitCandidates()
mergeSessionItems()
calculatePriority()
```

---

# Recommended Initial Priority Logic

## Difficult
High priority.

## Tricky
Medium priority.

## Easy
Low priority.

This is enough for v1.

---

# Future-Ready Architecture

The system should be extendable for:
- true spaced repetition intervals
- adaptive AI generation
- pattern-level difficulty tracking
- sound-cluster analysis
- fluency analytics

Do NOT implement those yet.

---

# Important UX Principle

The app should feel:
> supportive, not evaluative.

Avoid:
- “wrong”
- “bad”
- “failed pronunciation”

Prefer:
- difficult
- tricky
- needs more practice

---

# Animation Guidance

Transitions should remain:
- subtle
- smooth
- lightweight

Optional:
- soft fade after rating selection
- slight button scaling

Avoid:
- confetti
- XP explosions
- loud achievement systems

---

# Expected Outcome

After implementation:
- the app remembers user difficulty
- sessions become personalized
- difficult words return intelligently
- users feel progressive improvement

The app should begin feeling:
> adaptive and intentional.

---

# Success Criteria

This feature succeeds if:
- users naturally revisit difficult words
- sessions feel increasingly personalized
- practice no longer feels random
- users perceive long-term improvement
- the app remains simple and calming

---

# Development Philosophy

Optimize for:
# effective articulation training.

Not:
- feature quantity
- gamification
- flashy AI tricks

Every interaction should support:
- smoother speech
- deliberate repetition
- long-term fluency improvement

This system is foundational for future features like:
- adaptive sound-pattern training
- rhythm pacing
- speech analysis
- fluency diagnostics
- personalized articulation plans