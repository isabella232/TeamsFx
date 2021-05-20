// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Result } from "neverthrow";
import { FxError } from "../error";
import { FuncQuestion, StaticOptions } from "../qm/question";


export interface FxUIOption{
  title: string,
  placeholder?: string;
  prompt?:string;
  step?: number;
  totalSteps?: number;
}

export interface FxSingleQuickPickOption extends FxUIOption{
  options: StaticOptions;
  default?: string;
  returnObject?: boolean;
}

export interface FxMultiQuickPickOption extends FxUIOption{
  options: StaticOptions;
  default?: string[];
  returnObject?: boolean;
  onDidChangeSelection?: (currentSelectedIds: Set<string>, previousSelectedIds: Set<string>) => Promise<Set<string>>;
  validation?: (input: string[]) => string|undefined|Promise<string|undefined>;
}

export interface FxInputBoxOption extends FxUIOption{
  password?: boolean;
  default?: string;
  validation?: (input: string) => Promise<string | undefined>;
}

export interface FxFileSelectorOption extends FxUIOption{
    /**
     * The resource the dialog shows when opened.
     */
    default?: string;

    /**
     * A human-readable string for the open button.
     */
    openLabel?: string;

    /**
     * Allow to select files, defaults to `true`.
     */
    canSelectFiles?: boolean;

    /**
     * Allow to select folders, defaults to `false`.
     */
    canSelectFolders?: boolean;

    /**
     * Allow to select many files or folders.
     */
    canSelectMany?: boolean;

    /**
     * A set of file filters that are used by the dialog. Each entry is a human-readable label,
     * like "TypeScript", and an array of extensions, e.g.
     * ```ts
     * {
     *     'Images': ['png', 'jpg']
     *     'TypeScript': ['ts', 'tsx']
     * }
     * ```
     */
    filters?: { [name: string]: string[] };

    validation?: (input: string|string[]) => string | undefined | Promise<string | undefined>;
}

export enum InputResultType {
  cancel = "cancel",
  back = "back",
  sucess = "sucess",
  error = "error",
  skip = "skip"
}

export interface InputResult{
  type: InputResultType;
  result?: unknown;
  error?: FxError;
}

export enum MsgLevel {
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
}

export interface FxFuncQuestionOption extends FxUIOption{
  func: FuncQuestion;
}

export interface TimeConsumingTask<T>{
  name: string;
  total: number;
  current: number;
  message: string;
  isCanceled: boolean;
  run () : Promise<Result<T,FxError>>;
  cancel(): void;
}

export interface UserInterface{
  showSingleQuickPick: (option: FxSingleQuickPickOption) => Promise<InputResult> 
  showMultiQuickPick: (option: FxMultiQuickPickOption) => Promise<InputResult> 
  showInputBox: (option: FxInputBoxOption) => Promise<InputResult>;
  showFileSelector: (option: FxFileSelectorOption) => Promise<InputResult>;
  openExternal(link: string): Promise<boolean>;
  showMessage(level:MsgLevel, message: string, modal: boolean, ...items: string[]): Promise<string | undefined>;
  runWithProgress<T>(task: TimeConsumingTask<T>):Promise<Result<T,FxError>>;
}
   
