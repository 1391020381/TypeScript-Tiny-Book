# Pick 工具类型详解

## 定义

```typescript
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
```

**作用**: 从类型 `T` 中**挑选**一组属性 `K`，构造一个新的类型。

---

## 基础用法

### 示例 1: 挑选单个属性

```typescript
type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

// 只挑选 id 和 name
type UserInfo = Pick<User, "id" | "name">;
// 等价于:
// type UserInfo = {
//   id: number;
//   name: string;
// }

const user: UserInfo = {
  id: 1,
  name: "Alice",
  // age: 20,      // ❌ 不能有 age
  // email: ""     // ❌ 不能有 email
};
```

### 示例 2: 挑选多个属性

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
};

// 商品摘要信息
type ProductSummary = Pick<Product, "id" | "name" | "price">;

const summary: ProductSummary = {
  id: 1,
  name: "Laptop",
  price: 999
};
```

---

## 类型参数说明

| 参数 | 含义 | 约束 |
|-----|------|------|
| `T` | 源类型 | 必须是对象类型 |
| `K` | 要挑选的属性名 | 必须是 `keyof T` 的子类型 |

---

## 实现原理

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]  // 遍历 K 中的每个属性 P，获取 T[P] 的类型
}
```

1. **`K extends keyof T`**: 确保 `K` 中的每个键都是 `T` 的属性
2. **`[P in K]`**: 映射类型，遍历 `K` 中的每个属性
3. **`T[P]`**: 索引访问类型，获取属性 `P` 在 `T` 中的类型

---

## 常见使用场景

### 场景 1: 函数返回值 - 只返回部分字段

```typescript
type User = {
  id: number;
  name: string;
  password: string;  // 敏感信息
  email: string;
};

// 公开的用户信息（不包含密码）
type PublicUser = Pick<User, "id" | "name" | "email">;

function getPublicUser(user: User): PublicUser {
  const { password, ...publicInfo } = user;
  return publicInfo;
}

const user: User = {
  id: 1,
  name: "Alice",
  password: "secret123",
  email: "alice@example.com"
};

console.log(getPublicUser(user));  // { id: 1, name: "Alice", email: "..." }
```

### 场景 2: 函数参数 - 限制接收的字段

```typescript
type UpdateUserDTO = Pick<User, "name" | "email">;

function updateUser(id: number, data: UpdateUserDTO) {
  // 只能更新 name 和 email，不能更新 id
  console.log(`Updating user ${id}:`, data);
}

updateUser(1, { name: "Bob", email: "bob@example.com" });
// updateUser(1, { id: 2 });  // ❌ id 不在 UpdateUserDTO 中
```

### 场景 3: 表单数据模型

```typescript
type UserProfile = {
  id: number;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;
};

// 编辑表单只需要可编辑的字段
type ProfileForm = Pick<UserProfile, "username" | "bio" | "location" | "website">;

const form: ProfileForm = {
  username: "alice",
  bio: "Hello!",
  location: "Beijing",
  website: "https://example.com"
};
```

### 场景 4: API 响应类型

```typescript
type FullUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  internalNotes: string;  // 内部使用
  lastLogin: Date;
};

// 列表接口只返回基本信息
type UserListItem = Pick<FullUser, "id" | "name" | "email">;

// 详情接口返回更多信息
type UserDetail = Pick<FullUser, "id" | "name" | "email" | "phone" | "address">;
```

---

## 与其他工具类型的对比

### Pick vs Omit

```typescript
type User = { id: number; name: string; age: number; email: string };

// Pick - 挑选要保留的
type Picked = Pick<User, "id" | "name">;
// 结果: { id: number; name: string }

// Omit - 排除不要的
type Omitted = Omit<User, "age" | "email">;
// 结果: { id: number; name: string }

// Picked<User, "id" | "name">  等价于  Omit<User, "age" | "email">
```

### Pick vs Partial

```typescript
type User = { id: number; name: string; age: number };

// Pick - 只保留指定属性，属性保持原有可选性
type Picked = Pick<User, "id" | "name">;
// 结果: { id: number; name: string }

// Partial - 所有属性变为可选
type PartialUser = Partial<User>;
// 结果: { id?: number; name?: string; age?: number }

// 结合使用
type PartialPicked = Partial<Pick<User, "id" | "name">>;
// 结果: { id?: number; name?: string }
```

### Pick vs Required

```typescript
type User = {
  id: number;
  name?: string;
  email?: string;
};

// 挑选并确保必填
type RequiredPick = Required<Pick<User, "name" | "email">>;
// 结果: { name: string; email: string }
```

---

## 高级用法

### 动态 Pick

```typescript
type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

// 动态选择属性
type Keys = "name" | "email";
type DynamicPick = Pick<User, Keys>;
// 结果: { name: string; email: string }
```

### 条件 Pick

```typescript
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
};

type User = {
  id: number;
  name: string;
  age: number;
  email: string;
  active: boolean;
};

// 只挑选 string 类型的属性
type StringProps = PickByType<User, string>;
// 结果: { name: string; email: string }
```

### 深度 Pick

```typescript
type DeepPick<T, K extends string> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? { [P in Key]: DeepPick<T[P], Rest> }
    : never
  : K extends keyof T
    ? { [P in K]: T[P] }
    : never;

type User = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

type DeepPicked = DeepPick<User, "profile.name">;
// 结果: { profile: { name: string } }
```

---

## 类型挑战练习

### 练习 1: 实现 Pick

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
};

// 测试
type Test = MyPick<{ a: 1; b: 2 }, "a">;  // { a: 1 }
```

### 练习 2: Pick 可选属性

```typescript
type PickOptional<T> = {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K]
};

type Test = PickOptional<{ a: number; b?: string }>;
// 结果: { b?: string }
```

---

## 实战案例：用户管理系统

```typescript
// 完整用户类型
type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  avatar: string;
  bio: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
};

// 注册表单
type RegisterForm = Pick<User, "username" | "password" | "email">;

// 登录表单
type LoginForm = Pick<User, "username" | "password">;

// 个人资料编辑
type ProfileEditForm = Pick<User, "avatar" | "bio">;

// 用户列表展示
type UserListItem = Pick<User, "id" | "username" | "avatar" | "role" | "createdAt">;

// 管理员视图
type AdminUserView = Pick<User, "id" | "username" | "email" | "role" | "lastLoginAt">;

// 使用示例
function register(data: RegisterForm): void {
  // 只接收 username, password, email
  console.log("注册:", data);
}

function getUserList(): UserListItem[] {
  // 返回精简的用户列表
  return [];
}
```

---

## 总结

| 特性 | 说明 |
|-----|------|
| **作用** | 从对象类型中挑选指定属性 |
| **语法** | `Pick<T, K>` |
| **反向工具** | `Omit<T, K>` |
| **常见组合** | `Pick + Partial`, `Pick + Required` |
| **使用场景** | 函数参数、返回值、API 响应、表单模型 |
