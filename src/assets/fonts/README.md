# OG 分享图本地字体

`NotoSansSC-OG-Regular.otf` 是 `src/app/opengraph-image.tsx` 专用的本地中文字体，
用来替代 `@vercel/og` 在运行时去 Google Fonts 拉 Noto Sans SC 的行为（国内机房不可达
时会渲染成方框）。

## 字体信息

| 项 | 值 |
| --- | --- |
| 字体名 | Noto Sans SC Regular（子集） |
| 上游来源 | <https://github.com/googlefonts/noto-cjk/blob/main/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf> |
| 下载 URL | <https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf> |
| 许可 | SIL Open Font License 1.1（见同目录 `OFL.txt`） |
| 文件大小 | 1,973,536 bytes（约 1.9 MiB） |
| 是否子集化 | 是，7,836 个 glyph |
| SHA-256 | `6FB1A224B56BD1A59213902C91520D118CC1EA2EFA7285C138A5A9C03750F59C` |

## 子集范围

- **GB2312 全部 6,763 个汉字**（一级 + 二级），以及 GB2312 的符号区；
- ASCII（0x20–0x7E）、Latin-1、常用标点、全角字符、箭头/数学符号等；
- 合计请求 8,068 个码位，字体实际收录 7,846 个码位（7,836 glyph），
  其余 222 个是 Noto Sans SC 本身没有的码位（如部分空格、冷门符号）。

`charset.txt` 是生成时使用的完整字符集（UTF-8），可直接用于复现。

## 为什么是 OTF 而不是 WOFF2

`satori`（`@vercel/og` 的渲染器）不支持 WOFF2。实测把 WOFF2 传给 `ImageResponse`
会直接抛错：

```
Unsupported OpenType signature wOF2
```

因此这里使用字体容器为 OTF（CFF）的版本；`ImageResponse` 对 OTF 正常。

## 重新生成

子集是用 `fontkit` 的 `createSubset()` 生成的。生成脚本不随仓库发布（它依赖本机
DSH 运行时自带的 `fontkit`，不是本项目的依赖）。换字体或调整字符集时：

1. 下载上游 `NotoSansSC-Regular.otf`（8,331,336 bytes）；
2. 按 `charset.txt` 逐码位 `glyphForCodePoint(cp)`，把非 0 的 glyph id
   `includeGlyph()` 进 subset；
3. 用 subset 重新拼装 `head` / `hhea` / `hmtx` / `maxp` / `cmap` / `name` /
   `OS/2` / `post` / `CFF ` 表，输出 OTF。

## 注意

- 子集之外的生僻字仍可能触发 `@vercel/og` 的运行时补字：联网时正常，断网时仍是方框。
  需要覆盖更多字时，按上面的流程扩大 `charset.txt` 重新生成即可。
- `OFL.txt` 必须随字体一起分发（OFL 的要求），不要删除。
