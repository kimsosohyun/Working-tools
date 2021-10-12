# n6p-4hv1.0

## 项目安装
```
npm install
```

### 启动开发环境（连接YAPI）
```
npm run serve
```

### 启动开发环境（连接实际NVR设备）
#### 主要用于播放及测试视频流
注：.env.link2nvr文件中的VUE_APP_PROXY_URL变量的值必须与实际NVR设备的IP和端口一致
```
npm run serve:nvr
```

### 打包压缩项目
```
npm run build
```

### lint项目代码
```
npm run lint
```

## 请求方法使用

使用post方法与后台进行数据的交互

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
