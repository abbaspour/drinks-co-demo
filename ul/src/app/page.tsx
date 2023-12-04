import {Metadata} from "next"
import Image from "next/image"
import Link from "next/link"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {UserAuthForm} from "@/components/user-auth-form"
import {ClientLogo} from "@/components/client-logo"

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
    return (
        <>
            <div
                className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="https://drinks-co.vercel.app"
                    className={cn(
                        buttonVariants({variant: "ghost"}),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    Home
                </Link>
                <ClientLogo config={"@@config@@"}/>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                        <UserAuthForm config={"@@config@@"}/>
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                href="https://drinks-co.vercel.app/terms.txt"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="https://drinks-co.vercel.app/privacy.txt"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}