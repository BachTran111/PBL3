package com.xuanbach.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.xuanbach.exception.ErrorCode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTORequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    String username;
    @Size(min = 8, message = "PASSWORD_INVALID")
    @JsonProperty("password_hash")
    String password;
    //@Email
    String email;
    Long roleID;
    String createdAt;

}
