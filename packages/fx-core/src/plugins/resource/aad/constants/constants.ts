// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export class Plugins {
  static readonly AADPlugin = {
    id: "fx-resource-aad-app-for-teams",
    name: "AAD App Registration",
    shortName: "aad",
    configKeys: {
      applicationIdUri: "applicationIdUris",
      clientId: "clientId",
      clientSecret: "clientSecret",
      objectId: "objectId",
      oauth2PermissionScopeId: "oauth2PermissionScopeId",
      teamsMobileDesktopAppId: "teamsMobileDesktopAppId",
      teamsWebAppId: "teamsWebAppId",
      domain: "domain",
      endpoint: "endpoint",
      oauthAuthority: "oauthAuthority",
      oauthHost: "oauthHost",
      tenantId: "tenantId",
      skip: "skipProvision",
      permissionRequest: "permissionRequest",
    }
  };

  static readonly SolutionPlugin = {
    id: "solution",
    configKeys: {
      permissionRequest: "permissionRequest",
    }
  };

  static readonly FrontendPlugin = {
    id: "fx-resource-frontend-hosting",
    configKeys: {
      domain: "domain",
      endpoint: "endpoint",
    }
  }

  static readonly BotPlugin = {
    id: "fx-resource-bot",
    configKeys: {
      id: "botId",
      idLocal: "localBotId",
      endpoint: "siteEndpoint",
    }
  };

  static readonly LocalDebugPlugin = {
    id: "fx-resource-local-debug",
    configKeys: {
      tabDomain: "localTabDomain",
      tabEndpoint: "localTabEndpoint",
      botEndpoint: "localBotEndpoint",
    }
  }
}

export class Constants {
  static teamsMobileDesktopAppId = "1fec8e78-bce4-4aaf-ab1b-5451cc387264";
  static teamsWebAppId = "5e3ce6c0-2b1f-4285-8d4b-75ee78787346";
  static oauthAuthorityPrefix = "https://login.microsoftonline.com";
  static aadAppMaxLength = 120;
  static aadAppPasswordDisplayName = "default";
  static localDebugPrefix = "local_";
}

export interface IMessages {
  log: string;
  telemetry: string;
}

export class Messages {
  public static readonly getLog = (log: string) => `[${Plugins.AADPlugin.name}] ${log}`;
  private static readonly getEventName = (eventName: string) => `${eventName}`;

  static readonly StartProvision: IMessages = {
    log: Messages.getLog("Start to provision"),
    telemetry: Messages.getEventName("provision-start"),
  };

  static readonly EndProvision: IMessages = {
    log: Messages.getLog("Successfully provision"),
    telemetry: Messages.getEventName("provision"),
  };

  static readonly StartLocalDebug: IMessages = {
    log: Messages.getLog("Start to local debug"),
    telemetry: Messages.getEventName("local-debug-start"),
  };

  static readonly EndLocalDebug: IMessages = {
    log: Messages.getLog("Successfully local debug"),
    telemetry: Messages.getEventName("local-debug"),
  };

  static readonly StartPostProvision: IMessages = {
    log: Messages.getLog("Start to post-provision"),
    telemetry: Messages.getEventName("post-provision-start"),
  };

  static readonly EndPostProvision: IMessages = {
    log: Messages.getLog("Successfully post-provision"),
    telemetry: Messages.getEventName("post-provision"),
  };

  static readonly StartPostLocalDebug: IMessages = {
    log: Messages.getLog("Start to post local debug"),
    telemetry: Messages.getEventName("post-local-debug-start"),
  };

  static readonly EndPostLocalDebug: IMessages = {
    log: Messages.getLog("Successfully post local debug"),
    telemetry: Messages.getEventName("post-local-debug"),
  };

  static readonly StartUpdatePermission: IMessages = {
    log: Messages.getLog("Start to update permission"),
    telemetry: Messages.getEventName("update-permission-start"),
  };

  static readonly EndUpdatePermission: IMessages = {
    log: Messages.getLog("Successfully update permission"),
    telemetry: Messages.getEventName("update-permission"),
  };

  static readonly GetAadAppSuccess = "Successfully get Azure AD app.";
  static readonly CreateAadAppSuccess = "Successfully created Azure AD app.";
  static readonly CreateAadAppPasswordSuccess = "Successfully created password for Azure AD app.";
  static readonly UpdatePermissionSuccess = "Successfully updated permission for Azure AD app.";
  static readonly SetAppIdUriSuccess = "Successfully created application id uri for Azure AD app.";
  static readonly UpdateRedirectUriSuccess = "Successfully updated redirect uri for Azure AD app.";
  static readonly UpdateAppIdUriSuccess =
    "Successfully updated application id uri for Azure AD app.";
  static readonly ParsePermissionSuccess = "Successfully parsed permissions.";
  static readonly NoSelection =
    "No Azure AD app found. Will not update permissions. You need to run provision or local debug first.";
  static readonly UserCancelled = "Selection is cancelled by user.";
  static readonly UpdatePermissionSuccessMessage =
    "Successfully updated permission for Azure AD app. You can go to Azure Portal to check the permission or grant admin consent.";
  static readonly SkipProvision =
    "Azure AD app provision skipped. You need to mannual provision and config Azure AD app.";
}