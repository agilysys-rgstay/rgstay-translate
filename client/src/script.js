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

copy_button.onclick = async () => {
  try {
    await navigator.clipboard.writeText(code.innerText)
    copy_button.innerText = 'COPIED';
    setTimeout(() => {
      copy_button.innerText = 'COPY';
    }, 1000)
  } catch (error) {
    console.error('Error in copying', err);
  }
};
