import { View } from '@tarojs/components';
import {
  Divider,
  Icon,
  Image,
  Overlay,
  Swiper,
  SwiperItem,
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
      title: '设计',
      category: 'design',
      icon: 'heart1',
    },
    {
      title: '艺术',
      category: 'art',
      icon: 'photograph',
    },
  ];
  const buildImageUrl = function (file: string, type: string) {
    return `http://assets.csn.chat/discover/${type}/${file}`;
  };
  return (
    <View className="main">
      <Tabs
        value={category}
        type="smile"
        titleNode={() => {
          return categories.map(item => (
            <div
              onClick={() => setCategory(item.category)}
              className={`nut-tabs__titles-item ${
                category === item.category ? 'active' : ''
              }`}
              key={item.category}
            >
              {item.icon && <Icon name={item.icon} />}
              <span className="nut-tabs__titles-item__text">{item.title}</span>
              <span className="nut-tabs__titles-item__line" />
            </div>
          ));
        }}
      ></Tabs>
      <Swiper
        paginationVisible={false}
        loop={false}
        isPreventDefault={false}
        initPage={categories.findIndex(obj => obj.category === category)}
        onChange={e => {
          setCategory(categories[e].category);
        }}
      >
        {categories.map(categoryItem => (
          <SwiperItem title={categoryItem.title} key={categoryItem.category}>
            {(categoryItem.category === 'design'
              ? config.designs
              : config.arts
            ).map((configItem, index) => {
              return (
                <View className="work" key={index}>
                  {configItem.text && <View className="work-title">{configItem.text}</View>}
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
          </SwiperItem>
        ))}
      </Swiper>
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
