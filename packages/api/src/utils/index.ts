// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { LogProvider } from "./log";
import { TokenProvider } from "./login";
import { TelemetryReporter } from "./telemetry";
import { TreeProvider } from "../ui/tree";
import { UserInteraction } from "../ui";
import { UserError } from "../error";

export * from "./login";
export * from "./log";
export * from "./telemetry";
export * from "../ui/tree";

export interface Tools
{
    logProvider: LogProvider;
    tokenProvider: TokenProvider;
    telemetryReporter: TelemetryReporter;
    treeProvider: TreeProvider;
    userInteraction: UserInteraction;
}

export const CancelError:UserError = new UserError("UserCancel", "UserCancel", "UI");