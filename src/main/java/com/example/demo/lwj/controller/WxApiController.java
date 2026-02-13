package com.example.demo.lwj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.lwj.entity.CarbonTask;
import com.example.demo.lwj.entity.SysUser;
import com.example.demo.lwj.entity.UserTaskLog;
import com.example.demo.lwj.mapper.CarbonTaskMapper;
import com.example.demo.lwj.mapper.UserTaskLogMapper;
import com.example.demo.lwj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wx")
@CrossOrigin(origins = "*")
public class WxApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private CarbonTaskMapper carbonTaskMapper;

    @Autowired
    private UserTaskLogMapper userTaskLogMapper;

    /**
     * 获取小程序用户信息（包含积分）
     * 对应前端: GET /api/wx/user/info?openid=...
     */
    @GetMapping("/user/info")
    public SysUser getUserInfo(@RequestParam String openid) {
        SysUser user = userService.getOne(new QueryWrapper<SysUser>().eq("openid", openid));
        if (user == null) {
            // 如果用户不存在，可以返回空对象或错误，这里简单返回一个带默认值的对象供前端容错
            user = new SysUser();
            user.setPoints(0);
            user.setNickname("未注册用户");
        }
        return user;
    }

    /**
     * 获取首页任务列表 (改为获取今日行为日志)
     * 对应前端: GET /api/wx/home/tasks?openid=...
     */
    @GetMapping("/home/tasks")
    public List<UserTaskLog> getHomeTasks(@RequestParam String openid) {
        // 根据 openid 查用户 ID
        SysUser user = userService.getOne(new QueryWrapper<SysUser>().eq("openid", openid));
        if (user == null) {
            return List.of();
        }

        // 查询今日行为日志
        // 假设 date_str 存的是 yyyy-MM-dd
        return userTaskLogMapper.selectList(new QueryWrapper<UserTaskLog>()
                .eq("user_id", user.getId())
                .orderByDesc("create_time"));
    }

    /**
     * 小程序用户登录/注册
     * 对应前端: POST /api/wx/auth/login
     */
    @PostMapping("/auth/login")
    public SysUser authLogin(@RequestBody Map<String, Object> body) {
        String openid = (String) body.get("openid");
        String nickname = (String) body.get("nickname");
        String avatarUrl = (String) body.get("avatarUrl");

        SysUser user = userService.getOne(new QueryWrapper<SysUser>().eq("openid", openid));
        if (user == null) {
            // 新用户注册
            user = new SysUser();
            user.setOpenid(openid);
            user.setCreateTime(java.time.LocalDateTime.now());
            user.setPoints(0); // 新用户赠送积分
            user.setIsProfileCompleted(false); // 首次登录需要完善资料
            user.setStatus(1); // 默认启用
        }
        user.setNickname(nickname);
        user.setAvatarUrl(avatarUrl);
        user.setUpdateTime(java.time.LocalDateTime.now());
        userService.saveOrUpdate(user);

        return user;
    }

    /**
     * 完善用户资料
     * 对应前端: POST /api/wx/user/complete-profile
     */
    @PostMapping("/user/complete-profile")
    public Map<String, Object> completeProfile(@RequestBody Map<String, Object> body) {
        String openid = (String) body.get("openid");
        String campus = (String) body.get("campus");
        String realName = (String) body.get("realName");
        String studentId = (String) body.get("studentId");
        String dormBuilding = (String) body.get("dormBuilding");
        String dormRoom = (String) body.get("dormRoom");

        Map<String, Object> res = new HashMap<>();

        SysUser user = userService.getOne(new QueryWrapper<SysUser>().eq("openid", openid));
        if (user != null) {
            user.setCampus(campus);
            user.setRealName(realName);
            user.setStudentId(studentId);
            user.setDormBuilding(dormBuilding);
            user.setDormRoom(dormRoom);
            user.setIsProfileCompleted(true);
            user.setUpdateTime(java.time.LocalDateTime.now());
            userService.updateById(user);

            res.put("success", true);
            res.put("message", "资料完善成功");
        } else {
            res.put("success", false);
            res.put("message", "用户不存在");
        }
        return res;
    }

    // 模拟小程序登录换取 openid (仅用于开发测试)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        // 生产环境应该请求微信 API: https://api.weixin.qq.com/sns/jscode2session
        // 这里直接模拟返回一个测试 openid
        Map<String, Object> result = new HashMap<>();
        result.put("openid", "test_openid_" + code);
        result.put("session_key", "mock_session_key");
        return result;
    }

    /**
     * 更新单个用户信息字段
     * 对应前端: POST /api/wx/user/update
     */
    @PostMapping("/user/update")
    public Map<String, Object> updateUser(@RequestBody Map<String, Object> body) {
        String openid = (String) body.get("openid");
        String field = (String) body.get("field");
        String value = (String) body.get("value");

        Map<String, Object> res = new HashMap<>();

        SysUser user = userService.getOne(new QueryWrapper<SysUser>().eq("openid", openid));
        if (user != null) {
            if ("nickName".equals(field)) {
                user.setNickname(value);
            } else if ("avatarUrl".equals(field)) {
                user.setAvatarUrl(value);
            }
            userService.updateById(user);
            res.put("success", true);
        } else {
            res.put("success", false);
            res.put("message", "User not found");
        }
        return res;
    }
}
