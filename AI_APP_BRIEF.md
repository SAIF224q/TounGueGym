# AI App Brief: Pronunciation Practice MVP

## Product Summary

This app is a minimal AI-powered pronunciation practice web app. It helps users practice difficult words, phrases, and speech patterns so they can speak more clearly and stumble less during fast speech.

The app is a focused articulation training tool, not an English course, dictionary, grammar tutor, or vocabulary-learning app.

## Core User Problem

Users want to practice pronunciation consistently, but the biggest friction is finding the right words and phrases to practice.

The app solves this by using AI to generate pronunciation-heavy practice material based on mode, difficulty, and domain.

## MVP Scope

Build the MVP around these capabilities:

- Generate pronunciation practice content with AI.
- Practice one word, phrase, or tongue twister at a time.
- Show a readable pronunciation breakdown for each item.
- Let users choose mode, difficulty, and domain/category.
- Support quick sessions to reduce decision fatigue.
- Let users favorite difficult items and revisit them later.
- Store MVP data in `localStorage`.

## Explicit Non-Goals

Do not build these for the MVP:

- Authentication.
- Backend database.
- Social features.
- Leaderboards.
- Microphone recording.
- Speech analysis.
- Pronunciation scoring or grading.
- AI audio feedback.
- Real-time AI pronunciation correction.

## Target Users

The app is for people who want clearer pronunciation and smoother speaking, especially:

- People who stumble while speaking fast.
- Public speakers.
- Interview preparation users.
- Creators and presenters.
- Language learners focused on articulation.
- Users practicing difficult words or speech clarity.


## Main Practice Modes

The app supports three MVP modes:

- `word`: single difficult words.
- `phrase`: pronunciation-heavy phrases.
- `tongue_twister`: generated tongue twisters.

Examples:

- Word: `entrepreneur`, `regularly`, `statistical`.
- Phrase: `specific statistical system`, `rural railway route`.
- Tongue twister: `Strategic street strikers stretch strongly.`

## Difficulty Levels

- `easy`: simple but slightly tricky words, such as `comfortable`, `breakfast`, `probably`.
- `medium`: longer multi-syllable words, such as `regularly`, `interpretation`, `communication`.
- `hard`: complex transitions, such as `entrepreneurial`, `statistical`, `extraordinarily`.

## Domain-Based Practice

Users can choose a domain so AI generates relevant words or phrases.

Default domains:

- Everyday Conversation.
- Medical.
- Technology.
- Business.
- Academic.
- Public Speaking.

Users should also be able to enter a custom domain, such as `digital marketing`.

## Practice Experience

The core UI should show only one practice item at a time.

Each item should include:

- Main text.
- Readable pronunciation breakdown.
- Optional IPA notation.
- Optional example sentence.

Main controls:

- Next.
- Previous.
- Repeat.
- Shuffle.
- Favorite.

Readable pronunciation breakdown is more important than IPA. IPA should be secondary and visually subtle if used.

## Routes

- `/`: landing/start page with mode, domain, difficulty, and quick session entry points.
- `/practice`: main one-item-at-a-time practice interface.
- `/favorites`: saved words, phrases, and tongue twisters.

## Core Components

Expected components:

- `PracticeCard`: displays text, pronunciation breakdown, optional IPA, and optional sentence.
- `ControlsBar`: next, previous, repeat, favorite, and shuffle controls.
- `DomainSelector`: default domains and custom domain input.
- `DifficultySelector`: easy, medium, hard.
- `ModeSelector`: words, phrases, tongue twisters.
- `SessionSetupModal`: quick session settings.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Zustand or React Context for state.
- `localStorage` for MVP persistence.
- OpenAI API for generation.
- Vercel deployment.

## Data Model

Use this core type as the source of truth:

```ts
type PracticeItem = {
  id: string
  text: string
  breakdown: string
  ipa?: string
  mode: "word" | "phrase" | "tongue_twister"
  domain: string
  difficulty: "easy" | "medium" | "hard"
}
```

Useful `localStorage` keys:

```ts
favorites
recent_sessions
settings
```

## AI Generation Requirements

AI should generate content based on:

- Selected mode.
- Selected domain.
- Selected difficulty.

Each generated item should include:

- `text` or `word`.
- `breakdown`.
- Optional `ipa`.
- Optional `sentence`.

AI output should be valid JSON only.

Generation should prioritize words and phrases commonly spoken in real life. Avoid obscure dictionary-only vocabulary.

## Suggested AI Prompt Shape

```txt
You are generating pronunciation practice material.

Requirements:
- Generate content that is difficult to pronounce.
- Match the requested domain.
- Match the requested difficulty.
- Match the requested mode.
- Include readable pronunciation breakdowns.
- Avoid obscure dictionary-only vocabulary.
- Prioritize words and phrases commonly spoken in real life.

Return valid JSON only.
```

## Future-Ready But Not Required

The architecture can leave room for future sound-pattern filters such as `STR`, `TH`, `RL`, `STS`, and `SPL`, but these do not need to be fully implemented in the MVP.

Rapid Fire Mode, speech recording, stumble detection, adaptive learning, speed drills, and pronunciation scoring are future features, not MVP requirements.

## Build Priority

1. Project setup and core UI.
2. Practice session flow.
3. AI content generation.
4. Favorites and local storage.
5. UX polish, subtle animations, and mobile refinement.
