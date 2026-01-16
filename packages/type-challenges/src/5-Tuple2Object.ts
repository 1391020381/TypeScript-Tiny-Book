/*
 * ============================================================================
 * TupleToObject - 元组转对象
 * ============================================================================
 *
 * 作用：将元组类型转换为对象类型，键和值都是元组元素
 *
 * 示例：
 * const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
 * type result = TupleToObject<typeof tuple>
 * // { tesla: "tesla"; model 3: "model 3"; model X: "model X"; model Y: "model Y" }
 */

/* ------------------- 实现原理 ------------------- */

/*
 * type TupleToObject<T extends readonly any[]> = {
 *   [P in T[number]]: P
 * }
 *
 * 核心知识点：
 * 1. readonly any[] - 约束 T 必须是数组/元组类型（包括只读元组）
 * 2. T[number] - 获取元组所有元素的联合类型
 * 3. [P in Union] - 遍历联合类型，每个成员作为对象的键
 *
 * 工作流程：
 * 输入：readonly ["tesla", "model 3", "model X", "model Y"]
 *
 * 步骤 1: T[number]
 *   → "tesla" | "model 3" | "model X" | "model Y"
 *
 * 步骤 2: 遍历联合类型
 *   → {
 *       tesla: "tesla";
 *       "model 3": "model 3";
 *       "model X": "model X";
 *       "model Y": "model Y"
 *     }
 */

/* ------------------- 基本实现 ------------------- */

type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P
};

/* ------------------- 测试验证 ------------------- */

// 测试 1: 基本用法
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

type Result1 = TupleToObject<typeof tuple>;
// {
//   tesla: "tesla";
//   "model 3": "model 3";
//   "model X": "model X";
//   "model Y": "model Y"
// }

// 测试 2: 数字元组
type Numbers = TupleToObject<[1, 2, 3]>;
// { 1: 1; 2: 2; 3: 3 }

// 测试 3: 混合类型元组
type Mixed = TupleToObject<[1, "hello", true]>;
// { 1: 1; hello: "hello"; true: true }

// 测试 4: 空元组
type Empty = TupleToObject<[]>;
// {}

// 测试 5: 只读元组
type ReadonlyTest = TupleToObject<readonly ["a", "b"]>;
// { a: "a"; b: "b" }

/* ------------------- 运行时验证 ------------------- */

const result: Result1 = {
  tesla: "tesla",
  "model 3": "model 3",
  "model X": "model X",
  "model Y": "model Y"
};

console.log(result);
// { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y' }

/* ------------------- 进阶：键值映射 ------------------- */

/*
 * 如果想要键和值不同，可以添加映射函数
 */

// 键转为大写，值保持原样
type TupleToObjectUpperKeys<T extends readonly any[]> = {
  [P in T[number] as Uppercase<P & string>]: P
};

type TestUpper = TupleToObjectUpperKeys<["hello", "world"]>;
// { HELLO: "hello"; WORLD: "world" }

// 值转为布尔类型
type TupleToBooleanObject<T extends readonly any[]> = {
  [P in T[number]]: boolean
};

type TestBoolean = TupleToBooleanObject<["a", "b", "c"]>;
// { a: boolean; b: boolean; c: boolean }

/* ------------------- 进阶：嵌套元组 ------------------- */

// 展平嵌套元组后转换
type Flatten<T extends readonly any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

type Nested = Flatten<[[1, 2], [3, 4]]>;
// [1, 2, 3, 4]

type NestedObject = TupleToObject<Nested>;
// { 1: 1; 2: 2; 3: 3; 4: 4 }

/* ------------------- 实际应用场景 ------------------- */

// 场景 1: 枚举对象
type EnumObject<T extends readonly string[]> = TupleToObject<T>;

type StatusEnum = EnumObject<["pending", "success", "error"]>;
// { pending: "pending"; success: "success"; error: "error" }

const Status: StatusEnum = {
  pending: "pending",
  success: "success",
  error: "error"
};

// 场景 2: 常量映射
type Constants<T extends readonly (string | number)[]> = TupleToObject<T>;

type ApiEndpoints = Constants<["/users", "/posts", "/comments"]>;
// { "/users": "/users"; "/posts": "/posts"; "/comments": "/comments" }

// 场景 3: 类型安全的查找表
type LookupTable<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: any
};

const table: LookupTable<["key1", "key2", "key3"]> = {
  key1: { value: 1 },
  key2: { value: 2 },
  key3: { value: 3 }
};
