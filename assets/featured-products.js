(function(){
  'use strict';
  var root = document.querySelector('[data-auto-products]');
  if(!root) return;
  var group = root.getAttribute('data-auto-products');
  var collectionUrl = '/collections/bathroom-vanities.html';

  function txt(el, lang){
    if(!el) return '';
    var node = el.querySelector('[data-' + lang + ']');
    return (node || el).textContent.replace(/\s+/g,' ').trim();
  }
  function uniqueEnglishTags(card){
    var seen = {};
    var out = [];
    card.querySelectorAll('.product-tags span').forEach(function(el){
      var t = el.textContent.replace(/\s+/g,' ').trim();
      if(!t || /[\u4e00-\u9fff]/.test(t) || seen[t]) return;
      seen[t] = true; out.push(t);
    });
    return out.slice(0,2).join(' · ');
  }
  function toProduct(card, index, base){
    var badge = card.querySelector('.product-badge');
    var badgeText = badge ? badge.textContent : '';
    var img = card.querySelector('img');
    var price = card.querySelector('.product-price');
    return {
      index:index,
      isNew:/\bNew\b/i.test(badgeText) || badgeText.indexOf('新品')>-1,
      href:new URL(card.getAttribute('href'),base).pathname,
      image:img ? new URL(img.getAttribute('src'),base).pathname : '',
      alt:img ? (img.getAttribute('alt') || '') : '',
      name:txt(card.querySelector('.product-name'),'en'),
      nameZh:txt(card.querySelector('.product-name'),'zh'),
      spec:txt(card.querySelector('.product-spec'),'en'),
      specZh:txt(card.querySelector('.product-spec'),'zh'),
      tags:uniqueEnglishTags(card),
      price:price ? price.textContent.replace(/\s+/g,' ').trim() : '',
      size:parseInt(card.getAttribute('data-size') || '0',10)
    };
  }
  function esc(s){
    return String(s || '').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function renderCard(p, style){
    var c = style === 'home' ? {
      card:'featured-link-card',media:'featured-link-media',body:'featured-link-body',kicker:'featured-link-kicker'
    } : {card:'product-link',media:'product-link-media',body:'product-link-body',kicker:'kicker'};
    return '<a class="'+c.card+'" href="'+esc(p.href)+'">' +
      '<div class="'+c.media+'"><img src="'+esc(p.image)+'" alt="'+esc(p.alt || p.name)+'" loading="lazy" decoding="async"></div>' +
      '<div class="'+c.body+'">' +
        '<div class="'+c.kicker+'"><span data-en>'+esc(p.spec)+'</span><span data-zh>'+esc(p.specZh || p.spec)+'</span></div>' +
        '<h3><span data-en>'+esc(p.name)+'</span><span data-zh>'+esc(p.nameZh || p.name)+'</span></h3>' +
        '<div class="auto-product-meta">'+esc(p.tags)+'</div>' +
        '<div class="auto-product-footer"><span class="auto-price">'+esc(p.price)+'</span><span class="auto-view"><span data-en>View Product →</span><span data-zh>查看产品 →</span></span></div>' +
      '</div></a>';
  }
  function selectProducts(all){
    var newest = all.filter(function(p){return p.isNew;});
    var older = all.filter(function(p){return !p.isNew;});
    var ordered = newest.concat(older); // New products always lead; collection order breaks ties.
    var selected=[];
    if(group === 'home') selected = ordered.slice(0,6);
    else if(group === 'manufacturer') selected = ordered.slice(6,18);
    else if(group === 'wholesale'){
      var reserved = {};
      ordered.slice(0,18).forEach(function(p){reserved[p.href]=true;});
      selected = ordered.slice(18).filter(function(p){return p.size >= 60 && !reserved[p.href];}).slice(0,6);
      if(selected.length < 6){
        ordered.slice(18).forEach(function(p){
          if(selected.length >= 6) return;
          if(!reserved[p.href] && !selected.some(function(x){return x.href===p.href;})) selected.push(p);
        });
      }
    }
    return selected;
  }

  fetch(collectionUrl,{cache:'no-store'})
    .then(function(r){if(!r.ok) throw new Error('catalog '+r.status); return r.text();})
    .then(function(markup){
      var doc = new DOMParser().parseFromString(markup,'text/html');
      var base = new URL(collectionUrl,window.location.origin);
      var all = Array.prototype.map.call(doc.querySelectorAll('a.product-card'),function(card,i){return toProduct(card,i,base);});
      var selected = selectProducts(all);
      if(!selected.length) return;
      root.innerHTML = selected.map(function(p){return renderCard(p,group==='home'?'home':'trade');}).join('');
    })
    .catch(function(){ /* Keep the static fallback cards if the catalog cannot be fetched. */ });
})();
