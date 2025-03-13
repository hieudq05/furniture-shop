package org.labpoly.sof3022.service.customer;

import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.dto.CustomerInfo;
import org.labpoly.sof3022.dto.CustomerSaveDto;
import org.labpoly.sof3022.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public CustomerInfo getCustomerInfoById(UUID customerId) {
        return customerRepository.findCustomerInfoById(customerId);
    }

    @Override
    public CustomerInfo getCustomerInfoByEmail(String email) {
        return customerRepository.findCustomerInfoByEmail(email);
    }

    @Override
    public List<CustomerInfo> getCustomersInfo() {
        return customerRepository.findAllBy();
    }

    @Override
    public Customer getCustomerByEmailAndPassword(String email, String password) {
        return customerRepository.findCustomerByEmailAndPassword(email, password);
    }

    @Override
    public Customer getCustomerById(UUID customerId) {
        return customerRepository.findCustomerById(customerId);
    }

    @Override
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findCustomerByEmail(email);
    }

    @Override
    public Customer saveCustomer(Customer new_customer) {
        return customerRepository.save(new_customer);
    }

    @Override
    @Transactional
    public Integer deleteCustomer(UUID customer_id) {
        return customerRepository.deleteCustomerById(customer_id);
    }

    @Override
    public Integer updateCustomerInfo(CustomerSaveDto new_customer) {
        return customerRepository.updateCustomerSaveDto(new_customer);
    }

    @Override
    public Integer updateCustomerImage(UUID customer_id, String image) {
        return customerRepository.updateImageById(image, customer_id);
    }

    @Override
    public Integer updateCustomerActive(UUID customer_id, boolean active) {
        return customerRepository.updateIsActiveById(active, customer_id);
    }
}
