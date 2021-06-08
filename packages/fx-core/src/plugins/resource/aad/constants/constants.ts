// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPlugin } from "../../commonUtils/interfaces/IPlugin";

export class Plugins {
  static readonly AADPlugin: IPlugin = {
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

  static readonly SolutionPlugin: IPlugin = {
    id: "solution",
    configKeys: {
      permissionRequest: "permissionRequest",
    }
  };

  static readonly FrontendPlugin: IPlugin = {
    id: "fx-resource-frontend-hosting",
    configKeys: {
      domain: "domain",
      endpoint: "endpoint",
    }
  }

  static readonly BotPlugin: IPlugin = {
    id: "fx-resource-bot",
    configKeys: {
      id: "botId",
      idLocal: "localBotId",
      endpoint: "siteEndpoint",
    }
  };

  static readonly LocalDebugPlugin: IPlugin = {
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