// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Context,
  FxError,
  Inputs,
  Json,
  ok, 
  ResourceConfigureContext, 
  ResourcePlugin,
  ResourceScaffoldResult,
  Result,
  Void,
} from "fx-api";
import { AzureFunctionPlugin, FunctionProvisionTemplate } from "../function";

export interface FeProvisionTemplate extends Json{
  endpoint: string;
  domain: string;
  storageName: string;
}

export interface FeDeployTemplate extends Json{

}

export class FrontendPlugin implements ResourcePlugin {
  name = "fx-resource-frontend";
  displayName = "FrontendPlugin";
  
  async scaffoldSourceCode( ctx: Context, inputs: Inputs
  ): Promise<Result<Void, FxError>> {
    return ok(Void);
  }

  async scaffoldResourceTemplate( ctx: Context,  inputs: Inputs
  ): Promise<Result<ResourceScaffoldResult, FxError>> {
    const provisionTemplate:FeProvisionTemplate = {
      endpoint: "{{fe.endpoint}}",
      domain: "fe.domain",
      storageName: "fe.storageName"
    };
    const deployTemplate:FeDeployTemplate = {};
    return ok({
      provisionTemplate: provisionTemplate,
      deployTemplate: deployTemplate
    });
  }

  async configureResource( ctx: ResourceConfigureContext ) : Promise<Result<Void, FxError>>{
    const functionConfig = ctx.provisionConfigs[AzureFunctionPlugin.name] as FunctionProvisionTemplate;
    const functionEndpoint = functionConfig.endpoint;
    //TODO 


    return ok(Void);
  }
}
