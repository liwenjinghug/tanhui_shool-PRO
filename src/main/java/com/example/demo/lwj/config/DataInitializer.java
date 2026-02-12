package com.example.demo.lwj.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.lwj.entity.SysUser;
import com.example.demo.lwj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 启动时检查数据，如果 sys_user 为空则自动插入测试数据
 * 同时检查表结构，自动修复缺失字段
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // 1. 检查并修复表结构（status 字段）
        try {
            // 尝试查询 status 字段，如果不存在会抛出异常
            jdbcTemplate.execute("SELECT count(status) FROM sys_user");
        } catch (Exception e) {
            System.out.println("----------------------------------------");
            System.out.println("检测到 sys_user 表缺失 status 字段，正在自动修复...");
            try {
                jdbcTemplate.execute("ALTER TABLE sys_user ADD COLUMN status tinyint(1) DEFAULT 1 COMMENT '状态: 1=正常, 0=冻结' AFTER points");
                // 更新现有数据
                jdbcTemplate.execute("UPDATE sys_user SET status = 1 WHERE status IS NULL");
                System.out.println("成功添加 status 字段并更新默认值！");
            } catch (Exception ex) {
                System.err.println("自动修复表结构失败: " + ex.getMessage());
            }
            System.out.println("----------------------------------------");
        }

        // 2. 初始化数据
        try {
            long count = userService.count();
            if (count == 0) {
                System.out.println("----------------------------------------");
                System.out.println("检测到 sys_user 表为空，正在初始化测试数据...");

                SysUser u1 = new SysUser();
                u1.setOpenid("test_openid_001");
                u1.setNickname("低碳小达人");
                u1.setRealName("李明");
                u1.setStudentId("2023001");
                u1.setDormBuilding("5栋");
                u1.setDormRoom("302");
                u1.setAvatarUrl("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png");
                u1.setPoints(100);
                u1.setStatus(1);
                u1.setCreateTime(LocalDateTime.now());
                userService.save(u1);

                SysUser u2 = new SysUser();
                u2.setOpenid("test_openid_002");
                u2.setNickname("绿色生活");
                u2.setRealName("王小红");
                u2.setStudentId("2023002");
                u2.setDormBuilding("8栋");
                u2.setDormRoom("501");
                u2.setAvatarUrl("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png");
                u2.setPoints(250);
                u2.setStatus(1);
                u2.setCreateTime(LocalDateTime.now());
                userService.save(u2);

                System.out.println("成功插入 2 条测试用户数据！");
                System.out.println("----------------------------------------");
            } else {
                System.out.println("sys_user 表已有数据 (" + count + " 条)，跳过初始化。");
            }
        } catch (Exception e) {
            System.err.println("数据初始化失败 (可能是数据库连接问题): " + e.getMessage());
        }
    }
}

