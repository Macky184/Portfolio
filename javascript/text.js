'use strict'

const storage = localStorage;// ローカルストレージの参照
const table = document.querySelector('table');// TODO一覧を表示するテーブル要素
const todo = document.getElementById('todo');//TODO入力欄
const priority = document.querySelector('select'); //優先度の選択欄
const deadline = document.querySelector('input[type="date"]') //期日入力欄
const submit = document.getElementById('submit'); //登録ボタン

let list = [];

//ローカルストレージの処理
document.addEventListener('DOMContentLoaded', () => {
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }
  list = JSON.parse(json);
  for (const row of list) {
    addRow(row); //保存されたTODOをテーブルに追加
  }
})

//表追加用の関数
function addRow(row) {
  const tr = document.createElement('tr');
  let colIndex = 0;
  for (const prop in row) {
    const td = document.createElement('td');
    if (prop == 'done') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = row[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener('change', checkBoxListener); //完了状態変更時の処理登録
    }else{
      td.textContent = row[prop]
    }
    tr.appendChild(td);
  }

  // 削除ボタンの作成と処理登録
  table.append(tr);
  const deleteTd = document.createElement('td');
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => {
    const trList = Array.from(document.getElementsByTagName('tr'));
    const idx = trList.indexOf(tr) - 1;
    list.splice(idx, 1); // 配列から該当項目削除
    storage.todoList = JSON.stringify(list); // ローカルストレージ更新
    tr.remove(); // テーブルから行削除
  });
  deleteTd.appendChild(deleteBtn);
  tr.appendChild(deleteTd);
  table.append(tr);
}

//登録ボタンの処理
submit.addEventListener('click', () => {
  const row = {}; //入力値を一時的に格納するオブジェクト
  if (todo.value != '') {
    row.todo = todo.value;
  } else {
    window.alert('TODOを入力してください')
    return
  }

  row.priority = priority.value;
  if (deadline.value != '') {
    row.deadline = deadline.value;
  } else {
    window.alert('期日を入力してください')
    return
  }
  row.done = false;
  //フォームのリセット
  todo.value = '';
  priority.value = '普';
  deadline.value = '';

  addRow(row);

  list.push(row);
  console.log(list)
  storage.todoList = JSON.stringify(list);
});

// 絞り込み
const high_priority = document.createElement('button');
high_priority.textContent = '優先度（高）で絞り込み';
high_priority.id = 'highpriority';
high_priority.className = 'sort-button';
const main = document.querySelector('main');
main.appendChild(high_priority);

high_priority.addEventListener('click', () => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }

  for (const row of list) {
    if (row.priority == '高') {
      addRow(row);
    }
  }
})

const remove = document.createElement('button');
remove.textContent = '完了したTODOを削除する';
remove.id = 'remove';
const br = document.createElement('br');
main.appendChild(br);
main.appendChild(remove);

function clearTable() {
  const trList = Array.from(document.getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
}

remove.addEventListener('click', () => {
  clearTable();
  list = list.filter((row) => row.done == false);
  for (const row of list) {
    addRow(row);
  }
  storage.todoList = JSON.stringify(list);
})

function checkBoxListener(event) {
  const trList = Array.from(document.getElementsByTagName('tr'));
  const currentTr = event.currentTarget.parentElement.parentElement;
  const idx = trList.indexOf(currentTr) - 1;
  list[idx].done = event.currentTarget.checked;
  storage.todoList = JSON.stringify(list);
}

document.getElementById('sort-priority').addEventListener('click', () => {
  const priorityOrder = { '高': 3, '普': 2, '低': 1 };
  list.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  refreshTable();
})

document.getElementById('sort-deadline').addEventListener('click', () => {
  list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  refreshTable();
})

document.getElementById('sort-status').addEventListener('click', () => {
  list.sort((a, b) => a.done - b.done);
  refreshTable();
})

function refreshTable() {
  clearTable();
  for (const row of list) {
    addRow(row);
  }
  storage.todoList = JSON.stringify(list);
}

todo.addEventListener('input', () => {
  todo.style.height = 'auto';
  todo.style.height = todo.scrollHeight + 'px';
});
