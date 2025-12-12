// import React, { useEffect, useRef } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   View,
//   Text as RNText,
//   ActivityIndicator,
//   Image,
// } from "react-native";

// import ChatInput from "@/components/chat/chatInput";
// import { useChat } from "@/hooks/chat/useChat";
// import { useLocalSearchParams } from "expo-router";
// import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
// import type { Message } from "@/types/chat";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuthStore } from "@/store/auth";

// export default function ChatBoxScreen() {
//   const params = useLocalSearchParams<{
//     conversationId?: string;
//     otherUserId?: string;
//   }>();

//   const currentUserId = useAuthStore((s) => s.user?.id);

//   // Our simplified hook signature
//   const { messages, loadingHistory, sendMessage, conversationId } =
//     useChat(params.conversationId);

//   const flatRef = useRef<FlatList<Message>>(null);

//   useEffect(() => {
//     flatRef.current?.scrollToEnd({ animated: true });
//     console.log("conversationId from:",conversationId)
//   }, [messages.length]);

//   const renderItem = ({ item }: { item: Message }) => {
//     const isMine = item.sender?.id === currentUserId;

//     return (
//       <View style={[styles.msg, isMine ? styles.mine : styles.their]}>
//         <RNText style={{ color: isMine ? "#fff" : "#000" }}>
//           {item.content}
//         </RNText>

//         {item.failed && (
//           <RNText style={styles.failed}>Failed to send</RNText>
//         )}

//         <RNText style={styles.time}>
//           {new Date(item.createdAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </RNText>
//       </View>
//     );
//   };

//   if (loadingHistory) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0E0E55" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingWrapper>
//       <SafeAreaView style={{ flex: 1 }}>
//         <View style={{ flex: 1 }}>
//           {/* Optional... if you want to show who you're chatting with */}
//           {params.otherUserId && (
//             <View style={styles.header}>
//               <Image
//                 source={{
//                   uri: "https://ui-avatars.com/api/?name=User",
//                 }}
//                 style={styles.avatar}
//               />
//               <RNText style={styles.name}>
//                 Chat with User {params.otherUserId}
//               </RNText>
//             </View>
//           )}

//           {/* Messages */}
//           <FlatList
//             ref={flatRef}
//             data={messages}
//             keyExtractor={(m) => m.id}
//             renderItem={renderItem}
//             contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
//           />

//           {/* Input */}
//           <ChatInput onSend={sendMessage} disabled={!conversationId} />
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingWrapper>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },

//   header: {
//     flexDirection: "row",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },

//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },

//   name: {
//     fontWeight: "600",
//     fontSize: 16,
//   },

//   msg: {
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 4,
//     maxWidth: "80%",
//   },

//   mine: {
//     backgroundColor: "#0E0E55",
//     alignSelf: "flex-end",
//   },

//   their: {
//     backgroundColor: "#EAEAEA",
//     alignSelf: "flex-start",
//   },

//   failed: {
//     color: "red",
//     fontSize: 10,
//     marginTop: 4,
//   },

//   time: {
//     fontSize: 10,
//     color: "#999",
//     marginTop: 4,
//     alignSelf: "flex-end",
//   },
// });


import React, { useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/auth";

import {
  debugCreateConversation,
  debugFetchMessages,
  debugSendMessage,
} from "@/services/chatApi";

export default function DebugChatTestScreen() {
   const { otherUserId } = useLocalSearchParams();
 

  const user = useAuthStore((s) => s.user);

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);

  function log(message) {
    console.log(message);
    setLogs((prev) => [...prev, message]);
  }

  async function handleCreate() {
    try {
      log("🔵 Creating conversation…");

      const convo = await debugCreateConversation(otherUserId);
        console.log("otherUserId",otherUserId)
      setConversationId(convo.id);
      log("✔ Conversation ID: " + convo.id);
    } catch (err) {
      log("❌ Create failed: " + err);
      console.log("otherUserId",otherUserId)
    }
  }

  async function handleFetch() {
    try {
      if (!conversationId) return log("⚠ No conversationId");

      log("🔵 Fetching messages…");

      const msgs = await debugFetchMessages(conversationId);
      setMessages(msgs);

      log(`✔ Got ${msgs.length} messages`);
    } catch (err) {
      log("❌ Fetch failed: " + err);
    }
  }

  async function handleSend() {
    try {
      if (!conversationId) return log("⚠ No conversationId");

      log("🔵 Sending message…");

      const msg = await debugSendMessage(conversationId, "Hello backend test!");

      log("✔ Message saved: " + JSON.stringify(msg));
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      log("❌ Send failed: " + err);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, padding: 20, justifyContent:"center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        🔧 Chat Debug Tester
      </Text>

      <Text>User ID: {user?.id}</Text>
      <Text>Other User ID: {otherUserId}</Text>
      <Text>Conversation ID: {conversationId ?? "none"}</Text>

      <View style={{ marginVertical: 20 }}>
        <Button title="1️⃣ Create Conversation" onPress={handleCreate} />
      </View>

      <View style={{ marginVertical: 20 }}>
        <Button title="2️⃣ Fetch Messages" onPress={handleFetch} />
      </View>

      <View style={{ marginVertical: 20 }}>
        <Button title="3️⃣ Send Test Message" onPress={handleSend} />
      </View>

      <Text style={{ fontSize: 18, marginTop: 20 }}>📝 Logs:</Text>
      {logs.map((l, i) => (
        <Text key={i} style={{ fontSize: 12, marginTop: 4 }}>
          {l}
        </Text>
      ))}

      <Text style={{ fontSize: 18, marginTop: 20 }}>📨 Messages:</Text>
      {messages.map((m, i) => (
        <Text key={i}>{JSON.stringify(m)}</Text>
      ))}
    </ScrollView>
  );
}
