let itemId = 0;

$(document).ready(() => {
    console.log(1234)
    const url = new URL(location.href);
    itemId = url.searchParams.get("id");
    getItem(itemId);
})

function getItem(itemId) {
    $.get('http://localhost:8000/items/' + itemId + '/')
        .done((item) => {
            $('.item-image-container > img').attr('src', item.image);
            $('.item-detail-container > p > b').text('상품명: ' + item.title);
            $('.item-detail-container > strong').text('가격: ' + item.price);

            const descElement = $('.item-detail-container > p')[1];
            $(descElement).text('설명: ' + item.description);
        });
}

function purchase() {
    $.ajax({
        url: 'http://localhost:8000/items/' + itemId + '/purchase/',
        type: 'post',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", localStorage.getItem('authorization'));
        },
    }).done((result) => {
        location.href = '/my-items.html';
    });
}