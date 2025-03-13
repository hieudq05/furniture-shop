import { BarChartProduct } from "../[[...slug]]/components/chart/BarChartProduct";
import { LineChartProduct } from "../[[...slug]]/components/chart/LineChartProduct";

export function AdminHome() {
    return (
        <>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="size-full rounded-xl bg-muted/50">
                    <BarChartProduct />
                </div>
                <div className="size-full rounded-xl bg-muted/50 col-span-2">
                    <LineChartProduct />
                </div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </>
    );
}
