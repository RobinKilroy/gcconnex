<?php 




$wordc_setting = $vars['entity']->wordc;
$power_setting = $vars['entity']->power;



?>


 








<p>
  <b>Do you want to embed ODT files?</b>

<?php

echo elgg_view('input/dropdown',array(
'name' => 'params[wordc]', 
'options_values'=> array( '0' => '  ', '1'=>'Yes','2'=>'No'),
'value'=> $wordc_setting));

 ?>
</p>

<p>
  <b>Do you want to embed ODP files?</b>

<?php

echo elgg_view('input/dropdown',array(
'name' => 'params[power]', 
'options_values'=> array( '0' => '  ', '1'=>'Yes','2'=>'No'),
'value'=> $power_setting));

 ?>
</p>
