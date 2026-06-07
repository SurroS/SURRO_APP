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
  threadsProfile: u.socials?.find((s) => s.platform === "Threads")?.handle,
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
    userName: p.fullName || "",
    aboutMe: p.aboutMe,
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
  fullName: u.userName,
  bio: u.aboutMe,
  facebookProfile: u.socials?.find((s) => s.platform === "Facebook")?.handle,
  instagramProfile: u.socials?.find((s) => s.platform === "Instagram")?.handle,
  twitterProfile: u.socials?.find((s) => s.platform === "Twitter")?.handle,
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