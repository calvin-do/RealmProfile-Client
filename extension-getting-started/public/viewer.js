let token = '';
let tuid = '';

const twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
const requests = {
//    set: createRequest('POST', 'cycle'),
//    get: createRequest('GET', 'query'),
    test: createRequest('POST', 'test')
};

function createRequest (type, method) {
    
  return {
    type: type,
    url: location.protocol + '//localhost:8081/color/' + method,
    success: updateBlock,
    error: logError
      
  };
}

function setAuth (token) {
  Object.keys(requests).forEach((req) => {
    twitch.rig.log('Setting auth headers');
    requests[req].headers = { 'Authorization': 'Bearer ' + token };
  });
}

twitch.onContext(function (context) {
  twitch.rig.log(context);
});

twitch.onAuthorized(function (auth) {
  // save our credentials
  token = auth.token;
  tuid = auth.userId;

  // enable the button
  $('#cycle').removeAttr('disabled');

  setAuth(token);
  $.ajax(requests.get);
});

function updateBlock (hex) {
  twitch.rig.log('Updating block color: ' + hex);
  $('#color').css('background-color', hex);
}

function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

$(function () {
  // when we click the cycle button
  $('#postSubmit').click(function () {
  if(!token) { return twitch.rig.log('Not authorized'); }
//    $('#postForm').bind("postSubmit", postForm);
      
    var content = $('#postInput').val();
    twitch.rig.log("This is the content: " + content);
    twitch.rig.log("This is length: " + content.length);
//    twitch.rig.log("This is the requests.test: " + requests.test)  
//    twitch.rig.log("This is the request's data: " + request.data)
//    twitch.rig.log("This is the new request's data: " + request.data)
      
    if (content.length > 0) {
        
        request = requests.test;
        request.data = content;
        twitch.rig.log('Requesting a color cycle');
        $.ajax(request);
        
    }
  });
});
