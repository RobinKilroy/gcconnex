/*
 * Purpose: Provides 'LinkedIn-like endorsements' functionality for use on user profiles and handles ajax for profile edits
 *
 * License: GPL v2.0
 * Full license here: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Author: Bryden Arndt
 * email: bryden@arndt.ca
 */

/*
 * Purpose: initialize the script
 */
$(document).ready(function() {
    // initialize errythang and hide some of the toggle elements
    elgg.register_hook_handler('init', 'system', basic_profile_init);



    $('.save-control').hide();
    $('.cancel-control').hide();

    $('.edit-control').hover(function() {
            $(this).addClass('edit-hover');
        },
        function(){
            $(this).removeClass('edit-hover');
        });

    $('.cancel-control').hover(function() {
            $(this).addClass('cancel-hover');
        },
        function(){
            $(this).removeClass('cancel-hover');
        });

    $('.save-control').hover(function() {
            $(this).addClass('save-hover');
        },
        function(){
            $(this).removeClass('save-hover');
        });

    //link the edit/save/cancel buttons with the appropriate functions on click..
    $('.edit-about-me').on("click", {section: "about-me"}, editProfile);
    $('.save-about-me').on("click", {section: "about-me"}, saveProfile);
    $('.cancel-about-me').on("click", {section: "about-me"}, cancelChanges);

    $('.edit-education').on("click", {section: "education"}, editProfile);
    $('.save-education').on("click", {section: "education"}, saveProfile);
    $('.cancel-education').on("click", {section: "education"}, cancelChanges);

    $('.edit-work-experience').on("click", {section: "work-experience"}, editProfile);
    $('.save-work-experience').on("click", {section: "work-experience"}, saveProfile);
    $('.cancel-work-experience').on("click", {section: "work-experience"}, cancelChanges);

    $('.edit-skills').on("click", {section: "skills"}, editProfile);
    $('.save-skills').on("click", {section: "skills"}, saveProfile);
    $('.cancel-skills').on("click", {section: "skills"}, cancelChanges);

    $('.gcconnex-education-add-another').on("click", {section: "education"}, addMore);


    // when a user clicks outside of the input text box (the one for entering new skills in the endorsements area), make it disappear elegantly
    $(document).click(function(event) {
        if(!$(event.target).closest('.gcconnex-endorsements-input-wrapper').length) {
            if($('.gcconnex-endorsements-input-skill').is(":visible")) {
                $('.gcconnex-endorsements-input-skill').hide();
                $('.gcconnex-endorsements-add-skill').fadeIn('slowly');
            }
        }
    });
    $(document).on('mouseover', '.gcconnex-avatar-in-list', function() {
        $(this).find('.remove-colleague-from-list').toggle();
    });
    $(document).on('mouseout', '.gcconnex-avatar-in-list', function() {
        $(this).find('.remove-colleague-from-list').toggle();
    });

});

/*
 * Purpose: To handle all click events on "edit" controls for the gcconnex profile.
 *
 * Porpoise: Porpoises are small cetaceans of the family Phocoenidae; they are related to whales and dolphins.
 *   They are distinct from dolphins, although the word "porpoise" has been used to refer to any small dolphin,
 *   especially by sailors and fishermen.
 */
