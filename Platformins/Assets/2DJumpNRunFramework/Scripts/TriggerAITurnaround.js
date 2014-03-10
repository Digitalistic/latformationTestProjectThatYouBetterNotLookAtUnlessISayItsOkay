function OnTriggerEnter(other : Collider)
{
	if(other.transform.tag=="Enemy")
	{
		var movement : AImovement = other.GetComponent(AImovement) as AImovement;
		movement.direction=movement.direction*-1;
	}

}

function Start()
{
	renderer.enabled=false;
	gameObject.layer = 2;
}