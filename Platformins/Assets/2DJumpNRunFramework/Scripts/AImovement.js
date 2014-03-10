#pragma strict
enum aiStates {Idle , Walking , Running , Stopping , Sight , Jumping , Falling , Attack , Hit , WallSlide, Climbing, Dead}
var current_mode : aiStates = aiStates.Idle;
var ai_graphic_pointer : Transform;
var ai_can_move : boolean = true;

var walk_speed : float=2;
var run_speed : float=4;

var random_stop_chance : float = 0.2;
var random_stop_length : Vector2 = Vector2(1,3);
private var wait_before_unidle : float = 1;
var sight_distance : float = 3;
var sight_interval : int = 3;
var sight_interval_count : int = 0;
var direction : int = 1;

var attack_target : GameObject;
var turn_to_target : boolean = true;
var turn_to_target_interval : int = 24;
private var turn_to_target_interval_count : int = 0;
var run_torwards_target : boolean = true;
var play_animation_at_sight : boolean = true;
var lose_target_at_distance : float = 15;
var attack_target_at_distance : float = 2;
var wait_till_attack : float = 0.2;
var attack_impact : float = 3;
var delay_attack : float = 2;
private var delay_attack_count : float = 0;
private var wait_till_attack_count : float = 0;
private var attacked : boolean = false;
var attack_damage : float = 25;
var attack_collider : Transform;
var slow_down_near_target : boolean = true;
var slow_down_distance : float = 1;
var slow_down_by : float = 2;
var AI_health : float = 25;
var AI_maxhealth : float = 25;
var disappear_after_death : boolean = true;
var disappear_after_seconds : float  = 2;
private var current_disappear_after_seconds : float = 0;
var recover_time : float = 1;
private var recover_time_count : float = 0;

/// animation stuff ////
internal var animation_2d_component : Animation2D; // the 2danimation component we will use
internal var animation_3d_component : Animation3D; // the 3danimation component we will use
private var use_3d_animation : boolean = false;

var spawn_items : Transform[];
function play_animation(name : String)
{
		if(use_3d_animation)
		{
			animation_3d_component.play_animation(name);
		}
		else
		{
			animation_2d_component.play_animation(name);
		}
}

function return_ani_ID(name : String)
{
		if(use_3d_animation)
		{
			return animation_3d_component.return_ani_ID(name);
		}
		else
		{
			return animation_2d_component.return_ani_ID(name);
		}
}

function current_animation() : int
{
		if(use_3d_animation)
		{
			return animation_3d_component.current_animation;
		}
		else
		{
			return animation_2d_component.current_animation;
		}
}

function AniisPlaying()
{
	if(use_3d_animation)
	{
		return animation.isPlaying;
	}
	else
	{
		return animation_2d_component.isPlaying();
	}
}
/// end animation stuff///


internal var coll : CapsuleCollider;
function Start()
{
	if(GetComponent(Animation2D))
	{
		animation_2d_component = GetComponent(Animation2D) as Animation2D; // get the animation component
	}
	if(GetComponent(Animation3D))
	{
		use_3d_animation=true;
		animation_3d_component = GetComponent(Animation3D) as Animation3D; // get the animation component
	}
	coll = GetComponent(CapsuleCollider) as CapsuleCollider;
}

function apply_damage(damage : float)
{
	if(recover_time_count==0)
	{
		current_mode = aiStates.Hit;
		play_animation("Hit");
		AI_health-=damage;
		recover_time_count = recover_time;
	}
}


