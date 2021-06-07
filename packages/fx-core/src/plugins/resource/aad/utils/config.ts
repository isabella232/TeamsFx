// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ConfigValue, PluginContext } from "@microsoft/teamsfx-api";
import { ResultFactory } from "../aadResult";
import { Plugins } from "../constants/constants";
import { ConfigErrorMessages, GetConfigError } from "../errors";
import { IConfig } from "../interfaces/IConfig";

export class Configs {
	public static readConfig(ctx: PluginContext, configs: IConfig, islocalDebug = false) {
		configs.forEach((configValue, key) => {
			let value: string | undefined;
			if (islocalDebug && configValue.localKey) {
				value = this.readConfigFromContext(ctx, configValue.localPlugin ? configValue.localPlugin : Plugins.AADPlugin.id, configValue.localKey, configValue.required);
				configValue.value = value as string | undefined;
			} else {
				value = this.readConfigFromContext(ctx, configValue.remotePlugin ? configValue.remotePlugin : Plugins.AADPlugin.id, configValue.remoteKey, configValue.required);
				configValue.value = value as string | undefined;
			}
			ctx.logProvider?.info(`Read config: ${key}: ${configValue.value}`);
		});
	}

	public static saveConfig(ctx: PluginContext, configs: IConfig, islocalDebug = false) {
		configs.forEach((configValue, key) => {
			if (islocalDebug && configValue.localKey) {
				this.saveConfigToContext(ctx, configValue.localKey, configValue.value);
			} else {
				this.saveConfigToContext(ctx, configValue.remoteKey, configValue.value);
			}
			ctx.logProvider?.info(`Save config: ${key}: ${configValue.value}`);
		});
	}

	private static saveConfigToContext(ctx: PluginContext, key: string, value: ConfigValue) {
		if (!value) {
			return;
		}
		ctx.config.set(key, value);
	}

	private static readConfigFromContext(ctx: PluginContext, pluginId: string, key: string, required = true): ConfigValue {
		const configValue: ConfigValue = ctx.configOfOtherPlugins.get(pluginId)?.get(key);
		if (!configValue && required) {
			throw ResultFactory.SystemError(
        GetConfigError.name,
        GetConfigError.message(
          ConfigErrorMessages.GetConfigError(pluginId, key)
        )
      );
		}
		return configValue;
	}
}