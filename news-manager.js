// 明星新闻数据管理模块
// 定义所有新闻数据，包含分类和日期信息
const newsData = {
  // 商务活动 - 分类
  commercial: [
    {
      id: 'news-4',
      title: {
        zh: '【BOOM专属】范趣町GISMOW搪胶毛绒娃娃盲盒直发小憨包盲盒手办直播',
        en: '【BOOM Exclusive】GISMOW Vinyl Plush Doll Blind Box Straight Hair Little Chubby Bag Blind Box Figure',
        th: '【ส่วนตัว BOOM】GISMOW Vinyl Plush Doll Blind Box Straight Hair Little Chubby Bag Blind Box Figure'
      },
      date: '2025-09-28',
      dateDisplay: {
        zh: '2025年9月28日',
        en: '2025-09-28',
        th: '2568-09-28'
      },
      content: {
        zh: 'Boom作为GISMOW品牌形象大使，为大家带来限量版盲盒系列，包括搪胶毛绒娃娃、直发小憨包等多款可爱造型。',
        en: 'As GISMOW brand ambassador, Boom brings limited edition blind box series, including vinyl plush dolls, straight hair chubby bags and other cute designs.',
        th: 'ในฐานะผู้แทนด้านแบรนด์ GISMOW บูมนำเสนอชุดกล่องตาแฝงจำกัดจำนวน รวมถึงตุ๊กตาเทปทรงพลูช เสื้อถุงอ้วนผมตรงและดีไซน์น่ารักอื่น ๆ'
      },
      image: 'images/new4.jpg',
      alt: 'BOOM专属范趣町GISMOW搪胶毛绒娃娃盲盒',
      link: 'https://v.douyin.com/MrsSsAA_NoI/',
      linkText: {
        zh: '点击获取',
        en: 'Read More',
        th: 'อ่านเพิ่มเติม'
      },
      isLatest: true
    }
  ],
  
  // 新作品 - 分类
  'new-work': [
    {
      id: 'news-1',
      title: {
        zh: 'タイ俳優 #BOOM のモッパン🍖\n ✨日本初✨冠番組👏',
        en: 'Thai Actor #BOOM\'s Moppan🍖\n ✨First Japanese Regular Show✨👏',
        th: 'นักแสดงไทย #BOOM งานมอปปัน🍖\n ✨ครั้งแรกในญี่ปุ่น✨รายการปกติ👏'
      },
      date: '2025-10-11',
      dateDisplay: {
        zh: '2025-10-11',
        en: '2025-10-11',
        th: '2025-10-11'
      },
      content: {
        zh: 'Boom将在日本推出首个冠名节目，展现其多才多艺的一面，与日本观众近距离互动。',
        en: 'Boom will launch his first regular show in Japan, showcasing his versatility and interacting closely with Japanese audiences.',
        th: 'บูมจะเปิดตัวรายการปกติครั้งแรกในญี่ปุ่น แสดงทักษะความหลากหลายของเขาและโต้ตอบอย่างใกล้ชิดกับผู้ชมญี่ปุ่น'
      },
      image: 'images/new1.jpg',
      alt: 'BoomRaveewit日本初冠番組',
      link: 'https://x.com/nitteleplus/status/1959812981656813893?t=kbDmXf81Amz17dqViuhWSg&s=09',
      linkText: {
        zh: '阅读更多',
        en: 'Read More',
        th: 'อ่านเพิ่มเติม'
      },
      isLatest: true
    }
  ],
  
  // 活动现场 - 分类
  event: [
    {
      id: 'news-2',
      title: {
        zh: 'Boom Europe Fan Meet Tour',
        en: 'Boom Europe Fan Meet Tour',
        th: 'Boom Europe Fan Meet Tour'
      },
      date: '2025-10-04',
      dateDisplay: {
        zh: '2025-10-04 (CEST GMT+2)',
        en: '2025-10-04 (CEST GMT+2)',
        th: '2025-10-04 (CEST GMT+2)'
      },
      content: {
        zh: 'Boom即将开启欧洲粉丝见面会巡演，与欧洲的粉丝们近距离互动，带来精彩表演。',
        en: 'Boom will start his Europe Fan Meet Tour, interacting closely with fans in Europe and bringing wonderful performances.',
        th: 'บูมจะเริ่มทัวร์คานพี่แฟนในยุโรป โต้ตอบอย่างใกล้ชิดกับแฟน ๆ ในยุโรปและนำเสนอการแสดงที่น่าตื่นเต้น'
      },
      image: 'images/new2.jpg',
      alt: 'Boom Europe Fan Meet Tour',
      link: 'https://x.com/HeadlinerTH/status/1974100411620704341?s=19',
      linkText: {
        zh: '阅读更多',
        en: 'Read More',
        th: 'อ่านเพิ่มเติม'
      },
      isLatest: true
    }
  ],
  
  // 活动预告 - 分类
  preview: [
    {
      id: 'news-preview-new-1',
      title: {
        zh: 'Boom/Peanut/Euro首场粉丝见面会——新加坡',
        en: 'Boom/Peanut/Euro First Fan Meeting - Singapore',
        th: 'การประชุมแฟนครั้งแรกของ Boom/Peanut/Euro - สิงคโปร์'
      },
      date: '2025-10-18',
      dateDisplay: {
        zh: '2025-10-18 (GMT+8)',
        en: '2025-10-18 (GMT+8)',
        th: '2025-10-18 (GMT+8)'
      },
      content: {
        zh: 'Boom/Peanut/Euro首场粉丝见面会惊喜加码，开启「双向奔赴」2.0模式！新增限定福利：每位艺人1v1合影升级为自拍模式，海报亲签环节时长30秒，增加抽取20位VIP海报亲签。',
        en: 'Boom/Peanut/Euro First Fan Meeting with special surprises,开启「Two-way奔赴」2.0 mode! New limited benefits: Each artist\'s 1v1 photo session upgraded to selfie mode, 30 seconds for poster autograph session, and 20 VIP poster autographs will be drawn.',
        th: 'การประชุมแฟนครั้งแรกของ Boom/Peanut/Euro มีความคิดใหม่และความประทับใจ! เปิดโหมด "Two-way奔赴" 2.0! ข้อได้เปรียบจำกัด: โหมดเซลฟี่ในการถ่ายภาพ 1v1 กับศิลปินแต่ละคน, 30 วินาทีสำหรับเซสชันเซ็นรูปภาพ, และ 20 รูปภาพเซ็นพิเศษสำหรับ VIP จะถูกสุ่มให้'
      },
      image: 'images/new5.jpg',
      alt: 'Boom/Peanut/Euro首场粉丝见面会——新加坡',
      link: 'https://weibo.com/7978655922/5215177725183871',
      linkText: {
        zh: '阅读更多',
        en: 'Read More',
        th: 'อ่านเพิ่มเติม'
      },
      isLatest: true
    },
    {
      id: 'news-3',
      title: {
        zh: '新身份GISMOW小憨包灵感推荐官，正式解锁！  \u00A0✨',
        en: 'New role as GISMOW brand ambassador officially unlocked!   \u00A0✨',
        th: 'ตำแหน่งใหม่เป็นผู้แนะนำความ灵感应ของ GISMOW ข正式ปลดล็อคแล้ว！   \u00A0✨'
      },
      date: '2025-10-12',
      dateDisplay: {
        zh: '2025-10-12 (GMT+7)',
        en: '2025-10-12 (GMT+7)',
        th: '2025-10-12 (GMT+7)'
      },
      content: {
        zh: 'Boom将以全新身份担任GISMOW小憨包灵感推荐官，为粉丝带来更多精彩内容和独家周边。',
        en: 'Boom will take on a new role as GISMOW brand ambassador, bringing more exciting content and exclusive merchandise to fans.',
        th: 'บูมจะรับบทบาทใหม่เป็นผู้แทนด้านแบรนด์ GISMOW นำเสนอเนื้อหาที่น่าตื่นเต้นและสินค้าพิเศษสำหรับแฟน ๆ เพิ่มเติม'
      },
      image: 'images/new3.jpg',
      alt: 'BoomRaveewit活动预告',
      link: 'https://weibo.com/7977907334/5215941505319759',
      linkText: {
        zh: '阅读更多',
        en: 'Read More',
        th: 'อ่านเพิ่มเติม'
      },
      isLatest: false
    }
  ]
};

