#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Architecture, FunctionUrlAuthType, HttpMethod, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as output from './output.json';


// APPを定義
const app = new cdk.App();
// Stackを定義
const lambdaApiStack = new cdk.Stack(app, 'lambdaApiStack');
const apiGatewayStack = new cdk.Stack(app, 'apiGatewayStack');
apiGatewayStack.addDependency(lambdaApiStack); // 依存関係を追加

// リソースの作成
const createLambda = (lambdaApiStack: cdk.Stack): void => {
  // Lambda関数を作成
  const lambda = new NodejsFunction(lambdaApiStack, 'Lambda', {
    entry: 'lambda/index.ts',
    handler: 'handler',
    architecture: Architecture.ARM_64,
    runtime: Runtime.NODEJS_18_X,
  });
  // Lambda関数のURLを作成
  const url = lambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedMethods: [HttpMethod.ALL],
      allowedOrigins: ['*'],
    },
  })
  new cdk.CfnOutput(lambdaApiStack, 'LambdaUrl', {
    value: url.url,
    exportName: 'LambdaUrl',
  });
}

const createAPIGateway = (apiGatewayStack: cdk.Stack): void => {
  // API定義ファイルの読み込み
  const apiPath = path.join(__dirname, `api-doc/api.yaml`);
  const yamlFile = fs.readFileSync(apiPath).toString();

  // yamlファイルの{TARGET_URL}をLambdaのURLに置換
  const url = output.lambdaApiStack.LambdaUrl;
  console.log(url);

  const replacedYaml = yamlFile.replace(
    /\{TARGET_URL\}/g,
    url,
  );
  console.log(replacedYaml);
  const openApiDefinition = yaml.parse(replacedYaml);

  // API Gatewayを作成
  const api = new apigateway.SpecRestApi(apiGatewayStack, "ApiGateway", {
    apiDefinition: apigateway.ApiDefinition.fromInline(openApiDefinition),
    restApiName: 'sample-api-from-openapi',
  });
};

createLambda(lambdaApiStack);
createAPIGateway(apiGatewayStack);

// タグを追加
cdk.Tags.of(app).add('Project', "ibaraki")
cdk.Tags.of(app).add('Billing', "ibaraki")