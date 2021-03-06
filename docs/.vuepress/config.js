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
            collapsable: true,
            children: [
              "/react/basic/01-react-basic.md",
              "/react/basic/02-react-state.md",
              "/react/basic/03-react-high.md",
              "/react/basic/04-react-optimize.md",
              "/react/basic/05-react-hooks.md",
              "/react/basic/06-react-immutable.md",
              "/react/basic/07-react-source.md",
            ]
          },
          {
            title: "Fiber",
            path: "/react/fiber/",
            collapsable: true,
            children: [
              "/react/fiber/01-fiber.md",
              "/react/fiber/02-fiber.md",
            ]
          },
          {
            title: "react router",
            path: "/react/router/",
            collapsable: true,
            children: [
              "/react/router/01-router.md",
              "/react/router/02-router-connected.md",
            ]
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
            collapsable: true,
            children: [
              "/react/dva/01-dva.md",
              "/react/dva/02-dva-source.md",
            ]
          },
          {
            title: "umi",
            path: "/react/umi/",
            collapsable: true,
            children: [
              "/react/umi/01-umi.md",
            ]
          },
          {
            title: "组件",
            path: "/react/component/",
            collapsable: true,
            children: [
              "/react/component/upload.md",
              "/react/component/Tree.md"
            ]
          },
          {
            title: "面试",
            path: "/react/interview/",
            collapsable: true,
            children: [
              "/react/interview/01-basic-doc.md",
              "/react/interview/02-react-15.md",
              "/react/interview/toutiao.md",
              "/react/interview/m01-react-15.md"
            ]
          }
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
          {
            title: "2020版",
            path: "/webpack/2020/",
            collapsable: true,
            children: [
              "/webpack/2020/01-webpack-bundle.md",
              "/webpack/2020/02-webpack-flow.md",
              "/webpack/2020/03-webpack-loader.md",
              "/webpack/2020/04-webpack-tapable.md",
              "/webpack/2020/05-webpack-ast.md",
              "/webpack/2020/06-webpack-plugin.md",
              "/webpack/2020/07-webpack-hand.md",
              "/webpack/2020/08-webpack-HMR.md",
            ]
          },
          {
            title: "备份",
            path: "/webpack/backup/",
            collapsable: true,
            children: [
              "/webpack/backup/01-webpack-basic.md",
              "/webpack/backup/02-webpack-optimize.md",
              "/webpack/backup/03-webpack-file.md",
              "/webpack/backup/04-webpack-tapable.md",
              "/webpack/backup/05-webpack-ast.md",
              "/webpack/backup/06-webpack-source.md",
              "/webpack/backup/07-webpack-loader.md",
              "/webpack/backup/08-webpack-plugin.md",
              "/webpack/backup/09-webpack-hand.md",
              "/webpack/backup/10-webpack-prepare.md",
            ]
          },
        ]
      },
      {
        title: "flutter",
        path: "/flutter/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          "/flutter/m01-flutter.md"
        ]
      },
      {
        title: "interview",
        path: "/interview/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          {
            title: "基础",
            path: "/interview/basic/",
            collapsable: true,
            children: [
              "/interview/basic/01-interview.md",
              "/interview/basic/m01-interview.md",
            ]
          },
        ]
      },
      {
        title: "other",
        path: "/other/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          "/other/01-https.md",
          "/other/02-serverless.md",
          "/other/03-rbac.md",
          "/other/04-websocket.md",
          "/other/05-monitor.md",
          "/other/06-monitor-2.md",
          "/other/07-binary.md",
          "/other/08-binary-2.md"
        ]
      },
    ]
  }
}
