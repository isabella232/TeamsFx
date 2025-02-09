// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

import { Argv, Options } from "yargs";
import * as path from "path";

import {
  FxError,
  err,
  ok,
  Result,
  ConfigMap,
  Stage,
  Platform,
  MultiSelectQuestion,
  OptionItem,
  traverse,
  UserCancelError
} from "@microsoft/teamsfx-api";

import activate, { coreExeceutor } from "../activate";
import * as constants from "../constants";
import { YargsCommand } from "../yargsCommand";
import { flattenNodes, getParamJson } from "../utils";
import CliTelemetry from "../telemetry/cliTelemetry";
import { TelemetryEvent, TelemetryProperty, TelemetrySuccess } from "../telemetry/cliTelemetryEvents";
import CLIUIInstance from "../userInteraction";

export default class Deploy extends YargsCommand {
  public readonly commandHead = `deploy`;
  public readonly command = `${this.commandHead} [components...]`;
  public readonly description = "Deploy the current application.";
  public readonly paramPath = constants.deployParamPath;

  public params: { [_: string]: Options } = getParamJson(this.paramPath);
  public readonly deployPluginNodeName = "deploy-plugin";

  public builder(yargs: Argv): Argv<any> {
    const deployPluginOption = this.params[this.deployPluginNodeName];
    yargs
      .positional("components", {
        array: true,
        choices: deployPluginOption.choices,
        description: deployPluginOption.description
      });
    for (const name in this.params) {
      if (name !== this.deployPluginNodeName) {
        yargs.options(name, this.params[name]);
      }
    }
    return yargs.version(false);
  }

  public async runCommand(args: { [argName: string]: string | string[] | undefined }): Promise<Result<null, FxError>> {
    if (!("open-api-document" in args)) {
      args["open-api-document"] = undefined;
    }
    if (!("api-prefix" in args)) {
      args["api-prefix"] = undefined;
    }
    if (!("api-version" in args)) {
      args["api-version"] = undefined;
    }
    const rootFolder = path.resolve(args.folder as string || "./");
    CliTelemetry.withRootFolder(rootFolder).sendTelemetryEvent(TelemetryEvent.DeployStart);

    CLIUIInstance.updatePresetAnswers(args);
    CLIUIInstance.removePresetAnswers(["components"]);

    const result = await activate(rootFolder);
    if (result.isErr()) {
      CliTelemetry.sendTelemetryErrorEvent(TelemetryEvent.Deploy, result.error);
      return err(result.error);
    }

    const answers = new ConfigMap();

    const core = result.value;
    {
      const result = await core.getQuestions!(Stage.deploy, Platform.CLI);
      if (result.isErr()) {
        CliTelemetry.sendTelemetryErrorEvent(TelemetryEvent.Deploy, result.error);
        return err(result.error);
      }
      const node = result.value;
      if (node) {
        const allNodes = flattenNodes(node);
        const deployPluginNode = allNodes.find(node => node.data.name === this.deployPluginNodeName)!;
        const components = args.components as string[] || [];
        const option = (deployPluginNode.data as MultiSelectQuestion).option as OptionItem[];
        if (components.length === 0) {
          CLIUIInstance.updatePresetAnswer(this.deployPluginNodeName, option.map(op => op.id));
        } else {
          CLIUIInstance.updatePresetAnswer(this.deployPluginNodeName, components);
        }
        const result = await traverse(node, answers, CLIUIInstance, coreExeceutor);
        if (result.type === "error" && result.error) {
          return err(result.error);
        } else if (result.type === "cancel") {
          return err(UserCancelError);
        }
      }
    }

    {
      const result = await core.deploy(answers);
      if (result.isErr()) {
        CliTelemetry.sendTelemetryErrorEvent(TelemetryEvent.Deploy, result.error);
        return err(result.error);
      }
    }

    CliTelemetry.sendTelemetryEvent(TelemetryEvent.Deploy, {
      [TelemetryProperty.Success]: TelemetrySuccess.Yes
    });
    return ok(null);
  }
}
