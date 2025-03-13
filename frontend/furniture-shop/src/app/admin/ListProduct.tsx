"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type Category = {
    id: number;
    name: string;
    description: string;
    image: string;
};

export type Product = {
    id: string;
    name: string;
    productStocks: ProductStock[];
    category: Category;
    available: boolean;
    createdAt: string;
    description: string;
    highlight: string;
    details: string;
};

export type ProductColor = {
    id: number;
    classField: string;
    selectedClass: string;
    name: string;
};

export type ProductSize = {
    id: number;
    sizeName: string;
    description: string;
};

export type ProductImage = {
    id: number;
    src: string;
    alt: string;
};

export type ProductStock = {
    id: number;
    createdAt: string;
    product?: Product;
    productColor: ProductColor;
    productSize: ProductSize;
    productImage: ProductImage;
    stock: number;
    price: number;
};

const URL_API_PRODUCTS = "http://localhost:8080/api/product/admin/get/all";
async function getProducts(token: string) {
    const response = await fetch(URL_API_PRODUCTS, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    });
    if (!response.ok) {
        toast.error("Failed to fetch products");
        return [];
    }
    const products: Product[] = await response.json();
    return products;
}

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => {
                        if (column.getIsSorted() === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            );
                        }
                    }}
                    className={`p-0 hover:text-black text-gray-500 ${
                        column.getIsSorted() === "desc" ||
                        column.getIsSorted() === "asc"
                            ? "text-black underline"
                            : ""
                    }`}
                >
                    Name
                    {column.getIsSorted() === "desc" ? (
                        <ArrowUp />
                    ) : column.getIsSorted() === "asc" ? (
                        <ArrowDown />
                    ) : (
                        <ArrowUpDown />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => {
                        if (column.getIsSorted() === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            );
                        }
                    }}
                    className={`p-0 hover:text-black text-gray-500 ${
                        column.getIsSorted() === "desc" ||
                        column.getIsSorted() === "asc"
                            ? "text-black underline"
                            : ""
                    }`}
                >
                    Category
                    {column.getIsSorted() === "desc" ? (
                        <ArrowUp />
                    ) : column.getIsSorted() === "asc" ? (
                        <ArrowDown />
                    ) : (
                        <ArrowUpDown />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.original.category.name}</div>
        ),
    },
    {
        accessorKey: "productStocks",
        header: ({ column }) => {
            return "Stock";
        },
        cell: ({ row }) => (
            <>
                {row.original.productStocks.reduce((acc, productStock) => {
                    return acc + productStock.stock;
                }, 0)}
            </>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Create at",
        cell: ({ row }) => (
            <>
                <span className="text-muted-foreground">
                    {new Date(row.original.createdAt).toLocaleTimeString()}
                </span>
                <span className="ml-1 font-medium">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            </>
        ),
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return "Price";
        },
        cell: ({ row }) => {
            const productStocks = row.original.productStocks;

            // Format the amount as a dollar amount
            const formatted_min = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(
                Math.min(
                    ...productStocks.map((productStock) => productStock.price)
                )
            );

            if (productStocks.length > 1) {
                const formatted_max = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(
                    Math.max(
                        ...productStocks.map(
                            (productStock) => productStock.price
                        )
                    )
                );

                return (
                    <div className="font-medium">
                        {formatted_min} <span className="mx-1">-</span>{" "}
                        {formatted_max}
                    </div>
                );
            } else {
                return <div className="font-medium">{formatted_min}</div>;
            }
        },
    },
    {
        accessorKey: "isAvailable",
        header: () => <div className="text-center">Available</div>,
        cell: ({ row }) => (
            <div className="capitalize justify-center items-center flex gap-2">
                <div
                    className={
                        "size-2 rounded-full " +
                        (row.getValue("isAvailable")
                            ? "bg-green-500"
                            : "bg-destructive")
                    }
                ></div>
                {row.getValue("isAvailable") ? "yes" : "no"}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const productSelected = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    productSelected.id
                                );
                                toast("Copied: " + productSelected.id, {
                                    description:
                                        "Sunday, December 03, 2023 at 9:00 AM",
                                });
                            }}
                        >
                            Copy product ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                window.location.href = `/admin/categories`;
                            }}
                        >
                            View categories
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                window.location.href = `/admin/products/${productSelected.id}`;
                            }}
                        >
                            View product details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-destructive hover:!text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {row.getValue("isAvailable")
                                        ? "Inactivate product"
                                        : "Activate product"}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the product and
                                        remove the data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() => {
                                            toast.promise(
                                                fetch(
                                                    `http://localhost:8080/api/product/delete/${productSelected.id}`,
                                                    {
                                                        method: "DELETE",
                                                        headers: {
                                                            Authorization:
                                                                Cookies.get(
                                                                    "access_token"
                                                                ) ?? "",
                                                        },
                                                    }
                                                ),
                                                {
                                                    loading:
                                                        "Handling product...",
                                                    success: () => {
                                                        const currentAvailable =
                                                            !row.getValue(
                                                                "isAvailable"
                                                            );
                                                        return "Product deleted successfully";
                                                    },
                                                    error: "Failed to delete product",
                                                }
                                            );
                                        }}
                                    >
                                        {row.getValue("isAvailable")
                                            ? "Inactive"
                                            : "Active"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function ListProduct() {
    const [data, setData] = useState<Product[]>([]);

    React.useEffect(() => {
        getProducts(Cookies.get("access_token") ?? "").then(setData);
        console.log(data);
    }, []);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full font-sans">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter names..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Link to={`/admin/products/create`} className="ml-2">
                    <Button variant={"outline"} className="ml-auto">
                        <Plus />
                        Create product
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
