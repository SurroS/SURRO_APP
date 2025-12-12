import api from "./api"; 

 

export async function debugCreateConversation(otherUserId) {
  console.log("➡ Creating conversation with:", otherUserId);

  const res = await api.post("/chat/conversation", {
    otherUserId,
  });

  console.log("✔ Conversation created:", res.data);
  return res.data.data;
}

export async function debugFetchMessages(conversationId) {
  console.log("➡ Fetching messages for:", conversationId);

  const res = await api.get(`/chat/messages/${conversationId}`);

  console.log("✔ Messages fetched:", res.data);
  return res.data.data;
}

export async function debugSendMessage(conversationId, text) {
  console.log("➡ Sending message:", { conversationId, text });

  const res = await api.post("/chat/message", {
    conversationId,
    content: text,
  });

  console.log("✔ Message sent:", res.data);
  return res.data.data;
}
