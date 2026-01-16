
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

type User = {
    name:string;
    age: number;
    email: string;
}

type UserPreview = MyPick<User,"name" | "age">