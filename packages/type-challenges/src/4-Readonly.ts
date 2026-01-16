
/*
 * Readonly 工具类型实现
 *
 * 作用：将对象类型的所有属性变为只读
 *
 * 核心知识点：
 * 1. readonly - 只读修饰符，防止属性被重新赋值
 * 2. [K in keyof T] - 映射类型，遍历 T 的所有键
 * 3. T[K] - 索引访问类型，获取键 K 对应的值类型
 *
 * 示例：
 * type User = { name: string; age: number };
 * type ReadonlyUser = MyReadonly<User>;
 * // 等价于: { readonly name: string; readonly age: number }
 */
type MyReadonly<T> = {
    readonly [K in keyof T] : T[K]
}

/*
 * 对比：添加 vs 移除 readonly
 *
 * 添加 readonly（+readonly 或直接写 readonly）：
 * - 将属性变为只读，不可重新赋值
 *
 * 移除 readonly（-readonly）：
 * - 将只读属性变为可写，允许重新赋值
 *
 * 示例：
 * type User = { readonly id: number; name: string };
 *
 * // 移除 readonly
 * type MutableUser = MyMutable<User>;
 * // 等价于: { id: number; name: string }
 * // 现在 id 可以被重新赋值了
 */
type MyMutable<T> = {
    -readonly [K in keyof T] : T[K]
}

// 对象部分只读

type SomeReadonly<T, K extends keyof T> = {
  readonly [P in K]: T[P]
} & {
  [P in Exclude<keyof T, K>]: T[P]
};


type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>      // 递归：继续处理嵌套对象
    : T[P]                    // 终止：基本类型直接返回
};

type DeepReadonlyUser = {
  id: number;
  profile: {
    name: string;
    settings: {
      theme: string;
    };
  };
};

type Result = DeepReadonly<User>;
// {
//   readonly id: number;
//   readonly profile: {
//     readonly name: string;
//     readonly settings: {
//       readonly theme: string;
//     };
//   };
// }
