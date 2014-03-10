#pragma strict
var can_climb : boolean = false;
var climb_object : Transform;
var climbing : boolean = false;
var climb_speed : float = 5;
var locked_x : boolean = true;
var jump_while_climbing : boolean = true;
private var playerMovement : PlayerMovement;
var animation_climbingIdle : String = "ClimbingIdle";
var animation_climbing : String = "Climbing";
private var cant_unclimb : boolean = false;
private var mycollider : CapsuleCollider;
private var jumping_component : PlayerJumping;
private var climb_cooldown : float = 0;
var unclimb : boolean = false;
function Start()
{
	playerMovement = GetComponent(PlayerMovement) as PlayerMovement;
	mycollider = GetComponent(CapsuleCollider) as CapsuleCollider;
	jumping_component = GetComponent(PlayerJumping) as PlayerJumping;
}

function change_colission(bool : boolean)
{
		var objects = gameObject.FindGameObjectsWithTag("climbgotrough");
		for (var obj : GameObject in objects)
		{
			Physics.IgnoreCollision(collider,obj.collider, bool);
			if(bool)
			{
				obj.layer=2;
			}
			else
			{
				obj.layer=0;
			}
		}
}
private var p1 : Vector3;
private var p2 : Vector3;
function inside_object()
{
  var hit : RaycastHit;
    p1 = transform.position - Vector3(0,mycollider.bounds.extents.y,0);
     p2 = transform.position + Vector3(0,mycollider.bounds.extents.y,0);
    // Cast character controller shape 10 meters forward, to see if it is about to hit anything
    var all = Physics.CapsuleCastAll(p1, p2, mycollider.radius/2,  transform.right, 10,-1);
	Debug.DrawLine(p1,p2,Color.green);
		var found : boolean = false;
		for(var obj : RaycastHit in all)
		{
			if(obj.transform.tag=="climbgotrough")
				found=true;
		}
		if(found)cant_unclimb=true;
		else cant_unclimb = false;

}

var raycast_down : RaycastHit;
private var wait_unclimb : int = 0;
function Update () {

if(!playerMovement.player_can_move || playerMovement.current_mode==playerStates.Hit)return;
	var to_bottom = mycollider.bounds.size.y/2+0.1;
	climb_cooldown = Mathf.Max(0,climb_cooldown-Time.deltaTime);

	if(can_climb && playerMovement.current_mode!=playerStates.Climbing && climb_cooldown==0)
	{
		if((playerMovement.return_real_axis().y>0.1 || (playerMovement.return_real_axis().y<-0.1 && jumping_component.not_on_ground())) && (playerMovement.return_real_axis().x<0.1 && playerMovement.return_real_axis().x>-0.1))
		{
			playerMovement.current_mode=playerStates.Climbing;
			playerMovement.current_speed = 0;
			change_colission(true);
		}
	}
	if(playerMovement.current_mode==playerStates.Climbing)
	{
	playerMovement.movement_direction = Mathf.Sign(playerMovement.return_real_axis().x);
	playerMovement.player_graphic_pointer.eulerAngles.y=90*playerMovement.movement_direction;
	if(rigidbody.velocity.magnitude>0.3)
	{
		if(playerMovement.return_ani_ID(animation_climbing) != playerMovement.current_animation())
		{
			playerMovement.play_animation(animation_climbing);
		}
	}
	else
	{
		if(playerMovement.return_ani_ID(animation_climbingIdle) != playerMovement.current_animation())
		{
			playerMovement.play_animation(animation_climbingIdle);
		}
	}
	
	if(jumping_component) jumping_component.jumped=0;
		rigidbody.useGravity=false;
		rigidbody.velocity.y = playerMovement.return_real_axis().y*climb_speed;
		if(locked_x)
		{
			rigidbody.velocity.x = 0;
			transform.position.x = climb_object.position.x;
			if((playerMovement.return_real_axis().x>0.5 || playerMovement.return_real_axis().x<-0.5) && !cant_unclimb)
			{
				playerMovement.play_animation(jumping_component.animation_fall);
				playerMovement.current_mode=playerStates.Idle;
				rigidbody.useGravity=true;
				change_colission(false);
				rigidbody.velocity.y = 0;
				climb_cooldown=0.5;
			}
		}
		else
			rigidbody.velocity.x = playerMovement.return_real_axis().x*climb_speed;
		if(transform.position.y > climb_object.position.y+climb_object.collider.bounds.size.y/2 && !cant_unclimb)
		{
			playerMovement.current_mode=playerStates.Falling;
			playerMovement.play_animation(jumping_component.animation_fall);
			can_climb=false;
			rigidbody.useGravity=true;
			change_colission(false);
			rigidbody.velocity.y = 0;
			climb_cooldown=0.5;
		}
		if(!can_climb)
		{
			playerMovement.current_mode=playerStates.Falling;
			playerMovement.play_animation(jumping_component.animation_fall);
			can_climb=false;
			rigidbody.useGravity=true;
			change_colission(false);
			rigidbody.velocity.y = 0;
			climb_cooldown=0.5;
		}
		
			raycast_down.point=Vector3.zero;
		// raycast down, we need the information!
		if(Physics.Raycast(transform.position,Vector3.up*-1,raycast_down,10,-5))
		{
			Debug.DrawLine (transform.position, raycast_down.point,Color.yellow);
			if(Vector3.Distance(raycast_down.point,transform.position)<to_bottom &&   playerMovement.return_real_axis().y<-0.1 && !cant_unclimb)
			{
				playerMovement.play_animation(playerMovement.animation_idle);
				playerMovement.current_mode=playerStates.Idle;
				rigidbody.useGravity=true;
				change_colission(false);
				rigidbody.velocity.y = 0;
			}	
		}
		inside_object();
		if(jump_while_climbing && jumping_component)
		{
			if(Input.GetButtonDown(jumping_component.jump_button_name) && !cant_unclimb)
			{
				climb_cooldown=1;
				jumping_component.jump_now(Mathf.Sign(playerMovement.return_real_axis().x));
				playerMovement.current_speed = rigidbody.velocity.x;
				playerMovement.play_animation(jumping_component.animation_jump);
				playerMovement.current_mode=playerStates.Jumping;
				rigidbody.useGravity=true;
				change_colission(false);
				rigidbody.velocity.y = 0;
				can_climb=false;
				return;
			}
		}
	}
	if(unclimb){wait_unclimb++; if(wait_unclimb==2)can_climb=false;}
	else wait_unclimb=0;
}