function editProfile(event) {

    var $section = event.data.section; // which edit button is the user clicking on?

    // toggle the edit, save, cancel buttons
    $('.edit-' + $section).hide();
    $('.save-' + $section).show();
    $('.cancel-' + $section).show();

    switch ($section) {
        case 'about-me':
            // Edit the About Me blurb
            $.get(elgg.normalize_url('ajax/view/b_extended_profile/edit_about-me'),
                {
                    guid: elgg.get_logged_in_user_guid()
                },
                function(data) {
                    $('.gcconnex-about-me').append('<div class="gcconnex-about-me-edit-wrapper">' + data + '</div>');
                });
            $('.gcconnex-profile-about-me-display').hide();
            break;
        case 'education':
            // Edit the edumacation
            $.get(elgg.normalize_url('ajax/view/b_extended_profile/edit_education'),
                {
                    guid: elgg.get_logged_in_user_guid()
                },
                function(data) {
                    // Output in a DIV with id=somewhere
                    $('.gcconnex-education').append('<div class="gcconnex-education-edit-wrapper">' + data + '</div>');
                });
            $('.gcconnex-profile-education-display').hide();
            break;
        case 'work-experience':
            // Edit the experience for this user

            $.get(elgg.normalize_url('ajax/view/b_extended_profile/edit_work-experience'),
                {
                    guid: elgg.get_logged_in_user_guid()
                },
                function(data) {
                    // Output in a DIV with id=somewhere
                    $('.gcconnex-work-experience').append('<div class="gcconnex-work-experience-edit-wrapper">' + data + '</div>');
                    //elgg.security.refreshToken();

                    $userFind = [];
                    $colleagueSelected = [];

                    $('.userfind').each(function() {
                        var tid = $(this).data("tid");
                        tidName = tid;
                        $userSuggest = $('.' + tid);

                        $colleagueSelected[tid] = [];

                    var select = function(e, user, dataset) {
                        $colleagueSelected[dataset].push(user.value);
                        $("#selected").text(JSON.stringify($colleagueSelected[dataset]));
                        $("input.typeahead").typeahead("val", "");
                    };
                        //$colleagueSelected[tid] = [];
                        //$colleagueSelected[tid].push(selected);

                    var filter = function(suggestions, tidName) {
                        return $.grep(suggestions, function(suggestion, tid) {
                            return $.inArray(suggestion.value, $colleagueSelected[suggestion.tid]) === -1;
                        });
                    };

                    var userName = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        remote: {
                            url: elgg.get_site_url() + "userfind?query=%QUERY",
                            filter: function (response) {
                                // Map the remote source JSON array to a JavaScript object array
                                return $.map(response, function (user) {
                                    return {
                                        value: user.value,
                                        guid: user.guid,
                                        pic: user.pic,
                                        avatar: user.avatar,
                                        tid: tid
                                    };
                                });
                            }
                        }
                    });

                    // initialize bloodhound engine for colleague auto-suggest
                    userName.initialize();




                        var userSearchField = $userSuggest.typeahead(null, {
                            name: tid,
                            displayKey: function(user) {
                                return user.value;
                            },
                            limit: Infinity,
                            //source: userName.ttAdapter(),
                            source: function(query, cb) {
                                userName.get(query, function(suggestions) {
                                    cb(filter(suggestions, tidName));
                                });
                            },
                            templates: {
                                suggestion: function (user) {
                                    return '<p>' + user.pic + '<span class="tt-suggest-username">' + user.value + '</span></p>';
                                }
                            }
                        }).bind('typeahead:selected', select);

                        $userSuggest.on('typeahead:selected', addColleague);
                        $userSuggest.on('typeahead:autocompleted', addColleague);
                        $userFind.push(userSearchField);
                    });
                    $('.gcconnex-profile-work-experience-display').hide();

                });
            break;

        case 'skills':
            // inject the html to add ability to add skills
            $('.gcconnex-skills').append('<div class="gcconnex-endorsements-input-wrapper">' +
            '<input type="text" class="gcconnex-endorsements-input-skill" onkeyup="checkForEnter(event)"/>' +
            '<span class="gcconnex-endorsements-add-skill">' + elgg.echo('gcconnex_profile:gc_skill:add') + '</span>' +
            '</div>');

            var newSkill = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                //prefetch: '../data/films/post_1960.json',
                //remote: '../data/films/queries/%QUERY.json'
                remote: {
                    url: elgg.get_site_url() + 'mod/b_extended_profile/actions/b_extended_profile/autoskill.php?query=%QUERY',
                }
            });

            newSkill.initialize();

            $('.gcconnex-endorsements-input-skill').typeahead(null, {
                name: 'newSkill',
                displayKey: 'value',
                limit: 10,
                source: newSkill.ttAdapter()
            });

            $('.gcconnex-endorsements-input-skill').on('typeahead:selected', skillSubmit);
            $('.gcconnex-endorsements-input-skill').on('typeahead:autocompleted', skillSubmit);

            // hide the skill entry text box which is only to be shown when toggled by the link
            $('.gcconnex-endorsements-input-skill').hide();

            // the profile owner would like to type in a new skill
            $('.gcconnex-endorsements-add-skill').click(function () {
                $('.gcconnex-endorsements-input-skill').fadeIn('slowly').focus() ;
                $('.gcconnex-endorsements-add-skill').hide();
            });

            // create a "delete this skill" link for each skill
            $('.gcconnex-endorsements-skill').each(function(){
                $(this).after('<img class="delete-skill-img" src="' + elgg.get_site_url() + 'mod/b_extended_profile/img/delete.png"><span class="delete-skill" onclick="deleteEntry(this)" data-type="skill">' + elgg.echo('gcconnex_profile:gc_skill:delete') + '</span>'); //goes in here i think..
            });

            //$('.delete-skill').show();

            break;
        default:

    }
}

