#!/usr/bin/env node
import { safeLoadAll } from "js-yaml";
import { readFileSync } from "fs";
import {
  PipelineContext,
  CommonContext,
  DockerContext,
  HelmContext,
} from "./context";
import { DockerShell, DockerConfig } from "./docker";
import { HelmConfig, HelmShell } from "./helm";
import { resolve } from "path";

export async function publish() {
  let pipelineContext: PipelineContext = new PipelineContext();
  pipelineContext.git = {
    branchName: "master",
    commitHash: "b7f5103",
  };

  try {
    let fileContents = readFileSync(resolve(__dirname, "./ci-cd.yaml"), "utf8");
    let data = safeLoadAll(fileContents);

    let dockerPipeline = data.find((c) => c.kind == "docker");
    let dockerConfig: DockerConfig = dockerPipeline;

    let dockerShell = new DockerShell(dockerConfig, pipelineContext);
    await dockerShell.build();
    await dockerShell.push();

    let helmPipeline = data.find((c) => c.kind == "helm");
    let helmConfig: HelmConfig = helmPipeline;

    let helmShell = new HelmShell(helmConfig, pipelineContext);
    await helmShell.addRepo();
    await helmShell.publish();
  } catch (e) {
    console.log(e);
  }
}

publish();
