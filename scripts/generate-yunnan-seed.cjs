const fs = require('fs');
const path = require('path');

const featured = new Set(['kunming', 'dali', 'lijiang', 'xishuangbanna', 'diqing']);

const cities = [
  {
    code: '530100', slug: 'kunming', lat: 25.0389, lng: 102.7183, alt: 1891,
    zh: '昆明市', en: 'Kunming', climate: 'subtropical_plateau', col: 62, mig: 8.5,
    best: [3, 4, 5, 9, 10, 11], food: '过桥米线、汽锅鸡、宜良烤鸭', scenery: '滇池、西山、翠湖',
    migration: '四季如春，医疗与教育配套全省最好，适合长期居住。',
    counties: [
      ['530102', 'kunming-wuhua', '五华区', 'Wuhua', 25.0436, 102.7072, 1890],
      ['530103', 'kunming-panlong', '盘龙区', 'Panlong', 25.0706, 102.752, 1900],
      ['530111', 'kunming-guandu', '官渡区', 'Guandu', 25.015, 102.7436, 1895],
      ['530112', 'kunming-xishan', '西山区', 'Xishan', 25.0383, 102.6647, 1900],
      ['530113', 'kunming-dongchuan', '东川区', 'Dongchuan', 26.0829, 103.1877, 1254],
      ['530114', 'kunming-chenggong', '呈贡区', 'Chenggong', 24.8893, 102.8014, 1906],
      ['530115', 'kunming-jinning', '晋宁区', 'Jinning', 24.6669, 102.5949, 1890],
      ['530124', 'kunming-fumin', '富民县', 'Fumin', 25.2219, 102.4971, 1690],
      ['530125', 'kunming-yiliang', '宜良县', 'Yiliang', 24.9198, 103.1459, 1530],
      ['530126', 'kunming-shilin', '石林彝族自治县', 'Shilin', 24.7715, 103.2905, 1680],
      ['530127', 'kunming-songming', '嵩明县', 'Songming', 25.339, 103.0369, 1910],
      ['530128', 'kunming-luquan', '禄劝彝族苗族自治县', 'Luquan', 25.5513, 102.4697, 1670],
      ['530129', 'kunming-xundian', '寻甸回族彝族自治县', 'Xundian', 25.5595, 103.2566, 1870],
      ['530181', 'kunming-anning', '安宁市', 'Anning', 24.9195, 102.478, 1800],
    ],
  },
  {
    code: '530300', slug: 'qujing', lat: 25.5016, lng: 103.7979, alt: 1873,
    zh: '曲靖市', en: 'Qujing', climate: 'subtropical_plateau', col: 48, mig: 7.0,
    best: [4, 5, 9, 10], food: '宣威火腿、沾益辣子鸡', scenery: '珠江源、罗平油菜花',
    migration: '滇东交通枢纽，生活成本低于昆明。',
    counties: [
      ['530302', 'qujing-qilin', '麒麟区', 'Qilin', 25.5051, 103.805, 1870],
      ['530303', 'qujing-zhanyi', '沾益区', 'Zhanyi', 25.6005, 103.8223, 1900],
      ['530304', 'qujing-malong', '马龙区', 'Malong', 25.4281, 103.5785, 2000],
      ['530322', 'qujing-luliang', '陆良县', 'Luliang', 25.0297, 103.6669, 1840],
      ['530323', 'qujing-shizong', '师宗县', 'Shizong', 24.8256, 103.9908, 1850],
      ['530324', 'qujing-luoping', '罗平县', 'Luoping', 24.8856, 104.3087, 1480],
      ['530325', 'qujing-fuyuan', '富源县', 'Fuyuan', 25.6742, 104.255, 1830],
      ['530326', 'qujing-huize', '会泽县', 'Huize', 26.4174, 103.2971, 2120],
      ['530381', 'qujing-xuanwei', '宣威市', 'Xuanwei', 26.2193, 104.1045, 1980],
    ],
  },
  {
    code: '530400', slug: 'yuxi', lat: 24.3505, lng: 102.5439, alt: 1637,
    zh: '玉溪市', en: 'Yuxi', climate: 'subtropical_plateau', col: 50, mig: 7.2,
    best: [3, 4, 10, 11], food: '抚仙湖铜锅鱼、澄江藕粉', scenery: '抚仙湖、星云湖',
    migration: '毗邻昆明，湖区与轻工业并存。',
    counties: [
      ['530402', 'yuxi-hongta', '红塔区', 'Hongta', 24.3541, 102.5432, 1630],
      ['530403', 'yuxi-jiangchuan', '江川区', 'Jiangchuan', 24.2874, 102.7498, 1730],
      ['530423', 'yuxi-tonghai', '通海县', 'Tonghai', 24.1122, 102.76, 1800],
      ['530424', 'yuxi-huaning', '华宁县', 'Huaning', 24.1926, 102.9283, 1600],
      ['530425', 'yuxi-yimen', '易门县', 'Yimen', 24.6717, 102.1635, 1570],
      ['530426', 'yuxi-eshan', '峨山彝族自治县', 'Eshan', 24.1733, 102.4058, 1540],
      ['530427', 'yuxi-xinping', '新平彝族傣族自治县', 'Xinping', 24.07, 101.9906, 1480],
      ['530428', 'yuxi-yuanjiang', '元江哈尼族彝族傣族自治县', 'Yuanjiang', 23.5965, 101.9981, 400],
      ['530481', 'yuxi-chengjiang', '澄江市', 'Chengjiang', 24.6757, 102.9166, 1740],
    ],
  },
  {
    code: '530500', slug: 'baoshan', lat: 25.112, lng: 99.1618, alt: 1655,
    zh: '保山市', en: 'Baoshan', climate: 'subtropical_monsoon', col: 45, mig: 6.8,
    best: [10, 11, 12, 1, 2], food: '蒲缥甜梨、腾冲大救驾', scenery: '高黎贡山、火山热海',
    migration: '滇西门户，腾冲旅居热度高。',
    counties: [
      ['530502', 'baoshan-longyang', '隆阳区', 'Longyang', 25.1121, 99.1656, 1655],
      ['530521', 'baoshan-shidian', '施甸县', 'Shidian', 24.7231, 99.1837, 1470],
      ['530523', 'baoshan-longling', '龙陵县', 'Longling', 24.5881, 98.6893, 1540],
      ['530524', 'baoshan-changning', '昌宁县', 'Changning', 24.8278, 99.6051, 1670],
      ['530581', 'baoshan-tengchong', '腾冲市', 'Tengchong', 25.0203, 98.491, 1640],
    ],
  },
  {
    code: '530600', slug: 'zhaotong', lat: 27.3383, lng: 103.7172, alt: 1920,
    zh: '昭通市', en: 'Zhaotong', climate: 'temperate_highland', col: 40, mig: 5.8,
    best: [4, 5, 9, 10], food: '天麻、苹果、酱肉', scenery: '大山包黑颈鹤、横江峡谷',
    migration: '滇东北，气候凉爽，基础设施持续改善。',
    counties: [
      ['530602', 'zhaotong-zhaoyang', '昭阳区', 'Zhaoyang', 27.32, 103.7065, 1920],
      ['530621', 'zhaotong-ludian', '鲁甸县', 'Ludian', 27.1916, 103.558, 1910],
      ['530622', 'zhaotong-qiaojia', '巧家县', 'Qiaojia', 26.9114, 102.924, 840],
      ['530623', 'zhaotong-yanjin', '盐津县', 'Yanjin', 28.1087, 104.234, 420],
      ['530624', 'zhaotong-daguan', '大关县', 'Daguan', 27.7481, 103.8916, 1100],
      ['530625', 'zhaotong-yongshan', '永善县', 'Yongshan', 28.2289, 103.638, 900],
      ['530626', 'zhaotong-suijiang', '绥江县', 'Suijiang', 28.5921, 103.956, 400],
      ['530627', 'zhaotong-zhenxiong', '镇雄县', 'Zhenxiong', 27.4416, 104.873, 1680],
      ['530628', 'zhaotong-yiliang-zt', '彝良县', "Yiliang (ZT)", 27.6254, 104.0485, 1100],
      ['530629', 'zhaotong-weixin', '威信县', 'Weixin', 27.8434, 105.048, 1180],
      ['530681', 'zhaotong-shuifu', '水富市', 'Shuifu', 28.6299, 104.4159, 300],
    ],
  },
  {
    code: '530700', slug: 'lijiang', lat: 26.855, lng: 100.227, alt: 2418,
    zh: '丽江市', en: 'Lijiang', climate: 'plateau_monsoon', col: 55, mig: 7.6,
    best: [3, 4, 5, 9, 10], food: '丽江粑粑、腊排骨火锅', scenery: '玉龙雪山、古城、泸沽湖',
    migration: '旅居热门，文旅产业强，旺季较吵。',
    counties: [
      ['530702', 'lijiang-gucheng', '古城区', 'Gucheng', 26.8772, 100.2259, 2410],
      ['530721', 'lijiang-yulong', '玉龙纳西族自治县', 'Yulong', 26.8212, 100.2369, 2400],
      ['530722', 'lijiang-yongsheng', '永胜县', 'Yongsheng', 26.6842, 100.7508, 2140],
      ['530723', 'lijiang-huaping', '华坪县', 'Huaping', 26.6292, 101.2662, 1170],
      ['530724', 'lijiang-ninglang', '宁蒗彝族自治县', 'Ninglang', 27.282, 100.852, 2680],
    ],
  },
  {
    code: '530800', slug: 'puer', lat: 22.7773, lng: 100.9726, alt: 1302,
    zh: '普洱市', en: "Pu'er", climate: 'subtropical_monsoon', col: 44, mig: 6.9,
    best: [11, 12, 1, 2, 3], food: '普洱茶、牛干巴', scenery: '茶山、墨江北回归线标志园',
    migration: '茶产业突出，气候温润，节奏慢。',
    counties: [
      ['530802', 'puer-simao', '思茅区', 'Simao', 22.7869, 100.9772, 1300],
      ['530821', 'puer-ninger', '宁洱哈尼族彝族自治县', "Ning'er", 23.0484, 101.0459, 1320],
      ['530822', 'puer-mojiang', '墨江哈尼族自治县', 'Mojiang', 23.4319, 101.6876, 1280],
      ['530823', 'puer-jingdong', '景东彝族自治县', 'Jingdong', 24.4467, 100.84, 1160],
      ['530824', 'puer-jinggu', '景谷傣族彝族自治县', 'Jinggu', 23.5003, 100.7026, 920],
      ['530825', 'puer-zhenyuan', '镇沅彝族哈尼族拉祜族自治县', 'Zhenyuan', 24.0044, 101.1085, 1100],
      ['530826', 'puer-jiangcheng', '江城哈尼族彝族自治县', 'Jiangcheng', 22.5859, 101.8591, 1120],
      ['530827', 'puer-menglian', '孟连傣族拉祜族佤族自治县', 'Menglian', 22.3291, 99.5842, 1000],
      ['530828', 'puer-lancang', '澜沧拉祜族自治县', 'Lancang', 22.5559, 99.9312, 1050],
      ['530829', 'puer-ximeng', '西盟佤族自治县', 'Ximeng', 22.6442, 99.5901, 1200],
    ],
  },
  {
    code: '530900', slug: 'lincang', lat: 23.8866, lng: 100.0869, alt: 1502,
    zh: '临沧市', en: 'Lincang', climate: 'subtropical_monsoon', col: 42, mig: 6.4,
    best: [11, 12, 1, 2], food: '滇红茶、坚果', scenery: '沧源崖画、边境风光',
    migration: '边境城市，生态好，配套逐步提升。',
    counties: [
      ['530902', 'lincang-linxiang', '临翔区', 'Linxiang', 23.8951, 100.0821, 1500],
      ['530921', 'lincang-fengqing', '凤庆县', 'Fengqing', 24.5803, 99.9284, 1570],
      ['530922', 'lincang-yunxian', '云县', 'Yun County', 24.4391, 100.1308, 1100],
      ['530923', 'lincang-yongde', '永德县', 'Yongde', 24.0282, 99.2537, 1600],
      ['530924', 'lincang-zhenkang', '镇康县', 'Zhenkang', 23.7625, 98.8253, 1020],
      ['530925', 'lincang-shuangjiang', '双江拉祜族佤族布朗族傣族自治县', 'Shuangjiang', 23.4731, 99.8277, 1040],
      ['530926', 'lincang-gengma', '耿马傣族佤族自治县', 'Gengma', 23.5378, 99.3971, 1100],
      ['530927', 'lincang-cangyuan', '沧源佤族自治县', 'Cangyuan', 23.1469, 99.246, 1270],
    ],
  },
  {
    code: '532300', slug: 'chuxiong', lat: 25.0419, lng: 101.546, alt: 1773,
    zh: '楚雄彝族自治州', en: 'Chuxiong', climate: 'subtropical_plateau', col: 46, mig: 6.7,
    best: [3, 4, 10, 11], food: '彝族菜、野生菌', scenery: '世界恐龙谷、紫溪山',
    migration: '滇中节点城市，生活节奏适中。',
    counties: [
      ['532301', 'chuxiong-city', '楚雄市', 'Chuxiong City', 25.0329, 101.5459, 1770],
      ['532302', 'chuxiong-lufeng', '禄丰市', 'Lufeng', 25.1481, 102.0756, 1560],
      ['532322', 'chuxiong-shuangbai', '双柏县', 'Shuangbai', 24.6889, 101.6419, 1970],
      ['532323', 'chuxiong-mouding', '牟定县', 'Mouding', 25.3131, 101.543, 1760],
      ['532324', 'chuxiong-nanhua', '南华县', 'Nanhua', 25.1923, 101.2746, 1860],
      ['532325', 'chuxiong-yaoan', '姚安县', "Yao'an", 25.5042, 101.2417, 1870],
      ['532326', 'chuxiong-dayao', '大姚县', 'Dayao', 25.7211, 101.3366, 1860],
      ['532327', 'chuxiong-yongren', '永仁县', 'Yongren', 26.0562, 101.6669, 1540],
      ['532328', 'chuxiong-yuanmou', '元谋县', 'Yuanmou', 25.7044, 101.8708, 1120],
      ['532329', 'chuxiong-wuding', '武定县', 'Wuding', 25.5303, 102.4039, 1720],
    ],
  },
  {
    code: '532500', slug: 'honghe', lat: 23.3631, lng: 103.3756, alt: 1307,
    zh: '红河哈尼族彝族自治州', en: 'Honghe', climate: 'subtropical_monsoon', col: 47, mig: 7.1,
    best: [10, 11, 12, 1, 2, 3], food: '过桥米线发源地之一、建水烧烤', scenery: '元阳梯田、建水古城',
    migration: '文旅与边贸并存，南部湿热北部温和。',
    counties: [
      ['532501', 'honghe-gejiu', '个旧市', 'Gejiu', 23.3591, 103.16, 1680],
      ['532502', 'honghe-kaiyuan', '开远市', 'Kaiyuan', 23.7133, 103.2666, 1050],
      ['532503', 'honghe-mengzi', '蒙自市', 'Mengzi', 23.3962, 103.3649, 1300],
      ['532504', 'honghe-mile', '弥勒市', 'Mile', 24.4107, 103.4145, 1430],
      ['532523', 'honghe-pingbian', '屏边苗族自治县', 'Pingbian', 22.987, 103.687, 1410],
      ['532524', 'honghe-jianshui', '建水县', 'Jianshui', 23.6347, 102.8266, 1320],
      ['532525', 'honghe-shiping', '石屏县', 'Shiping', 23.7059, 102.4945, 1420],
      ['532527', 'honghe-luxi', '泸西县', 'Luxi', 24.532, 103.7662, 1700],
      ['532528', 'honghe-yuanyang', '元阳县', 'Yuanyang', 23.2197, 102.8352, 1540],
      ['532529', 'honghe-honghe-county', '红河县', 'Honghe County', 23.369, 102.4206, 1100],
      ['532530', 'honghe-jinping', '金平苗族瑶族傣族自治县', 'Jinping', 22.7795, 103.2264, 1260],
      ['532531', 'honghe-lvchun', '绿春县', 'Lvchun', 22.9937, 102.3929, 1640],
      ['532532', 'honghe-hekou', '河口瑶族自治县', 'Hekou', 22.5293, 103.9393, 100],
    ],
  },
  {
    code: '532600', slug: 'wenshan', lat: 23.3695, lng: 104.244, alt: 1260,
    zh: '文山壮族苗族自治州', en: 'Wenshan', climate: 'subtropical_monsoon', col: 43, mig: 6.5,
    best: [10, 11, 12, 1, 2, 3], food: '三七、酸汤鸡', scenery: '普者黑、坝美',
    migration: '滇东南，喀斯特景观多，旅居潜力上升。',
    counties: [
      ['532601', 'wenshan-city', '文山市', 'Wenshan City', 23.3865, 104.2447, 1260],
      ['532622', 'wenshan-yanshan', '砚山县', 'Yanshan', 23.6058, 104.3371, 1540],
      ['532623', 'wenshan-xichou', '西畴县', 'Xichou', 23.4378, 104.6726, 1450],
      ['532624', 'wenshan-malipo', '麻栗坡县', 'Malipo', 23.1247, 104.7027, 1100],
      ['532625', 'wenshan-maguan', '马关县', 'Maguan', 23.0129, 104.3941, 1330],
      ['532626', 'wenshan-qiubei', '丘北县', 'Qiubei', 24.0409, 104.1944, 1450],
      ['532627', 'wenshan-guangnan', '广南县', 'Guangnan', 24.0464, 105.0551, 1250],
      ['532628', 'wenshan-funing', '富宁县', 'Funing', 23.6253, 105.6309, 680],
    ],
  },
  {
    code: '532800', slug: 'xishuangbanna', lat: 22.0017, lng: 100.7979, alt: 552,
    zh: '西双版纳傣族自治州', en: 'Xishuangbanna', climate: 'tropical_monsoon', col: 52, mig: 7.4,
    best: [11, 12, 1, 2, 3], food: '傣味、菠萝饭、烧烤', scenery: '热带雨林、勐泐大佛寺',
    migration: '冬季避寒热门，潮湿炎热需适应。',
    counties: [
      ['532801', 'xishuangbanna-jinghong', '景洪市', 'Jinghong', 22.0, 100.7717, 550],
      ['532822', 'xishuangbanna-menghai', '勐海县', 'Menghai', 21.9573, 100.4525, 1170],
      ['532823', 'xishuangbanna-mengla', '勐腊县', 'Mengla', 21.4794, 101.5646, 640],
    ],
  },
  {
    code: '532900', slug: 'dali', lat: 25.6065, lng: 100.2676, alt: 1976,
    zh: '大理白族自治州', en: 'Dali', climate: 'plateau_monsoon', col: 54, mig: 8.0,
    best: [3, 4, 5, 9, 10], food: '乳扇、酸辣鱼、白族三道茶', scenery: '苍山洱海、古城',
    migration: '数字游民与旅居者集中，配套成熟。',
    counties: [
      ['532901', 'dali-city', '大理市', 'Dali City', 25.5916, 100.2299, 1976],
      ['532922', 'dali-yangbi', '漾濞彝族自治县', 'Yangbi', 25.67, 99.958, 1560],
      ['532923', 'dali-xiangyun', '祥云县', 'Xiangyun', 25.4838, 100.5509, 2000],
      ['532924', 'dali-binchuan', '宾川县', 'Binchuan', 25.8259, 100.5789, 1440],
      ['532925', 'dali-midu', '弥渡县', 'Midu', 25.3424, 100.4909, 1670],
      ['532926', 'dali-nanjian', '南涧彝族自治县', 'Nanjian', 25.0434, 100.509, 1400],
      ['532927', 'dali-weishan', '巍山彝族回族自治县', 'Weishan', 25.2307, 100.3073, 1720],
      ['532928', 'dali-yongping', '永平县', 'Yongping', 25.4647, 99.5412, 1620],
      ['532929', 'dali-yunlong', '云龙县', 'Yunlong', 25.8856, 99.3711, 1660],
      ['532930', 'dali-eryuan', '洱源县', 'Eryuan', 26.1112, 99.951, 2060],
      ['532931', 'dali-jianchuan', '剑川县', 'Jianchuan', 26.537, 99.9056, 2200],
      ['532932', 'dali-heqing', '鹤庆县', 'Heqing', 26.5602, 100.1765, 2200],
    ],
  },
  {
    code: '533100', slug: 'dehong', lat: 24.4367, lng: 98.5784, alt: 920,
    zh: '德宏傣族景颇族自治州', en: 'Dehong', climate: 'subtropical_monsoon', col: 46, mig: 6.6,
    best: [11, 12, 1, 2, 3], food: '傣味、景颇菜', scenery: '瑞丽口岸、莫里热带雨林',
    migration: '边境贸易活跃，冬季温暖。',
    counties: [
      ['533102', 'dehong-ruili', '瑞丽市', 'Ruili', 24.0107, 97.8559, 780],
      ['533103', 'dehong-mangshi', '芒市', 'Mangshi', 24.4337, 98.5886, 920],
      ['533122', 'dehong-lianghe', '梁河县', 'Lianghe', 24.8076, 98.2967, 1100],
      ['533123', 'dehong-yingjiang', '盈江县', 'Yingjiang', 24.7123, 97.9339, 830],
      ['533124', 'dehong-longchuan', '陇川县', 'Longchuan', 24.183, 97.792, 970],
    ],
  },
  {
    code: '533300', slug: 'nujiang', lat: 25.8176, lng: 98.8566, alt: 1170,
    zh: '怒江傈僳族自治州', en: 'Nujiang', climate: 'mountain_valley', col: 38, mig: 5.5,
    best: [10, 11, 3, 4], food: '峡谷山货、漆油鸡', scenery: '怒江大峡谷、丙中洛',
    migration: '高山峡谷，基础设施有限，适合深度旅行。',
    counties: [
      ['533301', 'nujiang-lushui', '泸水市', 'Lushui', 25.851, 98.8577, 1170],
      ['533323', 'nujiang-fugong', '福贡县', 'Fugong', 26.9011, 98.8691, 1190],
      ['533324', 'nujiang-gongshan', '贡山独龙族怒族自治县', 'Gongshan', 27.741, 98.6661, 1500],
      ['533325', 'nujiang-lanping', '兰坪白族普米族自治县', 'Lanping', 26.4538, 99.4167, 2400],
    ],
  },
  {
    code: '533400', slug: 'diqing', lat: 27.8269, lng: 99.7065, alt: 3280,
    zh: '迪庆藏族自治州', en: 'Diqing', climate: 'highland_cold', col: 50, mig: 6.2,
    best: [5, 6, 9, 10], food: '藏餐、牦牛肉、酥油茶', scenery: '香格里拉、梅里雪山、普达措',
    migration: '高海拔需适应，旅游季节性强。',
    counties: [
      ['533401', 'diqing-shangri-la', '香格里拉市', 'Shangri-La', 27.8258, 99.706, 3280],
      ['533422', 'diqing-deqin', '德钦县', 'Deqin', 28.4832, 98.9115, 3400],
      ['533423', 'diqing-weixi', '维西傈僳族自治县', 'Weixi', 27.1809, 99.2864, 2320],
    ],
  },
];

