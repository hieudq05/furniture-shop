package org.labpoly.sof3022.exception;

import org.labpoly.sof3022.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandle {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException e) {
        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }
}
