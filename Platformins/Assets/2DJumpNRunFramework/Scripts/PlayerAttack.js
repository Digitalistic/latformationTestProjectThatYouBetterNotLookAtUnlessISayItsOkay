#pragma strict

private var playerMovement : PlayerMovement;

var attack_button : String = "Fire2";
var spawn_attack : Transform;
var spawn_distance : float = 1;
var ignore_player_collision : boolean = true;
private var attack_pointer : Transform;
var max_shots_in_scene : int = 2;
var mobile_attack : Joystick;
function Start()
{
	playerMovement = GetComponent(PlayerMovement) as PlayerMovement;
}

function return_real_attack() : boolean
{
	if(playerMovement.use_mobile_input)
	{
		return mobile_attack.IsFingerFrameDown();
	}
	else
	{
		return Input.GetButtonDown(attack_button);
	}
}


function check_for_shots_in_scene() : int
{
	var all_shots : GameObject[] = gameObject.FindGameObjectsWithTag("Projectile");
	var shots : int = 0;
	for(var shot : GameObject in all_shots)
	{
		if(shot.GetComponent(HelperProjectile))
		{
			if(shot.GetComponent(HelperProjectile).owner == gameObject)
			{
				shots++;
			}
		}
	}
	return shots;
}

function Update () {
	if(return_real_attack() && (check_for_shots_in_scene() < max_shots_in_scene || max_shots_in_scene == 0 ))
	{
	var rot : Quaternion;
	rot.eulerAngles = playerMovement.player_graphic_pointer.transform.eulerAngles;
		attack_pointer = Instantiate (spawn_attack,  playerMovement.player_graphic_pointer.transform.position + Vector3(spawn_distance*playerMovement.movement_direction,0,0),rot) as Transform;
		if(attack_pointer.GetComponent(HelperProjectile))
		{
			attack_pointer.GetComponent(HelperProjectile).owner = gameObject;
		}
		if(ignore_player_collision)
		{
			Physics.IgnoreCollision(attack_pointer.collider,collider);
		}
	}
}