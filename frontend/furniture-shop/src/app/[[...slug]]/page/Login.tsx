import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "../components/LoginForm";

export default function Login() {
    return (
        <>
            <video
                className="absolute top-0 left-0 w-full h-screen object-cover z-[-1] filter brightness-50"
                autoPlay
                loop
                muted
            >
                <source src="/main.mp4" type="video/mp4" />
            </video>
            <div className="flex w-full h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <a
                        href="/"
                        className="flex items-center gap-2 self-center font-medium text-white"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        FurnitStyle.
                    </a>
                    <LoginForm />
                </div>
            </div>
        </>
    );
}
