const fs = require('fs');
const path = require('path');

// add weather/metric keys
const dir = 'apps/web/src/messages';
const additions = {
  en: {
    weather: {
      live: 'Live weather',
      loading: 'Loading weather…',
      unavailable: 'Weather unavailable',
      wind: 'Wind {speed} km/h',
      clear: 'Clear',
      mainlyClear: 'Mainly clear',
      partlyCloudy: 'Partly cloudy',
      overcast: 'Overcast',
      fog: 'Fog',
      rimeFog: 'Rime fog',
      lightDrizzle: 'Light drizzle',
      rain: 'Rain',
      snow: 'Snow',
      rainShowers: 'Rain showers',
      thunderstorm: 'Thunderstorm',
      code: 'Code {code}'
    },
    metrics: {
      altitude: '{m} m',
      migration: 'Migration {score}/10',
      cost: 'Cost index {score}',
      best: 'Best: {months}',
      months: {
        '1': 'Jan', '2': 'Feb', '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun',
        '7': 'Jul', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
      }
    }
  },
  'zh-Hans': {
    weather: {
      live: '实时天气',
      loading: '天气加载中…',
      unavailable: '天气暂不可用',
      wind: '风速 {speed} 公里/小时',
      clear: '晴',
      mainlyClear: '大部晴朗',
      partlyCloudy: '多云',
      overcast: '阴',
      fog: '雾',
      rimeFog: '霜雾',
      lightDrizzle: '小毛毛雨',
      rain: '雨',
      snow: '雪',
      rainShowers: '阵雨',
      thunderstorm: '雷暴',
      code: '代码 {code}'
    },
    metrics: {
      altitude: '{m} 米',
      migration: '移居 {score}/10',
      cost: '生活成本 {score}',
      best: '最佳：{months}',
      months: {
        '1': '1月', '2': '2月', '3': '3月', '4': '4月', '5': '5月', '6': '6月',
        '7': '7月', '8': '8月', '9': '9月', '10': '10月', '11': '11月', '12': '12月'
      }
    }
  },
  'zh-Hant': {
    weather: {
      live: '即時天氣',
      loading: '天氣載入中…',
      unavailable: '天氣暫不可用',
      wind: '風速 {speed} 公里/小時',
      clear: '晴',
      mainlyClear: '大部晴朗',
      partlyCloudy: '多雲',
      overcast: '陰',
      fog: '霧',
      rimeFog: '霜霧',
      lightDrizzle: '小毛毛雨',
      rain: '雨',
      snow: '雪',
      rainShowers: '陣雨',
      thunderstorm: '雷暴',
      code: '代碼 {code}'
    },
    metrics: {
      altitude: '{m} 公尺',
      migration: '移居 {score}/10',
      cost: '生活成本 {score}',
      best: '最佳：{months}',
      months: {
        '1': '1月', '2': '2月', '3': '3月', '4': '4月', '5': '5月', '6': '6月',
        '7': '7月', '8': '8月', '9': '9月', '10': '10月', '11': '11月', '12': '12月'
      }
    }
  },
  ja: {
    weather: {
      live: 'リアルタイム天気',
      loading: '天気を読み込み中…',
      unavailable: '天気を取得できません',
      wind: '風速 {speed} km/h',
      clear: '晴れ',
      mainlyClear: 'ほぼ晴れ',
      partlyCloudy: 'ところにより曇り',
      overcast: '曇り',
      fog: '霧',
      rimeFog: '着氷霧',
      lightDrizzle: '弱い霧雨',
      rain: '雨',
      snow: '雪',
      rainShowers: 'にわか雨',
      thunderstorm: '雷雨',
      code: 'コード {code}'
    },
    metrics: {
      altitude: '{m} m',
      migration: '移住 {score}/10',
      cost: '生活コスト {score}',
      best: 'ベスト：{months}',
      months: {
        '1': '1月', '2': '2月', '3': '3月', '4': '4月', '5': '5月', '6': '6月',
        '7': '7月', '8': '8月', '9': '9月', '10': '10月', '11': '11月', '12': '12月'
      }
    }
  },
  ko: {
    weather: {
      live: '실시간 날씨',
      loading: '날씨 불러오는 중…',
      unavailable: '날씨를 사용할 수 없음',
      wind: '바람 {speed} km/h',
      clear: '맑음',
      mainlyClear: '대체로 맑음',
      partlyCloudy: '부분적으로 흐림',
      overcast: '흐림',
      fog: '안개',
      rimeFog: '상고대 안개',
      lightDrizzle: '약한 이슬비',
      rain: '비',
      snow: '눈',
      rainShowers: '소나기',
      thunderstorm: '뇌우',
      code: '코드 {code}'
    },
    metrics: {
      altitude: '{m} m',
      migration: '이주 {score}/10',
      cost: '생활비 지수 {score}',
      best: '최적: {months}',
      months: {
        '1': '1월', '2': '2월', '3': '3월', '4': '4월', '5': '5월', '6': '6월',
        '7': '7월', '8': '8월', '9': '9월', '10': '10월', '11': '11월', '12': '12월'
      }
    }
  }
};

