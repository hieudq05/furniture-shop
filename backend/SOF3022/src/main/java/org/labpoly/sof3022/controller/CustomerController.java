package org.labpoly.sof3022.controller;

import org.labpoly.sof3022.dto.*;
import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.service.JwtService;
import org.labpoly.sof3022.service.UploadService;
import org.labpoly.sof3022.service.customer.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api")
public class CustomerController {

    private final CustomerService customerService;
    private final JwtService jwtService;
    private final UploadService uploadService;

    public CustomerController(CustomerService customerService, JwtService jwtService, UploadService uploadService) {
        this.customerService = customerService;
        this.jwtService = jwtService;
        this.uploadService = uploadService;
    }

    @GetMapping("customers")
    public ResponseEntity<ApiResponse<List<CustomerInfo>>> getCustomers(@RequestHeader(value = "Authorization") String accessToken) {
        if (accessToken == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }

        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(accessToken);

        if (customerAuthInfo == null || !customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }

        return ResponseEntity.ok(
                ApiResponse.<List<CustomerInfo>>builder()
                        .message("Get list of all customers successfully.")
                        .data(customerService.getCustomersInfo())
                        .build()
        );
    }

    @GetMapping("customer/{id}")
    public ResponseEntity<ApiResponse<CustomerInfo>> getCustomer(@PathVariable String id, @RequestHeader("Authorization") String accessToken) {
        String customerAuthEmail = authenticateCustomer(accessToken);
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(accessToken);
        if (!customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
            throw new ApiException(ErrorCode.ACCOUNT_HAS_NO_PERMISSIONS);
        }

        UUID customerId = UUID.fromString(id);
        CustomerInfo customerInfo = customerService.getCustomerInfoById(customerId);
        if (customerInfo == null) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
        } else {
            return ResponseEntity.ok(
                    ApiResponse.<CustomerInfo>builder()
                            .message("Get customer successfully.")
                            .data(customerInfo)
                            .build()
            );
        }
    }

    @PostMapping("customer/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCustomer(@PathVariable String id, @RequestHeader("Authorization") String accessToken) {
        String customerAuthEmail = authenticateCustomer(accessToken);
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(accessToken);
        UUID customerId = UUID.fromString(id);

        if (customerService.getCustomerById(customerAuthInfo.getId()) == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }

        if (!customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
            throw new ApiException(ErrorCode.ACCOUNT_HAS_NO_PERMISSIONS);
        }

        Integer rowsDeleted = customerService.deleteCustomer(customerId);
        if (rowsDeleted == 0) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
        }
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .message("Delete customer completed!")
                        .data(id)
                        .build()
        );

    }

    @PutMapping("customer/update")
    public ResponseEntity<ApiResponse<String>> updateCustomer(@RequestBody CustomerUpdateActiveDto customerUpdateActiveDto, @RequestHeader("Authorization") String accessToken) {
        String customerAuthEmail = authenticateCustomer(accessToken);
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(accessToken);
        UUID customerId = UUID.fromString(customerUpdateActiveDto.getId());

        System.out.println("ID: "+customerUpdateActiveDto.getId()+" - Is ACTIVE: "+ customerUpdateActiveDto.getIsActive());

        if (customerService.getCustomerById(customerAuthInfo.getId()) == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }
        if (!customerAuthInfo.getRole().getName().equalsIgnoreCase("admin")) {
            throw new ApiException(ErrorCode.ACCOUNT_HAS_NO_PERMISSIONS);
        }

        Integer rowEffected = customerService.updateCustomerActive(customerId, customerUpdateActiveDto.getIsActive());
        if (rowEffected == 0) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
        }

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code("UPDATE_CUS_ACTIVE_200")
                .message("Update active customer successfully.")
                .data(customerUpdateActiveDto.getId())
                .build());
    }

    @GetMapping("customer/me")
    public ResponseEntity<ApiResponse<CustomerInfo>> getMyInfo(@RequestHeader("Authorization") String accessToken) {
        String customerAuthEmail = authenticateCustomer(accessToken);

        CustomerInfo customerInfo = customerService.getCustomerInfoByEmail(customerAuthEmail);

        if (customerInfo == null) {
            throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
        }

        return ResponseEntity.ok(ApiResponse.<CustomerInfo>builder()
                .message("Get your info successfully.")
                .data(customerInfo)
                .build()
        );
    }

    @PostMapping("customer/me/save")
    public ResponseEntity<ApiResponse<Boolean>> saveMyInfo(@RequestHeader("Authorization") String accessToken, @RequestBody CustomerSaveDto cusSaveDto) {
        String customerAuthEmail = authenticateCustomer(accessToken);
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(accessToken);

        if (!cusSaveDto.getId().equals(customerAuthInfo.getId())) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }

        try {
            if (customerService.updateCustomerInfo(cusSaveDto) == 0) {
                throw new ApiException(ErrorCode.CUSTOMER_IS_NOT_FOUNDED);
            }
        } catch (Exception _) {
            throw new ApiException(ErrorCode.CANNOT_BE_SAVE_CUSTOMER);
        }

        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .code("CUS_SAVED_200")
                .message("Save your info successfully.")
                .data(true)
                .build()
        );
    }

    @PostMapping("customer/me/change/image")
    public ResponseEntity<ApiResponse<String>> changeMyImage(@RequestParam("image") MultipartFile image, @RequestHeader("Authorization") String accessToken) {
        String customerAuthEmail = authenticateCustomer(accessToken);
        CustomerAuthInfo customerAuthInfo = jwtService.extractCustomerAuthInfo(accessToken);
        String urlImage;

        if (accessToken == null || customerService.getCustomerById(customerAuthInfo.getId()) == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }

        try {
            urlImage = uploadService.uploadFile(image);
        } catch (IOException e) {
            throw new ApiException(ErrorCode.FILE_CAN_NOT_UPLOAD);
        }

        customerService.updateCustomerImage(customerAuthInfo.getId(), urlImage);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code("CUS_SAVED_200")
                .message("Change your image successfully.")
                .data(urlImage)
                .build());
    }

    protected String authenticateCustomer(String accessToken) {
        if (!jwtService.validateToken(accessToken) || jwtService.isTokenBlacklisted(accessToken)) {
            throw new ApiException(ErrorCode.UNAUTHORIZED_CLIENT);
        }

        return jwtService.extractEmail(accessToken);
    }
}
