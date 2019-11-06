const path = require('path')
const RSS = require('rss')
const chalk = require('chalk')

module.exports = (options, ctx) => {
  return {
    name: 'rss',

    generated () {
      const fs = require('fs-extra')
      const { pages, sourceDir, outDir } = ctx
      const { filter = () => true, count = 20, site_url, copyright } = options
      const siteData = require(path.resolve(sourceDir, '.vuepress/config.js'))

      const feed = new RSS({
        title: siteData.title,
        description: siteData.description,
        feed_url: `${site_url}/rss.xml`,
        site_url,
        copyright: copyright || 'recoluan 2019',
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
          title: page.frontmatter.title,
          description: page.excerpt,
          url: `${site_url}${page.path}`,
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
