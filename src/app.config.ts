export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/discover/discover',
    'pages/my/my',
  ],
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-fill.png'
      },
      {
        pagePath: 'pages/discover/discover',
        text: '发现',
        iconPath: 'assets/icons/discover.png',
        selectedIconPath: 'assets/icons/discover-fill.png'
      },
      {
        pagePath: 'pages/my/my',
        text: '我的',
        iconPath: 'assets/icons/my.png',
        selectedIconPath: 'assets/icons/my-fill.png'
      }
    ],
    color: '#000',
    selectedColor: '#2250d0',
    backgroundColor: '#fff',
    borderStyle: 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Artspell',
    navigationBarTextStyle: 'black'
  }
})
