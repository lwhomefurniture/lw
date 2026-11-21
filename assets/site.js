
function setLang(lang){document.documentElement.dataset.lang=lang;localStorage.setItem('lwlang',lang);document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang))}
document.addEventListener('DOMContentLoaded',()=>{setLang(localStorage.getItem('lwlang')||'en')})

document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('.navlinks');
  if(nav && !nav.querySelector('a[href*="about-us.html"]')){
    const wholesale=Array.from(nav.querySelectorAll('a')).find(a=>/wholesale/i.test(a.textContent));
    const contact=Array.from(nav.querySelectorAll('a')).find(a=>/contact/i.test(a.textContent));
    const about=document.createElement('a');
    about.href='../about-us.html';
    about.innerHTML='<span data-en>About</span><span data-zh>关于我们</span>'; 
    if(contact) nav.insertBefore(about,contact);
    else if(wholesale && wholesale.nextSibling) nav.insertBefore(about,wholesale.nextSibling);
    else nav.appendChild(about);
  }
});