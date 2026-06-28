import { UIProfile } from "@/types/uiProfile";

/* ---------------- SURROGATE ---------------- */
export const surrogateToUIProfile = (p: any): UIProfile => {
  if (!p) return {
    isAvailable: false,
    profilePicture: "",
    userName: "",
    aboutMe: "",
    socials: [],
  };

  return {
    isAvailable: p.isAvailable,
    profilePicture: p.profilePicture,
    userName: p.userName || "",
    aboutMe: p.aboutMe,
    socials: [
      { platform: "Facebook", handle: p.facebookProfile },
      { platform: "Instagram", handle: p.instagramProfile },
      { platform: "Twitter", handle: p.twitterProfile },
      { platform: "Threads", handle: p.threadsProfile },
    ].filter((s) => s.handle),
  };
};


export const uiProfileToSurrogate = (u: UIProfile) => ({
  isAvailable:u?.isAvailable,
  profilePicture: u.profilePicture,
  userName: u.userName,
  aboutMe: u.aboutMe,
  facebookProfile: u.socials?.find((s) => s.platform === "Facebook")?.handle,
  instagramProfile: u.socials?.find((s) => s.platform === "Instagram")?.handle,
  twitterProfile: u.socials?.find((s) => s.platform === "Twitter")?.handle,
  threadsProfile:
    u.socials?.find((s) => s.platform === "Threads")?.handle ||
    u.socials?.find((s) => s.platform === "TikTok")?.handle,
});

/* ---------------- AGENT ---------------- */
export const agentToUIProfile = (p: any): UIProfile => {
  if (!p) return {
    isAvailable: false,
    profilePicture: "",
    userName: "",
    aboutMe: "",
    socials: [],
  };

  return {
    isAvailable: p.isAvailable,
    profilePicture: p.profilePicture,
    // prefer explicit userName, fall back to fullName for display
    userName: p.userName ?? p.fullName ?? "",
    aboutMe: p.about,
    socials: [
      { platform: "Facebook", handle: p.facebookProfile },
      { platform: "Instagram", handle: p.instagramProfile },
      { platform: "Twitter", handle: p.twitterProfile },
      { platform: "Threads", handle: p.threadsProfile },
    ].filter((s) => s.handle),
  };
};

export const uiProfileToAgent = (u: UIProfile) => ({
  isAvailable:u?.isAvailable,
  profilePicture: u.profilePicture,
  // Save username to backend userName field. Do not overwrite fullName here unless
  // the UI explicitly supplies it.
  userName: u.userName,
  about: u.aboutMe,
  facebookProfile: u.socials?.find((s) => s.platform === "Facebook")?.handle,
  instagramProfile: u.socials?.find((s) => s.platform === "Instagram")?.handle,
  // accept both 'X' and 'Twitter' labels from the UI
  twitterProfile:
    u.socials?.find((s) => s.platform === "Twitter")?.handle ||
    u.socials?.find((s) => s.platform === "X")?.handle,
  threadsProfile: u.socials?.find((s) => s.platform === "Threads")?.handle,
});

/* ---------------- PARENT ---------------- */
export const parentToUIProfile = (p: any): UIProfile => {
  if (!p) return {
    isAvailable: false,
    profilePicture: "",
    userName: "",
    aboutMe: "",
    socials: [],
  };

  return {
    isAvailable: p.isAvailable,
    profilePicture: p.profilePicture,
    userName: p.userName || "",
    aboutMe: p.about,
    socials: [
      { platform: "Facebook", handle: p.facebookProfile },
      { platform: "Instagram", handle: p.instagramProfile },
      { platform: "X", handle: p.twitterProfile },
      { platform: "TikTok", handle: p.tiktokProfile },
    ].filter((s) => s.handle),
  };
};

export const uiProfileToParent = (u: UIProfile) => ({
  isAvailable: u?.isAvailable,
  profilePicture: u.profilePicture,
  userName: u.userName,
  about: u.aboutMe,
  facebookProfile: u.socials?.find((s) => s.platform === "Facebook")?.handle,
  instagramProfile: u.socials?.find((s) => s.platform === "Instagram")?.handle,
  twitterProfile: u.socials?.find((s) => s.platform === "X")?.handle,
  tiktokProfile: u.socials?.find((s) => s.platform === "TikTok")?.handle,
});
