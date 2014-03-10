#pragma strict
function OnTriggerStay (other : Collider) {
	if(other.transform.tag == "Player")
	{
		if(other.GetComponent(PlayerClimbing))
		{
			var playerClimbing = other.GetComponent(PlayerClimbing) as PlayerClimbing;
			playerClimbing.can_climb = true;
			playerClimbing.climb_object = transform;
			playerClimbing.locked_x = locked_x;
			playerClimbing.unclimb=false;
		}
	}
}

function OnTriggerExit(other : Collider)
{
	if(other.transform.tag == "Player")
	{
		var playerClimbing = other.GetComponent(PlayerClimbing) as PlayerClimbing;
		if(playerClimbing)
		{
			playerClimbing.unclimb = true;
		}
	}
}

var locked_x : boolean = true;

function Start () {
	tag = "climbable";
	gameObject.layer = 2;
		if(renderer)renderer.enabled=false;
}