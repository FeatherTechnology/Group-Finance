//Scheme Name Multi select initialization
const scheme_choices = new Choices('#scheme_name', {
    removeItemButton: true,
    noChoicesText: 'Select Scheme Name',
    allowHTML: true
});
const profit_type = new Choices('#profit_type', {
    removeItemButton: true,
    noChoicesText: 'Select Profit Type',
    allowHTML: true
});
$(document).ready(function () {
    $('.add_loancategory_btn, .back_to_loancategory_btn').click(function () {
        clearLoanCategoryCreationForm();
        swapTableAndCreation();
    });

    $('.interest_minmax').change(function () {
        checkMinMaxValue('#interest_rate_min', '#interest_rate_max');
    });

    $('.due_period_minmax').change(function () {
        checkMinMaxValue('#due_period_min', '#due_period_max');
    });

    $('.doc_charge_minmax').change(function () {
        checkMinMaxValue('#doc_charge_min', '#doc_charge_max');
    });

    $('.processing_minmax').change(function () {
        checkMinMaxValue('#processing_fee_min', '#processing_fee_max');
    });

    $('.scheme-penalty-type').click(function () {
        let typeValueScheme = $(this).find('input').val();
        let typeScheme = (typeValueScheme == 'percent') ? '%' : '₹';
        $('.scheme-penalty-span-val').text(typeScheme);
        $('#scheme_penalty_type').val(typeValueScheme);
    });
    $('.calculation-type').click(function () {
        let typeValue = $(this).find('input').val(); 
        let type = (typeValue == 'percent') ? '%' : '₹'; 
        $('.calculation-span-val').text(type); 
        $('#penalty_type').val(typeValue); 

    });
    
    $('.scheme_interest_minmax').change(function () {
        checkMinMaxValue('#scheme_interest_rate_min', '#scheme_interest_rate_max');
    });
    $('.scheme_due_period_minmax').change(function () {
        checkMinMaxValue('#scheme_due_period_min', '#scheme_due_period_max');
    });
    $('.scheme_doc_minmax').change(function () {
        checkMinMaxValue('#scheme_doc_charge_min', '#scheme_doc_charge_max');
    });

    $('.scheme_processing_minmax').change(function () {
        checkMinMaxValue('#scheme_processing_fee_min', '#scheme_processing_fee_max');
    });

    $('#scheme_name').change(function () {
        getSchemeListTable($(this).val());
    });

    /////////////////////////////////////////////////////Loan Category Modal START///////////////////////////////////////////////////
    $('#submit_addloan_category').click(function () {
        event.preventDefault();
        let loanCategoryName = $('#addloan_category_name').val(); let id = $('#addloan_category_id').val();
        var data = ['addloan_category_name']

        var isValid = true;
        data.forEach(function (entry) {
            var fieldIsValid = validateField($('#' + entry).val(), entry);
            if (!fieldIsValid) {
                isValid = false;
            }
        });

        if (loanCategoryName != '') {
            if (isValid) {
                $.post('api/loan_category_creation/submit_loan_category.php', { loanCategoryName, id }, function (response) {
                    if (response == '1') {
                        swalSuccess('Success', 'Loan Category Added Successfully!');
                    } else if (response == '0') {
                        swalSuccess('Success', 'Loan Category Updated Successfully!');
                    } else if (response == '2') {
                        swalError('Warning', 'Loan Category Already Exists!');
                    }

                    getLoanCategoryTable();
                }, 'json');
                clearLoanCategory(); //To Clear All Fields in Loan Category creation.
            }

        }
    });

    $(document).on('click', '.loancatActionBtn', function () {
        var id = $(this).attr('value'); // Get value attribute
        $.post('api/loan_category_creation/get_loan_category_data.php', { id }, function (response) {
            $('#addloan_category_id').val(id);
            $('#addloan_category_name').val(response[0].loan_category);
        }, 'json');
    });

    $(document).on('click', '.loancatDeleteBtn', function () {
        var id = $(this).attr('value'); // Get value attribute
        swalConfirm('Delete', 'Do you want to Delete the Loan Category?', deleteLoanCategory, id);
        return;
    });
    /////////////////////////////////////////////////////Loan Category Modal END///////////////////////////////////////////////////

    /////////////////////////////////////////////////////Scheme Modal START///////////////////////////////////////////////////
    $('#submit_scheme').click(function (event) {
        event.preventDefault();

        let schemeFormData = {
            addSchemeName: $('#add_scheme_name').val(),
            schemeDueMethod: $('#scheme_due_method').val(),
            schemeBenefitMethod: $('#scheme_ben_method').val(),
            schemeMinInterestRate: $('#scheme_interest_rate_min').val(),
            schemeMaxInterestRate: $('#scheme_interest_rate_max').val(),
            schemeMinDuePeriod: $('#scheme_due_period_min').val(),
            schemeMaxDuePeriod: $('#scheme_due_period_max').val(),
            schemeOverduePenalty: $('#scheme_overdue_penalty').val(),
            schemePenaltyType: $('#scheme_penalty_type').val(),
            schemeDocChargeMin: $('#scheme_doc_charge_min').val(),
            schemeDocChargeMax: $('#scheme_doc_charge_max').val(),
            schemeProcessingFeeMin: $('#scheme_processing_fee_min').val(),
            schemeProcessingFeeMax: $('#scheme_processing_fee_max').val(),
            id: $('#add_scheme_id').val()
        }
        var data = ['add_scheme_name', 'scheme_due_method', 'scheme_ben_method', 'scheme_interest_rate_min', 'scheme_interest_rate_max','scheme_due_period_min','scheme_due_period_max', 'scheme_overdue_penalty', 'scheme_doc_charge_min', 'scheme_doc_charge_max', 'scheme_processing_fee_min', 'scheme_processing_fee_max']

        var isValid = true;
        data.forEach(function (entry) {
            var fieldIsValid = validateField($('#' + entry).val(), entry);
            if (!fieldIsValid) {
                isValid = false;
            }
        });

        // if (isFormDataValid(schemeFormData)) {
        if (isValid) {
            $.post('api/loan_category_creation/submit_scheme.php', schemeFormData, function (response) {
                if (response == '0') {
                    swalError('Warning', 'Processing Failed!');
                } else if (response == '1') {
                    swalSuccess('Success', 'Scheme Updated Successfully!');
                } else if (response == '2') {
                    swalSuccess('Success', 'Scheme Added Successfully!');
                } else if (response == '3') {
                    swalError('Access Denied', 'Scheme Already Added.');
                }
                clearSchemeForm();
                getSchemeTable();
            }, 'json');
        }
        // }
    });


    $(document).on('click', '.schemeActionBtn', function () {
        var id = $(this).attr('value'); // Get value attribute
        $.post('api/loan_category_creation/get_scheme_data.php', { id }, function (response) {
            $('#add_scheme_id').val(id);
            $('#add_scheme_name').val(response[0].scheme_name);
            $('#scheme_due_method').val(response[0].due_method);
            $('#scheme_ben_method').val(response[0].benefit_method);
            $('#scheme_interest_rate_min').val(response[0].interest_rate_percent_min);
            $('#scheme_interest_rate_max').val(response[0].interest_rate_percent_max);
            $('#scheme_due_period_min').val(response[0].due_period_percent_min);
            $('#scheme_due_period_max').val(response[0].due_period_percent_max);
            $('#scheme_overdue_penalty').val(response[0].overdue_penalty_percent);
            $('#scheme_penalty_type').val(response[0].scheme_penalty_type);
            $('#scheme_doc_charge_min').val(response[0].doc_charge_min);
            $('#scheme_doc_charge_max').val(response[0].doc_charge_max);
            $('#scheme_processing_fee_min').val(response[0].processing_fee_min);
            $('#scheme_processing_fee_max').val(response[0].processing_fee_max);

            // Toggle the appropriate radio button based on the hidden input value
            if (response[0].scheme_penalty_type === 'percent') {
                $('#scheme_type_percent').prop('checked', true).closest('label').addClass('active');
                $('#scheme_type_rupee').prop('checked', false).closest('label').removeClass('active');
                $('.scheme-penalty-span-val').text('%');
            } else if (response[0].scheme_penalty_type === 'rupee') {
                $('#scheme_type_rupee').prop('checked', true).closest('label').addClass('active');
                $('#scheme_type_percent').prop('checked', false).closest('label').removeClass('active');
                $('.scheme-penalty-span-val').text('₹');
            }
          
        }, 'json');
    });

    $(document).on('click', '.schemeDeleteBtn', function () {
        var id = $(this).attr('value'); // Get value attribute
        swalConfirm('Delete', 'Do you want to Delete the Scheme?', deleteScheme, id);
        return;
    });
    /////////////////////////////////////////////////////Scheme Modal END///////////////////////////////////////////////////

    $('#submit_loan_category_creation').click(function (event) {
        event.preventDefault();
            let isValid = true;
        // Fetching the value of profit_type
        let profitType = $('#profit_type').val();
        if (!profitType) {
            let isValid = validateMultiSelectField('profit_type', profit_type);
            return; // Stop the form submission if profitType is empty
        }
      let PenaltyType = $('#penalty_type').val();
        // Remove commas from loan_limit
        let formData = {
            loan_category: $('#loan_category').val(),
            loan_limit: $('#loan_limit').val().replace(/,/g, ''),
            due_method: $('#due_method').val(),
            due_type: $('#due_type').val(),
            profit_type: profitType,
            benefit_method: $('#benefit_method').val(),
            interest_rate_min: $('#interest_rate_min').val(),
            interest_rate_max: $('#interest_rate_max').val(),
            due_period_min: $('#due_period_min').val(),
            due_period_max: $('#due_period_max').val(),
            doc_charge_min: $('#doc_charge_min').val(),
            doc_charge_max: $('#doc_charge_max').val(),
            processing_fee_min: $('#processing_fee_min').val(),
            processing_fee_max: $('#processing_fee_max').val(),
            overdue_penalty: $('#overdue_penalty').val(),
            penalty_type: PenaltyType,
            scheme_name: $('#scheme_name').val(),
            id: $('#loan_cat_creation_id').val()
        };
        console.log(PenaltyType);
        let isLoanCalculationValid = true;
        let isLoanSchemeValid = true;
    
        // Check which profit type(s) are selected
        if (profitType.includes('1')) {
            isLoanCalculationValid = validateLoanCalculationCard(); // Validate loan calculation card
        }
        if (profitType.includes('2')) {
            isLoanSchemeValid = validateLoanSchemeCard(); // Validate loan scheme card
        }
    
        // Validate main form fields
        if (!validateField($('#loan_category').val(), 'loan_category')) {
            isValid = false;
        }
        if (!validateField($('#loan_limit').val(), 'loan_limit')) {
            isValid = false;
        }
    
        // Validate profit_type (multi-select field)
       // let isProfitTypeNameValid = validateMultiSelectField('profit_type', profit_type);
    
        // Proceed with form submission if valid
        if (isValid  && isLoanCalculationValid && isLoanSchemeValid) {
            // If profit_type and scheme_name are arrays, convert them to comma-separated strings
            if (Array.isArray(formData.scheme_name)) {
                formData.scheme_name = formData.scheme_name.join(",");
            }
            if (Array.isArray(formData.profit_type)) {
                formData.profit_type = formData.profit_type.join(",");
            }
    
            // Submit form via AJAX
            $.post('api/loan_category_creation/submit_loan_category_creation.php', formData, function (response) {
                if (response === '2') {
                    swalSuccess('Success', 'Loan Category Added Successfully!');
                } else if (response === '1') {
                    swalSuccess('Success', 'Loan Category Updated Successfully!');
                } else {
                    swalError('Error', 'Error Occurred!');
                }
                clearLoanCategoryCreationForm();
                getLoanCategoryCreationTable();
                $('.loan_category_table_content').show();
                $('.add_loancategory_btn').show();
                $('#loan_category_creation_content').hide();
                $('.back_to_loancategory_btn').hide();
            });
        }
    });
    

    ///////////////////////////////////// EDIT Screen START   /////////////////////////////////////
 
    
    $(document).on('click', '.loanCatCreationActionBtn', function () {
        var id = $(this).attr('value'); // Get value attribute
        $.post('api/loan_category_creation/loan_category_creation_data.php', { id }, function (response) {  
            $('#loan_cat_creation_id').val(id);
            $('#loan_category2').val(response[0].loan_category);
            
            $('#loan_limit').val(moneyFormatIndia(response[0].loan_limit));
            // Populate other fields
            $('#due_method').val(response[0].due_method);
            $('#due_type').val(response[0].due_type);
            $('#benefit_method').val(response[0].benefit_method);
            $('#interest_rate_min').val(response[0].interest_rate_min);
            $('#interest_rate_max').val(response[0].interest_rate_max);
            $('#due_period_min').val(response[0].due_period_min);
            $('#due_period_max').val(response[0].due_period_max);
            $('#doc_charge_min').val(response[0].doc_charge_min);
            $('#doc_charge_max').val(response[0].doc_charge_max);
            $('#processing_fee_min').val(response[0].processing_fee_min);
            $('#processing_fee_max').val(response[0].processing_fee_max);
            $('#overdue_penalty').val(response[0].overdue_penalty);
            $('#penalty_type').val(response[0].penalty_type);
           let penalty= $('#penalty_type').val();
            $('#scheme_name2').val(response[0].scheme_name);
            if (penalty=== 'percent') {
                $('#penalty_type_percent').prop('checked', true).closest('label').addClass('active');
                $('#penalty_type_rupee').prop('checked', false).closest('label').removeClass('active');
                $('.calculation-span-val').text('%');
            } else if (penalty === 'rupee') {
                $('#penalty_type_rupee').prop('checked', true).closest('label').addClass('active');
                $('#penalty_type_percent').prop('checked', false).closest('label').removeClass('active');
                $('.calculation-span-val').text('₹');
            }
           
            // Populate profit_type dynamically
            var profitTypes = response[0].profit_type.split(','); // Populate other fields
    profitType(); // Reinitialize Choices.js for profit_type
    profit_type.setChoiceByValue(profitTypes); // Set the selected values
            setTimeout(() => {
                getLoanCategoryDropdown();
                getSchemeDropdown();
            }, 1000);
            
            swapTableAndCreation(); // Switch the view to the table
        }, 'json');
    });
    
    


    ///////////////////////////////////// EDIT Screen END  /////////////////////////////////////
    ///////////////////////////////////// Delete Screen START  /////////////////////////////////////
    $(document).on('click', '.loanCatCreationDeleteBtn', function () {
        let id = $(this).attr('value'); // Get value attribute
        swalConfirm('Delete', 'Do you want to Disable the Loan Category Creation?', deleteLoanCategoryCreation, id);
        return;
    });
    ///////////////////////////////////// Delete Screen END  /////////////////////////////////////

    $('#clear_loan_cat_form').click(() => {
        clearLoanCategoryCreationForm();
    })

});//Document END.

