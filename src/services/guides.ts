import { OverallStage } from "@prisma/client";

export interface GuideContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cancerType: string;
  icdO3Codes: string[];
  applicableStages: OverallStage[];
  status: string;
  publishedAt: string;
  content: string; // MDX/HTML
  reviewedBy: string;
  nextReviewAt: string;
}

export const MOCK_GUIDES: GuideContent[] = [
  {
    id: "guide-1",
    slug: "understanding-breast-cancer-stage-ii",
    title: "Navigating Stage II Breast Cancer",
    subtitle: "A comprehensive guide to treatment options, side effects, and recovery milestones.",
    cancerType: "Breast Cancer",
    icdO3Codes: ["C50.9"],
    applicableStages: [OverallStage.STAGE_II, OverallStage.STAGE_IIA, OverallStage.STAGE_IIB],
    status: "PUBLISHED",
    publishedAt: "2026-01-15T09:00:00Z",
    content: "Pathophysiology and treatment mapping for Stage II breast cancer patients...",
    reviewedBy: "Dr. Sarah Chen, Oncology Lead",
    nextReviewAt: "2027-01-15T09:00:00Z",
  },
  {
    id: "guide-2",
    slug: "lung-cancer-first-30-days",
    title: "Lung Cancer: The First 30 Days",
    subtitle: "What to expect after your diagnosis and how to prepare for your first oncology visits.",
    cancerType: "Lung Cancer",
    icdO3Codes: ["C34.9"],
    applicableStages: [OverallStage.STAGE_I, OverallStage.STAGE_II, OverallStage.STAGE_III],
    status: "PUBLISHED",
    publishedAt: "2026-02-10T09:00:00Z",
    content: "Navigational guidance for early-stage lung cancer journeys...",
    reviewedBy: "Dr. Mark Hudson, Thoracic Oncology",
    nextReviewAt: "2027-02-10T09:00:00Z",
  }
];

export async function getGuides(diagnosisCode?: string) {
  if (diagnosisCode) {
    return MOCK_GUIDES.filter(g => g.icdO3Codes.includes(diagnosisCode));
  }
  return MOCK_GUIDES;
}

export async function getGuideBySlug(slug: string) {
  return MOCK_GUIDES.find(g => g.slug === slug);
}
