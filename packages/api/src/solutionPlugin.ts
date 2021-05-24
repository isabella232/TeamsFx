// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { Result } from "neverthrow";  
import { Context, EnvMeta, FunctionRouter, FxError, Inputs, QTreeNode, Task, TokenProvider, Func, Json } from "./index";

 
export interface SolutionProvisionContext extends Context {
    env: EnvMeta;
    tokenProvider: TokenProvider;
    resourceConfigs: Record<string, Json>;
}

export type SolutionDeployContext = SolutionProvisionContext;
 
export interface SolutionScaffoldResult{
  provisionTemplates:Record<string, Json>;
  deployTemplates: Record<string, Json>;
}
 
export interface SolutionAllContext extends Context {
    env: EnvMeta;
    tokenProvider: TokenProvider;
    provisionConfigs?: Record<string, Json>;
    deployConfigs?: Record<string, Json>;
}


export interface SolutionProvisionResult{
  resourceValues: Record<string, string>;
  stateValues: Record<string, string>;
  solutionState: Json;
}
 

export interface SolutionPlugin {
    
    name:string,
    
    displayName:string,
 
    scaffoldFiles: (ctx: Context, inputs: Inputs) => Promise<Result<SolutionScaffoldResult, FxError>>;
 
    buildArtifacts: (ctx: Context, inputs: Inputs) => Promise<Result<undefined, FxError>>;
 
    provisionResources: (ctx: SolutionProvisionContext, inputs: Inputs) => Promise<Result<SolutionProvisionResult, FxError>>;
 
    deployArtifacts: (ctx: SolutionDeployContext, inputs: Inputs) => Promise<Result<SolutionProvisionResult, FxError>>;
  
    publishApplication: (ctx: SolutionAllContext, inputs: Inputs) => Promise<Result<SolutionProvisionResult, FxError>>;
    /**
     * get question model for lifecycle {@link Task} (create, provision, deploy, publish), Questions are organized as a tree. Please check {@link QTreeNode}.
     */
    getQuestionsForLifecycleTask: (ctx: SolutionAllContext, task: Task, inputs: Inputs) => Promise<Result<QTreeNode|undefined, FxError>>;

    /**
     * get question model for plugin customized {@link Task}, Questions are organized as a tree. Please check {@link QTreeNode}.
     */
    getQuestionsForUserTask?: (ctx: SolutionAllContext, router: FunctionRouter, inputs: Inputs) => Promise<Result<QTreeNode|undefined, FxError>>;

    /**
     * execute user customized task, for example `Add Resource`, `Add Capabilities`, etc
     */
    executeUserTask?: (ctx: SolutionAllContext, func:Func, inputs: Inputs) => Promise<Result<unknown, FxError>>;
}
