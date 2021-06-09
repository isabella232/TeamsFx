// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Plugin, PluginContext, SystemError, UserError, err, LogLevel } from "@microsoft/teamsfx-api";
import { AadResult, ResultFactory } from "./aadResult";
import { Plugins } from "./constants/constants";
import { UnhandledError } from "./errors";
import { Provision } from "./stages/provision";
import { Stage } from "../commonUtils/interfaces/Stages";

export class AadAppForTeamsPlugin implements Plugin {
  public async provision(ctx: PluginContext): Promise<AadResult> {
    const provisionRes = new Provision(ctx, false, Plugins.AADPlugin);
    try {
      const res = await provisionRes.run();
      return res;
    } catch (error) {
      return this.returnError(provisionRes, error);
    }
  }

  public async localDebug(ctx: PluginContext): Promise<AadResult> {
    const provisionRes = new Provision(ctx, true, Plugins.AADPlugin);
    try {
      const res = await provisionRes.run();
      return res;
    } catch (error) {
      return this.returnError(provisionRes, error);
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

  private returnError(stage: Stage, error: any): AadResult {
    if (!(error instanceof SystemError || error instanceof UserError)) {
      if (!(error instanceof Error)) {
        error = new Error(error.toString());
      }
      error = ResultFactory.SystemError("UnhandledError", `Unhandled Error: ${error.message}`);
    }

    let detailedErrorMessage: string | undefined;
    if (error.innerError) {
      detailedErrorMessage += ` Detailed error: ${error.innerError.message}.`;
      if (error.innerError.response?.data?.errorMessage) {
        detailedErrorMessage += ` Reason: ${error.innerError.response?.data?.errorMessage}`;
      }
    }

    stage.sendLog(error.message, LogLevel.Error);
    if (detailedErrorMessage) {
      stage.sendLog(error.message, LogLevel.Error);
    }

    stage.sendTelemetryErrorEvent(error, detailedErrorMessage);
    stage.progressBar?.end();
    return err(error);
  }
}