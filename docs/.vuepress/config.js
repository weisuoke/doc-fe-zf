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
              "/react/redux/手写Redux.md",
              "/react/redux/Redux中间件.md",
              "/react/redux/Redux-hooks.md",
              "/react/redux/Redux-saga.md",
              "/react/redux/Redux-saga-hand.md",
            ]
          },
          {
            title: "SSR",
            path: "/react/ssr/",
            collapsable: true,
            children: [
              "/react/ssr/ssr.md",
            ]
          },
          {
            title: "nextjs",
            path: "/react/nextjs/",
            collapsable: true,
            children: [
              "/react/nextjs/nextjs.md",
            ]
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
          {
            title: "组件",
            path: "/react/component/",
            collapsable: true,
            children: [
              "/react/component/Upload.md",
              "/react/component/Tree.md"
            ]
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
      },
      {
        title: "webpack",
        path: "/webpack/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          "/webpack/01-webpack-basic.md",
          "/webpack/02-webpack-optimize.md"
        ]
      },
    ]
  }
}
