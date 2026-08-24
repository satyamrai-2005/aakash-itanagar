
function toggleMenu(){document.querySelector('.links')?.classList.toggle('open')}
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.links')?.classList.remove('open')));
function toast(msg){let t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',3200)}
function openModal(title,text){let m=document.getElementById('modal');if(!m)return;document.getElementById('modalTitle').textContent=title;document.getElementById('modalText').textContent=text;m.style.display='grid'}
function closeModal(){let m=document.getElementById('modal');if(m)m.style.display='none'}
window.addEventListener('click',e=>{let m=document.getElementById('modal');if(e.target===m)closeModal()})
function demoSubmit(e){e.preventDefault();toast('Demo enquiry submitted. Connect this form to your approved CRM/email/WhatsApp endpoint before launch.');e.target.reset()}
function filterCards(category){document.querySelectorAll('[data-category]').forEach(x=>x.style.display=(category==='all'||x.dataset.category===category)?'':'none');document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===category))}
