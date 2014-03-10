#pragma strict
var power : float = 20;
var only_from_top : boolean = true; // if true, only if the player jumps on the pad it will work

private var not_on_top : boolean = false;
function OnCollisionEnter(collisionInfo : Collision)
{
	if(collisionInfo.transform.tag=="Player" || collisionInfo.transform.tag=="Enemy")
	{
		if(only_from_top)
		{
			not_on_top = true;
			    for (var contact : ContactPoint in collisionInfo.contacts) 
				{
					if(contact.normal.y-1 && contact.normal.y<-0.9)
					{
						not_on_top=false;
					}
				}
				if(not_on_top)return;
		}
		if(collisionInfo.transform.tag=="Enemy")
		{	
			collisionInfo.rigidbody.velocity.y=power;
			return;
		}
		var jump_component : PlayerJumping = collisionInfo.transform.GetComponent(PlayerJumping) as PlayerJumping;
		jump_component.playerMovement.current_mode=playerStates.Jumping;
		if(jump_component.jumped==0 && jump_component.playerMovement.current_mode!=playerStates.Falling)
			jump_component.jumped++;
		else
			jump_component.jumped=2;
		collisionInfo.transform.rigidbody.velocity.y=power;
		jump_component.playerMovement.play_animation(jump_component.animation_jump);
		
	}
}