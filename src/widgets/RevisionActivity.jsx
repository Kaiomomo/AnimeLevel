import {
  HStack,
  Image,
  ProgressView,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";

import {
  font,
  foregroundStyle,
  padding,
  tint,
} from "@expo/ui/swift-ui/modifiers";

import { createLiveActivity } from "expo-widgets";

function RevisionActivity(props) {
  "widget";

  // Keep XP between 0% and 100%.
  const xp = Math.max(0, Math.min(100, props.progress ?? 0));

  const isPaused = props.status === "PAUSED";

  return {
    banner: (
      <VStack spacing={10} modifiers={[padding({ all: 14 })]}>
        {/* HEADER: App name and current level */}
        <HStack spacing={6}>
          <Image systemName="bolt.fill" color="#A78BFA" />

          <Text
            modifiers={[
              font({ size: 13, weight: "bold" }),
              foregroundStyle("#C4B5FD"),
            ]}
          >
            ANIME LEVEL
          </Text>

          <Spacer />

          <Text
            modifiers={[
              font({ size: 12, weight: "bold" }),
              foregroundStyle("#C4B5FD"),
            ]}
          >
            LVL {props.level ?? 0}
          </Text>
        </HStack>

        {/* MIDDLE: Timer on left, XP percentage on right */}
        <HStack spacing={12}>
          <VStack spacing={4}>
            <Text
              modifiers={[
                font({ size: 11, weight: "bold" }),
                foregroundStyle("#A78BFA"),
              ]}
            >
              {isPaused ? "PAUSED" : "FOCUS MODE"}
            </Text>

            {isPaused ? (
              <Text
                modifiers={[
                  font({ size: 28, weight: "bold" }),
                  foregroundStyle("#FFFFFF"),
                ]}
              >
                {props.pausedDisplay ?? "0:00"}
              </Text>
            ) : (
              <Text
                date={new Date(props.startTimestamp)}
                dateStyle="timer"
                modifiers={[
                  font({ size: 28, weight: "bold" }),
                  foregroundStyle("#FFFFFF"),
                ]}
              />
            )}
          </VStack>

          <Spacer />

          <VStack spacing={4}>
            <Text
              modifiers={[
                font({ size: 10, weight: "bold" }),
                foregroundStyle("#A9A0BA"),
              ]}
            >
              NEXT LEVEL XP
            </Text>

            <Text
              modifiers={[
                font({ size: 23, weight: "bold" }),
                foregroundStyle("#C4B5FD"),
              ]}
            >
              {Math.floor(xp)}%
            </Text>
          </VStack>
        </HStack>

        {/* XP BAR */}
        <ProgressView
          value={xp / 100}
          total={1}
          modifiers={[tint("#A78BFA")]}
        />
      </VStack>
    ),

    compactLeading: <Image systemName="bolt.fill" color="#A78BFA" />,

    compactTrailing: (
      <Text>
        {isPaused ? (props.pausedDisplay ?? "0:00") : `${props.minutes ?? 0}m`}
      </Text>
    ),

    minimal: <Image systemName="bolt.fill" color="#A78BFA" />,

    expandedLeading: <Text>ANIME LEVEL</Text>,

    expandedTrailing: (
      <Text>
        {isPaused
          ? (props.pausedDisplay ?? "0:00")
          : `${props.minutes ?? 0} min`}
      </Text>
    ),

    expandedBottom: (
      <Text>
        LVL {props.level ?? 0} | XP {Math.floor(xp)}%
      </Text>
    ),
  };
}

export default createLiveActivity("RevisionActivity", RevisionActivity);
