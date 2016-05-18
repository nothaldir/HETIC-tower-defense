<?php

$success = [];
$name = '';
$score = '';


// Data sent
if(!empty($_POST)){

    // Set variables
    $name   = strip_tags(trim($_POST['name']));
    $score    = strip_tags(trim($_POST['score']));

    // Success
    if(empty($errors)){
        $prepare = $pdo->prepare('INSERT INTO scores (name,score) VALUES (:name,:score)');
        $prepare->bindValue('name',$name);
        $prepare->bindValue('score',$score);        
        $execute = $prepare->execute();
    }
}
