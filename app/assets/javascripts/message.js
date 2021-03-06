$(function() {
  function buildHTML(message) {
    var image = message.image ? `<img class="lower-message__image" src=${message.image}>` : ``

      var html = `<div class="message" data-message-id="${message.id}">
                    <div class="main__contents__box">
                      <div class="main__contents__box__name">
                        ${message.user_name}
                      </div>
                      <div class="main__contents__box__date">
                        ${message.date}
                      </div>
                    </div>
                    <div class="main__contents__message">
                      ${message.content}
                      ${image}
                    </div>`
    return html
  }
  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message) {
      var html = buildHTML(message);
      $('.main__contents').append(html);
      $('#new_message')[0].reset();
      $('.main__form__input--submit').prop('disabled', false);
      $('.main__contents').animate({ scrollTop: $('.main__contents')[0].scrollHeight});
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.main__form__input--submit').prop('disabled', false);
    })
  })
  $(function() {
    var reloadMessages = function() {
    var href = 'api/messages'
      if (window.location.href.match(/\/groups\/\d+\/messages/)){
        last_message_id = $('.message:last').data("message-id");
        $.ajax({
          url: href,
          type: 'GET',
          dataType: 'json',
          data: {id: last_message_id}
        })
        .done(function(messages) {
          var insertHTML = '';
          messages.forEach(function (message) {
            insertHTML += buildHTML(message);
            $('.main__contents').append(insertHTML);
        })
        $('.main__contents').animate({scrollTop: $('.main__contents')[0].scrollHeight}, 'fast');
      })
        .fail(function() {
          alert('自動更新に失敗しました');
      });
    };
  };
  setInterval(reloadMessages, 7000);
  });
});
