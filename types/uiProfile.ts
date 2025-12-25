export type Social = {
  platform: string;
  handle: string;
};

export type UIProfile = {
  isAvailable?:boolean
  profilePicture?:string
  userName?: string;
  aboutMe?: string;
  socials?: Social[];

};