/*
 * Purpose: Save any changes made to the profile
 */
function saveProfile(event) {

    var $section = event.data.section;

    // toggle the edit, save, cancel buttons
    $('.edit-' + $section).show();
    $('.save-' + $section).hide();
    $('.cancel-' + $section).hide();

    switch ($section) {
        case "about-me":
            var $about_me = tinyMCE.activeEditor.getContent();
            // save the information the user just edited
            elgg.action('b_extended_profile/edit_profile', {
                data: {
                    guid: elgg.get_logged_in_user_guid(),
                    section: 'about-me',
                    description: $about_me
                },
                success: function() {            // fetch and display the information we just saved
                    $.get(elgg.normalize_url('ajax/view/b_extended_profile/about-me'),
                        {
                            guid: elgg.get_logged_in_user_guid()
                        },
                        function(data) {
                            // Output in a DIV with id=somewhere
                            $('.gcconnex-profile-about-me-display').remove();
                            $('.gcconnex-about-me').append('<div class="gcconnex-profile-about-me-display">' + data + '</div>');
                        });
                }
            });

            $('.gcconnex-about-me-edit-wrapper').remove();

            break;

        case "education":

            //var $school = $('.gcconnex-education-school').val();
            var $education_guid = [];
            var $delete_guid = [];

            $('.gcconnex-education-entry').each(function() {
                if ( $(this).is(":hidden") ) {
                    if ($(this).data('guid') != "new") {
                        $delete_guid.push($(this).data('guid'));
                    }
                }
                else {
                    $education_guid.push($(this).data('guid'));
                }
            });

            var $school = [];
            $('.gcconnex-education-school').not(":hidden").each(function() {
                $school.push($(this).val());
            });

            var $startdate = [];
            $('.gcconnex-education-startdate').not(":hidden").each(function() {
                $startdate.push($(this).val());
            });

            var $startyear = [];
            $('.gcconnex-education-start-year').not(":hidden").each(function() {
                $startyear.push($(this).val());
            });

            var $enddate = [];
            $('.gcconnex-education-enddate').not(":hidden").each(function() {
                $enddate.push($(this).val());
            });

            var $endyear = [];
            $('.gcconnex-education-end-year').not(":hidden").each(function() {
                $endyear.push($(this).val());
            });

            var $ongoing = [];
            $('.gcconnex-education-ongoing').not(":hidden").each(function() {
                $ongoing.push($(this).prop('checked'));
            });

            var $program = [];
            $('.gcconnex-education-program').not(":hidden").each(function() {
                $program.push($(this).val());
            });

            var $field = [];
            $('.gcconnex-education-field').not(":hidden").each(function() {
                $field.push($(this).val());
            });
            var $access = $('.gcconnex-education-access').val();

            // save the information the user just edited
            elgg.action('b_extended_profile/edit_profile', {
                data: {
                    guid: elgg.get_logged_in_user_guid(),
                    delete: $delete_guid,
                    eguid: $education_guid,
                    section: 'education',
                    school: $school,
                    startdate: $startdate,
                    startyear: $startyear,
                    enddate: $enddate,
                    endyear: $endyear,
                    ongoing: $ongoing,
                    program: $program,
                    field: $field,
                    access: $access
                },
                success: function() {            // fetch and display the information we just saved
                    $.get(elgg.normalize_url('ajax/view/b_extended_profile/education'),
                        {
                            guid: elgg.get_logged_in_user_guid()
                        },
                        function(data) {
                            // Output in a DIV with id=somewhere
                            $('.gcconnex-education-display').remove();
                            $('.gcconnex-education').append('<div class="gcconnex-education-display">' + data + '</div>');
                        });
                }
                });
            $('.gcconnex-education-edit-wrapper').remove();

            break;
        case "work-experience":

            var work_experience = {};
            var experience = [];

            work_experience.edit = experience;
            work_experience.delete = [];

            $('.gcconnex-work-experience-entry').each(function() {
                if ( $(this).is(":hidden") ) {
                    if ($(this).data('guid') != "new") {
                        work_experience.delete.push($(this).data('guid'));
                        //$delete_guid.push($(this).data('guid'));
                    }
                }
                else {
                    experience = {
                        'eguid': $(this).data('guid'),
                        'organization': $(this).find('.gcconnex-work-experience-organization').val(),
                        'title': $(this).find('.gcconnex-work-experience-title').val(),
                        'startdate': $(this).find('.gcconnex-work-experience-startdate').val(),
                        'startyear': $(this).find('.gcconnex-work-experience-start-year').val(),
                        'enddate': $(this).find('.gcconnex-work-experience-enddate').val(),
                        'endyear': $(this).find('.gcconnex-work-experience-end-year').val(),
                        'ongoing': $(this).find('.gcconnex-work-experience-ongoing').val(),
                        'responsibilities': $(this).find('.gcconnex-work-experience-responsibilities').val()
                    };
                    experience.colleagues = [];
                    $(this).find('.gcconnex-avatar-in-list').each(function() {
                        experience.colleagues.push($(this).data('guid'));
                    });
                    work_experience.edit.push(experience);
                }
            });

            // save the information the user just edited
            elgg.action('b_extended_profile/edit_profile', {
                data: {
                    guid: elgg.get_logged_in_user_guid(),
                    work: work_experience,
                    section: 'work-experience'
                },
                success: function() {
                    $.get(elgg.normalize_url('ajax/view/b_extended_profile/work-experience'),
                        {
                            guid: elgg.get_logged_in_user_guid()
                        },
                        function(data) {
                            // Output in a DIV with id=somewhere
                            $('.gcconnex-work-experience-display').remove();
                            $('.gcconnex-work-experience').append('<div class="gcconnex-work-experience-display">' + data + '</div>');
                        });
                }
            });
            $('.gcconnex-work-experience-edit-wrapper').remove();

            // fetch and display the information we just saved

            //$('.gcconnex-profile-work-experience-display').hide();
            break;

        case "skills":

            var $skills_added = [];
            var $delete_guid = [];

            if ($('.gcconnex-endorsements-input-skill').is(":visible")) {
                skillSubmit();
            }

            $('.gcconnex-skill-entry').each(function() {
                if ( $(this).is(":hidden") ) {
                    $delete_guid.push($(this).data('guid'));
                }
                if ( $(this).hasClass("temporarily-added") ) {
                    $skills_added.push($(this).data('skill'));
                }
            });

            //if ($delete_guid.length !== 0) {
                if (confirm("Are you sure you would like to save changes? Any endorsements that are attached to skills that you have removed will be permanently deleted.")) {
                    // save the information the user just edited

                    elgg.action('b_extended_profile/edit_profile', {
                        guid: elgg.get_logged_in_user_guid(),
                        section: 'skills',
                        skillsadded: $skills_added,
                        skillsremoved: $delete_guid
                    });

                    $('.delete-skill-img').remove();
                    $('.delete-skill').remove();
                    $('.gcconnex-endorsements-input-wrapper').remove();
                    $('.gcconnex-skill-entry').removeClass('temporarily-added');

                }
                else {
                    // show() the skills that have been hidden() (marked for deletion)
                    $('.gcconnex-enxorsement-skill-wrapper').show();
                    $('.edit-' + $section).hide();
                    $('.save-' + $section).show();
                    $('.cancel-' + $section).show();
                }
            //}
            // @todo: show add or retract links based on status of endorsement
            break;
        default:
            break;
    }
}

