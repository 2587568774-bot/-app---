const fs = require('fs');
const path = require('path');
const dir = path.join('E:/无尽的/see-yunnan/apps/web/src/messages');
const locales = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko'];

const packs = {
  en: {
    pricing: {
      payTitle: 'Personal payment methods',
      payIntro: 'Pay {price}/month via personal transfer, then admin grants access by email.',
      qrLater: 'QR image can be uploaded later',
      contactOps: 'Send payment proof to operator',
      step1: 'Pay {price} via personal WeChat / Alipay / PayPal.',
      step2: 'Send your login email + payment proof to the operator.',
      note: 'Current path: personal QR/transfer + admin grant. Stripe can be added later.',
    },
    guides: {
      budgetOptional: 'Estimated budget USD (optional)',
      commissionHint: 'Platform commission target 15%. Optional budget helps admin track guide net share.',
    },
    admin: {
      commissionRate: 'Commission rate',
      budgetTotal: 'Budget total',
      platformFeeTotal: 'Platform fee total',
      inquiryBudgetLine: 'Budget ${budget} · platform {pct}% = ${fee} · guide net ${net}',
    },
  },
  'zh-Hans': {
    pricing: {
      payTitle: '个人收款方式',
      payIntro: '先通过个人收款支付 {price}/月，后台按邮箱人工开通。',
      qrLater: '收款码图片可稍后上传',
      contactOps: '支付后把凭证发给运营',
      step1: '通过微信/支付宝/PayPal 个人收款支付 {price}。',
      step2: '把登录邮箱 + 支付凭证发给运营。',
      note: '当前路径：个人收款码/转账 + 后台人工开通。Stripe 可后续接入。',
    },
    guides: {
      budgetOptional: '预算金额 USD（可选）',
      commissionHint: '平台抽成目标 15%。填写预算便于后台统计向导净得。',
    },
    admin: {
      commissionRate: '抽成比例',
      budgetTotal: '预算合计',
      platformFeeTotal: '平台抽成合计',
      inquiryBudgetLine: '预算 ${budget} · 平台 {pct}% = ${fee} · 向导净得 ${net}',
    },
  },
  'zh-Hant': {
    pricing: {
      payTitle: '個人收款方式',
      payIntro: '先透過個人收款支付 {price}/月，後台依信箱人工開通。',
      qrLater: '收款碼圖片可稍後上傳',
      contactOps: '支付後把憑證寄給營運',
      step1: '透過微信/支付寶/PayPal 個人收款支付 {price}。',
      step2: '把登入信箱 + 支付憑證寄給營運。',
      note: '目前路徑：個人收款碼/轉帳 + 後台人工開通。Stripe 可後續接入。',
    },
    guides: {
      budgetOptional: '預算金額 USD（可選）',
      commissionHint: '平台抽成目標 15%。填寫預算方便後台統計嚮導淨得。',
    },
    admin: {
      commissionRate: '抽成比例',
      budgetTotal: '預算合計',
      platformFeeTotal: '平台抽成合計',
      inquiryBudgetLine: '預算 ${budget} · 平台 {pct}% = ${fee} · 嚮導淨得 ${net}',
    },
  },
  ja: {
    pricing: {
      payTitle: '個人決済方法',
      payIntro: 'まず個人送金で {price}/月を支払い、管理者がメールで付与します。',
      qrLater: 'QR画像は後から追加可能',
      contactOps: '支払い証明を運営へ送付',
      step1: 'WeChat / Alipay / PayPal の個人送金で {price} を支払います。',
      step2: 'ログインメールと支払い証明を運営に送ってください。',
      note: '現在は個人送金 + 管理者付与。Stripe は後から追加できます。',
    },
    guides: {
      budgetOptional: '予算 USD（任意）',
      commissionHint: '手数料目標 15%。予算入力でガイド取り分を管理できます。',
    },
    admin: {
      commissionRate: '手数料率',
      budgetTotal: '予算合計',
      platformFeeTotal: '手数料合計',
      inquiryBudgetLine: '予算 ${budget} · 手数料 {pct}% = ${fee} · ガイド手取り ${net}',
    },
  },
  ko: {
    pricing: {
      payTitle: '개인 결제 수단',
      payIntro: '개인 송금으로 {price}/월 결제 후, 관리자가 이메일로 권한을 부여합니다.',
      qrLater: 'QR 이미지는 나중에 추가 가능',
      contactOps: '결제 증빙을 운영자에게 전송',
      step1: 'WeChat / Alipay / PayPal 개인 송금으로 {price}를 결제하세요.',
      step2: '로그인 이메일과 결제 증빙을 운영자에게 보내세요.',
      note: '현재 경로: 개인 송금 + 관리자 부여. Stripe는 이후 추가 가능.',
    },
    guides: {
      budgetOptional: '예산 USD (선택)',
      commissionHint: '플랫폼 수수료 목표 15%. 예산을 입력하면 가이드 순수익 추적이 쉽습니다.',
    },
    admin: {
      commissionRate: '수수료율',
      budgetTotal: '예산 합계',
      platformFeeTotal: '플랫폼 수수료 합계',
      inquiryBudgetLine: '예산 ${budget} · 플랫폼 {pct}% = ${fee} · 가이드 순수익 ${net}',
    },
  },
};

for (const loc of locales) {
  const p = path.join(dir, loc + '.json');
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const pack = packs[loc];
  j.pricing = Object.assign({}, j.pricing || {}, pack.pricing);
  j.guides = Object.assign({}, j.guides || {}, pack.guides);
  j.admin = Object.assign({}, j.admin || {}, pack.admin);
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
  JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log('ok', loc, j.pricing.payTitle);
}
