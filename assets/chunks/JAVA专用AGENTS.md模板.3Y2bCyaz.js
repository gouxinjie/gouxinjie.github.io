const n=`# 后端开发规范（Java）

<CopyMarkdown />

![](../images/java.jpg)

本文档为后端开发团队（Java 方向）的核心约束指南。所有生成的代码、注释、数据库设计必须遵循以下规则。注释必须使用简体中文，所有代码文件必须包含 \`@author gouxinjie\` 标记。


## 一、通用规范

### 1.1 类型安全

* 严禁使用原生 \`Object\` 替代具体业务类型（除非必要泛型场景）
* 必须使用强类型定义，禁止无限制的泛型擦除滥用
* 所有方法签名、变量、API 响应结构必须明确泛型或具体类型

### 1.2 代码风格

* 遵循《阿里巴巴 Java 开发手册》核心规范
* 禁止使用 \`@SuppressWarnings\` 或类似注解跳过编译期/静态检查警告
* 复杂业务优先使用标准异常处理与规范日志记录

### 1.3 路径与包名规范

* **严格遵守标准 Maven / Gradle 目录结构与包名规范**
* 禁止使用模糊、混乱的跨包直接引用
* 使用全路径包名导入，如 \`import com.example.project.service.UserService;\`

### 1.4 API 请求规范

* 所有涉及用户身份的请求必须包含 \`userId\`
* 前后端交互必须统一处理 loading / error 状态
* 不允许虚构或假设接口结构

### 1.5 错误处理响应格式

统一返回标准 JSON 结构：

\`\`\`json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "错误描述（中文）",
  "data": null
}

\`\`\`

### 1.6 成功响应格式

\`\`\`json
{
  "success": true,
  "code": "200",
  "message": "操作成功",
  "data": {}
}

\`\`\`

> \`code\` 字段统一使用字符串类型（成功为 \`"200"\`，失败为具体业务错误码），遵循强类型约束，禁止使用 \`Object\` 承载状态码。

### 1.7 代码清理

必须移除：

* 未使用的成员变量、局部变量
* 未使用的私有方法
* 未使用的 import 声明
* 冗余的配置文件与样式

## 二、Java 项目结构（Spring Boot 典型分层）

\`\`\`
src/main/java/com/example/project/
├── controller/            # API 表现层（Controller）
│   ├── UserController.java
│   └── OrderController.java
├── service/               # 业务逻辑层（Service 接口）
│   ├── UserService.java
│   └── OrderService.java
├── service/impl/          # 业务逻辑实现层
│   ├── UserServiceImpl.java
│   └── OrderServiceImpl.java
├── repository/            # 数据访问层（Spring Data JPA / MyBatis Mapper）
│   ├── UserRepository.java
│   └── OrderRepository.java
├── model/                 # 数据模型层（Entity / PO）
│   ├── UserEntity.java
│   └── OrderEntity.java
├── dto/                   # 数据传输对象（DTO / Request / Response）
│   ├── ApiResponse.java   # 统一响应封装
│   ├── UserCreateRequest.java
│   └── UserResponse.java
├── config/                # 配置目录
│   ├── SecurityConfig.java
│   └── DatabaseConfig.java
├── exception/             # 自定义异常定义
│   └── BusinessException.java
├── middleware/            # 拦截器 / 过滤器 / 切面
│   └── AuthInterceptor.java
├── util/                  # 工具类目录
│   └── JwtUtils.java
└── Application.java       # 应用主入口

\`\`\`

## 三、函数与类注释规范

所有类和公开方法**必须添加完整的 Javadoc 注释**，必须包含 \`@author gouxinjie\`。

### 3.1 示例代码

\`\`\`java
package com.example.project.service.impl;

import com.example.project.model.UserEntity;
import com.example.project.repository.UserRepository;
import com.example.project.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 用户服务实现类
 *
 * @author gouxinjie
 * @since 2026-10-12
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据用户ID获取用户信息
     *
     * @param userId 用户ID
     * @return 用户实体对象，不存在时返回 Optional.empty()
     * @throws IllegalArgumentException 当 userId 无效时抛出
     * @author gouxinjie
     */
    public Optional<UserEntity> getUserById(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("用户ID无效");
        }
        return userRepository.findById(userId);
    }
}

\`\`\`

## 四、数据库规范

### 4.1 通用规范

* **必须使用参数化查询（预编译 SQL / ORM 占位符）**，严禁直接拼接 SQL 防止注入
* 所有数据库表与字段必须有清晰的中文注释
* 表名使用小写，单词间用下划线分隔（如 \`sys_user\`）
* 字段名使用小写，单词间用下划线分隔（如 \`created_at\`）
* 连接池推荐使用 HikariCP，合理配置最大连接数与超时时间

### 4.2 Spring Data JPA / MyBatis 示例

\`\`\`java
package com.example.project.repository;

import com.example.project.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * 用户数据访问层
 *
 * @author gouxinjie
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    /**
     * 根据用户名查询用户信息（参数化查询）
     *
     * @param username 用户名
     * @return 用户实体
     * @author gouxinjie
     */
    @Query("SELECT u FROM UserEntity u WHERE u.username = :username")
    UserEntity findByUsernameParam(@Param("username") String username);
}

\`\`\`

## 五、依赖管理

* **统一使用 Maven (\`pom.xml\`) 或 Gradle (\`build.gradle\`) 进行依赖管理**
* 禁止在本地随意引入未经版本锁定的第三方 Jar 包
* 必须严格管理依赖版本号，防止依赖冲突或安全漏洞

## 六、接口封装规范（Spring MVC）

### 6.1 统一响应封装类

所有接口必须返回统一响应结构，**禁止直接返回 \`Map\`、\`Object\` 或裸实体**，统一使用泛型封装类：

\`\`\`java
package com.example.project.dto;

import java.io.Serializable;

/**
 * 统一 API 响应封装类
 *
 * @param <T> 业务数据类型
 * @author gouxinjie
 * @since 2026-10-13
 */
public class ApiResponse<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 业务是否处理成功 */
    private final boolean success;

    /** 业务状态码，成功为 "200"，失败为具体业务错误码 */
    private final String code;

    /** 提示信息（中文） */
    private final String message;

    /** 业务数据，失败时为 null */
    private final T data;

    private ApiResponse(boolean success, String code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 构造成功响应
     *
     * @param data 业务数据
     * @param <T>  业务数据类型
     * @return 成功响应对象
     * @author gouxinjie
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "200", "操作成功", data);
    }

    /**
     * 构造失败响应
     *
     * @param code    业务错误码
     * @param message 错误描述（中文）
     * @param <T>     业务数据类型
     * @return 失败响应对象
     * @author gouxinjie
     */
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
}

\`\`\`

### 6.2 Controller 示例

\`\`\`java
package com.example.project.controller;

import com.example.project.dto.ApiResponse;
import com.example.project.model.UserEntity;
import com.example.project.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户管理控制器
 *
 * @author gouxinjie
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 获取用户信息
     *
     * @route GET /api/users/{userId}
     * @param userId 用户ID
     * @return 统一响应格式的结构
     * @author gouxinjie
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserEntity>> getUser(@PathVariable Long userId) {
        UserEntity user = userService.getUserById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("USER_NOT_FOUND", "用户不存在"));
        }

        return ResponseEntity.ok(ApiResponse.success(user));
    }
}

\`\`\`

## 七、安全规范

1. **敏感信息处理**：禁止硬编码数据库密码、JWT Secret、API Key，必须通过环境变量或配置中心（如 Nacos/Apollo）注入。
2. **SQL 注入防护**：必须使用 ORM（JPA/MyBatis \`#{}\` 占位符）或预编译 Statement。
3. **密码安全**：用户密码必须使用 BCryptPasswordEncoder 进行强哈希存储，严禁明文。
4. **JWT 安全**：设置合理过期时间，配合强密钥签名与 Redis 黑名单/刷新令牌机制。

## 八、AI 行为约束（核心）

1. 不允许编造接口
2. 不允许假设数据库结构
3. 不允许跳过鉴权与异常处理
4. 不允许生成未使用的冗余代码
5. 不允许修改无关文件
6. 不明确需求时必须主动询问

## 九、开发工作流（必须执行）

### 9.1 新功能开发流程

1. 需求分析与确认
2. 确定接口契约
3. 定义数据模型（Entity / DTO）
4. 编写 Repository / Mapper 层
5. 编写 Service 业务层
6. 编写 Controller 层并加上完整注释
7. 编写 JUnit 单元测试
8. 自检是否完全符合本规范

### 9.2 修改代码流程

1. 阅读原代码
2. 理解业务逻辑
3. 给出修改方案
4. 再进行修改

禁止：直接修改代码而不分析

### 9.3 Debug 流程

1. 分析报错
2. 定位问题
3. 找到根因
4. 提供修复方案

## 十、输出规范

1. 必须输出完整可运行的 Java 代码
2. 必须包含完整的包名与 \`import\` 语句
3. 必须使用标准 Markdown 代码块
4. 必须包含简体中文注释以及 \`@author gouxinjie\`

## 十一、自检机制（必须执行）

输出前必须通过以下检查：

1. 是否所有类和方法都带有完整的中文注释？
2. 是否每个类/文件都包含 \`@author gouxinjie\`？
3. API 请求中是否包含 \`userId\` 校验逻辑？
4. 是否包含了标准错误与成功响应封装？
5. 数据库操作是否完全使用参数化查询？
6. 是否移除了所有未使用的 import 和未使用的变量？
7. 是否遵循标准 Maven / Gradle 目录结构与包名规范？
8. 是否所有接口均返回统一泛型响应封装（禁止 \`Map\` / \`Object\`）？
9. 是否未使用 \`@SuppressWarnings\` 等注解跳过静态检查？

不符合必须自动修正

## 十二、性能与日志规范

* 数据库查询必须为高频检索字段建立索引，避免 N+1 查询问题。
* 日志统一使用 SLF4J + Logback 门面框架。
* 关键业务日志必须通过 MDC 注入 \`traceId\` 和 \`userId\` 进行全链路追踪。
* 禁止在日志中输出密码、Token 等敏感隐私数据。

## 十三、测试规范

* 核心业务逻辑必须编写 JUnit 5 单元测试。
* 使用 Mockito 进行组件 Mock。
* 测试覆盖率要求不低于 80%。

## 十四、MCP / 工具调用规范

1. 优先使用工具获取数据
2. 不允许伪造数据
3. 工具失败必须兜底
4. 不确定必须询问用户

## 十五、终极原则

> 优先保证代码质量，其次是正确性，最后才是开发速度

## 十六、附则

* 所有代码必须自动校验本规范
* 特殊情况必须说明原因
* 违反规范必须拒绝生成代码

## 变更对照摘要

| 变更项 | Java 规范说明 |
| --- | --- |
| **作者标记** | 必须包含 \`@author gouxinjie\` |
| **技术栈** | Spring Boot / Spring MVC / Spring Data JPA / MyBatis |
| **包管理** | Maven (\`pom.xml\`) 或 Gradle (\`build.gradle\`) |
| **类型安全** | 严禁使用模糊的 \`Object\`，强制严格泛型与类型检查 |
| **响应封装** | 统一泛型 \`ApiResponse<T>\`，禁止 \`Map\` / \`Object\` 直接返回 |
| **日志框架** | SLF4J + Logback（支持 MDC 追踪） |
| **测试框架** | JUnit 5 + Mockito |
`;export{n as default};
