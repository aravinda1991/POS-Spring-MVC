$(document).ready(function () {
    $("#custName").focus();
    loadCustomers();
    showOrHideTableFooter();
    deledeCustomer();

});


// Load Customers to Table
function loadCustomers() {

    var ajaxConfig = {
        method: 'GET',
        url: "http://localhost:8080/api/v1/customers",
        async: true
    };

    $.ajax(ajaxConfig).done(function (customers, txtStatus, jqxhr) {

        $("#tblCustomer tbody tr").remove();

        customers.forEach(function (customer) {

            var html = "<tr>" +
                "<td>" + customer.id + "</td>" +
                "<td>" + customer.name + "</td>" +
                "<td>" + customer.address + "</td>" +
                "<td><i class=\"fas fa-trash\"></i></td>" +
                "</tr>";
            $("tbody").append(html);
            showOrHideTableFooter();
        });

        // Loads to text fileds

        loadDataToFields();

        /* $("#tblCustomer tbody tr").click(function () {

             var id = $(this).find("td:first-child").text();
             var name = $(this).find("td:nth-child(2)").text();
             var address = $(this).find("td:nth-child(3)").text();

             $("#cid").val(id);
             $("#custName").val(name);
             $("#address").val(address);

             $("#cid").attr("disabled", true);
         });*/


        deledeCustomer();

    }).fail(function (jqxhr, txtStatus, errorMsg) {
        console.log(errorMsg);
    });

}

//////////  Customers Save  /////////////////////

$("#btnSave").click(function () {

    var id = $("#cid").val();
    var name = $("#custName").val();
    var address = $("#address").val();

    var validation = true;

    $("#custName, #address").removeClass("invalid");

    if (address.trim().length == 0) {
        validation = false;
        $("#address").addClass("invalid");
        $("#address").focus();
        $("#address").select();
    }

    if (name.trim().length == 0) {
        validation = false;
        $("#custName").addClass("invalid");
        $("#custName").focus();
        $("#custName").select();
    }

    if (!validation) {
        return;
    }

    var customer = {
        id: $("#cid").val(),
        name: $("#custName").val(),
        address: $("#address").val()
    };

    var ajaxConfig = {
        method: 'POST',
        url: 'http://localhost:8080/api/v1/customers',
        async: true,
        data: JSON.stringify(customer),
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (response) {
        $("tblCustomer tbody tr").remove();
        console.log(response);
        if (response) {
            alert("Customer has been Save Sucessfully..!");

        } else {
            alert("Failed to save Customer");
        }
    });


    var html = "<tr>" +
        "<td>" + id + "</td>" +
        "<td>" + name + "</td>" +
        "<td>" + address + "</td>" +
        "<td><i class=\"fas fa-trash\"></i></td>" +
        "</tr>";

    $("#tblCustomer tbody").append(html);
    loadDataToFields();
    deledeCustomer();
    showOrHideTableFooter();

    $("#custName, #address").val("");
    $("#custName").focus();

});

/////////////////////////////////////////////////

function generatedId() {
    var maxId = 0;
    $("#tblCustomer tbody tr td:first-child").each(function () {
        var id = parseInt($(this).text());
        if (id > maxId) {
            maxId = id;
        }
    });
    return ++maxId;
}

function showOrHideTableFooter() {
    if ($("#tblCustomer tbody tr").length > 0) {
        $("#tblCustomer tfoot").hide();
    } else {
        $("#tblCustomer tfoot").show();
    }
}

//  Delete
function deledeCustomer() {

    // $("#tblCustomer tbody tr td:last-child").off('click');

    $("#tblCustomer tbody tr td:last-child").click(function () {
        if (confirm("Are you sure to delete this customer?")) {
            var row = $(this).parents("tr");
            var custId = $(this).parents("tr").find("td:first-child").text();
            console.log(custId);
            row.fadeOut(800, function () {

                var customer = {
                    id: custId
                };

                var ajaxConfig = {
                    method: "DELETE",
                    url: "http://localhost:8080/api/v1/customers/" + custId,
                    async: true,
                    data: JSON.stringify(customer),
                    contentType: "application/json"
                };

                //  Edit here

                $.ajax(ajaxConfig).done(function (resp) {
                    if (resp) {
                        row.remove();

                        alert("Customer has been sucessesfully deleted");

                    } else {
                        alert("Failed to delete customer");
                    }
                    loadCustomers();
                });


                // fail msg display here

            });
        }
    });
}

//  Update Customer
function updateCustomer() {
    $("#btnUpdate").click(function () {

        var customer = {

            name: $("#custName").val(),
            address: $("#address").val()
        };

        var ajaxConfig = {
            method: "PUT",
            url: "http://localhost:8080/api/v1/customers/" + $("#cid").val(),
            async: true,
            data: JSON.stringify(customer),
            contentType: "application/json"
        };

        $.ajax(ajaxConfig).done(function (response, txtStatus, jxhr) {
            console.log("This is a Update Method " + jxhr.status);
            if (jxhr.status == 204) {
                alert("Customer has been updated sucessfully");
            } else {
                alert("Faild to update customer");
            }

            loadCustomers();

            $("#cid, #custName, #address").val("");
            $("#cid").attr("disabled", false);

        }).fail(function (jxhr, txtStatus, errorMsg) {
            console.log(errorMsg);
        });
    });
}

function loadDataToFields() {

    $("#tblCustomer tbody tr").click(function () {

        var id = $(this).find("td:first-child").text();
        var name = $(this).find("td:nth-child(2)").text();
        var address = $(this).find("td:nth-child(3)").text();

        $("#cid").val(id);
        $("#custName").val(name);
        $("#address").val(address);

        $("#cid").attr("disabled", true);
    });
}

function clearFields() {

    $("#cid").val("");
    $("#custName").val("");
    $("#address").val("");

}

$("#btnNewCustomer").click(function () {
    clearFields();
    $("#custName").focus();

});




