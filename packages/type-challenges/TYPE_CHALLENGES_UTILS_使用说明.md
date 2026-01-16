# @type-challenges/utils 使用说明

> TypeScript 类型体操挑战工具库 - 用于编写类型级别的单元测试

## 安装

```bash
pnpm add @type-challenges/utils
```

## 导入

```typescript
import { Equal, Expect, NotAny } from "@type-challenges/utils";
```

---

## API 详解

### 1. Expect

**类型**: `Expect<T extends true> = T`

断言类型 `T` 必须为 `true`，否则编译时报错。这是最基础的测试工具。

```typescript
type cases = [
    Expect<true>,   // ✅ 通过
    Expect<false>,  // ❌ 编译错误
]
```

---

### 2. ExpectTrue / ExpectFalse

**类型**:
```typescript
ExpectTrue<T extends true> = T
ExpectFalse<T extends false> = T
```

`ExpectTrue` 是 `Expect` 的别名，专门用于期望 `true` 值。
`ExpectFalse` 用于断言类型为 `false`。

```typescript
type cases = [
    ExpectTrue<true>,    // ✅ 通过
    ExpectFalse<false>,  // ✅ 通过
]
```

---

### 3. Equal

**类型**:
```typescript
Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
```

判断两个类型是否**完全相等**。这是类型比较的核心工具。

```typescript
type cases = [
    Expect<Equal<string, string>>,      // ✅ true
    Expect<Equal<number, string>>,      // ❌ false (编译错误)
    Expect<Equal<{a:1}, {a:1}>>,       // ✅ true
    Expect<Equal<{a:1}, {readonly a:1}>>, // ❌ false (readonly 修饰符不同)
]
```

> **原理**: 利用条件类型的逆变性来检测类型是否完全一致，包括修饰符（如 `readonly`）。

---

### 4. NotEqual

**类型**: `NotEqual<X, Y> = true extends Equal<X, Y> ? false : true`

判断两个类型是否**不相等**。

```typescript
type cases = [
    Expect<NotEqual<string, number>>,  // ✅ true
    Expect<NotEqual<string, string>>,  // ❌ false (编译错误)
]
```

---

### 5. IsAny / NotAny

**类型**:
```typescript
IsAny<T> = 0 extends (1 & T) ? true : false
NotAny<T> = true extends IsAny<T> ? false : true
```

检查类型是否为 `any`。

```typescript
type cases = [
    Expect<IsAny<any>>,           // ✅ true
    Expect<IsAny<string>>,        // ❌ false
    Expect<NotAny<string>>,       // ✅ true
    Expect<NotAny<any>>,          // ❌ false (编译错误)
]
```

> **使用场景**: 防止用户在类型挑战中直接写 `type Foo = any` 来"作弊"。

---

### 6. IsTrue / IsFalse

**类型**:
```typescript
IsTrue<T extends true> = T
IsFalse<T extends false> = T
```

检查类型是否为 `true` 或 `false`。

```typescript
type cases = [
    Expect<IsTrue<true>>,    // ✅ true
    Expect<IsFalse<false>>,  // ✅ true
]
```

---

### 7. Alike

**类型**: `Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>`

检查两个类型是否"相似"。与 `Equal` 不同，它会合并插入类型后再比较。

```typescript
type cases = [
    Expect<Alike<{a:1}, {a:1}>>,  // ✅ true
]
```

---

### 8. ExpectExtends

**类型**: `ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false`

检查 `EXPECTED` 是否继承自 `VALUE`（类型关系测试）。

```typescript
type cases = [
    Expect<ExpectExtends<string, "hello">>,  // ✅ true ("hello" extends string)
    Expect<ExpectExtends<1, number>>,        // ✅ true (1 extends number)
]
```

---

### 9. ExpectValidArgs

**类型**:
```typescript
ExpectValidArgs<FUNC extends (...args: any[]) => any, ARGS extends any[]> =
    ARGS extends Parameters<FUNC> ? true : false
```

验证参数数组是否匹配函数的参数类型。

```typescript
function greet(name: string, age: number): void {}

type cases = [
    Expect<ExpectValidArgs<typeof greet, [string, number]>>,  // ✅ true
    Expect<ExpectValidArgs<typeof greet, [string]>>,          // ❌ false
]
```

---

### 10. UnionToIntersection

**类型**:
```typescript
UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
```

将联合类型转换为交叉类型。

```typescript
type A = {a: string};
type B = {b: number};

type Union = A | B;                           // {a: string} | {b: number}
type Intersection = UnionToIntersection<Union>; // {a: string} & {b: number}
```

---

### 11. Debug

**类型**: `Debug<T> = { [K in keyof T]: T[K] }`

展开类型以便在 IDE 中调试查看。

```typescript
type MyType = Debug<{a: 1, b: 2}>;  // 在 IDE 中鼠标悬停可看到完整结构
```

---

## 完整示例

```typescript
import { Equal, Expect, NotAny, IsAny } from "@type-challenges/utils";

// 你的类型实现
type MyType = string;

// 测试用例
type cases = [
    // 确保 MyType 不是 any
    Expect<NotAny<MyType>>,

    // 确保 MyType 等于 string
    Expect<Equal<MyType, string>>,
]
```

## 常见测试模式

### 模式 1: 防止 any
```typescript
type cases = [
    Expect<NotAny<MyType>>,
]
```

### 模式 2: 精确类型匹配
```typescript
type cases = [
    Expect<Equal<MyType, {a: string; b: number}>>,
]
```

### 模型 3: 类型继承关系
```typescript
type cases = [
    Expect<ExpectExtends<string, MyType>>,
]
```

---

## 参考资料

- [Type Challenges 官方仓库](https://github.com/antfu/type-challenges)
- [IsAny 实现原理](https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360)
