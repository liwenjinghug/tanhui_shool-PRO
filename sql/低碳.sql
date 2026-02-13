/*
 Navicat Premium Dump SQL

 Source Server         : ry-vue
 Source Server Type    : MySQL
 Source Server Version : 80042 (8.0.42)
 Source Host           : localhost:3306
 Source Schema         : 低碳

 Target Server Type    : MySQL
 Target Server Version : 80042 (8.0.42)
 File Encoding         : 65001

 Date: 12/02/2026 23:01:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标题',
  `cover_img` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '富文本内容',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资讯文章表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of article
-- ----------------------------

-- ----------------------------
-- Table structure for carbon_task
-- ----------------------------
DROP TABLE IF EXISTS `carbon_task`;
CREATE TABLE `carbon_task`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '任务名称(如:步行上课)',
  `points_reward` int NOT NULL DEFAULT 1 COMMENT '单次奖励积分',
  `icon_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图标路径(本地或网络图片)',
  `daily_limit` int NULL DEFAULT 1 COMMENT '每日上限次数(0为不限)',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态:1启用,0停用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '低碳任务配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of carbon_task
-- ----------------------------
INSERT INTO `carbon_task` VALUES (1, '步行上课', 8, '/images/icon-walk.png', 2, 1);
INSERT INTO `carbon_task` VALUES (2, '光盘行动', 5, '/images/icon-food.png', 3, 1);
INSERT INTO `carbon_task` VALUES (3, '垃圾分类', 2, '/images/icon-trash.png', 5, 1);
INSERT INTO `carbon_task` VALUES (4, '旧书循环', 10, '/images/icon-book.png', 1, 1);
INSERT INTO `carbon_task` VALUES (5, '无纸化办公', 5, '/images/icon-paper.png', 10, 1);

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `goods_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '商品名称',
  `goods_img` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品图片',
  `price_points` int NOT NULL COMMENT '所需积分',
  `stock` int NULL DEFAULT 999 COMMENT '库存',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态:1上架,0下架',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '积分商城商品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (1, '环保帆布袋', '/images/goods1.png', 200, 999, 1);
INSERT INTO `goods` VALUES (2, '不锈钢吸管', '/images/goods2.png', 150, 999, 1);
INSERT INTO `goods` VALUES (3, '再生纸笔记本', '/images/goods3.png', 300, 999, 1);
INSERT INTO `goods` VALUES (4, '校园咖啡兑换券', '/images/goods4.png', 500, 999, 1);

-- ----------------------------
-- Table structure for sys_admin
-- ----------------------------
DROP TABLE IF EXISTS `sys_admin`;
CREATE TABLE `sys_admin`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码 (使用 BCrypt 加密存储)',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '真实姓名',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `phonenumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号码',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电子邮箱',
  `sex` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '0' COMMENT '性别: 0=男, 1=女',
  `dept_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '部门名称',
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '学号/工号',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'default' COMMENT '头像路径: default/boy/girl',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色: super/operator/auditor/data_admin',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态: 1=启用, 0=禁用',
  `deleted` tinyint(1) NULL DEFAULT 0 COMMENT '是否删除: 0=否, 1=是',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_role`(`role` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '后台管理员表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_admin
-- ----------------------------
INSERT INTO `sys_admin` VALUES (1, 'admin', '123456', '系统管理员', '超级管理员', '13800138000', 'admin@campus.edu', '0', '系统管理部', 'ADM001', 'default', 'super', 1, 0, '2026-02-11 18:25:28', '2026-02-12 10:00:00');
INSERT INTO `sys_admin` VALUES (2, 'op01', '123456', '运营小张', '小张', '13800138001', 'zhang@campus.edu', '0', '运营部', 'OP001', 'boy', 'operator', 1, 0, '2026-02-11 18:25:28', '2026-02-12 10:00:00');
INSERT INTO `sys_admin` VALUES (3, 'audit01', '123456', '审计老王', '老王', '13800138002', 'wang@campus.edu', '0', '审计部', 'AUD001', 'default', 'auditor', 1, 0, '2026-02-11 18:25:28', '2026-02-12 10:00:00');
INSERT INTO `sys_admin` VALUES (4, 'data01', '123456', '数据专员', '数据小李', '13800138003', 'li@campus.edu', '1', '数据管理部', 'DATA001', 'girl', 'data_admin', 1, 0, '2026-02-11 18:25:28', '2026-02-12 10:00:00');

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '通知标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '通知内容',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'system' COMMENT '类型：system(公告), reward(奖励)',
  `is_published` tinyint(1) NULL DEFAULT 1 COMMENT '1=发布, 0=草稿',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统通知表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_notice
-- ----------------------------
INSERT INTO `sys_notice` VALUES (1, '🎉 欢迎加入碳惠校园', '完善个人信息（绑定学号/宿舍）即可开启低碳生活！', 'system', 1, '2026-02-11 18:20:38');
INSERT INTO `sys_notice` VALUES (2, '💡 节能小贴士', '离开宿舍请随手关灯，每节约1度电可获10积分。', 'system', 1, '2026-02-10 18:20:38');
INSERT INTO `sys_notice` VALUES (3, '🏆 排名奖励发放', '恭喜你在上周的低碳排行榜中进入前100名！', 'reward', 1, '2026-02-09 18:20:38');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '微信OpenID',
  `nickname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '微信昵称',
  `avatar_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '微信头像',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '学号/工号',
  `dorm_building` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '宿舍楼栋',
  `dorm_room` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '宿舍号',
  `points` int NULL DEFAULT 0 COMMENT '当前积分余额',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_openid`(`openid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'test_user_888', 'Jasmine', 'http://tmp/test.jpg', '张三', '2023001', '5栋', '302', 100, '2026-02-11 18:20:38', '2026-02-11 18:20:38');

-- ----------------------------
-- Table structure for user_baseline
-- ----------------------------
DROP TABLE IF EXISTS `user_baseline`;
CREATE TABLE `user_baseline`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '关联sys_user的id',
  `baseline_value` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '基准用电量',
  `period_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'monthly' COMMENT '类型: monthly',
  `period_date` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '月份 (如: 2026-02)',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_month`(`user_id` ASC, `period_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户用电基准表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_baseline
-- ----------------------------
INSERT INTO `user_baseline` VALUES (1, 1, 120.50, 'monthly', '2026-02', '2026-02-11 18:20:38');

-- ----------------------------
-- Table structure for user_order
-- ----------------------------
DROP TABLE IF EXISTS `user_order`;
CREATE TABLE `user_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `goods_id` bigint NOT NULL,
  `goods_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spend_points` int NOT NULL COMMENT '花费积分',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '兑换记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_order
-- ----------------------------

-- ----------------------------
-- Table structure for user_task_log
-- ----------------------------
DROP TABLE IF EXISTS `user_task_log`;
CREATE TABLE `user_task_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `task_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '行为名称',
  `points_earned` int NOT NULL COMMENT '获得积分',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '行为时间',
  `date_str` date NOT NULL COMMENT '日期索引',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_date`(`user_id` ASC, `date_str` ASC) USING BTREE,
  INDEX `idx_date`(`date_str` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户低碳行为日志' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_task_log
-- ----------------------------
INSERT INTO `user_task_log` VALUES (1, 1, '步行上课', 10, '2026-02-11 18:20:38', '2026-02-11');
INSERT INTO `user_task_log` VALUES (2, 1, '光盘行动', 5, '2026-02-11 18:20:38', '2026-02-11');

-- ----------------------------
-- Table structure for sys_dorm
-- ----------------------------
DROP TABLE IF EXISTS `sys_dorm`;
CREATE TABLE `sys_dorm` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `campus` varchar(50) DEFAULT '本校区' COMMENT '校区',
  `building_name` varchar(50) NOT NULL COMMENT '楼栋名称',
  `room_number` varchar(50) NOT NULL COMMENT '房间号',
  `type` varchar(50) DEFAULT '4人间' COMMENT '宿舍类型',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态:1启用,0停用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='宿舍信息表';

-- ----------------------------
-- Records of sys_dorm
-- ----------------------------
INSERT INTO `sys_dorm` VALUES (1, '东校区', '5栋', '302', '4人间', 1, '2026-02-13 10:00:00');
INSERT INTO `sys_dorm` VALUES (2, '东校区', '5栋', '303', '4人间', 1, '2026-02-13 10:00:00');
INSERT INTO `sys_dorm` VALUES (3, '北校区', '8栋', '101', '6人间', 1, '2026-02-13 10:00:00');
INSERT INTO `sys_dorm` VALUES (4, '北校区', '8栋', '102', '6人间', 1, '2026-02-13 10:00:00');

SET FOREIGN_KEY_CHECKS = 1;
