#pragma strict
function Start()
{
	gameObject.layer = 2;
	if(renderer)renderer.enabled=false;
}
function OnTriggerEnter (other : Collider) {
	if(other.transform.tag == "Player")
	{
		var playerDead = other.GetComponent(PlayerDead) as PlayerDead;
		playerDead.last_respawn = transform;
	}
}