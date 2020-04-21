module.exports = {
  dest: 'dist',
  title: '珠峰架构',
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
            title: "react router",
            path: "/react/router/",
            collapsable: true
          },
          {
            title: "redux",
            path: "/react/redux/",
            collapsable: true,
            sidebarDepth: 2,
            children: [
              "/react/redux/手写Redux.md"
            ]
          },
          {
            title: "服务端渲染",
            path: "/react/ssr/",
            collapsable: true
          },
          {
            title: "nextjs",
            path: "/react/nextjs/",
            collapsable: true
          },
          {
            title: "dva",
            path: "/react/dva/",
            collapsable: true
          },
          {
            title: "umi",
            path: "/react/umi/",
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
