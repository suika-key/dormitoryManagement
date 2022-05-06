const addStuBtn = document.getElementById('addStuBtn');
const bg = document.getElementById('bg');
const addStu = document.getElementById('addStu');
const closeBtn = document.getElementById('closeBtn');
const deleteBg = document.querySelector('.delete');
const deleteBox = document.querySelector('.delete .modal-content');
const delBtn = document.querySelectorAll('.deleteBtn');
const form = document.querySelector('.form');
const stuKey = document.getElementById('stuKey');
const stuName = document.getElementById('stuName');
const college = document.getElementById('college');
const major = document.getElementById('major');
const dorId = document.getElementById('dorId');
const modifyBtn = document.querySelectorAll('.modifyBtn');
const submitBtn = document.getElementById('submit');
const changeBg = document.querySelector('.change');
const changeBox = document.querySelector('.change .modal-content');
const changeBtn = document.querySelectorAll('.changeBtn');
const cancelChange = document.getElementById('cancelChange');
addStuBtn.addEventListener('click', function() {
  bg.style.display = 'block';
  addStu.style.display = 'block';
  const h5 = document.querySelector('.heading');
  h5.innerHTML = '添加学生';
});
closeBtn.addEventListener('click', function() {
  bg.style.display = 'none';
  addStu.style.display = 'none';
  stuKey.parentNode.style.display = 'block';
  dorId.parentNode.style.display = 'block';
  addStu.removeAttribute('style');
  submitBtn.style.display = 'block';
  //删除新添加的按钮
  if(form.lastElementChild.className.includes('newBtn')) {
    form.removeChild(form.lastElementChild);
  }
});
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const stuSex = document.querySelector("input[name='stuSex']:checked");
  const formObj = {
    [stuKey.name]: stuKey.value,
    [stuName.name]: stuName.value,
    [stuSex.name]: stuSex.value,
    [college.name]: college.value,
    [major.name]: major.value,
    [dorId.name]: dorId.value
  };
  const formStr = JSON.stringify(formObj);
  fnArr.ajax('POST', '/stuManage', '/stuManage', formStr);
});
[...delBtn].map(item => {
  item.addEventListener('click', function() {
    deleteBg.style.display = 'block';
    deleteBox.style.display = 'block';
    const affirm = document.getElementById('affirm');
    function affirmFn() {
      const clickId = item.parentNode.parentNode.children[1].innerHTML;
      fnArr.ajax('DELETE', '/deleteStu?stuKey=' + clickId, '/stuManage');
    }
    affirm.addEventListener('click', affirmFn);
    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', function() {
      deleteBg.style.display = 'none';
      deleteBox.style.display = 'none';
      affirm.removeEventListener('click', affirmFn);
    });
  });
});
[...modifyBtn].map(item => {
  item.addEventListener('click', function() {
    bg.style.display = 'block';
    addStu.style.display = 'block';
    const h5 = document.querySelector('.heading');
    h5.innerHTML = '修改学生数据';
    stuKey.parentNode.style.display = 'none';
    dorId.parentNode.style.display = 'none';
    addStu.style.height = '310px';
    //隐藏提交按钮
    submitBtn.style.display = 'none';
    //生成一个新按钮用来提交表单
    const newBtn = document.createElement('button');
    newBtn.classList.add('btn', 'btn-primary', 'newBtn');
    newBtn.setAttribute('type', 'button');
    newBtn.innerHTML = '修改';
    form.appendChild(newBtn);
    newBtn.addEventListener('click', function() {
      const stuSex = document.querySelector("input[name='stuSex']:checked");
      //获取stuKey
      const stuKeyVal = item.parentNode.parentNode.children[1].innerHTML;
      const formObj = {
        [stuKey.name]: stuKeyVal,
        [stuName.name]: stuName.value,
        [college.name]: college.value,
        [major.name]: major.value,
        [stuSex.name]: stuSex.value
      };
      const formStr = JSON.stringify(formObj);
      fnArr.ajax('PUT', '/modifyStu', '/stuManage', formStr);
    });
  });
});
[...changeBtn].map(item => {
  item.addEventListener('click', function() {
    changeBg.style.display = 'block';
    changeBox.style.display = 'block';
    const changeForm = document.querySelector('.changeForm');
    function changeFn(e) {
      e.preventDefault();
      const clickId = item.parentNode.parentNode.children[1].innerHTML;
      const changeDorId = document.getElementById('changeDorId');
      if(changeDorId.value === item.parentNode.parentNode.children[6].innerHTML) {
        alert('更换的是原来的宿舍!');
        location.reload(true);
        return;
      }
      const formObj = {
        [stuKey.name]: clickId,
        [changeDorId.name]: changeDorId.value
      };
      const formStr = JSON.stringify(formObj);
      fnArr.ajax('PUT', '/changeDorm', '/stuManage', formStr);
    };
    changeForm.addEventListener('submit', changeFn);
    cancelChange.addEventListener('click', function() {
      changeBg.style.display = 'none';
      changeBox.style.display = 'none';
      changeForm.removeEventListener('submit', changeFn);
    });
  });
});