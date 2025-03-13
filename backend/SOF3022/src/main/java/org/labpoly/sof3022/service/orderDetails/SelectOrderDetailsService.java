package org.labpoly.sof3022.service.orderDetails;

import org.labpoly.sof3022.model.OrderDetail;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SelectOrderDetailsService {
    OrderDetail getOrderDetailById(Integer orderDetailId);

    List<OrderDetail> getOrderDetails();

    Map<String, BigDecimal> getReportTotalPrice();

    Map<String, Long> getReportTotalProductSale();

    Map<String, Long> getReportOrderActive();

    Map<String, Long> getReportOrderInactive();

    Map<String, BigDecimal> getReportPriceAverage();

    List<Object[]> getPricesIn12Months();
}
