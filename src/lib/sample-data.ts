import type { Difficulty, PracticeItem, PracticeMode } from "./types";

const baseItems: PracticeItem[] = [
  {
    id: "word-business-hard-entrepreneurial",
    text: "Entrepreneurial",
    chunks: ["en", "tre", "pre", "neur"],
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
    chunks: ["syn", "er", "gy"],
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
    chunks: ["stat", "is", "tic", "al"],
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
    chunks: ["return", "on", "investment"],
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
    chunks: ["specific", "statistical", "system"],
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
    chunks: ["strategic", "street", "speakers", "stretch", "strongly"],
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
    chunks: ["diag", "no", "sis"],
    breakdown: "dye-ug-NOH-sis",
    ipa: "/ˌdaɪəɡˈnoʊsɪs/",
    sentence: "The diagnosis explained the symptoms clearly.",
    mode: "word",
    domain: "Medical",
    difficulty: "medium",
  },
  {
    id: "word-medical-medium-hemoglobin",
    text: "Hemoglobin",
    chunks: ["hemo", "globin"],
    breakdown: "HEE-muh-GLOH-bin",
    ipa: "/ˌhiːməˈɡloʊbɪn/",
    sentence: "Hemoglobin levels were checked during the exam.",
    mode: "word",
    domain: "Medical",
    difficulty: "medium",
  },
  {
    id: "phrase-academic-hard-methodological-analysis",
    text: "Methodological analysis",
    chunks: ["methodological", "analysis"],
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
    chunks: ["com", "fort", "able"],
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

const fallbackWordChunks: Record<string, string[]> = {
  probably: ["prob", "ably"],
  breakfast: ["break", "fast"],
  comfortable: ["com", "fort", "able"],
  library: ["li", "brary"],
  usually: ["u", "sual", "ly"],
  regularly: ["reg", "u", "lar", "ly"],
  communication: ["com", "mu", "ni", "ca", "tion"],
  interpretation: ["inter", "pre", "ta", "tion"],
  scenario: ["scen", "ar", "io"],
  mitigate: ["mit", "i", "gate"],
  entrepreneurial: ["en", "tre", "pre", "neur"],
  extraordinarily: ["extra", "or", "din", "ar", "ily"],
  statistical: ["stat", "is", "tic", "al"],
  infrastructure: ["infra", "struc", "ture"],
  methodological: ["meth", "od", "o", "log", "i", "cal"],
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
    const useSeed = seed && index < source.length;
    result.push({
      id: `${mode}-${domain}-${difficulty}-${index}-${text.toLowerCase().replaceAll(" ", "-")}`,
      text: useSeed ? seed.text : text,
      chunks: useSeed ? seed.chunks : buildFallbackChunks(text),
      breakdown: useSeed ? seed.breakdown : buildBreakdown(text),
      ipa: useSeed ? seed.ipa : undefined,
      sentence: useSeed ? seed.sentence : `Practice "${text}" until it feels smooth at a natural pace.`,
      mode,
      domain,
      difficulty,
    });
  }

  return result;
}

function buildFallbackChunks(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length > 1) {
    return words;
  }
  const key = text.toLowerCase();
  return fallbackWordChunks[key] ?? [text];
}

function buildBreakdown(text: string) {
  return text
    .split(" ")
    .map((word) => word.replace(/[aeiouy]+/gi, (match) => match.toLowerCase()).replace(/\b\w/, (char) => char.toUpperCase()))
    .join(" · ");
}
