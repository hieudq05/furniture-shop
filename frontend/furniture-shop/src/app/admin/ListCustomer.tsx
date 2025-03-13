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
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";

export type Customer = {
    id: string;
    fullName: string;
    image: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    isActive: boolean;
};

const URL_GET_CUSLIST_API = "http://localhost:8080/api/customers";

async function fetchCustomers(token: string) {
    try {
        const response = await fetch(URL_GET_CUSLIST_API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(error);
    }
}

export const columns: ColumnDef<Customer>[] = [
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
        accessorKey: "fullName",
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
            <div className="flex gap-2 items-center">
                <Avatar>
                    <AvatarImage
                        className="size-11 rounded-full !aspect-square max-w-max"
                        src={row.original.image}
                        alt="@shadcn"
                    />
                    <AvatarFallback className="p-3 aspect-square rounded-full bg-gray-100 font-medium">
                        {row.original.fullName.charAt(0).toUpperCase()}
                        {row.original.fullName
                            .split(" ")[1]
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize flex gap-2">
                    {row.getValue("fullName")}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "email",
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
                    Email
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
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
        accessorKey: "phone",
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
                    Number
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
            <div className="capitalize">{row.getValue("phone")}</div>
        ),
    },
    {
        accessorKey: "createdAt",
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
                    Create at
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
        cell: ({ row }) => {
            return (
                <>
                    <span className="text-muted-foreground">
                        {new Date(row.original.createdAt).toLocaleTimeString()}
                    </span>
                    <span className="ml-1 font-medium">
                        {new Date(row.original.createdAt).toLocaleDateString()}
                    </span>
                </>
            );
        },
    },
    {
        accessorKey: "address",
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
                    Address
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
            <div className="capitalize">{row.getValue("address")}</div>
        ),
    },
    {
        accessorKey: "isActive",
        header: () => "Available",
        cell: ({ row }) => (
            <div className="capitalize justify-center items-center flex gap-2">
                <div
                    className={
                        "size-2 rounded-full " +
                        (row.getValue("isActive")
                            ? "bg-green-500"
                            : "bg-destructive")
                    }
                ></div>
                {row.getValue("isActive") ? "yes" : "no"}
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
                                toast(
                                    "Customer ID has been copied: " +
                                        productSelected.id,
                                    {
                                        description:
                                            "at " +
                                            new Date().toLocaleDateString() +
                                            " " +
                                            new Date().toLocaleTimeString(),
                                    }
                                );
                            }}
                        >
                            Copy customer ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                window.location.href = `/admin/customers/${productSelected.id}`;
                            }}
                        >
                            View customer details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                window.location.href = `/admin/customers/orders/${productSelected.id}`;
                            }}
                        >
                            View orders
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function ListCustomer() {
    const [data, setData] = React.useState<Customer[]>([]);
    React.useEffect(() => {
        fetchCustomers(Cookies.get("access_token") ?? "").then((data) => {
            setData(data);
        });
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
                        (table
                            .getColumn("fullName")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("fullName")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
