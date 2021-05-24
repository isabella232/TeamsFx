// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { Platform, VsCodeEnv } from "./constants";
import { UserInteraction } from "./qm/ui";
import { LogProvider, TelemetryReporter } from "./utils"; 
 
// eslint-disable-next-line @typescript-eslint/ban-types
export type Void = {};
export const Void = {};
  

/**
 * environment meta data
 */
export interface EnvMeta{
    name:string,
    local:boolean,
    sideloading:boolean
}

export type Json = Record<string,unknown>;

/**
 * project static settings
 */
export interface ProjectSetting extends Json{
    name:string,
    solutionSetting:SolutionSetting;
    environments: {
        [k : string] : EnvMeta;
    };
    currentEnv: string;
}


/**
 * solution settings
 */
export interface SolutionSetting extends Json{  
    name:string;
    version?:string;
}
 
export interface TeamsSolutionSetting extends SolutionSetting{
    hostType: string;
    capabilities: string[];
    azureResources: string[];
    activeResourcePlugins: string[];
    resourceSettings: Record<string, Json>;
}
 
export interface ProjectState extends Json{
    resourceStates: Record<string, Json>;
}

export interface Inputs extends Json{
    projectPath:string;
    platform: Platform;
    vscodeEnv?:VsCodeEnv;
}    
  
export interface Context {
     
    projectPath: string;
 
    userInterface: UserInteraction;
 
    logProvider: LogProvider;
 
    telemetryReporter: TelemetryReporter;

    /**
     * Static setting
     */
    projectSetting: ProjectSetting; 

    /**
     * Dynamic state
     */
    projectState: ProjectState;
}
 
/**
 * project config model
 */
export interface ProjectConfigs{
    projectSetting: ProjectSetting; 
    projectState: ProjectState;
    provisionTemplates?:Record<string, Json>;
    deployTemplates?: Record<string, Json>;
    provisionConfigs?:Record<string, Json>;
    deployConfigs?: Record<string, Json>;
    resourceInstanceValues?: Record<string, string>;
    stateValues?: Record<string, string>;
}
