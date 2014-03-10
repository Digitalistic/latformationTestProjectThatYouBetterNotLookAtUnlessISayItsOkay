#pragma strict

var playerMovement : PlayerMovement;

var movementSpeed : float = 4;
var modifiedSpeed : float = 0;

var at_wall_minus = false;
var at_wall_plus = false;
var temp_velocity : Vector3;
function Start () {
	playerMovement = GetComponent(PlayerMovement); // we need the y axis
	rigidbody.constraints -= RigidbodyConstraints.FreezePositionZ;
}

function FixedUpdate () {
	if(playerMovement.current_mode!=playerStates.Falling && playerMovement.current_mode!=playerStates.Jumping && playerMovement.current_mode!=playerStates.Stopping && playerMovement.current_mode!=playerStates.Walking && playerMovement.current_mode!=playerStates.Idle && playerMovement.current_mode!=playerStates.Running && playerMovement.current_mode!=playerStates.Walking && playerMovement.current_mode!=playerStates.Sliding && playerMovement.current_mode!=playerStates.Boosting)
		return; // don't go further, if our state has nothing to do with basic movement and jumping
	
	if(playerMovement.return_real_axis().y) // are we pressing in vertical direction?
	{
		if(playerMovement.current_mode==playerStates.Idle) //when we are idleing
		{
			playerMovement.current_mode=playerStates.Walking; //change to walking
			playerMovement.play_animation(playerMovement.animation_walk);
		}
		if(playerMovement.current_speed==0 && playerMovement.current_mode!=playerStates.Walking && playerMovement.current_mode!=playerStates.Falling && playerMovement.current_mode!=playerStates.Jumping)//change to walking animation when x movement is zero
		{
			playerMovement.current_mode=playerStates.Walking;
			playerMovement.play_animation(playerMovement.animation_walk);
		}
		modifiedSpeed = playerMovement.return_real_axis().y;
		if(at_wall_minus)modifiedSpeed = Mathf.Min(modifiedSpeed,0);
		if(at_wall_plus)modifiedSpeed = Mathf.Max(modifiedSpeed,0);
		rigidbody.velocity.z=modifiedSpeed*movementSpeed;
	}
	else
	{
		rigidbody.velocity.z=0;
	}
	playerMovement.current_external_speed = rigidbody.velocity.z;
	temp_velocity = rigidbody.velocity;

}

function OnCollisionEnter(collisionInfo : Collision)
{

    for (var contact : ContactPoint in collisionInfo.contacts) {
        Debug.DrawRay(contact.point, contact.normal * 10, Color.white);
        if(contact.normal.z<-0.8){at_wall_minus=true; rigidbody.velocity = temp_velocity;}
        if(contact.normal.z>0.8){at_wall_plus=true;rigidbody.velocity = temp_velocity;}
    }
}
function OnCollisionStay(collisionInfo : Collision)
{

    for (var contact : ContactPoint in collisionInfo.contacts) {
        Debug.DrawRay(contact.point, contact.normal * 10, Color.white);
        if(contact.normal.z<-0.8){at_wall_minus=true;}
        if(contact.normal.z>0.8){at_wall_plus=true;}
    }
}
function OnCollisionExit(collisionInfo : Collision)
{
at_wall_minus=false;
at_wall_plus=false;
    for (var contact : ContactPoint in collisionInfo.contacts) {
        Debug.DrawRay(contact.point, contact.normal * 10, Color.white);
    }
}