# Profile API Integration

This document describes the profile API integration that follows the existing codebase patterns for surrogate profile management.

## Overview

The profile API integration includes:
- Profile data models and types
- API service functions
- Zustand store for state management
- React hooks for easy component integration
- Support for both basic profile and medical profile data

## File Structure

```
types/
  ├── auth.ts                 # Authentication type definitions
  └── profile.ts              # Profile type definitions
services/profileApi.ts        # API service functions
store/profile/
  ├── actions.ts             # Zustand actions
  ├── types.ts               # Store type definitions
  └── index.ts               # Store configuration
hooks/useProfile.ts          # React hook for profile functionality
components/examples/
  └── ProfileExample.tsx     # Usage example component
```

## API Endpoints

The following endpoints are supported:

### Surrogate Profile
- `POST /api/v1/surrogates/profile` - Create new profile
- `PATCH /api/v1/surrogates/profile` - Update existing profile
- `GET /api/v1/surrogates/profile/me` - Get current user's profile

### Medical Profile
- `PATCH /api/v1/surrogates/profile/medical` - Update medical information
- `PATCH /api/v1/surrogates/profile/medical/upload-endometrium` - Upload endometrium image

## Usage Examples

### Basic Profile Operations

```typescript
import { useProfile } from '@/hooks/useProfile';
import { SurrogateProfile, SurrogateProfileUpdate } from '@/types/profile';

const MyComponent = () => {
  const { 
    surrogateProfile, 
    isLoading, 
    error,
    createProfile, 
    updateProfile, 
    fetchProfile 
  } = useProfile();

  // Create a new profile
  const handleCreateProfile = async () => {
    const profileData = {
      firstName: 'Jane',
      lastName: 'Doe',
      userName: 'jane_doe',
      countryOfOrigin: 'Somalia',
      aboutMe: 'I am a compassionate and dedicated individual...',
      dateOfBirth: '1990-05-10',
      maritalStatus: 'Married',
      height: '10.5',
      weight: '10.5',
      profilePicture: 'https://www.profile.com/image1.jpg',
      numberOfChildren: 2,
      countryOfResidence: 'Nigeria',
      stateOfOrigin: 'Edo State',
      address: '123 Palm Street, Lagos, Nigeria',
      zipCode: '930272',
      phone1: '+2348012345678',
      phone2: '+2348012345678',
      emergencyContactPhone: '+2341234567890',
      emergencyContactRelation: 'Sister',
      facebookProfile: 'https://www.facebook.com/janedoe',
      instagramProfile: 'https://www.instagram.com/janedoe',
      twitterProfile: 'https://www.twitter.com/janedoe',
      threadsProfile: 'https://www.threads.net/janedoe',
      isAvailable: true,
      termsAcceptedAt: '2025-07-11T13:40:00.000Z'
    };

    try {
      await createProfile(profileData);
      console.log('Profile created successfully');
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  // Update existing profile
  const handleUpdateProfile = async () => {
    const updateData = {
      firstName: 'Jane Updated',
      aboutMe: 'Updated about me text...',
      isAvailable: false
    };

    try {
      await updateProfile(updateData);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Fetch current profile
  const handleFetchProfile = async () => {
    try {
      await fetchProfile();
      console.log('Profile fetched:', surrogateProfile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      <button onClick={handleCreateProfile}>Create Profile</button>
      <button onClick={handleUpdateProfile}>Update Profile</button>
      <button onClick={handleFetchProfile}>Fetch Profile</button>
      
      {surrogateProfile && (
        <div>
          <h3>Current Profile</h3>
          <p>Name: {surrogateProfile.firstName} {surrogateProfile.lastName}</p>
          <p>Username: {surrogateProfile.userName}</p>
          <p>Available: {surrogateProfile.isAvailable ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};
```

### Medical Profile Operations

