import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import {
  Cell,
  Image,
  Input,
  Grid,
  GridItem,
  Picker,
  Radio,
  Switch,
  Collapse,
  CollapseItem,
  Range,
  TextArea,
} from '@nutui/nutui-react-taro';
import './index.scss';
import data, { aspectRatioList } from '../../../data/mj';
import Taro from '@tarojs/taro';

function Index() {
  const [base, setBase] = useState<string>('landscape');
  const [input, setInput] = useState<string>('在蓝天下的草地上奔跑的小女孩');
  const [prompt, setPrompt] = useState<string>('');
  const [artists, setArtists] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [v, setV] = useState<string>('');
  const [creative, setCreative] = useState<string>('');
  const [isAspectRatioVisible, setIsAspectRatioVisible] =
    useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<string>('');

  useEffect(() => {
    console.log('base changed');
    buildPrompt();
  }, [input, artists, details, creative, aspectRatio, v]);

  const buildImageUrl = function (name: string, type?: string) {
    let normBase = base.replace(/ /g, '_') + '/';
    let normName = name.replace(/ /g, '_');
    if (type === 'artist' && !name.endsWith('render')) {
      normName = 'by_' + normName;
    } else if (type === 'base') {
      normBase = ''; // 参考图路径不需要添加分类
    }
    return `http://assets.csn.chat/0-7-0/mj/${normBase}${normName}.webp`;
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
    let prompt = input + ' ';
    if (artists.length > 0) {
      prompt += artists.map(e => 'by ' + e).join(' ');
    }
    if (details.length > 0) {
      prompt += ' ' + details.join(' ') + ' ';
    }
    if (creative) {
      prompt += creative + ' ';
    }
    if (v) {
      prompt += v + ' ';
    }
    if (aspectRatio) {
      prompt += aspectRatio + ' ';
    }
    setPrompt(prompt);
  };

  return (
    <View className="main">
      <View className="option-container">
        <View className="title">咒语发生器</View>
        <View className="content">
          选择合适的风格和选项，构建能够生成适合你图片的咒语。
        </View>
        <Collapse activeName={['base', 'detail', 'artist', 'option']}>
          <CollapseItem title="选择参考图以更换所有的预览图" className="option-zone" name="base">
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
          <CollapseItem title="艺术风格" className="option-zone" name="detail">
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
          <CollapseItem title="艺术家" className="option-zone" name="artist">
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
          <CollapseItem title="更多选项" className="option-zone" name="option">
            <View className="option-box">
              <View className="option-title">图片比重（Weight）</View>
              <Range
                className="option"
                marks={{ '-10': -10, '0': 0, '10': 10 }}
                inactiveColor="rgba(163,184,255,1)"
                buttonColor="rgba(52,96,250,1)"
                activeColor="linear-gradient(315deg, rgba(73,143,242,1) 0%,rgba(73,101,242,1) 100%)"
                hiddenRange
                modelValue={[-10, 10]}
              />
            </View>
            <View className="option-box">
              <View className="option-title">版本</View>
              <Radio.RadioGroup
                direction="horizontal"
                options={[
                  { label: 'v1', value: '--v 1' },
                  { label: 'v2', value: '--v 2' },
                  { label: 'v3', value: '--v 3' },
                  { label: 'v4', value: '--v 4' },
                  { label: 'v5', value: '--v 5' },
                ]}
                value={v || '--v 5'}
                onChange={e => setV(e.toString())}
              ></Radio.RadioGroup>
            </View>
            <View className="option-box">
              <Cell
                className="option-cell"
                title="图片尺寸"
                desc={aspectRatio.split(' ').pop()}
                onClick={() => setIsAspectRatioVisible(!isAspectRatioVisible)}
              />
              <Picker
                isVisible={isAspectRatioVisible}
                listData={aspectRatioList}
                onConfirm={(values, list) => {
                  console.log(values, list);
                  setAspectRatio(values[0].toString());
                }}
                onClose={() => setIsAspectRatioVisible(false)}
              />
            </View>
            <View
              className="option-box"
              style={{ flexDirection: 'row', padding: '4rpx' }}
            >
              <View>创新模式</View>
              <Switch
                checked={creative === 'creative'}
                activeText="ON"
                inactiveText="OFF"
                onChange={v => setCreative(v ? 'creative' : '')}
              />
            </View>
          </CollapseItem>
        </Collapse>
      </View>
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
        <View className="content">
          点击以拷贝如下生成的咒语并在 Midjourney 中运行：
        </View>
        <View
          onClick={() => {
            Taro.setClipboardData({
              data: prompt,
              success: function (res) {
                console.log('Prompt clicked', res);
                Taro.showToast({
                  title:
                    '已成功拷贝咒语',
                  icon: 'success',
                  duration: 2000,
                });
              },
            });
          }}
        >
          <TextArea readonly defaultValue={prompt} />
        </View>
      </View>
    </View>
  );
}

export default Index;
