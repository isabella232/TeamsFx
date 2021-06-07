// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PluginContext } from "@microsoft/teamsfx-api";
import { Constants } from "../constants/constants";

export class Utils {
  public static addLocalDebugPrefix(key: string) {
    return Constants.localDebugPrefix + key;
  }
}