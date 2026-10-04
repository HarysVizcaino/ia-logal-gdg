import { useCallback, useEffect, useRef, useState } from "react";

import {
  presentationChannelName,
  type PresentationSnapshot,
  type PresentationSyncMessage,
} from "../presentation-sync";
import type { PresentationAction } from "../types";

export function usePresenterSync() {
  const [snapshot, setSnapshot] = useState<PresentationSnapshot | null>(null);
  const [lastSeenAt, setLastSeenAt] = useState(0);
  const [connectionClock, setConnectionClock] = useState(() => Date.now());
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const nextChannel = new BroadcastChannel(presentationChannelName);
    channelRef.current = nextChannel;

    function requestState() {
      nextChannel.postMessage({
        type: "REQUEST_PRESENTATION_STATE",
      } satisfies PresentationSyncMessage);
    }

    nextChannel.addEventListener(
      "message",
      (event: MessageEvent<PresentationSyncMessage>) => {
        if (event.data.type === "PRESENTATION_STATE") {
          setSnapshot(event.data.snapshot);
          setLastSeenAt(Date.now());
        }
      },
    );

    requestState();
    const stateRequest = window.setInterval(requestState, 2000);
    const connectionTimer = window.setInterval(
      () => setConnectionClock(Date.now()),
      1000,
    );

    return () => {
      window.clearInterval(stateRequest);
      window.clearInterval(connectionTimer);
      nextChannel.close();
      channelRef.current = null;
    };
  }, []);

  const sendAction = useCallback(
    (action: PresentationAction) => {
      channelRef.current?.postMessage({
        type: "PRESENTATION_ACTION",
        action,
      } satisfies PresentationSyncMessage);
    },
    [],
  );

  const resetTimer = useCallback(() => {
    channelRef.current?.postMessage({
      type: "RESET_TIMER",
    } satisfies PresentationSyncMessage);
  }, []);

  return {
    isConnected: Boolean(snapshot && connectionClock - lastSeenAt < 5000),
    resetTimer,
    sendAction,
    snapshot,
  };
}
