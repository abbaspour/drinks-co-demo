import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {WebAuth} from "auth0-js"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const createAuthClient = (config: string): WebAuth => {

    //console.log(`config: ${config}`);

    let auth0Config: any = {};

    try {
        auth0Config = JSON.parse(decodeURIComponent(window.atob(config)));
    } catch (error) {
        throw error;
    }

    if (!auth0Config?.auth0Tenant) {
        throw new Error('Invalid Auth0 config.');
    }

    const leeway = auth0Config?.internalOptions?.leeway;

    if (leeway) {
        const convertedLeeway = Number.parseInt(leeway);

        if (!Number.isNaN(convertedLeeway)) {
            auth0Config.internalOptions.leeway = convertedLeeway;
        }
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
