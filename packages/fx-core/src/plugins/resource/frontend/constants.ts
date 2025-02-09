// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import path from "path";

export class Constants {
  static AzureStorageDefaultTier = "Standard";
  static AzureStorageDefaultSku = "Standard_LRS";
  static AzureStorageDefaultKind = "StorageV2";
  static AzureStorageAccountNameLenMax = 24;
  static AzureStorageWebContainer = "$web";
  static SuffixLenMax = 12;

  static FrontendIndexDocument = "index.html";
  static FrontendErrorDocument = "index.html";
  static FrontendSuffix = "fe";

  static EmptyString = "";

  static DayInMS = 1000 * 60 * 60 * 24;
  static SasTokenLifetimePadding = Constants.DayInMS;
  static SasTokenLifetime = Constants.DayInMS * 3;

  static RequestTryCounts = 3;
  static RequestTimeoutInMS = 20 * 1000;
  static ScaffoldTryCounts = 1;
}

export class FrontendPluginInfo {
  static PluginName = "fx-resource-frontend-hosting";
  static DisplayName = "Tab Frontend";
  static ShortName = "FE";
  static IssueLink = "https://github.com/OfficeDev/TeamsFx/issues/new";
  static HelpLink = ""; // TODO: default help link
}

export class Commands {
  static InstallNodePackages = "npm install";
  static BuildFrontend = "npm run build";
}

export class EnvironmentVariables {
  static FuncEndpoint = "REACT_APP_FUNC_ENDPOINT";
  static FuncName = "REACT_APP_FUNC_NAME";
  static RuntimeEndpoint = "REACT_APP_TEAMSFX_ENDPOINT";
  static StartLoginPage = "REACT_APP_START_LOGIN_PAGE_URL";
  static ClientID = "REACT_APP_CLIENT_ID";
}

export class FrontendPathInfo {
  static WorkingDir = "tabs";
  static TemplateDir = path.join("plugins", "resource", "frontend");
  static TemplateFileExt = ".tpl";
  static TemplatePackageExt = ".zip";
  static BuildFolderName = "build";
  static BuildPath = `${FrontendPathInfo.BuildFolderName}${path.sep}`;
  static TabEnvironmentFilePath = ".env";
  static npmPackageFolderName = "node_modules";
  static TabDeploymentFolderName = ".deployment";
  static TabDeploymentInfoFileName = "deployment.json";
  static TabDeployIgnoreFolder = [
    FrontendPathInfo.BuildFolderName,
    FrontendPathInfo.npmPackageFolderName,
    FrontendPathInfo.TabDeploymentFolderName,
  ];
}

export class DependentPluginInfo {
  static readonly SolutionPluginName = "solution";
  static readonly SubscriptionId = "subscriptionId";
  static readonly ResourceGroupName = "resourceGroupName";
  static readonly ResourceNameSuffix = "resourceNameSuffix";
  static readonly Location = "location";
  static readonly ProgrammingLanguage = "programmingLanguage";
  static readonly RemoteTeamsAppId = "remoteTeamsAppId";

  static readonly FunctionPluginName = "fx-resource-function";
  static readonly FunctionEndpoint = "functionEndpoint";
  static readonly FunctionDefaultName = "defaultFunctionName";

  static readonly RuntimePluginName = "fx-resource-simple-auth";
  static readonly RuntimeEndpoint = "endpoint";
  static readonly StartLoginPageURL = "auth-start.html";

  static readonly AADPluginName = "fx-resource-aad-app-for-teams";
  static readonly ClientID = "clientId";

  static readonly LocalDebugPluginName = "fx-resource-local-debug";
  static readonly LocalTabEndpoint = "localTabEndpoint";
}

export class FrontendConfigInfo {
  static readonly StorageName = "storageName";
  static readonly Endpoint = "endpoint";
  static readonly Domain = "domain";
}

export class TelemetryEvent {
  static readonly startSuffix = "-start";

  static readonly scaffold = "scaffold";

  static readonly PreProvision = "pre-provision";
  static readonly Provision = "provision";
  static readonly PostProvision = "post-provision";

  static readonly PreDeploy = "pre-deploy";
  static readonly Deploy = "deploy";
}

export class TelemetryKey {
  static readonly Component = "component";
  static readonly Success = "success";
  static readonly ErrorType = "error-type";
  static readonly ErrorMessage = "error-message";
  static readonly ErrorCode = "error-code";
  static readonly AppId = "appid";
}

export class TelemetryValue {
  static readonly Success = "yes";
  static readonly Fail = "no";
  static readonly UserError = "user";
  static readonly SystemError = "system";
}

export class AzureErrorCode {
  static readonly ReservedResourceName = "ReservedResourceName";
  static readonly StorageAccountAlreadyTaken = "StorageAccountAlreadyTaken";
  static readonly StorageAccountAlreadyExists = "StorageAccountAlreadyExists";
}

export class RegularExpr {
  static readonly allCharToBeSkippedInName = /[^a-zA-Z0-9]/g;
  static readonly FrontendStorageNamePattern = /^[a-z0-9]{3,24}$/;
  static readonly ReplaceTemplateExt = /\.tpl$/;
}
