"use client"

import * as React from "react"

import {Auth0Config, cn, parseAuth0Config} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {createAuthClient} from "@/lib/utils";
import {useEffect} from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    config: string
}

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement,
    password: HTMLInputElement
}

interface LoginFormElement extends HTMLFormElement {
    readonly elements: FormElements
}

export function UserAuthForm({className, config, ...props}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [auth0Config, setAuth0Config] = React.useState<Auth0Config>();

    useEffect(() => {
        setAuth0Config(parseAuth0Config(config));
    }, [config]);

    async function onSubmit(event: React.FormEvent<LoginFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        createAuthClient(config).login({
                username: event.currentTarget.email.value,
                password: event.currentTarget.password.value,
                realm: 'Users'
            },
            (err) => {
                if (err)
                    setErrorMessage(err.policy || err.description || '');
            });
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            {errorMessage &&
                <div className="error"> {errorMessage} </div>
            }
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder=""
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder=""
                            type="password"
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        Sign In
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4"/>
                )}{" "}
                Github
            </Button>
        </div>
    )
}