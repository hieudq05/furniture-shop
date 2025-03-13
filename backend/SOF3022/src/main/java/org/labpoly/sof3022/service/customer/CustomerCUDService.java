package org.labpoly.sof3022.service.customer;

import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.dto.CustomerSaveDto;

import java.util.UUID;

public interface CustomerCUDService {
    Customer saveCustomer(Customer new_customer);

    Integer deleteCustomer(UUID customer_id);

    Integer updateCustomerInfo(CustomerSaveDto new_customer);

    Integer updateCustomerImage(UUID customer_id, String image);

    Integer updateCustomerActive(UUID customer_id, boolean active);
}
