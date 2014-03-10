#pragma strict
enum playerStates {Idle , Walking , Running , Stopping , Sliding , Jumping , Falling , Gliding , Boosting , WallSlide, Climbing, Dead, Hit, Attack, Crouching}

var player_graphic_pointer : Transform;
var plus_rotate_angle : int = 0;
var player_can_move : boolean = true; // if false then the player can't move
var freeze_player : boolean = false; // if true, the player will be freezed (for cutscenes etc.)
var hold_button_to_run : boolean = false; // if true then you have to hold a button to get into the run mode
var max_walking_speed : float = 6; // the maximal speed we can walk and/or switch to running
var max_running_speed : float = 8; // the maximal running speed
var gain_move_speed : float = 12; // how fast will we get to the maximum?
var lose_move_speed : float=13; // how fast will we lose the speed if we won't press a button
var stopping_lose_move_speed : float=15; // how quick do we stop if we are going against movement direction?

var x_axis_name : String = "Horizontal"; // the buttons and/or controller-analogstick for left&right. use this to make a multiplayer game
var y_axis_name : String = "Vertical";
var x_add_axis : float = 0;
var run_button_name : String = "Fire2";	

var current_speed : float = 0; // this is our calculated speed, the velocity of the rigidbody can get in the way
var current_external_speed : float = 0; // useful if you wanna move the player from an external script (like PlayerVerticalMovement)
private var max_speed : float = 0; // internal max speed for looking the speed

var current_mode : playerStates = playerStates.Idle; // the current and start mode we're in
var movement_direction : int = 1; // the last direction we moved

var wall_left : boolean = false; // is a wall left from us?
var wall_right : boolean = false; // is a wall right from us?
private var last_max_speed : float = 0; // needed to slowly decrease the max_speed
var last_velocity : Vector3; // for now a workaround for the stuck-in-wall problem
var animation_2d_component : Animation2D; // the 2danimation component we will use
var animation_3d_component : Animation3D; // the 3danimation component we will use
var animation_sm_component : AnimationSM; // the smooth moves component we will use

enum ani_type {a2d,a3d,aSM}
private var animation_type : ani_type;
private var use_sm_animation : boolean = false;
var boost_graphic : Transform; // if assigned this will be spawned in the player if we extra boost
private var boost_pointer : Transform;
var can_extra_boost : boolean = true;
var time_till_boost : float = 3;
var max_boost_speed : float = 12;
private var boost_count_down : float = 0;

var animation_idle : String = "Idle";
var animation_walk : String = "Walk";
var animation_run : String = "Run";
var animation_slide : String = "Slide";
var animation_runslide : String = "RunSlide";
var animation_stop : String = "Stop";
var animation_boost : String = "Boost";
var animation_goal : String = "Goal";

var use_mobile_input : boolean = false;
var mobile_joystick : Joystick;
var mobile_run : Joystick;

var sound_boost : AudioClip;

var collisionCount = 0.0;
var extra_force_target : Rigidbody; // this is used for temporaly add some extra force. like standing on an enemy!
function play_animation(name : String)
{
		if(animation_type==ani_type.a3d)
		{
			animation_3d_component.play_animation(name);
		}
		if(animation_type==ani_type.a2d)
		{
			animation_2d_component.play_animation(name);
		}
		if(animation_type==ani_type.aSM)
		{
			animation_sm_component.play_animation(name);
		}
}

function return_ani_ID(name : String)
{
		if(animation_type==ani_type.a3d)
		{
			return animation_3d_component.return_ani_ID(name);
		}
		if(animation_type==ani_type.a2d)
		{
			return animation_2d_component.return_ani_ID(name);
		}
		if(animation_type==ani_type.aSM)
		{
			return animation_sm_component.return_ani_ID(name);
		}
}

function current_animation() : int
{
		if(animation_type==ani_type.a3d)
		{
			return animation_3d_component.current_animation;
		}
		if(animation_type==ani_type.a2d)
		{
			return animation_2d_component.current_animation;
		}
		if(animation_type==ani_type.aSM)
		{
			return animation_sm_component.current_animation;
		}
}

