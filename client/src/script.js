import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import "./style.css";

let code = document.querySelector('code');
let copy_button = document.querySelector('.copy_button');
let text_area = document.querySelector('textarea');

text_area.onkeypress = async (event) => {
  if (event.which === 13 && !event.shiftKey) {
    event.preventDefault();
    let textToBeTranslated = event.target.value;
    if (!textToBeTranslated) {
      return;
    }
    try {
      let response = await fetch(`api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textToBeTranslated })
      });
      let jsonText = await response.json();
      copy_button.style.opacity = '1';
      code.innerHTML = JSON.stringify(jsonText, null, '\t');
      Prism.highlightElement(code);
    } catch (error) {
      console.error(error);
    }
  }
};

copy_button.onclick = () => {
  const ELM = document.createElement('textarea');
  ELM.value = code.innerText;
  ELM.setAttribute('readonly', '');
  ELM.style.position = 'absolute';
  ELM.style.left = '-9999px';
  document.body.appendChild(ELM);
  const SELECTED = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  ELM.select();
  document.execCommand('copy');
  copy_button.innerText = 'COPIED';
  setTimeout(() => {
    copy_button.innerText = 'COPY';
  }, 1000);
  document.body.removeChild(ELM);
  if (SELECTED) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(SELECTED);
  }
};
