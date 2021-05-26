// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Context,
  FxError,
  Inputs,
  Json,
  ok,
  ResourcePlugin,
  ResourceScaffoldResult,
  Result,
  Void,
} from "fx-api";

export interface FunctionProvisionTemplate extends Json{
  defaultFunctionName: string;
  functionAppName:string;
  storageAccountName:string;
  appServicePlanName:string;
  functionEndpoint:string;
}

export interface FunctionDeployTemplate extends Json{

}


export class AzureFunctionPlugin implements ResourcePlugin {
  name = "fx-resource-function";
  displayName = "AzureFunctionPlugin";
  async scaffoldSourceCode( ctx: Context, inputs: Inputs ): Promise<Result<Void, FxError>> {
    return ok(Void);
  }

  async scaffoldResourceTemplate(  ctx: Context,  inputs: Inputs ) : Promise<Result<ResourceScaffoldResult,FxError>>{
    const provision:FunctionProvisionTemplate = {
      defaultFunctionName: "{{function.defaultFunctionName}}",
      functionAppName: "{{function.functionAppName}}",
      storageAccountName: "{{function.storageAccountName}}",
      appServicePlanName: "{{function.appServicePlanName}}",
      functionEndpoint: "{{function.functionEndpoint}}"
    };
    return ok({
      provisionTemplate: provision,
      deployTemplate: {}
    });
  }
}
