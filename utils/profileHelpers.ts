import { SurrogateProfile } from "@/types/profile";
import { AgentProfile } from "@/store/profile/agent/types";
import { ParentProfile } from "@/store/profile/parent/types";

/**
 * Calculates the profile completion percentage for surrogate, agent, or parent profiles
 * @param profile - The profile object (SurrogateProfile | AgentProfile | ParentProfile)
 * @returns A number between 0 and 100 representing completion percentage
 */
export const calculateProfileProgress = (
  profile: SurrogateProfile | AgentProfile | ParentProfile | null
): number => {
  if (!profile) return 0;

  // Define fields for each profile type
  let fields: string[] = [];

  if ("firstName" in profile || "lastName" in profile) {
    // Surrogate profile
    fields = [
      "firstName",
      "lastName",
      "userName",
      "countryOfOrigin",
      "aboutMe",
      "dateOfBirth",
      "maritalStatus",
      "height",
      "weight",
      "profilePicture",
      "numberOfChildren",
      "countryOfResidence",
      "stateOfOrigin",
      "address",
      "zipCode",
      "phone1",
      "phone2",
      "emergencyContactPhone",
      "emergencyContactRelation",
      "facebookProfile",
      "instagramProfile",
      "twitterProfile",
      "threadsProfile",
    ];
  } else if ("performance" in profile || "services" in profile) {
    // Agent profile
    fields = [
      "name",
      "userName",
      "fullName",
      "age",
      "dateOfBirth",
      "country",
      "profilePicture",
      "avatar",
      "about",
      "performance",
      "additionalDetails",
      "socials",
      "services",
      "certifications",
    ];
  } else if ("yearsOfTrying" in profile || "fullName" in profile) {
    // Parent profile
    fields = [
      "fullName",
      "userName",
      "profilePicture",
      "countryOfResidence",
      "about",
      "languagesSpoken",
      "yearsOfTrying",
    ];
  }

  const completedFields = fields.filter((field) => {
    const value = profile[field as keyof typeof profile];
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== "";
  });

  return Math.round((completedFields.length / fields.length) * 100);
};
