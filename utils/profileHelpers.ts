import { SurrogateProfile } from "@/types/profile";
import { AgentProfile } from "@/store/profile/agent/types";
import { ParentProfile } from "@/store/profile/parent/types";

type AnyProfile = SurrogateProfile | AgentProfile | ParentProfile;

/**
 * Utility: checks if a value is meaningfully filled
 */
const isFilled = (value: any): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
};

/**
 * Utility: checks if at least one field in a group is filled
 */
const isAnyFilled = (profile: AnyProfile, fields: string[]): boolean =>
  fields.some((f) => isFilled(profile[f as keyof AnyProfile]));

/**
 * Calculates profile completion with weighted + grouped logic
 */
export const calculateProfileProgress = (
  profile: AnyProfile | null,
): number => {
  if (!profile) return 0;

  let score = 0;
  let maxScore = 0;

  /**
   * Helper to add weighted fields
   */
  const applyFields = (fields: string[], weight: number) => {
    maxScore += weight;
    const filledCount = fields.filter((f) =>
      isFilled(profile[f as keyof AnyProfile]),
    ).length;

    if (filledCount === fields.length) {
      score += weight;
    } else {
      // Partial credit
      score += (filledCount / fields.length) * weight;
    }
  };

  /**
   * Helper for grouped optionals (e.g socials)
   */
  const applyGroup = (fields: string[], weight: number) => {
    maxScore += weight;
    if (isAnyFilled(profile, fields)) {
      score += weight;
    }
  };

  // ------------------------------------------------
  // SURROGATE PROFILE
  // ------------------------------------------------
  if ("hasBeenSurrogate" in profile) {
    // Core identity & contact (50%)
    applyFields(
      [
        "firstName",
        "lastName",
        "userName",
        "dateOfBirth",
        "countryOfResidence",
        "stateOfResidence",
        "phone1",
        "profilePicture",
      ],
      50,
    );

    // Medical & experience (25%)
    applyFields(
      [
        // "hasBeenSurrogate",
        // "compensationAmount",
        // "compensationNegotiable",
        "medical",
      ],
      25,
    );

    // Optional enrichments (15%)
    applyFields(
      ["aboutMe", "height", "weight", "numberOfChildren", "maritalStatus"],
      15,
    );

    // Socials (any one counts) (10%)
    applyGroup(
      [
        "facebookProfile",
        "instagramProfile",
        "twitterProfile",
        "threadsProfile",
        "ticktok",
      ],
      10,
    );
  }

  // ------------------------------------------------
  // AGENT PROFILE
  // ------------------------------------------------
  else if ("services" in profile) {
    // Core professional info (60%)
    applyFields(
      ["name", "userName", "fullName", "profilePicture", "country", "about"],
      60,
    );

    // Services & credibility (25%)
    applyFields(["services", "certifications", "performance"], 25);

    // Social presence (any) (15%)
    applyGroup(["socials"], 15);
  }

  // ------------------------------------------------
  // PARENT PROFILE
  // ------------------------------------------------
  else {
    // Core info (70%)
    applyFields(
      ["fullName", "userName", "profilePicture", "countryOfResidence"],
      70,
    );

    // Contextual depth (20%)
    applyFields(["about", "yearsOfTrying", "languagesSpoken"], 20);

    // Optional social presence (10%)
    applyGroup(["facebookProfile", "instagramProfile"], 10);
  }

  // Normalize and cap
  const percentage = Math.round((score / maxScore) * 100);
  return Math.min(100, Math.max(0, percentage));
};
