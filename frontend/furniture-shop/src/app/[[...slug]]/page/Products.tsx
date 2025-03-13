import { FunctionComponent, useEffect, useState } from "react";
import styles from "../../style/ProductList.module.css";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import DualSlider from "@/components/ui/dual-slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

export interface Product {
    id: number;
    name: string;
    description: string;
    isAvailable: boolean;
    category: Category;
    productImages: any[];
    productColors: any[];
    productStocks: any[];
}

export interface Category {
    id: string;
    name: string;
    count: number;
}

export interface Color {
    id: number;
    classField: string;
    selectedClass: string;
    name: string;
}

const ProductList: FunctionComponent = () => {
    const [productList, setProductList] = useState<Product[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [colorList, setColorList] = useState<Color[]>([]);
    const [currentPage, setCurrentPage] = useState(
        parseInt(new URLSearchParams(window.location.search).get("page") ?? "1")
    );
    const [totalPage, setTotalPage] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8080/api/product/get/all?page=" + currentPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setProductList(data.products);
                setTotalPage(data.totalPages);
                setTotalProduct(data.totalElements);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/category/get/all")
            .then((response) => response.json())
            .then((data) => {
                setCategoryList(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/color/get/all")
            .then((response) => response.json())
            .then((data) => {
                setColorList(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    return (
        <>
            <div className={styles.productList}>
                {/* <div className={`${styles.filters} px-10`}>
                    <div className="">
                        <div className="font-medium text-black">
                            120 Products
                        </div>
                    </div>
                    <div>
                        <div className={styles.filterCategories}>
                            <ToggleGroup
                                type="single"
                                variant={"outline"}
                                id="groupColor"
                                className="flex gap-3"
                            >
                                <ToggleGroupItem
                                    value={"1"}
                                    name="color"
                                    aria-label="Toggle bold"
                                    className="rounded-full px-3"
                                >
                                    Best Seller
                                    <SortAsc />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value={"2"}
                                    name="color"
                                    aria-label="Toggle bold"
                                    className="rounded-full px-3"
                                >
                                    Price
                                    <SortAsc />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value={"3"}
                                    name="color"
                                    aria-label="Toggle bold"
                                    className="rounded-full px-3"
                                >
                                    Category
                                    <SortAsc />
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                </div> */}
                <div className="px-10 mt-10">
                    <div className="text-9xl font-medium">All Products</div>
                    <div className="font-medium">
                        {totalProduct} Product(s) Found
                    </div>
                </div>
                <div className={`${styles.container} mt-6`}>
                    <div
                        className={`${styles.frameParent} py-5 px-7 shadow-md border-gray-200 border rounded-2xl`}
                    >
                        <div className="flex justify-between w-full text-black">
                            <div className={styles.product}>Filters</div>
                            <Filter className="w-4" />
                        </div>
                        <div className={styles.categoriesParent}>
                            <label className="text-gray-500">Categories</label>
                            <div className="flex flex-col gap-4 w-full">
                                {categoryList.map((category) => (
                                    <label
                                        key={category.id}
                                        htmlFor={category.id.toString()}
                                        className="flex justify-between w-full"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Checkbox id={category.id} />
                                            <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {category.name}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.searchParent}>
                            <div className="text-sm">Price</div>
                            <DualSlider />
                        </div>
                        <div className={styles.searchParent}>
                            <label className="text-gray-500 text-sm">
                                Color
                            </label>
                            <ToggleGroup
                                type="multiple"
                                variant={"default"}
                                className="flex gap-2 flex-wrap justify-start"
                            >
                                {colorList.map((item) => (
                                    <ToggleGroupItem
                                        key={item.id}
                                        value={item.name}
                                        size={"sm"}
                                        className="flex gap-1 items-center px-2 align-middle rounded-full"
                                    >
                                        <div
                                            className={"w-3 h-3 rounded-full"}
                                            style={{
                                                backgroundColor:
                                                    item.classField,
                                            }}
                                        />
                                        <div>{item.name}</div>
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>
                    </div>
                    <div className={styles.mainContent}>
                        <div className={styles.fourColumnProductGridWith}>
                            <div className={styles.productgrid}>
                                <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
                                    {productList?.map((product) => (
                                        <a
                                            href={"/products/" + product.id}
                                            key={product.id}
                                        >
                                            <img
                                                className=" aspect-[3/4] rounded-2xl w-full"
                                                alt=""
                                                src={
                                                    product.productImages.sort(
                                                        (a, b) =>
                                                            a.src.length -
                                                            b.src.length
                                                    )[0].src
                                                }
                                            />
                                            <div className="flex flex-col mt-2">
                                                <div className="text-base">
                                                    {product.name}
                                                </div>
                                                <div className="text-xl mt-2 mb-1 font-medium">
                                                    $
                                                    {Math.min(
                                                        ...product.productStocks.map(
                                                            (stock: any) =>
                                                                stock.price
                                                        )
                                                    )}{" "}
                                                    {product.productStocks
                                                        .length > 1
                                                        ? "- $" +
                                                          Math.max(
                                                              ...product.productStocks.map(
                                                                  (
                                                                      stock: any
                                                                  ) =>
                                                                      stock.price
                                                              )
                                                          )
                                                        : null}
                                                </div>
                                                <div
                                                    className={
                                                        styles.itemcolors
                                                    }
                                                >
                                                    {product.productColors.map(
                                                        (color) => (
                                                            <Badge
                                                                variant={
                                                                    "outline"
                                                                }
                                                                key={color.id}
                                                                className="p-1 rounded-full flex items-center gap-1 pr-2"
                                                            >
                                                                <div
                                                                    className={
                                                                        "rounded-full aspect-square w-4 h-4 "
                                                                    }
                                                                    style={{
                                                                        backgroundColor:
                                                                            color.classField,
                                                                    }}
                                                                ></div>
                                                                <div className="text-gray-500 font-medium">
                                                                    {color.name}
                                                                </div>
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <Pagination className="w-full flex justify-center">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={
                                                    currentPage?.toString() ===
                                                    "1"
                                                        ? ""
                                                        : `?page=${
                                                              currentPage - 1
                                                          }`
                                                }
                                            />
                                        </PaginationItem>
                                        {/* Các nút trang */}
                                        {Array.from(
                                            { length: totalPage },
                                            (_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href={`?page=${
                                                            index + 1
                                                        }`}
                                                        isActive={
                                                            currentPage ===
                                                            index + 1
                                                        }
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        {/* Ellipsis nếu cần */}
                                        {totalPage > 3 &&
                                            currentPage < totalPage - 1 && (
                                                <>
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink
                                                            href={`?page=${totalPage}`}
                                                            is="last"
                                                        >
                                                            {totalPage}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                </>
                                            )}
                                        <PaginationItem>
                                            <PaginationNext
                                                href={
                                                    currentPage === totalPage
                                                        ? ""
                                                        : `?page=${
                                                              currentPage + 1
                                                          }`
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductList;
