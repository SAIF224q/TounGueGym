# TounGueGym

**AI-powered pronunciation practice for smoother speech.**

TounGueGym is a focused articulation training tool that helps you practice difficult words, phrases, and tongue twisters. It uses AI to generate fresh practice material based on your chosen mode, difficulty, and domain — so you never have to hunt for what to practice next.

> ⚠️ **MVP** — This is a minimal viable product. No authentication, no backend database, no speech recording or scoring.

## Features

- **Three practice modes**: Words, Phrases, or Tongue Twisters.
- **AI-generated content**: Powered by Inception Labs API (falls back to built-in sample data when no API key is set).
- **Domain-based practice**: Everyday, Medical, Technology, Business, Academic, Public Speaking — or enter a custom domain.
- **Difficulty levels**: Easy, Medium, Hard.
- **One-item-at-a-time** practice with a clean, focused interface.
- **Breakdown & IPA**: Each item shows a readable pronunciation breakdown and optional IPA notation.
- **Favorites**: Save difficult items and revisit them later.
- **Session summary**: View progress and completed items after each session.
- **Local-first**: All data (settings, favorites, session history) is stored in `localStorage`.

## Routes

| Route        | Page                          |
| ------------ | ----------------------------- |
| `/`          | Landing / session setup       |
| `/practice`  | Main practice interface       |
| `/favorites` | Saved practice items          |
| `/progress`  | Session history (placeholder) |

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **AI API**: Inception Labs (`mercury-2`)
- **Persistence**: `localStorage`

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and add your Inception Labs API key (optional — the app works with built-in sample data without it):

```env
INCEPTION_API_KEY=your_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # AI generation API route
│   ├── favorites/page.tsx        # Favorites page
│   ├── practice/page.tsx         # Practice page
│   ├── progress/page.tsx         # Progress/history page
│   ├── globals.css               # Global styles & design tokens
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing / session setup
├── components/
│   ├── AppShell.tsx              # Shared layout wrapper
│   ├── ControlsBar.tsx           # Next / Prev / Repeat / Shuffle / Favorite
│   ├── DomainSelector.tsx        # Domain picker with custom input
│   ├── HydrateStore.tsx          # Zustand hydration from localStorage
│   ├── PracticeCard.tsx          # Practice item display card
│   ├── SegmentedSelector.tsx     # Segmented control (mode / difficulty)
│   └── SessionSetupModal.tsx     # Quick session count modal
├── lib/
│   ├── constants.ts              # Modes, domains, difficulties
│   ├── sample-data.ts            # Built-in fallback practice items
│   ├── storage.ts                # localStorage helpers
│   └── types.ts                  # TypeScript types
└── store/
    └── usePracticeStore.ts       # Zustand store
```

## Data Model

```ts
type PracticeItem = {
  id: string
  text: string
  breakdown: string
  ipa?: string
  sentence?: string
  mode: "word" | "phrase" | "tongue_twister"
  domain: string
  difficulty: "easy" | "medium" | "hard"
}
```

## License

MIT
