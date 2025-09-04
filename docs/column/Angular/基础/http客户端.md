# Angular HTTP 客户端 

`HTTP` 客户端是现代前端应用与后端服务通信的核心工具。`Angular` 提供了强大的`HttpClient`模块来处理所有 `HTTP` 请求。本文将全面介绍 Angular 中 `HTTP` 客户端的使用方法、最佳实践和高级技巧。

## 一、HttpClient 基础

### 1. 配置 HttpClient

首先需要在模块中导入`HttpClientModule`：

```typescript
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [HttpClientModule]
})
export class AppModule {}
```

然后在服务中注入`HttpClient`：

```typescript
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class DataService {
  constructor(private http: HttpClient) {}
}
```

### 2. 基本请求方法

`HttpClient` 提供了对应 `HTTP` 方法的快捷方式：

```typescript
// GET请求
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users');
}

// POST请求
addUser(user: User): Observable<User> {
  return this.http.post<User>('/api/users', user);
}

// PUT请求
updateUser(id: number, user: User): Observable<User> {
  return this.http.put<User>(`/api/users/${id}`, user);
}

// DELETE请求
deleteUser(id: number): Observable<void> {
  return this.http.delete<void>(`/api/users/${id}`);
}
```

## 二、请求和响应处理

### 1. 请求配置选项

可以传递配置对象作为最后一个参数：

```typescript
// 带查询参数的GET请求
searchUsers(term: string): Observable<User[]> {
  return this.http.get<User[]>('/api/users/search', {
    params: { q: term }
  });
}

// 自定义请求头
getProtectedData(): Observable<Data> {
  return this.http.get<Data>('/api/protected', {
    headers: {
      'Authorization': 'Bearer token'
    }
  });
}
```

### 2. 响应类型处理

`Angular` 会自动将 `JSON` 响应转换为 `JavaScript` 对象：

```typescript
// 获取完整响应（包括headers等）
getUserWithHeaders(id: number): Observable<HttpResponse<User>> {
  return this.http.get<User>(`/api/users/${id}`, {
    observe: 'response'
  });
}

// 获取响应文本（非JSON）
getPlainText(): Observable<string> {
  return this.http.get('/api/text', { responseType: 'text' });
}
```

## 三、错误处理

### 1. 基本错误捕获

```typescript
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('请求失败:', error.message);
      return throwError('发生错误，请重试');
    })
  );
}
```

### 2. 全局错误拦截器

创建自定义拦截器：

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = "";
        if (error.error instanceof ErrorEvent) {
          // 客户端错误
          errorMsg = `客户端错误: ${error.error.message}`;
        } else {
          // 服务端错误
          errorMsg = `服务端错误: ${error.status} - ${error.message}`;
        }
        console.error(errorMsg);
        return throwError(errorMsg);
      })
    );
  }
}
```

注册拦截器：

```typescript
@NgModule({
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }]
})
export class AppModule {}
```

## 四、高级特性

### 1. 请求拦截

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.auth.getToken();
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authToken}`)
    });
    return next.handle(authReq);
  }
}
```

### 2. 进度事件

```typescript
uploadFile(file: File): Observable<HttpEvent<any>> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post('/api/upload', formData, {
    reportProgress: true,
    observe: 'events'
  }).pipe(
    tap(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / (event.total || 1));
        console.log(`上传进度: ${percentDone}%`);
      }
    })
  );
}
```

### 3. 取消请求

```typescript
private cancelRequest = new Subject<void>();

search(term: string): Observable<Result[]> {
  // 取消之前的请求
  this.cancelRequest.next();

  return this.http.get<Result[]>('/api/search', {
    params: { q: term }
  }).pipe(
    takeUntil(this.cancelRequest)
  );
}
```

## 五、最佳实践

### 1. 服务封装模式

```typescript
@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getFullUrl(path: string): string {
    return `${this.apiUrl}/${path}`;
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.getFullUrl(path), { params });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.getFullUrl(path), body);
  }

  // 其他HTTP方法...
}
```

### 2. 类型安全 API

```typescript
interface UserApi {
  getUsers(): Observable<User[]>;
  getUser(id: number): Observable<User>;
  createUser(user: User): Observable<User>;
}

@Injectable({ providedIn: "root" })
export class UserService implements UserApi {
  private readonly basePath = "users";

  constructor(private api: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>(this.basePath);
  }

  getUser(id: number): Observable<User> {
    return this.api.get<User>(`${this.basePath}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.api.post<User>(this.basePath, user);
  }
}
```

### 3. 测试策略

```typescript
describe("UserService", () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // 验证没有未处理的请求
  });

  it("应该获取用户列表", () => {
    const mockUsers = [{ id: 1, name: "测试用户" }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne("api/users");
    expect(req.request.method).toBe("GET");
    req.flush(mockUsers);
  });
});
```

## 六、常见问题解答

**Q1: HttpClient 和传统的 Http 有什么区别？**

- HttpClient 是 Http 的升级版，提供更强大的功能
- 内置 JSON 解析
- 支持拦截器
- 类型化的响应
- 更好的错误处理机制

**Q2: 如何处理跨域请求(CORS)？**

- 服务端需要配置 CORS 头
- 开发环境可以配置代理
- 生产环境确保服务端支持跨域

**Q3: 如何上传文件？**

- 使用 FormData 对象
- 设置`Content-Type: multipart/form-data`
- 监听进度事件
