"use client";

import * as React from "react";
import { Search, ShoppingBag, User, X } from "lucide-react";
import styles from "../../style/ProductList.module.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserButtonWithDropDown, {
    UserButtonWithDropDownNotLogin,
} from "./UserButtonWithDropDown";
import Cookies from "js-cookie";

export interface UserInfo {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    image: string;
    sub: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
}

export interface Role {
    id: string;
    name: string;
}

export interface LoginResponse {
    code: string;
    message: string;
    data: {
        token: string;
    };
}

const href = "http://localhost:3000/category";

export function getUserClaims() {
    const token = Cookies.get("access_token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

function NavUser({ cartItems }: { cartItems: any }) {
    const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").reduce(
        (total: number, item: any) => total + item.quantity,
        0
    );

    const [isBannerVisible, setIsBannerVisible] = React.useState(() => {
        return localStorage.getItem("bannerVisible") === "false" ? false : true;
    });

    const handleCloseBanner = () => {
        localStorage.setItem("bannerVisible", "false");
        setIsBannerVisible(false);
    };

    const [categories, setCategories] = React.useState<Category[]>([]);

    React.useEffect(() => {
        fetch("http://localhost:8080/api/category/get/all")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const user: UserInfo | null = getUserClaims() as UserInfo | null;
    if (user) {
        user.email = user.sub;
    }

    return (
        <div
            className={`${styles.storeHeaderNavBarWithProm} sticky top-0 z-50 w-full bg-opacity-75 filter backdrop-blur-xl bg-white`}
        >
            {isBannerVisible && (
                <div className="bg-slate-200 w-full flex justify-between px-4 py-2 items-center">
                    <div className="flex">
                        Summer Sale - Up to 20% off! Use code{" "}
                        <strong className="mx-1">SAVE20</strong> at checkout
                    </div>
                    <Button variant={"link"} onClick={handleCloseBanner}>
                        <X />
                    </Button>
                </div>
            )}
            <div className="flex justify-between items-center px-4 py-4 w-full">
                <div className={styles.logo}>
                    <Link to="/" className="font-medium text-xl">
                        FurnitStyle.
                    </Link>
                </div>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
                                About Us
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/"
                                            >
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    FurniStyle
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Beautifully designed
                                                    furniture for your home.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem
                                        href="/docs"
                                        title="Fanpage Facebook"
                                    >
                                        Re-usable components built using Radix
                                        UI and Tailwind CSS.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/installation"
                                        title="Github"
                                    >
                                        How to install dependencies and
                                        structure your app.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/primitives/typography"
                                        title="Linkedin"
                                    >
                                        Styles for headings, paragraphs,
                                        lists...etc
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
                                Products
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    <ListItem
                                        key="All"
                                        title="All Products"
                                        href={"/products"}
                                    >
                                        Explore all products in our store.
                                        Include furniture, home decor, and more.
                                    </ListItem>
                                    {categories.map((category) => (
                                        <ListItem
                                            key={category.id}
                                            title={category.name}
                                            href={href + "/" + category.id}
                                        >
                                            {category.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        {/* <NavigationMenuItem>
                            <LinkComp href="/docs" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Sale
                                </NavigationMenuLink>
                            </LinkComp>
                        </NavigationMenuItem> */}
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex">
                    <Button variant={"ghost"}>
                        <Search />
                    </Button>
                    {user == null ? (
                        <UserButtonWithDropDownNotLogin />
                    ) : (
                        <UserButtonWithDropDown />
                    )}
                    <Button
                        variant={"ghost"}
                        className="flex gap-1"
                        onClick={() => (window.location.href = "/cart")}
                    >
                        <ShoppingBag />
                        {cartItems === null ? (
                            <Badge className="rounded-full size-fit px-1.5 py-0">
                                {cartCount}
                            </Badge>
                        ) : cartItems === 0 ? (
                            ""
                        ) : (
                            <Badge className="rounded-full size-fit px-1.5 py-0">
                                {cartItems.reduce(
                                    (total: number, item: any) =>
                                        total + item.quantity,
                                    0
                                )}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export default NavUser;
