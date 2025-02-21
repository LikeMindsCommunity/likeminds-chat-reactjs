function insertAtTop(element) {
    var parent = document.querySelector("head");
    var lastInsertedElement = window._lastElementInsertedByStyleLoader;
  
    if (!lastInsertedElement) {
      parent.insertBefore(element, parent.firstChild);
    } else if (lastInsertedElement.nextSibling) {
      parent.insertBefore(element, lastInsertedElement.nextSibling);
    } else {
      parent.appendChild(element);
    }
  
    window._lastElementInsertedByStyleLoader = element;
  }
  
  module.exports = insertAtTop;