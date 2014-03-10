#pragma strict
var jump_button_name : String = "Fire1";
var air_control : float = 4;
var rotate_in_air : boolean = false;
var jump_strength : float = 8;
var max_fall_speed : float = 20;
var can_stop_jumping : boolean = true;
var stop_jumping_speed : float = 8;
private var stop_jumping : boolean = false;
var max_jump_speed : float = 6;
private var real_max_jump_speed : float = 0; // temp value for "movement_speed_overwrite"
var movement_speed_overwrite : boolean = true;
var multi_jumps : int = 0;
var jumped : int = 0;
var jump_force : Vector3 = -Vector3.up; // added to the normal physics. useful so the jumps won't feel floaty

var playerMovement : PlayerMovement;
var playerHealth : PlayerHealth;
var animation_component;

var wall_left : boolean = false;
var wall_right : boolean = false;
var last_velocity : Vector3;
var ignore_layer : LayerMask = -5;

var can_glide : boolean = true;
var glide_air_control : float = 3;
var glide_max_speed : float = 5;
var glide_force : Vector3 = Vector3.up; // added while gliding
var glide_button_name : String = "Fire3";
var glide_max_fall_speed : float = -3;
var glide_only_after_doublejump : boolean = false;


var can_walljump : boolean = true;
var min_speed_for_walljump : float = 5;
var walljump_speed : float = 8;
var walljump_up_power : float = 8;
var walljump_reset_multijump : boolean = true;
var player_must_face_wall : boolean = true;
var time_for_walljump = 0.2;
private var walljump_left : float = 0; 
private var walljump_right : float = 0; 
var can_wallslide : boolean = true;
var wall_slide_speed : float = 3;

var jumpattack_damage : float = 25;
private var jumpattack_bounce : float = 8;

var falldamage : boolean = false;
var falldamage_distance : float = 15;
var falldamage_minus_health : int = 50;
var falldamage_hit_animation : boolean = true;
private var temp_fall_distance_y : float;

var animation_jump = "Jump";
var animation_fall = "Fall";
var animation_multijump = "MultiJump";
var animation_gliding = "StartGliding";
var animation_stopgliding = "StopGliding";
var animation_walljump = "Walljump";
var animation_wallSlide = "WallSlide";

var mobile_jump : Joystick;
var mobile_glide : Joystick;

var sound_jump : AudioClip;
var sound_doublejump : AudioClip;


private var jump_button_last_released : float = 0;
private var jump_button_last_pressed : float = 0;

private var gliding : boolean = false; // is needed intern!
function return_real_glide() : boolean
{
	if(!playerMovement.player_can_move)return false;
	if(playerMovement.use_mobile_input)
	{
		return mobile_glide.IsFingerFrameDown();
	}
	else
	{
		if(glide_button_name!="")
		return Input.GetButtonDown(glide_button_name);
	}
}

function return_real_glide_up() : boolean
{
	if(!playerMovement.player_can_move)return false;
	if(playerMovement.use_mobile_input)
	{
		return mobile_glide.IsFingerFrameUp();
	}
	else
	{
		if(glide_button_name!="")
		return Input.GetButtonUp(glide_button_name);
	}
}

function return_real_jump() : boolean
{
	if(!playerMovement.player_can_move)return false;
	if(playerMovement.use_mobile_input)
	{
		return mobile_jump.IsFingerFrameDown();
	}
	else
	{
		if(jump_button_name!="")
		return Input.GetButtonDown(jump_button_name);
	}
}

function return_real_jump_up() : boolean
{
	if(!playerMovement.player_can_move)return false;
	if(playerMovement.use_mobile_input)
	{
		return mobile_jump.IsFingerFrameUp();
	}
	else
	{
		if(jump_button_name!="")
		return Input.GetButtonUp(jump_button_name);
	}
}

private var mycollider : CapsuleCollider;
function Start()
{
	playerMovement = GetComponent(PlayerMovement) as PlayerMovement;
	if(GetComponent(PlayerHealth))playerHealth = GetComponent(PlayerHealth) as PlayerHealth;

	mycollider = GetComponent(CapsuleCollider) as CapsuleCollider;
}

var raycast_down : RaycastHit;
private var min_falling_speed : float = 0;

private var block_left : float = 0; // we will block the direction for a short time so the player won't "slow down" while pressing against a wall
private var block_right : float = 0; 

function jump_now(direction : int)
{
	force_to_jump = true;
	playerMovement.player_graphic_pointer.eulerAngles.y=(playerMovement.plus_rotate_angle)+(direction*90);
	jumped=0;
}

