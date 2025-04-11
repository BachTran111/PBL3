package com.xuanbach.service.impl;

import com.xuanbach.exception.CustomException;
import com.xuanbach.exception.ErrorCode;
import com.xuanbach.mapper.UserMapper;
import com.xuanbach.model.UserDTORequest;
import com.xuanbach.model.UserDTOUpdate;
import com.xuanbach.repository.UserRepository;
import com.xuanbach.repository.entity.UserEntity;
import com.xuanbach.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    public UserEntity addUser(UserDTORequest userdto){
        UserEntity user = new UserEntity();
        if(userRepository.existsByUsername(userdto.getUsername())) throw new CustomException(ErrorCode.USER_EXISTED);
        user.setUsername(userdto.getUsername());
        user.setEmail(userdto.getEmail());
        user.setPassword(userdto.getPassword());
        user.setCreatedAt(userdto.getCreatedAt());
        user.setRoleID(userdto.getRoleID());
//        UserEntity user = userMapper.toUser(userdto);

        return userRepository.save(user);
    }

    @Override
    public List<UserEntity> getUser() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Khong tim thay nguoi dung"));
    }

    @Override
    public UserEntity updateUser(UserDTOUpdate request, Long userId) {
        UserEntity user = getUser(userId);
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
