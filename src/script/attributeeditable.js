let observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if(mutation.attributeName === "attributeeditable") {
      if(mutation.target.hasAttribute("attributeeditable") && mutation.target.getAttribute("attributeeditable") !== 'false') {
        createPopovers();
      } else {
        editAttributes(mutation.target);
        mutation.target.removeAttribute("data-attributeeditable");
      }
    }
    if(mutation.type === "attributes") {
      let selector = `
        #${mutation
          .target
          .dataset
          .attributeeditable
         } input[title=${mutation.attributeName}]`;
      let input = document.querySelector(selector);
      if(input) {
        input.value = mutation
        .target
        .getAttribute(mutation.attributeName);
      }
    }
  });
});

function editHost(element, id, name) {
  let host = document.querySelector(
    `[data-attributeeditable="${id}"]`
  );
  host.setAttribute(name, element.value);
}


function editAttributes(element, attributes) {
  let id = Array.from('            ')
  	.map(c => String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  let rect = element.getBoundingClientRect();
  let oldPopover = document.querySelector(`#${element
                                          .dataset
                                          .attributeeditable}`);
  console.log(element);
  if(oldPopover) {
    oldPopover.parentElement.parentElement.removeChild(oldPopover.parentElement);
  }
  if(attributes) {
    let popover = document.createElement('div');
    element.setAttribute('data-attributeeditable', id);
    popover.innerHTML = `
          <style scoped>
            #${id} {
              font-family: "Segoe UI";
              font-size: 11.8px;
              display: inline-block;
              background: #fff;
              padding: 3px 4px;
              position: absolute;
              left: ${rect.left + rect.width / 2}px;
              top: ${rect.top + rect.height}px;
              border: solid 1px #767676;
              color: #575757;
              filter: drop-shadow(3px 3px 1px rgba(0, 0, 0, 0.44));
            }
          </style>

          <div id=${id}></div>
    `;
    document.body.appendChild(popover);
    let form = document.querySelector(`#${id}`);
    let formContent = '';
    Array.prototype.slice.call(element.attributes)
      .forEach(attribute => {
        if(!attribute.name.includes('attributeeditable') && (attributes === true || attributes.includes(attribute.name))) {
          formContent += `<input title="${attribute.name}" placeholder="${attribute.name}" value="${attribute.value}" onkeyup="editHost(this, '${id}', '${attribute.name}')" onkeydown="editHost(this, '${id}', '${attribute.name}')"><br>`;
        }
      });
    form.innerHTML = formContent;
  }
}

document.querySelectorAll('*').forEach(element => {
  observer.observe(element, { attributes: true });
});

function createPopovers() {
  document.querySelectorAll('[attributeeditable]').forEach(element => {
    let attr = element.getAttribute('attributeeditable');
    if(attr.includes(' ')) {
      attr = attr.split(' ');
    } else if (attr === '') {
      attr = true;
    } else {
      attr = new Array(attr);
    }
    editAttributes(element, attr);
  });
}

createPopovers();
