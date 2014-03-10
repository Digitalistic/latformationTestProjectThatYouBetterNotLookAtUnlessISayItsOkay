#pragma strict
var max_health : float = 100;
var health : float = 100;
var max_lifes : int = 9;
var lifes : int = 3;
var recover_time : float = 3;
var transparent_while_recover : boolean = true;
private var old_material : Shader;
private var recover_time_count : float = 0;
private var playerMovement : PlayerMovement;
private var playerDead : PlayerDead;
var passable_on_death : boolean = true;
var animation_dead : String = "Dead";

var circle_fadeout : boolean = true;
var wait_for_respawn : float = 1;
var wait_for_fade : float = 2;

var spawn_enemy : Transform;

function apply_damage(damage : float)
{
	if(recover_time_count==0 )
	{
		if(playerMovement.player_graphic_pointer.renderer)
		{
			old_material = playerMovement.player_graphic_pointer.renderer.material.shader;
			playerMovement.player_graphic_pointer.renderer.material.shader = Shader.Find( "Transparent/Diffuse" );
			playerMovement.player_graphic_pointer.renderer.material.SetColor("_Color",Color(1,1,1,0.5));
		}
		playerMovement.current_mode = playerStates.Hit;
		playerMovement.play_animation("Hit");
		health-=damage;
		recover_time_count = recover_time;
	}
}


function Start()
{
	playerMovement = GetComponent(PlayerMovement) as PlayerMovement;
	playerDead = GetComponent(PlayerDead) as PlayerDead;
}

function LateUpdate () {
	health=Mathf.Clamp(health,0,max_health);
	lifes=Mathf.Clamp(lifes,0,max_lifes);
	if(recover_time_count==0)
	{
		if(old_material)
		{
			if(playerMovement.player_graphic_pointer.renderer.material.shader!=old_material)
			{
				playerMovement.player_graphic_pointer.renderer.material.shader=old_material;
				playerMovement.player_graphic_pointer.renderer.material.SetColor("_Color",Color(1,1,1,1));
			}
		}
	}
	else
	{
		recover_time_count=Mathf.Max(0,recover_time_count-Time.deltaTime);
	}
	if(health<=0 && playerMovement.current_mode != playerStates.Dead)
	{
		playerMovement.current_mode = playerStates.Dead;
		playerMovement.player_can_move=false;
		playerMovement.play_animation(animation_dead);
		if(passable_on_death)
		{
			collider.isTrigger=true;
			playerMovement.freeze_player=true;
		}
		playerDead.respawn(circle_fadeout,wait_for_fade,wait_for_respawn);
		if(spawn_enemy)
		{
			Instantiate(spawn_enemy,transform.position, Quaternion.identity);
		}
	}
}