import {ENV_HOSTED_SERVICE,X_WX_SERVICE} from './constant';
const request = async function(url, params = {}, header = {}) {
  if (!wx.cloud) {
    return;
  }
  const {method = "POST", data = {}, dataType = 'json', responseType = 'text'} = params
  const res = await wx.cloud.callContainer({
    config: {
      env: ENV_HOSTED_SERVICE,
    },
    data,
    dataType,
    responseType,
    path: url, // 填入业务自定义路径和参数
    method,
    header: {
      "X-WX-SERVICE": X_WX_SERVICE, // 填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
      ...header
    },
  });
  return res;
}
export default request