//OnLoad/////
$(function () {
    //setdtable('#loan_scheme_table');
    getLoanCategoryDropdown();
    getLoanCategoryCreationTable();
   // getSchemeDropdown();
    profitType();
});

function getLoanCategoryCreationTable() {
    $.post('api/loan_category_creation/loan_category_creation_list.php', function (response) {
        var columnMapping = [
            'sno',
            'loan_category',
            'loan_limit',
            'status',
            'action'
        ];
        appendDataToTable('#loancategory_creation_table', response, columnMapping);
        setdtable('#loancategory_creation_table');
    }, 'json');
}
function validateLoanCalculationCard() {
    let valid = true;
    //  valid &= validateField($('#due_type').val(), 'due_type');
    valid &= validateField($('#due_method').val(), 'due_method');
    valid &= validateField($('#benefit_method').val(), 'benefit_method');
    valid &= validateField($('#interest_rate_min').val(), 'interest_rate_min');
    valid &= validateField($('#interest_rate_max').val(), 'interest_rate_max');
    valid &= validateField($('#due_period_min').val(), 'due_period_min');
    valid &= validateField($('#due_period_max').val(), 'due_period_max');
    valid &= validateField($('#doc_charge_min').val(), 'doc_charge_min');
    valid &= validateField($('#doc_charge_max').val(), 'doc_charge_max');
    valid &= validateField($('#processing_fee_min').val(), 'processing_fee_min');
    valid &= validateField($('#processing_fee_max').val(), 'processing_fee_max');
    valid &= validateField($('#overdue_penalty').val(), 'overdue_penalty');
    return valid;
}

