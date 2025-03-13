import { ProductInCart } from "../page/DetailsProduct";

const orderList = JSON.parse(
    localStorage.getItem("cart") || "[]"
) as ProductInCart[];

function OrderProduct() {
    return (
        <div>
            <div className="h-full w-full p-8 font-sans bg-gray-50">
                <div className="text-4xl font-medium">Order Summary</div>
                <div className="mt-10">
                    {orderList?.map((order, index) => (
                        <div key={index}>
                            <div className="flex gap-4 text-sm">
                                <div className="">
                                    <img
                                        src={order.image}
                                        alt={order.name}
                                        className="w-32 aspect-[3/4] object-cover rounded-lg"
                                    />
                                </div>
                                <div className="font-medium flex flex-col flex-1">
                                    <div className="">
                                        <div className="text-base">
                                            {order.name}
                                        </div>
                                        <div className="text-gray-500">
                                            {
                                                order.productSelected
                                                    .productSize.sizeName
                                            }
                                        </div>
                                        <div className="text-gray-500">
                                            {
                                                order.productSelected
                                                    .productColor.name
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex gap-1">
                                            <div className="text-gray-500">
                                                Price:
                                            </div>
                                            ${order.productSelected.price}
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="text-gray-500">
                                                Quantity:
                                            </div>
                                            {order.quantity}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-base font-medium text-end">
                                    ${order.productSelected.price * order.quantity}
                                </div>
                            </div>
                            {order.id !==
                            orderList.at(orderList.length - 1)?.id ? (
                                <hr className="my-6" />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderProduct;
