const path = require('path')
const RSS = require('rss')
const chalk = require('chalk')

module.exports = (options, ctx) => {
  return {
    name: 'rss',

    generated () {
      const fs = require('fs-extra')
      const { pages, outDir, themeConfig, siteConfig } = ctx
      const { filter = () => true, count = 20, site_url, copyright } = options
      const year = themeConfig.startYear || new Date().getFullYear()
      const author = themeConfig.author || siteConfig.title || 'reco_luan'

      const feed = new RSS({
        title: siteConfig.title,
        description: siteConfig.description,
        feed_url: `${site_url}/rss.xml`,
        site_url,
        copyright: copyright || `${author} ${year}`,
        language: 'en'
      })

      pages
        .filter(page => {
          const { title, frontmatter: { home, publish }} = page
          return !(home == true || title == undefined || publish === false)
        })
        .filter(page => filter(page.frontmatter))
        .map(page => ({ ...page, date: new Date(page.frontmatter.date || '') }))
        .sort((a, b) => b.date - a.date)
        .map(page => ({
          title: page.title,
          description: page.excerpt,
          url: `${site_url}${page.path}`,
          categories: page.frontmatter.categories || [],
          author: page.frontmatter.author || themeConfig.author || siteConfig.title,
          date: page.date
        }))
        .slice(0, count)
        .forEach(page => feed.item(page))

      fs.writeFile(
        path.resolve(outDir, 'rss.xml'),
        feed.xml()
      )
      console.log(chalk.green.bold('RSS has been generated!'))
    }
  }
}
