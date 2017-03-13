// Document ready function
$(document).ready(function () {
    loadCategory();
    // on click for our add button
    $('#add-button').click(function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'category',
            data: JSON.stringify({
                firstName: $('#add-category-name').val(),
                lastName: $('#add-categorydetails-name').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json'
        }).success(function (data, status) {
            $('#add-category-name').val('');
            $('#add-categorydetails-name').val('');
            
            loadCategory();
            $('#validationErrors').empty();
        }).error(function (data, status) {
            $('#validationErrors').empty();
            $.each(data.responseJSON.fieldErrors, function (index, validationError) {
                var errorDiv = $('#validationErrors');
                errorDiv.append(validationError.message).append($('<br>'));
            });
        });
    });
    $('#edit-button').click(function (event) {
// prevent the button press from submitting the whole page
        event.preventDefault();

        $.ajax({
            type: 'PUT',
            url: 'category/' + $('#edit-category-id').val(),
            data: JSON.stringify({
                categoryId: $('#edit-category-id').val(),
                categoryName: $('#edit-category-name').val(),
                categoryDetails: $('#edit-categorydetails-name').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json'
        }).success(function () {
            loadCategory();
            $('#editModal').modal('hide');
        });
    });
});
//==========
// FUNCTIONS
//==========

function loadCategory() {
    $.ajax({
        url: "category"
    }).success(function (data, status) {
        fillCategoryTable(data, status);
    });
}
function fillCategoryTable(categoryList, status) {
// clear the previous list
    clearCategoryTable();
// grab the tbody element that will hold the new list of category
    var cTable = $('#contentRows');
// render the new category data to the table
    $.each(categoryList, function (index, category) {
        cTable.append($('<tr>')
                .append($('<td>')
                        .append($('<a>')
                                .attr({
                                    'data-category-id': category.categoryId,
                                    'data-toggle': 'modal',
                                    'data-target': '#detailsModal'
                                })
                                .text(category.categoryName)
                                ) 
                        ) 
                .append($('<td>').text(category.categoryDetails))
                
                .append($('<td>')
                        .append($('<a>')
                                .attr({
                                    'data-category-id': category.categoryId,
                                    'data-toggle': 'modal',
                                    'data-target': '#editModal'
                                })
                                .text('Edit')
                                ) 
                        ) 
                .append($('<td>')
                        .append($('<a>')
                                .attr({
                                    'onClick': 'deleteCategory(' +
                                            category.categoryId + ')'
                                })
                                .text('Delete')
                                )
                        ) 
                ); 
    });
}




function deleteCategory(id) {
    var answer = confirm("Do you really want to delete this category?");
    if (answer === true) {
        $.ajax({
            type: 'DELETE',
            url: 'category/' + id
        }).success(function () {
            loadCategory();
        });
    }
}
// Clear all content rows from the summary table
function clearCategoryTable() {
    $('#contentRows').empty();
    $('#notfound').empty();
}

$('#detailsModal').on('show.bs.modal', function (event) {

    var element = $(event.relatedTarget);

    var categoryId = element.data('category-id');


    var modal = $(this);
    $.ajax({
        type: 'GET',
        url: 'category/' + categoryId
    }).success(function (category) {
        modal.find('#category-id').text(category.categoryId);
        modal.find('#category-name').text(category.categoryName);
        modal.find('#category-details').text(category.categoryDetails);
        
    });
});
$('#editModal').on('show.bs.modal', function (event) {
    var element = $(event.relatedTarget);
    var categoryId = element.data('category-id');
    var modal = $(this);
    $.ajax({
        type: 'GET',
        url: 'category/' + categoryId
    }).success(function (category) {
        modal.find('#category-id').text(category.categoryId);
        modal.find('#edit-category-id').val(category.categoryId);
        modal.find('#edit-category-name').val(category.categoryName);
        modal.find('#edit-categorydetails-name').val(category.categoryDetails);
        
    });
});


