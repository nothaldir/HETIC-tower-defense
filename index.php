<?php
	require 'includes/config.php';
	require 'includes/form.php';

    $query = $pdo->query('SELECT * FROM scores ORDER by score DESC, date ASC LIMIT 10');
    $scores = $query->FetchAll();

	// echo '<pre>';
	// print_r($scores);
	// echo '</pre>';
?>



<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Engine Defense</title>
    <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="src/css/app.css">
</head>
<body>
	
	<audio class="audio" src="src/medias/crash.mp3" preload="auto">Browser non compatible</audio>
	<div class="container">

		<div class="defeat-screen">
			<div class="lose-title">VOUS AVEZ PERDU</div>
			<div class="level">Niveau atteint : <span class="current-level">0</span></div>
			<form action="#" method="post" onSubmit="return verification()">
				<input type="text" name="name" id="name" placeholder="Pseudo :" class="name-field" value="<?=$name?>">
				<button type="submit" class="submit-button"><img src="src/images/download.svg" alt=""></button>
				<div class="submit-text">ENREGISTRER</div>
				<input type="number" name="score" id="score" value="<?$score?>">
			</form>
			<div class="again-button"><img src="src/images/restart.svg" alt=""></div>
			<div class="again-text">RECOMMENCER</div>
		</div>

		<div class="leaderboard-screen">
			<div class="leaderboard-title">CLASSEMENT DES 10 MEILLEURS JOUEURS</div>
			<table class="leaderboard-table">
				<tr>
					<th class="leaderboard-pseudo">PSEUDO</th>
					<th class="leaderboard-level">NIVEAU</th>
					<th class="leaderboard-date">DATE</th>
				</tr>
			<?php foreach($scores as $_scores): ?>
				<tr>
					<td class="pseudo"><?= $_scores->name ?></td>
					<td class="leaderboard-level"><?= $_scores->score ?></td>
					<td class="leaderboard-date"><?= $_scores->date ?></td>
				</tr>
			<?php endforeach; ?>            
			</table>
			<div class="back-button">
				<img src="src/images/back.svg" alt="">
			</div>
			<div class="back-title">RETOUR AU JEU</div>
		</div>

		<h1 class="engine-title">ENGINE DEFENSE</h1>

		<div class="controls">
			<div style="text-align:center">
				<div class="indic">Niveau<br><span id="levelindic">5</span></div>&nbsp;&nbsp;&nbsp;
				<div class="indic">Pièces d'or<br><span id="goldindic">100</span></div>
			</div>

			<div class="prog">
				<div style="width: 0px;" id="hpindic"></div>
			</div>
			
			<div class="buildings-title"><img src="src/images/buildings.svg" alt=""></div>
			<div class="buildings">
				<input disabled="disabled" onclick="upgrade()" value="" id="upgradebutton" type="button"><br>
				<input disabled="disabled" onclick="ctower=true;towerType=1" value="" id="cTower1Bt" type="button"><br>
				<input disabled="disabled" onclick="ctower=true;towerType=2" value="" id="cTower2Bt" type="button"><br>
				<input disabled="disabled" onclick="ctower=true;towerType=3" value="" id="cTower3Bt" type="button"><br>
				<input disabled="disabled" onclick="ctower=true;towerType=4" value="" id="cTower4Bt" type="button"><br>
			</div>

			<div class="actions-title">
				<img src="src/images/actions.svg" alt="">
			</div>
			<div class="actions">
				<input disabled="disabled" onclick="sell()" value="" id="sellbutton" type="button"><br>
				<br>
				<input onclick="restart()" value="" id="restartbutton" type="button">
				<div class="leaderboard-button">
					<div class="crown">
						<img src="src/images/crown.svg" alt="">
					</div>
					<div class="crown-text">CLASSEMENT</div>
				</div>
			</div>
		</div>

		<div>
			<canvas id="canvas1" width="600" height="600" onmousedown="mouseDown(event)" onmousemove="mouseMove(event)">Canvas not supported.</canvas>
		</div>
    </div>
	
	<script src="src/js/tdf.js"></script>
	
</body>
</html>


