import { PrimaryButton } from "@/components/ui/buttons";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <PrimaryButton
        onPress={() => {
          console.log("button clicked")
        }}
        label="Primary Button"
      />
    </View>
  );
}
