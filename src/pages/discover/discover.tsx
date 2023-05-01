import { View } from '@tarojs/components';
import {
  Divider,
  Icon,
  Image,
  Overlay,
  Tabs,
} from '@nutui/nutui-react-taro';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import './discover.scss';

const config = Taro.getStorageSync('config');

function Discover() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('design');

  const categories = [
    {
      title: '艺术',
      category: 'art',
      icon: 'photograph',
    },
    {
      title: '设计',
      category: 'design',
      icon: 'heart1',
    },
  ];
  const buildImageUrl = function (file: string, type: string) {
    return `http://assets.csn.chat/discover/${type}/${file}?1024`;
  };

  return (
    <View className="main">
      <Tabs
        value={category}
        autoHeight
        titleNode={() => {
          return categories.map(item => (
            <div
              onClick={() => setCategory(item.category)}
              className={`nut-tabs__titles-item ${
                category === item.category ? 'active' : ''
              }`}
              key={item.category}
              style={{ margin: '2px 4px' }}
            >
              {item.icon && <Icon name={item.icon} />}
              <span className="nut-tabs__titles-item__text" style={{ margin: '0 2px' }}>{item.title}</span>
              <span className="nut-tabs__titles-item__line" />
            </div>
          ));
        }}
      >
        {categories.map(categoryItem => (
          <Tabs.TabPane
            title={categoryItem.title}
            paneKey={categoryItem.category}
          >
            {(categoryItem.category === 'design'
              ? config.designs
              : config.arts
            ).map((configItem, index) => {
              return (
                <View className="work" key={index}>
                  {configItem.text && (
                    <View className="work-title">{configItem.text}</View>
                  )}
                  <Image
                    onClick={() => {
                      setShowOverlay(true);
                      setPrompt(configItem.prompt);
                      Taro.setClipboardData({
                        data: configItem.prompt,
                      });
                    }}
                    src={buildImageUrl(configItem.file, categoryItem.category)}
                    width="100vw"
                    height="100vw"
                    fit="cover"
                    alt={configItem.prompt}
                  />
                </View>
              );
            })}
          </Tabs.TabPane>
        ))}
      </Tabs>
      <Overlay
        visible={showOverlay}
        onClick={() => {
          setShowOverlay(false);
          setPrompt('');
        }}
      >
        <View className="overlay">
          <View className="prompt">
            <View className="prompt-title">提示词</View>
            <Divider />
            <View className="prompt-content">{prompt}</View>
            <Divider />
            <View className="prompt-footer">以上内容已拷贝至剪贴板</View>
          </View>
        </View>
      </Overlay>
    </View>
  );
}

export default Discover;
