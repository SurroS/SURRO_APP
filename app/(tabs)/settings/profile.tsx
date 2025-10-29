// app/profile-information.tsx
import { YStack, XStack, Text, Avatar } from "tamagui";
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { User, MapPin, Heart, LogOut, Camera } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";
import { useState } from "react";

type ProfileItemProps = {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onPress: () => void;
};

export default function ProfileInformationScreen() {
  const router = useRouter();
  const [isDanger, setIsDanger] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "DANGER",
      "Are you sure you want to delete your account? This process is not reversible.",
      [
        {
          text: "OK",
          onPress: () => {
            console.log("Account deleted");  //put the delete action here
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const ProfileItem: React.FC<ProfileItemProps> = ({
    title,
    description,
    icon,
    onPress,
  }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <XStack alignItems="center" gap="$3">
        {icon}
        <YStack flex={1}>
          <Text style={styles.itemTitle}>{title}</Text>
          {description && (
            <Text style={styles.itemDescription}>{description}</Text>
          )}
        </YStack>
      </XStack>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <YStack gap="$4" alignItems="center" paddingTop="$6">
        <Avatar size="$10">
          <Avatar.Image src={require("@/assets/images/avatar.jpg")} />
          <Avatar.Fallback backgroundColor="#ccc" />
        </Avatar>

        <TouchableOpacity style={{flexDirection:"row"}}>
          <Text style={styles.changePhoto}>Change profile picture </Text>
          <Camera color={colors.primary} size={16}/> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit bio</Text>
        </TouchableOpacity>
      </YStack>

      <YStack marginTop="$5" gap="$3">
        <ProfileItem
          title="Personal details"
          description="Name, country of origin, height, Date of birth"
          icon={<User size={18} color={colors.primary} />}
          onPress={() => router.push("/personal-details")}
        />
        <ProfileItem
          title="Contact information"
          description="Country, state, street, zip code."
          icon={<MapPin size={18} color={colors.primary} />}
          onPress={() => router.push("/contact-information")}
        />
        <ProfileItem
          title="Medical history"
          description="Blood group, genotype."
          icon={<Heart size={18} color={colors.primary} />}
          onPress={() => router.push("/medical-history")}
        />
      </YStack>

      <YStack marginTop="$6" gap="$3">
        <TouchableOpacity style={styles.logout}>
          <XStack alignItems="center" gap="$2">
            <LogOut size={16} color={colors.primary} />
            <Text style={styles.logoutText}>Log out</Text>
          </XStack>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.itemContainer]}onPress={() => setIsDanger(!isDanger)}>
          <Text style={[styles.deactivate,{marginBottom:10}]}>Danger zone</Text>
        </TouchableOpacity>
        {isDanger && (
          <TouchableOpacity  onPress={handleDeleteAccount}>
            <Text style={styles.deactivate}>Deactivate account</Text>
          </TouchableOpacity>
        )}
      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  changePhoto: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#5A5AED",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: "#F6F6FF",
    borderRadius: 10,
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E0E55",
  },
  itemDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  deactivate: {
    color: "#E63946",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
  logout: {
    alignSelf: "center",
    marginTop: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E0E55",
  },
});
