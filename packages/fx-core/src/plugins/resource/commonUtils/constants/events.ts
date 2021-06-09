// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStageEvents } from "../interfaces/Stages";

export class Events {
  static Provision: IStageEvents = {
    start: {
      telemetry: "provision-start",
      log: "Start to provision",
    },
    end: {
      telemetry: "provision",
      log: "Successfully provision",
    }
  };

  static LocalDebug: IStageEvents = {
    start: {
      telemetry: "local-debug-start",
      log: "Start to local debug",
    },
    end: {
      telemetry: "local-debug",
      log: "Successfully local debug",
    }
  };

  static PostProvision: IStageEvents = {
    start: {
      telemetry: "post-provision-start",
      log: "Start to post-provision",
    },
    end: {
      telemetry: "post-provision",
      log: "Successfully post-provision",
    }
  };

  static PostLocalDebug: IStageEvents = {
    start: {
      telemetry: "post-local-debug-start",
      log: "Start to post local debug",
    },
    end: {
      telemetry: "post-local-debug",
      log: "Successfully post local debug",
    }
  };
}