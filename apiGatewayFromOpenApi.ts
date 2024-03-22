#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Architecture, FunctionUrlAuthType, HttpMethod, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ApiGatewayFromOpenApiStack');

// Lambda関数を作成
const lambda = new cdk.aws_lambda_nodejs.NodejsFunction(stack, 'Lambda', {
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

cdk.Tags.of(app).add('Project', "ibaraki")
cdk.Tags.of(app).add('Billing', "ibaraki")