function AniisPlaying()
{
	if(animation_type==ani_type.a3d)
	{
		return animation_3d_component.character_pointer.animation.isPlaying;
	}
	if(animation_type==ani_type.a2d)
	{
		return animation_2d_component.isPlaying();
	}
	if(animation_type==ani_type.aSM)
	{
		return animation_sm_component.isPlaying();
	}
}

function PlaySound(sound : AudioClip)
{
	if(sound)
		AudioSource.PlayClipAtPoint(sound, transform.position);
}


function Start()
{
	rigidbody.sleepVelocity = 0; // a good player never sleeps!
	rigidbody.sleepAngularVelocity = 0;
	tag = "Player"; // WE are the player, okaaaay?!
	if(GetComponent(Animation2D))
	{
		animation_2d_component = GetComponent(Animation2D) as Animation2D; // get the animation component
		animation_type=ani_type.a2d;
	}
	if(GetComponent(Animation3D))
	{
		animation_type=ani_type.a3d;
		animation_3d_component = GetComponent(Animation3D) as Animation3D; // get the animation component
	}
	if(GetComponent(AnimationSM))
	{
		animation_type=ani_type.aSM;
		animation_sm_component = GetComponent(AnimationSM) as AnimationSM; // get the animation component
	}
	if(!player_graphic_pointer) // no graphic plane? then we must be the graphic plane!
		player_graphic_pointer=transform;
		
	if(movement_direction!=0)player_graphic_pointer.eulerAngles.y=(plus_rotate_angle)+(movement_direction*90); // start direction
}

//// this functions returns the correct button that is needed right now. this is needed for mobile versions of the game. if use_mobile_input is true, it will return the mobile inputs ////////
function return_real_axis() : Vector2
{
	if(!player_can_move)return Vector2(0,0);
	if(use_mobile_input)
	{
		return mobile_joystick.position;
	}
	else
	{
		if(x_axis_name!="")
		{
			return Vector2(Input.GetAxis(x_axis_name)+x_add_axis,Input.GetAxis(y_axis_name));
		}
		else
		{
			return Vector2(x_add_axis,Input.GetAxis(y_axis_name));
		}
	}
}

function return_real_run() : boolean
{
	if(!player_can_move)return false;
	if(use_mobile_input)
	{
		return mobile_run.IsFingerDown();
	}
	else
	{
		return Input.GetButton(run_button_name);
	}
}

///////////////////////////////////////////////


