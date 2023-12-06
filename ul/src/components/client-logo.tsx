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
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900">
                {auth0Config?.clientID &&
                    <img
                        src={`https://drinks-co.vercel.app/client/${auth0Config.clientID}.png`}
                        width={1280}
                        height={843}
                        alt="Client Logo"
                        className="block dark:hidden"
                    />
                }
            </div>
            <div className="relative z-20 flex items-center text-lg font-medium">
                {auth0Config &&
                    auth0Config?.dict?.signin?.title
                }
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        Crafting Moments, Pouring Joy.
                    </p>
                </blockquote>
            </div>
        </div>

    );

}
