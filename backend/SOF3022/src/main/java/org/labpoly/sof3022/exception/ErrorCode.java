package org.labpoly.sof3022.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    CUSTOMER_IS_NOT_FOUNDED("CUS_AUTH_404", "Customer is not founded!", HttpStatus.NOT_FOUND),
    CANNOT_BE_SAVE_CUSTOMER("CUS_SAVE_400"
            , "Customer cannot be saved, please try again.",
            HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_CLIENT("CUS_AUTH_401", "Unauthorized client", HttpStatus.UNAUTHORIZED),
    ACCOUNT_HAS_NO_PERMISSIONS("ROLE_AUTH_403", "Account has no permissions", HttpStatus.FORBIDDEN),
    CUSTOMER_IS_DUPLICATED("CUS_AUTH_400", "Customer is already duplicated", HttpStatus.BAD_REQUEST),
    CUSTOMER_IS_LOGGED_IN("CUS_AUTH_400", "Customer is logged in", HttpStatus.BAD_REQUEST),
    FILE_CAN_NOT_UPLOAD("FILE_CAN_NOT_UPLOAD_400", "File can not upload", HttpStatus.BAD_REQUEST),
    PRODUCTS_NOT_FOUND("PRODUCTS_404", "Product not found", HttpStatus.NOT_FOUND),
    ORDER_DETAILS_NOT_FOUND("ORDER_DETAILS_404", "Order detail not found", HttpStatus.NOT_FOUND),
    CUSTOMER_IS_BLOCKED("CUS_AUTH_400", "Customer is blocked", HttpStatus.BAD_REQUEST),
    UPLOAD_FILE_ERROR("UPLOAD_FILE_ERROR_400", "Upload file error", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND("CATE_AUTH_404", "Category not found", HttpStatus.NOT_FOUND),
    COLOR_NOT_FOUND("COLOR_404", "Color Not Found", HttpStatus.NOT_FOUND),
    SIZE_NOT_FOUND("SIZE_404", "Size Not Found", HttpStatus.NOT_FOUND),
    ;

    String code;
    String message;
    HttpStatus httpStatus;
}
