#pragma strict

private var playerMovement : PlayerMovement;
private var collider_size_temp : float;

var crouching_size_div : float = 1.5;
var stopping_speed : float = 15;

var animation_crouching = "Crouching";
var animation_uncrouch = "Uncrouch";

private var temp_current_mode : playerStates;
function Start () {
	playerMovement = GetComponent(PlayerMovement) as PlayerMovement;
	collider_size_temp = GetComponent(CapsuleCollider).height;
}

function Update () {
	if(playerMovement.current_mode==playerStates.Idle || playerMovement.current_mode==playerStates.Walking || playerMovement.current_mode==playerStates.Boosting || playerMovement.current_mode==playerStates.Sliding || playerMovement.current_mode==playerStates.Running || playerMovement.current_mode==playerStates.Stopping)
	{	
		if(playerMovement.return_real_axis().y<0)
		{
			playerMovement.current_mode=playerStates.Crouching;
			playerMovement.play_animation(animation_crouching);
			GetComponent(CapsuleCollider).height/=crouching_size_div;
			
			transform.position.y-=(collider_size_temp-GetComponent(CapsuleCollider).height)/2;
			playerMovement.player_graphic_pointer.transform.position.y+=(collider_size_temp-GetComponent(CapsuleCollider).height)/2;
			//GetComponent(CapsuleCollider).center.y-=collider_size_temp/8;
			
		}
	}
	if(playerMovement.current_mode==playerStates.Crouching || (playerMovement.current_mode!=playerStates.Crouching && temp_current_mode == playerStates.Crouching))
	{
		playerMovement.current_speed = Mathf.Max(0,playerMovement.current_speed-(stopping_speed*Time.deltaTime));
		rigidbody.velocity.x = playerMovement.current_speed*playerMovement.movement_direction;
		if(playerMovement.return_real_axis().y>-0.001 || (playerMovement.current_mode!=playerStates.Crouching && temp_current_mode == playerStates.Crouching))
		{
			playerMovement.current_mode=playerStates.Idle;
			playerMovement.play_animation(animation_uncrouch);
			transform.position.y+=(collider_size_temp-GetComponent(CapsuleCollider).height)/2;
			playerMovement.player_graphic_pointer.transform.position.y-=(collider_size_temp-GetComponent(CapsuleCollider).height)/2;
			GetComponent(CapsuleCollider).height=collider_size_temp;
			
		}
	}
	temp_current_mode = playerMovement.current_mode;
}