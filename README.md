# TypeScript + Expo + Keycloak login

This package is based on [react-native-login-keycloak](https://github.com/mahomahoxd/react-native-login-keycloak).

It lets you login in against a keycloak instance from an expo app.


```typescript
App.tsx example

import { ... }
import { API_URL, API_WS, AUTH_APP, clientId ,realm } from "./config";
import { ExpoKeyckloakLogin, defaultTokenStorage } from 'expo-login-keycloak';


let token: string = null;

export default class App extends React.Component<Props, States>{

  private loadResourcesAsync = async () => {

    await Promise.all([
      Asset.loadAsync([
       // require('./YOURICON'),
      ],
      ),
      this.login()
    ]);
  }

  private async login() {
    let login = new ExpoKeyckloakLogin({
      clientId: clientId,
      realm: realm,
      url: AUTH_APP
    })

    let tokens = await login.login()
    await defaultTokenStorage.saveTokens(tokens)
    token = tokens.access_token
    console.log("****token******")
    await defaultTokenStorage.showUser()
  }
  {
  ...
  }

  //render example

  public render() {
  ....
  }
}
```