$(function () {
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    });
})

$(function () {
    $('button[name="btn-search"]').click(function () {
        document.location.href = '/?broker=' + $('#brokers').val() + '&daterange=' + $('#daterange').val()
    });
})