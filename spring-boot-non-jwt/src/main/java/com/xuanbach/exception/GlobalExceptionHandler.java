package com.xuanbach.exception;

import com.xuanbach.model.APIResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse> handlingRuntimeException(RuntimeException exception){
        APIResponse apiResponse = new APIResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
//        return ResponseEntity.badRequest().body(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> handlingValidation(MethodArgumentNotValidException exception){
        String enumKey = exception.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.KEY_INVALID;

        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {

        }

        APIResponse apiResponse = new APIResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
//        return ResponseEntity.badRequest().body(exception.getFieldError().getDefaultMessage())
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = CustomException.class)
    ResponseEntity<APIResponse> handlingCustomException(CustomException exception){
        ErrorCode errorCode = exception.getErrorCode();
        APIResponse apiResponse = new APIResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

}
