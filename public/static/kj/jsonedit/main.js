function track(action) {
  if (typeof _gaq !== 'undefined') {
    _gaq.push(['_trackEvent', 'JSON', action]);
  }
}

(function () {
  // var json = {
  //   code: 200,
  //   msg: 'ok',
  //   data: [
  //     {
  //       create_time: '2020-04-25T08:34:11.114Z',
  //       status: 1,
  //       isAdmin: false,
  //       _id: '5ea3f61ec21c9e05e3635891',
  //       username: '梦回',
  //       password: '94ce929ee317aac8adc19889508b75cb',
  //       role: '网站编辑',
  //       sex: '男',
  //     },
  //   ],
  //   dataCount: 1,
  // };

  if ($('#json').val()) {
    json = JSON.parse($('#json').val());
  }

  var viz = vizcluster;

  $('#visualize').on('click', function () {
    track('Visualize');
    viz(json);
    $('#vizpanel').show();
  });

  function printJSON() {
    $('#json').val(JSON.stringify(json));
    //viz(json);
  }

  function updateJSON(data) {
    json = data;
    printJSON();
  }

  function printPath(path) {
    $('#property-path').text(path);
  }

  $('.jointjs-small-banner label').on('click', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $('.jointjs-small-banner').remove();
  });

  $(document).ready(function () {
    $('#json-query').change(function () {
      var matches;
      try {
        matches = JSONSelect.match($(this).val(), json);
      } catch (e) {
        matches = e.message;
      }

      $('#json-query-result').text(JSON.stringify(matches));
    });

    var exampleRequest = $('.example-request').text();
    if (exampleRequest) {
      var exampleRequestHighlighted = urlhighlight({ url: exampleRequest });
      $('.example-request').replaceWith(exampleRequestHighlighted);
    }

    var exampleResponse = $('pre.example-response').text();
    if (exampleResponse) {
      var exampleResponseEditor = $(
        '<div class="example-response json-editor"/>'
      );

      exampleResponseEditor.jsonEditor(JSON.parse(exampleResponse));
      $('pre.example-response').replaceWith(exampleResponseEditor);
    }

    $('.rate').click(function (evt) {
      evt.preventDefault();

      var serviceId = $(this).data('service-id');

      var goodOrBad = $(this).hasClass('rate-good') ? 'good' : 'bad';

      var counter = $(this).prevAll('.counter');

      $.post('/rate-service/' + goodOrBad + '/' + serviceId, function (rate) {
        counter.text(rate);
      });
    });

    $('#beautify').click(function (evt) {
      track('Beautify');
      evt.preventDefault();
      var jsonText = $('#json').val();
      $('#json').val(JSON.stringify(JSON.parse(jsonText), null, 4));
    });

    $('#uglify').click(function (evt) {
      track('Uglify');
      evt.preventDefault();
      var jsonText = $('#json').val();
      $('#json').val(JSON.stringify(JSON.parse(jsonText)));
    });

    $('#permalink').click(function (evt) {
      evt.preventDefault();
      track('Permalink');
      var jsonText = $('#json').val();

      var xhr = $.ajax({
        url: '/permalink',
        type: 'POST',
        dataType: 'json',
        data: {
          json: JSON.parse(jsonText),
        },
      });

      xhr.success(function (data, textStatus, xhr) {
        $('#permalink-link').attr('href', data.permalink).text(data.permalink);

        $('#permalink-modal').modal('show');
      });

      xhr.error(function (xhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      });
    });

    $('#rest > button').click(function () {
      track('REST');
      var url = $('#rest-url').val();
      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: $('#rest-callback').val(),
        success: function (data) {
          json = data;
          $('#editor').jsonEditor(json, {
            change: updateJSON,
            propertyclick: printPath,
          });
          printJSON();
        },
        error: function () {
          alert(
            'Something went wrong, double-check the URL and callback parameter.'
          );
        },
      });
    });

    $('#json').change(function () {
      var val = $('#json').val();

      if (val) {
        try {
          json = JSON.parse(val);
        } catch (e) {
          alert('Error in parsing json. ' + e);
        }
      } else {
        json = {};
      }

      $('#editor').jsonEditor(json, {
        change: updateJSON,
        propertyclick: printPath,
      });
      //viz(json);
    });

    $('#expander').click(function () {
      var editor = $('#editor');
      editor.toggleClass('expanded');
      $(this).text(editor.hasClass('expanded') ? 'Collapse' : 'Expand all');
    });

    printJSON();
    $('#editor').jsonEditor(json, {
      change: updateJSON,
      propertyclick: printPath,
    });
  });
})();
