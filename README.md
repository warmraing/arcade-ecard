# arcade-ecard

在网页上获取并显示特定机厅的电子会员码，省的打开微信小程序

## Token获取

- 打开微信小程序前，开启抓包软件。
- 开启小程序后筛选 **/api/v3/MembeGameLogin/appletLogin**。
- 查看响应即可获取Token。Token格式为：**Token xxxx**

## Token保活

需要至少15分钟使用Token请求一次数据，否则Token会失效。可使用目录[脚本](./Token_keepAlive.ps1)进行保活。

## 服务器设置

- 由于cors限制，需参照[nginx配置](./api.conf)进行反代设置。
- 配置完成后，修改[index.js](./js/index.js)的**defaultApiSite**为自己的服务器，或在网页Token设置中填写。

## 关于

仅在炫动四方及天空之城海口店测试，理论上使用同系统的游戏厅均可支持。

未来或许会弄的东西

- [ ] 会员卡及机厅切换
- [ ] 支持偶宇的系统
- [ ] 添加太鼓二维码支持
