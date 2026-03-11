这里是我的工作日志
截止至3月10日，我已经完成的工作
已开发完成的功能
后端 (Spring Boot)

用户认证 — 登录、注册、重置密码 (AuthController.java)
参与者管理 — 按姓名搜索、查看参与者信息及停留点数量 (ParticipantsCtrler.java)
停留点 API — 获取所有停留点（GeoJSON）、按参与者+日期过滤、添加/更新停留点 (StopsController.java)
轨迹 API — 获取移动轨迹（GeoJSON LineString）(MovesController.java)
GPS 点接收与计算 — 接收GPS点上传、计算停留点和移动段（基于100m/5min算法）(GpsController.java)
前端 (Vue 3 + Leaflet)

登录/注册/密码重置表单
Leaflet 地图展示（以格勒诺布尔为中心）
停留点彩色标记显示、颜色自定义
停留点详情弹窗（时间、时长、距离、平均速度、备注编辑）
轨迹多段线展示（橙色）
按日期范围过滤停留点
浏览器 GPS 采集（navigator.geolocation）
一键触发轨迹计算
多用户支持

3月10日的工作
1，前端备注更新失败 修改bug