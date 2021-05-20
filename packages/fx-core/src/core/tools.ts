// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { exec } from "child_process";
import * as fs from "fs-extra";
import { Json, Void, ConfigFolderName, ok, Result, FxError, err, TimeConsumingTask, UserInterface, CancelError } from "fx-api";
import { promisify } from "util";
import * as error from "./error";
import Mustache from "mustache";


const execAsync = promisify(exec);

export async function npmInstall(path: string) {
  await execAsync("npm install", {
    cwd: path,
  });
}

export async function ensureUniqueFolder(folderPath: string): Promise<string> {
  let folderId = 1;
  let testFolder = folderPath;

  let pathExists = await fs.pathExists(testFolder);
  while (pathExists) {
    testFolder = `${folderPath}${folderId}`;
    folderId++;

    pathExists = await fs.pathExists(testFolder);
  }

  return testFolder;
}
 
export function replaceTemplateVariable(resourceTemplate:Json, dict?: Json): void {
  if(!dict) return ;
  Mustache.escape = function(text) {return text;};
  for (const key of Object.keys(resourceTemplate)) {
    const originalItemValue = resourceTemplate[key] as string;
    if (  originalItemValue ) {
      const replaced: string = Mustache.render(originalItemValue, dict);
      resourceTemplate[key] = replaced;
    }
  }
}

export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => {
      cp.push(v);
    });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === "object" && target !== {}) {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };
    Object.keys(cp).forEach((k) => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};



export async function initFolder(projectPath:string, appName:string):Promise<Result<Void, FxError>>{
  try {
    await fs.ensureDir(projectPath);
    
    await fs.ensureDir(`${projectPath}/.${ConfigFolderName}`);

    await fs.writeFile(
      `${projectPath}/package.json`,
      JSON.stringify(
        {
          name: appName,
          version: "0.0.1",
          description: "",
          author: "",
          scripts: {
            test: "echo \"Error: no test specified\" && exit 1",
          },
          license: "MIT",
        },
        null,
        4
      )
    );

    await fs.writeFile(
      `${projectPath}/.gitignore`,
      `node_modules\n/.${ConfigFolderName}/state.json\n/.${ConfigFolderName}/*.userdata\n.DS_Store`
    );

    return ok(Void);
  } catch (e) {
    return err(error.WriteFileError(e));
  }
}

export function mergeDict(varDict1?:Record<string, string>, varDict2?:Record<string, string>):Record<string, string>{
  if(!varDict1 && !varDict2) return {};
  const res:Record<string, string> = {};
  if(varDict1){
    for(const k of Object.keys(varDict1)){
      res[k] = varDict1[k];
    }
  }
  if(varDict2){
    for(const k of Object.keys(varDict2)){
      res[k] = varDict2[k];
    }
  }
  return res;
}


export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export class TaskGroup implements TimeConsumingTask<any> {
  name = "TaskGroup";
  current = 0;
  total = 0;
  message = "";
  isCanceled = false;
  concurrent = true;
  showSubTasks = true;
  fastFail = false;
  tasks: TimeConsumingTask<any>[];
  ui: UserInterface;
  constructor(ui:UserInterface, tasks: TimeConsumingTask<any>[], concurrent: boolean, showSub: boolean) {
    this.ui = ui;
    this.tasks = tasks;
    this.concurrent = concurrent;
    this.showSubTasks = showSub;
  }
  async run():Promise<Result<any,FxError>> {
    return new Promise(async (resolve) => {
      let results:Result<any,Error>[] = [];
      if (!this.concurrent) {
        this.total = this.tasks.length;
        for (let i = 0; i < this.total; ++i) {
          const task = this.tasks[i];
          let taskRes;
          if (this.showSubTasks) {
            taskRes = this.ui.runWithProgress(task);
          } else {
            taskRes = task.run();
          }
          
          let skip = false;
          taskRes.then(v=>{
            if(v.isErr()){
              if(this.fastFail){
                this.cancel();
                resolve(v);
              }
            }
            results.push(v);
          })
          .catch(e=>{
            if(this.fastFail){
              this.cancel();
              resolve(err(e));
            }
            else {
              results.push(err(e));
              this.current = i + 1;
              skip = true;
            }
          });
          if(skip) continue;

          while (
            (task.total === 0 || task.current < task.total) &&
            !task.isCanceled && !this.isCanceled
          ) {
            this.current = task.total === 0 ? 0 : i + task.current / task.total;
            await sleep(100);
          }
          
          if (task.isCanceled) {
            if(this.fastFail){
              this.cancel();
              resolve(err(CancelError));
            }
            else {
              results.push(err(CancelError));
              this.current = i + 1;
              continue;
            }
          }

          if(this.isCanceled){
            resolve(err(CancelError));
          }

          this.current = i + 1;
        }
        this.current = this.total;
      } else {
        this.total = this.tasks.length;
        let promiseResults = [];
        if (this.showSubTasks) {
          promiseResults = this.tasks.map((t) => this.ui.runWithProgress(t));
        } else {
          promiseResults = this.tasks.map((t) => t.run());
        }
        while (this.current < this.total && !this.isCanceled) {
          let progress = 0;
          for (const task of this.tasks) {
            if (task.isCanceled) {
              if(this.fastFail){
                this.cancel();
                resolve(err(CancelError));
              }
              else {
                results.push(err(CancelError));
                progress += 1;
                continue;
              }
            }
            progress += task.total === 0 ? 0 : task.current / task.total;
          }
          this.current = progress;
          await sleep(100);
        }

        if (this.isCanceled) {
          resolve(err(CancelError));
        }
        
        results = await Promise.all(promiseResults);
      }
      resolve(ok(results));
    });
  }

  cancel() {
    for (const task of this.tasks) task.cancel();
    this.isCanceled = true;
  }
}