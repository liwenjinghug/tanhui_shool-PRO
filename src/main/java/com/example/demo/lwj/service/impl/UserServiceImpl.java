package com.example.demo.lwj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.lwj.entity.SysUser;
import com.example.demo.lwj.mapper.UserMapper;
import com.example.demo.lwj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, SysUser> implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public Page<SysUser> selectUserPage(Page<SysUser> page, String keyword) {
        LambdaQueryWrapper<SysUser> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            qw.and(w -> w.like(SysUser::getStudentId, keyword).or().like(SysUser::getRealName, keyword));
        }
        return userMapper.selectPage(page, qw);
    }

    @Override
    public SysUser getById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public boolean updateUser(SysUser user) {
        return userMapper.updateById(user) > 0;
    }
}
