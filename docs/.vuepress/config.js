module.exports = {
  dest: 'dist',
  title: 'zhufeng',
  themeConfig: {
    editLinks: false,
    docsDir: 'docs',
    search: false,
    lastUpdated: "更新时间",
    nav: [],
    sidebar: [
      {
        title: "react",
        path: "/react/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          {
            title: "基础",
            path: "/react/basic/",
            collapsable: true
          },
          {
            title: "redux",
            path: "/react/redux/",
            collapsable: true
          },
          {
            title: "服务端渲染",
            path: "/react/ssr/",
            collapsable: true
          },
        ]
      },
      {
        title: "vue",
        path: "/vue/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          {
            title: "基础",
            path: "/vue/basic/",
            collapsable: true
          },
        ]
      }
    ]
  }
}