function validateLoanSchemeCard() {
    let valid = true;
    valid &= validateField($('#scheme_name').val(), 'scheme_name');
    $('#scheme_name').closest('.choices').find('.choices__inner').css('border', '1px solid #ff0000');
    // Add additional validation for Loan Scheme fields if required
    return valid;
}
function swapTableAndCreation() {
    if ($('.loan_category_table_content').is(':visible')) {
        $('.loan_category_table_content').hide();
        $('.add_loancategory_btn').hide();
        $('#loan_category_creation_content').show();
        $('.back_to_loancategory_btn').show();
    } else {
        $('.loan_category_table_content').show();
        $('.add_loancategory_btn').show();
        $('#loan_category_creation_content').hide();
        $('.back_to_loancategory_btn').hide();
    }
}

function getLoanCategoryTable() {
    $.post('api/loan_category_creation/get_loan_category_list.php', function (response) {
        let loanCategoryColumn = [
            "sno",
            "loan_category",
            "action"
        ]
        appendDataToTable('#loan_category_table', response, loanCategoryColumn);
        setdtable('#loan_category_table');
    }, 'json');
}

function getLoanCategoryDropdown() {
    $.post('api/loan_category_creation/get_loan_category_list.php', function (response) {
        let appendLineNameOption = '';
        let loan_category2 = $('#loan_category2').val();
        appendLineNameOption += '<option value="">Select Loan Category</option>';
        $.each(response, function (index, val) {
            let selected = '';
            if (val.id == loan_category2) {
                selected = 'selected';
            }
            appendLineNameOption += '<option value="' + val.id + '" ' + selected + '>' + val.loan_category + '</option>';
        });
        $('#loan_category').empty().append(appendLineNameOption);

        clearLoanCategory();
    }, 'json');
}

