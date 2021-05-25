// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Context,
  FxError,
  Inputs,
  ok, 
  ResourcePlugin,
  ResourceScaffoldResult,
  Result,
  Void,
} from "fx-api";
  

export class FrontendPlugin implements ResourcePlugin {
  name = "fx-resource-frontend";
  displayName = "FrontendPlugin";
  
  async scaffoldSourceCode( ctx: Context, inputs: Inputs
  ): Promise<Result<Void, FxError>> {
    return ok(Void);
  }

  async scaffoldResourceTemplate( ctx: Context,  inputs: Inputs
  ): Promise<Result<ResourceScaffoldResult, FxError>> {
    return ok({
      provisionTemplate: {endpoint:"{{frontend-endpoint}}"},
      deployTemplate: {storename: "{{frontend-storename}}"}
    });
  }
}
