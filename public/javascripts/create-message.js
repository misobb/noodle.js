$('[data-role=page]').live('pageshow', function() {
  $("#message-textarea").html("send a message");
  $("#message-textarea").focus(function() {
    $(this).html("");
    $(this).removeClass("contract");
    $(this).addClass("expand");
    $(this).removeClass("no-text");
    $(this).addClass("filled");
    $("#create-message .ui-btn").show();
  });
  $("#message-textarea").focusout(function() {
    var flag = true;
    $("#submit-message").click(function() {
      flag = false;
    });
    if (flag) {
      if ($(this).val() == "") {
        $(this).html("send a message");
        $(this).removeClass("filled");
        $(this).addClass("no-text");
      }
      $(this).removeClass("expand");
      $(this).addClass("contract");
      $("#create-message .ui-btn").hide(flag);
    }
  });
});