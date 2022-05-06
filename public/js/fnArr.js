//封装ajax

{
  let fnArr = window.fnArr = {};
  /**
   * 
   * @param {string} reqType //请求类型
   * @param {string} address //请求地址
   * @param {string} redirect //重定向地址
   * @param {JSON} reqBody //请求体
   */
  fnArr.ajax = function (reqType, address, redirect, reqBody = null) {
    const xhr = new XMLHttpRequest();
    xhr.open(reqType, address);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    reqBody ? xhr.send(reqBody) : xhr.send();
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        const code = xhr.response.err_code;
        const { message } = xhr.response;
        if(code === 0) {
          location.href = redirect;
        } else if(code === 500) {
          alert('服务器忙，请稍后重试!');
          location.reload(true);
        } else if(code === 'stuDorm') {
          location.href = '/stuDorm?dorId=' + xhr.response.dorId;
        } else {
          alert(message);
          location.reload(true);
        }
      }
    }
  };

  
}
