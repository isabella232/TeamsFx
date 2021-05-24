// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Context,
  Json,
  SolutionProvisionContext,
  SolutionPlugin,
  TokenProvider,
} from "fx-api";

export interface CoreContext extends Context {
  globalSolutions: Map<string, SolutionPlugin>;

  solution?: SolutionPlugin;

  provisionTemplates?: Record<string, Json>;

  deployTemplates?: Record<string, Json>;

  resourceInstanceValues?: Record<string, string>;

  stateValues?: Record<string, string>;

  tokenProvider: TokenProvider;

  solutionContext?: SolutionProvisionContext;
}
