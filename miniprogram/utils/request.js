const request = async function() {
  if (!wx.cloud) {
    return;
  }
  const res = await wx.cloud.callContainer({
    config: {
      env: "account-8gjt64jg11892b13",
    },
    path: "/api/expenses/list", // 填入业务自定义路径和参数
    method: "POST",
    header: {
      "X-WX-SERVICE": "account", // 填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
    },
    // 其余参数同 wx.request
  });
}