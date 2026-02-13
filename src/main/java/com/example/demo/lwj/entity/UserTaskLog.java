package com.example.demo.lwj.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_task_log")
public class UserTaskLog {
    private Long id;

    private Long userId;

    @JsonProperty("task_name")
    private String taskName;

    @JsonProperty("points_earned")
    private Integer pointsEarned; // Changed to Integer as per DB schema

    @JsonFormat(pattern = "HH:mm", timezone = "GMT+8")
    @TableField("create_time")
    private LocalDateTime createTime;

    private java.time.LocalDate dateStr;

    // Virtual field for frontend "time" property
    @JsonProperty("time")
    public String getTime() {
        if (createTime != null) {
            // Only time part HH:mm
            return createTime.toLocalTime().toString().substring(0, 5);
        }
        return "";
    }
}
