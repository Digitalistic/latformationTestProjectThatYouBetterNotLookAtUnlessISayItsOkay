
var give_health : float = 50;
var kill_parent : boolean = true;
function OnTriggerEnter(collisionInfo : Collider)
{
    if(collisionInfo.transform.tag=="Player")
    {
    	if(collisionInfo.transform.GetComponent(PlayerHealth))
    	{
    		collisionInfo.transform.GetComponent(PlayerHealth).health+=give_health;
    	}
    	if(kill_parent)
    		Destroy(transform.parent.gameObject);
    	else
        	Destroy(gameObject);
    }
}
