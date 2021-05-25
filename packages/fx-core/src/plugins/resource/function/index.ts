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
 
export class AzureFunctionPlugin implements ResourcePlugin {
  name = "fx-resource-function";
  displayName = "AzureFunctionPlugin";
  async scaffoldSourceCode( ctx: Context, inputs: Inputs ): Promise<Result<Void, FxError>> {
    return ok(Void);
  }

  async scaffoldResourceTemplate(  ctx: Context,  inputs: Inputs ) : Promise<Result<ResourceScaffoldResult,FxError>>{
    return ok({
      provisionTemplate: {endpoint:"function-endpoint"},
      deployTemplate: {path: "/api/"}
    });
  }
}
