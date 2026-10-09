import { Image, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity } from "expo-widgets";

function RevisionActivity(props) {
  "widget";

  return {
    banner: (
      <VStack modifiers={[padding({ all: 16 })]}>
        <Text
          modifiers={[
            font({ weight: "bold", size: 16 }),
            foregroundStyle("#A78BFA"),
          ]}
        >
          ANIME LEVEL
        </Text>

        <Text modifiers={[font({ size: 26, weight: "bold" })]}>
          {props.status}
        </Text>

        {props.status === "PAUSED" ? (
          <Text
            modifiers={[
              font({ size: 26, weight: "bold" }),
              foregroundStyle("#A78BFA"),
            ]}
          >
            {props.pausedDisplay}
          </Text>
        ) : (
          <Text
            date={new Date(props.startTimestamp)}
            dateStyle="timer"
            modifiers={[
              font({ size: 26, weight: "bold" }),
              foregroundStyle("#A78BFA"),
            ]}
          />
        )}
      </VStack>
    ),

    compactLeading: <Image systemName="bolt.fill" color="#A78BFA" />,

    compactTrailing: (
      <Text>
        {props.status === "PAUSED" ? props.pausedDisplay : `${props.minutes}m`}
      </Text>
    ),

    minimal: <Image systemName="bolt.fill" color="#A78BFA" />,

    expandedLeading: <Text>ANIME LEVEL</Text>,

    expandedTrailing: (
      <Text>
        {props.status === "PAUSED"
          ? props.pausedDisplay
          : `${props.minutes} min`}
      </Text>
    ),

    expandedBottom: <Text>{props.status}</Text>,
  };
}

export default createLiveActivity("RevisionActivity", RevisionActivity);
