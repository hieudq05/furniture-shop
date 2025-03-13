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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api/category/save";

export function CreateCategory() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !description || !image) {
            toast.error("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("imageFile", image);

        try {
            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    Authorization: Cookies.get("access_token") ?? "",
                },
                body: formData,
            });

            if (response.ok) {
                toast.success("Category created successfully");
                navigate("/admin/categories");
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to create category");
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
                    <CardTitle>Create New Category</CardTitle>
                    <CardDescription>
                        Add a new category to your product catalog
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                required
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
                            <Button type="submit">Create Category</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
