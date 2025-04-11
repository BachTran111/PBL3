package com.xuanbach.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(666,"Loi chua duoc phan loai"),
    KEY_INVALID(999,"Tu khoa loi khong hop le"),
    USER_EXISTED(1001,"Username dung da ton tai"),
    USERNAME_INVALID(1002,"Username phai co it nhat 3 ky tu"),
    PASSWORD_INVALID(1003,"Password phai co it nhat 8 ky tu")
    ;
    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
