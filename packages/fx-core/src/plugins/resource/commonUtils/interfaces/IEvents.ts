// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

interface IEventMessages {
  telemetry: string,
  log: string,
}

export interface IStageEvents {
  start: IEventMessages,
  end: IEventMessages,
}