import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import {
  Collapse,
  CollapseItem,
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
import { aspectRatioList } from '../../../data/mj';
import Taro from '@tarojs/taro';

const config = Taro.getStorageSync('config');

function Index() {
  const [base, setBase] = useState<string>('landscape');
  const [input, setInput] = useState<string>(
    '在马尔代夫海滩上的中国帅气小伙'
  );
  const [artists, setArtists] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [no, setNo] = useState<string>(''); // https://docs.midjourney.com/docs/multi-prompts
  const [realism, setRealism] = useState<boolean>(false);
  const [portrait, setPortrait] = useState<boolean>(false);
  const [cinematic, setCinematic] = useState<boolean>(false); // 电影级超高清3D渲染
  const [logo, setLogo] = useState<boolean>(false);
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
    if (realism) prompt += `,ultra realism,ultra detailed,4k `; // 高清写实
    if (portrait) prompt += `model full body portrait, full length, photo, photorealistic, 4k, hd, `; // 人物特写
    if (logo) prompt += `logo vector, simple, flat, 2d, low detail, smooth, plain, minimalism design, by Paul Rand --no realistic photo details, shadows `;
    if (cinematic) prompt += `Epic beautiful scene, cinematic, post production, depth of field, cinema photography, cinema, color grading, professional color grading, 55 mm lens, Exquisite detail, award winning photography, realistic photography, hyper realistic, unreal engine, realistic lens flare, real lighting, inscriptions, hyper realistic, 8k, detailed, photography, Cinematic Lighting, Studio Lighting, Beautiful Lighting, Accent Lighting, Global Illumination, Screen Space Global Illumination, Ray Tracing Global Illumination, Optics, Scattering, Glowing, Shadows, Rough, Shimmering, Ray Tracing Reflections, Lumen Reflections, Screen Space Reflections, Diffraction Grading, GB Displacement, Scan Lines, Ray Traced, Ray Tracing Ambient Occlusion,Anti - Aliasing, FKAA, TXAA, RTX, SSAO, Shaders, OpenGL - Shaders, GLSL - Shaders,Post Processing, Post - Production, Cel Shading, Tone Mapping, CGI, VFX, SFX, insanely detailed and intricate, elegant, hyper realistic, super detailed, 8k --v 5 --q 2 --s 250 `;
    setPrompt(prompt);
  };

  if (!config) {
    return <>Failed loading remote config.</>
  }

  return (
    <View className="main">
      <View className="option-container">
        <View className="title">MJ咒语发生器</View>
        <View className="subtitle">
          仅需简单点选风格和选项，即可快速构建符合你需求的MJ咒语。
        </View>
        <Collapse activeName={['base', 'detail', 'modifier']} icon="rect-down" >
          <CollapseItem
            title="参考图"
            subTitle="切换预览效果"
            className="option-zone"
            name="base"
          >
            <Grid className="option-grid" columnNum={3}>
              {config.bases.map((item, index) => {
                return (
                  <GridItem
                    key={index}
                    data-base={item}
                    onClick={e => {
                      e.currentTarget.dataset.base &&
                        setBase(e.currentTarget.dataset.base);
                    }}
                    className={base.includes(item) ? 'sel-option' : 'option'}
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
              {config.details.map((item, index) => {
                return (
                  <GridItem
                    key={index}
                    data-detail={item}
                    className={details.includes(item) ? 'sel-option' : 'option'}
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
              {config.artists.map((item, index) => {
                return (
                  <GridItem
                    key={index}
                    data-artist={item}
                    className={artists.includes(item) ? 'sel-option' : 'option'}
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
          <CollapseItem title="基本参数" className="option-zone" name="option">
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
            <View
              className="option-box-h"
              onClick={() => setIsAspectRatioVisible(!isAspectRatioVisible)}
            >
              <View>长宽比</View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
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
                className="option"
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
              <View className="option-title">风格化：数字越大风格化越明显</View>
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
              className="option-box-h">
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
          <CollapseItem title="常用修饰词" subTitle="建议只选一个" className="option-zone" name="modifier">
            <View className="option-box-h">
              <View className="option-title">高清写实</View>
              <Switch checked={realism} onChange={v => setRealism(v)} />
            </View>
            <Divider />
            <View className="option-box-h">
              <View className="option-title">人物特写</View>
              <Switch checked={portrait} onChange={v => setPortrait(v)} />
            </View>
            <Divider />
            <View className="option-box-h">
              <View className="option-title">Logo设计 - 平面极简风格</View>
              <Switch checked={logo} onChange={v => setLogo(v)} />
            </View>
            <Divider />
            <View className="option-box-h">
              <View className="option-title">电影级超高清3D渲染</View>
              <Switch checked={cinematic} onChange={v => setCinematic(v)} />
            </View>
          </CollapseItem>
        </Collapse>
      </View>
      <View className="prompt-zone">
        <View className="subtitle">请输入您想创作的内容</View>
        <TextArea
          className="content"
          style={{ height: '60px' }}
          defaultValue={input}
          onChange={val => setInput(val)}
        />
        <View className="subtitle">
          点击以下区域以拷贝咒语并到 Midjourney 中运行
        </View>
        <View
          style={{ width: '100%', padding: '0', margin: '0' }}
          onClick={() => {
            Taro.setClipboardData({
              data: prompt,
              success: function () {
                Taro.showToast({
                  title: '已成功拷贝咒语',
                });
              },
            });
          }}
        >
          <TextArea
            className="content"
            style={{ height: '70px', margin: '0' }}
            readonly
            defaultValue={prompt}
          />
        </View>
      </View>
    </View>
  );
}

export default Index;
