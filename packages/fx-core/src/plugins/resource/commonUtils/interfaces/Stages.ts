// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ConfigValue, FxError, PluginContext, Result } from "@microsoft/teamsfx-api";
import { IConfig, IConfigValue } from "./IConfig";
import { IPlugin } from "./IPlugin";

const Telemetry = {
  component: "component",
  success: {
    key: "success",
    yes: "yes",
    no: "no",
  }
};

interface IEventMessages {
  telemetry: string,
  log: string,
}

export interface IStageEvents {
  start: IEventMessages,
  end: IEventMessages,
}

export abstract class Stage {
  protected inputConfig?: IConfig;
  protected outputConfig?: IConfig;
  protected ctx: PluginContext;
  protected isLocalDebug: boolean;
  protected plugin: IPlugin;
  protected abstract event: IStageEvents;

  constructor(ctx: PluginContext, isLocalDebug = false, plugin: IPlugin) {
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

  protected sendStartTelemetryEvent(): void {
    const properties: { [key: string]: string } = {};
    properties[Telemetry.component] = this.plugin.id;
    properties[Telemetry.success.key] = Telemetry.success.yes;
    this.ctx.telemetryReporter?.sendTelemetryEvent(this.event.start.telemetry, properties);
  }

  protected sendTelemetryEvent(properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
    if (!properties) {
      properties = {};
    }

    properties[Telemetry.component] = this.plugin.id;
    properties[Telemetry.success.key] = Telemetry.success.yes;

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
}