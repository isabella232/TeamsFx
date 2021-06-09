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

	constructor(ctx: PluginContext, plugin: IPlugin, isLocalDebug = false) {
		super(ctx, plugin, isLocalDebug);
	}

	public async run(): Promise<AadResult> {
		this.sendStartTelemetryEvent();
		this.readConfig();
		this.setConfig(Plugins.AADPlugin.configKeys.clientId, this.getConfig(Plugins.AADPlugin.configKeys.permissionRequest));
    // throw new Error("test");
    // throw ResultFactory.UserError("user","test");
    this.createProgressBar("test", 2);
    await this.progressBar?.start("1");
    await this.progressBar?.next("2");
    await this.progressBar?.end();
		this.saveConfig();
		this.sendTelemetryEvent();
		return ResultFactory.Success();
	}
}