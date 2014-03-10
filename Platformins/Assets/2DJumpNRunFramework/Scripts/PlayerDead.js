#pragma strict
private var start_pos : Vector3; // needed for respawning
var last_respawn : Transform; // the current resspawn point
var reset_camera_x : boolean = true;
var reset_camera_y : boolean = true;
function respawn(show_circle : boolean,wait_for_fade : float, wait_before : float)
{
	yield WaitForSeconds(wait_before);
	if(show_circle)
	{
		var helperFadeout = camera.main.GetComponent(HelperFadeout) as HelperFadeout;
		if(helperFadeout)
			helperFadeout.circle_fade("out");
		yield WaitForSeconds(wait_for_fade);
	}
	deadzone();
	if(show_circle)
	{
		if(helperFadeout)
			helperFadeout.circle_fade("in");
	}
}

function deadzone() // same for landing into bottomless pit!
{
	if(last_respawn)
		transform.position = last_respawn.position;
	else
		transform.position = start_pos;
	var playerCamera = GetComponent(PlayerCamera) as PlayerCamera;
	if(reset_camera_x)
	{
		playerCamera.camera_pointer.position.x = transform.position.x+playerCamera.extra_position.x;
	}
	if(reset_camera_y)
	{
		playerCamera.camera_pointer.position.y = transform.position.y+playerCamera.extra_position.y;
	}
	var playerMovement = GetComponent(PlayerMovement) as PlayerMovement;
	playerMovement.current_speed=0;
	playerMovement.current_mode = playerStates.Idle;
	playerMovement.player_can_move=true;
	playerMovement.freeze_player=false;
	var playerHealth = GetComponent(PlayerHealth) as PlayerHealth;
	playerHealth.health=playerHealth.max_health;
	collider.isTrigger=false;
	rigidbody.isKinematic=false;
	playerHealth.lifes-=1;
	
}


function Start () {
	start_pos = transform.position;
}