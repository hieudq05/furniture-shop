package org.labpoly.sof3022.repository;

import org.labpoly.sof3022.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findOrderDetailsByOrder_IdAndOrder_Customer_Id(Integer orderId, UUID orderCustomerId);

    OrderDetail findOrderDetailById(Integer id);

    @Transactional
    @Modifying
    @Query("update OrderDetail o set o.status = ?1 where o.id = ?2")
    int updateStatusById(Boolean status, Integer id);

    @Query("select sum(od.quantity*od.productStock.price) from OrderDetail od where month(od.order.createDate) = ?1 and year(od.order.createDate) = ?2")
    BigDecimal getOrderTotalPrice(Integer month, Integer year);

    @Query("select count(*) from OrderDetail od where month(od.order.createDate) = ?1 and year(od.order.createDate) = ?2")
    Long countOrderDetailsByOrder_CreateDate_Month(Integer month, Integer year);

    @Query("select count(*) from OrderDetail od where od.status = true and month(od.order.createDate) = ?1 and year(od.order.createDate) = ?2")
    Long countOrderDetailsByStatus(Integer month, Integer year);

    @Query("select avg(od.productStock.price*od.quantity) from OrderDetail od where month(od.order.createDate) = ?1 and year(od.order.createDate) = ?2")
    BigDecimal getOrderTotalPriceAvg(Integer month, Integer year);

    @Query("SELECT YEAR(od.order.createDate), MONTH(od.order.createDate), SUM(od.quantity * od.productStock.price) " +
           "FROM OrderDetail od " +
           "WHERE od.order.createDate >= ?1 " +
           "GROUP BY YEAR(od.order.createDate), MONTH(od.order.createDate) " +
           "ORDER BY YEAR(od.order.createDate), MONTH(od.order.createDate)")
    List<Object[]> getMonthlyTotalForLast12Months(LocalDateTime last12Months);
}