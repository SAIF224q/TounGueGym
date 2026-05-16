# Feature Implementation Instructions
# Guided Repetition Flow (v1)

## Context

This project is an AI-powered pronunciation practice web app called **TounGueGym**.

The current MVP already supports:
- AI-generated pronunciation practice items
- words / phrases / tongue twisters
- difficulty levels
- domain-based generation
- favorites
- one-item-at-a-time practice UI

The app is currently functioning as a content generator + viewer.

This feature upgrades the app into a:
> structured articulation training system.

---

# Objective

Implement a scientifically-informed:
# Guided Repetition Flow

The purpose is to improve pronunciation practice quality using principles from:
- speech motor learning
- articulation therapy
- fluency training research

This feature should:
- reduce cognitive overload
- encourage deliberate practice
- structure repetition correctly
- improve pronunciation retention

---

# Core Product Philosophy

The app should NOT feel like:
- a vocabulary app
- an English learning app
- a dictionary

The app SHOULD feel like:
> a focused articulation training tool.

The experience should feel:
- calm
- rhythmic
- lightweight
- intentional
- frictionless

Avoid:
- clutter
- gamification overload
- excessive UI complexity

---

# Research Principles To Implement

This feature is based on the following findings:

## 1. Chunking
Complex words are easier to pronounce when broken into smaller units.

Example:
entrepreneur
→ en • tre • pre • neur

---

## 2. Gradual Complexity
Speech practice should progress from:
- isolated units
- full pronunciation
- contextual usage

---

## 3. Overlearning
Repeating correctly multiple times improves automaticity.

---

## 4. Contextual Reinforcement
Words are retained better in phrase context.

---

## 5. Reduced Cognitive Load
Only one challenge should appear at a time.

---

# Feature Overview

Instead of:
```txt
Word → Next
```

The practice flow becomes:
```txt
Observe → Chunk → Pronounce → Context → Repeat
```

This creates a structured articulation loop.

---

# Guided Repetition Stages

# Stage 1 — Observe

Purpose:
Mental familiarization.

UI:
- show ONLY the word/phrase
- large centered typography
- no breakdown yet

Example:
```txt
Entrepreneur
```

---

# Stage 2 — Chunk

Purpose:
Reduce articulation complexity.

UI:
Show syllable chunks.

Example:
```txt
en • tre • pre • neur
```

Use the existing pronunciation breakdown data if available.

---

# Stage 3 — Pronounce

Purpose:
Practice full articulation.

UI:
Show:
- full word
- readable pronunciation breakdown
- optional IPA

Example:
```txt
Entrepreneur
on-truh-pruh-NUR
```

IPA should remain visually subtle.

---

# Stage 4 — Context

Purpose:
Reinforce pronunciation inside realistic speech context.

UI:
Show:
- phrase or sentence using the word

Example:
```txt
entrepreneurial mindset
```

If no sentence exists:
- generate a lightweight contextual phrase
OR
- gracefully skip this stage

---

# Stage 5 — Repeat

Purpose:
Overlearning and repetition volume.

UI:
Show:
```txt
Repeat 3×
```

Optional:
- pulse animation
- subtle countdown
- breathing-style pacing animation

DO NOT add audio or timers yet.

---

# Technical Requirements

# 1. Create Practice Stage System

Add reusable practice stage architecture.

Suggested file:
```bash
src/lib/practice-flow.ts
```

Example:
```ts
export const PRACTICE_STAGES = [
  "observe",
  "chunk",
  "pronounce",
  "context",
  "repeat",
] as const

export type PracticeStage =
  | "observe"
  | "chunk"
  | "pronounce"
  | "context"
  | "repeat"
```

The architecture should be reusable and extendable.

---

# 2. Update Practice Flow Logic

Current behavior likely:
```txt
Next Practice Item
```

New behavior:
```txt
Next Stage
```

After final stage:
```txt
Next Practice Item
```

The practice item should persist while stages change.

---

# 3. Update PracticeCard Component

Current component:
```bash
src/components/PracticeCard.tsx
```

Refactor to support:
- dynamic stage rendering
- stage-specific layouts
- minimal transitions

Avoid creating entirely separate components for each stage unless necessary.

---

# 4. Add Stage Progress Indicator

Add minimal progress dots.

Example:
```txt
● ○ ○ ○ ○
```

As user progresses:
```txt
● ● ○ ○ ○
```

Requirements:
- subtle
- minimal
- non-distracting

No heavy gamification visuals.

---

# 5. Add Stage Navigation

The primary button should dynamically change:
- Continue
- Next
- Start Repeating
- Next Word

depending on stage.

Keyboard support is optional for now.

---

# 6. Maintain Existing Features

Do NOT break:
- favorites
- session generation
- difficulty/domain logic
- AI generation
- localStorage persistence

This feature should integrate into existing architecture cleanly.

---

# UX Requirements

The flow should feel:
- smooth
- rhythmic
- calm
- lightweight

Avoid:
- too many buttons
- nested modals
- long instructions
- visual noise

Users should intuitively move through stages.

---

# Animation Guidelines

Animations should be:
- subtle
- smooth
- soft

Recommended:
- fade transitions
- slight upward motion
- opacity changes

Avoid:
- bouncing
- flashy effects
- arcade-style animations

Framer Motion may be used lightly.

---

# Important Constraints

DO NOT implement:
- speech recording
- pronunciation scoring
- timers
- metronome system
- speech recognition
- analytics
- achievements
- streaks

The focus is ONLY:
# improving the core practice loop.

---

# Suggested State Shape

Example:
```ts
type PracticeFlowState = {
  currentItemIndex: number
  currentStageIndex: number
}
```

---

# Suggested UX Flow

```txt
User starts session
↓
Word appears
↓
User advances through stages
↓
Repeat stage completed
↓
Next practice item begins
```

---

# Expected Outcome

After implementation, the app should feel less like:
> a flashcard viewer

and more like:
> a guided articulation training experience.

The feature should:
- improve repetition quality
- reduce overwhelm
- encourage smoother practice rhythm
- make sessions feel intentional

---

# Success Criteria

The implementation succeeds if:
- practice feels more structured
- users naturally repeat more
- sessions feel calmer and more focused
- difficult words feel easier to approach
- the app remains simple and fast

---

# Development Philosophy

Do not optimize for:
- feature quantity
- complexity
- AI gimmicks

Optimize for:
# scientifically-informed practice quality.

This feature is foundational for future systems like:
- adaptive repetition
- rhythm pacing
- spaced repetition
- speech analysis
- fluency training