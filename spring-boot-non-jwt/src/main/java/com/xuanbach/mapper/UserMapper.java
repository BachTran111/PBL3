package com.xuanbach.mapper;

import com.xuanbach.model.UserDTORequest;
import com.xuanbach.model.UserDTOUpdate;
import com.xuanbach.repository.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserEntity toUser(UserDTORequest request);
}