/*
 * Purpose: Handle click event on the cancel button for all profile changes
 */
function cancelChanges(event) {

    var $section = event.data.section;

    $('.edit-' + $section).show();
    $('.save-' + $section).hide();
    $('.cancel-' + $section).hide();

    switch ($section) {
        case "about-me":
            // show the about me
            $('.gcconnex-about-me-edit-wrapper').remove();
            $('.gcconnex-profile-about-me-display').show();
            break;
        case "education":
            //$('.gcconnex-profile-education-display').show();
            $('.gcconnex-education-edit-wrapper').remove();
            $('.gcconnex-profile-education-display').show();
            break;
        case "work-experience":
            $('.gcconnex-work-experience-edit-wrapper').remove();
            $('.gcconnex-profile-work-experience-display').show();
            break;
        case "skills":
            $('.gcconnex-endorsements-input-wrapper').remove();

            $('.delete-skill').remove();
            $('.delete-skill-img').remove();
            $('.gcconnex-skills-skill-wrapper').removeClass('endorsements-markedForDelete');

            $('.gcconnex-skills-skill-wrapper').show();
            $('.temporarily-added').remove();
            break;
        default:
            break;
    }
}

/*
 * Purpose: Listen for the enter key in the "add new skill" text box
 */
function checkForEnter(event) {
    if (event.keyCode == 13) { // 13 = 'Enter' key

        // The new skill being added, as entered by user
        //var newSkill = $('.gcconnex-endorsements-input-skill').val().trim();
        var newSkill = $('.gcconnex-endorsements-input-skill').typeahead('val');
        // @todo: do data validation to ensure css class-friendly naming (ie: no symbols)
        // @todo: add a max length to newSkill
        addNewSkill(newSkill);
    }
}

