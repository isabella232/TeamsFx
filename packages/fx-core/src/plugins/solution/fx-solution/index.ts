// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  FunctionRouter,
  FxError,
  Inputs,
  ok,
  QTreeNode,
  Result,
  SolutionProvisionContext,
  SolutionPlugin,
  Task,
  Void,
  SolutionProvisionResult,
  Func,
  NodeType,
  SolutionScaffoldResult,
  SystemError,
  err,
  ResourceProvisionContext,
  MsgLevel,
  CancelError,
  SolutionSetting,
  Context,
  ResourceScaffoldResult,
  FunctionGroupTask,
  SolutionDeployContext,
  SolutionPublishContext,
} from "fx-api";
import { TaskGroup } from "../../../core";
import { FrontendPlugin } from "../../resource/frontend";
import { AzureFunctionPlugin } from "../../resource/function";
import {
  AzureResourceApim,
  AzureResourceFunction,
  AzureResourceSQL,
  AzureResourcesQuestion,
  BotOptionItem,
  CapabilitiesQuestion,
  FrontendHostTypeQuestion,
  HostTypeOptionAzure,
  MessageExtensionItem,
  ProgrammingLanguageQuestion,
  SolutionQuestionNames,
  TabOptionItem,
} from "./question";

export interface TeamsSolutionSetting extends SolutionSetting{
  hostType: string;
  capabilities: string[];
  azureResources: string[];
}

export class TeamsSolution implements SolutionPlugin {
  name = "fx-solution-azure";
  displayName = "Teams Solution";
  functionPlugin = new AzureFunctionPlugin();
  frontendPlugin = new FrontendPlugin();

  async scaffoldFiles(
    ctx: Context,
    inputs: Inputs
  ): Promise<Result<SolutionScaffoldResult, FxError>> {
    
    const solutionSettingRes = this.createSolutionSettings(inputs);
    if(solutionSettingRes.isErr()) return err(solutionSettingRes.error);
    const solutionSetting = solutionSettingRes.value;
    ctx.projectSetting.solutionSetting = solutionSetting;

    solutionSetting.resourcePlugins = ["fx-resource-frontend", "fx-resource-function"];

    const task1 = async (): Promise<Result<Void,FxError>> =>{ await this.frontendPlugin.scaffoldSourceCode(ctx, inputs); return ok(Void);} ;
    const task2 = async (): Promise<Result<Void,FxError>> =>{ await this.functionPlugin.scaffoldSourceCode(ctx, inputs); return ok(Void);} ;  
    const task3 = async (): Promise<Result<ResourceScaffoldResult,FxError>> =>{ return await this.frontendPlugin.scaffoldResourceTemplate(ctx, inputs);};
    const task4 = async (): Promise<Result<ResourceScaffoldResult,FxError>> =>{ return await this.functionPlugin.scaffoldResourceTemplate(ctx, inputs);}; 
    const group = new FunctionGroupTask({name: "provision", 
                tasks:[task1,task2,task3,task4], 
                taskNames: ["frontendPlugin.scaffoldSourceCode", "functionPlugin.scaffoldSourceCode", "frontendPlugin.scaffoldResourceTemplate", ""], 
                cancelable: true, concurrent: false, fastFail:true});
    const confirm = await ctx.userInteraction.showMessage(MsgLevel.Info, "Are you sure to create?", true, "Confirm", "ReadMore");
    if(confirm === "ReadMore"){
      ctx.userInteraction.openUrl("https://github.com/OfficeDev/TeamsFx");
    }
    if(confirm !== "Confirm"){
      return err(CancelError);
    }
    const result = await ctx.userInteraction.runWithProgress(group);
    if(result.isOk()){
      const finalResult:SolutionScaffoldResult = {provisionTemplates:{}, deployTemplates:{}};
      const e1:Result<ResourceScaffoldResult,FxError> = result.value[2];
      const e2:Result<ResourceScaffoldResult,FxError> = result.value[3];
      if(e1.isOk()){
        const sr = e1.value;
        finalResult.provisionTemplates["fx-resource-frontend"] = sr.provisionTemplate;
        finalResult.deployTemplates["fx-resource-frontend"] = sr.deployTemplate;
      }
      if(e2.isOk()){
        const sr = e2.value;
        finalResult.provisionTemplates["fx-resource-function"] = sr.provisionTemplate;
        finalResult.deployTemplates["fx-resource-function"] = sr.deployTemplate;
      }
      return ok(finalResult);
    }
    else {
      return err(result.error);
    }
  }
  createSolutionSettings(inputs: Inputs): Result<TeamsSolutionSetting, FxError> {
    const capabilities = inputs[SolutionQuestionNames.Capabilities] as string[] || [];
    if (!capabilities || capabilities.length === 0) {
      return err( new SystemError("InvalidInput", "Invalid capabilities", "Solution"));
    }
    let hostType = inputs[SolutionQuestionNames.HostType] as string;
    if (capabilities.includes(BotOptionItem.id) || capabilities.includes(MessageExtensionItem.id))
      hostType = HostTypeOptionAzure.id;
    if (!hostType) {
      return err(new SystemError("InvalidInput", "Invalid host-type", "Solution"));
    }
    let azureResources: string[] | undefined;
    if (hostType === HostTypeOptionAzure.id && capabilities.includes(TabOptionItem.id)) {
      azureResources = inputs[SolutionQuestionNames.AzureResources] as string[];
      if (azureResources) {
        if (
          (azureResources.includes(AzureResourceSQL.id) ||
            azureResources.includes(AzureResourceApim.id)) &&
          !azureResources.includes(AzureResourceFunction.id)
        ) {
          azureResources.push(AzureResourceFunction.id);
        }
      } else azureResources = [];
    }
    const solutionSetting:TeamsSolutionSetting= {
      hostType: hostType,
      capabilities: capabilities,
      azureResources: azureResources || [],
      resourcePlugins: []
    };
    return ok(solutionSetting);
  }

