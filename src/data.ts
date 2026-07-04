import { NCERTLine } from "./types";

export const MASTER_CHAPTERS = [
  { id: "ch-06", name: "Anatomy of Flowering Plants", volume: "Vol. I" as const },
  { id: "ch-08", name: "Cell: The Unit of Life", volume: "Vol. I" as const },
  { id: "ch-13", name: "Photosynthesis in Higher Plants", volume: "Vol. I" as const },
  { id: "ch-15", name: "Plant Growth and Development", volume: "Vol. I" as const },
  { id: "ch-22", name: "Chemical Coordination", volume: "Vol. I" as const },
  { id: "ch-inheritance", name: "Principles of Inheritance", volume: "Vol. II" as const },
  { id: "ch-molecular", name: "Molecular Basis of Inheritance", volume: "Vol. II" as const },
  { id: "ch-biotech", name: "Biotechnology: Principles", volume: "Vol. II" as const },
];

export const INITIAL_NCERT_LINES: NCERTLine[] = [
  {
    id: "morphology-01",
    chapterId: "ch-06",
    chapterName: "Anatomy of Flowering Plants",
    volume: "Vol. I",
    pageNumber: 85,
    lineNumber: 14,
    lineText: "In roots, the protoxylem lies towards periphery and metaxylem lies towards the centre. Such arrangement of primary xylem is called exarch.",
    frequency: 6,
    recallRisk: 74,
    expectedRankDelta: 380,
    predictedOccurrenceProb: 92.1,
    masteryStatus: "critical",
    confidenceScore: 15,
  },
  {
    id: "cell-02",
    chapterId: "ch-08",
    chapterName: "Cell: The Unit of Life",
    volume: "Vol. I",
    pageNumber: 138,
    lineNumber: 22,
    lineText: "The membrane of the vacuole is called tonoplast, which facilitates the transport of ions against concentration gradients into the vacuole.",
    frequency: 8,
    recallRisk: 45,
    expectedRankDelta: 410,
    predictedOccurrenceProb: 89.4,
    masteryStatus: "weak",
    confidenceScore: 48,
  },
  {
    id: "photosynthesis-03",
    chapterId: "ch-13",
    chapterName: "Photosynthesis in Higher Plants",
    volume: "Vol. I",
    pageNumber: 218,
    lineNumber: 9,
    lineText: "The primary CO2 acceptor in C4 plants is phosphoenol pyruvate (PEP) and is present in the mesophyll cells. Carbonic anhydrase catalyzes this.",
    frequency: 11,
    recallRisk: 89,
    expectedRankDelta: 620,
    predictedOccurrenceProb: 95.8,
    masteryStatus: "critical",
    confidenceScore: 8,
  },
  {
    id: "inheritance-04",
    chapterId: "ch-inheritance",
    chapterName: "Principles of Inheritance",
    volume: "Vol. II",
    pageNumber: 81,
    lineNumber: 7,
    lineText: "Henking (1891) traced a specific nuclear structure all through spermatogenesis in a few insects, and observed that 50 per cent of the sperm received this.",
    frequency: 4,
    recallRisk: 30,
    expectedRankDelta: 190,
    predictedOccurrenceProb: 71.0,
    masteryStatus: "mastered",
    confidenceScore: 90,
  },
  {
    id: "molecular-05",
    chapterId: "ch-molecular",
    chapterName: "Molecular Basis of Inheritance",
    volume: "Vol. II",
    pageNumber: 121,
    lineNumber: 31,
    lineText: "A very low level of expression of lac operon has to be present in the cell all the time, otherwise lactose cannot enter the cells.",
    frequency: 9,
    recallRisk: 92,
    expectedRankDelta: 540,
    predictedOccurrenceProb: 97.4,
    masteryStatus: "critical",
    confidenceScore: 12,
  },
  {
    id: "chemical-06",
    chapterId: "ch-22",
    chapterName: "Chemical Coordination",
    volume: "Vol. I",
    pageNumber: 338,
    lineNumber: 19,
    lineText: "The juxtaglomerular cells of the kidney produce a peptide hormone called erythropoietin which stimulates erythropoiesis (formation of RBC).",
    frequency: 5,
    recallRisk: 60,
    expectedRankDelta: 270,
    predictedOccurrenceProb: 83.2,
    masteryStatus: "weak",
    confidenceScore: 55,
  },
  {
    id: "growth-07",
    chapterId: "ch-15",
    chapterName: "Plant Growth and Development",
    volume: "Vol. I",
    pageNumber: 242,
    lineNumber: 5,
    lineText: "In plant growth, auxin exhibits apical dominance. Removal of shoot tips (decapitation) usually results in the growth of lateral buds.",
    frequency: 5,
    recallRisk: 22,
    expectedRankDelta: 150,
    predictedOccurrenceProb: 78.5,
    masteryStatus: "mastered",
    confidenceScore: 94,
  },
  {
    id: "biotech-08",
    chapterId: "ch-biotech",
    chapterName: "Biotechnology: Principles",
    volume: "Vol. II",
    pageNumber: 168,
    lineNumber: 12,
    lineText: "The tumor inducing (Ti) plasmid of Agrobacterium tumefaciens has now been modified into a cloning vector, which is no more pathogenic to plant cells.",
    frequency: 7,
    recallRisk: 38,
    expectedRankDelta: 310,
    predictedOccurrenceProb: 88.0,
    masteryStatus: "unknown",
    confidenceScore: 0,
  }
];

// Helper to generate a matrix of auxiliary nodes for the DNA grid
export function generateAuxiliaryNodes(chapterId: string, count: number): { id: string; state: "mastered" | "weak" | "critical" | "unknown" }[] {
  const result = [];
  const states: ("mastered" | "weak" | "critical" | "unknown")[] = ["mastered", "weak", "critical", "unknown"];
  
  // Seed pseudorandom seed from chapterId
  let hash = 0;
  for (let i = 0; i < chapterId.length; i++) {
    hash = chapterId.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < count; i++) {
    const r = Math.abs(Math.sin(hash + i));
    let stateIndex = 3; // default unknown
    if (r < 0.35) stateIndex = 0; // mastered
    else if (r < 0.6) stateIndex = 1; // weak
    else if (r < 0.8) stateIndex = 2; // critical
    
    result.push({
      id: `${chapterId}-aux-${i}`,
      state: states[stateIndex],
    });
  }
  return result;
}
