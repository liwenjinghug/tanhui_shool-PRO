package com.example.demo.lwj.service;

        import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.lwj.entity.SysUser;

public interface UserService extends IService<SysUser> {
    Page<SysUser> selectUserPage(Page<SysUser> page, String keyword);

    SysUser getById(Long id);

    boolean updateUser(SysUser user);

    // 其他用户管理相关方法可扩展
}

