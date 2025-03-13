"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { StarIcon } from "@heroicons/react/20/solid";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { set } from "date-fns";

const reviews = { href: "#", average: 4, totalCount: 117 };

export interface Product {
    id: number;
    name: string;
    href: string;
    price: number;
    category: Category;
    productImages: ProductImage[];
    productColors: ProductColor[];
    productSizes: ProductSize[];
    productStocks: ProductStock[];
    description: string;
    hightlight: string;
    details: string;
}

export interface ProductImage {
    alt: string;
    src: string;
}

export interface ProductColor {
    id: number;
    classField: string;
    selectedClass: string;
    name: string;
}

export interface ProductSize {
    id: number;
    sizeName: string;
}

export interface ProductStock {
    id: number;
    price: number;
    stock: number;
    product: Product;
    productColor: ProductColor;
    productSize: ProductSize;
    productImage: ProductImage;
}

export interface CartItem {
    quantity: number;
    productSelected: Product;
}

export interface ProductInCart {
    quantity: number;
    name: string;
    id: Number;
    image: string;
    productSelected: ProductStock;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

async function getProductSameCategory(categoryId: number) {
    try {
        const response = await fetch(
            "http://localhost:8080/api/product/get/in/" +
                categoryId +
                "?page=1",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            console.error("Error: ", response);
            return;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error);
    }
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const DetailsProduct: FunctionComponent = () => {
    const [items, setItems] = useState<ProductInCart[]>(() => {
        const storedItems = localStorage.getItem("cart");
        return storedItems ? JSON.parse(storedItems) : [];
    });
    const [product, setProduct] = useState<Product>({} as Product);
    const [mainImage, setMainImage] = useState<string>("");
    const [productSameCategory, setProductSameCategory] = useState<Product[]>(
        []
    );

    const setCart = (cartItems: any) => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        setItems(cartItems);
    };

    useEffect(() => {
        fetch(
            `http://localhost:8080/api/product/get/${
                window.location.pathname.split("/")[2]
            }`
        )
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                getProductSameCategory(data.category.id).then((products) => {
                    setProductSameCategory(products.products);
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    useEffect(() => {
        if (
            !mainImage &&
            product.productImages &&
            product.productImages.length > 0
        ) {
            setMainImage(
                product.productImages.sort(
                    (a, b) => a.src.length - b.src.length
                )[0].src
            );
        }
    }, [product.productImages]);

    return (
        <>
            <div className="bg-white w-full pt-10">
                <div>
                    {/* Product info */}
                    <div className="mx-auto max-w-2xl pt-4 px-4 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pb-24">
                        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                                {product.name}
                                {/* Image gallery */}
                                <div className="mx-auto gap-3 max-w-2xl grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-4 mt-4">
                                    <img
                                        alt={
                                            product.productImages
                                                ? product.productImages.sort(
                                                      (a, b) =>
                                                          a.src.length -
                                                          b.src.length
                                                  )[0].alt
                                                : "Loading..."
                                        }
                                        src={mainImage}
                                        className="size-full rounded-lg object-cover lg:block col-span-3 row-span-3"
                                    />

                                    <div className="gap-3 grid grid-cols-3 col-span-3">
                                        {product.productImages
                                            ? product.productImages.map(
                                                  (image, index) => (
                                                      <img
                                                          key={index}
                                                          alt={image.alt}
                                                          src={image.src}
                                                          className="size-full rounded-lg object-cover"
                                                      />
                                                  )
                                              )
                                            : "Loading..."}
                                    </div>
                                </div>
                            </h1>
                        </div>

                        {/* Options */}
                        <div className="mt-4 lg:row-span-3 lg:mt-0 col-span-2">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">
                                $
                                {product.productStocks
                                    ? Math.min(
                                          ...product.productStocks.map(
                                              (stock) => stock.price
                                          )
                                      )
                                    : "Loading..."}
                                {product.productStocks
                                    ? product.productStocks.length > 1
                                        ? " - $" +
                                          Math.max(
                                              ...product.productStocks.map(
                                                  (stock) => stock.price
                                              )
                                          )
                                        : null
                                    : null}
                            </p>

                            {/* Reviews */}
                            <div className="mt-6">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center ">
                                        <div className="mr-2 relative top-0.5 text-sm text-gray-500">
                                            {reviews.average}
                                        </div>
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className={classNames(
                                                    reviews.average > rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-200",
                                                    "size-5 shrink-0"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only">
                                        {reviews.average} out of 5 stars
                                    </p>
                                    <a
                                        href={reviews.href}
                                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        {reviews.totalCount} reviews
                                    </a>
                                </div>
                            </div>

                            <div className="mt-4 text-base font-medium text-black">
                                {product.productStocks?.reduce(
                                    (total, stock) => total + stock.stock,
                                    0
                                )}{" "}
                                <span className="text-gray-500 text-sm">
                                    item(s) in stock
                                </span>
                            </div>

                            <div className="mt-10">
                                {/* Colors */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Color
                                    </h3>

                                    <ToggleGroup
                                        type="single"
                                        variant={"outline"}
                                        id="groupColor"
                                        className="flex items-start justify-start mt-4"
                                    >
                                        {product.productColors
                                            ? product.productColors
                                                  .sort((a, b) =>
                                                      a.classField.localeCompare(
                                                          b.classField
                                                      )
                                                  )
                                                  .map((color) => (
                                                      <ToggleGroupItem
                                                          key={color.id}
                                                          value={color.id.toString()}
                                                          id={color.id.toString()}
                                                          name="color"
                                                          aria-label="Toggle bold"
                                                          className="rounded-full p-1.5 w-fit h-fit"
                                                          disabled={
                                                              product.productStocks?.find(
                                                                  (stock) =>
                                                                      stock
                                                                          .productColor
                                                                          .id ===
                                                                          color.id &&
                                                                      stock.stock >
                                                                          0
                                                              )
                                                                  ? false
                                                                  : true
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  "w-10 h-7 rounded-full"
                                                              }
                                                              style={{
                                                                  backgroundColor:
                                                                      color.classField,
                                                              }}
                                                          ></div>
                                                      </ToggleGroupItem>
                                                  ))
                                            : "Loading..."}
                                    </ToggleGroup>
                                </div>

                                {/* Sizes */}
                                <div className="mt-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Size
                                        </h3>
                                    </div>

                                    <ToggleGroup
                                        type="single"
                                        variant={"outline"}
                                        id="groupSize"
                                        className="grid grid-cols-2 gap-2 mt-4"
                                    >
                                        {product.productSizes
                                            ? product.productSizes
                                                  .sort((a, b) =>
                                                      a.sizeName.localeCompare(
                                                          b.sizeName
                                                      )
                                                  )
                                                  .map((size) => (
                                                      <ToggleGroupItem
                                                          key={size.id}
                                                          value={size.id.toString()}
                                                          id={size.id.toString()}
                                                          name="size"
                                                          aria-label="Toggle bold"
                                                          className="rounded-full"
                                                          disabled={
                                                              product.productStocks?.find(
                                                                  (stock) =>
                                                                      stock
                                                                          .productSize
                                                                          .id ===
                                                                          size.id &&
                                                                      stock.stock >
                                                                          0
                                                              )
                                                                  ? false
                                                                  : true
                                                          }
                                                      >
                                                          <div>
                                                              {size.sizeName}
                                                          </div>
                                                      </ToggleGroupItem>
                                                  ))
                                            : "Loading..."}
                                    </ToggleGroup>
                                </div>

                                <Button
                                    className="mt-10 flex w-full items-center justify-center rounded-full border border-transparent px-8 py-5 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-hidden"
                                    onClick={() => {
                                        const productSelected: ProductInCart = {
                                            id: product.id,
                                            name: product.name,
                                            quantity: 1,
                                            image: product.productImages[0].src,
                                            productSelected: {} as ProductStock,
                                        };
                                        const selectedColorButton = document
                                            .getElementById("groupColor")
                                            ?.querySelector(
                                                "button[aria-checked=true]"
                                            );
                                        const selectedSizeButton = document
                                            .getElementById("groupSize")
                                            ?.querySelector(
                                                "button[aria-checked=true]"
                                            );

                                        // Kiểm tra xem người dùng đã chọn màu sắc và kích thước chưa
                                        if (
                                            !selectedColorButton ||
                                            !selectedSizeButton
                                        ) {
                                            toast("Select color and size", {
                                                description:
                                                    "You need to choose both color and size!",
                                                action: "OK",
                                            });
                                            return; // Dừng lại nếu chưa chọn đầy đủ
                                        }

                                        // Lấy thông tin màu và kích thước đã chọn
                                        const selectedColor =
                                            product.productColors.find(
                                                (color) =>
                                                    color.id ===
                                                    parseInt(
                                                        selectedColorButton.id
                                                    )
                                            );
                                        const selectedSize =
                                            product.productSizes.find(
                                                (size) =>
                                                    size.id ===
                                                    parseInt(
                                                        selectedSizeButton.id
                                                    )
                                            );

                                        // Lấy thông tin sản phẩm đã chọn và gán màu và kích thước
                                        const foundStock =
                                            product.productStocks.find(
                                                (stock) =>
                                                    stock.productColor.id ===
                                                        selectedColor?.id &&
                                                    stock.productSize.id ===
                                                        selectedSize?.id
                                            );

                                        if (!foundStock) {
                                            toast("Stock not found", {
                                                description:
                                                    "The selected color and size combination is not available.",
                                                action: "OK",
                                            });
                                            return;
                                        }

                                        productSelected.productSelected =
                                            foundStock;

                                        // Kiểm tra xem sản phẩm cùng màu và size đã có trong giỏ hàng chưa
                                        const updatedItems: ProductInCart[] = [
                                            ...items,
                                        ];
                                        const existingItemIndex =
                                            updatedItems.findIndex(
                                                (item) =>
                                                    item.id ===
                                                        productSelected.id &&
                                                    item.productSelected
                                                        .productColor.id ===
                                                        productSelected
                                                            .productSelected
                                                            .productColor.id &&
                                                    item.productSelected
                                                        .productSize.id ===
                                                        productSelected
                                                            .productSelected
                                                            .productSize.id
                                            );

                                        if (existingItemIndex > -1) {
                                            updatedItems[
                                                existingItemIndex
                                            ].quantity += 1;
                                        } else {
                                            // Nếu chưa có, thêm vào giỏ hàng
                                            updatedItems.push(productSelected);
                                        }

                                        // Cập nhật số lượng sản phẩm còn lạị
                                        const indexProductStock =
                                            product.productStocks.findIndex(
                                                (stock) =>
                                                    stock.id ===
                                                    productSelected
                                                        .productSelected.id
                                            );
                                        const productSelectedInCart =
                                            items.find(
                                                (item) =>
                                                    item.productSelected.id ===
                                                    product.productStocks[
                                                        indexProductStock
                                                    ].id
                                            );

                                        if (
                                            indexProductStock > -1 &&
                                            (product.productStocks[
                                                indexProductStock
                                            ].stock >=
                                                productSelectedInCart?.quantity ||
                                                productSelectedInCart ===
                                                    undefined)
                                        ) {
                                            setCart(updatedItems);
                                        } else {
                                            toast.error(
                                                "Notice: Product is out of stock"
                                            );
                                            return;
                                        }

                                        toast(
                                            "Notice: Product is added to bag",
                                            {
                                                description:
                                                    "at " +
                                                    new Date().toLocaleTimeString() +
                                                    " " +
                                                    new Date().toLocaleDateString(),
                                                action: {
                                                    label: "View cart",
                                                    onClick: () => {
                                                        window.location.href =
                                                            "/cart";
                                                    },
                                                },
                                            }
                                        );
                                    }}
                                >
                                    Add to cart
                                </Button>
                            </div>
                            {/* Description and details */}
                            <div className="mt-10">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Description
                                </h3>

                                <div className="space-y-6 mt-4">
                                    <p className="text-sm text-gray-600">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Highlights
                                </h3>

                                <div className="mt-4">
                                    {product.hightlight}
                                    {/* <ul
                                        role="list"
                                        className="list-disc space-y-2 pl-4 text-sm"
                                    >
                                        
                                        {product.highlights.map((highlight) => (
                                            <li
                                                key={highlight}
                                                className="text-gray-400"
                                            >
                                                <span className="text-gray-600">
                                                    {highlight}
                                                </span>
                                            </li>
                                        ))}
                                    </ul> */}
                                </div>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-sm font-medium text-gray-900">
                                    Details
                                </h2>

                                <div className="mt-4 space-y-6">
                                    <p className="text-sm text-gray-600">
                                        {product.details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white w-full">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-10">
                        Products you may like 💖
                    </h2>

                    <Carousel className="w-full">
                        <CarouselContent className="-ml-6">
                            {productSameCategory?.map((product) => (
                                <CarouselItem
                                    key={product.id}
                                    className="pl-6 md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                                >
                                    <div className="p-0">
                                        <Card className="border-none shadow-none">
                                            <CardContent className="flex items-center justify-center">
                                                <div className="group relative p-0 w-full aspect-[3/4]">
                                                    <img
                                                        src={
                                                            product
                                                                .productImages[0]
                                                                .src
                                                        }
                                                        alt={
                                                            product
                                                                .productImages[0]
                                                                .alt
                                                        }
                                                        className="w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 h-full"
                                                    />
                                                    <div className="mt-4 flex justify-between">
                                                        <div>
                                                            <h3 className="text-sm text-gray-700">
                                                                <a
                                                                    href={
                                                                        "/products/" +
                                                                        product.id
                                                                    }
                                                                >
                                                                    <span
                                                                        aria-hidden="true"
                                                                        className="absolute inset-0"
                                                                    ></span>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </a>
                                                            </h3>
                                                            <p className="mt-1 text-xl font-medium text-gray-600">
                                                                $
                                                                {product.productStocks
                                                                    ? Math.min(
                                                                          ...product.productStocks.map(
                                                                              (
                                                                                  stock
                                                                              ) =>
                                                                                  stock.price
                                                                          )
                                                                      )
                                                                    : "Loading..."}
                                                                {product
                                                                    .productStocks
                                                                    .length >
                                                                1 ? (
                                                                    <>
                                                                        - $
                                                                        {product.productStocks
                                                                            ? product
                                                                                  .productStocks
                                                                                  .length >
                                                                              1
                                                                                ? Math.max(
                                                                                      ...product.productStocks.map(
                                                                                          (
                                                                                              stock
                                                                                          ) =>
                                                                                              stock.price
                                                                                      )
                                                                                  )
                                                                                : null
                                                                            : null}
                                                                    </>
                                                                ) : null}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="mt-8 w-full flex justify-center gap-4">
                            <CarouselPrevious />
                            <CarouselNext />
                        </div>
                    </Carousel>
                </div>
            </div>
        </>
    );
};

export default DetailsProduct;
