const e=`# NgRx Entity、路由状态与 ComponentStore

除了核心的 \`Store\`/\`Action\`/\`Reducer\`，\`NgRx\` 生态还提供了 \`@ngrx/entity\`、\`@ngrx/router-store\`、\`@ngrx/component-store\` 等工具，分别解决实体集合管理、路由状态同步和轻量局部状态问题。

## 一、@ngrx/entity：管理实体集合

当状态中需要管理「实体集合」（如用户列表、商品列表）时，\`@ngrx/entity\` 能显著减少样板代码，提供标准的 CRUD 操作。

### 1. 为什么需要 Entity

普通方式管理列表需要手写查找、更新、删除逻辑，且每次都要保证不可变性：

\`\`\`typescript
// ❌ 手写方式，繁琐易错
on(updateUser, (state, { user }) => ({
  ...state,
  users: state.users.map((u) => (u.id === user.id ? user : u))
}));
\`\`\`

\`@ngrx/entity\` 用 \`id\` 为键、以字典形式存储实体，提供标准操作：

### 2. 定义 Entity 状态

\`\`\`typescript
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { User } from "./user.model";
import * as UserActions from "./user.actions";

// 创建适配器
export const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id // 指定主键（默认就是 id）
});

// 状态继承 EntityState
export interface UserState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

// 初始状态用 adapter 生成
export const initialState: UserState = userAdapter.getInitialState({
  loading: false,
  error: null
});
\`\`\`

### 3. 使用 adapter 的 CRUD

\`\`\`typescript
export const userReducer = createReducer(
  initialState,

  // 添加一个实体
  on(UserActions.addUser, (state, { user }) => userAdapter.addOne(user, state)),

  // 添加多个
  on(UserActions.loadUsersSuccess, (state, { users }) => userAdapter.setAll(users, state)),

  // 更新一个
  on(UserActions.updateUser, (state, { update }) => userAdapter.updateOne(update, state)),

  // 删除一个
  on(UserActions.deleteUser, (state, { id }) => userAdapter.removeOne(id, state))
);
\`\`\`

### 4. 使用 adapter 的 Selector

\`\`\`typescript
import { createSelector } from "@ngrx/store";

// 使用 adapter 内置选择器
const { selectAll, selectEntities, selectIds, selectTotal } = userAdapter.getSelectors();

export const selectUserState = createFeatureSelector<UserState>("users");

export const selectAllUsers = createSelector(selectUserState, selectAll);
export const selectUserEntities = createSelector(selectUserState, selectEntities);
export const selectUserTotal = createSelector(selectUserState, selectTotal);
\`\`\`

### 5. adapter 常用方法

| 方法              | 作用                       |
| ----------------- | -------------------------- |
| \`addOne\`          | 添加一个实体               |
| \`addMany\`         | 添加多个实体               |
| \`setOne\`          | 设置/替换一个实体          |
| \`setAll\`          | 替换所有实体               |
| \`updateOne\`       | 更新一个实体               |
| \`updateMany\`      | 更新多个实体               |
| \`removeOne\`       | 删除一个实体               |
| \`removeMany\`      | 删除多个实体               |
| \`removeAll\`       | 删除所有实体               |
| \`upsertOne\`       | 存在则更新，不存在则添加   |

## 二、@ngrx/router-store：路由状态同步

\`@ngrx/router-store\` 将 \`Angular Router\` 的状态同步到 \`NgRx\` Store，让路由状态也成为可订阅、可追溯的一部分。

### 1. 安装与注册

\`\`\`bash
ng add @ngrx/router-store
\`\`\`

\`\`\`typescript
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";

@NgModule({
  imports: [
    StoreModule.forRoot({ router: routerReducer }),
    StoreRouterConnectingModule.forRoot()
  ]
})
export class AppModule {}
\`\`\`

### 2. 使用路由状态

\`\`\`typescript
import { selectRouteParam, selectQueryParam, selectUrl } from "@ngrx/router-store";

@Component({ ... })
export class DetailComponent {
  // 获取路由参数 id
  productId$ = this.store.select(selectRouteParam("id"));

  // 获取查询参数
  category$ = this.store.select(selectQueryParam("category"));

  // 获取当前 URL
  url$ = this.store.select(selectUrl());
}
\`\`\`

### 3. 自定义序列化器

默认会序列化整个路由快照，可能过大。可以自定义序列化器只保留需要的数据：

\`\`\`typescript
import { RouterStateSerializer } from "@ngrx/router-store";
import { RouterStateSnapshot, Params } from "@angular/router";

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const { url } = routerState;
    const { params } = route;
    const { queryParams } = routerState.root;
    return { url, params, queryParams };
  }
}
\`\`\`

## 三、@ngrx/component-store：轻量局部状态

当应用状态**不需要全局共享**时，\`ComponentStore\` 提供比完整 \`NgRx\` 更轻量的选择，适合管理单个组件（及其子树）的局部状态。

### 1. 安装

\`\`\`bash
ng add @ngrx/component-store
\`\`\`

### 2. 创建 ComponentStore

\`\`\`typescript
import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { switchMap } from "rxjs/operators";
import { UsersService } from "./users.service";

interface UsersState {
  users: User[];
  loading: boolean;
}

@Injectable()
export class UsersStore extends ComponentStore<UsersState> {
  // 只读选择器
  readonly users$ = this.select((state) => state.users);
  readonly loading$ = this.select((state) => state.loading);

  constructor(private usersService: UsersService) {
    super({ users: [], loading: false });
  }

  // 更新状态的方法（updater）
  readonly addUser = this.updater((state, user: User) => ({
    ...state,
    users: [...state.users, user]
  }));

  // 副作用方法（effect）
  readonly loadUsers = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        this.patchState({ loading: true });
        return this.usersService.getUsers().pipe(
          tapResponse(
            (users) => this.patchState({ users, loading: false }),
            (error) => this.patchState({ loading: false })
          )
        );
      })
    )
  );
}
\`\`\`

### 3. 在组件中使用

\`\`\`typescript
@Component({
  selector: "app-users",
  providers: [UsersStore], // 组件级提供，跟随组件生命周期
  template: \`
    <div *ngIf="store.loading$ | async">加载中...</div>
    <ul>
      <li *ngFor="let user of store.users$ | async">{{ user.name }}</li>
    </ul>
    <button (click)="store.loadUsers()">加载</button>
  \`
})
export class UsersComponent {
  constructor(public store: UsersStore) {}
}
\`\`\`

> 关键：\`ComponentStore\` 在 \`providers\` 中声明，跟随组件生命周期，组件销毁时自动释放状态，天然避免内存泄漏。

## 四、三种方案对比

| 方案               | 适用场景                     | 复杂度 | 状态范围       |
| ------------------ | ---------------------------- | ------ | -------------- |
| 完整 NgRx Store    | 大量全局共享状态             | 高     | 全局           |
| @ngrx/entity       | 全局实体集合管理（配合 Store）| 中     | 全局（局部实体）|
| @ngrx/router-store | 需要路由状态参与业务         | 中     | 全局（路由）   |
| ComponentStore     | 组件局部状态                 | 低     | 组件/子树      |

## 五、常见问题解答

**Q1：Entity 和普通数组状态怎么选？**

- 有明确 \`id\` 的实体集合、需要频繁增删改查 → 用 \`@ngrx/entity\`（代码少、性能好、内置选择器）
- 简单的非实体数据（如单个配置对象）→ 普通状态即可

**Q2：什么时候用 ComponentStore 而不是完整 NgRx？**

- 状态只在单个组件或局部子树内使用、不需要跨组件全局共享时，\`ComponentStore\` 更轻量、样板代码更少。

**Q3：router-store 有什么用？**

- 让路由状态进入 Store 统一管理，可用 \`selectRouteParam\` 等选择器订阅，配合 \`Effect\` 实现「路由变化触发副作用」（如进入详情页自动加载数据）。
`;export{e as default};