```typescript
import { useProfile } from '@/hooks/useProfile';

const MedicalProfileComponent = () => {
  const { 
    medicalProfile, 
    updateMedicalProfile, 
    uploadEndometriumImage 
  } = useProfile();

  // Update medical profile
  const handleUpdateMedicalProfile = async () => {
    const medicalData = {
      genotype: 'AA',
      bloodGroup: 'A+',
      pregnancyExperience: true,
      numberofChildren: 2,
      ceasareanSection: false,
      chronicIllnessDetails: 'None',
      pregnancyComplicationsDetails: 'Gestational diabetes',
      endometriumUploadUrl: 'https://example.com/endometrium.pdf'
    };

    try {
      await updateMedicalProfile(medicalData);
      console.log('Medical profile updated successfully');
    } catch (error) {
      console.error('Failed to update medical profile:', error);
    }
  };

  // Upload endometrium image
  const handleUploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append('endometriumImage', imageFile);

    try {
      await uploadEndometriumImage(formData);
      console.log('Endometrium image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateMedicalProfile}>
        Update Medical Profile
      </button>
      
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadImage(file);
        }}
      />
      
      {medicalProfile && (
        <div>
          <h3>Medical Profile</h3>
          <p>Genotype: {medicalProfile.genotype}</p>
          <p>Blood Group: {medicalProfile.bloodGroup}</p>
          <p>Pregnancy Experience: {medicalProfile.pregnancyExperience ? 'Yes' : 'No'}</p>
          <p>Number of Children: {medicalProfile.numberofChildren}</p>
          <p>Caesarean Section: {medicalProfile.ceasareanSection ? 'Yes' : 'No'}</p>
          <p>Chronic Illness: {medicalProfile.chronicIllnessDetails}</p>
          <p>Pregnancy Complications: {medicalProfile.pregnancyComplicationsDetails}</p>
        </div>
      )}
    </div>
  );
};
```

## Type Definitions

### SurrogateProfile
Complete profile data structure including personal information, contact details, and social media profiles.

### SurrogateProfileUpdate
Partial profile data for updates (all fields optional).

### MedicalProfile
Medical information including genotype, blood group, pregnancy experience, and medical history.

**Fields:**
- `genotype`: Blood genotype (e.g., "AA", "AS", "SS")
- `bloodGroup`: Blood group (e.g., "A+", "B-", "O+")
- `pregnancyExperience`: Boolean indicating if user has pregnancy experience
- `numberofChildren`: Number of children the user has
- `ceasareanSection`: Boolean indicating if user had caesarean section
- `chronicIllnessDetails`: Details about chronic illnesses
- `pregnancyComplicationsDetails`: Details about pregnancy complications
- `endometriumUploadUrl`: URL of uploaded endometrium document

### MedicalProfileUpdate
Partial medical profile data for updates (all fields optional).

## Error Handling

All API functions include proper error handling and will:
- Set loading states appropriately
- Store error messages in the store
- Throw errors for component-level handling
- Provide user-friendly error messages

## Authentication

All profile API calls require authentication via Bearer token. The token is automatically included in requests using the `makeAuthenticatedProfileRequest` helper function.

## State Management

The profile store uses Zustand with persistence, following the same pattern as the auth store:
- State is persisted to secure storage
- Only essential data is persisted (profile data, not loading states)
- Store is automatically rehydrated on app restart

## Integration Notes

1. **Token Management**: Always ensure the user is authenticated before making profile API calls
2. **Error Handling**: Check for errors in the store and handle them appropriately in your components
3. **Loading States**: Use the `isLoading` state to show loading indicators
4. **Data Validation**: Validate form data before sending to the API
5. **File Uploads**: Use FormData for image uploads, not JSON

## Quick Usage Reference

```typescript
import { useProfile } from '@/hooks/useProfile';

const { createProfile, updateProfile, fetchProfile, surrogateProfile } = useProfile();

// Create profile
await createProfile(profileData);

// Update profile  
await updateProfile({ firstName: 'New Name' });

// Fetch profile
await fetchProfile();
```

## Testing

To test the profile APIs:

1. Ensure you have a valid authentication token
2. Use the example component to test different operations
3. Check the network tab to verify API calls are made correctly
4. Verify that data is properly stored in the Zustand store

## Future Enhancements

Potential future enhancements:
- Profile image upload functionality
- Profile validation schemas
- Offline support for profile data
- Profile sharing capabilities
- Advanced medical profile features
