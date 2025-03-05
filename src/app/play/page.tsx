"use client";
import { clientId } from "@/constants";
import {
  ChannelProvider,
  useChannel,
  usePresence,
  usePresenceListener,
} from "ably/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const RealTime = () => {
  const router = useRouter();
  const { channel, publish } = useChannel("waiting-queue", (message) => {
    console.log(message, "called when usechannel");
  });
  usePresence("waiting-queue");

  useChannel("waiting-queue", "matched", async (message) => {
    const gameId = message.data.gameId;
    const players = message.data.players;

    if (players[0].player1 === clientId) {
      router.push(`/play/${gameId}?color=${players[0].color}`);
    } else if (players[1].player2 === clientId) {
      router.push(`/play/${gameId}?color=${players[1].color}`);
    }

    await channel.presence.leave();
    await channel.detach();
  });

  const { presenceData } = usePresenceListener("waiting-queue");

  const handleMatched = useCallback(async () => {
    const players = [
      {
        player1: presenceData[0].clientId,
        color: "white",
      },
      {
        player2: presenceData[1].clientId,
        color: "black",
      },
    ];
    const gameId = uuidv4();

    await publish("matched", { players, gameId });
  }, [presenceData, publish]);

  useEffect(() => {
    if (typeof window !== "undefined" && presenceData.length >= 2) {
      handleMatched();
    }
  }, [handleMatched, presenceData]);

  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    setDotCount(0); // Ensures it's only initialized in the client
    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 0 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
      <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center w-80">
        <div className="flex space-x-2 mt-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <div className="text-lg font-semibold mt-4 text-gray-700">
          Matching online players
        </div>

        <div className="mt-2 text-gray-500 text-sm">
          <div className="text-blue-500">
            Please wait {Array(dotCount).fill(".").join("")}
          </div>
        </div>
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <ChannelProvider channelName="waiting-queue">
      <RealTime />
    </ChannelProvider>
  );
}