  async buildArtifacts(  ctx: Context,  inputs: Inputs ): Promise<Result<Void, FxError>> {
    ctx.projectState.build = true;
    return ok(Void);
  }
  async provisionResources( ctx: SolutionProvisionContext,  inputs: Inputs ): Promise< Result<SolutionProvisionResult, FxError & { result: SolutionProvisionResult }>
  > {
    ctx.logProvider.info(
      `[solution] provision resource configs: ${JSON.stringify(
        ctx.resourceConfigs
      )}`
    );
    return ok({
      resourceValues: {
        endpoint: "http://oowww.com",
      },
      stateValues: {
        provision: "true",
      },
    });
  }
  async deployArtifacts(  ctx: SolutionDeployContext, inputs: Inputs  ): Promise< Result<SolutionProvisionResult, FxError & { result: SolutionProvisionResult }> > {
    ctx.logProvider.info(
      `[solution] deploy resource configs: ${JSON.stringify(
        ctx.resourceConfigs
      )}`
    );
    return ok({
      resourceValues: {
        storagename: "mystorage",
      },
      stateValues: {
        deploy: "true",
      },
    });
  }
  async publishApplication( ctx: SolutionPublishContext, inputs: Inputs ): Promise<Result<Void, FxError>> {
    ctx.logProvider.info(
      `[solution] publish provisionConfigs: ${JSON.stringify(
        ctx.provisionConfigs
      )}`
    );
    ctx.logProvider.info(
      `[solution] publish deployConfigs: ${JSON.stringify(ctx.deployConfigs)}`
    );
    ctx.projectState.publish = true;
    return ok({ resourceValues: {}, stateValues: {} });
  }

