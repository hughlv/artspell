import { View } from '@tarojs/components';
import { Divider, Image, Overlay } from '@nutui/nutui-react-taro';
import data from '../../../data/mj';
import './discover.scss';
import { useState } from 'react';
import Taro from '@tarojs/taro';

function Discover() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [prompt, setPrompt] = useState('');
  const buildImageUrl = function (file: string, type: string) {
    return `http://assets.csn.chat/discover/${type}/${file}`;
  };
  return (
    <View className="main">
      {data.designs.map((item, index) => {
        return (
          <View className="work" key={index}>
            <Image
              onClick={() => {
                setShowOverlay(true);
                setPrompt(item.prompt);
                Taro.setClipboardData({
                  data: item.prompt,
                  success: function () {}
                });
              }}
              src={buildImageUrl(item.file, 'design')}
              width="100vw"
              height="100vw"
              fit="cover"
              alt={item.prompt}
            />
          </View>
        );
      })}
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
