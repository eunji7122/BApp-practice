function login() {
  const username = $('#username').val();
  const password = $('#password').val();
  $.ajax({
    url: 'http://localhost:8000/o/token/',
    type: 'post',
    dataType: 'json',
    data: JSON.stringify({
      grant_type: 'password',
      client_id: 'oXcXbX9rcc1GzCr2E3sIHUydSynt3OOTnKNNU5cl',
      username,
      password
    }),
    success: function(response) {
      console.log(response);
      const token = response.token_type + ' ' + response.access_token;
      localStorage.setItem('token', token);
      location.href = '/main_page.html'
    }
  });
}
