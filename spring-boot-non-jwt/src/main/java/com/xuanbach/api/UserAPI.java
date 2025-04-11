package com.xuanbach.api;

import com.xuanbach.model.APIResponse;
import com.xuanbach.model.UserDTORequest;
import com.xuanbach.model.UserDTOUpdate;
import com.xuanbach.repository.entity.UserEntity;
import com.xuanbach.service.UserService;
import jakarta.validation.Valid;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserAPI {
    @Autowired
    private UserService userService;

    @PostMapping("/")
    APIResponse<UserEntity> addUser(@RequestBody @Valid UserDTORequest request){
        APIResponse<UserEntity> apiResponse = new APIResponse<>();
        apiResponse.setResult(userService.addUser(request));
        return apiResponse;
    }

    @GetMapping("/")
    List<UserEntity> getUser(){
        return userService.getUser();
    }

    @GetMapping("/{userId}")
    UserEntity getUser(@PathVariable("userId") Long userId){
        return userService.getUser(userId);
    }

    @PutMapping("/{userId}")
    UserEntity updateUser(@RequestBody UserDTOUpdate request,@PathVariable Long userId){
        return userService.updateUser(request,userId);
    }

    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable Long userId){
        userService.deleteUser(userId);
        return "Da xoa thanh cong user";
    }
}
