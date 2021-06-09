// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ConfigValue, FxError, IProgressHandler, LogLevel, PluginContext, Result, UserError } from "@microsoft/teamsfx-api";
import { IConfig, IConfigValue } from "./IConfig";
import { IStageEvents } from "./IEvents";
import { IPlugin } from "./IPlugin";

const Telemetry = {
  component: "component",
  success: {
    key: "success",
    yes: "yes",
    no: "no",
  },
  error: {
    errorCode: "error-code",
    errorMessage: "error-message",
    errorType: {
      key: "error-type",
      userError: "user",
      systemError: "system",
    }
  },
  appId: "appid",
};

export abstract class Stage {
  public progressBar?: IProgressHandler;
  protected inputConfig?: IConfig;
  protected outputConfig?: IConfig;
  protected ctx: PluginContext;
  protected isLocalDebug: boolean;
  protected plugin: IPlugin;
  protected abstract event: IStageEvents;

  constructor(ctx: PluginContext, plugin: IPlugin, isLocalDebug = false) {
    this.ctx = ctx;
    this.isLocalDebug = isLocalDebug;
    this.plugin = plugin;
  }

  public abstract run(): Promise<Result<any, FxError>>;

  public getConfig(key: string): ConfigValue {
    if (!this.inputConfig || !this.inputConfig.has(key)) {
      return undefined;
    }

    const value = this.inputConfig.get(key);
    return value?.value;
  }

  public setConfig(key: string, value: ConfigValue): void {
    if (!this.outputConfig || !this.outputConfig.has(key)) {
      return;
    }

    const configValue = this.outputConfig.get(key) as IConfigValue;
    configValue.value = value;
    this.outputConfig.set(key, configValue);
    console.log(`${key}::${value}`);
  }

  public sendTelemetryErrorEvent(error: FxError, detailedMessage?: string ,properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
    if (!properties) {
      properties = {};
    }

    let errorMessage = error.message;
    if (detailedMessage) {
      errorMessage += ` Detailed Message: ${detailedMessage}`;
    }

    properties[Telemetry.component] = this.plugin.id;
    properties[Telemetry.success.key] = Telemetry.success.no;
    properties[Telemetry.appId] = this.getAppId();
    properties[Telemetry.error.errorCode] = `${this.plugin.shortName}.${error.name}`;
    properties[Telemetry.error.errorType.key] = error instanceof UserError ? Telemetry.error.errorType.userError : Telemetry.error.errorType.systemError;
    properties[Telemetry.error.errorMessage] = errorMessage;
    this.ctx.telemetryReporter?.sendTelemetryErrorEvent(this.event.end.telemetry, properties, measurements);
  }

  public sendLog(message: string, logLevel: LogLevel): void {
    this.ctx.logProvider?.log(logLevel, message);
  }

  protected sendStartTelemetryEvent(): void {
    const properties: { [key: string]: string } = {};
    properties[Telemetry.component] = this.plugin.id;
    properties[Telemetry.success.key] = Telemetry.success.yes;
    properties[Telemetry.appId] = this.getAppId();
    this.ctx.telemetryReporter?.sendTelemetryEvent(this.event.start.telemetry, properties);
  }

  protected sendTelemetryEvent(properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
    if (!properties) {
      properties = {};
    }

    properties[Telemetry.component] = this.plugin.id;
    properties[Telemetry.success.key] = Telemetry.success.yes;
    properties[Telemetry.appId] = this.getAppId();
    this.ctx.telemetryReporter?.sendTelemetryEvent(this.event.end.telemetry, properties, measurements);
  }

  protected readConfig(): void {
    if (!this.inputConfig) {
      return;
    }

    this.inputConfig.forEach((configValue, key) => {
      let value: string | undefined;
      if (this.isLocalDebug && configValue.localKey) {
        value = this.readConfigFromContext(configValue.localPlugin ? configValue.localPlugin : this.plugin.id, configValue.localKey, configValue.required);
        configValue.value = value as string | undefined;
      } else {
        value = this.readConfigFromContext(configValue.remotePlugin ? configValue.remotePlugin : this.plugin.id, configValue.remoteKey, configValue.required);
        configValue.value = value as string | undefined;
      }
    });
  }

  protected saveConfig(islocalDebug = false): void {
    if (!this.outputConfig) {
      return;
    }

    this.outputConfig.forEach((configValue, key) => {
      if (islocalDebug && configValue.localKey) {
        this.saveConfigToContext(configValue.localKey, configValue.value);
      } else {
        this.saveConfigToContext(configValue.remoteKey, configValue.value);
      }
      this.ctx.logProvider?.info(`${key}: ${configValue.value}`);
    });
  }

  protected getLogMessage(message: string): string {
    return `[${this.plugin.name}] ${message}`;
  }

  protected createProgressBar(title: string, steps: number): void {
    this.progressBar = this.ctx.dialog?.createProgressBar(title, steps) as IProgressHandler;
  } 

  private readConfigFromContext(pluginId: string, key: string, required = true): ConfigValue {
    const configValue: ConfigValue = this.ctx.configOfOtherPlugins.get(pluginId)?.get(key);
    if (!configValue && required) {
      throw new Error(`Failed to get key "${key}" from plugin "${pluginId}"`);
    }
    return configValue;
  }

  private saveConfigToContext(key: string, value: ConfigValue): void {
    if (!value) {
      return;
    }
    this.ctx.config.set(key, value);
  }

  private getAppId(): string {
    const appId = this.ctx.configOfOtherPlugins.get("solution")?.get("remoteTeamsAppId");
    return appId ? appId as string : "";
  }
}