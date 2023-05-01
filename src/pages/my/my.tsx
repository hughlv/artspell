import { View, Text } from "@tarojs/components";
import {
  Avatar,
  Icon,
  Image,
} from '@nutui/nutui-react-taro';
import './my.scss';

function My() {
  return (
    <View className="main">
      <Avatar size="large" icon="https://assets.csn.chat/hua.png" />
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '8px 0'}}>
        <Icon name="github" style={{ marginRight: '4px' }} />
        <View className="content" style={{ textAlign: 'center'}}><a href="https://github.com/hughlv/artspell/">https://github.com/hughlv/artspell/</a></View>
      </View>
      <Image src="https://assets.csn.chat/qrcode_for_gh_1f3a52321def_258.jpg" fit="contain" width="150px" height="150px" />
      <Text className="text">欢迎关注常识笔记</Text>
    </View>
  )
}

export default My;