private var force_to_jump : boolean = false;
var to_bottom : float;
private var walljump_while_sliding_delay : float;
function Update () {
gliding=false;
if(playerMovement.freeze_player || playerMovement.current_mode == playerStates.Dead)return;

if(return_real_jump_up()){jump_button_last_released=Time.time;} // we need the info to make some things smoother and better
if(return_real_jump()){jump_button_last_pressed=Time.time;} // we need the info to make some things smoother and better

	if(playerMovement.current_mode == playerStates.Climbing ||  playerMovement.current_mode==playerStates.Hit)
	{
		temp_fall_distance_y=transform.position.y; // reset the fall distance since we are doing something else
		return;
	}
		
	if(movement_speed_overwrite && playerMovement.current_mode != playerStates.Jumping) // if the movement speed can overwrite max jumping speed...
	{
		if(playerMovement.current_speed > max_jump_speed)
		{
			real_max_jump_speed = playerMovement.current_speed;
		}
		else
		{
			real_max_jump_speed = max_jump_speed;
		}
	}
	
	to_bottom = mycollider.bounds.size.y/2+0.1;
	
	walljump_left = Mathf.Max(0,walljump_left-Time.deltaTime);
	walljump_right = Mathf.Max(0,walljump_right-Time.deltaTime);
	block_left = Mathf.Max(0,block_left-Time.deltaTime);
	block_right = Mathf.Max(0,block_right-Time.deltaTime);

		if(playerMovement.current_mode!=playerStates.Falling) // for fall damage
		{
			temp_fall_distance_y=transform.position.y; // reset the fall distance as long as we are not falling
		}
			
		// walljump
		if(walljump_right>0)
		{
		Debug.Log("wall right");
			if((return_real_jump() || (Time.time-jump_button_last_pressed<time_for_walljump && jump_button_last_pressed-jump_button_last_released>time_for_walljump )) && (playerMovement.current_mode == playerStates.Falling || playerMovement.current_mode == playerStates.Jumping || playerMovement.current_mode == playerStates.WallSlide))
			{
				playerMovement.PlaySound(sound_jump);
				transform.position.x-=0.1;
				rigidbody.velocity.y = walljump_up_power;
				playerMovement.current_speed = walljump_speed;
				playerMovement.movement_direction=-1;
				walljump_right=0;
				walljump_left=0;
				playerMovement.player_graphic_pointer.eulerAngles.y=90*playerMovement.movement_direction;
				if(walljump_reset_multijump)
					jumped = 1;
					playerMovement.current_mode=playerStates.Jumping;
					playerMovement.play_animation(animation_walljump);
				return;
			}
			if(can_wallslide && playerMovement.return_real_axis().x>0.1 && playerMovement.current_mode!=playerStates.WallSlide)
			{
				Debug.Log("Slide");
				playerMovement.current_mode=playerStates.WallSlide;
				playerMovement.play_animation(animation_wallSlide);
			}
		}
		if(walljump_left>0)
		{
			if((return_real_jump() || Time.time-jump_button_last_pressed<time_for_walljump ) && (playerMovement.current_mode == playerStates.Falling || playerMovement.current_mode == playerStates.Jumping  || playerMovement.current_mode == playerStates.WallSlide))
			{
				playerMovement.PlaySound(sound_jump);
				transform.position.x+=0.1;
				rigidbody.velocity.y = walljump_up_power;
				playerMovement.current_speed = walljump_speed;
				playerMovement.movement_direction=1;
				walljump_left=0;
				walljump_right=0;
				playerMovement.player_graphic_pointer.eulerAngles.y=90*playerMovement.movement_direction;
				if(walljump_reset_multijump)
					jumped = 1;
				playerMovement.current_mode=playerStates.Jumping;
				playerMovement.play_animation(animation_walljump);
				return;
			}
			if(can_wallslide &&playerMovement.return_real_axis().x<-0.1 && playerMovement.current_mode!=playerStates.WallSlide)
			{
				playerMovement.current_mode=playerStates.WallSlide;
				playerMovement.play_animation(animation_wallSlide);
			}
		}
	if(playerMovement.current_mode == playerStates.WallSlide) // wallslide
	{
		var wall_trace : Vector3;
		var raycast_wall : RaycastHit;
		rigidbody.velocity.x=0;
		
		if(playerMovement.movement_direction==1) // right
		{
			wall_trace = Vector3.right;
			walljump_right=1;
		}
		if(playerMovement.movement_direction==-1) // left
		{
			wall_trace = -Vector3.right;
			walljump_left=1;
		}
		if(Physics.Raycast(transform.position,wall_trace,raycast_wall,mycollider.bounds.extents.x+1,ignore_layer))
		{
			if(Vector3.Distance(transform.position,raycast_wall.point) > mycollider.bounds.extents.x+0.1)
			{
				playerMovement.current_mode = playerStates.Falling;
				playerMovement.play_animation(animation_fall);
				walljump_left=0;
				walljump_right=0;
			}
			else
			{
				rigidbody.velocity.y = wall_slide_speed*-1;
				playerMovement.current_speed=0;
			}
			Debug.DrawLine (transform.position, raycast_wall.point,Color.red);
		}
		else
		{
			playerMovement.current_mode = playerStates.Falling;
			playerMovement.play_animation(animation_fall);
			walljump_left=0;
			walljump_right=0;
		}
		if((playerMovement.return_real_axis().x<0.5 && playerMovement.movement_direction==1) || (playerMovement.return_real_axis().x>-0.5 && playerMovement.movement_direction==-1))
		{
			walljump_while_sliding_delay-=Time.deltaTime;
		}
		else
		{
			walljump_while_sliding_delay=time_for_walljump;
		}
		if(walljump_while_sliding_delay<=0)
		{
			playerMovement.current_mode = playerStates.Falling;
			playerMovement.play_animation(animation_fall);
		}
	}
	else // maybe we can jump!
	{
	walljump_right=0;
	walljump_left=0;
	
			if(return_real_glide() && (playerMovement.current_mode==playerStates.Jumping || playerMovement.current_mode==playerStates.Falling)  && playerMovement.current_mode!=playerStates.Gliding && can_glide)
		{
		Debug.Log(multi_jumps + "/" + jumped+1);
			if(!glide_only_after_doublejump || (glide_only_after_doublejump && (multi_jumps+1) == jumped))
			{
				playerMovement.current_mode=playerStates.Gliding;
				playerMovement.play_animation(animation_gliding);
			}
		}
		
		if(return_real_jump() && ((playerMovement.current_mode!=playerStates.Jumping && playerMovement.current_mode!=playerStates.Falling) || jumped<=multi_jumps) && playerMovement.current_mode!=playerStates.Gliding)
		{
			min_falling_speed=0;
			if(jumped==0 && playerMovement.current_mode!=playerStates.Falling)
				jumped++;
			else
				jumped=2;
			playerMovement.current_mode=playerStates.Jumping;
			if(jumped==1)
			{
				playerMovement.play_animation(animation_jump);
				playerMovement.PlaySound(sound_jump);
			}
			else 
			{
				playerMovement.play_animation(animation_multijump);
				playerMovement.PlaySound(sound_doublejump);
				stop_jumping=false;
			}
			rigidbody.velocity.y=jump_strength;
			if(playerMovement.current_mode==playerStates.Stopping){rigidbody.velocity.x=0; playerMovement.current_speed=0;}
		}
		if(return_real_glide_up() && playerMovement.current_mode==playerStates.Gliding)
		{
			playerMovement.current_mode=playerStates.Falling;
			playerMovement	.play_animation(animation_stopgliding);
		}
		if(playerMovement.current_mode==playerStates.Gliding) // set the boolean true, it's faster than check everytime the strings
			gliding = true;
			
		if(rigidbody.velocity.y<0)
		{
			if(playerMovement.current_mode==playerStates.Jumping)
			{
				playerMovement.play_animation(animation_fall);
				playerMovement.current_mode=playerStates.Falling;
			}
		}
		if(playerMovement.current_mode==playerStates.Jumping || playerMovement.current_mode == playerStates.Falling || playerMovement.current_mode == playerStates.Gliding)
		{
			if(jumped==0)
			{
				jumped=1;
			}
			if(playerMovement.current_mode == playerStates.Falling)
			{
				min_falling_speed=rigidbody.velocity.y;
			}
		
		
			if(wall_left && playerMovement.movement_direction==-1)
			{
				playerMovement.current_speed = 0;
			}	
			if(wall_right && playerMovement.movement_direction==1)
			{
				playerMovement.current_speed = 0;
			}
			if(playerMovement.return_real_axis().x < -0.2 && block_left==0) // moving left
			{
				if(playerMovement.movement_direction==1) // want to move left but facing right
				{
					if(playerMovement.current_speed==0)
						playerMovement.movement_direction=-1;
					if(!gliding) playerMovement.current_speed = playerMovement.current_speed - (air_control*Time.deltaTime);
					else playerMovement.current_speed = playerMovement.current_speed - (glide_air_control*Time.deltaTime);
				}
				else
				{
					if(!gliding) playerMovement.current_speed = playerMovement.current_speed + (air_control*Time.deltaTime);
					else playerMovement.current_speed = playerMovement.current_speed + (glide_air_control*Time.deltaTime);
				}
			}
			if(playerMovement.return_real_axis().x > 0.2  && block_right==0) // moving right
			{
				if(playerMovement.movement_direction==-1) // want to move right but facing left
				{
					if(playerMovement.current_speed==0)
						playerMovement.movement_direction=1;
					if(!gliding)	playerMovement.current_speed = playerMovement.current_speed - (air_control*Time.deltaTime);
					else	playerMovement.current_speed = playerMovement.current_speed - (glide_air_control*Time.deltaTime);
				}
				else
				{
					if(!gliding)	playerMovement.current_speed = playerMovement.current_speed + (air_control*Time.deltaTime);
					else 	playerMovement.current_speed = playerMovement.current_speed + (glide_air_control*Time.deltaTime);
				}
			}	
			
			if(!gliding)	playerMovement.current_speed = Mathf.Clamp(playerMovement.current_speed,0,real_max_jump_speed);
			else playerMovement.current_speed = Mathf.Clamp(playerMovement.current_speed,0,glide_max_speed);
		//	Debug.Log(playerMovement.current_speed + " / " + playerMovement.movement_direction);
			if(((playerMovement.wall_left && playerMovement.movement_direction!=-1) || (playerMovement.wall_right && playerMovement.movement_direction!=1)) || (!playerMovement.wall_right && !playerMovement.wall_left))
			{
				rigidbody.velocity.x = playerMovement.current_speed*playerMovement.movement_direction;
			}

			if(!gliding && playerMovement.current_mode == playerStates.Falling)
			{
				rigidbody.velocity.y = Mathf.Min(min_falling_speed,rigidbody.velocity.y);
			}
			if(gliding)rigidbody.velocity.y = Mathf.Max(rigidbody.velocity.y,glide_max_fall_speed);
			
			if(rotate_in_air &&playerMovement.return_real_axis().x!=0)
			{
					playerMovement.player_graphic_pointer.eulerAngles.y=90*Mathf.Sign(playerMovement.return_real_axis().x);
			}
			
			// if can_stop_jumping is true, we can interrupt the jumping
			if(can_stop_jumping && return_real_jump_up() && playerMovement.current_mode==playerStates.Jumping)
			{
				stop_jumping=true;
			}
			if(stop_jumping)
			{
				rigidbody.velocity.y-=stop_jumping_speed*Time.deltaTime;
			}
			if(playerMovement.current_mode!=playerStates.Jumping)
			{
				stop_jumping=false;
			}
		}
	}
	raycast_down.point=Vector3.zero;
	// raycast down, we need the information!
	if(Physics.Raycast(transform.position,Vector3.up*-1,raycast_down,10,ignore_layer))
	{
		Debug.DrawLine (transform.position, raycast_down.point,Color.yellow);
		var the_distance : float = Vector3.Distance(raycast_down.point,transform.position);
		if(((the_distance>to_bottom) || (raycast_down.point == Vector3.zero)) && playerMovement.current_mode!=playerStates.Jumping && playerMovement.current_mode!=playerStates.Falling  && playerMovement.current_mode!=playerStates.Gliding && playerMovement.current_mode!=playerStates.WallSlide)
		{
			playerMovement.play_animation(animation_fall);
			playerMovement.current_mode=playerStates.Falling;
			temp_fall_distance_y = transform.position.y; //save the y position for fall damage
		}
		if(Vector3.Distance(raycast_down.point,transform.position)<to_bottom && (playerMovement.current_mode==playerStates.Falling || playerMovement.current_mode==playerStates.Gliding || playerMovement.current_mode==playerStates.WallSlide))
		{
			playerMovement.play_animation(playerMovement.animation_idle);
			playerMovement.current_mode=playerStates.Idle;
			jumped=0;
			min_falling_speed=0;
			walljump_right=0;
			walljump_left=0;
			if(falldamage)
			{
				if(falldamage_distance<=Mathf.Abs(temp_fall_distance_y-transform.position.y))
				{
					playerHealth.apply_damage(falldamage_minus_health);
				}
				temp_fall_distance_y=transform.position.y;
			}	
		}
		if(Vector3.Distance(raycast_down.point,transform.position)<to_bottom && raycast_down.transform.tag=="platform")
		{
			transform.parent = raycast_down.transform;
			if(raycast_down.rigidbody)
			{
				playerMovement.extra_force_target=raycast_down.rigidbody;
			}
		}	
		if(Vector3.Distance(raycast_down.point,transform.position)>to_bottom  && transform.parent!=null)
		{
			transform.parent=null;
			playerMovement.extra_force_target=null;
		}	
		if(transform.parent != null && raycast_down.transform.tag!="platform")
		{
				transform.parent=null;
				playerMovement.extra_force_target=null;
		}
		if(raycast_down.transform.tag=="Enemy")
		{
			if((the_distance<to_bottom+0.5))
			{
				raycast_down.transform.SendMessage("apply_damage", jumpattack_damage);
				rigidbody.velocity.y=jumpattack_bounce;
			}
		}
	}
	else
	{
		if(transform.parent!=null)
			transform.parent=null;
		if(playerMovement.current_mode!=playerStates.Jumping && playerMovement.current_mode!=playerStates.Falling && playerMovement.current_mode!=playerStates.Gliding && playerMovement.current_mode!=playerStates.WallSlide)
		{
			playerMovement.play_animation(animation_fall);
			playerMovement.current_mode=playerStates.Falling;
			temp_fall_distance_y = transform.position.y; //save the y position for fall damage
		}
	}
	rigidbody.velocity.y = Mathf.Max(max_fall_speed*-1,rigidbody.velocity.y);
}

