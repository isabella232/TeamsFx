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
  Tools
} from "./index";

export interface Core {

  init: (tools:Tools) => Promise<Result<Void, FxError>>;

  /**
   * create a project, return the project path
   * Core module will not open the created project after creation
   */
  createProject: ( systemInputs: Inputs ) => Promise<Result<string, FxError>>;

  provisionResources: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;

  buildArtifacts: ( systemInputs: Inputs ) => Promise<Result<Void, FxError>>;

  deployArtifacts: ( systemInputs: Inputs ) => Promise<Result<Void, FxError>>;

  publishApplication: ( systemInputs: Inputs ) => Promise<Result<Void, FxError>>;

  createEnv: ( systemInputs: Inputs ) => Promise<Result<Void, FxError>>;

  removeEnv: ( systemInputs: Inputs ) => Promise<Result<Void, FxError>>;

  switchEnv: ( systemInputs: Inputs ) => Promise<Result<Void, FxError>>;

  executeUserTask: ( func: Func, inputs: Inputs ) => Promise<Result<unknown, FxError>>;
  /**
   * only for CLI
   */
  getQuestionsForLifecycleTask: ( task: Task, inputs: Inputs ) => Promise<Result<QTreeNode | undefined, FxError>>;
  
  getQuestionsForUserTask?: ( router: FunctionRouter, inputs: Inputs ) => Promise<Result<QTreeNode | undefined, FxError>>;
}
