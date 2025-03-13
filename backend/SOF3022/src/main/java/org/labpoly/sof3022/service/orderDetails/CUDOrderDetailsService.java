package org.labpoly.sof3022.service.orderDetails;

import org.labpoly.sof3022.model.OrderDetail;

public interface CUDOrderDetailsService {
    OrderDetail createOrderDetail(OrderDetail orderDetail);

    Integer updateOrderDetailStatus(Integer orderDetailId, Boolean status);
}
