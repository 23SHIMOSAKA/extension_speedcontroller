(()=>{"use strict";function t(){return document.querySelector(".video-stream")}function e(t,e){const o=document.createElement("div");o.classList.add("tooltip-text"),o.textContent=e,document.body.appendChild(o);const i=t.getBoundingClientRect();o.style.position="absolute",o.style.left=`${i.left+window.scrollX+(t.offsetWidth-o.offsetWidth)/2}px`,o.style.top=`${i.top+window.scrollY+t.offsetHeight+5}px`,o.style.visibility="visible",setTimeout((()=>{o.remove()}),3e3)}const o=class{constructor(t){this.container=t,this.video=null,this.speeds=[],this.init()}init(){this.video=t(),this.video?this.applySavedPlaybackRate():new MutationObserver(((e,o)=>{this.video=t(),this.video&&(this.applySavedPlaybackRate(),o.disconnect())})).observe(document.body,{childList:!0,subtree:!0}),this.loadSpeeds()}loadSpeeds(){chrome.storage.sync.get({speedList:"1, 1.25, 1.5, 2"},(t=>{this.speeds=t.speedList.split(",").map((t=>parseFloat(t.trim()))),this.speeds.forEach((t=>this.createButton(t)))}))}createButton(t){const e=document.createElement("button");e.textContent=`${t}x`,e.addEventListener("click",(()=>this.onSpeedButtonClick(t))),this.container.appendChild(e)}onSpeedButtonClick(e){this.video||(this.video=t()),this.video&&(this.video.playbackRate=e,this.savePlaybackRate(e),this.updateButtonColors(e))}savePlaybackRate(t){chrome.storage.sync.set({playbackRate:t})}applySavedPlaybackRate(){chrome.storage.sync.get(["playbackRate"],(t=>{t.playbackRate&&this.video&&(this.video.playbackRate=t.playbackRate,this.updateButtonColors(t.playbackRate))}))}updateButtonColors(t){this.container.querySelectorAll("button").forEach((e=>{parseFloat(e.textContent)===t?e.classList.add("active"):e.classList.remove("active")}))}},i=class{constructor(e){this.button=e,this.video=t(),this.init()}init(){this.button.addEventListener("click",(()=>this.takeScreenshot()))}takeScreenshot(){const t=document.createElement("canvas"),e=t.getContext("2d");t.width=this.video.videoWidth,t.height=this.video.videoHeight,e.drawImage(this.video,0,0,t.width,t.height),t.toBlob((t=>this.copyToClipboard(t)),"image/png")}copyToClipboard(t){const o=new ClipboardItem({"image/png":t});navigator.clipboard.write([o]).then((()=>e(this.button,"スクリーンショットをコピーしました。"))).catch((()=>e(this.button,"コピーに失敗しました。")))}};console.log("content.js loaded"),new MutationObserver(((t,e)=>{const s=document.getElementById("clarify-box");if(s){const t=function(){const t=document.createElement("div");t.id="AllContainer";const e=document.createElement("div");e.id="speedContainer",t.appendChild(e),new o(e);const s=document.createElement("button");return s.id="screenshotButton",s.textContent="📷",t.appendChild(s),new i(s),t}();s.parentNode.insertBefore(t,s.nextSibling),e.disconnect()}})).observe(document.body,{childList:!0,subtree:!0})})();
//# sourceMappingURL=bundle.js.map