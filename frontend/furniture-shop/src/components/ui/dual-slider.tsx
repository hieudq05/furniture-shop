"use client";

import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

export default function DualSlider() {
    // Khởi tạo giá trị slider với 2 điểm: 20 và 80
    const [value, setValue] = useState([0, 100]);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between mb-2">
                <div className="text-sm font-medium text-black">
                    ${value[0]}
                </div>
                <div className="text-sm font-medium text-black">
                    ${value[1]}
                </div>
            </div>
            <Slider.Root
                value={value}
                onValueChange={setValue}
                min={0}
                max={100}
                step={1}
                className="relative flex w-full touch-none select-none items-center"
            >
                <Slider.Track
                    className="relative w-full rounded-full bg-gray-300"
                    style={{ height: 3 }}
                >
                    <Slider.Range className="absolute h-full bg-black rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block h-4 w-2 rounded-full bg-white shadow border-black border-2 hover:bg-slate-200 focus:outline-none" />
                <Slider.Thumb className="block h-4 w-2 rounded-full bg-white shadow border-black border-2 hover:bg-slate-200 focus:outline-none" />
            </Slider.Root>
        </div>
    );
}
