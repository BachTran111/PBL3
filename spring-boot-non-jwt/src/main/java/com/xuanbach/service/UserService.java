package com.xuanbach.service;

import com.xuanbach.model.UserDTORequest;
import com.xuanbach.model.UserDTOUpdate;
import com.xuanbach.repository.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserService {
    public UserEntity addUser(UserDTORequest userdto);
    public List<UserEntity> getUser();
    public UserEntity getUser(Long id);
    public UserEntity updateUser(UserDTOUpdate request, Long userId);
    public void deleteUser(Long id);
}
