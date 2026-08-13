const e=`# NgRx 核心概念详解

\`NgRx\` 是 \`Angular\` 生态中基于 \`Redux\` 模式的响应式状态管理库。理解它的核心概念是掌握 \`NgRx\` 的第一步。

> 说明：本文示例中的 \`User\`、\`Product\` 等业务模型类型已省略定义，读者可替换为项目中实际的实体接口。

## 一、NgRx 的三大原则

\`NgRx\` 遵循 \`Redux\` 的三大原则：

1. **单一数据源**：整个应用状态存储在一个 \`Store\` 对象树中
2. **状态只读**：唯一改变状态的方式是派发（dispatch）\`Action\`
3. **纯函数修改**：\`Reducer\` 是纯函数，接收旧状态和 \`Action\`，返回新状态

## 二、单向数据流

\`NgRx\` 的数据流是严格的**单向**的：

\`\`\`mermaid
flowchart LR
    A[组件 dispatch Action] --> B[Reducer 处理]
    B --> C[更新 Store 状态]
    C --> D[Selector 选择状态]
    D --> E[组件订阅并渲染]
    E --> A
\`\`\`

## 三、五大核心组成

### 1. Store

\`Store\` 是全局状态的容器，提供状态访问和派发 \`Action\` 的接口：

\`\`\`typescript
import { Store } from "@ngrx/store";

export class SomeComponent {
  constructor(private store: Store) {}

  doSomething() {
    this.store.dispatch(loadUsers()); // 派发 action
    this.store.select(selectUsers).subscribe(); // 订阅状态
  }
}
\`\`\`

### 2. Action

\`Action\` 是描述「发生了什么」的事件对象，包含 \`type\` 和可选的 \`payload\`：

\`\`\`typescript
import { createAction, props } from "@ngrx/store";

// 无载荷
export const loadUsers = createAction("[Users] Load Users");

// 带载荷
export const loadUsersSuccess = createAction("[Users] Load Users Success", props<{ users: User[] }>());

// 带错误
export const loadUsersFailure = createAction("[Users] Load Users Failure", props<{ error: string }>());
\`\`\`

> 命名规范：\`[来源] 动作描述\`，如 \`[Users] Load Users\`，便于在 DevTools 中追踪。

### 3. Reducer

\`Reducer\` 是**纯函数**，接收当前状态和 \`Action\`，返回新状态（不可变）：

\`\`\`typescript
import { createReducer, on } from "@ngrx/store";
import * as UserActions from "./user.actions";

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
\`\`\`

### 4. Selector

\`Selector\` 用于从 \`Store\` 中提取特定状态片段，支持组合和缓存（memoized）：

\`\`\`typescript
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducer";

// 特性选择器：定位到 user 特性状态
export const selectUserState = createFeatureSelector<UserState>("users");

// 基础选择器
export const selectAllUsers = createSelector(selectUserState, (state) => state.users);
export const selectLoading = createSelector(selectUserState, (state) => state.loading);

// 组合选择器（可复用其他选择器）
export const selectActiveUsers = createSelector(selectAllUsers, (users) => users.filter((u) => u.active));
\`\`\`

> \`createSelector\` 是 **memoized** 的，只有当输入状态变化时才重新计算，性能好。

### 5. Effect

\`Effect\` 处理**副作用**（如 API 调用、路由跳转），基于 \`RxJS\`：

\`\`\`typescript
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";
import * as UserActions from "./user.actions";
import { UserService } from "./user.service";

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers), // 监听指定 action
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}
\`\`\`

## 四、注册与使用

### 1. 注册 Store 和 Effects

\`\`\`typescript
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { userReducer } from "./user.reducer";
import { UserEffects } from "./user.effects";

@NgModule({
  imports: [
    StoreModule.forRoot({ users: userReducer }),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }) // 调试工具
  ]
})
export class AppModule {}
\`\`\`

### 2. 组件中使用

\`\`\`typescript
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as UserActions from "./user.actions";
import { selectAllUsers, selectLoading } from "./user.selectors";

@Component({
  selector: "app-user-list",
  template: \`
    <div *ngIf="loading$ | async">加载中...</div>
    <ul>
      <li *ngFor="let user of users$ | async">{{ user.name }}</li>
    </ul>
  \`
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]> = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectLoading);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }
}
\`\`\`

## 五、核心概念关系总结

| 概念       | 职责                       | 关键点                           |
| ---------- | -------------------------- | -------------------------------- |
| \`Store\`    | 状态容器                   | 单一数据源、dispatch、select     |
| \`Action\`   | 描述事件                   | \`createAction\`、type + payload   |
| \`Reducer\`  | 状态变更                   | 纯函数、不可变、\`createReducer\`  |
| \`Selector\` | 状态查询                   | \`createSelector\`、memoized       |
| \`Effect\`   | 副作用处理                 | \`createEffect\`、基于 RxJS        |

## 六、常见问题解答

**Q1：Reducer 为什么必须是纯函数？**

- 纯函数保证「同样的输入必有同样的输出」，使得状态可预测、可回溯（时间旅行调试）、可测试。

**Q2：为什么不能直接在 Effect 里改状态？**

- 状态变更必须通过 dispatch Action → Reducer 的单向流程，保证数据流清晰可控，便于追踪和调试。

**Q3：什么时候用 Effect，什么时候直接在组件里发请求？**

- 涉及**全局状态**、需要**多个组件共享结果**或**复杂副作用**时用 Effect；纯组件局部数据可直接在组件中请求。

**Q4：Selector 为什么能提升性能？**

- \`createSelector\` 会缓存结果，只有输入状态引用变化时才重新计算，避免每次变更检测都重复计算。
`;export{e as default};
