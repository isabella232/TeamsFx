// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Result } from "neverthrow";
import { FxError } from "../error";
import { Json } from "../types";



export interface AccountManager{
  
  signin():Promise<Result<boolean, FxError>>;

  signout():Promise<Result<boolean, FxError>>;

  getAccountInfo():Promise<Result<Json, FxError>>;

  setLocalState(state:Json):Promise<Result<boolean, FxError>>;

  getLocalState():Promise<Result<Json, FxError>>;
}