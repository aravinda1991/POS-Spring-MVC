$(document).ready(function () {
    $("#description").focus();
    loadItems();

});

//////////  Load Items to Table  //////////////
function loadItems() {

    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/api/v1/items",
        async: true
        //contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (items, txtStatus, jqxhr) {

        $("#tblItem tbody tr").remove();

        items.forEach(function (item) {
            var html = "<tr>" +
                "<td>" + item.code + "</td>" +
                "<td>" + item.description + "</td>" +
                "<td>" + item.qtyOnHand + "</td>" +
                "<td>" + item.unitPrice + "</td>" +
                "<td><i class=\"fas fa-trash\"></i></td>" +
                "</tr>";

            $("#tblItem tbody").append(html);
            showOrHideTableFooter();
        });

        /////// Load to text fields  ///////
        $("#tblItem tbody tr").click(function () {

            var itemCode = $(this).find("td:first-child").text();
            var description = $(this).find("td:nth-child(2)").text();
            var qty = $(this).find("td:nth-child(3)").text();
            var unitPrice = $(this).find("td:nth-child(4)").text();

            $("#itemCode").val(itemCode);
            $("#description").val(description);
            $("#qty").val(qty);
            $("#unitPrice").val(unitPrice);

            $("#itemCode").attr("disabled", true);
        });

        deleteItem();

    }).fail(function (jqxhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    });
}

/////////////  Items Save  /////////////////////////

$("#btnSave").click(function () {

    var item = {
        code: $("#itemCode").val(),
        description: $("#description").val(),
        qtyOnHand: parseInt($("#qty").val()),
        unitPrice: parseFloat($("#unitPrice").val())
    };

    var ajaxConfig = {
        method: 'POST',
        url: 'http://localhost:8080/api/v1/items',
        async: true,
        data: JSON.stringify(item),
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (response) {

        console.log(response);
        if (response) {
            alert("Item has been Save Sucessfully ");
            deleteItem();
        } else {
            alert("Failed to save item")
        }
    });

    var code = $("#itemCode").val();
    var description = $("#description").val();
    var qty = $("#qty").val();
    var unitPrice = $("#unitPrice").val();

    var validation = true;

    $("#description, #qty, #unitPrice").removeClass("invalid");

    if (unitPrice.trim().length == 0) {
        validation = false;
        $("#unitPrice").addClass("invalid");
        $("#unitPrice").focus();
        $("#unitPrice").select();
    }

    if (qty.trim().length == 0) {
        validation = false;
        $("#qty").addClass("invalid");
        $("#qty").focus();
        $("#qty").select();
    }

    if (description.trim().length == 0) {
        validation = false;
        $("#description").addClass("invalid");
        $("#description").focus();
        $("#description").select();
    }

    if (!validation) {
        return;
    }

    var html = "<tr>" +
        "<td>" + code + "</td>" +
        "<td>" + description + "</td>" +
        "<td>" + qty + "</td>" +
        "<td>" + unitPrice + "</td>" +
        "<td><i class=\"fas fa-trash\"></i></td>" +
        "</tr>";

    $("#tblItem tbody").append(html);
    showOrHideTableFooter();

    $("#description, #qty, #unitPrice").val("");
    $("#description").focus();

});

//////////////////////////////////////////////////////


function generatedId() {
    var maxId = 0;
    $("#tblItem tbody tr td:first-child").each(function () {
        var id = parseInt($(this).text());
        if (id > maxId) {
            maxId = id;
        }
    });
    return ++maxId;
}

function showOrHideTableFooter() {
    if ($("#tblItem tbody tr").length > 0) {
        $("#tblItem tfoot").hide();
    } else {
        $("#tblItem tfoot").show();
    }
}

function deleteItem() {

    $("#tblItem tbody tr td:last-child").click(function () {
        if (confirm("Are you sure to delete this customer?")) {
            var row = $(this).parents("tr");
            var itemCode = $(this).parents("tr").find("td:first-child").text();
            console.log(itemCode);
            row.fadeOut(800, function () {

                var item = {
                    code: itemCode
                };

                var ajaxConfig = {
                    method: "DELETE",
                    url: "http://localhost:8080/api/v1/items/" + itemCode,
                    async: true,
                    data: JSON.stringify(item),
                    contentType: "application/json"
                };

                $.ajax(ajaxConfig).done(function (resp) {
                    if (resp) {
                        row.remove();
                        //  $("#tblItem tbody tr").remove();
                        alert("Failed to delete item");

                    } else {
                        alert("Item has been sucessfully deleted");
                    }
                    loadItems();
                });
            });
        }
    });
}

////////////////////  Update Item  ////////////////////

$("#btnUpdate").click(function () {

    var item = {

        description: $("#description").val(),
        unitPrice: parseFloat($("#unitPrice").val()),
        qtyOnHand: parseInt($("#qty").val())
    };

    var ajaxConfig = {
        method: "PUT",
        url: "http://localhost:8080/api/v1/items/" + $("#itemCode").val(),
        async: true,
        data: JSON.stringify(item),
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (response, txtStatus, jxhr) {

        if (response) {
            alert("Failed to update item");
        } else {

            alert("Item has been updated suecessfully");
        }

        loadItems();

        $("#itemCode, #description, #unitPrice, #qty").val("");
        $("#itemCode").attr("disabled", false);

    }).fail(function (jxhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    });
});

function clearFields() {

    $("#itemCode").val("");
    $("#description").val("");
    $("#qty").val("");
    $("#unitPrice").val("");

}

$("#btnNewItem").click(function () {
    clearFields();
    $("#description").focus();
});