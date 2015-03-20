<?php
/*
 * Author: Bryden Arndt
 * Date: 01/07/2015
 * Purpose: Display the profile owner's profile picture/icon and any admin links if necessary. Adapted from the file with the same name in the c_module_dump plugin.
 */
?>
<!-- Probably unnecessary styling but it was written by Christine and included in the c_module_dump plugin (under /views/default/profile/ownder_block.php)
    so leaving it here in case it's needed -->
    <style>
        .c_table {
            border:1px solid #ccc;
            background-color:;
        }

        .table th,td {
            padding:10px;
        }

    </style>

<?php

$user = elgg_get_page_owner_entity();

if (!$user) {
    // no user so we quit view
    echo elgg_echo('viewfailure', array(__FILE__));
    return TRUE;
}

// @todo: create a link to edit the user profile picture
if (elgg_get_logged_in_user_guid() == elgg_get_page_owner_guid()) {
    $icon = elgg_view_entity_icon($user, 'large', array(
        'use_hover' => false,
        'href' => 'avatar/edit/' . $user->username,
    ));
}
else {
    $icon = elgg_view_entity_icon($user, 'large', array(
        'use_hover' => false,
    ));
}


//$profile_actions
echo <<<HTML

<div id="profile-owner-block">
	$icon

	$admin_links
</div>

HTML;