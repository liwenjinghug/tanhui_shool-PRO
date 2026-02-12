package com.example.demo.lwj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.lwj.entity.SysAdmin;
import com.example.demo.lwj.mapper.SysAdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private SysAdminMapper sysAdminMapper;

    // 简单的内存 token -> user 存储（仅用于示例/开发）
    private static final ConcurrentHashMap<String, Map<String, Object>> TOKENS = new ConcurrentHashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String account = body.get("account");
        String password = body.get("password");
        if (account == null || account.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "缺少账号或密码"));
        }

        // 查询数据库
        SysAdmin admin = sysAdminMapper.selectOne(new QueryWrapper<SysAdmin>().eq("username", account));

        if (admin == null || !admin.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "账号或密码错误"));
        }

        if (admin.getStatus() != null && admin.getStatus() != 1) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "账号已禁用"));
        }

        // 生成 token
        String token = UUID.randomUUID().toString();

        // 返回完整用户信息（密码已通过 @JsonIgnore 自动隐藏）
        TOKENS.put(token, Map.of("admin", admin));

        return ResponseEntity.ok(Map.of("token", token, "user", admin));
    }

    @GetMapping("/user")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "缺少 Authorization 头"));
        }
        String token = authorization;
        if (authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
        }
        Map<String, Object> user = TOKENS.get(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "无效或已过期的 token"));
        }
        return ResponseEntity.ok(Map.of("user", user));
    }
}
