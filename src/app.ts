import { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
// 全局样式
import './app.scss'
import Taro from '@tarojs/taro'

async function loadRemoteConfig() {
  const response = await new Promise((resolve, reject) => {
    Taro.request({
      url: 'https://assets.csn.chat/artspell.json?ts=' + Date.now(), // 避免缓存
      method: 'GET',
      success: resolve,
      fail: reject,
    });
  }) as any;

  if (response.statusCode === 200) {
    console.log('Loaded remote data', response.data)
    Taro.setStorageSync('config', response.data);
  } else {
    console.error('Failed to load remote data', response);
  }
}

loadRemoteConfig();

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  return props.children
}

export default App
