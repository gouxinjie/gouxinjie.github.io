# 使用 Immer 处理深层次对象

## 一、immer 基础用法

**1、安装**

```ts
npm install immer

```

**2、使用**

```ts
import { produce } from "immer";
const data = {
  user: {
    name: "张三",
    age: 18
  }
};

// 使用 produce 创建新状态
const newData = produce(data, (draft) => {
  draft.user.age = 20; // 直接修改 draft
});

console.log(newData, data);
// 输出:
// { user: { name: '张三', age: 20 } }
// { user: { name: '张三', age: 18 } }
```

## 二、Zustand 中使用 Immer

```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ObjState {
  person: { name: string; age: number; sex: string };
  updateName: (name: string) => void;
  updateAge: (age: number) => void;
}

// 使用immer
export const useBearStore = create<ObjState>()(
  immer((set, get) => ({
    person: {
      name: "xinjie",
      age: 18,
      sex: "male"
    },
    // 不使用immer时更改兑现需要合并
    updateName: (name) => set((state) => ({ person: { ...state.person, name } })),
    // 使用immer 时可以直接更改
    updateAge: (age) =>
      set((state) => {
        state.person.age = age;
      })
  }))
);
```

## 三、Zustand 中使用持久化 persist

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string;
  setToken: (token: string) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: "",
      setToken: (token) => set({ token })
    }),
    {
      name: "auth-storage", // 存储键名
      storage: createJSONStorage(() => localStorage) // 使用localStorage
    }
  )
);
```

## 四、同时使用 persist 和 immer

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AuthState {
  token: string;
  userInfo: {
    name: string;
    roles: string[];
  };
  setToken: (token: string) => void;
  updateUserInfo: (info: Partial<AuthState["userInfo"]>) => void;
}

const useAuthStore = create(
  persist(
    immer<AuthState>((set) => ({
      token: "",
      userInfo: {
        name: "",
        roles: []
      },
      setToken: (token) => set({ token }),
      // 使用immer可以直接"修改"状态
      updateUserInfo: (info) =>
        set((state) => {
          state.userInfo = { ...state.userInfo, ...info };
        })
    })),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // 选择性持久化配置（可选）
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo
      })
    }
  )
);
```

**中间件顺序：**

`immer` 应该包裹在最内层<br/> `persist` 包裹在最外层<br/>

```ts
顺序：persist(immer(store))
```

## 五、Immer 原理

`immer` 利用了 ES6 的 `Proxy` 来实现对对象的代理，从而实现对对象的"修改"。
