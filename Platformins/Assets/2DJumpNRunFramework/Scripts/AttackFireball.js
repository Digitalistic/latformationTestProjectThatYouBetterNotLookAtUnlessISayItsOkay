var direction = 1;

var bounce : float = 3;
var speed : float = 3;
var damage : float = 50;
private var lifespan : float = 2.5;
function OnCollisionStay(collisionInfo : Collision)
{
	if(collisionInfo.transform.tag!="Projectile")
	{
	    for (var contact : ContactPoint in collisionInfo.contacts) {
				if(transform.position.y-contact.point.y<0.8)
				{
					rigidbody.velocity.y=bounce;
				}
				if(transform.position.x-contact.point.x<-0.3)
				{
					direction=-1;
				}
				if(transform.position.x-contact.point.x>0.3)
				{
					direction=1;
				}
	    }
	}
    if(collisionInfo.transform.tag=="Enemy")
    {
    	collisionInfo.transform.SendMessage("apply_damage", damage);
    	Destroy(gameObject);
    }
}
function Update () {
	rigidbody.velocity.x=speed*direction;
}

function Start()
{
	tag = "Projectile";
	if(transform.eulerAngles.y==0 || transform.eulerAngles.y==90)
	{
		direction=1;
	}
	else
	{
		direction=-1;
	}
	yield WaitForSeconds(lifespan);
	Destroy(gameObject);
}