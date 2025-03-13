import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

export async function logout() {
    const token = Cookies.get("access_token");
    if (!token) {
        toast.error("Have error while logging out. Please try again.");
        return;
    } else {
        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.ok) {
                Cookies.remove("access_token");
                Cookies.remove("JSESSIONID", {
                    path: "/",
                    domain: "localhost",
                });
                window.location.href = "/auth/login";
            }
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
            console.error(error);
        }
    }
}

export default function UserButtonWithDropDown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                    <User />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => {
                            window.location.href = "/profile";
                        }}
                    >
                        Profile
                        {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            window.location.href = "/orders";
                        }}
                    >
                        Recent Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        Settings
                        <DropdownMenuShortcut>Coming soon</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive hover:!text-destructive"
                    onClick={() => logout()}
                >
                    <LogOut />
                    Log out
                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function UserButtonWithDropDownNotLogin() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <User />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                    Login or Register to access more features
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => {
                            window.location.href = "/auth/login";
                        }}
                    >
                        Login
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            window.location.href = "/auth/register";
                        }}
                    >
                        Register
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