// 获取当前语言或默认使用中文
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'zh';
}

// 获取所有类别的最新新闻
function getLatestNewsByCategory() {
  const latestNews = {};
  
  for (const category in newsData) {
    if (newsData.hasOwnProperty(category)) {
      // 筛选出该类别中isLatest为true的新闻
      const latestItems = newsData[category].filter(item => item.isLatest);
      if (latestItems.length > 0) {
        latestNews[category] = latestItems[0];
      }
    }
  }
  
  return latestNews;
}

// 获取所有新闻（按日期排序）
function getAllNewsSortedByDate() {
  let allNews = [];
  
  // 收集所有新闻，并保存类别信息
  for (const category in newsData) {
    if (newsData.hasOwnProperty(category)) {
      newsData[category].forEach(news => {
        allNews.push({...news, category}); // 保留新闻的类别信息
      });
    }
  }
  
  // 按日期排序（最新的在前）
  allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return allNews;
}

// 获取特定类别的所有新闻
function getNewsByCategory(category) {
  if (!newsData[category]) {
    return [];
  }
  
  // 获取该类别的所有新闻并按日期排序
  return [...newsData[category]].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 根据新闻ID更新其isLatest状态
function updateNewsLatestStatus(newsId, isLatest) {
  for (const category in newsData) {
    if (newsData.hasOwnProperty(category)) {
      const newsIndex = newsData[category].findIndex(item => item.id === newsId);
      if (newsIndex !== -1) {
        newsData[category][newsIndex].isLatest = isLatest;
        return true;
      }
    }
  }
  return false;
}

// 添加新的新闻
function addNewsItem(category, newsItem) {
  if (!newsData[category]) {
    newsData[category] = [];
  }
  
  // 为新新闻设置ID
  const newId = `news-${category}-${Date.now()}`;
  newsItem.id = newId;
  
  // 将新新闻添加到数组开头
  newsData[category].unshift(newsItem);
  
  // 自动设置最新状态
  updateLatestStatusForCategory(category);
  
  // 返回新添加的新闻ID
  return newId;
}

// 更新特定类别的最新状态
function updateLatestStatusForCategory(category) {
  if (!newsData[category]) {
    return;
  }
  
  // 重置所有该类别的新闻的isLatest状态
  newsData[category].forEach((news, index) => {
    news.isLatest = index === 0; // 只有第一条是最新的
  });
}

// 生成新闻HTML模板
function generateNewsHtml(news, isFullView = false, isCommercialLarge = false) {
  const lang = getCurrentLanguage();
  const title = news.title[lang].replace(/\n/g, '<br>');
  const content = news.content[lang];
  const date = news.dateDisplay[lang];
  const linkText = news.linkText[lang];
  
  // 根据分类获取标签颜色和文本
  const categoryInfo = getCategoryInfo(news.category || 'commercial');
  
  let html = '';
  
  if (isCommercialLarge) {
    // 商务活动大尺寸样式
    html = `
      <div class="bg-white rounded-xl shadow-md overflow-hidden group transition-custom hover:shadow-lg flex flex-col md:flex-row">
        <!-- 图片部分 -->
        <div class="relative w-full md:w-2/5 h-72 overflow-hidden">
          <img src="${news.image}" alt="${news.alt}" class="w-full h-full object-contain">
          <div class="absolute top-4 left-4 ${categoryInfo.color} text-white text-sm px-3 py-1 rounded-full">
            ${categoryInfo.label[lang]}
          </div>
        </div>
        <!-- 文字描述部分 -->
        <div class="p-8 md:p-10 w-full md:w-3/5 flex flex-col justify-center">
          <div class="flex items-center text-gray-500 text-xs mb-3">
            <i class="fa fa-calendar-o mr-2"></i>
            <span>${date}</span>
          </div>
          <h3 class="text-2xl font-bold mb-6 group-hover:text-primary transition-custom">
            ${title}
          </h3>
          <a href="${news.link}" class="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-custom self-start" target="_blank" rel="noopener noreferrer">
            ${linkText}
            <i class="fa fa-long-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    `;
  } else if (isFullView) {
    // 全部动态页面的样式
    html = `
      <div class="news-item bg-white rounded-xl shadow-md overflow-hidden group transition-custom hover:shadow-lg flex flex-col md:flex-row" data-category="${news.category || 'commercial'}">
        <div class="relative w-full md:w-2/5 h-80 overflow-hidden">
          <img src="${news.image}" alt="${news.alt}" class="w-full h-full object-contain">
          <div class="absolute top-4 left-4 ${categoryInfo.color} text-white text-sm px-3 py-1 rounded-full">
            ${categoryInfo.label[lang]}
          </div>
        </div>
        <div class="p-8 md:p-10 w-full md:w-3/5 flex flex-col justify-center">
          <div class="flex items-center text-gray-500 text-xs mb-3">
            <i class="fa fa-calendar-o mr-2"></i>
            <span>${date}</span>
          </div>
          <h3 class="text-2xl font-bold mb-6 group-hover:text-primary transition-custom">
            ${title}
          </h3>
          <p class="text-gray-600 mb-6">
            ${content}
          </p>
          <a href="${news.link}" class="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-custom self-start" target="_blank" rel="noopener noreferrer">
            ${linkText}
            <i class="fa fa-long-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    `;
  } else {
    // 首页其他类别的样式
    html = `
      <div class="bg-white rounded-xl shadow-md overflow-hidden group transition-custom hover:shadow-lg">
        <div class="relative h-64 overflow-hidden">
          <img src="${news.image}" alt="${news.alt}" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110">
          <div class="absolute top-4 left-4 ${categoryInfo.color} text-white text-sm px-3 py-1 rounded-full">
            ${categoryInfo.label[lang]}
          </div>
        </div>
        <div class="p-5">
          <div class="flex items-center text-gray-500 text-xs mb-3">
            <i class="fa fa-calendar-o mr-2"></i>
            <span>${date}</span>
          </div>
          <h3 class="text-lg font-bold mb-4 group-hover:text-primary transition-custom">
            ${title}
          </h3>
          <a href="${news.link}" class="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-custom" target="_blank" rel="noopener noreferrer">
            ${linkText}
            <i class="fa fa-long-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    `;
  }
  
  return html;
}

// 获取分类信息（颜色和标签文本）
function getCategoryInfo(category) {
  const categories = {
    commercial: {
      color: 'bg-purple-500',
      label: {
        zh: '商务活动',
        en: 'Commercial Event',
        th: 'กิจกรรมการตลาด'
      }
    },
    'new-work': {
      color: 'bg-primary',
      label: {
        zh: '新作品',
        en: 'New Work',
        th: 'ผลงานใหม่'
      }
    },
    event: {
      color: 'bg-secondary',
      label: {
        zh: '活动现场',
        en: 'Event Scene',
        th: 'งาน现场'
      }
    },
    preview: {
      color: 'bg-green-500',
      label: {
        zh: '活动预告',
        en: 'Event Preview',
        th: 'ตัวอย่างกิจกรรม'
      }
    }
  };
  
  return categories[category] || categories.commercial;
}

// 初始化首页新闻展示
function initHomePageNews() {
  // 获取每个类别的最新新闻
  const latestNews = getLatestNewsByCategory();
  const container = document.querySelector('#news .container');
  
  if (!container) return;
  
  // 清空现有的新闻内容
  const existingNews = container.querySelector('.mb-10');
  const existingNewsRow = container.querySelector('.grid');
  if (existingNews) existingNews.remove();
  if (existingNewsRow) existingNewsRow.remove();
  
  // 创建商务活动部分（大尺寸样式）
  if (latestNews.commercial) {
    const commercialSection = document.createElement('div');
    commercialSection.className = 'mb-10 max-w-6xl mx-auto w-full';
    commercialSection.innerHTML = generateNewsHtml(latestNews.commercial, false, true);
    container.insertBefore(commercialSection, container.querySelector('.text-center'));
  }
  
  // 创建其他三类新闻和商务活动的网格
  const otherCategories = ['new-work', 'event', 'preview', 'commercial'];
  const gridSection = document.createElement('div');
  gridSection.className = 'grid grid-cols-1 md:grid-cols-3 gap-8';
  
  otherCategories.forEach(category => {
    if (latestNews[category]) {
      const newsDiv = document.createElement('div');
      newsDiv.innerHTML = generateNewsHtml(latestNews[category]);
      gridSection.appendChild(newsDiv);
    }
  });
  
  container.insertBefore(gridSection, container.querySelector('.text-center'));
}

// 初始化全部动态页面
function initAllNewsPage() {
  // 获取所有新闻（按日期排序，包含被替换的旧动态）
  const allNews = getAllNewsSortedByDate();
  const container = document.querySelector('.news-container');
  
  if (!container) return;
  
  // 清空现有的新闻内容
  container.innerHTML = '';
  
  // 添加所有新闻（包括被替换的旧动态）
  allNews.forEach(news => {
    const newsDiv = document.createElement('div');
    newsDiv.innerHTML = generateNewsHtml(news, true);
    container.appendChild(newsDiv.querySelector('.news-item'));
  });
  
  // 重新初始化过滤功能
  initNewsFilter();
}

// 初始化新闻过滤功能
function initNewsFilter() {
  const filterButtons = document.querySelectorAll('.news-filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有按钮的active状态
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-primary', 'text-white');
        b.classList.add('bg-white', 'text-gray-800');
      });
      
      // 添加当前按钮的active状态
      this.classList.add('active', 'bg-primary', 'text-white');
      this.classList.remove('bg-white', 'text-gray-800');
      
      // 获取过滤类别
      const filter = this.getAttribute('data-filter');
      
      // 过滤新闻项
      document.querySelectorAll('.news-item').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'flex';
          // 添加淡入动画
          item.classList.add('opacity-0');
          setTimeout(() => {
            item.classList.remove('opacity-0');
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 监听语言变化，更新新闻显示
function setupLanguageChangeListener() {
  // 监听全局语言变化事件
  document.addEventListener('languageChanged', function() {
    if (window.location.pathname.includes('all-news.html')) {
      initAllNewsPage();
    } else {
      initHomePageNews();
    }
  });
  
  // 扩展现有changeLanguage函数，触发自定义事件
  const originalChangeLanguage = window.changeLanguage;
  if (originalChangeLanguage) {
    window.changeLanguage = function(lang) {
      originalChangeLanguage(lang);
      document.dispatchEvent(new CustomEvent('languageChanged'));
    };
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('all-news.html')) {
    initAllNewsPage();
  } else {
    // 检查是否在首页的新闻部分
    if (document.querySelector('#news')) {
      initHomePageNews();
    }
  }
  
  setupLanguageChangeListener();
});

// 暴露公共API
window.newsManager = {
  getLatestNewsByCategory,
  getAllNewsSortedByDate,
  getNewsByCategory,
  updateNewsLatestStatus,
  addNewsItem,
  generateNewsHtml
};