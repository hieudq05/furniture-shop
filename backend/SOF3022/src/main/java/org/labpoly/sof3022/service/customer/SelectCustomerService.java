package org.labpoly.sof3022.service.customer;

import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.dto.CustomerInfo;

import java.util.List;
import java.util.UUID;

public interface SelectCustomerService {
    Customer getCustomerById(UUID id);

    Customer getCustomerByEmail(String email);

    List<Customer> getCustomers();

    CustomerInfo getCustomerInfoById(UUID customerId);

    CustomerInfo getCustomerInfoByEmail(String email);

    List<CustomerInfo> getCustomersInfo();

    Customer getCustomerByEmailAndPassword(String email, String password);
}