function FixedUpdate () {
if(collisionCount<0){wall_left=false; wall_right=false;}
collisionCount-=0.1;
	if(freeze_player){rigidbody.isKinematic=true;return;} // we don't need to process any code, if we are freezed
	else {rigidbody.isKinematic=false;}
	last_velocity = rigidbody.velocity; // save the current velocity
	if(boost_pointer) // if we have a boostgrapic...
	{
		if(current_mode!=playerStates.Boosting) //... and are not boosting..
		{
			Destroy(boost_pointer.gameObject); //.. destroy the boost graphic
		}
	}
	if(current_mode==playerStates.Hit && !AniisPlaying()) // if we get hit and the animation for it is over, go back to idle state
	{
			current_mode=playerStates.Idle;
			play_animation(animation_idle);
	}
	//if(current_mode==playerStates.Jumping|| current_mode==playerStates.Falling || current_mode==playerStates.Gliding ||  current_mode==playerStates.WallSlide ||  current_mode==playerStates.Climbing ||  current_mode==playerStates.Hit) // in some cases, we can't use our movement code
	if(current_mode!=playerStates.Stopping && current_mode!=playerStates.Walking && current_mode!=playerStates.Idle && current_mode!=playerStates.Running && current_mode!=playerStates.Walking && current_mode!=playerStates.Sliding && current_mode!=playerStates.Boosting)
		return; // don't go further, if our state has nothing to do with basic movement

	if((current_mode==playerStates.Walking) || (current_mode==playerStates.Running) || (current_mode==playerStates.Boosting)) // check the direction we are moving
	{
		if(return_real_axis().x!=0.0)
		{
			if(Mathf.Sign(return_real_axis().x)!=movement_direction) // we changed the direction while walking, let's stop
			{
				current_mode=playerStates.Stopping;
				play_animation(animation_stop);
			}
			movement_direction = Mathf.Sign(return_real_axis().x); // -1 = left; 1 = right;
			if(current_mode!=playerStates.Jumping && current_mode!=playerStates.Falling)
			{
			 	player_graphic_pointer.eulerAngles.y=(plus_rotate_angle)+(movement_direction*90);
			}
		}
	}
	if((Mathf.Abs(return_real_axis().x)<0.01 || !player_can_move)  && current_mode!=playerStates.Idle && current_mode!=playerStates.Dead && current_mode!=playerStates.Stopping && current_mode!=playerStates.Sliding && current_external_speed == 0) // no joystick input? then idle
	{
		current_mode=playerStates.Idle;
		play_animation(animation_idle);
		last_max_speed=0;
	}	
	if(current_mode==playerStates.Stopping) // we are stopping
	{
		if(Mathf.Sign(return_real_axis().x)==movement_direction && player_can_move) // we are still trying to get in the stopping direction
		{
			current_speed = Mathf.Max(0,current_speed-(stopping_lose_move_speed*Time.deltaTime));
		}
		else // if not then stop the stopping
		{	
			current_mode=playerStates.Idle;
			play_animation(animation_idle);
			movement_direction = movement_direction*-1;
		}
		if(current_speed==0){current_mode=playerStates.Idle;play_animation(animation_idle);}
		if(extra_force_target)rigidbody.velocity.x = extra_force_target.velocity.x + current_speed*movement_direction*-1;
		return;
	}
	if(current_mode==playerStates.Sliding) // we slow down
	{
		if(current_speed<0.1 && current_external_speed < 0.1)
		{
			current_mode=playerStates.Idle;
			play_animation(animation_idle);
		}
		max_speed = current_speed;
	}
	if(current_mode==playerStates.Idle) // if we idle, the max speed is the maximun, so we can decrease
	{
		if(current_speed>0.1)
		{
			current_mode=playerStates.Sliding;
			if(current_speed<max_running_speed)
				play_animation(animation_slide);
			else
				play_animation(animation_runslide);
		}
		max_speed = current_speed;
	}
	if(player_can_move)
	{
		if(current_mode==playerStates.Walking)
			max_speed = max_walking_speed*Mathf.Abs(return_real_axis().x);
		if(current_mode==playerStates.Running)
		{
			max_speed = max_running_speed*Mathf.Abs(return_real_axis().x);	
			if(current_speed==max_running_speed)boost_count_down-=Time.deltaTime;
			else boost_count_down = time_till_boost;
			if(boost_count_down<0 && can_extra_boost)
			{
				current_mode=playerStates.Boosting;
				play_animation(animation_boost);
				if(boost_graphic)
				{
					boost_pointer = Instantiate (boost_graphic,  player_graphic_pointer.transform.position, Quaternion.identity) as Transform;
					boost_pointer.transform.parent = transform;
					boost_pointer.transform.position-= Vector3.forward/2;
					boost_pointer.transform.eulerAngles = player_graphic_pointer.transform.eulerAngles;
					PlaySound(sound_boost);
				}
			}
			if(hold_button_to_run && !return_real_run())
			{
				current_mode=playerStates.Walking;
				play_animation(animation_walk);
			}
		}
		if(current_mode==playerStates.Boosting)
		{
			max_speed = max_boost_speed*Mathf.Abs(return_real_axis().x);	
		}
	}
	if(max_speed < last_max_speed)
	{
		max_speed = last_max_speed - lose_move_speed*Time.deltaTime;
	}
	else
	{
		last_max_speed = max_speed;
	}
	if(Mathf.Abs(return_real_axis().x)>0.01 && player_can_move && (current_mode==playerStates.Idle || current_mode==playerStates.Sliding))
	{
		//	max_speed=0;
		last_max_speed=0;
		current_mode=playerStates.Walking;
		play_animation(animation_walk); 	
	}
	if(wall_left && movement_direction==-1)
	{
		current_speed =0;
	}	
	if(wall_right && movement_direction==1)
	{
		current_speed = 0;
	}
	if(current_mode!=playerStates.Stopping)
	{
		if(Mathf.Abs(return_real_axis().x)>0.02)
			current_speed = Mathf.Clamp(current_speed+(gain_move_speed*Time.deltaTime),max_speed*-1,max_speed);
		else
		{
			current_speed = Mathf.Clamp(current_speed-(lose_move_speed*Time.deltaTime),0,max_speed);
		}
		if(extra_force_target)
		{
			if(((wall_left && movement_direction!=-1) || (wall_right && movement_direction!=1)) || (!wall_right && !wall_left))
			{
				rigidbody.velocity.x =  current_speed*movement_direction;
			}
			else
			{
				Debug.Log("nein");
			}
			rigidbody.AddForce(extra_force_target.velocity);
			//rigidbody.velocity.y =  extra_force_target.velocity.y;
		}
		else
		{
			if((((wall_left && movement_direction!=-1) || (wall_right && movement_direction!=1)) || (!wall_right && !wall_left)))
			{
				rigidbody.velocity.x =  current_speed*movement_direction;
			}
		}
	}
	
	if((current_speed<=max_running_speed && current_mode == playerStates.Boosting))
	{
		play_animation(animation_run);
		current_mode=playerStates.Running;
	}

	if((current_speed<=max_walking_speed && current_mode == playerStates.Running))
	{
		play_animation(animation_walk);
		current_mode=playerStates.Walking;
	}
	if((current_speed>=max_walking_speed && current_mode == playerStates.Walking && !hold_button_to_run) || (hold_button_to_run && return_real_run()  && current_mode == playerStates.Walking && current_speed>=max_walking_speed))
	{
		current_mode=playerStates.Running;
		play_animation(animation_run);
		boost_count_down = time_till_boost; // reset the countdown
	}
	if(current_mode!=playerStates.Idle)
		last_max_speed = max_speed;
}


