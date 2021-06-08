// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Plugin, PluginContext, SystemError, UserError, err } from "@microsoft/teamsfx-api";
import { AadResult, ResultFactory } from "./aadResult";
import { Plugins } from "./constants/constants";
import { UnhandledError } from "./errors";
import { Provision } from "./stages/provision";

export class AadAppForTeamsPlugin implements Plugin {
	public async provision(ctx: PluginContext): Promise<AadResult> {
		try {
			const provisionRes = new Provision(ctx, false, Plugins.AADPlugin);
			const res = await provisionRes.run();
			return res;
		} catch (error) {
			return this.returnError(error, ctx);
		}
	}

	public async localDebug(ctx: PluginContext): Promise<AadResult> {
		try {
			const provisionRes = new Provision(ctx, true, Plugins.AADPlugin);
			const res = await provisionRes.run();
			return res;
		} catch (error) {
			return this.returnError(error, ctx);
		}
	}

	public setApplicationInContext(ctx: PluginContext, isLocalDebug = false): AadResult {
		return ResultFactory.Success();
	}

	public async postProvision(ctx: PluginContext): Promise<AadResult> {
		return ResultFactory.Success();
	}

	public async postLocalDebug(ctx: PluginContext): Promise<AadResult> {
		return ResultFactory.Success();
	}

	private returnError(e: any, ctx: PluginContext): AadResult {
		if (e instanceof SystemError || e instanceof UserError) {
			let errorMessage = e.message;
			if (e.innerError) {
				errorMessage += ` Detailed error: ${e.innerError.message}.`;
				if (e.innerError.response?.data?.errorMessage) {
					errorMessage += ` Reason: ${e.innerError.response?.data?.errorMessage}`;
				}
			}
			ctx.logProvider?.error(errorMessage);
			return err(e);
		} else {
			if (!(e instanceof Error)) {
				e = new Error(e.toString());
			}

			ctx.logProvider?.error(e.message);
			return err(
				ResultFactory.SystemError(
					UnhandledError.name,
					UnhandledError.message(),
					e,
					undefined,
					undefined
				)
			);
		}
	}
}