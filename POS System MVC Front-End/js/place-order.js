$(document).ready(function () {

    orderDate();
    generateOrderID();
    getAllItems();
    getAllCustomers();

});

//------------------ DroDownCustomer List  ------------------------------
function getAllCustomers() {
    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/api/v1/customers",
        async: true,
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (customers, txtStatus, iqxhr) {
        customers.forEach(function (customer) {

            var html = '<a class="dropdown-item" href="#">' + customer.id + '</a>';
            $("#dropDownCustomer .dropdown-menu").append(html);
        });

        $("#dropDownCustomer .dropdown-menu .dropdown-item").click(function () {
            $("#dropDownCustomer button").text($(this).text());
            var customerId = $(this).text();
            for (var i = 0; i < customers.length; i++) {
                if (customers[i].id == customerId) {
                    $("#custName").val(customers[i].name);
                    break;
                }
            }
        });
    }).fail(function (jqqhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//------------------ dropDownItem List   ------------------------------

function getAllItems() {
    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/api/v1/items",
        async: true,
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (items, txtStatus, iqxhr) {
        items.forEach(function (item) {

            var html = '<a class="dropdown-item" href="#">' + item.code + '</a>'
            $("#dropDownItem .dropdown-menu").append(html);

            $("#dropDownItem .dropdown-menu .dropdown-item").click(function () {
                $("#dropDownItem button").text($(this).text());
                var itemCode = $(this).text();
                for (var i = 0; i < items.length; i++) {
                    if (items[i].code == itemCode) {

                        var rows = $("#tblPlaceOrder tbody tr td:first-child");
                        $("#qtyOnHand").val(items[i].qtyOnHand);
                        for (var j = 0; j < rows.length; j++) {
                            var code = ($(rows[j]).text());
                            if (code === itemCode) {
                                var qty = items[i].qtyOnHand - parseInt($(rows[j]).parents('tr').find("td:nth-child(3)").text());
                                $("#qtyOnHand").val(qty);
                                break;
                            }
                        }


                        $("#unitPrice").val(items[i].unitPrice);
                        $("#description").val(items[i].description);
                        break;
                    }
                }
            });
        });
    }).fail(function (jqxhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    })
}

//------------------ Add Button   ------------------------------
var total = 0.00;

$("#btnAdd").click(function () {

    var itemCode = $("#dropDownItem button").text();
    var description = $("#description").val();
    var qty = $("#qty").val();
    var unitPrice = $("#unitPrice").val();
    var amount = unitPrice * qty;
    total = total + amount;

    if ($("#custName").val().length == 0) {
        $("#dropDownCustomer").focus();
        $("#dropDownCustomer").css("border-color", "red");
        alert("Please select a customer");
        return;
    }

    if ($("#description").val().length == 0) {
        $("#dropDownItem").focus();
        alert("Please select a item");
        return;
    }

    if (parseInt($("#qty").val()) > parseInt($("#qtyOnHand").val())) {
        $("#qty").focus();
        $("#qty").select();
        alert("Quantity on hand is not enough");
        return;
    }

    if (parseInt(qty) < 1) {
        alert("Invalid Qty.");
        $("#qty").select();
        return;
    }

    var rows = $("#tblPlaceOrder tbody tr");
    var selectedItemCode = $("#dropDownItem button").text();
    for (var i = 0; i < rows.length; i++) {
        if ($(rows[i]).find("td:first-child").text() === selectedItemCode) {
            var existingQty = parseInt($(rows[i]).find("td:nth-child(3)").text());
            qty = parseInt(qty) + existingQty;
            $(rows[i]).find("td:nth-child(3)").text(qty);
            clearFields();
            return;
        }
    }

    var html = "<tr>" +
        "<td>" + itemCode + "</td>" +
        "<td>" + description + "</td>" +
        "<td>" + qty + "</td>" +
        "<td>" + unitPrice + "</td>" +
        "<td>" + amount + "</td>" +
        "<td><i class=\"fas fa-trash\"></i></td>" +
        "</tr>";

    $("#tblPlaceOrder tbody").append(html);

    calculateTotal();
    clearFields();

    $("#tblPlaceOrder tbody tr td i").off("click");
    $("#tblPlaceOrder tbody tr td i").click(function () {
        if (confirm("Are you sure to delete this order?")) {
            var row = $(this).parents("tr");
            console.log(row);
            row.fadeOut(995, function () {
                row.remove();
                calculateTotal();
                //  clearFields();

            });
        }
    });
});

//------------------ Calculate Total  ------------------------------

function calculateTotal() {
    var total = 0;
    var rows = [];
    rows = $("#tblPlaceOrder tbody tr td:nth-child(5)");
    console.log(rows.length);
    for (var i = 0; i < rows.length; i++) {
        console.log(i);

        total += parseFloat(rows[i].innerHTML);
        console.log(rows[i].innerHTML);
    }
    $("#lblTotal").text(total);

}


//------------------ Place Order Button  ------------------------------


$("#btnPlaceOrder").click(function () {

    /* var custName = $("#custName").val();
     if ($.trim(custName.length == 0)) {
         alert("Select a Customer");
         $("#dropDownCustomer").css("border-color", "red");
         $("#dropDownCustomer").focus();
         $("#unitPrice").val("");
         $("#qtyOnHand").val("");
         $("#qty").val("");
         return;
     }*/

    var orderId = $("#lblOrderId").text().trim();
    var orderDate = $("#lblOrderDate").text().trim();
    var custId = $("#dropDownCustomer button").text().trim();

    orderId = parseInt(orderId.replace("OD", ""));

    var ordersDetail = [];
    var rows = $("#tblPlaceOrder tbody tr");

    for (var i = 0; i < rows.length; i++) {

        var element = rows[i];
        var itemCode = $(element).find("td:first-child").text();
        var qty = parseInt($(element).find("td:nth-child(3)").text());
        var unitPrice = parseFloat($(element).find("td:nth-child(4)").text());
        ordersDetail.push({
            orderId: orderId,
            itemCode: itemCode,
            qty: qty,
            unitPrice: unitPrice
        });
    }

    console.log(ordersDetail);

    var orderValue = {

        // 009
        orderId: orderId,
        orderDate: orderDate,
        customerId: custId,
        orderDetails: ordersDetail
    };

    var ajaxConfig = {
        method: "POST",
        url: "http://localhost:8080/api/v1/orders",
        async: true,
        data: JSON.stringify(orderValue),
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (response, txtStatus, jqxhr) {

        console.log(response);

        if (response.status = 200) {
            alert("Order has been sucessfully added");
            $("#tblPlaceOrder tbody tr").remove();
            $("#lblTotal").text("");
            $("#custName").val("");
            $("#dropDownCustomer").find("button").text("select customer");
            total = 0;
            clearFields();
            generateOrderID();
        } else {
            alert("Faild to save order");
        }
    }).fail(function (jqxhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    });
    clearFields();
});


//---------------Table Footer------------------------------------
function showOrHideTableFooter() {
    if ($("#tblPlaceOrder tbody tr").length > 0) {
        $("#tblPlaceOrder tfoot").hide();
    } else {
        $("#tblPlaceOrder tfoot").show();
    }
}


//---------------orderDate------------------------------------
function orderDate() {

    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var newDate = myDate.getFullYear() + '-' + month + '-' + myDate.getDate();
    $("#lblOrderDate").text(newDate);
}


$("#btnNewItem").click(function () {

    $("#dropDownCustomer").find("button").text("Select Customer");
    $("#dropDownItem").find("button").text("Select Item");
    $("#custName").val("");
    $("#description").val("");
    $("#unitPrice").val("");
    $("#qtyOnHand").val("");
    $("#qty").val("");
});


//-----------------generateOrderID-------------------------------------------
function generateOrderID() {

    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/api/v1/orders",
        async: true
    };

    $.ajax(ajaxConfig).done(function (orderId, txtStatus, iqxhr) {

        // var lastOrderId = orders[orders.length - 1].id;
        var newOrderId = orderId;
        // OD004 OD4
        if (newOrderId < 10) {
            $("#lblOrderId").text("OD00" + newOrderId);
        } else if (newOrderId < 100) {
            $("#lblOrderId").text("OD0" + newOrderId);
        } else {
            $("#lblOrderId").text("OD" + newOrderId);
        }

    }).fail(function (jqxhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//-----------------clearFields-------------------------------------------

function clearFields() {

    $("#dropDownItem").find("button").text("Select Item");
    $("#description").val("");
    $("#unitPrice").val("");
    $("#qtyOnHand").val("");
    $("#qty").val("");
}



