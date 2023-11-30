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
        <div className={cn("grid gap-6", className)} {...props}>
            {auth0Config &&
                auth0Config.clientID
            }
        </div>
    );
}
