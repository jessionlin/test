/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

--
-- 1. 用户账户表
--
create table if not exists `user_account`(
    `id` int(11) not null auto_increment primary key,
    `user_name` varchar(24) not null,
    `real_name` varchar(24) not null,
    `password` varchar(128) not null,
    `school_id` int(11) not null,
    `faculty_id` int(11) not null,
    `profession_id` int(11) not null,
    `phone` varchar(12) not null,
    `email` varchar(36) not null
)engine=MyISAM default charset = utf8;

--
-- 2. 学校表
--
create table if not exists `school`(
    `id` int(11) not null auto_increment primary key,
    `school_name` varchar(64) not null
)engine=MyISAM default charset = utf8;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1,'哈尔滨工业大学'),(2,'哈尔滨工程大学'),(3,'哈尔滨理工大学'),(4,'黑龙江大学');
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
--
-- 3. 学院表
--
create table if not exists `faculty`(
    `id` int(11) not null auto_increment primary key,
    `faculty_name` varchar(64) not null,
    `school_id` int(11) not null
)engine=MyISAM default charset = utf8;
INSERT INTO `faculty` VALUES (1,'计算机科学与技术学院',1),(2,'管理学院',1),(3,'电气及自动化学院',1);
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
--
-- 4. 专业表
--
create table if not exists `profession`(
    `id` int(11) not null auto_increment primary key,
    `profession_name` varchar(64) not null,
    `faculty_id` int(11) not null
)engine=MyISAM default charset = utf8;
INSERT INTO `profession` VALUES (1,'软件工程',1),(2,'物联网工程',1),(3,'计算机科学与技术',1),(4,'信息安全',1),(5,'生物信息',1);
/*!40000 ALTER TABLE `profession` ENABLE KEYS */;
--
-- 5. 特长类别表
--
create table if not exists `characteristic_type`(
    `id` int(11) not null auto_increment primary key,
    `characteristic_type` varchar(64) not null
)engine=MyISAM default charset = utf8;
INSERT INTO `characteristic_type` VALUES (1,'计算机技术'),(2,'管理类'),(3,'销售类');
/*!40000 ALTER TABLE `characteristic_type` ENABLE KEYS */;

--
-- 6. 特长表
--
create table if not exists `characteristic`(
    `id` int(11) not null auto_increment primary key,
    `characteristic_name` varchar(64) not null,
    `type_id` int(11) not null
)engine=MyISAM default charset = utf8;

INSERT INTO `characteristic` VALUES (1,'大数据',1),(2,'NLP',1),(3,'计算机视觉',1),(4,'数据挖掘',1),(5,'模式识别',1),(6,'网站建站',1),(7,'知识图谱',1),(8,'软件项目管理',2),(9,'财务管理',2),(10,'成本管理',2),(11,'互联网营销',3),(12,'传统营销',3);
/*!40000 ALTER TABLE `characteristic` ENABLE KEYS */;
--
-- 7. 用户特长表, 记录用户拥有哪些特长
--
create table if not exists `user_characteristic`(
    `id` int(11) not null auto_increment primary key,
    `user_id` int(11) not null,
    `characteristic_id` int(11) not null
)engine=MyISAM default charset = utf8;

--
-- 8. 项目信息表
--
create table if not exists `projects`(
    `id` int(11) not null auto_increment primary key,
    `user_id` int(11) not null,
    `project_name` varchar(64) not null,
    `project_describe` text not null,
    `date` date not null,
    `image_url` varchar(64) not null,
    `group_number` tinyint not null,
    `group_number_now` tinyint not null,
    `group_describe` text not null,
    `progress_id` tinyint not null,
    `page_views` int(11) not null,
    `thumb_number` int(11) not null
)engine=MyISAM default charset = utf8;

--
-- 9. 项目阶段信息表
--
create table if not exists `progress`(
    `id` int(11) not null auto_increment primary key,
    `progress` varchar(64) not null
)engine=MyISAM default charset = utf8;

--
-- 10. 项目成员信息表
--
create table if not exists `group`(
    `id` int(11) not null auto_increment primary key,
    `project_id` int(11) not null,
    `user_id` int(11) not null,
    `role_id` int(11) not null
)engine=MyISAM default charset = utf8;

--
-- 11. 项目成员角色信息表
--
create table if not exists `role`(
    `id` int(11) not null auto_increment primary key,
    `role` varchar(64) not null
)engine=MyISAM default charset = utf8;

--
-- 12. 新闻动态表
--
create table if not exists `news`(
    `id` int(11) not null auto_increment primary key,
    `title` varchar(64) not null,
    `content` text not null,
    `image_url` varchar(64) not null,
    `date` datetime not null,
    `type` tinyint not null,
    `page_views` int(11) not null,
    `thumb_number` int(11) not null
)engine=MyISAM default charset = utf8;



