package com.example.demo.lwj.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sys_dorm")
public class SysDorm {
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("校区")
    private String campus;

    @ExcelProperty("楼栋名称")
    private String buildingName;

    @ExcelProperty("房间号")
    private String roomNumber;

    @ExcelProperty("宿舍类型")
    private String type; // 4人间, 6人间

    private Integer status; // 1=enable, 0=disable

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTime;
}
