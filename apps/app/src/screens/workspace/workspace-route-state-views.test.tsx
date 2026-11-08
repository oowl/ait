// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { renderWorkspaceRouteGate } from "./workspace-route-state-views";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

it("shows the workspace load failure and retries directory loading without reconnecting the host", () => {
  const actions = {
    onRetryDirectory: vi.fn(),
    onRetryHost: vi.fn(),
    onManageHost: vi.fn(),
    onDismissMissingWorkspace: vi.fn(),
    onRecoverWorkspace: vi.fn(),
    onRetryRecoveryInspection: vi.fn(),
  };
  render(
    <>
      {renderWorkspaceRouteGate({
        state: { kind: "loadFailed", hostName: "Laptop", error: "Request timed out" },
        actions,
      })}
    </>,
  );
  expect(screen.getByText("workspace.route.loadFailed")).toBeTruthy();
  expect(screen.getByText("Request timed out")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "common.actions.retry" }));
  expect(actions.onRetryDirectory).toHaveBeenCalledTimes(1);
  expect(actions.onRetryHost).not.toHaveBeenCalled();
});
