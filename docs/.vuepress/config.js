module.exports = {
  base: '/web-source/',
  title: 'lemonYo的成长点滴',
  description: '记录学习工作中的点点滴滴，感受自己的每一次成长',
  themeConfig: {
    editLinkText: '在 GitHub 上编辑此页',
    sidebarDepth: 2,
    sidebar: {
      '/base/': [
        '',
        'webpack',
        'ssh',
        'cli',
        'ui'
      ]
    },
    nav: [
      { text: 'js相关', link: 'https://lemonyo.github.io' },
      { text: 'css相关', link: 'https://lemonyo.github.io' },
      { text: 'webpack相关', link: 'https://lemonyo.github.io' },
      { text: 'vue and react', link: 'https://lemonyo.github.io' },
      { text: '小程序', link: 'https://lemonyo.github.io' },
      { text: 'node相关', link: 'https://lemonyo.github.io' },
      { text: 'webComponents', link: 'https://lemonyo.github.io' }
    ],
    repo: 'LemonYo/web-source',
    docsDir: 'docs',
    editLinks: true
  }

}

// {
//   title: '测试1',
//   collapsable: true,
//   children: [
//     'webpack',
//     'ssh',
//     'cli',
//     'ui'
//   ]
// }
