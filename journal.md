记录犬类主人记录遛狗活动的软件

3月19日
1，修复了在输入用户名和密码的时候，只能输入一个字符，光标就会自动离开的bug
    修复方案：Field组件，把Field移到AuthScreen外面

2，增加手动添加stop的功能，并在stop中包含时间，照片，地点，心情，是否隐私等信息
    
3，迁移数据库至pokechien_do

4，添加删除arret 的功能


5，修改添加stop后的bug，成功添加stop后，再次点击这个stop，之前存入的照片无法读取
6，arret manuel 和arret gps不再做区分，让arret gps采用和arret manuel同样的页面格式适配app功能

7，对deplacement进行适配，改为遛狗的轨迹，可以标注为promenade, course à peid, randonnée等。并自动计算平均速度