function deepMerge(target, source) {
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (!target[k] || typeof target[k] !== 'object') target[k] = {};
      deepMerge(target[k], v);
    } else target[k] = v;
  }
  return target;
}

for (const locale of Object.keys(additions)) {
  const file = path.join(dir, locale + '.json');
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  deepMerge(current, additions[locale]);
  fs.writeFileSync(file, JSON.stringify(current, null, 2) + '\n', 'utf8');
  console.log('updated messages', locale);
}

function write(rel, content) {
  fs.writeFileSync(path.join('apps/web/src', rel), content, 'utf8');
  console.log('wrote', rel);
}

write('components/weather-strip.tsx', `'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type WeatherPayload = {
  temperature?: number;
  weathercode?: number;
  windspeed?: number;
  time?: string;
  error?: string;
};

export function WeatherStrip({ lat, lng }: { lat: number; lng: number }) {
  const t = useTranslations('weather');
  const [data, setData] = useState<WeatherPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(\`/api/weather?lat=\${lat}&lng=\${lng}\`);
        const json = (await res.json()) as WeatherPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ error: t('unavailable') });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, t]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/60">
        {t('loading')}
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/60">
        {data.error === 'Weather unavailable' ? t('unavailable') : data.error}
      </div>
    );
  }

  const weatherKeyByCode: Record<number, string> = {
    0: 'clear',
    1: 'mainlyClear',
    2: 'partlyCloudy',
    3: 'overcast',
    45: 'fog',
    48: 'rimeFog',
    51: 'lightDrizzle',
    61: 'rain',
    71: 'snow',
    80: 'rainShowers',
    95: 'thunderstorm',
  };

  const label =
    data.weathercode != null
      ? weatherKeyByCode[data.weathercode]
        ? t(weatherKeyByCode[data.weathercode] as any)
        : t('code', { code: data.weathercode })
      : '—';

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-plateau/20 bg-plateau/5 px-4 py-3 text-sm">
      <span className="font-semibold text-plateau">{t('live')}</span>
      <span>{data.temperature != null ? \`\${data.temperature}°C\` : '—'}</span>
      <span>{label}</span>
      <span className="text-ink/60">
        {data.windspeed != null ? t('wind', { speed: data.windspeed }) : '—'}
      </span>
    </div>
  );
}
`);

write('components/metric-chips.tsx', `'use client';

import { useTranslations } from 'next-intl';

export function MetricChips({
  altitudeM,
  climateType,
  migrationFriendliness,
  costOfLivingIndex,
  bestMonths,
}: {
  altitudeM?: number | null;
  climateType?: string | null;
  migrationFriendliness?: number | null;
  costOfLivingIndex?: number | null;
  bestMonths?: number[] | null;
}) {
  const t = useTranslations('metrics');
  const chips: string[] = [];
  if (altitudeM != null) chips.push(t('altitude', { m: altitudeM }));
  if (climateType) chips.push(climateType);
  if (migrationFriendliness != null) chips.push(t('migration', { score: migrationFriendliness }));
  if (costOfLivingIndex != null) chips.push(t('cost', { score: costOfLivingIndex }));
  if (bestMonths && bestMonths.length > 0) {
    chips.push(
      t('best', {
        months: bestMonths.map((m) => t(\`months.\${m}\` as any)).join(' '),
      }),
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-ink/10 bg-white px-3 py-1">
          {chip}
        </span>
      ))}
    </div>
  );
}
`);
