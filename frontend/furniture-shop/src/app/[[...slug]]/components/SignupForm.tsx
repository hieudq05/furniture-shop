"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api/auth/register";

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function submitSignup(e: React.FormEvent) {
        e.preventDefault(); // ✅ Ngăn reload trang

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrorMessage("Invalid email format.");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }
        if (password !== reEnterPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}?email=${encodeURIComponent(
                    email
                )}&password=${encodeURIComponent(
                    password
                )}&fullName=${encodeURIComponent(
                    fullName
                )}&phone=${encodeURIComponent(phone)}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                Cookies.set("access_token", data.data.access_token, {
                    expires: 1,
                });
                setErrorMessage("Register successful.");
                setTimeout(() => {
                    window.location.href = "/"; // ✅ Chuyển hướng
                }, 1000);
            } else {
                setErrorMessage(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="p-6">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Hi, let's create your account
                    </CardTitle>
                    <CardDescription>Register with your email</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="registerForm"
                        method="POST"
                        onSubmit={submitSignup}
                    >
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullname">Full name</Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        name="fullName"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="Your phone number"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Confirm Password
                                        </Label>
                                    </div>
                                    <Input
                                        id="reEnterPassword"
                                        type="password"
                                        value={reEnterPassword}
                                        onChange={(e) =>
                                            setReEnterPassword(e.target.value)
                                        }
                                        placeholder="Repeat your password"
                                        required
                                    />
                                </div>
                                {errorMessage &&
                                    (errorMessage === "Login successful." ? (
                                        <div className="text-green-500 text-sm flex gap-1 items-center">
                                            {errorMessage}
                                        </div>
                                    ) : (
                                        <div className="text-red-500 text-sm flex gap-1 items-center">
                                            {errorMessage}
                                        </div>
                                    ))}
                                <Button type="submit" className="w-full">
                                    Continue to register
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Have an account?{" "}
                                <a
                                    href="/auth/login"
                                    className="underline underline-offset-4"
                                >
                                    Login
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-gray-300 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
