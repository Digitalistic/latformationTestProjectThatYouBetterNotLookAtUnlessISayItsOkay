private var tolerance : float = 0.5;
function OnTriggerEnter(other : Collider)
{
	if(other.tag=="Player")
	{
		if(other.transform.position.y-other.bounds.extents.y+tolerance>transform.position.y)
		{
			other.rigidbody.velocity.y=20;
		}

	}
}
function OnTriggerStay(other : Collider)
{
	if(other.tag=="Player")
	{
		if(other.transform.position.y-other.bounds.extents.y+tolerance>transform.position.y)
		{
			other.rigidbody.velocity.y=20;
		}

	}
}