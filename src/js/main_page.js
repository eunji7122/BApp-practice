$(document).ready(() => {
  indexItems();
});

function indexItems() {
  $.ajax({
      'url': 'http://localhost:8000/items',
      'type': 'get',
      'dataType': 'json'
  }).done((items) => {
      for(item of items) {
          const $itemContainer = $(`<div class="item-container" 
          onClick="location.href = '/item-detail.html?id=${item.id}'">
          <img src = ${item.image} alt = "" >
          <p class="item-title">${item.title}</p>
          <p class="item-price">${item.price} KLAY</p>
          </div>`);
          const itemListContainer = $('#item-list-container');
          $itemContainer.appendTo(itemListContainer);
      }

  });
}