/*
 * Purpose: Only allow numbers to be entered for the year inputs
 */
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

/*
 * Purpose: disable the end date inputs when a user selects "I'm currently still working here"
 */
function toggleEndDate(evt) {

    $(evt).closest('.gcconnex-work-experience-entry').find('.gcconnex-work-experience-end-year').attr('disabled', function(index, attr) {
        return attr == 'disabled' ? null : 'disabled';
    });

    $(evt).closest('.gcconnex-work-experience-entry').find('.gcconnex-work-experience-enddate').attr('disabled', function(index, attr) {
        return attr == 'disabled' ? null : 'disabled';
    });
    /*
    $('.gcconnex-' + section + '-enddate-' + guid).attr('disabled', function(index, attr) {
        return attr == 'disabled' ? null : 'disabled';
    });

    $('.gcconnex-' + section + '-end-year-' + guid).attr('disabled', function(index, attr) {
        return attr == 'disabled' ? null : 'disabled';
    });
    */
}

/*
 * Purpose: add colleague to work-experience entry
 */
function addColleague(obj, datum, name) {
    //var colleague = datum.avatar;

    if ($(this).closest('.gcconnex-work-experience-entry').find("[data-guid=" + datum.guid + "]") && $(this).closest('.gcconnex-work-experience-entry').find("[data-guid=" + datum.guid + "]").is(":hidden")) {
        $(this).closest('.gcconnex-work-experience-entry').find("[data-guid=" + datum.guid + "]").show();
    }
    else {
        $(this).closest('.gcconnex-work-experience-entry').find('.list-avatars').append(
            '<div class="gcconnex-avatar-in-list temporarily-added" data-guid="' + datum.guid + '" onclick="removeColleague(this)">' +
            '<div class="remove-colleague-from-list">X</div>' + datum.avatar + '</div>'
        );
    }
    $('.userfind').typeahead('val', '');        // clear the typeahead box
    // remove colleague from suggestible usernames list
}

/*
 * Purpose: When user clicks on the "X" to remove a user from the list of colleagues, animate the removal
 */
function removeColleague(identifier) {
    $(identifier).fadeOut('slow', function() {
        if ($(identifier).hasClass('temporarily-added')) {
            $(identifier).remove();
            tid = $('.gcconnex-work-experience-colleagues').data("tid");
            console.log($colleagueSelected[tid]);
            $colleagueSelected[tid].splice($.inArray('Sarah Staniforth', $colleagueSelected[tid]), 1);
            console.log($colleagueSelected[tid]);
        }
        else {
            $(identifier).hide();
        }
    });
    //add colleague back to suggestible usernames list
}

