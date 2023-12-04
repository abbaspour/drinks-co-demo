import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {WebAuth} from "auth0-js"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type InternalOptions = {
    protocol: string,
    scope?: string,
    response_type?: string,
    response_mode?: string,
    nonce?: string,
    code_challenge?: string,
    code_challenge_method?: string,
    auth0Client?: string,
    _csrf: string,
    _intstate?: string,
    state: string,
    leeway?: number
}

type  AuthorizationServer = {
    url: string,
    issuer: string
}

type DictionaryMap = {
    [key : string]: string
}

type Dictionary = {
    signin?: DictionaryMap
}

type ExtraParams = {
    [key : string]: string
}

export interface Auth0Config {
    icon: string,
    assetsUrl: string,
    auth0Domain: string,
    auth0Tenant: string,
    clientConfigurationBaseUrl: string,
    callbackOnLocationHash: boolean,
    callbackURL: string,
    cdn: string,
    clientID: string,
    connection?: string,
    dict?: Dictionary,
    extraParams: ExtraParams,
    internalOptions: InternalOptions,
    widgetUrl: string,
    isThirdPartyClient: boolean,
    authorizationServer: AuthorizationServer,
    colors: object
}

export const parseAuth0Config = (config: string): Auth0Config => {
    return JSON.parse(decodeURIComponent(window.atob(config)));
}

const createAuthClient = (auth0Config: Auth0Config): WebAuth | null => {

    console.log(auth0Config);

    if (!auth0Config?.auth0Tenant) {
        console.log('Invalid Auth0 config.');
        return null;
    }

    const params = {
        overrides: {
            __tenant: auth0Config.auth0Tenant,
            __token_issuer: auth0Config.authorizationServer.issuer,
        },
        domain: auth0Config.auth0Domain,
        clientID: auth0Config.clientID,
        redirectUri: auth0Config.callbackURL,
        responseType: 'code',
        connection: auth0Config?.connection || 'Users',
        ...auth0Config.internalOptions,
    };

    return new WebAuth(params);
};

export {createAuthClient};
