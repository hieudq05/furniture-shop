"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
    Category,
    Product,
    ProductColor,
    ProductSize,
    ProductStock,
} from "../../[[...slug]]/page/admin/ListProduct";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { UUID } from "crypto";

const API_URL = "http://localhost:8080/api/product";
const API_GET_CATEGORIES = "http://localhost:8080/api/category/get/all";

export function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [highlight, setHighlight] = useState("");
    const [details, setDetails] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<FileList | null>(null);
    const [colors, setColors] = useState<ProductColor[]>([]);
    const [sizes, setSizes] = useState<ProductSize[]>([]);
    const [stocks, setStocks] = useState<ProductStock[]>([]);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [createdAt, setCreatedAt] = useState("");

    useEffect(() => {
        // Fetch product details
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/get/${id}`, {
                    headers: {
                        Authorization: Cookies.get("access_token") ?? "",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch product");
                const data: Product = await response.json();

                setName(data.name);
                setDescription(data.description || "");
                setHighlight(data.highlight);
                setDetails(data.details);
                setCategoryId(data.category.id.toString());
                setColors(
                    data.productStocks
                        .map((stock) => stock.productColor)
                        .filter(
                            (color, index, self) =>
                                index ===
                                self.findIndex((c) => c.id === color.id)
                        )
                );
                setSizes(
                    data.productStocks
                        .map((stock) => stock.productSize)
                        .filter(
                            (size, index, self) =>
                                index ===
                                self.findIndex((s) => s.id === size.id)
                        )
                );
                setStocks(
                    data.productStocks.map((stock) => ({
                        id: stock.id,
                        createdAt: stock.createdAt,
                        product: stock.product,
                        productColor: stock.productColor,
                        productSize: stock.productSize,
                        productImage: stock.productImage,
                        colorId: stock.productColor.id,
                        sizeId: stock.productSize.id,
                        stock: stock.stock,
                        price: stock.price,
                    }))
                );
                setCurrentImages(
                    data.productStocks.map((stock) => stock.productImage.src)
                );
                setCreatedAt(data.createdAt);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details");
            }
        };

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_GET_CATEGORIES);
                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load categories");
            }
        };

        if (id) {
            fetchProduct();
            fetchCategories();
        }
    }, [id]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        stockIndex: number
    ) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                const updatedStocks = [...stocks];
                updatedStocks[stockIndex].productImage = {
                    id: updatedStocks[stockIndex].productImage.id,
                    src: URL.createObjectURL(file),
                    alt: file.name,
                };
                setStocks(updatedStocks);

                // Create a new FileList-like object
                const dataTransfer = new DataTransfer();

                // Add existing files if any
                if (images) {
                    Array.from(images).forEach((existingFile) => {
                        dataTransfer.items.add(existingFile);
                    });
                }

                // Add the new file
                dataTransfer.items.add(file);

                // Set the new FileList
                setImages(dataTransfer.files);
            }
        }
    };

    const handleColorAdd = () => {
        const maxNext = Math.max(0, ...colors.map((c) => c.id)) + 1;
        const newColor: ProductColor = {
            id: maxNext,
            name: "Color " + maxNext,
            classField: "",
            selectedClass: "",
        };
        setColors([...colors, newColor]);
    };

    const handleSizeAdd = () => {
        const maxNext = Math.max(0, ...sizes.map((s) => s.id)) + 1;
        const newSize: ProductSize = {
            id: maxNext,
            sizeName: "Size " + maxNext,
            description: "Description for size " + maxNext,
        };
        setSizes([...sizes, newSize]);
    };
    const handleStockAdd = (color: ProductColor, size: ProductSize) => {
        const newStock: ProductStock = {
            id: Math.max(0, ...stocks.map((s) => s.id)) + 1,
            createdAt: new Date().toLocaleString(),
            product: {
                id: id ?? "",
                name: name,
                description: description,
                highlight: highlight,
                details: details,
                category: categories.find(
                    (c) => c.id.toString() === categoryId
                )!,
                productStocks: stocks,
                available: true,
                createdAt: new Date().toLocaleString(),
            },
            productColor: color,
            productSize: size,
            productImage: {
                id: 0,
                src: "",
                alt: "",
            },
            stock: 0,
            price: 0,
        };
        setStocks([...stocks, newStock]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !description || !categoryId) {
            toast.error("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        formData.append(
            "productDto",
            JSON.stringify({
                name: name,
                description: description,
                highlight: highlight,
                details: details,
                categoryId: parseInt(categoryId),
                colors: colors,
                sizes: sizes,
                stocks: stocks.map((stock) => {
                    return {
                        id: stock.id,
                        productId: id as UUID,
                        createdAt:
                            new Date(stock.createdAt).toLocaleTimeString() +
                            " " +
                            new Date(stock.createdAt).toLocaleDateString(),
                        productColor: stock.productColor,
                        productSize: stock.productSize,
                        stock: stock.stock,
                        price: stock.price,
                        productImage: stock.productImage,
                    };
                }),
            })
        );

        console.log("form product: ", formData.get("productDto"));

        // Append new images if any
        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }

        // Append colors
        formData.append("colors", JSON.stringify(colors));

        // Append sizes
        formData.append("sizes", JSON.stringify(sizes));

        // Append stocks
        formData.append("stocks", JSON.stringify(stocks));

        try {
            const response = await fetch(`${API_URL}/save/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: Cookies.get("access_token") ?? "",
                },
                body: formData,
            });

            if (response.ok) {
                toast.success("Product updated successfully");
                navigate("/admin/products");
            } else {
                const data = await response.json();
                colors.map((color) => console.log(color));
                toast.error(data.message || "Failed to update product");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="container mx-auto py-4 font-sans">
            <Link to="/admin/products">
                <Button variant="outline" className="mb-4">
                    Back to Products
                </Button>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Update Product</CardTitle>
                    <CardDescription>
                        Modify the product information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter product description"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="highlight">Highlight</Label>
                            <Textarea
                                id="highlight"
                                value={highlight}
                                onChange={(e) => setHighlight(e.target.value)}
                                placeholder="Enter product highlight"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={categoryId}
                                onValueChange={setCategoryId}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Colors Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Colors</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleColorAdd}
                                >
                                    <Plus />
                                    Add Color
                                </Button>
                            </div>
                            {colors.map((color, index) => (
                                <div
                                    key={color.id}
                                    className="grid grid-cols-1 gap-4 items-center"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Color name"
                                            value={color.name}
                                            onChange={(e) => {
                                                const updatedColors = [
                                                    ...colors,
                                                ];
                                                updatedColors[index].name =
                                                    e.target.value;
                                                setColors(updatedColors);
                                            }}
                                        />
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Color class"
                                                value={color.classField}
                                                onChange={(e) => {
                                                    const updatedColors = [
                                                        ...colors,
                                                    ];
                                                    updatedColors[
                                                        index
                                                    ].classField =
                                                        e.target.value;
                                                    setColors(updatedColors);
                                                }}
                                            />
                                            <Input
                                                placeholder="Selected class"
                                                value={color.selectedClass}
                                                onChange={(e) => {
                                                    const updatedColors = [
                                                        ...colors,
                                                    ];
                                                    updatedColors[
                                                        index
                                                    ].selectedClass =
                                                        e.target.value;
                                                    setColors(updatedColors);
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="px-2"
                                                onClick={() => {
                                                    const updatedColors =
                                                        colors.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        );
                                                    setColors(updatedColors);
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sizes Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Sizes</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSizeAdd}
                                >
                                    <Plus />
                                    Add Size
                                </Button>
                            </div>
                            {sizes.map((size, index) => (
                                <div
                                    key={size.id}
                                    className="grid grid-cols-2 gap-4 items-center"
                                >
                                    <div className="grid grid-cols-2 gap-4 col-span-2">
                                        <Input
                                            placeholder="Size name"
                                            value={size.sizeName}
                                            onChange={(e) => {
                                                const updatedSizes = [...sizes];
                                                updatedSizes[index].sizeName =
                                                    e.target.value;
                                                setSizes(updatedSizes);
                                            }}
                                        />
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Size description"
                                                value={size.description}
                                                onChange={(e) => {
                                                    const updatedSizes = [
                                                        ...sizes,
                                                    ];
                                                    updatedSizes[
                                                        index
                                                    ].description =
                                                        e.target.value;
                                                    setSizes(updatedSizes);
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const updatedSizes =
                                                        sizes.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        );
                                                    setSizes(updatedSizes);
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stock Management */}
                        <div className="space-y-4">
                            <Label>Stock Management</Label>
                            {colors.map((color) => (
                                <div key={color.id} className="space-y-2">
                                    <h4 className="font-medium">
                                        {color.name || "Color " + color.id}
                                    </h4>
                                    {sizes.map((size) => {
                                        const stock = stocks.find(
                                            (s) =>
                                                s.productColor.id ===
                                                    color.id &&
                                                s.productSize.id === size.id
                                        );
                                        return stock ? (
                                            <div
                                                key={`${color.id}-${size.id}`}
                                                className="grid grid-cols-5 gap-4"
                                            >
                                                <div className="col-span-5">
                                                    <p className="text-sm text-gray-500">
                                                        {size.sizeName ||
                                                            "Size " + size.id}
                                                    </p>
                                                    <div className="w-24 h-24 mt-2">
                                                        {stock.productImage
                                                            ?.src ? (
                                                            <img
                                                                src={
                                                                    stock
                                                                        .productImage
                                                                        .src
                                                                }
                                                                alt={
                                                                    stock
                                                                        .productImage
                                                                        .alt ||
                                                                    "Product image"
                                                                }
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleImageChange(
                                                                e,
                                                                stocks.indexOf(
                                                                    stock
                                                                )
                                                            )
                                                        }
                                                        className="col-span-5 cursor-pointer mt-2 w-max"
                                                    />
                                                </div>
                                                <Input
                                                    type="number"
                                                    placeholder="Stock"
                                                    value={stock.stock}
                                                    className="col-span-2"
                                                    onChange={(e) => {
                                                        const updatedStocks =
                                                            stocks.map((s) =>
                                                                s.productColor
                                                                    .id ===
                                                                    color.id &&
                                                                s.productSize
                                                                    .id ===
                                                                    size.id
                                                                    ? {
                                                                          ...s,
                                                                          stock: parseInt(
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          ),
                                                                      }
                                                                    : s
                                                            );
                                                        setStocks(
                                                            updatedStocks
                                                        );
                                                    }}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={stock.price}
                                                    className="col-span-2"
                                                    onChange={(e) => {
                                                        const updatedStocks =
                                                            stocks.map((s) =>
                                                                s.productColor
                                                                    .id ===
                                                                    color.id &&
                                                                s.productSize
                                                                    .id ===
                                                                    size.id
                                                                    ? {
                                                                          ...s,
                                                                          price: parseInt(
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          ),
                                                                      }
                                                                    : s
                                                            );
                                                        setStocks(
                                                            updatedStocks
                                                        );
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="col-span-1"
                                                    onClick={() => {
                                                        setStocks(
                                                            stocks.filter(
                                                                (s) =>
                                                                    !(
                                                                        s
                                                                            .productColor
                                                                            .id ===
                                                                            color.id &&
                                                                        s
                                                                            .productSize
                                                                            .id ===
                                                                            size.id
                                                                    )
                                                            )
                                                        );
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                key={`${color.id}-${size.id}`}
                                                type="button"
                                                variant="outline"
                                                className="mr-4"
                                                onClick={() =>
                                                    handleStockAdd(color, size)
                                                }
                                            >
                                                Add Stock for{" "}
                                                {size.sizeName ||
                                                    "Size " + size.id}
                                            </Button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/products")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Update Product</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
