// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as os from "os";
import * as extensionPackage from "./../../package.json";
import * as fs from "fs-extra";
import * as path from "path";
import { ConfigFolderName } from "fx-api";
import { getWorkspacePath } from "../handlers";

export function getPackageVersion(versionStr: string): string {
  if (versionStr.includes("alpha")) {
    return "alpha";
  }

  if (versionStr.includes("beta")) {
    return "beta";
  }

  if (versionStr.includes("rc")) {
    return "rc";
  }

  return "formal";
}

export function isFeatureFlag(): boolean {
  return extensionPackage.featureFlag === "true";
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export function isWindows() {
  return os.type() === "Windows_NT";
}

export function isMacOS() {
  return os.type() === "Darwin";
}

export function isLinux() {
  return os.type() === "Linux";
}

export function getActiveEnv() {
  // TODO: need to get active env if multiple env configurations supported
  return "default";
}

export function isWorkspaceSupported(workspace: string): boolean {
  const p = workspace;

  // some validation
  const checklist: string[] = [
    p,
    `${p}/package.json`,
    `${p}/.${ConfigFolderName}`,
    `${p}/.${ConfigFolderName}/settings.json`,
    `${p}/.${ConfigFolderName}/env.default.json`
  ];

  for (const fp of checklist) {
    if (!fs.pathExistsSync(path.resolve(fp))) {
      return false;
    }
  }
  return true;
}

export function getTeamsAppId() {
  const wpath = getWorkspacePath();
  if (wpath) {
    if (isWorkspaceSupported(wpath)) {
      const env = getActiveEnv();
      const envJsonPath = path.join(wpath, `.${ConfigFolderName}/env.${env}.json`);
      const envJson = JSON.parse(fs.readFileSync(envJsonPath, "utf8"));
      return envJson.solution.remoteTeamsAppId;
    }
  }

  return undefined;
}
