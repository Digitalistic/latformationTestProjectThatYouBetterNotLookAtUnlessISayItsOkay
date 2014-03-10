#pragma strict

var new_x_axis : float = 0;
function Start()
{
	gameObject.layer = 2;
	if(renderer)renderer.enabled=false;
}
function OnTriggerEnter (other : Collider) {
	if(other.transform.tag == "Player")
	{
		var playerMovement = other.GetComponent(PlayerMovement) as PlayerMovement;
		playerMovement.x_add_axis = new_x_axis;
	}
}