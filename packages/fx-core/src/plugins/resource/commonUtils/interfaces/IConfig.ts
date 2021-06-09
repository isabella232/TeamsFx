// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ConfigValue } from "@microsoft/teamsfx-api";

export interface IConfigValue {
  value?: ConfigValue,
  remotePlugin?: string,
  remoteKey: string,
  localPlugin?: string,
  localKey?: string,
  required?: boolean,
}

export type IConfig = Map<string, IConfigValue>;