function getSchemeTable() {
    $.post('api/loan_category_creation/get_scheme_list.php', function (response) {
        let schemeColumn = [
            "sno",
            "scheme_name",
            "due_method",
            "benefit_method",
            "interest_rate_percent_min",
            "interest_rate_percent_max",
            "due_period_percent_min",
            "due_period_percent_max",
            "doc_charge_min",
            "doc_charge_max",
            "processing_fee_min",
            "processing_fee_max",
            "overdue_penalty_percent",
            "action"
        ]
        appendDataToTable('#scheme_modal_table', response, schemeColumn);
        setdtable('#scheme_modal_table');
    }, 'json');
}

function getSchemeListTable(scheme_id) {
    if (Array.isArray(scheme_id)) {
        scheme_id = scheme_id.join(",");
    }

    $.post('api/loan_category_creation/get_scheme_list_based_scheme_dropdown.php', { scheme_id }, function (response) {
        let schemeColumn = [
            "sno",
            "scheme_name",
            "due_method",
            "benefit_method",
            "interest_rate_percent_min",
            "interest_rate_percent_max",
            "due_period_percent_min",
            "due_period_percent_max",
            "doc_charge_min",
            "doc_charge_max",
            "processing_fee_min",
            "processing_fee_max",
            "overdue_penalty_percent",
        ]

        appendDataToTable('#loan_scheme_table', response, schemeColumn);
        setTimeout(function () {
            setdtable('#loan_scheme_table');
        }, 0);
    }, 'json');
}

