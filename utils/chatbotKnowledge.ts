export type UserRole = "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "ALL";

export interface KBEntry {
  keywords: string[];
  answer: string;
  suggestions?: string[];
  role?: UserRole[];
}

const knowledgeBase: KBEntry[] = [
  // ── ONBOARDING / SIGNUP ──
  {
    keywords: ["sign up", "register", "create account", "join", "get started"],
    answer:
      "To get started, download the app and tap 'Get started'. You'll go through a quick carousel, then select how you heard about us. Choose your role (Surrogate, Intended Parent, or Agent), then create an account with your email and a password. A verification code will be sent to your email — enter it to activate your account.",
    suggestions: ["How to complete my profile", "What is KYC verification", "How matching works"],
    role: ["ALL"],
  },
  {
    keywords: ["role", "which role", "surrogate vs", "intended parent vs agent"],
    answer:
      "If you want to carry a pregnancy for someone else, choose 'Surrogate'. If you're looking to start a family through surrogacy, choose 'Intended Parent'. If you're a professional helping connect both sides, choose 'Agent'. You can only pick one role during signup.",
    suggestions: ["What surrogates do", "How intended parents match", "Agent features"],
    role: ["ALL"],
  },
  {
    keywords: ["referral", "referral code", "invite code"],
    answer:
      "During signup you can enter a referral code if someone invited you. You can also share your own referral code from the Invite screen to earn rewards when friends join.",
    suggestions: ["How to earn rewards", "Share my referral code"],
    role: ["ALL"],
  },

  // ── SURROGATE PROFILE ──
  {
    keywords: ["complete profile", "profile setup", "personal info", "fill profile"],
    answer:
      "Your profile is the most important part of getting matched. Head to Settings > Profile Information to fill in your first name, last name, date of birth, country, marital status, height, weight, and number of children. Then add your contact details: country of residence, state, LGA, address, phone numbers, and emergency contact. Don't forget to upload a clear profile picture!",
    suggestions: ["Profile picture tips", "Contact info", "How to edit my bio"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["profile picture", "avatar", "change photo", "upload picture"],
    answer:
      "Go to your Profile screen and tap the camera icon or your current photo to change it. Use a clear, recent, and friendly headshot — profiles with good photos get significantly more attention. Avoid group photos or images with sunglasses or hats.",
    suggestions: ["Complete my profile", "Edit my bio", "KYC verification"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["bio", "about me", "edit bio", "description"],
    answer:
      "You can edit your bio from the Profile screen. Tap 'Edit Bio' to update your display name, about me section, availability status, and social media links. A complete bio helps intended parents and agents learn more about you.",
    suggestions: ["Profile picture tips", "Availability toggle", "Social media links"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["availability", "available", "not available", "toggle status"],
    answer:
      "You can toggle your availability on or off from your Profile screen. When set to 'Available', you'll appear in search results for intended parents and agents. When 'Not Available', you won't show up in searches but your profile stays intact.",
    suggestions: ["How matching works", "Complete my profile", "Profile picture"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["contact info", "address", "phone", "emergency contact"],
    answer:
      "Go to Profile > Contact Information to update your country of residence, state, LGA, street address, zip code, phone numbers, and emergency contact details with their relationship to you. Accurate contact info ensures matches can reach you.",
    suggestions: ["Personal info", "Edit my bio", "Profile completion"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["profile completion", "progress", "percentage", "100%", "incomplete"],
    answer:
      "Your profile completion is calculated from several categories: core identity and contact (50%), medical and experience (25%), optional enrichments like bio and physical info (15%), and social media links (10%). To reach 100%, make sure all required fields are filled in — especially your name, date of birth, country, phone, and profile picture. Completing your medical info also adds significant progress.",
    suggestions: ["Complete my profile", "Medical info", "KYC verification"],
    role: ["SURROGATE"],
  },

  // ── MEDICAL INFO ──
  {
    keywords: ["medical", "medical info", "medical details", "health info"],
    answer:
      "As a surrogate, you'll need to provide medical details. Go to the Medical section from your profile or the home screen. Step 1 asks about your genotype (AA, AS, SS, AC), blood group, pregnancy history, number of children, and caesarean sections. Step 2 covers chronic illnesses and miscarriage history. All medical data is kept private and confidential.",
    suggestions: ["Genotype options", "Upload endometrium", "Pregnancy history"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["genotype", "blood group", "blood type"],
    answer:
      "You'll need to select your genotype (AA, AS, SS, or AC) and blood group (A+, A-, B+, B-, AB+, AB-, O+, or O-). These are standard medical fields used for matching and safety. If you don't know yours, check your medical records or ask your doctor.",
    suggestions: ["Medical step 1", "Upload endometrium", "Pregnancy history"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["pregnancy", "pregnant before", "children", "caesarean", "c-section"],
    answer:
      "You'll be asked if you've ever been pregnant, how many children you have, whether you've had a caesarean section, and how many C-sections. This helps intended parents and medical professionals understand your pregnancy history. Answer honestly — all information is kept confidential.",
    suggestions: ["Medical step 2", "Chronic illness", "Miscarriage"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["chronic illness", "diabetes", "hypertension", "asthma", "sickle cell"],
    answer:
      "Step 2 of medical asks about chronic illnesses. You can select from Diabetes, Hypertension, Asthma, Sickle Cell Disease, HIV/AIDS, Arthritis, Heart Disease, Kidney Disease, Ulcer, or Other. You can select multiple if applicable. There's also a text field if you choose 'Other' to specify.",
    suggestions: ["Medical step 1", "Upload endometrium", "Experience survey"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["miscarriage", "miscarriages", "pregnancy loss"],
    answer:
      "You'll be asked if you've had a miscarriage and how many. This is a standard medical question for surrogacy screening. Answer honestly — your responses are kept strictly confidential and help ensure the safest matching.",
    suggestions: ["Medical step 1", "Chronic illness", "Experience survey"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["endometrium", "upload", "report", "document", "endometrium report"],
    answer:
      "From the Medical section, tap the upload card to select your endometrium report image from your gallery. You'll see a preview — tap 'Change Image' if you need to pick a different one. When ready, tap 'Continue' to upload. You can also choose 'Continue Later' and come back to it. Only image files are accepted.",
    suggestions: ["Medical step 1", "Medical step 2", "Experience survey"],
    role: ["SURROGATE"],
  },

  // ── EXPERIENCE SURVEY ──
  {
    keywords: ["experience survey", "experience form", "surrogacy experience", "been a surrogate"],
    answer:
      "The experience survey asks about your surrogacy history. If you've never been a surrogate before, you'll answer a few short questions about compensation. If you have experience, you'll also be asked about your previous pregnancy (single/multiple), what you enjoyed, and compensation. This helps intended parents find someone whose experience matches their needs.",
    suggestions: ["Set compensation", "First-time surrogate", "Experienced surrogate"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["first time", "first-time surrogate", "rookie", "never been surrogate"],
    answer:
      "If this is your first time as a surrogate, the survey will ask: how much compensation you'd like, whether the amount is negotiable, and anything else you'd like to share. That's it! Many intended parents are happy to work with first-time surrogates.",
    suggestions: ["Compensation tips", "Complete my profile", "KYC verification"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["experienced surrogate", "been surrogate before", "previous surrogacy"],
    answer:
      "If you've been a surrogate before, the survey asks: did you carry single or multiple babies, what you enjoyed about the last process, your desired compensation, whether it's negotiable, and anything else you'd like to share. Share your experience honestly — it helps you find the right match!",
    suggestions: ["Compensation tips", "Medical info", "Gallery upload"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["compensation", "pay", "amount", "how much", "negotiable", "fee"],
    answer:
      "You'll set your desired compensation amount during the experience survey. Research typical surrogate compensation in your region to set a realistic amount. Unrealistic amounts can delay matching. You can also mark it as negotiable, which gives you more flexibility in conversations with intended parents.",
    suggestions: ["First-time surrogate", "Experienced surrogate", "Wallet"],
    role: ["SURROGATE"],
  },

  // ── KYC VERIFICATION ──
  {
    keywords: ["kyc", "verify", "verification", "id verification", "identity"],
    answer:
      "KYC (Know Your Customer) is required to verify your identity. Go to Settings > KYC Update or the KYC section from your home screen. You'll need to submit a photo of your ID (National ID, Driver's License, or Passport) and take a quick selfie for face verification. All documents are encrypted and stored securely.",
    suggestions: ["ID types accepted", "Face scan", "Why KYC is needed"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["id type", "national id", "driver's license", "passport", "which id"],
    answer:
      "We accept three ID types: National ID card, Driver's license, or International Passport. Choose whichever you have available. You'll need to capture both the front and back (passport only needs front). Make sure the document is valid and not expired.",
    suggestions: ["Face scan rules", "KYC steps", "Why verification matters"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["face scan", "selfie", "face verification", "take selfie"],
    answer:
      "After submitting your ID, you'll take a selfie for face verification. Rules: look straight ahead, keep your eyes visible, remove face coverings (mask, sunglasses), no face cap, and make sure the image isn't blurry. Use good lighting for best results.",
    suggestions: ["ID types", "KYC steps", "Why KYC is needed"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["why kyc", "why verify", "why id", "privacy", "secure"],
    answer:
      "KYC verification helps us confirm your identity and comply with legal requirements. It builds trust between surrogates, intended parents, and agents. Verified users get higher visibility and ranking in search results. All your information is encrypted and stored securely — we only use it for identity verification.",
    suggestions: ["KYC steps", "Face scan", "Profile completion"],
    role: ["SURROGATE"],
  },

  // ── GALLERY ──
  {
    keywords: ["gallery", "photo", "image", "upload photo", "add image"],
    answer:
      "You can upload up to 4 images to your gallery. Go to your Gallery from the home screen or profile. Tap 'Add image' to pick from your photo library. Long-press any image to enter selection mode — you can then delete selected images. Images are displayed in a 2-column grid layout.",
    suggestions: ["Profile picture", "How many photos", "Delete an image"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["max photos", "how many", "upload limit", "4 images", "maximum"],
    answer:
      "You can upload a maximum of 4 images to your gallery. Once you reach 4, the 'Add image' button will no longer appear until you delete some. Choose your best photos to showcase your profile.",
    suggestions: ["Add image", "Delete an image", "Profile picture"],
    role: ["SURROGATE"],
  },

  // ── WALLET ──
  {
    keywords: ["wallet", "balance", "money", "fund", "top up", "add money"],
    answer:
      "Your wallet shows your current balance in NGN (Naira). You can top up using Paystack — choose a payment method (card, bank transfer, or USSD), enter an amount, and complete the payment. The money is credited to your wallet instantly. You can also withdraw funds to your linked bank account.",
    suggestions: ["Withdraw funds", "Add bank account", "Payment methods"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["withdraw", "cash out", "bank transfer", "send money"],
    answer:
      "To withdraw, go to your Wallet and tap 'Withdraw'. You'll see your linked bank accounts. If you haven't added one yet, tap 'Add Bank Account' and enter your account holder name, bank name, and account number. Once added, you can withdraw your balance.",
    suggestions: ["Add bank account", "Top up wallet", "Transaction history"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["bank account", "add bank", "link bank", "account number"],
    answer:
      "Go to Wallet > Withdraw > Add Bank Account. Enter the account holder's name, the bank name, and the account number. Make sure the details are correct — you don't want your withdrawal going to the wrong account!",
    suggestions: ["Withdraw funds", "Top up wallet", "Transaction history"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["transaction", "history", "recent", "see all"],
    answer:
      "Your recent transactions are displayed on the Wallet screen. Tap 'See all' to view the full list. Each transaction shows whether it was a credit or debit, the amount, and the date.",
    suggestions: ["Top up wallet", "Withdraw funds", "Add bank account"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["payment method", "paystack", "card", "bank transfer", "ussd"],
    answer:
      "We use Paystack as our payment gateway. You can pay via card, bank transfer, or USSD. Choose the option that's most convenient for you. All payments are processed securely through Paystack.",
    suggestions: ["Top up wallet", "Withdraw funds", "Transaction history"],
    role: ["SURROGATE"],
  },

  // ── MATCHING ──
  {
    keywords: ["match", "matching", "how matching works", "find parents", "get matched"],
    answer:
      "Once your profile is complete and you're set to 'Available', intended parents and agents can discover you. They'll see your profile cards with your photo, name, age, and location. When someone is interested, they pay a fee to unlock your contact and medical details, then they can send you a chat request. You can accept or decline. You're always in control of who you connect with.",
    suggestions: ["Profile unlock fee", "Chat with parents", "Use an agent"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["unlock", "fee", "pay to view", "50,000", "N50k", "unlock profile"],
    answer:
      "When an intended parent or agent wants to view your full profile (contact info and medical details), they pay a one-time fee of N50,000. This helps ensure serious inquiries and protects your privacy. You don't pay anything — they do. Once unlocked, they can chat with you directly.",
    suggestions: ["How matching works", "Chat with parents", "Use an agent"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["chat", "message", "conversation", "talk to", "contact parent"],
    answer:
      "After an intended parent unlocks your profile, you can chat with them directly through the app. If you want to stay anonymous initially, you can choose to communicate through an agent instead. You can accept or decline any connection request.",
    suggestions: ["Use an agent", "Profile unlock fee", "How matching works"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["agent", "use an agent", "talk to agent", "agent support"],
    answer:
      "An agent is a professional who helps facilitate the matching process. If you prefer, you can work with an agent who will handle communication with intended parents on your behalf. This can be helpful if you want to stay anonymous during initial discussions. Agents can be found in the Agents section.",
    suggestions: ["Chat with parents", "How matching works", "Find an agent"],
    role: ["SURROGATE"],
  },

  // ── NOTIFICATIONS ──
  {
    keywords: ["notification", "alert", "reminder", "email", "sms", "push"],
    answer:
      "You can control your notification settings from Settings > Personalization. Choose which channels you want: Email, SMS, and/or Push notifications. There are two sections: 'Updates and Promotions' (new features, deals) and 'Reminders' (wallet and referral updates). Toggle each option on or off as you prefer.",
    suggestions: ["Notification types", "Profile views", "Matching alerts"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["notification types", "what notifications", "get notified"],
    answer:
      "You'll receive notifications for profile views, matches, payment updates, referral rewards, KYC status changes, and system announcements. Each notification type can be managed in your personalization settings.",
    suggestions: ["Notification settings", "Email vs SMS", "Turn off alerts"],
    role: ["SURROGATE"],
  },

  // ── SETTINGS ──
  {
    keywords: ["settings", "change password", "password", "security"],
    answer:
      "Go to Settings > Privacy and Security to change your password. Your new password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character. Enter your current password, then the new one, and confirm it.",
    suggestions: ["Edit profile", "Notification settings", "Logout"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["logout", "sign out", "log out", "exit"],
    answer:
      "To log out, go to your Profile Information screen and tap 'Log out' at the bottom. You'll be taken back to the login screen. Your data and profile will be saved for next time.",
    suggestions: ["Change password", "Deactivate account", "Edit profile"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["deactivate", "delete account", "close account", "remove account"],
    answer:
      "To deactivate your account, tap 'Danger zone' on your Profile Information screen, then 'Deactivate account'. This action requires support team assistance — please contact us through the Help section to complete the process.",
    suggestions: ["Logout", "Contact support", "Edit profile"],
    role: ["SURROGATE"],
  },
  {
    keywords: ["help", "support", "contact", "customer care", "human agent"],
    answer:
      "You can get help from the Help section in Settings. There's a 'Getting Started' guide, 'Getting Matched' guide, and a Payments guide. If you need further assistance, you can chat with a customer care representative from the Help screen or by tapping 'Talk to agent' in this chat.",
    suggestions: ["Getting started guide", "How matching works", "Talk to human agent"],
    role: ["ALL"],
  },

  // ── OTHER ROLES ──
  {
    keywords: ["find surrogate", "browse surrogate", "surrogate list"],
    answer:
      "As an Intended Parent or Agent, you can browse available surrogates from the Surrogates section. You'll see swipeable profile cards with photos, names, ages, and locations. Tap 'View Profile' to see full details, or swipe to skip. When you find someone you're interested in, you can unlock their contact details for a fee.",
    suggestions: ["Profile unlock fee", "How matching works", "Chat with surrogate"],
    role: ["INTENDED_PARENT", "AGENT"],
  },
  {
    keywords: ["find agent", "browse agent", "agent list"],
    answer:
      "As an Intended Parent or Surrogate, you can browse available agents. Agents help facilitate the matching process and provide professional guidance. View their profiles to see their experience, certifications, and services offered.",
    suggestions: ["Use an agent", "How matching works", "Chat with agent"],
    role: ["INTENDED_PARENT", "SURROGATE"],
  },
  {
    keywords: ["intended parent", "parent", "find match", "find surrogate"],
    answer:
      "As an Intended Parent, you complete your profile with your preferences and requirements. You can browse surrogates, view recommended matches, and work with an agent for guided support. When you find a good fit, unlock their profile and start a conversation.",
    suggestions: ["Find a surrogate", "Use an agent", "Profile unlock fee"],
    role: ["INTENDED_PARENT"],
  },
  {
    keywords: ["agent features", "agent profile", "certification", "services"],
    answer:
      "As an Agent, you set up your profile highlighting your expertise, add certifications to build trust, and get verified for more visibility. You can receive parent requests, access a pool of available surrogates, and facilitate introductions. Fast responses improve your ranking on the platform.",
    suggestions: ["Get verified", "Find surrogates", "Help parents match"],
    role: ["AGENT"],
  },
  {
    keywords: ["boost", "profile boost", "visibility", "ranking", "featured"],
    answer:
      "You can boost your profile for higher visibility to agents and intended parents. A Profile Boost costs NGN 3,000 and you can also get a Verification Badge for NGN 3,000 to increase trust and ranking in search results. Both are available from your wallet or profile section.",
    suggestions: ["Wallet", "Profile completion", "How matching works"],
    role: ["SURROGATE"],
  },
];

export default knowledgeBase;
