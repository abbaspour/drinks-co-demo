"use client"

import * as React from "react";
import {Auth0Config, cn, parseAuth0Config} from "@/lib/utils";
import {useEffect} from "react";

interface ClientLogoProps extends React.HTMLAttributes<HTMLDivElement> {
    config: string
}

export function ClientLogo({className, config, ...props}: ClientLogoProps) {
    const [auth0Config, setAuth0Config] = React.useState<Auth0Config>();

    useEffect(() => {
        setAuth0Config(parseAuth0Config(config));
    }, [config]);

    return (
        <div>
            {auth0Config?.clientID &&
                <img
                    src={`https://drinks-co.vercel.app/logo/${auth0Config.clientID}.png`}
                    alt="Client Logo"
                    className="block dark:hidden"
                />
            }
        </div>
    );

    /*
            <div className={cn("grid gap-6", className)} {...props}>
                {auth0Config &&
                    auth0Config.clientID
                }
                <Image
                    src="/examples/authentication-light.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
            </div>
        );
    */
}
