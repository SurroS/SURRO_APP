import { StyleSheet } from 'react-native';
import { YStack } from 'tamagui';
import ProfileData from './profile-data';

export default function SurrogateScreen() {

  return (
    <YStack padding="$4" gap="$4">
      <ProfileData />
    </YStack>
  );
}

const styles = StyleSheet.create({

});