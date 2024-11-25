## 构建32位架构的安装包

1）rust 添加32位架构支持

```sh
rustup default 1.77.2
rustup target add i686-pc-windows-msvc
```

2）打包

```sh
# sidecar verge-mihomo-i686-pc-windows-msvc.exe
# sidecar verge-mihomo-x86_64-pc-windows-msvc.exe
pnpm run build --target i686-pc-windows-msvc
```

## 构建内嵌 webview 的 安装包

1）执行 Powershell 脚本，下载 webview

```ps1
# -Proxy "http://127.0.0.1:7890"
$ProgressPreference = 'SilentlyContinue'
invoke-webrequest -uri https://github.com/westinyang/WebView2RuntimeArchive/releases/download/109.0.1518.78/Microsoft.WebView2.FixedVersionRuntime.109.0.1518.78.x86.cab -outfile Microsoft.WebView2.FixedVersionRuntime.109.0.1518.78.x86.cab
Expand .\Microsoft.WebView2.FixedVersionRuntime.109.0.1518.78.x86.cab -F:* ./src-tauri
```

2）修改tauri 配置为 webview 配置，重新打包