function getSchemeDropdown() {
    $.post('api/loan_category_creation/get_scheme_list.php', function (response) {
        scheme_choices.clearStore();
        let selectedSchemeId = [];
        $.each(response, function (index, val) {
            let selected = '';
            let schemename2 = $('#scheme_name2').val();
            if (schemename2.includes(val.id)) {
                selected = 'selected';
                selectedSchemeId.push(val.id);
            }
            let items = [
                {
                    value: val.id,
                    label: val.scheme_name,
                    selected: selected
                }
            ];
            scheme_choices.setChoices(items);
            scheme_choices.init();
        });

        clearSchemeForm();
        getSchemeListTable(selectedSchemeId);
    }, 'json');
}


function deleteLoanCategory(id) {
    $.post('api/loan_category_creation/delete_loan_category.php', { id }, function (response) {
        if (response == '1') {
            swalSuccess('Success', 'Loan Category Deleted Successfully.');
            getLoanCategoryTable();
        } else if (response == '0') {
            swalError('Access Denied', 'Used in Loan Category Creation');
        } else {
            swalError('Error', 'Loan Category Delete Failed.');

        }
    }, 'json');
}

function deleteScheme(id) {
    $.post('api/loan_category_creation/delete_scheme.php', { id }, function (response) {
        if (response == '2') {
            swalSuccess('Success', 'Scheme Deleted Successfully');
            getSchemeTable();
        } else if (response == '1') {
            swalError('Access Denied', 'Used in Loan Category Creation');
        } else {
            swalError('Warning', 'Error occur while Delete Scheme.');
        }
    }, 'json');
}

