package com.example.demo.lwj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.lwj.entity.SysAdmin;
import com.example.demo.lwj.entity.SysUser;
import com.example.demo.lwj.mapper.SysAdminMapper;
import com.example.demo.lwj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SysAdminMapper sysAdminMapper;

    // ==================== 个人资料管理 API ====================

    /**
     * 获取当前登录用户的个人资料
     * GET /api/system/user/profile
     */
    @GetMapping("/profile")
    public Result getProfile(@RequestHeader(value = "Authorization", required = false) String authorization) {
        // 从 token 获取用户信息（简化版，生产环境应使用 JWT）
        // 这里暂时从请求参数或 session 获取用户名
        // 为了演示，我们返回 admin 用户的信息

        // TODO: 实际应该从 token 解析出用户 ID
        // 临时方案：从 localStorage 获取或返回第一个管理员
        SysAdmin admin = sysAdminMapper.selectOne(new QueryWrapper<SysAdmin>().eq("username", "admin"));

        if (admin == null) {
            return Result.fail("用户不存在");
        }

        return Result.ok(admin);
    }

    /**
     * 更新当前登录用户的个人资料
     * POST /api/system/user/profile
     */
    @PostMapping("/profile")
    public Result updateProfile(@RequestBody Map<String, Object> body,
                                @RequestHeader(value = "Authorization", required = false) String authorization) {
        // TODO: 从 token 获取用户 ID
        // 临时方案：更新 admin 用户
        SysAdmin admin = sysAdminMapper.selectOne(new QueryWrapper<SysAdmin>().eq("username", "admin"));

        if (admin == null) {
            return Result.fail("用户不存在");
        }

        // 更新允许修改的字段
        if (body.containsKey("nickname")) admin.setNickname((String) body.get("nickname"));
        if (body.containsKey("phonenumber")) admin.setPhonenumber((String) body.get("phonenumber"));
        if (body.containsKey("email")) admin.setEmail((String) body.get("email"));
        if (body.containsKey("sex")) admin.setSex((String) body.get("sex"));
        if (body.containsKey("avatarUrl")) admin.setAvatarUrl((String) body.get("avatarUrl"));

        // 执行更新
        int updated = sysAdminMapper.updateById(admin);

        if (updated > 0) {
            return Result.ok("更新成功");
        } else {
            return Result.fail("更新失败");
        }
    }

    /**
     * 修改密码
     * POST /api/system/user/profile/password
     */
    @PostMapping("/profile/password")
    public Result updatePassword(@RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        if (oldPassword == null || oldPassword.isEmpty()) {
            return Result.fail("旧密码不能为空");
        }

        if (newPassword == null || newPassword.length() < 6) {
            return Result.fail("新密码长度至少6位");
        }

        // TODO: 从 token 获取用户
        SysAdmin admin = sysAdminMapper.selectOne(new QueryWrapper<SysAdmin>().eq("username", "admin"));

        if (admin == null) {
            return Result.fail("用户不存在");
        }

        // 验证旧密码
        if (!admin.getPassword().equals(oldPassword)) {
            return Result.fail("旧密码错误");
        }

        // 更新密码
        admin.setPassword(newPassword);
        int updated = sysAdminMapper.updateById(admin);

        if (updated > 0) {
            return Result.ok("密码修改成功");
        } else {
            return Result.fail("密码修改失败");
        }
    }

    // ==================== 原有的用户管理 API ====================

    // 列表：GET /list?pageNum=1&pageSize=10&keyword=xxx
    @GetMapping("/list")
    public com.example.demo.lwj.controller.Result list(@RequestParam(defaultValue = "1") int pageNum,
                       @RequestParam(defaultValue = "10") int pageSize,
                       @RequestParam(required = false) String keyword) {
        Page<SysUser> page = new Page<>(pageNum, pageSize);
        Page<SysUser> result = userService.selectUserPage(page, keyword);
        return com.example.demo.lwj.controller.Result.ok(Map.of("total", result.getTotal(), "records", result.getRecords()));
    }

    // 详情：GET /{id}
    @GetMapping("/{id}")
    public com.example.demo.lwj.controller.Result getById(@PathVariable Long id) {
        SysUser user = userService.getById(id);
        if (user == null) return com.example.demo.lwj.controller.Result.fail("用户不存在");
        return com.example.demo.lwj.controller.Result.ok(user);
    }

    // 更新：PUT /update
    @PutMapping("/update")
    public com.example.demo.lwj.controller.Result update(@RequestBody Map<String, Object> body) {
        Long id = body.get("id") == null ? null : Long.parseLong(body.get("id").toString());
        if (id == null) return com.example.demo.lwj.controller.Result.fail("缺少用户 id");

        SysUser user = userService.getById(id);
        if (user == null) return com.example.demo.lwj.controller.Result.fail("用户不存在");

        if (body.containsKey("realName")) user.setRealName((String) body.get("realName"));
        if (body.containsKey("studentId")) user.setStudentId((String) body.get("studentId"));
        if (body.containsKey("dormBuilding")) user.setDormBuilding((String) body.get("dormBuilding"));
        if (body.containsKey("dormRoom")) user.setDormRoom((String) body.get("dormRoom"));
        if (body.containsKey("status")) user.setStatus(Integer.parseInt(body.get("status").toString()));

        boolean ok = userService.updateUser(user);
        if (!ok) return com.example.demo.lwj.controller.Result.fail("更新失败");
        return com.example.demo.lwj.controller.Result.ok("更新成功");
    }

    // 重置基准：PUT /reset-baseline/{userId}
    @PutMapping("/reset-baseline/{userId}")
    public com.example.demo.lwj.controller.Result resetBaseline(@PathVariable Long userId) {
        // TODO: 实现基准重置逻辑
        return com.example.demo.lwj.controller.Result.ok("重置成功");
    }
}
