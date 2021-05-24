// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Result } from "neverthrow";
import {
  FunctionRouter,
  FxError,
  ProjectConfigs,
  QTreeNode,
  Task,
  Void,
  Func,
  Inputs,
  UserInteraction,
} from "./index";

export interface Core {
  
  init: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;

  /**
   * create a project, return the project path
   * Core module will not open the created project, extension will do this
   */
  createProject: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<string, FxError>>;
  
  provisionResources: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;
 
  buildArtifacts: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;
 
  deployArtifacts: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;
 
  publishApplication: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;
 
  createEnv: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;
 
  removeEnv: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;
 
  switchEnv: (
    systemInputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<Void, FxError>>;

  executeUserTask: (
    func: Func,
    inputs: Inputs,
    ui: UserInteraction
  ) => Promise<Result<unknown, FxError>>;

  getProjectConfigs: (
    systemInputs: Inputs
  ) => Promise<Result<ProjectConfigs, FxError>>;

  /**
   * only for CLI
   */
  getQuestionsForLifecycleTask: (
    task: Task,
    inputs: Inputs
  ) => Promise<Result<QTreeNode | undefined, FxError>>;

  /**
   * only for CLI
   */
  getQuestionsForUserTask?: (
    router: FunctionRouter,
    inputs: Inputs
  ) => Promise<Result<QTreeNode | undefined, FxError>>;
}
