import { View, Text, Pressable, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "@/theme/ThemeProvider";
import { Screen } from "@/components/layout/Screen";
import Tab from "@/features/jobs/components/tab";
import JobCard from "@/features/jobs/components/job.card";

const JOBS = [
  {
    id: "1",
    name: "Tunde’s Electricals",
    service: "Electrical Repair",
    date: "Oct 12, 2023",
    amount: "₦15,000",
    rating: 4.8,
    status: "completed",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Bolaji Plumbing",
    service: "Pipe Leakage Fix",
    date: "Oct 05, 2023",
    amount: "₦8,500",
    rating: 5.0,
    status: "completed",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
  },
  {
    id: "3",
    name: "Amara Paints",
    service: "Wall Painting",
    date: "Sep 28, 2023",
    amount: "₦45,000",
    rating: 4.9,
    status: "completed",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d1",
  },
];

export default function JobsScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState<"active" | "completed">("completed");

  const filteredJobs = JOBS.filter(j => j.status === tab);

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          // marginBottom: theme.spacing[5],
        }}
      >
        <Text
          style={{
            fontSize: theme.typography.h2?.fontSize ?? 20,
            fontWeight: theme.typography.h2?.fontWeight ?? "bold",
          }}
        >
          My Jobs
        </Text>
        {/* <Ionicons name="ellipsis-horizontal" size={22} /> */}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", marginBottom: theme.spacing[4] }}>
        <Tab
          label="Active"
          active={tab === "active"}
          onPress={() => setTab("active")}
        />
        <Tab
          label="Completed"
          active={tab === "completed"}
          onPress={() => setTab("completed")}
        />
      </View>

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        renderItem={({ item }) => <JobCard job={item} />}
      />
    </Screen>
  );
}
