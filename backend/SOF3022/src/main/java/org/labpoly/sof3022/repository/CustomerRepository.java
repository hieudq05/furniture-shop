package org.labpoly.sof3022.repository;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.labpoly.sof3022.model.Customer;
import org.labpoly.sof3022.dto.CustomerInfo;
import org.labpoly.sof3022.dto.CustomerSaveDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Integer deleteCustomerById(UUID id);

    List<CustomerInfo> findAllBy();

    Customer findCustomerById(UUID id);

    CustomerInfo findCustomerInfoById(UUID id);

    Customer findCustomerByEmail(@Size(max = 255) @NotNull String email);

    CustomerInfo findCustomerInfoByEmail(@Size(max = 255) @NotNull String email);

    Customer findCustomerByEmailAndPassword(@Size(max = 255) @NotNull String email, @Size(max = 255) @NotNull String passwordHash);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.address = :#{#cusDto.address}, c.email = :#{#cusDto.email}, c.fullName = :#{#cusDto.fullName}, c.image = :#{#cusDto.image}, c.phone = :#{#cusDto.phone} WHERE c.id = :#{#cusDto.id}")
    Integer updateCustomerSaveDto(@Param("cusDto") CustomerSaveDto customerSaveDto);

    @Transactional
    @Modifying
    @Query("update Customer c set c.image = ?1 where c.id = ?2")
    int updateImageById(String image, UUID id);

    @Transactional
    @Modifying
    @Query("update Customer c set c.isActive = ?1 where c.id = ?2")
    int updateIsActiveById(Boolean isActive, UUID id);
}