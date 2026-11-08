// @vitest-environment jsdom
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useWorkspaceDirectoryDemand } from "./use-workspace-directory-demand";

const { acquireDirectoryDemand } = vi.hoisted(() => ({ acquireDirectoryDemand: vi.fn() }));
vi.mock("@/runtime/host-runtime", () => ({
  getHostRuntimeStore: () => ({ acquireDirectoryDemand }),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

it("loads the focused workspace independently of sidebar and chat tabs, and releases on blur", () => {
  const release = vi.fn();
  acquireDirectoryDemand.mockReturnValue(release);
  const { rerender, unmount } = renderHook(
    ({ focused }) => useWorkspaceDirectoryDemand("host", "workspace", focused),
    { initialProps: { focused: true } },
  );
  expect(acquireDirectoryDemand).toHaveBeenCalledWith("host");
  rerender({ focused: false });
  expect(release).toHaveBeenCalledTimes(1);
  rerender({ focused: true });
  expect(acquireDirectoryDemand).toHaveBeenCalledTimes(2);
  unmount();
  expect(release).toHaveBeenCalledTimes(2);
});

it("waits for route params and transfers demand when the host changes", () => {
  const releaseFirst = vi.fn();
  const releaseSecond = vi.fn();
  acquireDirectoryDemand.mockReturnValueOnce(releaseFirst).mockReturnValueOnce(releaseSecond);
  const { rerender, unmount } = renderHook(
    ({ serverId, workspaceId }) => useWorkspaceDirectoryDemand(serverId, workspaceId, true),
    { initialProps: { serverId: "", workspaceId: "" } },
  );
  expect(acquireDirectoryDemand).not.toHaveBeenCalled();
  rerender({ serverId: "first", workspaceId: "workspace" });
  rerender({ serverId: "second", workspaceId: "workspace" });
  expect(releaseFirst).toHaveBeenCalledTimes(1);
  expect(acquireDirectoryDemand).toHaveBeenLastCalledWith("second");
  unmount();
  expect(releaseSecond).toHaveBeenCalledTimes(1);
});
