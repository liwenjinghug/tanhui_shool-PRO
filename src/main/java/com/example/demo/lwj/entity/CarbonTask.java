package com.example.demo.lwj.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("carbon_task")
public class CarbonTask {
    private Long id;
    private String taskName;
    private Integer pointsReward;
    private String iconPath;
    private Integer dailyLimit;
    private Integer status;
}

