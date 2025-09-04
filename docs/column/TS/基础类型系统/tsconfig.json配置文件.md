# TypeScript 配置文件 tsconfig.json 详解

`tsconfig.json` 是 `TypeScript` 项目的核心配置文件，它定义了编译选项、包含的文件以及其他项目设置。这个文件对于任何 `TypeScript` 项目至关重要。

## 基本结构

一个典型的 `tsconfig.json` 文件包含以下主要部分：

```json
{
  "compilerOptions": {
    // 编译选项
  },
  "include": [
    // 包含的文件
  ],
  "exclude": [
    // 排除的文件
  ],
  "extends": "",
  "files": [],
  "references": []
}
```

## 主要配置项详解

### 1. compilerOptions (编译选项)

这是最重要的配置部分，控制 TypeScript 编译器的行为。

#### 常用基础选项

```json
{
  "compilerOptions": {
    "target": "ES6", // 编译目标JS版本: 'ES3', 'ES5', 'ES6'/'ES2015', 'ES2016'等
    "module": "commonjs", // 模块系统: 'commonjs', 'amd', 'es2015', 'esnext'等
    "strict": true, // 启用所有严格类型检查选项
    "jsx": "preserve", // JSX处理方式: 'preserve', 'react', 'react-native'
    "outDir": "./dist", // 输出目录
    "rootDir": "./src", // 输入文件根目录
    "sourceMap": true, // 生成source map文件
    "declaration": true // 生成.d.ts声明文件
  }
}
```

#### 类型检查相关选项

```json
{
  "compilerOptions": {
    "noImplicitAny": true, // 禁止隐式any类型
    "strictNullChecks": true, // 严格的null检查
    "strictFunctionTypes": true, // 严格的函数类型检查
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "noImplicitThis": true, // 禁止隐式any类型的this
    "alwaysStrict": true // 以严格模式解析并为每个源文件添加"use strict"
  }
}
```

#### 模块解析选项

```json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块名的基准目录
    "paths": {
      // 模块名到基于baseUrl的路径映射
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    "moduleResolution": "node", // 模块解析策略: 'node'或'classic'
    "esModuleInterop": true // 兼容CommonJS和ES模块
  }
}
```

### 2. include/exclude/files

这些选项指定项目中包含和排除的文件：

```json
{
  "include": ["src/**/*"], // 包含src目录下的所有文件
  "exclude": ["node_modules", "**/*.spec.ts"], // 排除node_modules和测试文件
  "files": ["src/index.ts"] // 显式包含的少量文件(不常用)
}
```

### 3. extends

可以继承其他配置文件：

```json
{
  "extends": "./configs/base", // 继承另一个配置文件
  "compilerOptions": {
    // 覆盖或新增配置
  }
}
```

### 4. references (项目引用)

用于配置项目引用，支持大型项目的模块化开发：

```json
{
  "references": [
    { "path": "../shared" }, // 引用另一个TypeScript项目
    { "path": "../lib" }
  ]
}
```

## 重要配置详解

### 1. 严格模式 (strict)

启用所有严格类型检查选项的快捷方式：

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

等同于同时启用：

- `noImplicitAny`
- `noImplicitThis`
- `alwaysStrict`
- `strictBindCallApply`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictPropertyInitialization`

### 2. 模块解析 (moduleResolution)

TypeScript 支持两种模块解析策略：

1. **"node"**：模仿 Node.js 的模块解析机制
2. **"classic"**：TypeScript 的传统解析方式（已弃用）

现代项目通常使用 `"node"` 策略：

```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

### 3. 路径映射 (paths)

与 `baseUrl` 配合使用，实现类似 webpack 的别名功能：

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

## 最佳实践配置示例

以下是现代 TypeScript 项目的推荐配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```
