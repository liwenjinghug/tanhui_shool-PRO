package com.example.demo.lwj.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;
import java.io.Serializable;

@Data
@TableName("sys_user")
public class SysUser implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String openid;

    private String nickname;

    private String avatarUrl;

    private String realName;

    private String studentId;

    private String dormBuilding;

    private String dormRoom;

    private Integer points;

    /** 用户状态，新增字段（例如：0=禁用，1=启用） */
    private Integer status;

    private LocalDateTime createTime;
}

