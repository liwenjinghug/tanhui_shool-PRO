package com.example.demo.lwj.controller;

import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.lwj.entity.SysDorm;
import com.example.demo.lwj.mapper.SysDormMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system/dorm")
@CrossOrigin(origins = "*")
public class DormController {

    @Autowired
    private SysDormMapper sysDormMapper;

    // List with pagination and search
    @GetMapping("/list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") long pageNum,
                                    @RequestParam(defaultValue = "10") long pageSize,
                                    @RequestParam(required = false) String keyword,
                                    @RequestParam(required = false) String campus) { // Added campus param
        Page<SysDorm> page = new Page<>(pageNum, pageSize);
        QueryWrapper<SysDorm> wrapper = new QueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("building_name", keyword).or().like("room_number", keyword));
        }
        if (campus != null && !campus.isEmpty()) {
            wrapper.eq("campus", campus);
        }
        wrapper.orderByDesc("create_time");

        sysDormMapper.selectPage(page, wrapper);

        return Map.of(
            "total", page.getTotal(),
            "rows", page.getRecords()
        );
    }

    // Add
    @PostMapping
    public Map<String, Object> add(@RequestBody SysDorm dorm) {
        dorm.setCreateTime(java.time.LocalDateTime.now());
        if(dorm.getStatus() == null) dorm.setStatus(1);
        sysDormMapper.insert(dorm);
        return Map.of("success", true, "message", "添加成功");
    }

    // Update
    @PutMapping
    public Map<String, Object> update(@RequestBody SysDorm dorm) {
        sysDormMapper.updateById(dorm);
        return Map.of("success", true, "message", "修改成功");
    }

    // Delete
    @DeleteMapping("/{ids}")
    public Map<String, Object> delete(@PathVariable List<Long> ids) {
        sysDormMapper.deleteBatchIds(ids);
        return Map.of("success", true, "message", "删除成功");
    }

    // Import
    @PostMapping("/import")
    public Map<String, Object> importData(@RequestParam("file") MultipartFile file) throws IOException {
         EasyExcel.read(file.getInputStream(), SysDorm.class, new com.alibaba.excel.read.listener.PageReadListener<SysDorm>(dataList -> {
            for (SysDorm dorm : dataList) {
                dorm.setCreateTime(java.time.LocalDateTime.now());
                if(dorm.getStatus() == null) dorm.setStatus(1);
                sysDormMapper.insert(dorm);
            }
        })).sheet().doRead();
        return Map.of("success", true, "message", "导入成功");
    }
}