  async getTabScaffoldQuestions(
    ctx: Context,
    addAzureResource: boolean
  ): Promise<Result<QTreeNode | undefined, FxError>> {
    const tabNode = new QTreeNode({ type: NodeType.group });

    // //Frontend plugin
    // if (this.fehostPlugin.getQuestions) {
    //   const pluginCtx = getPluginContext(ctx, this.fehostPlugin.name);
    //   const res = await this.fehostPlugin.getQuestions(Stage.create, pluginCtx);
    //   if (res.isErr()) return res;
    //   if (res.value) {
    //     const frontendNode = res.value as QTreeNode;
    //     if (frontendNode.data) tabNode.addChild(frontendNode);
    //   }
    // }

    if (addAzureResource) {
      const azureResourceNode = new QTreeNode(AzureResourcesQuestion);
      tabNode.addChild(azureResourceNode);

      // //Azure Function
      // if (this.functionPlugin.getQuestions) {
      //   const pluginCtx = getPluginContext(ctx, this.functionPlugin.name);
      //   const res = await this.functionPlugin.getQuestions(Stage.create, pluginCtx);
      //   if (res.isErr()) return res;
      //   if (res.value) {
      //     const azure_function = res.value as QTreeNode;
      //     azure_function.condition = { minItems: 1 };
      //     if (azure_function.data) azureResourceNode.addChild(azure_function);
      //   }
      // }

      // //Azure SQL
      // if (this.sqlPlugin.getQuestions) {
      //   const pluginCtx = getPluginContext(ctx, this.sqlPlugin.name);
      //   const res = await this.sqlPlugin.getQuestions(Stage.create, pluginCtx);
      //   if (res.isErr()) return res;
      //   if (res.value) {
      //     const azure_sql = res.value as QTreeNode;
      //     azure_sql.condition = { contains: AzureResourceSQL.id };
      //     if (azure_sql.data) azureResourceNode.addChild(azure_sql);
      //   }
      // }
    }
    return ok(tabNode);
  }

  async getQuestionsForLifecycleTask (task: Task, inputs: Inputs, ctx?: Context) : Promise<Result<QTreeNode|undefined, FxError>>{
    if (task === Task.create) {
      const node = new QTreeNode({ type: NodeType.group });
      // 1. capabilities
      const capQuestion = CapabilitiesQuestion;
      const capNode = new QTreeNode(capQuestion);
      node.addChild(capNode);

      // 1.1 hostType
      const hostTypeNode = new QTreeNode(FrontendHostTypeQuestion);
      hostTypeNode.condition = { contains: TabOptionItem.id };
      capNode.addChild(hostTypeNode);

      // // 1.1.1 SPFX Tab
      // if (this.spfxPlugin.getQuestions) {
      //   const pluginCtx = getPluginContext(ctx, this.spfxPlugin.name);
      //   const res = await this.spfxPlugin.getQuestions(Stage.create, pluginCtx);
      //   if (res.isErr()) return res;
      //   if (res.value) {
      //     const spfxNode = res.value as QTreeNode;
      //     spfxNode.condition = { equals: HostTypeOptionSPFx.id };
      //     if (spfxNode.data) hostTypeNode.addChild(spfxNode);
      //   }
      // }

      // 1.1.2 Azure Tab
      const tabRes = await this.getTabScaffoldQuestions(ctx, true);
      if (tabRes.isErr()) return tabRes;
      if (tabRes.value) {
        const tabNode = tabRes.value;
        tabNode.condition = { equals: HostTypeOptionAzure.id };
        hostTypeNode.addChild(tabNode);
      }

      // // 1.2 Bot
      // if (this.botPlugin.getQuestions) {
      //   const pluginCtx = getPluginContext(ctx, this.botPlugin.name);
      //   const res = await this.botPlugin.getQuestions(stage, pluginCtx);
      //   if (res.isErr()) return res;
      //   if (res.value) {
      //     const botGroup = res.value as QTreeNode;
      //     botGroup.condition = {
      //       containsAny: [BotOptionItem.id, MessageExtensionItem.id],
      //     };
      //     capNode.addChild(botGroup);
      //   }
      // }

      // 1.3 Language
      const programmingLanguage = new QTreeNode(ProgrammingLanguageQuestion);
      programmingLanguage.condition = { minItems: 1 };
      capNode.addChild(programmingLanguage);

      return ok(node);
    }
    return ok(undefined);
  }

  async getQuestionsForUserTask(router: FunctionRouter, inputs: Inputs, ctx?: Context) : Promise<Result<QTreeNode|undefined, FxError>>{
    return ok(undefined);
  }
  async executeUserTask(func:Func, inputs: Inputs, ctx?: Context) : Promise<Result<unknown, FxError>>{
    return ok(Void);
  }
}
