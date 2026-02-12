package com.example.demo.lwj.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.lwj.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<SysUser> {
}

