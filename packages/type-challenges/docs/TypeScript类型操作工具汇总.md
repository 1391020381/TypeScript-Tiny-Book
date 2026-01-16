# TypeScript 类型操作工具汇总

本文档汇总 TypeScript 中常用的类型操作工具，包括内置工具类型和核心语法。

---

## 目录

1. [获取相关](#1-获取相关)
2. [映射相关](#2-映射相关)
3. [属性修饰符](#3-属性修饰符)
4. [条件与推断](#4-条件与推断)
5. [模板字面量类型](#5-模板字面量类型)
6. [内置工具类型](#6-内置工具类型)

---

## 1. 获取相关

### keyof - 获取所有键

获取类型 `T` 所有属性键组成的联合类型。

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type UserKeys = keyof User;
// 等价于: "name" | "age" | "email"

// 作用于不同类型
type ArrayKeys = keyof string[];
// "number" | "length" | "push" | "pop" | ...

type PromiseKeys = keyof Promise<number>;
// "then" | "catch" | "finally" | ...
```

### T[K] - 索引访问类型

获取类型 `T` 中指定键 `K` 的类型。

```typescript
type User = {
  name: string;
  age: number;
  email: string;
};

type NameType = User["name"];
// string

type NameOrAge = User["name" | "age"];
// string | number

// 动态获取所有值的类型
type ValueOf<T> = T[keyof T];

type UserValues = ValueOf<User>;
// string | number
```

---

## 2. 映射相关

### in - 遍历联合类型

用于映射类型中遍历联合类型的每个成员。

```typescript
type Keys = "a" | "b" | "c";

type Obj = {
  [K in Keys]: string
};
// 等价于: { a: string; b: string; c: string }

// 结合 keyof 使用
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
};
```

### as - 键重命名/过滤

用于映射类型中重命名键或根据条件过滤键。

```typescript
// 1. 键重命名
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// 2. 过滤键 - 只保留特定类型的属性
type OnlyStringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
};

type User = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};

type StringProps = OnlyStringProperties<User>;
// { name: string; email: string }

// 3. 去除指定属性
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
};

type WithoutStrings = OmitByType<User, string>;
// { id: number; active: boolean }
```

---

## 3. 属性修饰符

### ? - 可选属性

将属性标记为可选。

```typescript
type User = {
  name?: string;  // 可选
  age: number;    // 必填
};

// 批量添加可选
type Partial<T> = {
  [P in keyof T]?: T[P]
};

type PartialUser = Partial<{ name: string; age: number }>;
// { name?: string; age?: number }
```

### -? - 移除可选

将可选属性变为必填。

```typescript
type User = {
  name: string;
  age?: number;
  email?: string;
};

type RequiredUser = Required<User>;
// { name: string; age: number; email: number }

// 手动实现
type MyRequired<T> = {
  [P in keyof T]-?: T[P]
};
```

### readonly - 只读属性

将属性标记为只读。

```typescript
type ReadonlyUser = {
  readonly id: number;
  readonly name: string;
};

// 批量添加只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
};
```

### -readonly - 移除只读

将只读属性变为可写。

```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
};

type User = {
  readonly id: number;
  name: string;
};

type MutableUser = Mutable<User>;
// { id: number; name: string }
```

---

## 4. 条件与推断

### extends - 条件类型

根据类型关系进行条件判断。

```typescript
// 基本语法: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;   // true
type B = IsString<number>;   // false

// 实际应用
type NonNullable<T> = T extends null | undefined ? never : T;

type C = NonNullable<string | null>;  // string
type D = NonNullable<null>;           // never

// 分配条件类型
type ToArray<T> = T extends any ? T[] : never;

type E = ToArray<string | number>;
// string[] | number[] (分配到每个成员)
```

### infer - 类型推断

在条件类型中推断类型变量。

```typescript
// 推断函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func = () => string;
type Result = ReturnType<Func>;  // string

// 推断 Promise 的值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type P = UnwrapPromise Promise<number>>;  // number

// 推推断数组的元素类型
type ElementType<T> = T extends (infer U)[] ? U : never;

type Arr = number[];
type Item = ElementType<Arr>;  // number

// 推断函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type Fn = (x: number, y: string) => boolean;
type Params = Parameters<Fn>;
// [number, string]
```

### typeof - 获取值的类型

从 JavaScript 值推断其类型。

```typescript
const user = {
  name: "Alice",
  age: 30,
};

type UserType = typeof user;
// { name: string; age: number }

// 结合 keyof
type UserKeys = keyof typeof user;
// "name" | "age"

// 函数类型
function greet(name: string): string {
  return `Hello ${name}`;
}

type GreetType = typeof greet;
// (name: string) => string
```

---

## 5. 模板字面量类型

使用模板字符串语法构建类型。

```typescript
// 基本用法
type World = "world";
type Greeting = `hello ${World}`;
// "hello world"

// 事件名称模式
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">;
// "onClick"

type MouseEvents = EventName<"mousedown" | "mouseup">;
// "onMousedown" | "onMouseup"

// 结合映射类型
type MakeGetters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
};

interface User {
  name: string;
  age: number;
}

type UserGetters = MakeGetters<User>;
// { getName: () => string; getAge: () => number }

// 内置字符串操作类型
type S = "hello";

