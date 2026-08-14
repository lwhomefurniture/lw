
function setLang(lang){document.documentElement.dataset.lang=lang;localStorage.setItem('lwlang',lang);document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang))}
document.addEventListener('DOMContentLoaded',()=>{setLang(localStorage.getItem('lwlang')||'en')})
