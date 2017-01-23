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
      let dev = node.dataset.dev.trim();
      let iframeDoc = document.querySelector('#preview').contentWindow.document;
      iframeDoc.querySelectorAll('*').forEach(item => {
        item.removeAttribute('contenteditable');
        item.removeAttribute('attributeeditable');
      });
      let fullDev = dev;
      dev = dev.split(' ');
      let jsonName = dev.splice(-1,1)[0];
      dev = dev.reduce((a, b) => {
        return `${a} ${b}`;
      });

      let fullElement = iframeDoc.querySelector(`[data-dev="${fullDev}"]`);
      let elements = iframeDoc.querySelectorAll(`[data-dev="${dev}"]`);
      if(fullElement && elements.length === 0) {
        elements = [fullElement];
      }
      elements.forEach(element => {
        let targets = element.dataset.devTargets.trim();
        let attributeeditable = [];
        if(targets.includes(':')) {
          if(targets.includes(' ')) {
            targets = targets.split(' ');
          } else {
            targets = [targets];
          }
          targets.forEach(target => {
            let type, nameInHtml, nameInJson;
            let values = target.split(':');
            values[0] = values[0].split('-');
            [[type, nameInHtml], nameInJson] = values;
            if(nameInJson === jsonName) {
              attributeeditable.push(nameInHtml);
            }
          });
        } else {
          let type, nameInHtml;
          let nameInJson = jsonName;
          [type, nameInHtml] = targets.split('-');
          if(nameInJson === jsonName) {
            attributeeditable.push(nameInHtml);
          }
        }
        // TODO: use type for validating input
        attributeeditable.forEach(attribute => {
          if(attributeeditable.includes('content')) {
            element.setAttribute('contenteditable', true);
            attributeeditable.splice(attributeeditable.indexOf('content'), 1);
          }
          if(attributeeditable.length > 0) {
            element.setAttribute(
              'attributeeditable',
              attributeeditable.reduce((a, b) => `${a} ${b}`)
            );
          }
        });
      });
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
    document.querySelector('#preview').srcdoc =
      `
        ${event.target.parentElement.querySelector('iframe').srcdoc}
        <!-- attributeeditable.js -->
        <script src="attributeeditable.js">

        </script>
      `;
  });
});