function esc(s) {
  return String(s ?? '').replace(/'/g, "''");
}

function cityCompleteness(city) {
  let score = 40;
  if (city.lat && city.lng) score += 15;
  if (city.alt) score += 10;
  if (city.climate) score += 10;
  if (city.col) score += 5;
  if (city.mig) score += 5;
  if (city.food) score += 5;
  if (city.scenery) score += 5;
  if (city.migration) score += 5;
  return Math.min(100, score);
}

const sql = [];
sql.push('-- Seed Yunnan province -> cities -> counties (M1)');
sql.push('-- Idempotent upserts by code');
sql.push('begin;');
sql.push(`insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
values ('530000', 'yunnan', 'province', null, 25.0453, 102.7097, 1890, 'published', 80, true)
on conflict (code) do update set slug = excluded.slug, status = 'published', lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, completeness_score = excluded.completeness_score, is_featured = excluded.is_featured;`);

const provinceI18n = [
  ['zh-Hans', '云南省', '云南位于中国西南，地形立体、气候多元，从热带到高寒都有。'],
  ['en', 'Yunnan Province', 'Yunnan in southwest China spans tropical valleys to alpine plateaus.'],
  ['zh-Hant', '雲南省', '雲南位於中國西南，地形立體、氣候多元。'],
  ['ja', '雲南省', '中国西南部に位置し、熱帯から高山まで多様な気候がある。'],
  ['ko', '윈난성', '중국 서남부에 위치하며 열대에서 고산까지 기후가 다양하다.'],
];
for (const [loc, name, summary] of provinceI18n) {
  sql.push(`insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select r.id, '${loc}', '${esc(name)}', '${esc(summary)}', false from public.regions r where r.code = '530000'
on conflict (region_id, locale) do update set name = excluded.name, summary = excluded.summary;`);
}
sql.push(`insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select r.id, 'diverse', 50, 7.5, array[3,4,5,10,11], 'seed-m1' from public.regions r where r.code='530000'
on conflict (region_id) do update set climate_type = excluded.climate_type, data_source = excluded.data_source;`);

const jsonCities = [];
for (const city of cities) {
  const comp = cityCompleteness(city);
  const isFeat = featured.has(city.slug);
  sql.push(`-- city ${city.slug}`);
  sql.push(`insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '${city.code}', '${city.slug}', 'city', p.id, ${city.lat}, ${city.lng}, ${city.alt}, 'published', ${comp}, ${isFeat}
from public.regions p where p.code = '530000'
on conflict (code) do update set parent_id = excluded.parent_id, slug = excluded.slug, lat = excluded.lat, lng = excluded.lng, altitude_m = excluded.altitude_m, status='published', completeness_score=excluded.completeness_score, is_featured=excluded.is_featured;`);

  const summaryZh = `${city.zh}是云南重要地区，海拔约${city.alt}米。`;
  const summaryEn = `${city.en} is a key prefecture-level area in Yunnan at about ${city.alt} m elevation.`;
  sql.push(`insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'zh-Hans', '${esc(city.zh)}', '${esc(summaryZh)}', '${esc(city.food)}', '${esc(city.scenery)}', '${esc(city.migration)}', false from public.regions where code='${city.code}'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;`);
  sql.push(`insert into public.region_i18n (region_id, locale, name, summary, food_blurb, scenery_blurb, migration_blurb, machine_translated)
select id, 'en', '${esc(city.en)}', '${esc(summaryEn)}', '${esc(city.food)}', '${esc(city.scenery)}', '${esc(city.migration)}', true from public.regions where code='${city.code}'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary, food_blurb=excluded.food_blurb, scenery_blurb=excluded.scenery_blurb, migration_blurb=excluded.migration_blurb;`);
  for (const [loc, name] of [['zh-Hant', city.zh], ['ja', city.en], ['ko', city.en]]) {
    sql.push(`insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, '${loc}', '${esc(name)}', '${esc(summaryEn)}', true from public.regions where code='${city.code}'
on conflict (region_id, locale) do update set name=excluded.name;`);
  }
  sql.push(`insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select id, '${city.climate}', ${city.col}, ${city.mig}, array[${city.best.join(',')}], 'seed-m1' from public.regions where code='${city.code}'
on conflict (region_id) do update set climate_type=excluded.climate_type, cost_of_living_index=excluded.cost_of_living_index, migration_friendliness=excluded.migration_friendliness, best_months=excluded.best_months, data_source=excluded.data_source;`);

  const countyJson = [];
  for (const [code, slug, zh, en, lat, lng, alt] of city.counties) {
    sql.push(`insert into public.regions (code, slug, level, parent_id, lat, lng, altitude_m, status, completeness_score, is_featured)
select '${code}', '${slug}', 'county', p.id, ${lat}, ${lng}, ${alt}, 'published', 60, false
from public.regions p where p.code = '${city.code}'
on conflict (code) do update set parent_id=excluded.parent_id, slug=excluded.slug, lat=excluded.lat, lng=excluded.lng, altitude_m=excluded.altitude_m, status='published', completeness_score=excluded.completeness_score;`);
    const csumZh = `${zh}隶属${city.zh}，海拔约${alt}米。`;
    const csumEn = `${en} is in ${city.en}, about ${alt} m elevation.`;
    sql.push(`insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'zh-Hans', '${esc(zh)}', '${esc(csumZh)}', false from public.regions where code='${code}'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;`);
    sql.push(`insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, 'en', '${esc(en)}', '${esc(csumEn)}', true from public.regions where code='${code}'
on conflict (region_id, locale) do update set name=excluded.name, summary=excluded.summary;`);
    for (const loc of ['zh-Hant', 'ja', 'ko']) {
      const nm = loc === 'zh-Hant' ? zh : en;
      sql.push(`insert into public.region_i18n (region_id, locale, name, summary, machine_translated)
select id, '${loc}', '${esc(nm)}', '${esc(csumEn)}', true from public.regions where code='${code}'
on conflict (region_id, locale) do update set name=excluded.name;`);
    }
    sql.push(`insert into public.region_metrics (region_id, climate_type, cost_of_living_index, migration_friendliness, best_months, data_source)
select c.id, m.climate_type, greatest(m.cost_of_living_index - 3, 30), m.migration_friendliness, m.best_months, 'seed-m1-inherited'
from public.regions c
join public.regions p on p.code='${city.code}'
join public.region_metrics m on m.region_id=p.id
where c.code='${code}'
on conflict (region_id) do update set climate_type=excluded.climate_type, data_source=excluded.data_source;`);

    countyJson.push({
      code, slug, level: 'county', lat, lng, altitude_m: alt,
      names: { 'zh-Hans': zh, en, 'zh-Hant': zh, ja: en, ko: en },
      summary: { 'zh-Hans': csumZh, en: csumEn },
    });
  }

  jsonCities.push({
    code: city.code,
    slug: city.slug,
    level: 'city',
    lat: city.lat,
    lng: city.lng,
    altitude_m: city.alt,
    is_featured: isFeat,
    climate_type: city.climate,
    cost_of_living_index: city.col,
    migration_friendliness: city.mig,
    best_months: city.best,
    names: { 'zh-Hans': city.zh, en: city.en, 'zh-Hant': city.zh, ja: city.en, ko: city.en },
    summary: { 'zh-Hans': summaryZh, en: summaryEn },
    food_blurb: city.food,
    scenery_blurb: city.scenery,
    migration_blurb: city.migration,
    counties: countyJson,
  });
}
sql.push('commit;');

const local = {
  province: {
    code: '530000', slug: 'yunnan', level: 'province', lat: 25.0453, lng: 102.7097, altitude_m: 1890,
    names: { 'zh-Hans': '云南省', en: 'Yunnan Province', 'zh-Hant': '雲南省', ja: '雲南省', ko: '윈난성' },
  },
  cities: jsonCities,
  generated_at: new Date().toISOString(),
  source: 'seed-m1-local-fallback',
};

const root = process.cwd();
fs.writeFileSync(path.join(root, 'supabase/seed/yunnan_regions.sql'), sql.join('\n') + '\n', 'utf8');
fs.writeFileSync(path.join(root, 'apps/web/src/data/yunnan-regions.json'), JSON.stringify(local, null, 2), 'utf8');
const countyCount = jsonCities.reduce((n, c) => n + c.counties.length, 0);
console.log(JSON.stringify({ cities: jsonCities.length, counties: countyCount, sqlBytes: fs.statSync('supabase/seed/yunnan_regions.sql').size, jsonBytes: fs.statSync('apps/web/src/data/yunnan-regions.json').size }, null, 2));
