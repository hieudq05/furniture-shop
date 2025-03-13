import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

const API_GET_PROFILE_URL = "http://localhost:8080/api/customer/me";
const API_UPDATE_PROFILE_URL = "http://localhost:8080/api/customer/me/save";
const API_UPDATE_IMAGE_URL =
    "http://localhost:8080/api/customer/me/change/image";

interface Role {
    id: string;
    name: string;
}

export interface ProfileProps {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    isActive: boolean;
    image: string;
    orders: Object[];
    role: Role;
}

async function handleUpdateProfile(
    infoEdit: ProfileProps,
    setMyInfo: Function
) {
    const token = Cookies.get("access_token");
    if (!token) {
        console.error("Token không tồn tại, vui lòng đăng nhập lại.");
        return;
    }

    try {
        const response = await fetch(API_UPDATE_PROFILE_URL, {
            method: "POST",
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(infoEdit),
            credentials: "include",
        });

        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                toast.error(
                    "Update profile failed: Email or phone number is already in use by another account."
                );
            }
            return;
        }

        const data = await response.json();
        setMyInfo(infoEdit);
        toast.success("Update profile successfully.");
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin hồ sơ:", error.message);
    }
}

async function handleUpdateImage(
    selectedFile: File,
    setMyInfo: Function,
    myInfo: ProfileProps
) {
    const token = Cookies.get("access_token");
    if (!token) {
        console.error("Token không tồn tại, vui lòng đăng nhập lại.");
        return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
        const response = await fetch(API_UPDATE_IMAGE_URL, {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Lỗi ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        setMyInfo({ ...myInfo, image: data.data });
        toast.success("Update image successfully.");
    } catch (error) {
        console.error("Lỗi khi cập nhật ảnh đại diện:", error.message);
    }
}

function Profile() {
    const [myInfo, setMyInfo] = useState<ProfileProps>({} as ProfileProps);
    const [infoEdit, setInfoEdit] = useState<ProfileProps>({} as ProfileProps);

    const fetchProfile = async () => {
        const token = Cookies.get("access_token");
        if (!token) {
            console.error("Token không tồn tại, vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await fetch(API_GET_PROFILE_URL, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Lỗi ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            setMyInfo(data.data);
            setInfoEdit({} as ProfileProps);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin hồ sơ:", error.message);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="pt-6 pb-36 container mx-auto flex flex-col items-center gap-6 font-sans md:px-32 px-10">
            <h1 className="text-xl font-medium text-center">My Profile</h1>
            <div className="">
                <Avatar className="size-28">
                    <AvatarImage
                        className="size-full object-cover"
                        src={myInfo.image}
                    />
                    <AvatarFallback className="text-4xl">
                        {myInfo.fullName?.charAt(0).toUpperCase() +
                            myInfo.fullName
                                ?.charAt(myInfo.fullName.indexOf(" ") + 1)
                                .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={"secondary"}
                            className="size-8 rounded-full relative top-[-27] left-20"
                        >
                            <Pen />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[605px]">
                        <DialogHeader>
                            <DialogTitle>Upload new Avatar</DialogTitle>
                            <DialogDescription>
                                Make changes to your avatar here. Click save
                                when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image">Image File</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    className="col-span-3 hover:cursor-pointer"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    onClick={() => {
                                        const fileInput =
                                            document.getElementById(
                                                "image"
                                            ) as HTMLInputElement;
                                        if (
                                            !fileInput?.files ||
                                            !fileInput.files[0]
                                        ) {
                                            toast.error(
                                                "Please select an image file."
                                            );
                                            return;
                                        } else {
                                            handleUpdateImage(
                                                fileInput.files[0],
                                                setMyInfo,
                                                myInfo
                                            );
                                        }
                                    }}
                                >
                                    Save changes
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-col gap-4 w-full bg-gray-50 shadow-sm border p-7 rounded-3xl">
                <div className="grid gap-2 grid-cols-7 items-center">
                    <Label className="col-span-2">Status</Label>
                    <Label className="col-span-5">
                        <span
                            className={`w-2 h-2 rounded-full inline-block mr-2 ${
                                myInfo.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></span>
                        {myInfo.isActive ? "Active" : "Inactive"}
                    </Label>
                </div>
                <div className="grid gap-2 grid-cols-7 items-center">
                    <Label className="col-span-2">Create at</Label>
                    <Label className="col-span-5">
                        {new Date(myInfo.createdAt).toLocaleString()}
                    </Label>
                </div>
                <div className="grid gap-2 grid-cols-7 items-center">
                    <Label className="col-span-2">Full name</Label>
                    <Input
                        className="col-span-5"
                        type="text"
                        value={myInfo.fullName}
                        disabled
                    ></Input>
                </div>
                <div className="grid gap-2 grid-cols-7 items-center">
                    <Label className="col-span-2">Email</Label>
                    <Input
                        className="col-span-5"
                        type="email"
                        value={myInfo.email}
                        disabled
                    ></Input>
                </div>
                <div className="grid gap-2 grid-cols-7 items-center">
                    <Label className="col-span-2">Phone number</Label>
                    <Input
                        className="col-span-5"
                        value={myInfo.phone}
                        disabled
                    ></Input>
                </div>
                <div className="grid gap-2 grid-cols-7">
                    <Label className="col-span-2 relative top-3">Address</Label>
                    <Textarea
                        className="col-span-5"
                        value={myInfo.address}
                        placeholder="You have not entered your address yet."
                        disabled
                    ></Textarea>
                </div>
                <div className="flex justify-end">
                    <Dialog
                        onOpenChange={() => {
                            setInfoEdit(myInfo);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button variant="outline">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[605px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click
                                    save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={infoEdit.fullName}
                                        onChange={(e) =>
                                            setInfoEdit({
                                                ...infoEdit,
                                                fullName: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="text-right"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={infoEdit.email}
                                        onChange={(e) =>
                                            setInfoEdit({
                                                ...infoEdit,
                                                email: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="text-right"
                                    >
                                        Phone number
                                    </Label>
                                    <Input
                                        id="number"
                                        value={infoEdit.phone}
                                        onChange={(e) =>
                                            setInfoEdit({
                                                ...infoEdit,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="address"
                                        className="text-right"
                                    >
                                        Address
                                    </Label>
                                    <Textarea
                                        id="address"
                                        value={infoEdit.address}
                                        onChange={(e) =>
                                            setInfoEdit({
                                                ...infoEdit,
                                                address: e.target.value,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        onClick={() => {
                                            handleUpdateProfile(
                                                infoEdit,
                                                setMyInfo
                                            );
                                        }}
                                    >
                                        Save changes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Profile;