function FixedUpdate()
{
		if(playerMovement.current_mode==playerStates.Jumping || playerMovement.current_mode == playerStates.Falling || playerMovement.current_mode == playerStates.Gliding)
		{
		
			if(!gliding)
				rigidbody.AddForce(jump_force,ForceMode.Force);
			else
				rigidbody.AddForce(glide_force,ForceMode.Force);
		}
}

function OnCollisionEnter(collisionInfo : Collision)
{
if(!playerMovement.player_can_move)return;
if(playerMovement.current_mode==playerStates.Jumping || playerMovement.current_mode==playerStates.Falling || playerMovement.current_mode==playerStates.Gliding || playerMovement.current_mode==playerStates.WallSlide)
{
wall_left=false;
wall_right=false;
    for (var contact : ContactPoint in collisionInfo.contacts) {
      //  Debug.DrawRay(contact.point, contact.normal * 10, Color.white);
		if(GetComponent(CapsuleCollider))
		{
			if(transform.InverseTransformPoint(contact.point).x<-0.2)
			{

				if(playerMovement.current_speed>min_speed_for_walljump)
				{
					if(player_must_face_wall)
					{
						if(Mathf.Round(playerMovement.player_graphic_pointer.eulerAngles.y)==270)
						{
							walljump_left = time_for_walljump;
						}
					}
					else
					{
						walljump_left = time_for_walljump;
					}
				}
				block_left=0.2;
				wall_left=true;
				//transform.position.x+=0.005;
				rigidbody.velocity.y = playerMovement.last_velocity.y;
			}
			if(transform.InverseTransformPoint(contact.point).x>0.2 )
			{
				if(playerMovement.current_speed>min_speed_for_walljump)
				{
					if(player_must_face_wall)
					{
						if(Mathf.Round(playerMovement.player_graphic_pointer.eulerAngles.y)==90)
						{
							walljump_right = time_for_walljump;
						}
					}
					else
					{
						walljump_right = time_for_walljump;
					}
				}
				block_right=0.2;
				wall_right=true;
				//transform.position.x-=0.005;
				rigidbody.velocity.y = playerMovement.last_velocity.y;
			}
		}
    }
	}
}

function OnCollisionStay(collisionInfo : Collision)
{
if(!playerMovement.player_can_move)return;
wall_left=false;
wall_right=false;

    for (var contact : ContactPoint in collisionInfo.contacts) {
		if(GetComponent(CapsuleCollider))
		{
			if(contact.normal.x>0.5)
			{
				wall_left=true;
				//transform.position.x+=0.005;
			
			}
			if(contact.normal.x<-0.5)
			{
				wall_right=true;
				//transform.position.x-=0.005;
			}
		}
    }

}
function OnCollisionExit(collisionInfo : Collision)
{
	wall_left=false;
	wall_right=false;
}

function not_on_ground() : boolean
{
	if(Vector3.Distance(raycast_down.point,transform.position)>to_bottom || raycast_down.transform.tag=="climbgotrough")
		return true;
	else
			return false;
}