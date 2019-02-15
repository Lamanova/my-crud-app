function commentContent(comments) {
  if (comments) {
    var commentArr = new Array();
    for (j=0; j < comments.length; j++) {
      commentArr.push(`<li class="list-group-item">${comments[j]}</li>`);
    }
    console.log(commentArr.join(''))
    return $('<div class="col-md-12"><ul class="list-group list-group-flush"></ul></div>').append(commentArr.join('')).html();
  } else {
    return '<div class="col-md-12"> no commments to display </div>';
  }
}
function postContent(postArr) {
  var $accordion = $('<div class="accordion col-md-12" id="accordionExample"></div>')
  for (i = 0; i < postArr.length; i++) {
    $comments = commentContent(postArr[i].comments);
    $card = $(`<div class="card">\
                  <div class="card-header" id="headingOne">\
                    <h2 class="mb-0">\
                      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapseOne">`+
                        postArr[i].title
                      +`</button>\
                    </h2>\
                  </div>\
                  <div id="collapse${i}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">\
                    <div class="card-body">\
                      <h5> Description </h5>` +
                      postArr[i].desc
                    + `</div>\
                    <div class="card-body">\
                      <h5> Comments </h5>` +
                        $comments
                      +`<input class="form-control" id="new-comment-${i}" type="text" placeholder="new comment">\
                      <button class="btn btn-primary btn-sm comment-btn" data-parent="${i}">Add Comment</button>\
                    </div>\
                  </div>\
                </div>`)

    $($accordion).append($card)

  }
  return $accordion
}

$(document).ready(function() {
  var allPosts = JSON.parse(localStorage.getItem('Post'));
  if (localStorage.getItem('Post')) {
    $('.all-posts').append(postContent(allPosts));
  }


  $('.post-link').on('click', function() {
    $('.post-form').show();
    $('.all-posts').hide();
  });

  $('.home-button').on('click', function () {
    if (localStorage.getItem('Post')) {
      $('.all-posts').html(postContent(allPosts));
      $('.all-posts').show();
      $('.post-form').hide();
    }
  })

  $('.form-submit').on('click', function () {
    var title = $('.title-form').val();
    var description = $('.description-form').val();
    var author = $('.author-form').val();
    var postObj = {
      title: $('#inputTitle').val(),
      desc: $('#inputDesc').val(),
      author: $('#inputAuthor').val()
    }
    if (localStorage.getItem('Post') === null) {
      localStorage.setItem('Post', JSON.stringify([postObj]));
    } else {
      var posts = JSON.parse(localStorage.getItem('Post'))
      posts.push(postObj);
      localStorage.setItem('Post', JSON.stringify(posts));
    }

  });

  $('.comment-btn').on('click', function() {
    var allPosts = JSON.parse(localStorage.getItem('Post'));
    var index = parseInt(this.dataset.parent);
    var postObj = allPosts[index];
    var comment = $('#new-comment-'+index).val();
    if (postObj.comments) {
      postObj.comments.push(comment)
    } else {
      postObj['comments'] = [comment]
    }
    allPosts[index] = postObj
    localStorage.setItem('Post', JSON.stringify(allPosts));
    sessionStorage.reloadAfterPageLoad = true;
    sessionStorage.setItem('indexToOpen', index);
    window.location.reload();
  });

  $(function () {
    if ( sessionStorage.reloadAfterPageLoad ) {
      var index = sessionStorage.getItem('indexToOpen');
      $('#collapse'+index).addClass('show');
      sessionStorage.removeItem('indexToOpen');
      sessionStorage.reloadAfterPageLoad = false;
    }
  });

  $('.search').on('click', function(event){
    event.preventDefault();
    var allPosts = JSON.parse(localStorage.getItem('Post'));
    var searchTerm = $('.search-term').val();
    var filteredPosts = allPosts.filter(function(post) {
      return post.title.match(searchTerm);
    });
    $('.all-posts').html(postContent(filteredPosts));
    $('.search-term').val('');
  });
});