/*
 * Purpose: to trigger the submission of a skill that was selected or auto-completed from the typeahead suggestion list
 */
function skillSubmit() {
    var myVal = $('.gcconnex-endorsements-input-skill').typeahead('val');
    addNewSkill(myVal);
}

/*
 * Purpose: append a new skill to the bottom of the list
 */
function addNewSkill(newSkill) {

    //var newSkillDashed = newSkill.replace(/\s+/g, '-').toLowerCase(); // replace spaces with '-' for css classes

    newSkill = escapeHtml(newSkill);
    // @todo: cap the list of skills at ~8-10 in order not to have "too many" on each profile
    // inject HTML for newly added skill
    $('.gcconnex-skills-skills-list-wrapper').append('<div class="gcconnex-skill-entry temporarily-added" data-skill="' + newSkill + '">' +
    '<span title="Number of endorsements" class="gcconnex-endorsements-count" data-skill="' + newSkill + '">0</span>' +
    '<span data-skill="' + newSkill + '" class="gcconnex-endorsements-skill">' + newSkill + '</span>' +
    '<img class="delete-skill-img" src="' + elgg.get_site_url() + 'mod/b_extended_profile/img/delete.png">' +
    '<span class="delete-skill" data-type="skill" onclick="deleteEntry(this)">Delete this skill</span></div>');

    $('.gcconnex-endorsements-input-skill').val('');                                 // clear the text box
    $('.gcconnex-endorsements-input-skill').typeahead('val', '');                                           // clear the typeahead box
    $('.gcconnex-endorsements-input-skill').hide();                                  // hide the text box
    $('.gcconnex-endorsements-add-skill').show();                                    // show the 'add a new skill' link
    $('.add-endorsements-' + newSkill).on('click', addEndorsement);            // bind the addEndoresement function to the '+'
    $('.retract-endorsements-' + newSkill).on('click', retractEndorsement);    // bind the retractEndorsement function to the '-'
    $('.delete-' + newSkill).on('click', deleteSkill);                        // bind the deleteSkill function to the 'Delete this skill' link
}

/*
 * Purpose: Increase the endorsement count by one, for a specific skill for a specific user
 */
function addEndorsement(identifier) {
    // A user is endorsing a skill! Do some things about it..
    var skill_guid = $(identifier).data('guid');

    elgg.action('b_extended_profile/add_endorsement', {
        guid: elgg.get_logged_in_user_guid(),
        skill: skill_guid
    });


    var targetSkill = $(identifier).data('skill');
    var targetSkillDashed = targetSkill.replace(/\s+/g, '-').toLowerCase(); // replace spaces with '-' for css classes


    var endorse_count = $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').find('.gcconnex-endorsements-count').text();
    endorse_count++;
    $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').find('.gcconnex-endorsements-count').text(endorse_count);

    $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').append('<span class="gcconnex-endorsement-retract elgg-button btn" onclick="retractEndorsement(this)" data-guid="' + skill_guid + '" data-skill="' + targetSkill + '">Retract Endorsement</span>')
    $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').find('.gcconnex-endorsement-add').remove();
    //$('.add-endorsement-' + targetSkillDashed).remove();
}

/*
 * Purpose: Retract a previous endorsement for a specific skill for a specific user
 */
function retractEndorsement(identifier) {
    // A user is retracting their endorsement for a skill! Do stuff about it..
    var skill_guid = $(identifier).data('guid');

    elgg.action('b_extended_profile/retract_endorsement', {
        guid: elgg.get_logged_in_user_guid(),
        skill: skill_guid
    });


    var targetSkill = $(identifier).data('skill');
    var targetSkillDashed = targetSkill.replace(/\s+/g, '-').toLowerCase(); // replace spaces with '-' for css classes


    var endorse_count = $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').find('.gcconnex-endorsements-count').text();
    endorse_count--;
    $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').find('.gcconnex-endorsements-count').text(endorse_count);

    $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').append('<span class="gcconnex-endorsement-add elgg-button btn" onclick="addEndorsement(this)" data-guid="' + skill_guid + '" data-skill="' + targetSkill + '">Endorse</span>')

    //$(identifier).after('<span class="gcconnex-endorsement-add add-endorsement-' + targetSkillDashed + '" onclick="addEndorsement(this)" data-guid="' + skill_guid + '" data-skill="' + targetSkill + '">+</span>');
    $('.gcconnex-skill-entry[data-guid="' + skill_guid + '"]').find('.gcconnex-endorsement-retract').remove();
}

