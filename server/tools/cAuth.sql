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

--
-- 3. 学院表
--
create table if not exists `faculty`(
    `id` int(11) not null auto_increment primary key,
    `faculty_name` varchar(64) not null,
    `school_id` int(11) not null
)engine=MyISAM default charset = utf8;

--
-- 4. 专业表
--
create table if not exists `profession`(
    `id` int(11) not null auto_increment primary key,
    `profession_name` varchar(64) not null,
    `faculty_id` int(11) not null
)engine=MyISAM default charset = utf8;

--
-- 5. 特长类别表
--
create table if not exists `characteristic_type`(
    `id` int(11) not null auto_increment primary key,
    `characteristic_type` varchar(64) not null
)engine=MyISAM default charset = utf8;

--
-- 6. 特长表
--
create table if not exists `characteristic`(
    `id` int(11) not null auto_increment primary key,
    `characteristic_name` varchar(64) not null,
    `type_id` int(11) not null
)engine=MyISAM default charset = utf8;

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



