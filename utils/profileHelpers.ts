import { SurrogateProfile } from '@/types/profile';

/**
 * Calculates the profile completion percentage based on filled fields
 * @param profile - The surrogate profile object
 * @returns A number between 0 and 100 representing the completion percentage
 */
export const calculateProfileProgress = (profile: SurrogateProfile | null): number => {
  if (!profile) return 0;

  const fields = [
    'firstName', 'lastName', 'userName', 'countryOfOrigin', 'aboutMe',
    'dateOfBirth', 'maritalStatus', 'height', 'weight', 'profilePicture',
    'numberOfChildren', 'countryOfResidence', 'stateOfOrigin', 'address',
    'zipCode', 'phone1', 'phone2', 'emergencyContactPhone',
    'emergencyContactRelation', 'facebookProfile', 'instagramProfile',
    'twitterProfile', 'threadsProfile'
  ];

  const completedFields = fields.filter(field => {
    const value = profile[field as keyof typeof profile];
    return value !== null && value !== undefined && value !== '';
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