/*
 * Purpose: Delete a skill from the list of endorsements
 */
function deleteSkill() {
    // We don't _actually_ delete anything yet, since the user still has the ability to click 'Cancel' and bring the skill back,
    // instead, we just hide the skill until the user clicks on 'Save'. See the 'saveChanges' function for
    // the actual code where skills are permanently deleted.
    $(this).parent('.gcconnex-endorsements-skill-wrapper').addClass('endorsements-markedForDelete').hide();
}

/*
 * Purpose:
 */
function addMore(identifier) {
    var another = $(identifier).data('type');
    $.get(elgg.normalize_url('ajax/view/input/' + another), '',
        function(data) {
            // Output in a DIV with id=somewhere
            $('.gcconnex-' + another + '-all').append(data);
            if (another == "work-experience") {
                var tid = $('.gcconnex-work-experience-entry').last().children('input.userfind').data('tid');

                var userName = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                    //datumTokenizer: function(d) { return Bloodhound.tokenizers.obj.whitespace(d.value); },
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    //prefetch: '../data/films/post_1960.json',
                    //remote: '../data/films/queries/%QUERY.json'
                    remote: {
                        url: elgg.get_site_url() + "userfind?query=%QUERY", //+ elgg.security.addToken("")
                        //    url: elgg.get_site_url() + "action/b_extended_profile/user_find?query=%QUERY&" + elgg.security.addToken("")
                        filter: function (response) {
                            // Map the remote source JSON array to a JavaScript object array
                            return $.map(response, function (user) {
                                return {
                                    value: user.value,
                                    guid: user.guid,
                                    pic: user.pic,
                                    avatar: user.avatar
                                };
                            });
                        }
                    }

                    // url: elgg.get_site_url() + "mod/b_extended_profile/actions/b_extended_profile/userfind.php?query=%Q
                });

                userName.initialize();
                tid = '.' + tid;

                $(tid).typeahead(null, {
                    name: 'userName',
                    displayKey: function(user) {
                        return user.value;
                        console.log('User value: ' + user.value);
                    },
                    limit: 10,
                    source: userName.ttAdapter(),
                    templates: {
                        suggestion: function (user) {
                            if ( $(this).closest('.colleagues-list').find('[data-guid="' + user.guid + '"]').length ) {
                                return null;
                            }
                            else {
                                return '<p>' + user.pic + '<span class="tt-suggest-username">' + user.value + '</span></p>';
                            }
                        }
                    }
                });

                $(tid).on('typeahead:selected', addColleague);
                $(tid).on('typeahead:autocompleted', addColleague);
            }
        });
}

/*
 * Purpose: Delete an entry based on the value of the data-type attribute in the delete link
 */
function deleteEntry(identifier) {
    // get the entry-type name
    var entryType = $(identifier).data('type');

    if ($(identifier).closest('.gcconnex-' + entryType + '-entry').hasClass('temporarily-added')) {
        $(identifier).closest('.gcconnex-' + entryType + '-entry').remove();
    }
    else {
        // mark the entry for deletion and hide it from view
        $(identifier).closest('.gcconnex-' + entryType + '-entry').hide();
    }
}

/*
 * Purpose: Remove the message box that informs users they need to re-enter their skills into the new system
 */
function removeOldSkills() {
    elgg.action('b_extended_profile/edit_profile', {
        data: {
            guid: elgg.get_logged_in_user_guid(),
            section: 'old-skills'
        },
        success: function() {
            $('.gcconnex-old-skills').remove();
        }
    });

}

var entityMap = {
    "<": "<",
    ">": ">",
    '"': '&quot;',
    "'": '\'',
    "/": '\/'
};

function escapeHtml(string) {
    return String(string).replace(/[<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

<<<<<<< HEAD
function basic_profile_init() {
    $(".gcconnex-basic-profile-edit").fancybox({
        autoDimensions: false,
        height: 'auto',
        width: 760
    });
}
=======


>>>>>>> json-objects
