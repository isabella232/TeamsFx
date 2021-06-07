// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStage, Stage } from "../interfaces/IStage";
import { provisionInputConfig, provisionOutputConfig } from "../constants/configs";
import { PluginContext } from "@microsoft/teamsfx-api";
import { AadResult, ResultFactory } from "../aadResult";
import { Constants } from "../constants/constants";
import { ConfigErrorMessages, GetConfigError } from "../errors";
import { Configs } from "../utils/config";

export class Provision extends Stage {
	private static displayName?: string;

	private static async init(ctx: PluginContext, islocalDebug: boolean): Promise<void> {
		const displayName: string = ctx.app.name.short;
		if (displayName) {
			Provision.displayName = displayName.substr(0, Constants.aadAppMaxLength) as string;
		} else {
			throw ResultFactory.SystemError(
				GetConfigError.name,
				GetConfigError.message(ConfigErrorMessages.GetDisplayNameError)
			);
		}

		Configs.readConfig(ctx, inputConfig, isLocalDebug);
	}

	public static async run(ctx: PluginContext, islocalDebug: boolean): Promise<AadResult> {
		return ResultFactory.Success();
	}

	public async end(): Promise<void> {
		Configs.saveConfig(this.ctx, this.outputConfig, this.isLocalDebug);
	}
}