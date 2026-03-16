
// Web API helper using the anti-forgery token from Power Pages
(function(webapi){
  function safeAjax(options){
    return new Promise(function(resolve, reject){
      if (window.shell && shell.getTokenDeferred){
        shell.getTokenDeferred().done(function(token){
          options = options || {};
          options.headers = options.headers || {};
          options.headers['__RequestVerificationToken'] = token;
          options.headers['Accept'] = 'application/json';
          options.headers['OData-MaxVersion'] = '4.0';
          options.headers['OData-Version'] = '4.0';
          fetch(options.url, {
            method: options.type || options.method || 'GET',
            headers: Object.assign({'Content-Type': 'application/json'}, options.headers),
            body: options.data ? JSON.stringify(options.data) : undefined,
            credentials: 'same-origin'
          })
          .then(async (res)=>{
            if(!res.ok){
              const txt = await res.text();
              throw new Error(txt || ('HTTP '+res.status));
            }
            return res.status === 204 ? null : res.json();
          })
          .then(resolve).catch(reject);
        }).fail(function(){ reject(new Error('Failed to get verification token')); });
      } else {
        reject(new Error('shell.getTokenDeferred is not available'));
      }
    });
  }
  webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {});

// Voting integration for Questions & Answers using Power Pages Web API
(function(){
  function findCountEl(btn){
    const parent = btn.closest('.d-flex, .list-group-item, article') || document;
    return parent.querySelector('.badge');
  }
  async function patchVote(entitySet, id, newValue){
    const url = `/_api/${entitySet}(${id})`;
    await webapi.safeAjax({ url, type:'PATCH', data:{ pp_vote: newValue } });
  }
  document.addEventListener('click', async (e)=>{
    const btn = e.target.closest('[data-vote]');
    if(!btn) return; e.preventDefault();
    const id = btn.getAttribute('data-id');
    const entitySet = btn.getAttribute('data-type') === 'answer' ? 'pp_answers' : 'pp_questions';
    const cntEl = findCountEl(btn);
    const delta = btn.getAttribute('data-vote') === 'up' ? 1 : -1;
    const current = cntEl ? parseInt(cntEl.textContent.replace(/[^0-9-]/g,'')||'0',10) : 0;
    const optimistic = Math.max(0, current + delta);
    if(cntEl) cntEl.textContent = optimistic;
    try{ await patchVote(entitySet, id, optimistic); }
    catch(err){ if(cntEl) cntEl.textContent = current; alert('Vote failed: '+(err.message||'Unknown')); }
  });
})();
