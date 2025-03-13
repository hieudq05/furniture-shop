import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Dashboard({ component }: { component: any }) {
    const title = window.location.pathname.split("/")[2]?.replace("-", " ");
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {title !== undefined ? (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href={`/admin/${title}`}
                                                className=" capitalize"
                                            >
                                                {title}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                ) : null}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {component}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
