import { SurrogateProfile } from "@/types/profile";
import { AgentProfile } from "@/types/agent";
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
    // Profile photo (5%)
    applyFields(["profilePicture"], 5);

    // Personal info (30%)
    applyFields(
      [
        "firstName",
        "lastName",
        "userName",
        "dateOfBirth",
        "countryOfOrigin",
        "stateOfOrigin",
      ],
      30,
    );

    // Contact (15%)
    applyFields(
      [
        "countryOfResidence",
        "stateOfResidence",
        "phone1",
      ],
      15,
    );

    // Medical & experience (25%)
    applyFields(
      [
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
        "tiktokProfile",
      ],
      10,
    );
  }

  // ------------------------------------------------
  // AGENT PROFILE
  // ------------------------------------------------
  else if ("services" in profile) {
    // Profile photo (5%)
    applyFields(["profilePicture"], 5);

    // Identity & about (30%)
    applyFields(["userName", "fullName", "country", "about"], 30);

    // Contact (15%)
    applyFields(["phone1", "publicEmail"], 15);

    // Languages & specializations (15%)
    applyFields(["languages", "services"], 15);

    // Credentials (5%)
    applyFields(["certifications"], 5);

    // Coverage areas (10%)
    applyFields(["coverageAreas"], 10);

    // Location detail (10%)
    applyFields(["city", "state"], 10);

    // Social presence (any one counts) (10%)
    applyGroup(
      [
        "facebookProfile",
        "instagramProfile",
        "twitterProfile",
        "threadsProfile",
      ],
      10,
    );
  }

  // ------------------------------------------------
  // PARENT PROFILE
  // ------------------------------------------------
  else {
    // Profile photo (5%)
    applyFields(["profilePicture"], 5);

    // Core info (65%)
    applyFields(
      ["fullName", "userName", "countryOfResidence"],
      65,
    );

    // Contextual depth (20%)
    applyFields(["about", "yearsOfTrying", "languagesSpoken"], 20);

    // Optional social presence (10%)
    applyGroup(["facebookProfile", "instagramProfile"], 10);
  }

  // KYC verification (shared across all roles)
  maxScore += 5;
  if ((profile as any)?.user?.kycStatus === "APPROVED") {
    score += 5;
  }

  // Normalize and cap
  const percentage = Math.round((score / maxScore) * 100);
  return Math.min(100, Math.max(0, percentage));
};

export type MissingFieldGroup = {
  category: string;
  fields: string[];
  route: string;
};

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  userName: "Username",
  dateOfBirth: "Date of birth",
  profilePicture: "Profile picture",
  countryOfOrigin: "Country of origin",
  stateOfOrigin: "State of origin",
  countryOfResidence: "Country of residence",
  stateOfResidence: "State of residence",
  phone1: "Phone number",
  medical: "Medical information",
  aboutMe: "About me",
  height: "Height",
  weight: "Weight",
  numberOfChildren: "Number of children",
  maritalStatus: "Marital status",
  name: "Name",
  fullName: "Full name",
  country: "Country",
  about: "About",
  services: "Services",
  certifications: "Certifications",
  performance: "Performance",
  yearsOfTrying: "Years trying",
  languagesSpoken: "Languages spoken",
  phone1: "Phone number",
  publicEmail: "Public email",
  languages: "Languages",
  city: "City",
  state: "State",
};

const SOCIAL_FIELDS = [
  "facebookProfile",
  "instagramProfile",
  "twitterProfile",
  "threadsProfile",
  "tiktokProfile",
];

export function getMissingFields(profile: AnyProfile | null): MissingFieldGroup[] {
  if (!profile) return [];

  const groups: MissingFieldGroup[] = [];

  const addFieldsGroup = (category: string, fields: string[], route: string) => {
    const missing = fields.filter((f) => !isFilled(profile[f as keyof AnyProfile]));
    if (missing.length > 0) {
      groups.push({
        category,
        fields: missing.map((f) => FIELD_LABELS[f] || f),
        route,
      });
    }
  };

  const addGroupCheck = (category: string, fields: string[], route: string, label: string) => {
    if (!isAnyFilled(profile, fields)) {
      groups.push({
        category,
        fields: [label],
        route,
      });
    }
  };

  if ("hasBeenSurrogate" in profile) {
    addFieldsGroup("Profile Photo", ["profilePicture"], "/profile/personalDetails");

    addFieldsGroup("Personal Info", [
      "firstName", "lastName", "userName", "dateOfBirth",
      "countryOfOrigin", "stateOfOrigin",
    ], "/profile/personalDetails");

    addFieldsGroup("Contact", [
      "countryOfResidence", "stateOfResidence", "phone1",
    ], "/profile/contactInformation");

    addFieldsGroup("Medical", ["medical"], "/medical");

    addFieldsGroup("Enrichments", [
      "aboutMe", "height", "weight", "numberOfChildren", "maritalStatus",
    ], "/profile/personalDetails");

    addGroupCheck("Socials", SOCIAL_FIELDS, "/profile/contactInformation",
      "At least one social profile");
  } else if ("services" in profile) {
    addFieldsGroup("Profile Photo", ["profilePicture"], "/profile/personalDetails");

    addFieldsGroup("Identity", [
      "userName", "fullName", "country", "about",
    ], "/profile/personalDetails");

    addFieldsGroup("Contact", ["phone1", "publicEmail"], "/profile/contactInformation");

    addFieldsGroup("Languages & Services", ["languages", "services"], "/profile/personalDetails");

    addFieldsGroup("Credentials", ["certifications"], "/profile/personalDetails");

    addFieldsGroup("Coverage Areas", ["coverageAreas"], "/profile/AgentCoverageSection");

    addFieldsGroup("Location", ["city", "state"], "/profile/contactInformation");

    addGroupCheck("Socials", [
      "facebookProfile", "instagramProfile", "twitterProfile", "threadsProfile",
    ], "/profile/contactInformation", "At least one social profile");
  } else {
    addFieldsGroup("Profile Photo", ["profilePicture"], "/profile/personalDetails");

    addFieldsGroup("Core Info", [
      "fullName", "userName", "countryOfResidence",
    ], "/profile/personalDetails");

    addFieldsGroup("Details", [
      "about", "yearsOfTrying", "languagesSpoken",
    ], "/profile/personalDetails");

    addGroupCheck("Socials", ["facebookProfile", "instagramProfile"],
      "/profile/contactInformation", "At least one social profile");
  }

  // KYC verification (shared across all roles)
  if ((profile as any)?.user?.kycStatus !== "APPROVED") {
    groups.push({
      category: "KYC Verification",
      fields: [(profile as any)?.user?.kycStatus === "REJECTED" ? "Rejected — resubmit" : "Complete KYC"],
      route: "/kyc",
    });
  }

  return groups;
};
