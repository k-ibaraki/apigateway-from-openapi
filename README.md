# apigateway-from-open-api
OpenAPIドキュメントからAPI Gatewayをつくります(cdk)

## install
```
npm i
```

## build
```
npm run build
```

## deploy
```
npx cdk deploy apiGatewayStack --profile {profile}
```

## destroy
```
npx cdk destroy lambdaApiStack --profile {profile}
```