import React, { useState } from "react";
import { YStack, Text, Button, Sheet } from "tamagui";

interface Props {
  selectedSocial: string;
  setSelectedSocial: (social: string) => void;
  onAdd: () => void;
}

const SOCIAL_OPTIONS = ["Instagram", "Twitter", "Facebook", "LinkedIn"];

export default function SocialSelector({ selectedSocial, setSelectedSocial, onAdd }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onPress={() => setOpen(true)}
        width="100%"
        height={44}
        borderRadius={12}
        backgroundColor="$gray2"
        justifyContent="space-between"
        paddingHorizontal={12}
      >
        <Text>{selectedSocial}</Text>
        <Text>▼</Text>
      </Button>

      <Sheet
        modal
        dismissOnSnapToBottom
        open={!!open} // normalize boolean
        onOpenChange={(val: boolean) => setOpen(!!val)}
      >
        <Sheet.Frame>
          <Sheet.ScrollView contentContainerStyle={{ padding: 20 }}>
            {SOCIAL_OPTIONS.map((social) => (
              <Button
                key={social}
                onPress={() => {
                  setSelectedSocial(social);
                  setOpen(false);
                }}
                backgroundColor="$background"
                borderRadius={8}
                marginBottom={12}
              >
                <Text>{social}</Text>
              </Button>
            ))}

            <Button
              onPress={onAdd}
              backgroundColor="$primary"
              borderRadius={12}
              marginTop={16}
              height={44}
            >
              <Text color="white" fontWeight="700">
                Add
              </Text>
            </Button>
          </Sheet.ScrollView>
        </Sheet.Frame>
        <Sheet.Overlay />
      </Sheet>
    </>
  );
}