function OnCollisionEnter(collisionInfo : Collision)
{
collisionCount=1;
	if(current_mode!=playerStates.Jumping || current_mode!=playerStates.Falling ||  current_mode!=playerStates.Hit || current_mode!=playerStates.Gliding || current_mode!=playerStates.WallSlide || current_mode!=playerStates.WallSlide )
	{
	//wall_left=false;
	//wall_right=false;
	    for (var contact : ContactPoint in collisionInfo.contacts) 
	    {
	        Debug.DrawRay(contact.point, contact.normal * 10, Color.white);
			if(GetComponent(CapsuleCollider))
			{
				if(transform.InverseTransformPoint(contact.point).x<-0.2)
				{
					wall_left=true;
					//transform.position.x+=0.005;
					rigidbody.velocity.y = last_velocity.y;
				}
				if(transform.InverseTransformPoint(contact.point).x>0.2)
				{
					wall_right=true;
					//transform.position.x-=0.005;
					rigidbody.velocity.y = last_velocity.y;
				}
			}
	    }
	}
}

function OnCollisionStay(collisionInfo : Collision)
{
collisionCount=1;
wall_right=false;
wall_left=false;yield WaitForFixedUpdate();
    for (var contact : ContactPoint in collisionInfo.contacts) {
		if(GetComponent(CapsuleCollider))
		{/*
			if(transform.InverseTransformPoint(contact.point).x<-0.1)
			{
				t_wall_left=true;
				//transform.position.x+=0.005;
			}
			if(transform.InverseTransformPoint(contact.point).x>0.1)
			{
				t_wall_right=true;
				//transform.position.x-=0.005;
			}*/
			if(contact.normal.x>0.5)
			{
				wall_left=true;
				//transform.position.x+=0.005;
				Debug.Log(wall_left + "  " + Time.time);
			
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

Debug.Log("Exit" + Time.time);

    for (var contact : ContactPoint in collisionInfo.contacts) {
        Debug.DrawRay(contact.point, contact.normal * 10, Color.red);
		if(GetComponent(CapsuleCollider))
		{Debug.Log(contact.normal+"  "+Time.time);
			/*if(transform.InverseTransformPoint(contact.point).x<-0.2)
			{
				wall_left=false;
				//transform.position.x+=0.005;
			}
			if(transform.InverseTransformPoint(contact.point).x>0.2)
			{
				wall_right=false;
				//transform.position.x-=0.005;
			}*/
			if(contact.normal.x>0.5)
			{
			//	wall_left=false;
				//transform.position.x+=0.005;
			}
			if(contact.normal.x<-0.5)
			{
				//wall_right=false;
				//transform.position.x-=0.005;
			}
		}
	}
}