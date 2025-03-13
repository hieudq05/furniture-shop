import { useEffect, useState } from "react";
import { Category, Product } from "../../admin/ListProduct";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import styleHome from "@/app/style/Home.module.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductByCategory() {
    const [currentPage, setCurrentPage] = useState(1);
    const [productList, setProductList] = useState<Product[]>([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const categoryId = location.pathname.split("/")[2];
    const [categoryInfo, setCategoryInfo] = useState<Category>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/product/get/in/${categoryId}?page=${currentPage}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setProductList(data.products);
                    setTotalProduct(data.totalElements);
                    setTotalPage(data.totalPages);
                    console.log(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCatgory = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/category/get/${categoryId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setCategoryInfo(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchCatgory();
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-9xl mb-4 font-medium">
                {categoryInfo?.name}
            </div>
            <div
                className={`${styleHome.frameParent10} aspect-[16/4] mb-6`}
                style={{
                    backgroundImage: "url('" + categoryInfo?.image + "')",
                    justifyContent: "start",
                    backgroundPosition: "center",
                }}
            ></div>
            <div className="font-medium mb-7">
                {totalProduct} Product(s) Found
            </div>
            <div className={""}>
                <div className={""}>
                    {totalProduct === 0 ? (
                        <div className="text-xl text-center flex flex-col gap-2 items-center">
                            This category has no product yet.
                            <Button
                                variant={"outline"}
                                className="w-fit"
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                            >
                                <ArrowLeft /> Return to Home
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
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
                                                {product.productStocks.length >
                                                1
                                                    ? "- $" +
                                                      Math.max(
                                                          ...product.productStocks.map(
                                                              (stock: any) =>
                                                                  stock.price
                                                          )
                                                      )
                                                    : null}
                                            </div>
                                            <div
                                                className={
                                                    "w-fit flex gap-1 flex-wrap"
                                                }
                                            >
                                                {product.productColors.map(
                                                    (color) => (
                                                        <Badge
                                                            variant={"outline"}
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
                                                currentPage?.toString() === "1"
                                                    ? ""
                                                    : `?page=${currentPage - 1}`
                                            }
                                        />
                                    </PaginationItem>
                                    {/* Các nút trang */}
                                    {Array.from(
                                        { length: totalPage },
                                        (_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href={`?page=${index + 1}`}
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
                                                    : `?page=${currentPage + 1}`
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