function deleteLoanCategoryCreation(id) {
    $.post('api/loan_category_creation/delete_loan_category_creation.php', { id }, function (response) {
        if (response == '0') {
            swalSuccess('Success', 'Loan Category creation Disabled Successfully');
            getLoanCategoryCreationTable();
        } else if (response == '1') {
            swalError('Access Denied', 'Used in Another Screen.');
        } else if (response == '2') {
            swalError('Warning', 'Used in User Creation.');
        } else {
            swalError('Warning', 'Loan Category Creation Delete Failed!');
        }
    }, 'json');
}

function clearSchemeForm() {
    $('#add_scheme_id').val('0');
    $('#add_scheme_details').trigger('reset');
    $('#scheme_type_percent').prop('checked', true).closest('label').addClass('active');
    $('#scheme_type_rupee').prop('checked', false).closest('label').removeClass('active');
    $('.scheme-penalty-span-val').text('%');
    $('#scheme_penalty_type').val('percent');
    $('#add_scheme_details input').css('border', '1px solid #cecece');
    $('#add_scheme_details select').css('border', '1px solid #cecece');
    $('#scheme_name').closest('.choices').find('.choices__inner').css('border', '1px solid #cecece');
}

function clearLoanCategory() {
    $('#addloan_category_name').val('');
    $('#addloan_category_id').val('0');
    $('#addloan_category_name').css('border', '1px solid #cecece');


}

function clearLoanCategoryCreationForm() {
    // Reset all input fields except the ones specified
    $('input:not(#due_type, #profit_method, #penalty_type_percent, #penalty_type_rupee, #scheme_penalty_type, #scheme_type_rupee, #scheme_type_percent)').val('');
    
    // Reset all select fields to their first option
    $('select').each(function () {
        $(this).val($(this).find('option:first').val());
    });

    // Reset styles to default
    $('#loan_limit, #interest_rate_min, #interest_rate_max, #due_period_min, #due_period_max, #doc_charge_min, #doc_charge_max, #processing_fee_min, #processing_fee_max, #overdue_penalty').css('border', '1px solid #cecece');
    $('#loan_category_creation select').css('border', '1px solid #cecece');
    $('#profit_type').closest('.choices').find('.choices__inner').css('border', '1px solid #cecece');
    $('#penalty_type_percent').prop('checked', true).closest('label').addClass('active');
    $('#penalty_type_rupee').prop('checked', false).closest('label').removeClass('active');
    $('.calculation-span-val').text('%');
    $('#penalty_type').val('percent');
    scheme_choices.clearInput(); // Clear input in scheme dropdown

    // Remove active items from profit_type (Choices.js)
    if (typeof profit_type !== 'undefined') {
        profit_type.removeActiveItems(); // Remove all selected items
    }

    getSchemeDropdown(); // Call to get the scheme dropdown
    profitType();
}
function profitType(){
     // Reinitialize Choices.js for profit_type with both options
     if (typeof profit_type !== 'undefined') {
        profit_type.clearStore();
        profit_type.setChoices([
            { value: '1', label: 'Calculation', selected: false },
            { value: '2', label: 'Scheme', selected: false }
        ], 'value', 'label', false); // false to avoid replacing current options
    }
}

function checkMinMaxValue(minSelector, maxSelector) {
    let min = parseFloat($(minSelector).val());
    let max = parseFloat($(maxSelector).val());
    // Only proceed if both values are numbers
    if (!isNaN(min) && !isNaN(max)) {
        if (min > max) {
            swalError('Warning', 'Minimum value should be less than or equal to Maximum value');
            $(minSelector).val('');
            $(maxSelector).val('');
        }
    }
}

