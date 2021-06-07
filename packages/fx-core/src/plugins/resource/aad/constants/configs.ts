// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IConfig } from "../interfaces/IConfig";
import { Utils } from "../utils/common";
import { Constants, Plugins } from "./constants";

export let provisionInputConfig: IConfig = new Map([
  [
    Plugins.AADPlugin.configKeys.permissionRequest,
    {
      remotePlugin: Plugins.SolutionPlugin.id,
      remoteKey: Plugins.SolutionPlugin.configKeys.permissionRequest,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.objectId,
    {
      remoteKey: Plugins.AADPlugin.configKeys.objectId,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.objectId),
      required: false,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.clientSecret,
    {
      remoteKey: Plugins.AADPlugin.configKeys.clientSecret,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.clientSecret),
      required: false,
    }
  ],
]);

export let provisionOutputConfig: IConfig = new Map([
  [
    Plugins.AADPlugin.configKeys.clientId,
    {
      remoteKey: Plugins.AADPlugin.configKeys.clientId,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.clientId),
    }
  ],
  [
    Plugins.AADPlugin.configKeys.objectId,
    {
      remoteKey: Plugins.AADPlugin.configKeys.objectId,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.objectId),
    }
  ],
  [
    Plugins.AADPlugin.configKeys.clientSecret,
    {
      remoteKey: Plugins.AADPlugin.configKeys.clientSecret,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.clientSecret),
    }
  ],
  [
    Plugins.AADPlugin.configKeys.clientId,
    {
      remoteKey: Plugins.AADPlugin.configKeys.oauth2PermissionScopeId,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.oauth2PermissionScopeId),
    }
  ],
  [
    Plugins.AADPlugin.configKeys.teamsMobileDesktopAppId,
    {
      value: Constants.teamsMobileDesktopAppId,
      remoteKey: Plugins.AADPlugin.configKeys.teamsMobileDesktopAppId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.teamsWebAppId,
    {
      value: Constants.teamsWebAppId,
      remoteKey: Plugins.AADPlugin.configKeys.teamsWebAppId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.oauthHost,
    {
      value: Constants.oauthAuthorityPrefix,
      remoteKey: Plugins.AADPlugin.configKeys.oauthHost,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.tenantId,
    {
      remoteKey: Plugins.AADPlugin.configKeys.tenantId,
      localKey: Utils.addLocalDebugPrefix(Plugins.AADPlugin.configKeys.tenantId),
    }
  ],
  [
    Plugins.AADPlugin.configKeys.oauthAuthority,
    {
      remoteKey: Plugins.AADPlugin.configKeys.oauthAuthority,
    }
  ],
])