import { useEffect } from "react";
import { getHostRuntimeStore } from "@/runtime/host-runtime";

/** A visible workspace needs its directory even with no sidebar or open chats. */
export function useWorkspaceDirectoryDemand(
  serverId: string,
  workspaceId: string,
  isRouteFocused: boolean,
): void {
  useEffect(() => {
    if (!isRouteFocused || !serverId || !workspaceId) return;
    return getHostRuntimeStore().acquireDirectoryDemand(serverId);
  }, [serverId, workspaceId, isRouteFocused]);
}
