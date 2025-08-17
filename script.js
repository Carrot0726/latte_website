// 之後可以放互動功能
console.log("🐾 貓咪網站啟動成功！");
// ========== 單張輪播（我的照片） ==========
(function(){
  const viewer = document.querySelector('.photo-viewer');
  if(!viewer) return;

  const imgEl = viewer.querySelector('.pv-img');
  const btnPrev = viewer.querySelector('.pv-prev');
  const btnNext = viewer.querySelector('.pv-next');
  const indicator = viewer.querySelector('.pv-indicator');

  // 從 data-images 取得清單
  let list = [];
  try {
    list = JSON.parse(viewer.getAttribute('data-images')) || [];
  } catch(e){ list = []; }

  if(list.length === 0){
    // 沒有清單就用當前圖片
    list = [imgEl.getAttribute('src')];
  }

  let idx = 0;

  function update() {
    imgEl.src = list[idx];
    indicator.textContent = `${idx+1} / ${list.length}`;
    // 小小的切換動畫
    imgEl.style.transform = 'scale(0.98)';
    requestAnimationFrame(()=>{
      setTimeout(()=>{ imgEl.style.transform = 'scale(1)'; }, 60);
    });
  }

  function next(){ idx = (idx + 1) % list.length; update(); }
  function prev(){ idx = (idx - 1 + list.length) % list.length; update(); }

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  // 鍵盤 ← → 切換
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  // 觸控滑動（手機）
  let startX = 0;
  viewer.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  viewer.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
  });

  // 預載相鄰圖片，切換更順
  function preload(i){
    const img = new Image();
    img.src = list[i];
  }
  function preloadNeighbors(){
    preload((idx + 1) % list.length);
    preload((idx - 1 + list.length) % list.length);
  }
  // 每次更新後預載左右
  const _update = update;
  update = function(){ _update(); preloadNeighbors(); };

  // 初始化
  update();
})();
