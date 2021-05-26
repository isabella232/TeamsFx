// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { LogProvider } from "./log";
import { TokenProvider } from "./login";
import { TelemetryReporter } from "./telemetry";
import { TreeProvider } from "./tree";
import { UserInteraction } from "../ui";
import { AccountManager } from "../account/account";

export * from "./login";
export * from "./log";
export * from "./telemetry";

export interface Tools
{
    logger: LogProvider;
    accountManager: AccountManager;
    telemetryReporter: TelemetryReporter;
    userInteraction: UserInteraction;
    treeProvider?: TreeProvider;
}