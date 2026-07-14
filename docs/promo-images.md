# Promo images

Image priority:
1. Admin upload on region
2. Local promo pack `/uploads/promo/{slug}/` via `promo-images.json`
3. Built-in PLACE_VISUALS defaults

## 16 tourism entry points

- **昆明市文化和旅游局** (`kunming`): https://whhlyj.km.gov.cn/
- **曲靖市人民政府门户网** (`qujing`): https://www.qj.gov.cn/
- **玉溪市人民政府** (`yuxi`): https://www.yuxi.gov.cn/
- **保山市人民政府门户网站** (`baoshan`): https://www.baoshan.gov.cn/
- **昭通市人民政府门户网站** (`zhaotong`): https://www.zt.gov.cn/
- **丽江网** (`lijiang`): https://www.lijiang.cn/
- **普洱市人民政府** (`puer`): https://www.puershi.gov.cn/
- **临沧市人民政府** (`lincang`): https://www.lincang.gov.cn/
- **楚雄彝族自治州人民政府** (`chuxiong`): https://www.cxz.gov.cn/
- **红河哈尼族彝族自治州人民政府** (`honghe`): https://www.hh.gov.cn/
- **文山壮族苗族自治州人民政府** (`wenshan`): https://www.ynws.gov.cn/
- **西双版纳傣族自治州人民政府** (`xishuangbanna`): https://www.xsbn.gov.cn/
- **大理旅游网（大理旅游集团）** (`dali`): https://www.dalitravel.cn/
- **德宏州人民政府门户网站** (`dehong`): https://www.dh.gov.cn/
- **怒江傈僳族自治州人民政府** (`nujiang`): https://www.nujiang.gov.cn/
- **迪庆藏族自治州人民政府** (`diqing`): https://www.diqing.gov.cn/

## Replace later

1. Admin region editor upload, or
2. Put files into `apps/web/public/uploads/promo/{slug}/` then run `node scripts/finalize-promo-pack.js`
