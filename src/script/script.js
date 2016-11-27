let buttons = document.querySelectorAll('.container__button--device');
buttons.forEach((element) => {
    element.addEventListener('click', (event) => {
      buttons.forEach((element) => {
        element.classList.remove('container__button--selected');
      });
      document
        .querySelectorAll('.page-list__screen')
        .forEach((element) => {
          element.className = 'page-list__screen';
          element.classList.add('page-list__screen--'+event.target.getAttribute('data-type'));
        });
      event.target.classList.add('container__button--selected');
    });
});

let treeGroups = document.querySelectorAll('.tree li span');
treeGroups.forEach(element => {
  element.addEventListener('click', (event) => {
    let node = event.target.parentElement;
    if(node.classList.contains('selected')) {
      node.classList.remove('selected');
    } else {
      treeGroups.forEach(element => element.parentElement.classList.remove('selected'));
      node.classList.add('selected');
    }
  });
  if(event) event.stopPropagation();
});

let trees = document.querySelectorAll('.wrapper-tree');
let editPage = document.querySelectorAll('.page-list__edit');
editPage.forEach(element => {
  element.addEventListener('click', (event) => {
    trees.forEach(tree => {
      if(!tree.classList.contains('hidden-tree'))
        tree.classList.add('hidden-tree');
    });
    document.querySelectorAll('.page-list__item').forEach((page) => {
      if(page.classList.contains('selected'))
        page.classList.remove('selected');
    });
    event.target.parentElement.classList.add('selected');
    document.querySelector(
      `.wrapper-tree[data-url='${event.target.dataset.url}']`
    ).classList.remove('hidden-tree');
    document.querySelector('#preview').srcdoc = event.target.parentElement.querySelector('iframe').srcdoc;
  });
});
