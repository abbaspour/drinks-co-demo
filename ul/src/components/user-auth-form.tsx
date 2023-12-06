"use client"

import * as React from "react"

import {Auth0Config, cn, parseAuth0Config} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {createAuthClient} from "@/lib/utils";
import {ReactNode, useEffect} from "react";
import {WebAuth} from "auth0-js";
import {AlertCircle, CalendarIcon} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {format} from "date-fns";

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

enum PasswordPolicy {
    none = "none",
    low = "low",
    fair = "fair",
    good = "good",
    excellent = "excellent"
}

type PasswordComplexityOptions = {
    min_length: number
}

type Connection = {
    name: string,
    passwordPolicy?: PasswordPolicy,
    password_complexity_options?: PasswordComplexityOptions
    showSignup?: boolean,
    showForgot?: boolean,
    requires_username?: boolean,
    scope?: Array<string>
    domain?: string,
    domain_aliases?: Array<string>
}


type Strategy = {
    name: string,
    connections: Array<Connection>
}

type ClientConfig = {
    id: string,
    tenant: string,
    subscription: string,
    authorize: string,
    callback: string,
    hasAllowedOrigins: boolean,
    strategies: Array<Strategy>
}

const CLIENT_JS_REGEX = /Auth0.setClient\((.+)\);$/;

export function UserAuthForm({className, config, ...props}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [auth0Config, setAuth0Config] = React.useState<Auth0Config>();
    const [clientConfig, setClientConfig] = React.useState<ClientConfig>();
    const [webClient, setWebClient] = React.useState<WebAuth>();
    const [date, setDate] = React.useState<Date>();

    useEffect(() => {
        const parsed = parseAuth0Config(config);
        if (parsed) {
            setAuth0Config(parsed);
            const client = createAuthClient(parsed);
            if (client)
                setWebClient(client);
        }
    }, [config]);

    useEffect(() => {
        if (!auth0Config || !auth0Config.auth0Domain || !auth0Config.clientID)
            return;

        const fetchClientJs = async (): Promise<ClientConfig> => {
            const response = await window.fetch(`https://${auth0Config.auth0Domain}/client/${auth0Config.clientID}.js`);
            const clientJs = await response.text();
            const matched = clientJs.match(CLIENT_JS_REGEX);
            if (!matched || matched.length === 0)
                return Promise.reject("no match");
            const clientJson = matched[1];
            return JSON.parse(clientJson)
        }

        fetchClientJs()
            .then(cc => setClientConfig(cc))
            .catch(e => {
                console.log('failed fetch client', e);
            })

    }, [auth0Config]);

    async function onSignUpSubmit(event: React.FormEvent<LoginFormElement>) {
        event.preventDefault();

        if (!webClient || !auth0Config) {
            console.log("no web client");
            return
        }

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;
        const connection = auth0Config.connection || 'Users';
        const userMetadata : {[key: string]: string} = {};

        if(date)
            userMetadata["dob"] = date.toISOString();

        console.log(`sign-up & login: ${email} / ${password}`);

        setIsLoading(true)

        webClient.signup({
                email,
                password,
                connection,
                userMetadata
            },
            (err) => {
                if (err) {
                    setErrorMessage(err.policy || err.description || 'unknown error');
                    setIsLoading(false);
                } else {
                    webClient.login({
                        username: email,
                        password,
                        realm: connection
                    }, (err) => {
                        if (err) {
                            setErrorMessage(err.policy || err.description || 'unknown error');
                            setIsLoading(false);
                        }
                    });
                }
            });

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)

    }

    async function onCredentialsSubmit(event: React.FormEvent<LoginFormElement>) {

        event.preventDefault();

        if (!webClient || !auth0Config) {
            console.log("no web client");
            return
        }

        webClient.login({
                username: event.currentTarget.email.value,
                password: event.currentTarget.password.value,
                realm: auth0Config.connection || 'Users'
            },
            (err) => {
                if (err) {
                    setErrorMessage(err.policy || err.description || 'unknown error');
                    setIsLoading(false);
                }
            });

        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    async function onFederatedSubmit(connection: string) {
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        webClient &&
        webClient.authorize({connection});
    }

    const icon = (connection: string): ReactNode => {
        switch (connection) {
            case "google-oauth2":
                return <Icons.google className="mr-2 h-4 w-4"/>;
            case "github":
                return <Icons.gitHub className="mr-2 h-4 w-4"/>;
            case "apple":
                return <Icons.apple className="mr-2 h-4 w-4"/>;
            case "paypal":
                return <Icons.paypal className="mr-2 h-4 w-4"/>;
            case "twitter":
                return <Icons.twitter className="mr-2 h-4 w-4"/>;
            case "facebook":
                return <Icons.facebook className="mr-2 h-4 w-4"/>;
            default:
                return <Icons.npm className="mr-2 h-4 w-4"/>;
        }
    }

    const name = (connection: string): string =>
        connection.charAt(0).toUpperCase() + connection.split('-')[0].slice(1);

    function renderSocials(): ReactNode {
        if (!clientConfig || clientConfig?.strategies.length === 0)
            return (<></>);

        const socials = Array<ReactNode>();

        for (let s of clientConfig.strategies) {
            if (s.name === "auth0")
                continue;

            for (let c of s.connections) {
                socials.push(
                    <Button variant="outline" type="button" disabled={isLoading}
                            onClick={() => onFederatedSubmit(c.name)}>
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        ) : (
                            icon(c.name)
                        )}{" "}
                        {name(c.name)}
                    </Button>
                );
            }
        }

        if (socials.length === 0)
            return (<></>);

        return (
            <div className="flex flex-col">
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
                {socials}
            </div>
        )
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome
                    {auth0Config &&
                    auth0Config?.dict?.signin?.title ? ` to ${auth0Config.dict.signin.title}` : ''
                    }
                </h1>
                {/*
                <p className="text-sm text-muted-foreground">
                    Enter your credentials below
                </p>
                */}
            </div>
            {errorMessage &&
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            }
            <Tabs defaultValue="log-in" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="log-in">Log In</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="log-in">
                    <Card>
                        <CardHeader>
                            <CardDescription>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email and password below
                                </p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form onSubmit={onCredentialsSubmit}>
                                <div className="grid gap-2">
                                    <div className="grid gap-1">
                                        <Label className="sr-only" htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            placeholder={auth0Config && auth0Config?.extraParams?.login_hint}
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="sr-only" htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button variant="outline" type="submit" disabled={isLoading}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                        )}
                                        Sign In
                                    </Button>
                                </div>
                            </form>
                            {
                                clientConfig &&
                                renderSocials()
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="sign-up">
                    <Card>
                        <CardHeader>
                            <CardDescription>
                                <p className="text-sm text-muted-foreground">
                                    Enter your details below
                                </p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form onSubmit={onSignUpSubmit}>
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
                                            autoComplete="false"
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="sr-only" htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {auth0Config &&
                                        auth0Config?.dict?.signin?.title === "Fizzy Fusion" &&
                                        <div className="grid gap-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span>Date of Birth</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    }
                                    <Button variant="outline" type="submit" disabled={isLoading}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                        )}
                                        Sign Up
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}