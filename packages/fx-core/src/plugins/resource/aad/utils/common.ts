// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Constants } from "../constants/constants";

export class Utils {
  public static addLocalDebugPrefix(key: string) {
    return Constants.localDebugPrefix + key;
  }
}