// // hooks/chat/useChat.ts
// import { useState, useEffect } from "react";
// import { useAuthStore } from "@/store/auth";
// import {
//   createOrGetConversation,
//   getConversationMessages,
//   sendChatMessage,
// } from "@/services/chatApi";
// import type { Message, Conversation } from "@/types/chat";
// import { useLocalSearchParams } from "expo-router";

// export function useChat() {
//   const user = useAuthStore((s) => s.user);
//   const { otherUserId } = useLocalSearchParams();

//   const [conversationId, setConversationId] = useState<string | undefined>();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loadingHistory, setLoadingHistory] = useState(true);

//   // ------------------------------------------------------
//   // 1. CREATE / GET CONVERSATION
//   // ------------------------------------------------------
//   useEffect(() => {
//     async () => {
//       if (!otherUserId) return;
//       try {
//         const convo: Conversation = await createOrGetConversation(
//           otherUserId as string
//         );
//         console.error("otherUserId", otherUserId);
//         console.error("conversation Id", convo.id);
//         setConversationId(convo.id);
//       } catch (err) {
//         console.error("Failed to create/get conversation:", err);
//       }
//     };
//   }, [otherUserId]);

//   // ------------------------------------------------------
//   // 2. LOAD MESSAGES WHEN conversationId IS READY
//   // ------------------------------------------------------
//   useEffect(() => {
//     async function loadHistory() {
//       if (!conversationId) return;

//       setLoadingHistory(true);
//       try {
//         const msgs = await getConversationMessages(conversationId);
//         setMessages(msgs);
//       } catch (err) {
//         console.warn("Load history failed:", err);
//       }
//       setLoadingHistory(false);
//     }

//     loadHistory();
//   }, [conversationId]);

//   // ------------------------------------------------------
//   // 3. SEND A MESSAGE
//   // ------------------------------------------------------
//   async function sendMessage(text: string) {
//     if (!conversationId || !text.trim()) return;
//     console.log("conversationId from useChat", conversationId);
//     // Temporary bubble
//     const temp: Message = {
//       id: Math.random().toString(),
//       content: text,
//       createdAt: new Date().toISOString(),
//       sender: {
//         id: user?.id || "",
//         name: user?.username || "User",
//         role: user?.role,
//       },
//       failed: false,
//     };

//     setMessages((prev) => [...prev, temp]);

//     try {
//       const saved = await sendChatMessage(conversationId, text);

//       setMessages((prev) => prev.map((m) => (m.id === temp.id ? saved : m)));
//     } catch (err) {
//       console.error("sendMessage error:", err);

//       setMessages((prev) =>
//         prev.map((m) => (m.id === temp.id ? { ...m, failed: true } : m))
//       );
//     }
//   }

//   return {
//     messages,
//     sendMessage,
//     loadingHistory,
//     conversationId,
//   };
// }
