# **Description**

This PR implements and fixes the intended-parents and agent API endpoints, ensuring all endpoints are correctly configured with proper paths, HTTP methods, and request bodies. It also adds the create/update pattern for profile management and integrates endpoints into the UI.

# **Changes Proposed**

## **What were you told to do?**

1. Verify and fix all intended-parents API endpoints
2. Implement agent API endpoints
3. Ensure endpoints are used correctly in stores and UI
4. Add create/update pattern (upsert) for profile management

## **What did you do?**

### **Intended-Parents Endpoints**

**Fixed incorrect endpoints:**
| Endpoint | Old (Wrong) | New (Correct) |
|----------|-------------|---------------|
| `updateParentProfile` | PATCH `/intended-parents/match` | PATCH `/intended-parents/profile` |
| `getParentProfile` | GET `/parents/profile/me` | GET `/intended-parents/profile/me` |
| `updateParentMatchPreference` | POST | PATCH `/intended-parents/match-preferences` |

**Added missing endpoints:**
- `getParentMatches` - GET `/intended-parents/matches`
- `removeSavedSurrogate` - DELETE `/intended-parents/save/{id}`
- `getSavedSurrogates` - GET `/intended-parents/saved`

**Updated types to match API request body:**
- `ParentProfile`: fullName, dateOfBirth, maritalStatus, occupation, address, phone, countryOfResidence, stateOfOrigin, religion, termsAcceptedAt
- `MatchPreferences`: matchGenotype, matchReligion, matchCountry, matchState, matchTravelReady, matchMarital

### **Agent Endpoints**

**Fixed endpoint path:**
- `getAgentProfile` - Changed from `/agents/profile/me` to `/agents/profile`

**Added new endpoints:**
- `getAllAgents` - GET `/agents`
- `getAgentById` - GET `/agents/{id}`

**Updated `AgentProfile` type to match API:**
- Social profiles: facebookProfile, instagramProfile, twitterProfile, threadsProfile
- Compensation: compensation, negotiable
- Contact: phone1, phone2, emergencyPhone, publicEmail
- Location: state, city, address
- Skills: languages, services, certifications, performance

### **Store Updates**

- Added create/update pattern to `updateParentProfile` and `updateAgentProfile` - if no profile exists, creates one; otherwise updates
- Added `fetchAgentProfile`, `createAgentProfile` actions to agent store
- Added `fetchAgentById`, `setSelectedAgent` actions to agent list store
- Added `savedSurrogates`, `matches` state to parent store

### **UI Integration**

- `personalDetails.tsx` - Now fetches agent profile on mount for AGENT role
- `filterBottomModal.tsx` - Maps filter options to correct match preferences format
- `surrogateList.tsx` - Saves surrogate when parent views profile

## Types of changes

- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Chore (changes that do not relate to a fix or feature and don't modify src or test files)

# **Check List**

- [x] My code follows the code style of this project.
- [x] This PR does not contain plagiarized content.
- [x] The title and description of the PR are clear and explain the approach.
- [x] I am making a pull request against the **dev branch** (left side).
- [x] My commit message style matches our requested structure.
- [x] My code additions will not fail code linting checks or unit tests.
- [x] I am only making changes to files I was requested to.

---

## **Files Changed**

| File | Changes |
|------|---------|
| `services/profileApi.ts` | Fixed endpoints, added new agent & parent endpoints |
| `store/profile/parent/actions.ts` | Added new actions, create/update pattern |
| `store/profile/parent/types.ts` | Updated types to match API |
| `store/profile/agent/actions.ts` | Added API calls, create/update pattern |
| `store/profile/agent/types.ts` | Updated types to match API |
| `store/agents/actions.ts` | Added `getAllAgents`, `getAgentById` |
| `store/agents/types.ts` | Added `selectedAgent`, `fetchAgentById` |
| `hooks/useParent.ts` | Exposed new actions |
| `hooks/useAgentProfile.ts` | Exposed new actions |
| `app/(tabs)/settings/profile/personalDetails.tsx` | Fetch agent profile on mount |
| `app/(tabs)/home/surrogate/surrogateList.tsx` | Save surrogate for parents |
| `components/modals/filterBottomModal.tsx` | Save match preferences |

## **Endpoints Summary**

### Intended-Parents (All Implemented)
| Endpoint | Method | Used in UI |
|----------|--------|------------|
| `/intended-parents/profile` | POST | ✅ Via create/update |
| `/intended-parents/profile` | PATCH | ✅ personalDetails.tsx |
| `/intended-parents/profile/me` | GET | ✅ personalDetails.tsx |
| `/intended-parents/match-preferences` | PATCH | ✅ filterBottomModal.tsx |
| `/intended-parents/matches` | GET | ❌ Available in store |
| `/intended-parents/save` | POST | ✅ surrogateList.tsx |
| `/intended-parents/save/{id}` | DELETE | ❌ Available in store |
| `/intended-parents/saved` | GET | ❌ Available in store |

### Agent (All Implemented)
| Endpoint | Method | Used in UI |
|----------|--------|------------|
| `/agents/profile` | POST | ✅ Via create/update |
| `/agents/profile` | GET | ✅ personalDetails.tsx |
| `/agents/profile` | PATCH | ✅ personalDetails.tsx |
| `/agents` | GET | ✅ agentsListScreen.tsx |
| `/agents/{id}` | GET | ❌ Available in store |

# Images

<!-- Add Screenshots of: -->

- The live component worked on
- Linting check (run pnpm lint)

