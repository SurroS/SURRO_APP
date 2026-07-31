// import React, { useEffect, useRef } from "react";
// import { ScrollView, TouchableOpacity } from "react-native";
// import { YStack, XStack, Text, Button } from "tamagui";
// import { useNotificationStore, Notification } from "@/store/notifications";
// import NotificationItem from "./NotificationItem";
// import colors from "@/hooks/colors";

// export default function InactivityDemo() {
//   const { notifications, addLocal, markRead, deleteNotification } =
//     useNotificationStore();

//   const inactivityTimer = useRef<number | null>(null);

//   const resetTimer = () => {
//     if (inactivityTimer.current) {
//       clearTimeout(inactivityTimer.current);
//     }

//     inactivityTimer.current = setTimeout(() => {
//       addLocal({
//         title: "We miss you!",
//         body: "You haven't interacted with the app for a while. Come back and check your profile!",
//         type: "GENERAL",
//         role: "INTENDED_PARENT",
//       });
//     }, 10_000); // 10 seconds
//   };

//   useEffect(() => {
//     resetTimer();

//     return () => {
//       if (inactivityTimer.current) {
//         clearTimeout(inactivityTimer.current);
//       }
//     };
//   }, []);

//   return (
//     <ScrollView style={{ flex: 1, padding: 20 }} onTouchStart={resetTimer}>
//       <YStack gap={16}>
//         <Text color={colors.text} fontWeight="700" fontSize={18}>
//           Inactivity Notification Demo
//         </Text>

//         <Text>
//           If you do not interact with the app for 10 seconds, a notification
//           will appear.
//         </Text>

//         {notifications.length === 0 && <Text>No notifications yet.</Text>}

//         {notifications.map((n: Notification) => (
//           <YStack key={n.id}>
//             <NotificationItem item={n} />

//             <XStack gap={8} paddingHorizontal="$4" marginBottom="$3">
//               {!n.read && (
//                 <Button size="$2" onPress={() => markRead(n.id)}>
//                   Mark Read
//                 </Button>
//               )}
//               <Button
//                 size="$2"
//                 theme="red"
//                 onPress={() => deleteNotification(n.id)}
//               >
//                 Delete
//               </Button>
//             </XStack>
//           </YStack>
//         ))}

//         <TouchableOpacity
//           style={{
//             marginTop: 20,
//             padding: 12,
//             backgroundColor: "#0E0E55",
//             borderRadius: 8,
//           }}
//           onPress={resetTimer}
//         >
//           <Text color="white" fontWeight="600">
//             Simulate Interaction (Reset Timer)
//           </Text>
//         </TouchableOpacity>
//       </YStack>
//     </ScrollView>
//   );
// }
