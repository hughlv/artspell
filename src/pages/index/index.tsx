import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import {
  Cell,
  Collapse,
  CollapseItem,
  ConfigProvider,
  Divider,
  Grid,
  GridItem,
  Icon,
  Image,
  Input,
  Picker,
  Radio,
  Switch,
  Range,
  TextArea,
} from '@nutui/nutui-react-taro';
import './index.scss';
import data, { aspectRatioList } from '../../../data/mj';
import Taro from '@tarojs/taro';

function Index() {
  const [base, setBase] = useState<string>('landscape');
  const [input, setInput] = useState<string>(
    'Beautiful woman on a beach in the Maldives, model, stunning, beach, serene, tropical, travel photography postcard style, hyper-detailed and realistic, film simulation, 8k'
  );
  const [artists, setArtists] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [no, setNo] = useState<string>(''); // https://docs.midjourney.com/docs/multi-prompts
  const [version, setVersion] = useState<string>('');
  const [quality, setQuality] = useState<string>('');
  const [chaos, setChaos] = useState<string>(''); // https://docs.midjourney.com/docs/chaos
  const [tile, setTile] = useState<boolean>(false); // https://docs.midjourney.com/docs/tile
  const [video, setVideo] = useState<boolean>(false); // https://docs.midjourney.com/docs/video 仅适用于 v3 以下版本
  const [stylize, setStylize] = useState<string>(''); //
  const [isAspectRatioVisible, setIsAspectRatioVisible] =
    useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<string>('');

  const [prompt, setPrompt] = useState<string>(''); // 组装完整的提示词

  useEffect(() => {
    buildPrompt();
  });

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
    if (artists.length > 0) prompt += artists.map(e => 'by ' + e).join(' ');
    if (details.length > 0) prompt += ' ' + details.join(' ') + ' ';
    if (quality) prompt += `--q ${quality} `;
    if (chaos) prompt += ` --c ${chaos}`;
    if (stylize) prompt += ` --s ${stylize}`;
    if (no) prompt += ` --no ${no}`;
    if (tile) prompt += ' --tile';
    if (video) prompt += ' --video';
    if (version) prompt += ` --v ${version}`;
    if (aspectRatio) prompt += ` --ar ${aspectRatio}`;
    setPrompt(prompt);
  };

  const ticosTheme = {
    nutuiBrandColor: '#2250d0',
    nutuiBrandColorStart: '#2250d0',
    nutuiBrandColorEnd: '#92c0ff',
    nutuiRangeBgColor: '#92c0ff',
    nutuiRangeBgColorTick: '#92c0ff',
    nutuiDividerTextColor: '#ebedf0',
  };

  return (
    <ConfigProvider theme={ticosTheme}>
      <View className="main">
        <View className="option-container">
          <View className="title">MJ咒语发生器</View>
          <View className="content">
            仅需简单点选风格和选项，即可快速构建符合你需求的MJ咒语。
          </View>
          <Collapse activeName={['base', 'detail', 'artist', 'option']}>
            <CollapseItem
              title="参考图"
              subTitle='切换预览效果'
              className="option-zone"
              name="base"
            >
              <Grid className="option-grid" columnNum={3}>
                {data.bases.map((item, index) => {
                  return (
                    <GridItem
                      key={index}
                      data-base={item}
                      onClick={e => {
                        e.currentTarget.dataset.base &&
                          setBase(e.currentTarget.dataset.base);
                      }}
                      className={
                        base.includes(item) ? 'sel-option' : 'option'
                      }
                    >
                      <Image
                        src={buildImageUrl(item, 'base')}
                        width="90"
                        height="90"
                        radius={9}
                      />
                      <View className="option-title">{item}</View>
                    </GridItem>
                  );
                })}
              </Grid>
            </CollapseItem>
            <CollapseItem
              title="艺术风格"
              subTitle="可选择多种风格"
              className="option-zone"
              name="detail"
            >
              <Grid className="option-grid" columnNum={3}>
                {data.details.map((item, index) => {
                  return (
                    <GridItem
                      key={index}
                      data-detail={item}
                      className={
                        details.includes(item) ? 'sel-option' : 'option'
                      }
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
                        width="90"
                        height="90"
                        radius={9}
                      />
                      <View className="option-title">{item}</View>
                    </GridItem>
                  );
                })}
              </Grid>
            </CollapseItem>
            <CollapseItem
              title="艺术家"
              subTitle="可同时选择多位艺术家"
              className="option-zone"
              name="artist"
            >
              <Grid className="option-grid" columnNum={3}>
                {data.artists.map((item, index) => {
                  return (
                    <GridItem
                      key={index}
                      data-artist={item}
                      className={
                        artists.includes(item) ? 'sel-option' : 'option'
                      }
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
                        width="90"
                        height="90"
                        radius={9}
                      />
                      <View className="option-title">{item}</View>
                    </GridItem>
                  );
                })}
              </Grid>
            </CollapseItem>
            <CollapseItem
              title="基本参数"
              className="option-zone"
              name="option"
            >
              <View className="option-box-h">
                <View className="option-title">版本</View>
                <Radio.RadioGroup
                  direction="horizontal"
                  options={[
                    // { label: '1', value: '1' },
                    // { label: '2', value: '2' },
                    // { label: '3', value: '3' },
                    // { label: '4', value: '4' },
                    { label: '5', value: '5' },
                    { label: '5b', value: '5b' },
                  ]}
                  value={version || '5'}
                  onChange={e => setVersion(e.toString())}
                ></Radio.RadioGroup>
              </View>
              <Divider />
              <View className="option-box-h" onClick={() => setIsAspectRatioVisible(!isAspectRatioVisible)}>
                <View>长宽比</View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View>{aspectRatio ? aspectRatio : '1:1'}</View>
                  <Icon name="rect-right" />
                </View>
                <Picker
                  isVisible={isAspectRatioVisible}
                  listData={aspectRatioList}
                  onConfirm={values => setAspectRatio(values[0].toString())}
                  onClose={() => setIsAspectRatioVisible(false)}
                />
              </View>
              <Divider />
              <View className="option-box">
                <View className="option-title">图片质量（数字越大质量越好）</View>
                <Radio.RadioGroup
                  className='option'
                  direction="horizontal"
                  options={[
                    { label: '0.25', value: '0.25' },
                    { label: '0.5', value: '0.5' },
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '5', value: '5' },
                  ]}
                  value={quality || '1'}
                  onChange={e => setQuality(e.toString())}
                ></Radio.RadioGroup>
              </View>
              <Divider />
              <View className="option-box">
                <View className="option-title">混乱（数字越大效果越强）</View>
                <Range
                  className="option"
                  min={0}
                  max={100}
                  hiddenRange
                  modelValue={chaos ? Number(chaos) : 0}
                  onChange={v => setChaos(v.toString())}
                />
              </View>
              <Divider />
              <View className="option-box">
                <View className="option-title">
                  风格化：数字越大风格化越明显
                </View>
                <Range
                  className="option"
                  min={0}
                  max={1000}
                  hiddenRange
                  modelValue={stylize ? Number(stylize.split(' ').pop()) : 100}
                  onChange={v => setStylize(v.toString())}
                />
              </View>
              <Divider />
              <View
                className="option-box-h"
                style={{ flexDirection: 'row', padding: '4rpx' }}
              >
                <View className="option-title">创建为可拼接的纹理</View>
                <Switch checked={tile} onChange={v => setTile(v)} />
              </View>
              <Divider />
              {version && Number(version.split(' ').pop()) <= 3 && (
                <View className="option-box-h">
                  <View className="option-title">生成短视频</View>
                  <Switch checked={video} onChange={v => setVideo(v)} />
                  <Divider />
                </View>
              )}
              <View className="option-box-h">
                <Input
                  label="去除内容"
                  className="option"
                  name="no"
                  placeholder="如输入 sky 会去除天空"
                  defaultValue={no ? Number(no.split(' ').pop()) : ''}
                  onChange={v => setNo(v)}
                />
              </View>
            </CollapseItem>
          </Collapse>
          <View className="content" style={{ textAlign: 'center'}}><a href="https://github.com/hughlv/artspell/"><Icon name="github" /></a></View>
        </View>
        <View className="prompt-zone">
          <View className="content">请输入您想创作的内容：</View>
          <Input
            name="input"
            defaultValue={input}
            onChange={val => setInput(val)}
          />
          <View className="content">
            点击下列区域以拷贝咒语并到 Midjourney 中运行：
          </View>
          <View
            className="content"
            style={{ width: '100%', textAlign: 'center' }}
            onClick={() => {
              Taro.setClipboardData({
                data: prompt,
                success: function (res) {
                  console.log('Prompt clicked', res);
                  Taro.showToast({
                    title: '已成功拷贝咒语',
                    icon: 'success',
                    duration: 2000,
                  });
                },
              });
            }}
          >
            <TextArea className='content' readonly defaultValue={prompt} />
          </View>
        </View>
      </View>
    </ConfigProvider>
  );
}

export default Index;
