// React and Next.js
import { FunctionComponent, useState, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { ShoppingCart } from "lucide-react";

// Styles
import styles from "../../style/Home.module.css";
import { Category } from "../../admin/ListProduct";

const stats = [
    { id: 1, name: "Transactions every 24 hours", value: "44 million" },
    { id: 2, name: "Assets under holding", value: "$119 trillion" },
    { id: 3, name: "New users annually", value: "46,000" },
];

async function getCategories() {
    try {
        const response = await fetch(
            "http://localhost:8080/api/category/get/all",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            return [];
            console.error("Error while fetching categories");
        }

        const data = await response.json();
        return data as Category[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

const productList = [
    {
        id: 1,
        category: "Chair",
        categoryIcon: "/Navigation Menu Base/Icon Leading.svg",
        title: "Timeless Elegance Wooden Chair",
        description:
            "Designed to transcend trends, this chair blends natural wood tones with refined lines, perfect for any modern or classic space.",
        image: "/Frame 9.jpg",
    },
    {
        id: 2,
        category: "Chair",
        categoryIcon: "/Navigation Menu Base/Icon Leading.svg",
        title: "Timeless Elegance Wooden Chair",
        description:
            "Designed to transcend trends, this chair blends natural wood tones with refined lines, perfect for any modern or classic space.",
        image: "/Frame 9.jpg",
    },
    {
        id: 3,
        category: "Table",
        categoryIcon: "/Navigation Menu Base/Icon Leading.svg",
        title: "Timeless Elegance Wooden Chair",
        description:
            "Designed to transcend trends, this chair blends natural wood tones with refined lines, perfect for any modern or classic space.",
        image: "/Frame 9.jpg",
    },
    {
        id: 4,
        category: "Table",
        categoryIcon: "/Navigation Menu Base/Icon Leading.svg",
        title: "Timeless Elegance Wooden Chair",
        description:
            "Designed to transcend trends, this chair blends natural wood tones with refined lines, perfect for any modern or classic space.",
        image: "/Frame 9.jpg",
    },
    {
        id: 5,
        category: "Lamp",
        categoryIcon: "/Navigation Menu Base/Icon Leading.svg",
        title: "Timeless Elegance Wooden Chair",
        description:
            "Designed to transcend trends, this chair blends natural wood tones with refined lines, perfect for any modern or classic space.",
        image: "/Frame 9.jpg",
    },
    {
        id: 6,
        category: "Lamp",
        categoryIcon: "/Navigation Menu Base/Icon Leading.svg",
        title: "Timeless Elegance Wooden Chair",
        description:
            "Designed to transcend trends, this chair blends natural wood tones with refined lines, perfect for any modern or classic space.",
        image: "/Frame 9.jpg",
    },
];

const Home: FunctionComponent = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then((data) => {
            setCategories(data);
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className="flex-1 flex flex-col justify-items-start items-start lg:px-7 2xl:px-20 3xl:px-30 w-full">
                <div className={styles.landingPageHeroWithTagline}>
                    <div
                        className={`${styles.discoverTheArt} px-10 lg:px-0 text-7xl sm:text-8xl md:text-9xl`}
                    >
                        Discover the Art of Modern Living
                    </div>
                    <video
                        className={`${styles.aModernLivingRoomWithASl}`}
                        autoPlay
                        loop
                        muted
                    >
                        <source src="/main.mp4" type="video/mp4" />
                    </video>
                </div>
                <div
                    className="flex lg:flex-row flex-col lg:px-12 px-8 w-full xl:py-0 py-12 rounded-t-3xl"
                    style={{ backgroundColor: "#f7f7f7" }}
                >
                    <div className="flex-1 flex flex-col justify-center lg:items-start items-center ">
                        <p className="text-2xl font-medium text-gray-500">
                            Design Inspired
                        </p>
                        <p className="text-5xl font-medium text-green-700 mb-7">
                            Nature
                        </p>
                        <div className="text-xl text-black font-medium lg:text-start text-center lg:w-full w-2/3">
                            Inspired by nature and life, the outdoor brand
                            KUNDESIGN was born in the context of contemporary
                            design language. Through a unique perspective,
                            KUNDESIGN tries to explore the natural tendency in
                            urban life and use its flexible design to expand the
                            relevance of environmental experience between
                            outdoor and indoor spaces.
                        </div>
                    </div>
                    <div className="lg:h-fit flex justify-center flex-1">
                        <img
                            className="lg:w-full lg:h-full h-96 w-80 object-cover object-bottom"
                            alt="image"
                            src="Frame 9.jpg"
                        />
                    </div>
                </div>
                <div
                    className="flex lg:flex-row flex-col-reverse lg:px-12 px-8 w-full pt-20 pb-14 rounded-b-3xl lg:gap-16 gap-10"
                    style={{ backgroundColor: "#f7f7f7" }}
                >
                    <div className="lg:h-fit flex justify-center flex-1">
                        <img
                            className="lg:w-full h-96 lg:h-4/5 rounded-2xl"
                            alt="image"
                            src="Frame99.jpg"
                        />
                    </div>

                    <div className="flex-1 flex flex-col justify-center lg:items-start items-center ">
                        <p className="text-2xl font-medium text-gray-500">
                            And
                        </p>
                        <p className="text-5xl font-medium text-orange-800 mb-7">
                            Life
                        </p>
                        <div className="text-xl text-black font-medium lg:text-start text-center lg:w-full w-2/3">
                            Inspired by nature and life, the outdoor brand
                            KUNDESIGN was born in the context of contemporary
                            design language. Through a unique perspective,
                            KUNDESIGN.
                        </div>
                    </div>
                </div>
                <div className={styles.frameDiv}>
                    <div className={styles.outstandingProductsParent}>
                        <div className={styles.and}>Outstanding Products</div>
                        <div className={styles.frameParent1}>
                            <div className={styles.lucideIconsAnvilParent}>
                                <img
                                    className={styles.lucideIconsAnvil}
                                    alt="image"
                                    src="/Lucide Icons/anvil.svg"
                                />
                                <div className={styles.durableParent}>
                                    <div className={styles.durable}>
                                        Durable
                                    </div>
                                    <div className={styles.exudesOpulenceWith}>
                                        Exudes opulence with premium finishes.
                                    </div>
                                </div>
                            </div>
                            <div className={styles.frameInner} />
                            <div className={styles.lucideIconsAnvilParent}>
                                <img
                                    className={styles.lucideIconsAnvil}
                                    alt="image"
                                    src="/Lucide Icons/gem.svg"
                                />
                                <div className={styles.durableParent}>
                                    <div className={styles.durable}>
                                        Luxurious
                                    </div>
                                    <div className={styles.exudesOpulenceWith}>
                                        Exudes opulence with premium finishes.
                                    </div>
                                </div>
                            </div>
                            <div className={styles.frameInner} />
                            <div className={styles.lucideIconsAnvilParent}>
                                <img
                                    className={styles.lucideIconsAnvil}
                                    alt="image"
                                    src="/Lucide Icons/hand-heart.svg"
                                />
                                <div className={styles.durableParent}>
                                    <div className={styles.durable}>
                                        Comfortable
                                    </div>
                                    <div className={styles.designedForUltimate}>
                                        Designed for ultimate relaxation.
                                    </div>
                                </div>
                            </div>
                            <div className={styles.frameInner} />
                            <div className={styles.lucideIconsAnvilParent}>
                                <img
                                    className={styles.lucideIconsAnvil}
                                    alt="image"
                                    src="/Lucide Icons/leaf.svg"
                                />
                                <div className={styles.durableParent}>
                                    <div className={styles.durable}>
                                        Elegant
                                    </div>
                                    <div className={styles.exudesOpulenceWith}>
                                        Sleek, refined designs with timeless
                                        appeal.
                                    </div>
                                </div>
                            </div>
                            <div className={styles.frameInner} />
                            <div className={styles.lucideIconsAnvilParent}>
                                <img
                                    className={styles.lucideIconsAnvil}
                                    alt=""
                                    src="Lucide Icons/loader.svg"
                                />
                                <div className={styles.durableParent}>
                                    <div className={styles.durable}>
                                        Sophisticated
                                    </div>
                                    <div className={styles.exudesOpulenceWith}>
                                        Intricate details for a refined touch.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-4">
                            {productList.map((product) => (
                                <CarouselItem
                                    className="pl-4 md:basis-1/2 basis-full"
                                    key={product.id}
                                >
                                    <div className="p-1">
                                        <Card className="overflow-hidden rounded-2xl">
                                            <CardContent className="flex aspect-square items-center justify-center p-0">
                                                <div
                                                    className={
                                                        styles.frameParent3
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.navigationMenuBaseItemParent
                                                        }
                                                    >
                                                        <Badge className="flex items-center gap-1 rounded-full">
                                                            <div>
                                                                <img
                                                                    className="h-3.5"
                                                                    alt=""
                                                                    src={
                                                                        product.categoryIcon
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-white font-medium">
                                                                    {
                                                                        product.category
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Badge>
                                                        <div className="text-white text-2xl font-medium">
                                                            {product.title}
                                                        </div>
                                                        <div className="text-white text-base">
                                                            {
                                                                product.description
                                                            }
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.frameParent4
                                                        }
                                                    >
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        className="rounded-full"
                                                                        onClick={() => {
                                                                            location.href =
                                                                                "/products/" +
                                                                                product.id;
                                                                        }}
                                                                    >
                                                                        <ShoppingCart />{" "}
                                                                        Buy it
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Add to
                                                                        cart
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex items-center justify-center w-full mt-7 gap-4">
                            <CarouselPrevious className=" ml-2" />
                            <CarouselNext className=" mr-2" />
                        </div>
                    </Carousel>
                </div>
                <div className="pb-48 pt-32 w-full">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.id}
                                    className="mx-auto flex max-w-xs flex-col gap-y-4"
                                >
                                    <dt className="text-xl font-medium text-gray-600">
                                        {stat.name}
                                    </dt>
                                    <dd className="order-first text-3xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <div className={styles.frameParent8}>
                    <div
                        className={`${styles.tableDeskParent} aspect-video`}
                        style={{
                            backgroundImage:
                                "url('" + categories[0]?.image + "')",
                        }}
                    >
                        <div
                            className={`${styles.tableDesk} xl:text-5xl lg:text-4xl md:text-3xl text-2xl`}
                        >
                            {categories[0]?.name}
                        </div>
                        <div className="font-medium leading-[1.2] md:line-clamp-none line-clamp-3 xl:text-xl lg:text-lg md:text-base text-sm">
                            {categories[0]?.description}
                        </div>
                        <Button
                            onClick={() => {
                                window.location.href =
                                    "/category/" + categories[0]?.id;
                            }}
                            className="xl:px-7 xl:py-5 rounded-full xl:text-base lg:text-sm md:text-xs text-xs lg:px-5 lg:py-4 md:px-4 md:py-3 px-4 py-2"
                        >
                            Buy now
                        </Button>
                    </div>
                    <div className={styles.frameParent9}>
                        <div
                            className={`${styles.frameParent10} aspect-[3/4]`}
                            style={{
                                backgroundImage:
                                    "url('" + categories[1]?.image + "')",
                            }}
                        >
                            <div className={styles.chairParent}>
                                <div
                                    className={`${styles.chair} xl:text-5xl lg:text-4xl md:text-3xl text-2xl`}
                                >
                                    {categories[1]?.name}
                                </div>
                                <div className="font-medium leading-[1.2] md:line-clamp-none line-clamp-3 xl:text-xl lg:text-lg md:text-base text-sm">
                                    {categories[1]?.description}
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    window.location.href =
                                        "/category/" + categories[1]?.id;
                                }}
                                className="xl:px-7 xl:py-5 rounded-full xl:text-base lg:text-sm md:text-xs text-xs lg:px-5 lg:py-4 md:px-4 md:py-3 px-4 py-2"
                            >
                                Buy now
                            </Button>
                        </div>
                        <div
                            className={styles.frameParent11}
                            style={{
                                backgroundImage:
                                    "url('" + categories[2]?.image + "')",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    window.location.href =
                                        "/category/" + categories[2]?.id;
                                }}
                                variant={"ghost"}
                                className="xl:px-7 xl:py-5 rounded-full xl:text-base lg:text-sm md:text-xs text-xs lg:px-5 lg:py-4 md:px-4 md:py-3 px-4 py-2 shadow-none bg-white"
                                style={{
                                    color: "rgba(183, 100, 5, 0.816)",
                                }}
                            >
                                Buy now
                            </Button>
                            <div className={styles.lampParent}>
                                <div
                                    className={`${styles.lamp} xl:text-5xl lg:text-4xl md:text-3xl text-2xl`}
                                >
                                    {categories[2]?.name}
                                </div>
                                <div className="font-medium leading-[1.2] md:line-clamp-none line-clamp-3 xl:text-xl lg:text-lg md:text-base text-sm">
                                    {categories[2]?.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
