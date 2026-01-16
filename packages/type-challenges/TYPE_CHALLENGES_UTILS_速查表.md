# @type-challenges/utils 速查表

## 完整 API 列表

| 工具类型 | 类型签名 | 用途 |
|---------|---------|------|
| `Expect` | `<T extends true> = T` | 断言类型为 true |
| `ExpectTrue` | `<T extends true> = T` | 断言类型为 true (别名) |
| `ExpectFalse` | `<T extends false> = T` | 断言类型为 false |
| `IsTrue` | `<T extends true> = T` | 检查类型是否为 true |
| `IsFalse` | `<T extends false> = T` | 检查类型是否为 false |
| `Equal` | `<X, Y>` | 判断两个类型是否**完全相等** |
| `NotEqual` | `<X, Y>` | 判断两个类型是否**不相等** |
| `IsAny` | `<T>` | 检查类型是否为 `any` |
| `NotAny` | `<T>` | 确保类型**不是** `any` |
| `Alike` | `<X, Y>` | 检查类型是否相似 |
| `ExpectExtends` | `<VALUE, EXPECTED>` | 检查 EXPECTED 是否 extends VALUE |
| `ExpectValidArgs` | `<FUNC, ARGS>` | 验证参数是否匹配函数签名 |
| `UnionToIntersection` | `<U>` | 联合类型转交叉类型 |
| `Debug` | `<T>` | 展开类型便于调试 |
| `MergeInsertions` | `<T>` | 递归合并插入类型 |

---

## 按用途分类

### 🔍 类型断言
```typescript
Expect<T>           // 断言 T 为 true
ExpectTrue<T>       // 断言 T 为 true
ExpectFalse<T>      // 断言 T 为 false
```

### ⚖️ 类型比较
```typescript
Equal<X, Y>         // X === Y ?
NotEqual<X, Y>      // X !== Y ?
Alike<X, Y>         // X 类似 Y ?
```

### 🔎 类型检查
```typescript
IsAny<T>            // T 是 any ?
NotAny<T>           // T 不是 any
IsTrue<T>           // T 是 true ?
IsFalse<T>          // T 是 false ?
```

### 🔗 类型关系
```typescript
ExpectExtends<VALUE, EXPECTED>   // EXPECTED extends VALUE ?
ExpectValidArgs<FUNC, ARGS>      // ARGS 匹配 FUNC 的参数 ?
```

### 🛠️ 类型转换
```typescript
UnionToIntersection<U>    // 联合 → 交叉
Debug<T>                  // 展开类型
MergeInsertions<T>        // 合并插入类型
```

---

## 快速示例

### 基础测试模板
```typescript
import { Equal, Expect, NotAny } from "@type-challenges/utils";

type MyType = string;  // 你的类型实现

type cases = [
    Expect<NotAny<MyType>>,           // ✅ 防止 any
    Expect<Equal<MyType, string>>,    // ✅ 精确匹配
]
```

### Equal - 精确比较
```typescript
Expect<Equal<string, string>>          // ✅ true
Expect<Equal<{a:1}, {a:1}>>           // ✅ true
Expect<Equal<{a:1}, {readonly a:1}>>  // ❌ false (修饰符不同)
```

### ExpectExtends - 继承关系
```typescript
Expect<ExpectExtends<string, "hello">>   // ✅ "hello" extends string
Expect<ExpectExtends<number, 1>>         // ✅ 1 extends number
```

### UnionToIntersection - 联合转交叉
```typescript
type Result = UnionToIntersection<{a:1} | {b:2}>;  // {a:1} & {b:2}
```

---

## 使用场景速查

| 场景 | 使用工具 |
|-----|---------|
| 标准测试模板 | `Expect` + `Equal` + `NotAny` |
| 防止作弊 | `NotAny` |
| 精确类型匹配 | `Equal` |
| 忽略修饰符 | `Alike` |
| 测试继承关系 | `ExpectExtends` |
| 函数参数测试 | `ExpectValidArgs` |
| IDE 调试 | `Debug` |
