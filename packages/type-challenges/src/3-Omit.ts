/*
 * ============================================================================
 * Exclude 工具类型
 * ============================================================================
 *
 * 作用：从联合类型 T 中排除 U 的类型
 *
 * 语法：Exclude<T, U>
 * - T: 源联合类型
 * - U: 要排除的类型
 */

/* ------------------- 使用示例 ------------------- */

// 基本用法：从联合类型中排除某个类型
type A = Exclude<"a" | "b" | "c", "a">;
// 等价于: "b" | "c"

// 排除多个类型
type B = Exclude<"a" | "b" | "c" | "d", "a" | "b">;
// 等价于: "c" | "d"

// 排除字面量类型
type C = Exclude<string | number | boolean, string>;
// 等价于: number | boolean

// 排除 null 和 undefined
type D = Exclude<string | null | undefined, null | undefined>;
// 等价于: string

/* ------------------- 实现原理 ------------------- */

/*
 * Exclude 的实现原理：
 *
 * type Exclude<T, U> = T extends U ? never : T;
 *
 * 核心知识点：
 * 1. extends - 条件类型判断
 * 2. 分配条件类型 (Distributive Conditional Types)
 * 3. never - 表示不可能的类型
 *
 * 工作流程：
 * - 当 T 是联合类型时，TypeScript 会"分配"到每个成员
 * - 对每个成员单独执行 T extends U ? never : T
 * - 如果成员 extends U，返回 never（被排除）
 * - 如果成员不 extends U，返回该成员（保留）
 * - 最终所有返回值组成新的联合类型（never 会被忽略）
 *
 * 示例推导：
 * Exclude<"a" | "b" | "c", "a">
 *
 * 分配为：
 * - "a" extends "a" ? never : "a"  → never
 * - "b" extends "a" ? never : "b"  → "b"
 * - "c" extends "a" ? never : "c"  → "c"
 *
 * 最终结果：never | "b" | "c" → "b" | "c"
 */

// 手动实现 Exclude
type MyExclude<T, U> = T extends U ? never : T;

/* ------------------- 测试验证 ------------------- */

// 测试 1：排除单个类型
type Test1 = MyExclude<"a" | "b" | "c", "a">;  // "b" | "c"

// 测试 2：排除多个类型
type Test2 = MyExclude<"a" | "b" | "c" | "d", "a" | "b">;  // "c" | "d"

// 测试 3：排除基本类型
type Test3 = MyExclude<string | number | boolean, string>;  // number | boolean

// 测试 4：排除 null
type Test4 = MyExclude<string | null, null>;  // string

// 测试 5：与内置 Exclude 对比
type Builtin = Exclude<"a" | "b", "a">;      // "b"
type My = MyExclude<"a" | "b", "a">;         // "b"
// 两者完全相同

/* ------------------- 实际应用场景 ------------------- */

// 场景 1：排除函数签名中的某些重载
type EventPayloads =
  | { type: "click"; x: number; y: number }
  | { type: "keydown"; key: string }
  | { type: "keyup"; key: string };

// 只保留键盘事件
type KeyboardEvents = Exclude<EventPayloads, { type: "click" }>;
// { type: "keydown"; key: string } | { type: "keyup"; key: string }

// 场景 2：排除 null 和 undefined
type MyNonNullable<T> = Exclude<T, null | undefined>;

type E = MyNonNullable<string | null | undefined>;
// string

// 场景 3：排除特定的字面量值
type Status = "pending" | "success" | "error" | "loading";

// 排除 transient 状态
type StableStatus = Exclude<Status, "pending" | "loading">;
// "success" | "error"

// 场景 4：结合 keyof 使用
type MyUser = {
  id: number;
  name: string;
  password: string;
  email: string;
};

type PublicKeys = Exclude<keyof MyUser, "password">;
// "id" | "name" | "email"


type MyOmit<T,K extends keyof T> = {
    [P in MyExclude<keyof T ,K>] : T[P]
}