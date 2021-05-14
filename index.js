'use strict'

const storage = localStorage.getItem('links')
  ? JSON.parse(localStorage.getItem('links'))
  : [];

const form = document.getElementById('form');
const results = document.querySelector('.results');

const render = (data, last) => {
  const result = document.createElement('div');
  result.setAttribute('class', 'result');

  result.innerHTML = `
    <div class="result__header">
      ${data.long_url}
    </div>
    <div class="result__content">
      <input 
        type="text"
        class="result__shorten"
        style="width: 500px;"
        value=${data.link}
        id="${data.id}"
        readonly="readonly"
      />
      <button 
        type="button"
        class="result__btn btn" 
        data-id="${data.id}"
      >
        Copy
      </button> 
      <!--동일한 URL 요청수 : ${data.count} //-->
    </div>
  `;

  result.querySelector('.result__btn').onclick = handleCopy;

  if (last !== null) {
    return results.insertBefore(result, last);
  }

  results.appendChild(result);
};

const addLink = (link) => {
  storage.unshift(link);
  localStorage.setItem('links', JSON.stringify(storage));

  const last = results.firstChild;
  render(link, last);
};

let chkUrl = "";
let addCount = 0;
const chk = (url) => {
  storage.some((link) => {
    if (url == link.long_url) {
      chkUrl = link.link;
      addCount = link.count;
      return url == link.long_url;
    }
    if (url == link.link) {
      chkUrl = link.long_url;
      addCount = link.count;
      return url == link.link;
    }    
  });
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const url = document.getElementById("url").value.trim();

  if (url.length === 0) {
    return event.target.classList.add('form--invalid');
  }

  try {

    chk(url);

    if (chkUrl.length !== 0) {
      const obj = {
        long_url : url,
        link : chkUrl,
        id : chkUrl,
        count : addCount+1
      };
      addLink(obj);
      chkUrl = "";
    } else {
      /*const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer c93193d5f6cb7f96e1cd340d125a445cf8b395ef',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "long_url": url })
      });
      const link = await response.json();*/
      // var pattern = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/;
      // var domain = url.match(pattern);
      // domain[1]
      var key = generateRandomString(8);
      const obj = {
        long_url : url,
        link : "http://localhost/" + key,
        id : "http://localhost/" + key,
        count : 1
      };
      addLink(obj);

    }

    event.target.reset();
    event.target.classList.remove('form--invalid');
  }
  catch (error) {
    console.error(error)
  }
};

const handleCopy = (event) => {

  let elements = document.querySelectorAll('.result__btn');

  for (let elem of elements) {
    elem.classList.remove('result__btn--copied');
    elem.innerText = "Copy";
  }

  const btn = event.target;
  const id = btn.dataset.id;
  const input = document.getElementById(id);

  input.select();

  document.execCommand("selectAll", true);
  document.execCommand("copy");

  btn.classList.add('result__btn--copied');
  btn.innerText = "Copied!";
};

form.addEventListener('submit', handleSubmit);

document.addEventListener('DOMContentLoaded', () => {
  storage.forEach((link) => render(link));
});

const pageClear = () => {
  localStorage.clear();
  location.reload();
};

const generateRandomString = (num) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result1= '';
  const charactersLength = characters.length;
  for ( let i = 0; i < num; i++ ) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
}