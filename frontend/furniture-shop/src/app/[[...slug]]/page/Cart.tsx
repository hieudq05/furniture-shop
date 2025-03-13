"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductInCart } from "./DetailsProduct";
import { toast } from "sonner";

function Cart() {
    const [cartItems, setCartItems] = useState(() => {
        const items = localStorage.getItem("cart");
        return items ? (JSON.parse(items) as ProductInCart[]) : [];
    });

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 w-full">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl text-center font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        Your Shopping Cart
                    </h2>

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:grid lg:grid-cols-1 xl:gap-8">
                        <div className="mx-auto w-full flex-none">
                            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ">
                                {cartItems.length == 0 ? (
                                    <div className="py-6 md:p-6">
                                        <p className="text-center text-lg font-semibold text-gray-900 dark:text-white">
                                            Your cart is empty
                                        </p>
                                        <div className="flex items-center justify-center">
                                            <Button
                                                variant={"link"}
                                                onClick={() => {
                                                    window.location.href =
                                                        "/products";
                                                }}
                                                className="mt-4 flex gap-1"
                                            >
                                                Continue Shopping
                                                <svg
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 12H5m14 0-4 4m4-4-4-4"
                                                    />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div className="p-4 md:p-6" key={index}>
                                            <div className="space-y-4 md:flex md:items-center md:gap-6 md:space-y-0">
                                                <a
                                                    href={
                                                        "/products/" + item.id
                                                    }
                                                    className="shrink-0 md:order-1 w-fit"
                                                >
                                                    <img
                                                        src={
                                                            item.productSelected
                                                                .productImage
                                                                .src
                                                        }
                                                        alt={
                                                            item.productSelected
                                                                .productImage
                                                                .alt
                                                        }
                                                        className="w-32 aspect-[3/4] object-cover rounded-lg"
                                                    />
                                                </a>

                                                <label
                                                    htmlFor="counter-input"
                                                    className="sr-only"
                                                >
                                                    Choose quantity:
                                                </label>
                                                <div className="md:order-2 flex justify-between w-full">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between md:order-3 md:justify-end">
                                                        <div className="flex items-center w-fit">
                                                            <button
                                                                type="button"
                                                                id="decrement-button"
                                                                data-input-counter-decrement="counter-input"
                                                                onClick={() => {
                                                                    const newItems =
                                                                        [
                                                                            ...cartItems,
                                                                        ];
                                                                    if (
                                                                        newItems[
                                                                            index
                                                                        ]
                                                                            .quantity >
                                                                        1
                                                                    ) {
                                                                        newItems[
                                                                            index
                                                                        ]
                                                                            .quantity--;
                                                                    }
                                                                    setCartItems(
                                                                        newItems
                                                                    );
                                                                    localStorage.setItem(
                                                                        "cart",
                                                                        JSON.stringify(
                                                                            cartItems
                                                                        )
                                                                    );
                                                                }}
                                                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                            >
                                                                <svg
                                                                    className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 18 2"
                                                                >
                                                                    <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M1 1h16"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <input
                                                                type="text"
                                                                id="counter-input"
                                                                data-input-counter
                                                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                                                placeholder=""
                                                                value={
                                                                    item.quantity
                                                                }
                                                                min={1}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="mt-4 md:mt-0 md:text-end md:order-4 md:w-32 w-fit">
                                                            <p className="text-base font-medium text-green-600 dark:text-white">
                                                                $
                                                                {Math.round(
                                                                    item
                                                                        .productSelected
                                                                        .price *
                                                                        item.quantity *
                                                                        100
                                                                ) / 100}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="w-full min-w-0 flex-1 space-y-5 md:order-2 md:max-w-md">
                                                        <a
                                                            href={
                                                                "/products/" +
                                                                item.id
                                                            }
                                                            className="text-base font-medium text-gray-900 hover:underline dark:text-white w-fit"
                                                        >
                                                            {item.name}
                                                        </a>

                                                        <div className="flex gap-3 w-fit">
                                                            <Badge
                                                                variant={
                                                                    "outline"
                                                                }
                                                            >
                                                                Color:{" "}
                                                                {
                                                                    item
                                                                        .productSelected
                                                                        .productColor
                                                                        .name
                                                                }
                                                            </Badge>
                                                            <Badge
                                                                variant={
                                                                    "outline"
                                                                }
                                                            >
                                                                Size:{" "}
                                                                {
                                                                    item
                                                                        .productSelected
                                                                        .productSize
                                                                        .sizeName
                                                                }
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center gap-4 w-fit">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                                                onClick={() => {
                                                                    const newItems =
                                                                        [
                                                                            ...cartItems,
                                                                        ];
                                                                    newItems.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    setCartItems(
                                                                        newItems
                                                                    );
                                                                    console.log(
                                                                        newItems
                                                                    );
                                                                    localStorage.setItem(
                                                                        "cart",
                                                                        JSON.stringify(
                                                                            newItems
                                                                        )
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    className="me-1.5 h-5 w-5"
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M6 18 17.94 6M18 18 6.06 6"
                                                                    />
                                                                </svg>
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {cartItems.length > 0 ? (
                        <div className="mt-16 w-full gap-4 dark:bg-gray-900 rounded-3xl border border-gray-300 shadow-md">
                            <div className="space-y-4 bg-white p-4 dark:bg-gray-800 sm:p-6 col-span-2 rounded-3xl">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Order summary
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                                                Original price
                                            </dt>
                                            <dd className="text-base font-medium text-gray-900 dark:text-white">
                                                $
                                                {Math.round(
                                                    cartItems.reduce(
                                                        (acc, item) =>
                                                            acc +
                                                            item.productSelected
                                                                .price *
                                                                item.quantity,
                                                        0
                                                    ) * 100
                                                ) / 100}
                                            </dd>
                                        </dl>
                                    </div>

                                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <dt className="text-lg font-bold text-gray-900 dark:text-white">
                                            Total
                                        </dt>
                                        <dd className="text-lg font-bold text-gray-900 dark:text-white">
                                            $
                                            {Math.round(
                                                cartItems.reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.productSelected
                                                            .price *
                                                            item.quantity,
                                                    0
                                                ) * 100
                                            ) / 100}
                                        </dd>
                                    </dl>
                                </div>

                                <Button
                                    className="flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 focus:ring-offset-2"
                                    onClick={() => {
                                        window.location.href = "/cart/payment";
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>

                                <div className="flex items-center justify-center">
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                        or
                                    </span>
                                    <Button
                                        variant={"link"}
                                        onClick={() => {
                                            window.location.href = "/products";
                                        }}
                                        className="inline-flex px-2 items-center text-sm font-medium text-primary-700 dark:text-primary-500"
                                    >
                                        Continue Shopping
                                        <svg
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 12H5m14 0-4 4m4-4-4-4"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {/* <div className="bg-white w-full">
                        <div className="mx-auto my-20 w-full">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-10">
                                Customers also purchased
                            </h2>

                            <Carousel className="w-full">
                                <CarouselContent className="-ml-6">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <CarouselItem
                                                key={index}
                                                className="pl-6 md:basis-1/3 2xl:basis-1/4 basis-1/2"
                                            >
                                                <div className="p-0">
                                                    <Card className="border-none shadow-none">
                                                        <CardContent className="flex items-center justify-center">
                                                            <div className="group relative p-0 w-full aspect-[3/4]">
                                                                <img
                                                                    src="/Frame 9.jpg"
                                                                    alt="Front of men&#039;s Basic Tee in black."
                                                                    className="w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:h-full"
                                                                />
                                                                <div className="mt-4 flex justify-between">
                                                                    <div>
                                                                        <h3 className="text-sm text-gray-700">
                                                                            <a href="#">
                                                                                <span
                                                                                    aria-hidden="true"
                                                                                    className="absolute inset-0"
                                                                                ></span>
                                                                                Basic
                                                                                Tee
                                                                            </a>
                                                                        </h3>
                                                                        <p className="mt-1 text-xl font-medium text-gray-600">
                                                                            19$
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        )
                                    )}
                                </CarouselContent>
                                <div className="mt-8 w-full flex justify-center gap-4">
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </div>
                            </Carousel>
                        </div>
                    </div> */}
                </div>
            </section>
        </>
    );
}

export default Cart;
