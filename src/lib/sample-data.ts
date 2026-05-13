import type { Difficulty, PracticeItem, PracticeMode } from "./types";

const baseItems: PracticeItem[] = [
  {
    id: "word-business-hard-entrepreneurial",
    text: "Entrepreneurial",
    breakdown: "en-truh-pruh-NUR-ee-ul",
    ipa: "/ˌɑːntrəprəˈnɜːriəl/",
    sentence: "Her entrepreneurial instinct helped the team move quickly.",
    mode: "word",
    domain: "Business",
    difficulty: "hard",
  },
  {
    id: "word-business-medium-synergy",
    text: "Synergy",
    breakdown: "SIN-er-jee",
    ipa: "/ˈsɪnərdʒi/",
    sentence: "The merger created real synergy between the two teams.",
    mode: "word",
    domain: "Business",
    difficulty: "medium",
  },
  {
    id: "word-technology-hard-statistical",
    text: "Statistical",
    breakdown: "stuh-TIS-ti-kul",
    ipa: "/stəˈtɪstɪkəl/",
    sentence: "The statistical model improved every week.",
    mode: "word",
    domain: "Technology",
    difficulty: "hard",
  },
  {
    id: "phrase-business-medium-return-on-investment",
    text: "Return on Investment",
    breakdown: "ri-TURN on in-VEST-munt",
    ipa: "/rɪˈtɜːrn ɑːn ɪnˈvestmənt/",
    sentence: "The return on investment was clear after launch.",
    mode: "phrase",
    domain: "Business",
    difficulty: "medium",
  },
  {
    id: "phrase-technology-hard-specific-statistical-system",
    text: "Specific statistical system",
    breakdown: "spuh-SIF-ik stuh-TIS-ti-kul SIS-tum",
    ipa: "/spəˈsɪfɪk stəˈtɪstɪkəl ˈsɪstəm/",
    sentence: "We tested a specific statistical system for accuracy.",
    mode: "phrase",
    domain: "Technology",
    difficulty: "hard",
  },
  {
    id: "twister-public-speaking-hard-strategic-street",
    text: "Strategic street speakers stretch strongly.",
    breakdown: "struh-TEE-jik street SPEE-kurz stretch STRONG-lee",
    ipa: "/strəˈtiːdʒɪk striːt ˈspiːkərz stretʃ ˈstrɔːŋli/",
    sentence: "Repeat it slowly, then increase pace without losing clarity.",
    mode: "tongue_twister",
    domain: "Public Speaking",
    difficulty: "hard",
  },
  {
    id: "word-medical-medium-diagnosis",
    text: "Diagnosis",
    breakdown: "dye-ug-NOH-sis",
    ipa: "/ˌdaɪəɡˈnoʊsɪs/",
    sentence: "The diagnosis explained the symptoms clearly.",
    mode: "word",
    domain: "Medical",
    difficulty: "medium",
  },
  {
    id: "phrase-academic-hard-methodological-analysis",
    text: "Methodological analysis",
    breakdown: "meth-uh-duh-LAH-jih-kul uh-NAL-uh-sis",
    ipa: "/ˌmeθədəˈlɑːdʒɪkəl əˈnæləsɪs/",
    sentence: "The paper included a methodological analysis.",
    mode: "phrase",
    domain: "Academic",
    difficulty: "hard",
  },
  {
    id: "word-everyday-easy-comfortable",
    text: "Comfortable",
    breakdown: "KUMF-ter-bul",
    ipa: "/ˈkʌmftərbəl/",
    sentence: "This chair is comfortable for long meetings.",
    mode: "word",
    domain: "Everyday",
    difficulty: "easy",
  },
];

const generatedText: Record<PracticeMode, Record<Difficulty, string[]>> = {
  word: {
    easy: ["Probably", "Breakfast", "Comfortable", "Library", "Usually"],
    medium: ["Regularly", "Communication", "Interpretation", "Scenario", "Mitigate"],
    hard: ["Entrepreneurial", "Extraordinarily", "Statistical", "Infrastructure", "Methodological"],
  },
  phrase: {
    easy: ["fresh fruit first", "clear morning meeting", "quick client call", "simple travel plan", "daily progress report"],
    medium: ["regular review rhythm", "specific service strategy", "business briefing balance", "rural railway route", "medical monitoring method"],
    hard: ["specific statistical system", "entrepreneurial infrastructure review", "strategic restructuring schedule", "methodological interpretation", "extraordinary communication challenge"],
  },
  tongue_twister: {
    easy: ["Bright blue birds bring breakfast.", "Friendly phrases flow freely.", "Clear callers close calmly.", "Busy buses buzz by.", "Tiny timers tick twice."],
    medium: ["Regular reviewers rarely rush revisions.", "Specific speakers split strict scripts.", "Medical managers monitor murmurs.", "Business builders balance bold briefs.", "Academic actors articulate arguments."],
    hard: ["Strategic street speakers stretch strongly.", "Statistical systems steadily stress specialists.", "Entrepreneurial editors restructure extraordinary excerpts.", "Specific structural shifts strain speech speed.", "Strict public speakers split strategic scripts."],
  },
};

export function getFallbackItems(mode: PracticeMode, domain: string, difficulty: Difficulty, count = 12) {
  const exact = baseItems.filter(
    (item) => item.mode === mode && item.difficulty === difficulty && item.domain.toLowerCase() === domain.toLowerCase(),
  );
  const nearby = baseItems.filter((item) => item.mode === mode && item.difficulty === difficulty);
  const source = exact.length ? exact : nearby.length ? nearby : baseItems.filter((item) => item.mode === mode);
  const textSource = generatedText[mode][difficulty];
  const result: PracticeItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const seed = source[index % Math.max(source.length, 1)];
    const text = textSource[index % textSource.length];
    result.push({
      id: `${mode}-${domain}-${difficulty}-${index}-${text.toLowerCase().replaceAll(" ", "-")}`,
      text: seed && index < source.length ? seed.text : text,
      breakdown: seed && index < source.length ? seed.breakdown : buildBreakdown(text),
      ipa: seed && index < source.length ? seed.ipa : undefined,
      sentence: seed && index < source.length ? seed.sentence : `Practice "${text}" until it feels smooth at a natural pace.`,
      mode,
      domain,
      difficulty,
    });
  }

  return result;
}

function buildBreakdown(text: string) {
  return text
    .split(" ")
    .map((word) => word.replace(/[aeiouy]+/gi, (match) => match.toLowerCase()).replace(/\b\w/, (char) => char.toUpperCase()))
    .join(" · ");
}
