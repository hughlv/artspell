import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import {
  Image,
  Input,
  Grid,
  GridItem,
  Sticky,
  Toast,
  Collapse,
  CollapseItem,
  Range,
TextArea,
} from '@nutui/nutui-react-taro';
import './index.scss';
import data from '../../../data/mj';
import Taro from '@tarojs/taro';

function Index() {
  const [base, setBase] = useState<string>('beautiful symmetrical face');
  const [input, setInput] = useState<string>('在蓝天下的草地上奔跑的小女孩');
  const [prompt, setPrompt] = useState<string>('');
  const [artists, setArtists] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    console.log('base changed');
    buildPrompt();
  }, [input, artists, details]);

  const buildImageUrl = function (name: string, type?: string) {
    let normBase = base.replace(/ /g, '_') + '/';
    let normName = name.replace(/ /g, '_');
    if (type === 'artist') {
      normName = 'by_' + normName;
    } else if (type === 'base') {
      normBase = ''; // base is not a folder
    }
    return `https://d2q0omy5xtz2zh.cloudfront.net/0-7-0/mj/${normBase}${normName}.webp`;
  };

  const handleClick = function (item: string, list: string[], setList: any) {
    let newList = [...list];
    if (newList.includes(item)) {
      newList = newList.filter(i => i !== item);
    } else {
      newList.push(item);
    }
    setList(newList);
  };

  const buildPrompt = function () {
    let prompt = '/imagine ' + input + ' ';
    if (artists.length > 0) {
      prompt += artists.map(e => 'by ' + e).join(' ');
    }
    if (details.length > 0) {
      prompt += ' ' + details.join(' ');
    }
    setPrompt(prompt);
  };

  return (
    <View className="main">
      <View className="index">
        <View className="title">咒语发生器</View>
        <View className="content">
          选择合适的风格和选项，构建能够生成适合你图片的咒语。
        </View>
      </View>
      <Collapse activeName={['style', 'artist', 'base']}>
        <CollapseItem title="参考图" className="subtitle" name="base">
          <Grid>
            {data.bases.map((item, index) => {
              return (
                <GridItem
                  key={index}
                  data-base={item}
                  onClick={e => {
                    e.currentTarget.dataset.base &&
                      setBase(e.currentTarget.dataset.base);
                  }}
                >
                  <Image
                    src={buildImageUrl(item, 'base')}
                    width="90"
                    height="90"
                  />
                </GridItem>
              );
            })}
          </Grid>
        </CollapseItem>
        <CollapseItem title="艺术风格" className="subtitle" name="style">
          <Grid className="option-grid">
            {data.details.map((item, index) => {
              return (
                <GridItem
                  key={index}
                  data-detail={item}
                  className={details.includes(item) ? 'sel-grid' : ''}
                  onClick={e => {
                    e.currentTarget.dataset.detail &&
                      handleClick(
                        e.currentTarget.dataset.detail,
                        details,
                        setDetails
                      );
                  }}
                >
                  <Image
                    src={buildImageUrl(item, 'style')}
                    width="100"
                    height="100"
                  />
                  <View className="artist">{item}</View>
                </GridItem>
              );
            })}
          </Grid>
        </CollapseItem>
        <CollapseItem title="艺术家" className="subtitle" name="artist">
          <Grid className="option-grid">
            {data.artists.map((item, index) => {
              return (
                <GridItem
                  key={index}
                  data-artist={item}
                  className={artists.includes(item) ? 'sel-grid' : ''}
                  onClick={e => {
                    e.currentTarget.dataset.artist &&
                      handleClick(
                        e.currentTarget.dataset.artist,
                        artists,
                        setArtists
                      );
                  }}
                >
                  <Image
                    src={buildImageUrl(item, 'artist')}
                    width="100"
                    height="100"
                  />
                  <View className="artist">{item}</View>
                </GridItem>
              );
            })}
          </Grid>
        </CollapseItem>
        <CollapseItem title="更多选项" name="4">
          <View className="option-zone">
            <Range className="option" modelValue={50} />
            <Range className="option" modelValue={50} />
            <Range className="option" modelValue={50} />
          </View>
        </CollapseItem>
      </Collapse>
      <Sticky position="bottom">
        <View className="prompt-zone">
          <View className="content">请输入您想创作的内容：</View>
          <Input
            name="input"
            defaultValue={input}
            onChange={val => {
              console.log(val);
              setInput(val);
            }}
          />
          <View className="content">点击以拷贝如下生成的咒语并在 Midjourney 中运行：</View>
          <View onClick={() => {
            Taro.setClipboardData({
              data: prompt,
              success: function (res) {
                console.log('Prompt clicked', res);
                Taro.showToast({
                  title: '已经成功将咒语拷贝到剪贴板，请到 Midjourney 中粘贴运行',
                  icon: 'success',
                  duration: 2000,
                });
              },
            });
          }} >
            <TextArea readonly defaultValue={prompt} />
          </View>
        </View>
      </Sticky>
      <Toast />
    </View>
  );
}

export default Index;
