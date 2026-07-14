const fs = require('fs');
const path = require('path');
const dir = 'apps/web/src/messages';
const add = {
  en: {
    admin: {
      cultureEditorTitle: 'Food, culture photos & ethnic mix',
      cultureEditorHint: 'Upload food/culture images and edit ethnic distribution for this place. Counties can override the parent city.',
      foodSection: 'Food cards',
      addFood: 'Add food',
      removeFood: 'Remove this food',
      uploadFoodImage: 'Upload food image',
      foodNameZh: 'Food name (zh)',
      foodNameEn: 'Food name (en)',
      foodNoteZh: 'Food intro (zh)',
      foodNoteEn: 'Food intro (en)',
      foodImageUrl: 'Food image URL',
      cultureImagesSection: 'Culture photos',
      uploadCultureImage: 'Upload culture photo',
      cultureImageUrls: 'Culture image URLs (one per line)',
      ethnicSection: 'Ethnic distribution',
      addEthnic: 'Add group',
      removeEthnic: 'Remove this group',
      ethnicNameZh: 'Group name (zh)',
      ethnicNameEn: 'Group name (en)',
      ethnicShare: 'Share (e.g. 约 30%)',
      ethnicNoteZh: 'Ethnic note (zh)',
      ethnicNoteEn: 'Ethnic note (en)',
      saveCulture: 'Save food & ethnic data',
      cultureSaved: 'Food, culture photos and ethnic mix saved.'
    }
  },
  'zh-Hans': {
    admin: {
      cultureEditorTitle: '美食图、人文图与民族分布',
      cultureEditorHint: '可为这个市/县上传美食图、人文图，并编辑民族分布。县可以覆盖所属市州默认值。',
      foodSection: '美食卡片',
      addFood: '添加美食',
      removeFood: '删除这道美食',
      uploadFoodImage: '上传美食图',
      foodNameZh: '美食名称（中文）',
      foodNameEn: '美食名称（英文）',
      foodNoteZh: '美食介绍（中文）',
      foodNoteEn: '美食介绍（英文）',
      foodImageUrl: '美食图片 URL',
      cultureImagesSection: '人文图片',
      uploadCultureImage: '上传人文图',
      cultureImageUrls: '人文图 URL（每行一个）',
      ethnicSection: '民族分布',
      addEthnic: '添加民族',
      removeEthnic: '删除这个民族',
      ethnicNameZh: '民族名称（中文）',
      ethnicNameEn: '民族名称（英文）',
      ethnicShare: '占比（如：约 30%）',
      ethnicNoteZh: '民族说明（中文）',
      ethnicNoteEn: '民族说明（英文）',
      saveCulture: '保存美食与民族数据',
      cultureSaved: '美食、人文图与民族分布已保存。'
    }
  },
  'zh-Hant': {
    admin: {
      cultureEditorTitle: '美食圖、人文圖與民族分布',
      cultureEditorHint: '可為這個市/縣上傳美食圖、人文圖，並編輯民族分布。縣可以覆蓋所屬市州預設值。',
      foodSection: '美食卡片',
      addFood: '新增美食',
      removeFood: '刪除這道美食',
      uploadFoodImage: '上傳美食圖',
      foodNameZh: '美食名稱（中文）',
      foodNameEn: '美食名稱（英文）',
      foodNoteZh: '美食介紹（中文）',
      foodNoteEn: '美食介紹（英文）',
      foodImageUrl: '美食圖片 URL',
      cultureImagesSection: '人文圖片',
      uploadCultureImage: '上傳人文圖',
      cultureImageUrls: '人文圖 URL（每行一個）',
      ethnicSection: '民族分布',
      addEthnic: '新增民族',
      removeEthnic: '刪除這個民族',
      ethnicNameZh: '民族名稱（中文）',
      ethnicNameEn: '民族名稱（英文）',
      ethnicShare: '占比（如：約 30%）',
      ethnicNoteZh: '民族說明（中文）',
      ethnicNoteEn: '民族說明（英文）',
      saveCulture: '儲存美食與民族資料',
      cultureSaved: '美食、人文圖與民族分布已儲存。'
    }
  },
  ja: {
    admin: {
      cultureEditorTitle: '料理・人文写真・民族構成',
      cultureEditorHint: 'この地域の料理写真・人文写真・民族構成を編集できます。県は上位市の値を上書きできます。',
      foodSection: '料理カード',
      addFood: '料理を追加',
      removeFood: 'この料理を削除',
      uploadFoodImage: '料理画像をアップロード',
      foodNameZh: '料理名（中国語）',
      foodNameEn: '料理名（英語）',
      foodNoteZh: '紹介（中国語）',
      foodNoteEn: '紹介（英語）',
      foodImageUrl: '料理画像 URL',
      cultureImagesSection: '人文写真',
      uploadCultureImage: '人文写真をアップロード',
      cultureImageUrls: '人文写真 URL（1行1枚）',
      ethnicSection: '民族構成',
      addEthnic: '民族を追加',
      removeEthnic: 'この民族を削除',
      ethnicNameZh: '民族名（中国語）',
      ethnicNameEn: '民族名（英語）',
      ethnicShare: '割合（例：約 30%）',
      ethnicNoteZh: '民族メモ（中国語）',
      ethnicNoteEn: '民族メモ（英語）',
      saveCulture: '料理と民族データを保存',
      cultureSaved: '料理・人文写真・民族構成を保存しました。'
    }
  },
  ko: {
    admin: {
      cultureEditorTitle: '음식·인문 사진·민족 구성',
      cultureEditorHint: '이 지역의 음식 사진, 인문 사진, 민족 구성을 편집할 수 있습니다. 현은 상위 시 값을 덮어쓸 수 있습니다.',
      foodSection: '음식 카드',
      addFood: '음식 추가',
      removeFood: '이 음식 삭제',
      uploadFoodImage: '음식 이미지 업로드',
      foodNameZh: '음식 이름 (중국어)',
      foodNameEn: '음식 이름 (영어)',
      foodNoteZh: '소개 (중국어)',
      foodNoteEn: '소개 (영어)',
      foodImageUrl: '음식 이미지 URL',
      cultureImagesSection: '인문 사진',
      uploadCultureImage: '인문 사진 업로드',
      cultureImageUrls: '인문 사진 URL (한 줄에 하나)',
      ethnicSection: '민족 구성',
      addEthnic: '민족 추가',
      removeEthnic: '이 민족 삭제',
      ethnicNameZh: '민족 이름 (중국어)',
      ethnicNameEn: '민족 이름 (영어)',
      ethnicShare: '비중 (예: 약 30%)',
      ethnicNoteZh: '민족 설명 (중국어)',
      ethnicNoteEn: '민족 설명 (영어)',
      saveCulture: '음식·민족 데이터 저장',
      cultureSaved: '음식, 인문 사진, 민족 구성이 저장되었습니다.'
    }
  }
};
function deepMerge(t,s){for(const[k,v] of Object.entries(s)){if(v&&typeof v==='object'&&!Array.isArray(v)){if(!t[k]||typeof t[k]!=='object')t[k]={};deepMerge(t[k],v);}else t[k]=v;}return t;}
for (const loc of Object.keys(add)) {
  const f = path.join(dir, loc + '.json');
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  deepMerge(j, add[loc]);
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
  console.log('updated', loc);
}
