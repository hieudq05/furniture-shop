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

const API_URL = "http://localhost:8080/api/category";

export function UpdateCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [currentImage, setCurrentImage] = useState<string>("");

    useEffect(() => {
        // Fetch category details
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${API_URL}/get/${id}`, {
                    headers: {
                        Authorization: Cookies.get("access_token") ?? "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch category");
                }
                const data = await response.json();
                setName(data.name);
                setDescription(data.description);
                setCurrentImage(data.image);
                setPreviewUrl(data.image);
            } catch (error) {
                console.error("Error fetching category:", error);
                toast.error("Failed to load category details");
            }
        };

        if (id) {
            fetchCategory();
        }
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !description) {
            toast.error("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        if (image) {
            formData.append("imageFile", image);
        }
        formData.append("id", id as string);
        formData.append("name", name);
        formData.append("description", description);

        try {
            const response = await fetch(`${API_URL}/save`, {
                method: "PUT",
                headers: {
                    Authorization: Cookies.get("access_token") ?? "",
                },
                body: formData,
            });

            if (response.ok) {
                toast.success("Category updated successfully");
                navigate("/admin/categories");
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to update category");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Update Category</CardTitle>
                    <CardDescription>
                        Modify the category information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 font-sans">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter category name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter category description"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Category Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {previewUrl && (
                                <div className="mt-2">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-xs rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/categories")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" onClick={handleSubmit}>
                                Update Category
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
