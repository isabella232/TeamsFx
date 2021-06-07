// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PluginContext } from "@microsoft/teamsfx-api";
import { AadResult } from "../aadResult";
import { IConfig } from "./IConfig";

export interface IStage {
    inputConfig?: IConfig,
    outputConfig?: IConfig,

    init: (ctx: PluginContext, islocalDebug: boolean) => Promise<void>;
    run: (ctx: PluginContext, islocalDebug: boolean) => Promise<AadResult>;
    end: (ctx: PluginContext, islocalDebug: boolean) => Promise<void>;
};

export abstract class Stage {
    inputConfig?: IConfig;
    outputConfig?: IConfig;
    
    abstract run(ctx: PluginContext, islocalDebug: boolean): Promise<AadResult>;
}