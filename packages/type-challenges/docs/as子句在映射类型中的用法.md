# as 子句在映射类型中的用法

## 概述

`as` 子句在映射类型（Mapped Types）中用于**转换键名**或**条件过滤**。

```typescript
type MappedType = {
  [K in keyof T as NewKeyExpression]: T[K]
}
```

---

## 两种主要用法

### 1. 键重命名

使用 `as` 对键进行转换，生成新的键名。

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// 等价于:
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

**示例：添加前缀**

```typescript
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${K & string}`]: T[K]
};

type Result = Prefixed<{ name: string; age: number }, "user_">;
// { user_name: string; user_age: number }
```

**示例：大小写转换**

```typescript
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<K & string>]: T[K]
};

type Result = UppercaseKeys<{ name: string; age: number }>;
// { NAME: string; AGE: number }
```

---

### 2. 条件过滤

使用 `as` 配合条件判断，**过滤**特定的键。当条件返回 `never` 时，该键会被过滤掉。

```typescript
// 基本语法：条件为真时返回 never，键被过滤
type Filtered<T> = {
  [K in keyof T as Condition ? never : K]: T[K]
};
```

#### 为什么 `never` 能过滤键？

在映射类型中，键为 `never` 的属性会被 TypeScript 自动忽略。

```typescript
type Example = {
  [K in "a" | "b" | "c" as K extends "b" ? never : K]: string
};
// 结果: { a: string; c: string }  - "b" 变成了 never，被过滤
```

---

## 条件过滤示例

### 示例 1: 实现 Omit

```typescript
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
};

type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

// 排除 age 和 email
type Result = MyOmit<User, "age" | "email">;
// { id: number; name: string }
```

**执行流程：**

```
遍历每个键 P：

P = "id"     → "id" extends "age" | "email" ? never : "id" → "id" ✓
P = "name"   → "name" extends "age" | "email" ? never : "name" → "name" ✓
P = "age"    → "age" extends "age" | "email" ? never : "age" → never ✗
P = "email"  → "email" extends "age" | "email" ? never : "email" → never ✗

最终: { id: number; name: string }
```

### 示例 2: 只保留特定类型的属性

```typescript
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
};

type User = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};

type StringProps = OnlyStrings<User>;
// { name: string; email: string }
```

### 示例 3: 只保留可选属性

```typescript
type OptionalKeys<T> = {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K]
};

type Example = OptionalKeys<{ a: number; b?: string; c?: number }>;
// { b?: string; c?: number }
```

**原理：** `{}` 可以赋值给可选属性，但不能赋值给必填属性。

### 示例 4: 只保留函数类型的属性

```typescript
type OnlyMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
};

type User = {
  id: number;
  greet: () => void;
  update: (data: any) => void;
};

type Methods = OnlyMethods<User>;
// { greet: () => void; update: (data: any) => void }
```

### 示例 5: 排除特定前缀的键

```typescript
type RemovePrefix<T, P extends string> = {
  [K in keyof T as K extends `${P}${infer Rest}` ? Rest : K]: T[K]
};

type API = {
  getUser: () => void;
  postUser: () => void;
  deleteUser: () => void;
};

type WithoutPost = RemovePrefix<API, "post">;
// { getUser: () => void; User: () => void; deleteUser: () => void }
```

### 示例 6: 按类型过滤并排除

```typescript
// 排除所有 string 类型的属性
type OmitStrings<T> = {
  [K in keyof T as T[K] extends string ? never : K]: T[K]
};

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
};

type Result = OmitStrings<User>;
// { id: number; age: number; active: boolean }
```

### 示例 7: 提取 Getter 方法

```typescript
type Getters<T> = {
  [K in keyof T as K extends `get${infer Name}` ? K : never]: T[K]
};

type Service = {
  getData: () => string;
  getName: () => string;
  saveData: () => void;
  deleteData: () => void;
};

type ServiceGetters = Getters<Service>;
// { getData: () => string; getName: () => string }
```

---

## 对比：as vs Exclude

### 使用 Exclude

```typescript
type MyOmit1<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
};
```

**优点：**
- 语法简洁
- 易于理解

**缺点：**
- 无法实现复杂的过滤逻辑

### 使用 as + never

```typescript
type MyOmit2<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
};
```

**优点：**
- 更灵活，可以实现复杂条件
- 可以同时进行键转换和过滤
- 可以基于**值类型**过滤（Exclude 只能基于键）

**缺点：**
- 语法稍复杂

### 功能对比

| 需求 | Exclude | as + never |
|------|---------|------------|
| 按键名过滤 | ✅ | ✅ |
| 按值类型过滤 | ❌ | ✅ |
| 键转换 + 过滤 | ❌ | ✅ |
| 复杂条件判断 | ❌ | ✅ |

**示例：只有 as 能实现**

```typescript
// 只保留 string 类型的属性，并将键转为大写
type StringsToUppercase<T> = {
  [K in keyof T as T[K] extends string ? Uppercase<K & string> : never]: T[K]
};

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

type Result = StringsToUppercase<User>;
// { NAME: string; EMAIL: string }
```

---

## 实用组合示例

### 深度 Pick

```typescript
type DeepPick<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? { [P in Key]: DeepPick<T[P], Rest> }
    : never
  : Path extends keyof T
    ? { [P in Path]: T[P] }
    : never;

type User = {
  id: number;
  profile: {
    name: string;
    age: number;
    address: {
      city: string;
    };
  };
};

type Result = DeepPick<User, "profile.address.city">;
// { profile: { address: { city: string } } }
```

### 按模式过滤键

```typescript
// 只保留匹配模式的键
type FilterByPattern<T, P extends string> = {
  [K in keyof T as K extends P ? K : never]: T[K]
};

type API = {
  getUser: () => void;
  getUsers: () => void;
  createUser: () => void;
  deleteUser: () => void;
};

type GetOnly = FilterByPattern<API, `get${string}`>;
// { getUser: () => void; getUsers: () => void }
```

### 条件重命名

```typescript
type ConditionalRename<T, Condition, NewName> = {
  [K in keyof T as K extends Condition ? NewName : K]: T[K]
};

type Config = {
  apiUrl: string;
  apiKey: string;
  timeout: number;
};

type Renamed = ConditionalRename<Config, "apiUrl", "API_URL">;
// { API_URL: string; apiKey: string; timeout: number }
```

---

## 总结表格

| 用法 | 语法 | 示例效果 |
|------|------|----------|
| **键重命名** | `[K as NewKey]` | `name` → `NAME` |
| **添加前缀** | `[K as `${Prefix}${K}`]` | `name` → `user_name` |
| **条件过滤** | `[K as Cond ? never : K]` | 满足条件则删除 |
| **按类型过滤** | `[K as T[K] extends Type ? K : never]` | 只保留特定类型属性 |
| **提取模式匹配** | `[K as K extends Pattern ? K : never]` | 只保留匹配模式的键 |
| **条件重命名** | `[K as Cond ? NewKey : K]` | 满足条件则重命名 |

---

## 核心要点

1. **`as` 的本质**：在映射类型中转换键名
2. **`never` 的特性**：作为键时会被自动忽略
3. **灵活性**：`as` 比 `Exclude` 更强大，支持基于值类型的过滤
4. **组合使用**：可以结合模板字面量类型、条件类型等实现复杂逻辑
