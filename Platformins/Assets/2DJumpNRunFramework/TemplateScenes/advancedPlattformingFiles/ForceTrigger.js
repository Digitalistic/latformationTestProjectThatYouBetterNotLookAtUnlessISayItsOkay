var power : float = 5;

function OnTriggerStay(collisionInfo : Collider)
{
	    if(collisionInfo.rigidbody)
	    {
				collisionInfo.rigidbody.AddForce(transform.TransformDirection (Vector3.up)*power);
	    }
}
