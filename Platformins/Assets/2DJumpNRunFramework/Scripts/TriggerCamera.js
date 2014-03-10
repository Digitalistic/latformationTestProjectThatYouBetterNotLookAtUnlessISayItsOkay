#pragma strict
var move_with_player : boolean = true;
var lock_x_axis : boolean = false;
var locked_x : float = 0;
var lock_y_axis : boolean = false;
var locked_y : float = 0;
var extra_position : Vector2;
var z_distance : float = 0; // if zero then the current Z distance will be used
var smoothness : float = 0.4;
var max_speed : float = 2;

function Start()
{
	gameObject.layer = 2;
	if(renderer)renderer.enabled=false;
}
function OnTriggerEnter (other : Collider) {
	if(other.transform.tag!="Player")return;
	var playercamera : PlayerCamera = other.GetComponent(PlayerCamera) as PlayerCamera;
	if(playercamera)
	{
		playercamera.move_with_player = move_with_player;
		playercamera.lock_x_axis = lock_x_axis;
		playercamera.locked_x = locked_x;
		playercamera.lock_y_axis = lock_y_axis;
		playercamera.locked_y = locked_y;
		playercamera.extra_position = extra_position;
		if(z_distance!=0)playercamera.z_distance = z_distance;
		playercamera.smoothness = smoothness;
		playercamera.max_speed = max_speed;
	}
	else
	{
		Debug.LogError("No PlayerCamera component found");
	}
}