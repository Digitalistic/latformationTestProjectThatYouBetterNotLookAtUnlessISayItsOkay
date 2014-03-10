#pragma strict
var load_level : String = "level_name";
var wait_till_fadeout : float = 2;
var wait_till_lvl_change : float = 4;
private var already_triggered : boolean = false;
function OnTriggerEnter (other : Collider) {
	if(other.transform.tag == "Player" && !already_triggered)
	{
		var playerMovement = other.GetComponent(PlayerMovement) as PlayerMovement;
		playerMovement.freeze_player=true;
		playerMovement.play_animation(playerMovement.animation_goal);
		already_triggered=true;
	yield WaitForSeconds(wait_till_fadeout);
	var helperFadeout = camera.main.GetComponent(HelperFadeout) as HelperFadeout;
	if(helperFadeout)
		helperFadeout.circle_fade("out");
	yield WaitForSeconds(wait_till_lvl_change-wait_till_fadeout);
	Application.LoadLevel(load_level);
	}
}