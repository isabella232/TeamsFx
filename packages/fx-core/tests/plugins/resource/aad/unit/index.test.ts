// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "mocha";
import * as chai from "chai";
import * as dotenv from "dotenv";
import { PluginContext } from "@microsoft/teamsfx-api";
import { AadAppForTeamsPlugin } from "../../../../../src/plugins/resource/aad/index";
import {
  mockTokenProviderAzure,
  mockTokenProvider,
  TestHelper,
  mockTokenProviderAzureGraph,
  mockTokenProviderGraph,
} from "../helper";
import sinon from "sinon";

dotenv.config();
const testWithAzure: boolean = process.env.UT_TEST_ON_AZURE ? true : false;

describe("AadAppForTeamsPlugin: CI", () => {
  let plugin: AadAppForTeamsPlugin;
  let context: PluginContext;

  beforeEach(async () => {
    plugin = new AadAppForTeamsPlugin();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("provision: tab", async function () {
    context = await TestHelper.pluginContext(new Map(), true, false, false);
    context.appStudioToken = mockTokenProvider();
    context.graphTokenProvider = mockTokenProviderGraph();

    const provision = await plugin.provision(context);
    chai.assert.isTrue(provision.isOk());
    console.log(context.config);
  });
});
