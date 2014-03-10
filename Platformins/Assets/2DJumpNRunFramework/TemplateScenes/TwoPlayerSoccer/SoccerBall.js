#pragma strict
// a little script to make the soccer ball a bit more interesting :)

function Start () {

}


function OnCollisionEnter(collision : Collision) {
	if(collision.transform.tag=="Player")
	{
		var playerMovement : PlayerMovement = collision.transform.GetComponent(PlayerMovement) as PlayerMovement;
	    for (var contact : ContactPoint in collision.contacts) {
	  		var upforce : float;
		    if(playerMovement.current_mode==playerStates.Jumping)
		    {
		    	upforce=10;
		   	}
	    	Debug.Log(contact.point.x-transform.position.x);
	    	rigidbody.AddForce(Vector3(Mathf.Sign(contact.point.x-transform.position.x)*playerMovement.current_speed*-1,upforce,0)*10);
	        Debug.DrawRay(contact.point, contact.normal, Color.white);
	    }
    }
   
}

  var maxSpeed : float = 20;

function FixedUpdate()
{
        if(rigidbody.velocity.magnitude > maxSpeed)
        {
               rigidbody.velocity = rigidbody.velocity.normalized * maxSpeed;
        }
  }