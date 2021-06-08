// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stage } from "../../commonUtils/interfaces/Stages";
import { Events } from "../../commonUtils/constants/events";
import { PluginContext } from "@microsoft/teamsfx-api";
import { IPlugin } from "../../commonUtils/interfaces/IPlugin";
import { AadResult, ResultFactory } from "../aadResult";
import { provisionInputConfig, provisionOutputConfig } from "../constants/configs";
import { Plugins } from "../constants/constants";

export class Provision extends Stage {
    event = this.isLocalDebug ? Events.LocalDebug : Events.Provision;
    inputConfig = provisionInputConfig;
    outputConfig = provisionOutputConfig;

    constructor(ctx: PluginContext, isLocalDebug = false, plugin: IPlugin) {
        super(ctx, isLocalDebug, plugin);
    }

    public async run(): Promise<AadResult> {
        this.sendStartTelemetryEvent();
        this.readConfig();
        this.setConfig(Plugins.AADPlugin.configKeys.clientId, "abc");
        this.saveConfig();
        this.sendTelemetryEvent();
        return ResultFactory.Success();
    }
}