// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CancelError,
  err,
  FxError,
  Inputs,
  ok,
  ResourceContext,
  ResourcePlugin,
  ResourceScaffoldResult,
  Result,
  TimeConsumingTask,
  Void,
} from "fx-api";
import axios from "axios";
import { sleep, TaskGroup } from "../../../core/tools";

class DownloadTask implements TimeConsumingTask<Buffer> {
  isCanceled = false;
  name = "AzureFunction-ScaffoldCode-Step1";
  private cancelTokenSource = axios.CancelToken.source();
  current = 0;
  total = 100;
  message = "";
  buffers: any[] = [];
  url : string;
  constructor(url:string){
    this.url = url;
  }
  async run(): Promise<Result<Buffer, FxError>> {
    return new Promise(async (resolve) => {
      this.current = 0;
      try {
        const res = await axios.get(this.url, {
          cancelToken: this.cancelTokenSource.token,
          responseType: "stream",
        });
        this.total = res.headers["content-length"];
        this.buffers = [];
        const emit = (chunk: any) => {
          this.current += chunk.length;
          this.buffers.push(chunk);
        };
        res.data.on("data", emit);
        res.data.on("error", (error: any) => {
          resolve(err(error));
        });
        res.data.on("end", () => {
          this.result = Buffer.concat(this.buffers);
          resolve(ok(this.result));
        });
      } catch (e) {
        this.current = this.total;
        resolve(err(e));
      }
    });
  }
  cancel() {
    this.cancelTokenSource.cancel();
    this.isCanceled = true;
  }
  result?: Buffer;
}

class ScaffoldCodeTask implements TimeConsumingTask<number> {
  name = "AzureFunction-ScaffoldCode-Step2";
  isCanceled = false;
  current = 0;
  total = 100;
  message = "";
  async run():Promise<Result<number,FxError>> {
    this.total = 10;
    for (let i = 0; i < this.total && !this.isCanceled; ++i) {
      this.current = i + 1;
      await sleep(1000);
    }
    if(this.isCanceled) return err(CancelError);
    return ok(this.total);
  }
  cancel() {
    this.isCanceled = true;
  }
}

class ScaffoldResourceTemplateTask implements TimeConsumingTask<ResourceScaffoldResult> {
  name = "AzureFunction-ScaffoldResourceTemplate";
  isCanceled = false;
  current = 0;
  total = 100;
  message = "";
  async run():Promise<Result<ResourceScaffoldResult,FxError>> {
    this.total = 10;
    for (let i = 0; i < this.total && !this.isCanceled; ++i) {
      this.current = i + 1;
      await sleep(1000);
    }
    if(this.isCanceled) return err(CancelError);
    return ok({
      provision: {endpoint:"function-endpoint"},
      deploy: {path: "/api/"}
    });
  }
  cancel() {
    this.isCanceled = true;
  }
}

export class AzureFunctionPlugin implements ResourcePlugin {
  name: string = "fx-resource-function";
  displayName: string = "AzureFunctionPlugin";
  getScaffoldSourceCodeTask(
    ctx: ResourceContext,
    inputs: Inputs
  ): TimeConsumingTask<Void> {
    const task = new TaskGroup(ctx.userInterface, [new DownloadTask("https://download.tortoisegit.org/tgit/2.11.0.0/TortoiseGit-2.11.0.0-64bit.msi"), new ScaffoldCodeTask()], false, true);
    task.name = "AzureFunction-ScaffoldCode-Overall";
    return task;
  }

  getScaffoldResourceTemplateTask(
    ctx: ResourceContext,
    inputs: Inputs
  ) : TimeConsumingTask<ResourceScaffoldResult>{
    return new ScaffoldResourceTemplateTask();
  }
}
