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
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { table } from "console";

export type Category = {
    id: number;
    name: string;
    description: string;
};

export const columns: ColumnDef<Category>[] = [
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
        accessorKey: "id",
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
                    ID
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
            <div className="capitalize">{row.getValue("id")}</div>
        ),
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
                    Category Name
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
        accessorKey: "image",
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
                    Image
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
            <>
                <a href={row.getValue("image")} className="hover:underline">
                    {row.getValue("image")}
                </a>
            </>
        ),
    },
    {
        accessorKey: "description",
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
                    Description
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
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const categorySelected = row.original;

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
                                    categorySelected.id.toString()
                                );
                                toast("Copied: " + categorySelected.id, {
                                    description:
                                        "Sunday, December 03, 2023 at 9:00 AM",
                                });
                            }}
                        >
                            Copy category ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                window.location.href = `/admin/categories/update/${categorySelected.id}`;
                            }}
                        >
                            Edit {categorySelected.name}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (
                                    confirm(
                                        "Are you sure you want to delete this category?"
                                    )
                                ) {
                                    deleteCategory(categorySelected.id);
                                    window.location.reload();
                                    toast.success(
                                        "Category deleted successfully"
                                    );
                                }
                            }}
                            className="text-destructive hover:!text-destructive"
                        >
                            Delete {categorySelected.name}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function ListCategory() {
    const [data, setData] = React.useState<Category[]>([]);
    React.useEffect(() => {
        fetch("http://localhost:8080/api/category/get/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                toast.error("Error: " + error.message);
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
                <Link to="/admin/categories/create" className="ml-2">
                    <Button variant={"outline"} className="ml-auto">
                        <Plus />
                        Create category
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
const URL_API_CATEGORY = "http://localhost:8080/api/category";

async function deleteCategory(id: number) {
    try {
        const response = await fetch(`${URL_API_CATEGORY}/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: Cookies.get("access_token") ?? "",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete category");
        }

        return true;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
