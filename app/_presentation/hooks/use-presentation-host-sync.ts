import {
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  presentationChannelName,
  type PresentationSnapshot,
  type PresentationSyncMessage,
} from "../presentation-sync";
import type { PresentationAction, PresentationState } from "../types";

interface UsePresentationHostSyncOptions {
  readonly dispatch: Dispatch<PresentationAction>;
  readonly setStartedAt: Dispatch<SetStateAction<number>>;
  readonly startedAt: number;
  readonly state: PresentationState;
}

export function usePresentationHostSync({
  dispatch,
  setStartedAt,
  startedAt,
  state,
}: UsePresentationHostSyncOptions) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const snapshot = useMemo<PresentationSnapshot>(
    () => ({
      currentSceneIndex: state.currentSceneIndex,
      isProgressVisible: state.isProgressVisible,
      startedAt,
      view: state.view,
    }),
    [startedAt, state.currentSceneIndex, state.isProgressVisible, state.view],
  );
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    snapshotRef.current = snapshot;
    channelRef.current?.postMessage({
      type: "PRESENTATION_STATE",
      snapshot,
    } satisfies PresentationSyncMessage);
  }, [snapshot]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel(presentationChannelName);
    channelRef.current = channel;

    function broadcastSnapshot() {
      channel.postMessage({
        type: "PRESENTATION_STATE",
        snapshot: snapshotRef.current,
      } satisfies PresentationSyncMessage);
    }

    channel.addEventListener(
      "message",
      (event: MessageEvent<PresentationSyncMessage>) => {
        if (event.data.type === "PRESENTATION_ACTION") {
          dispatch(event.data.action);
        } else if (event.data.type === "RESET_TIMER") {
          setStartedAt(snapshotRef.current.currentSceneIndex === 0 ? 0 : Date.now());
        } else if (event.data.type === "REQUEST_PRESENTATION_STATE") {
          broadcastSnapshot();
        }
      },
    );

    broadcastSnapshot();
    const heartbeat = window.setInterval(broadcastSnapshot, 2000);

    return () => {
      window.clearInterval(heartbeat);
      channel.close();
      channelRef.current = null;
    };
  }, [dispatch, setStartedAt]);
}
