package com.example.demo.lwj.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("sys_admin")
public class SysAdmin implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private String username;

    @JsonIgnore  // 密码不返回给前端
    private String password;

    private String realName;
    private String nickname;
    private String phonenumber;
    private String email;
    private String sex;
    private String deptName;
    private String studentId;
    private String avatarUrl;
    private String role;
    private Integer status;

    @JsonIgnore  // 软删除标记不返回给前端
    private Integer deleted;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