type Uppercase = Uppercase<S>;      // "HELLO"
type Lowercase = Lowercase<S>;      // "hello"
type Capitalize = Capitalize<S>;    // "Hello"
type Uncapitalize = Uncapitalize<S>; // "hello"
```

---

## 6. 内置工具类型

### 结构操作

#### Partial<T> - 所有属性变为可选

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// 实现
type MyPartial<T> = {
  [P in keyof T]?: T[P]
};
```

#### Required<T> - 所有属性变为必填

```typescript
type User = {
  id: number;
  name?: string;
  email?: string;
};

type RequiredUser = Required<User>;
// { id: number; name: string; email: string }

// 实现
type MyRequired<T> = {
  [P in keyof T]-?: T[P]
};
```

#### Readonly<T> - 所有属性变为只读

```typescript
type User = {
  id: number;
  name: string;
};

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string }

// 实现
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
};
```

#### Pick<T, K> - 挑选指定属性

```typescript
type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

type UserInfo = Pick<User, "id" | "name">;
// { id: number; name: string }

// 实现
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
};
```

#### Omit<T, K> - 排除指定属性

```typescript
type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

type UserWithoutAge = Omit<User, "age">;
// { id: number; name: string; email: string }

// 实现
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

### 类型组合

#### Record<K, T> - 创建对象类型

```typescript
// 创建键值对类型
type PageInfo = {
  title: string;
};

type Page = "home" | "about" | "contact";

type Nav = Record<Page, PageInfo>;
// {
//   home: PageInfo;
//   about: PageInfo;
//   contact: PageInfo;
// }

// 实现
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
};
```

#### Exclude<T, U> - 从 T 排除 U

```typescript
type Union = "a" | "b" | "c";

type Result = Exclude<Union, "a">;
// "b" | "c"

// 实现
type MyExclude<T, U> = T extends U ? never : T;
```

#### Extract<T, U> - 从 T 提取 U

```typescript
type Union = "a" | "b" | "c";

type Result = Extract<Union, "a" | "c">;
// "a" | "c"

// 实现
type MyExtract<T, U> = T extends U ? T : never;
```

#### NonNullable<T> - 排除 null 和 undefined

```typescript
type Type = string | null | undefined;

type Result = NonNullable<Type>;
// string

// 实现
type MyNonNullable<T> = T extends null | undefined ? never : T;
```

### 函数相关

#### Parameters<T> - 获取函数参数类型

```typescript
type Fn = (x: number, y: string) => boolean;

type Params = Parameters<Fn>;
// [number, string]
```

#### ReturnType<T> - 获取函数返回值类型

```typescript
type Fn = (x: number) => string;

type Result = ReturnType<Fn>;
// string
```

#### ThisParameterType<T> - 获取 this 类型

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

type ThisType = ThisParameterType<typeof toHex>;
// Number
```

#### OmitThisParameter<T> - 移除 this 类型

```typescript
type Fn = (this: { x: number }, y: number) => void;

type WithoutThis = OmitThisParameter<Fn>;
// (y: number) => void
```

### 其他工具

#### Awaited<T> - 获取 Promise 的 resolve 类型

```typescript
type Result = Awaited<Promise<string>>;
// string

type Nested = Awaited<Promise<Promise<number>>>;
// number
```

#### Uppercase/Lowercase/Capitalize/Uncapitalize

```typescript
type A = Uppercase<"hello">;      // "HELLO"
type B = Lowercase<"HELLO">;      // "hello"
type C = Capitalize<"hello">;     // "Hello"
type D = Uncapitalize<"HELLO">;   // "hELLO"
```

---

## 实用组合示例

### 只读 + 挑选

```typescript
type User = {
  id: number;
  name: string;
  password: string;
  email: string;
};

// 公开用户信息（只读）
type PublicUser = Readonly<Pick<User, "id" | "name" | "email">>;
// { readonly id: number; readonly name: string; readonly email: string }
```

### 必填 + 排除

```typescript
type User = {
  id: number;
  name?: string;
  email?: string;
  password: string;
};

// 注册表单（排除 id 和 password，其余必填）
type RegisterForm = Required<Omit<User, "id" | "password">>;
// { name: string; email: string }
```

### 条件提取

```typescript
// 提取函数类型的属性
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

type User = {
  id: number;
  name: string;
  greet: () => void;
  update: (data: any) => void;
};

type Methods = FunctionPropertyNames<User>;
// "greet" | "update"
```

---

## 总结表格

| 类别 | 工具 | 作用 |
|------|------|------|
| **获取** | `keyof T` | 获取所有键的联合类型 |
| | `T[K]` | 获取指定键的类型 |
| **映射** | `in` | 遍历联合类型 |
| | `as` | 键重命名/过滤 |
| **修饰符** | `?` | 添加可选 |
| | `-?` | 移除可选 |
| | `readonly` | 添加只读 |
| | `-readonly` | 移除只读 |
| **条件** | `extends` | 条件判断 |
| | `infer` | 类型推断 |
| | `typeof` | 获取值类型 |
| **内置** | `Partial` | 全部可选 |
| | `Required` | 全部必填 |
| | `Readonly` | 全部只读 |
| | `Pick` | 挑选属性 |
| | `Omit` | 排除属性 |
| | `Record` | 创建对象 |
| | `Exclude` | 排除类型 |
| | `Extract` | 提取类型 |
| | `NonNullable` | 排除空值 |
| | `Parameters` | 获取参数 |
| | `ReturnType` | 获取返回值 |