private var atck_coll : GameObject;
function Update () {
	delay_attack_count = Mathf.Max(0,delay_attack_count-Time.deltaTime);
	ai_graphic_pointer.eulerAngles.y=90*direction;
	AI_health = Mathf.Min(AI_health,AI_maxhealth);
	if(current_mode==aiStates.Hit)
	{
		if(!AniisPlaying())
		{
			current_mode=aiStates.Idle;
		}
	}
	if(AI_health<=0)
	{
		if(current_mode!=aiStates.Dead)
		{
			transform.tag="Untagged";
			current_mode=aiStates.Dead;
			play_animation("Dead");
			if(spawn_items.length>0)
			{
				var pointer : Transform;
				for(var i : int = 0; i<spawn_items.length; i++)
				{
					pointer = Instantiate (spawn_items[i],  transform.position, Quaternion.identity) as Transform;
					Physics.IgnoreCollision(pointer.collider,collider);
				}
			}
		}
		else
		{
			if(disappear_after_death)
			{
				if(current_disappear_after_seconds>disappear_after_seconds)
				{
					Destroy(gameObject);
				}
				current_disappear_after_seconds+=Time.deltaTime;
			}
		}
		return;
	}	
	recover_time_count=Mathf.Max(0,recover_time_count-Time.deltaTime);
	if(current_mode==aiStates.Idle)
	{
		wait_before_unidle-=Time.deltaTime;
		if(wait_before_unidle<0)
		{
			current_mode = aiStates.Walking;
			play_animation("Walk");
		}
		if(attack_target)
		{
			play_animation("Run");
			current_mode=aiStates.Running;
		}
	}
	if(current_mode==aiStates.Walking)
	{
		rigidbody.velocity.x=direction*walk_speed;
		if(Random.value<random_stop_chance/50)
		{
			play_animation("Idle");
			current_mode=aiStates.Idle;
			wait_before_unidle=Random.Range(random_stop_length[0],random_stop_length[1]);
		}
	}
	if(current_mode==aiStates.Running)
	{
		rigidbody.velocity.x=direction*run_speed;
	}
	if(current_mode==aiStates.Sight)
	{
		rigidbody.velocity.x=0;
		if(!AniisPlaying())
		{
			play_animation("Run");
			current_mode=aiStates.Running;
		}
		if(attack_target)
		{
		
		}
	}
	if(current_mode==aiStates.Attack)
	{
		wait_till_attack_count+=Time.deltaTime;
		if(wait_till_attack_count>wait_till_attack && !attacked)
		{
			attacked=true;
			atck_coll = Instantiate (attack_collider.gameObject, transform.position+(attack_collider.position*direction), Quaternion.identity) as GameObject;
			var atck_scr = atck_coll.GetComponent(TriggerAttack) as TriggerAttack;
			atck_scr.damage = attack_damage;
			atck_scr.attacking_guy = gameObject;
			atck_scr.pushback = attack_impact;
			delay_attack_count=delay_attack;
		}
		if(!AniisPlaying())
		{
			play_animation("Idle");
			current_mode=aiStates.Idle;
			wait_till_attack_count=0;
			attacked=false;
			if(atck_coll)
			{
				Destroy(atck_coll);
			}
		}
	}
	else
	{
		wait_till_attack_count=0;
		attacked=false;
		if(atck_coll)
		{
			Destroy(atck_coll);
		}
	}
	if(attack_target)
	{
		if(turn_to_target)
		{
			turn_to_target_interval_count++;
			turn_to_target_interval_count=turn_to_target_interval_count%turn_to_target_interval;
			if(turn_to_target_interval_count==0)
			{
				direction=Mathf.Sign(attack_target.transform.position.x-transform.position.x);
			}
		}
		if(Vector3.Distance(transform.position,attack_target.transform.position)<attack_target_at_distance+slow_down_distance && slow_down_near_target)
		{
			rigidbody.velocity.x=rigidbody.velocity.x/slow_down_by;
		}
		if(Vector3.Distance(transform.position,attack_target.transform.position)<attack_target_at_distance && current_mode!=aiStates.Attack && delay_attack_count==0)
		{
			play_animation("Attack");
			current_mode=aiStates.Attack;
		}
		if(Vector3.Distance(transform.position,attack_target.transform.position)>lose_target_at_distance)
		{
			attack_target=null;
			play_animation("Idle");
			current_mode=aiStates.Idle;
			wait_before_unidle=Random.Range(random_stop_length[0],random_stop_length[1]);
		}
	}
	if(sight_interval_count==0) // check for player, walls and other things, if you want!
	{
		var fwd : Vector3= transform.TransformDirection (Vector3.right*direction);
		var hit : RaycastHit;
		if (Physics.Raycast (transform.position, fwd,hit, sight_distance)) 
		{
			Debug.DrawLine (transform.position, hit.point,Color.red);
			if(hit.transform.tag=="Player" && !attack_target)
			{
				attack_target=hit.transform.gameObject;
				if(play_animation_at_sight)
				{
					current_mode=aiStates.Sight;
					play_animation("OnSight");
				}
				else
				{
					if(run_torwards_target)
					{
						play_animation("Run");
						current_mode=aiStates.Running;
					}
				}
			}
			if(hit.transform.tag!="Player" && GetComponent(CapsuleCollider))
			{
				if(Vector3.Distance(transform.position, hit.point)<coll.radius+0.5)
				{
					direction = direction*-1;
				}
			}
		}
	}
	sight_interval_count++;
	sight_interval_count=sight_interval_count%sight_interval;
}