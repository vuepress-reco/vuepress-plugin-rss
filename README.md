# @vuepress-reco/vuepress-plugin-rss

## Introduce

RSS plugin only for vuepress-theme-reco.

### Name

- **As plugin**: `@vuepress-reco/vuepress-plugin-rss`

## Usage

### site_url

- required: `true`
- description: 网站地址
- example: `https://vuepress-theme-reco.recoluan.com`

### copyright

- required: `true`
- description: 版权
- example: `reco_luan 2019`

### filter

- required: `false`
- description: 博客的过滤器
- example: `(frontmatter) => { return [true|false] }`

### count

- required: `false`
- description: 显示多少篇博客
- example: `20`