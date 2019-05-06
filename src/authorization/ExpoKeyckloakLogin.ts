
import * as querystring from 'query-string';
import uuidv4 from 'uuid/v4'
import { AuthSession } from 'expo';

interface LoginConfig {
    url: string,
    // Realm as configured in Keycloak admin panel
    realm: string,
    // Client ID as configured in Keycloak admin panel
    clientId: string,
}

interface AuthConfig extends LoginConfig {
    redirectUri: string
}

interface KeycloakTokens {
    refresh_expires_in: number,
    refresh_token: string,
    id_token: string,
    expires_in: string,
    access_token: string
}
export class ExpoKeyckloakLogin {
    constructor(private config: LoginConfig) { 
        this.config = config
    }

    async login() {
        let redirectUrl = AuthSession.getRedirectUrl();
        let config: AuthConfig = Object.assign({}, this.config, {redirectUri: redirectUrl})
        let result: any = await AuthSession.startAsync({
            authUrl: this.getLoginURL(config).url
        });
        let tokens = await this.retrieveTokens(result.params.code, config)
        return tokens

    };


    private getLoginURL(config: AuthConfig) {
        const { redirectUri, clientId } = config;
        const responseType = 'code';
        const state = uuidv4();
        const scope = 'openid';
        const url = `${this.getRealmURL(config)}/protocol/openid-connect/auth?${querystring.stringify({
            scope,
            redirect_uri: redirectUri,
            client_id: clientId,
            response_type: responseType,
            state,
        })}`;
        
        return {
            url,
            state,
        };
    }

    getRealmURL(config: AuthConfig) {
        const { url, realm } = config;
        const slash = url.endsWith('/') ? '' : '/';
        return `${url + slash}realms/${encodeURIComponent(realm)}`;

    }


    async retrieveTokens(code, conf: AuthConfig): Promise<KeycloakTokens> {
        const { redirectUri, clientId } = conf;
        const url = `${this.getRealmURL(conf)}/protocol/openid-connect/token`;
        const requestOptions = {
            method: 'POST',
            body: querystring.stringify({
                grant_type: 'authorization_code', redirect_uri: redirectUri, client_id: clientId, code,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        
        const fullResponse = await fetch(url, requestOptions);
        const jsonResponse: KeycloakTokens = await fullResponse.json();
        return jsonResponse
    }


}