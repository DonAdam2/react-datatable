const protocol = process.env.HTTPS?.trim() === 'true' ? 'https' : 'http',
  openInBrowser = process.env.BROWSER?.trim() !== 'none';

module.exports = {
  port: 3000,
  protocol,
  devServer: `${protocol}://localhost`,
  openInBrowser,
  jestDirectory: 'jest',
  rootDirectory: 'src',
  buildToolsDirectory: 'buildTools',
  publicDirectory: 'public',
  outputDirectory: 'dist',
  environmentsDirectory: 'environments',
  jsSubDirectory: 'js/',
  cssSubDirectory: 'css/',
  isCssModules: false,
  metaInfo: {
    //displayed in search engines at the top of URL
    siteName: 'App site name',
    //max 60 (recommended)
    title: 'React datatable',
    //max 150 (recommended)
    description:
      'A sleek, responsive DataTable built with React and TypeScript, styled in SCSS, and perfect for modern web interfaces. This DataTable is a great foundation for admin dashboards, project managers, or any data-intensive React app.',
    keywords: 'add you keywords',
    twitterCardType: 'summary', //summary - summary_large_image - app
  },
};
